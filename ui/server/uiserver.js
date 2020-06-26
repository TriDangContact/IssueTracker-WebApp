import dotenv from 'dotenv';
import express from 'express';
// import proxy from 'http-proxy-middleware';
import render from './render.jsx';

//source-map-support makes it convenient to add breakpoints, make error messages more readable
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

dotenv.config();
const app = express();

/* 
code for Hot Module Replacement
Webpack feature that changes modules in the browser while the app is still running, removing the need to refresh the browser whenever a change is made
Application state is retained, updating only the components that is changed
*/
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

// if HMR is enabled and we're in dev mode
if (enableHMR && process.env.NODE_ENV !== 'production') {
	console.log('Adding dev middleware, enabling HMR');

	const webpack = require('webpack');
	const devMiddleware = require('webpack-dev-middleware');
	const hotMiddleware = require('webpack-hot-middleware');

	// add a new entry point and plugin
	const config = require('../webpack.config.js')[0];
	config.entry.app.push('webpack-hot-middleware/client');
	config.plugins = config.plugins || [];
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	// mount the middleware to the app
	const compiler = webpack(config);
	app.use(devMiddleware(compiler));
	app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

// saving the API Endpoint in a global variable so it can be read by browser
// const UI_API_ENDPOINT =
// 	process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
// const env = { UI_API_ENDPOINT };
if (!process.env.UI_API_ENDPOINT) {
	process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}

if (!process.env.UI_SERVER_API_ENDPOINT) {
	process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}

// saving the env variable in a JS file so the browser can actually read from it
app.get('/env.js', function(req, res) {
	const env = { UI_API_ENDPOINT: process.env.UI_API_ENDPOINT };
	res.send(`window.ENV = ${JSON.stringify(env)}`);
});

// using Server-side Rendering
// app.get('/about', render);
// HMR modification, wrapper to ensure the latest render() is called
// return the SSR HTML template for every route
app.get('*', (req, res, next) => {
	render(req, res, next);
});

const port = process.env.UI_SERVER_PORT || 8000;

app.listen(port, function() {
	console.log(`UI started on port ${port}`);
});

// making sure we accept the HMR
if (module.hot) {
	module.hot.accept('./render.jsx');
}
