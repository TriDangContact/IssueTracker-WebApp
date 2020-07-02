// Authentication API

const Router = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const cors = require('cors');

// attempt to retrieve the secret key, or generate one in dev mode
let { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
	if (process.env.NODE_ENV !== 'production') {
		JWT_SECRET = 'tempjwtsecretfordevonly';
		console.log('Missing env var JWT_SECRET. Using unsafe dev secret');
	} else {
		console.log('Missing env var JWT_SECRET. Authentication disabled');
	}
}

const routes = new Router();

routes.use(bodyParser.json());

// configure CORS to allow requests from UI server and allow credentials/cookies
const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
routes.use(cors({ origin, credentials: true }));

// attempt to retrieve the user credentials after user signed in
function getUser(req) {
	const token = req.cookies.jwt;
	if (!token) return { signedIn: false };

	try {
		const credentials = jwt.verify(token, JWT_SECRET);
		return credentials;
	} catch (error) {
		return { signedIn: false };
	}
}

routes.post('/user', (req, res) => {
	res.send(getUser(req));
});

routes.post('/signin', async (req, res) => {
	// making sure that we have a secret key first
	if (!JWT_SECRET) {
		res.status(500).send('Missing JWT_SECRET. Refusing to authenticate');
	}

	// check that the token is passed in the request
	const googleToken = req.body.google_token;
	if (!googleToken) {
		res.status(400).send({ code: 400, message: 'Missing Google Auth Token' });
		return;
	}

	// try to verify the token
	const client = new OAuth2Client();
	let payload;
	try {
		const clientId = process.env.GOOGLE_CLIENT_ID || '';
		const ticket = await client.verifyIdToken({
			idToken: googleToken,
			audience: clientId
		});
		payload = ticket.getPayload();
	} catch (error) {
		res.status(403).send('Invalid credentials');
	}

	// retrieve the user credentials and send it as response
	const { given_name: givenName, name, email, picture } = payload;
	const credentials = {
		signedIn: true,
		givenName,
		name,
		email,
		picture
	};

	// generate jwt and store it in cookie
	const token = jwt.sign(credentials, JWT_SECRET);
	res.cookie('jwt', token, { httpOnly: true });

	res.json(credentials);
});

// clear the cookie from the browser
routes.post('/signout', async (req, res) => {
	res.clearCookie('jwt');
	res.json({ status: 'ok' });
});

// takes in a resolver, check for Authorization before serving request
function mustBeSignedIn(resolver) {
	return (root, args, { user }) => {
		if (!user || !user.signedIn) {
			throw new AuthenticationError(' You must be signed in');
		}
		return resolver(root, args, { user });
	};
}
module.exports = { routes, getUser, mustBeSignedIn };
