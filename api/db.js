const { MongoClient } = require('mongodb');
// need to create DB_URL variable with url for MongoDB in .env
const url = process.env.DB_URL;
let db;

// retrieves the current count+1 of the issues collection
async function getNextSequence(name) {
	const result = await db
		.collection('counters')
		.findOneAndUpdate(
			{ _id: name },
			{ $inc: { current: 1 } },
			{ returnOriginal: false }
		);
	return result.value.current;
}

//------------------ MONGODB CODE -----------------
async function connectToDb() {
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	await client.connect();
	console.log('Connected to MongoDB at', url);
	db = client.db();
}

function getDb() {
	return db;
}

module.exports = { getNextSequence, connectToDb, getDb };