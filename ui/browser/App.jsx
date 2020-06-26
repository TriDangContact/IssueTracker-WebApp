import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Page from '../src/Page.jsx';

// used to initialize data after SSR
import store from '../src/store.js';
store.initialData = window.__INITIAL_DATA__;

const element = (
	<Router>
		<Page />
	</Router>
);

// changed render() to hydrate() for Server-side
ReactDOM.hydrate(element, document.getElementById('contents'));

// unconditionally accepts all changes if Hot Module Replacement is used
if (module.hot) {
	module.hot.accept();
}
