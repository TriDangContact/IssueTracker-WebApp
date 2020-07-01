const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

const PAGE_SIZE = 10;

// resolver functions
async function get(_, { id }) {
	const db = getDb();
	const issue = await db.collection('issues').findOne({ id });
	return issue;
}

async function list(_, { status, effortMin, effortMax, search, page }) {
	const db = getDb();
	const filter = {};
	// add a filter based on status, if it was passed in
	if (status) filter.status = status;

	// add a filter based on min/max effort, if it was passed in
	if (effortMin !== undefined || effortMax !== undefined) {
		filter.effort = {};
		if (effortMin !== undefined) {
			filter.effort.$gte = effortMin;
		}
		if (effortMax !== undefined) {
			filter.effort.$lte = effortMax;
		}
	}

	// Use the Text Index to search for an issue based on search string
	if (search) filter.$text = { $search: search };

	// return only the items for the current specified page
	const cursor = db
		.collection('issues')
		.find(filter)
		.sort({ id: 1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE);

	// we perform our main query during the counting of items
	const totalCount = await cursor.count(false);
	const issues = cursor.toArray();
	const pages = Math.ceil(totalCount / PAGE_SIZE);
	return { issues, pages };
}

async function add(_, { issue }) {
	const db = getDb();
	validate(issue);
	const newIssue = Object.assign({}, issue);
	newIssue.created = new Date();
	if (newIssue.effort == undefined) {
		newIssue.effort = 0;
	}
	newIssue.id = await getNextSequence('issues');
	const result = await db.collection('issues').insertOne(newIssue);
	const savedIssue = await db
		.collection('issues')
		.findOne({ _id: result.insertedId });

	return savedIssue;
}

async function update(_, { id, changes }) {
	const db = getDb();
	// we validate the inputs by merging with our existing document and check the entire thing
	if (changes.title || changes.status || changes.owner) {
		const issue = await db.collection('issues').findOne({ id });
		Object.assign(issue, changes);
		validate(issue);
	}
	// if valid, we make the update and return it
	await db.collection('issues').updateOne({ id }, { $set: changes });
	const savedIssue = await db.collection('issues').findOne({ id });
	return savedIssue;
}

async function remove(_, { id }) {
	const db = getDb();
	const issue = await db.collection('issues').findOne({ id });
	// check if it exists in db
	if (!issue) return false;

	//[OPTIONAL] we implement a recycling bin so we have a chance to recover the deleted item later
	issue.deleted = new Date();
	let result = await db.collection('deleted_issues').insertOne(issue);
	// if storage was successful, we delete the actual document
	if (result.insertedId) {
		result = await db.collection('issues').removeOne({ id });
		return result.deletedCount === 1;
	}
	return false;
}

// reverse of delete
async function restore(_, { id }) {
	const db = getDb();
	const issue = await db.collection('deleted_issues').findOne({ id });
	if (!issue) return false;

	issue.deleted = new Date();
	let result = await db.collection('issues').insertOne(issue);
	if (result.insertedId) {
		result = await db.collection('deleted_issues').removeOne({ id });
		return result.deletedCount === 1;
	}
	return false;
}

async function counts(_, { status, effortMin, effortMax }) {
	const db = getDb();

	// build the filter for the db query
	const filter = {};
	if (status) filter.status = status;
	if (effortMin !== undefined || effortMax !== undefined) {
		filter.effort = {};
		if (effortMin !== undefined) filter.effort.$gte = effortMin;
		if (effortMax !== undefined) filter.effort.$lte = effortMax;
	}

	const results = await db
		.collection('issues')
		.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: { owner: '$owner', status: '$status' },
					count: { $sum: 1 }
				}
			}
		])
		.toArray();

	const stats = {};
	// retrieve the owner and the individual statuses, and put the counts according to each owner's various status
	results.forEach((result) => {
		const { owner, status: statusKey } = result._id;
		if (!stats[owner]) stats[owner] = { owner };
		stats[owner][statusKey] = result.count;
	});
	return Object.values(stats);
}

// helper functions
function validate(issue) {
	const errors = [];
	if (issue.title.length < 3) {
		errors.push('Field "title" must be at least 3 characters long.');
	}
	if (issue.status === 'Assigned' && !issue.owner) {
		errors.push('Field "owner" is required when status is "Assigned"');
	}
	if (errors.length > 0) {
		throw new UserInputError('Invalid input(s)', { errors });
	}
}

module.exports = {
	list,
	add: mustBeSignedIn(add),
	get,
	update: mustBeSignedIn(update),
	delete: mustBeSignedIn(remove),
	counts,
	restore: mustBeSignedIn(restore)
};
