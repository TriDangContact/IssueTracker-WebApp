require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
const auth = require('./auth.js');

const app = express();

// For use with JWT to persist session data
app.use(cookieParser());

// for Authentication API
app.use('/auth', auth.routes);

// bind the Apollo GraphQL server to the app
installHandler(app);

// need to create API_SERVER_PORT variable with port number in .env
const port = process.env.API_SERVER_PORT || 3000;
// initialize the db before starting the express server, making sure that we wait for connection first
(async function start() {
	try {
		await connectToDb();
		app.listen(port, () => {
			console.log(`API server started on port ${port}`);
		});
	} catch (err) {
		console.log('ERROR:', err);
	}
})();
