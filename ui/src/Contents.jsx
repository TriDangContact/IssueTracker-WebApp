import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import routes from './routes.js';

export default function Contents() {
	return (
		<Switch>
			<Redirect exact from="/" to="/issues" />
			{/* <Route path="/issues" component={IssueList} />
			<Route path="/edit/:id" component={IssueEdit} />
			<Route path="/report" component={IssueReport} />
			<Route path="/about" component={About} />
			<Route component={NotFound} /> */}
			{/* Using routes map for Generating the routes */}
			{routes.map((attrs) => (
				<Route {...attrs} key={attrs.path} />
			))}
		</Switch>
	);
}
