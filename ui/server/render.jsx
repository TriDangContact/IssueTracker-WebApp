// FOR SERVER SIDE RENDERING

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

// need .default since we compiled using Babel
import Page from '../src/Page.jsx';
import template from './template.js';
import store from '../src/store.js';
import routes from '../src/routes.js';

// we convert a React component to markup and insert it into our template
async function render(req, res) {
	//we fetch our data during server or browser rendering and store it
	// we try to fetch component-specific data by matching URL to each Route's path
	const activeRoute = routes.find((route) => matchPath(req.path, route));

	let initialData;

	if (activeRoute && activeRoute.component.fetchData) {
		const match = matchPath(req.path, activeRoute);

		// get the search query from the URL for fetches that require them
		const index = req.url.indexOf('?');
		const search = index !== -1 ? req.url.substr(index) : null;

		initialData = await activeRoute.component.fetchData(match, search);
	}
	store.initialData = initialData;

	const context = {};

	const element = (
		<StaticRouter location={req.url} context={context}>
			<Page />
		</StaticRouter>
	);
	const body = ReactDOMServer.renderToString(element);

	if (context.url) {
		// handle the redirect if the Router matched the url
		res.redirect(301, context.url);
	} else {
		// we also pass our data into the template so it can use it during browser rendering part of hydrate()
		res.send(template(body, initialData));
	}
}

export default render;
