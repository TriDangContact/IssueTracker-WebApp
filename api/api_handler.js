const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');
const auth = require('./auth.js');

const resolvers = {
	Query: {
		about: about.getMessage,
		issueList: issue.list,
		issue: issue.get,
		issueCounts: issue.counts
	},
	Mutation: {
		setAboutMessage: about.setMessage,
		issueAdd: issue.add,
		issueUpdate: issue.update,
		issueDelete: issue.delete,
		issueRestore: issue.restore
	},
	GraphQLDate
};

// retrieve user credentials for Authorization before serving GraphQL requests
function getContext({ req }) {
	const user = auth.getUser(req);
	return { user };
}

// initializing the GraphQL API
const server = new ApolloServer({
	// retrieve the schema file
	typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
	resolvers,
	context: getContext,
	formatError: (error) => {
		// allows us to do whatever we want with errors, on top of default actions
		console.log(error);
		return error;
	}
});

// // Cross origin Resource Sharing
// const enableCors = process.env.ENABLE_CORS || 'true' == 'true';
// console.log('CORS setting:', enableCors);
// server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

function installHandler(app) {
	// mount the proper middleware onto specified path
	server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler };
