// used for generic generating of Routes from URL paths

import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import IssueEdit from './IssueEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
	// optional parameter for IssueList
	{ path: '/issues/:id?', component: IssueList },
	{ path: '/edit/:id', component: IssueEdit },
	{ path: '/report', component: IssueReport },
	{ path: '/about', component: About },
	{ path: '*', component: NotFound }
];

export default routes;
