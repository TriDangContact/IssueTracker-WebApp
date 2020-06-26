import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import IssueTable from './IssueTable.jsx';
import IssueFilter from './IssueFilter.jsx';
import IssueDetail from './IssueDetail.jsx';
import store from './store.js';
import withToast from './withToast.jsx';
import PageLink from './PageLink.jsx';

// for Pagination
const SECTION_SIZE = 5;

class IssueList extends React.Component {
	constructor() {
		super();
		// try to retrieve any available data first
		const initialData = store.initialData || { issueList: {} };
		const {
			issueList: { issues, pages },
			issue: selectedIssue
		} = initialData;
		delete store.initialData;
		this.state = {
			issues,
			selectedIssue,
			pages
		};
		this.closeIssue = this.closeIssue.bind(this);
		this.deleteIssue = this.deleteIssue.bind(this);
	}

	componentDidMount() {
		// load the data if we don't have it yet
		const { issues } = this.state;
		if (issues == null) this.loadData();
	}

	componentDidUpdate(prevProps) {
		// making sure to fetch the data again if there is a change in the query params
		const {
			location: { search: prevSearch },
			match: {
				params: { id: prevId }
			}
		} = prevProps;
		const {
			location: { search },
			match: {
				params: { id }
			}
		} = this.props;
		if (prevSearch !== search || prevId !== id) {
			this.loadData();
		}
	}

	static async fetchData(match, search, showError) {
		// parse and check if there are any query parameters
		const params = new URLSearchParams(search);

		// variables for IssueDetail, hasSelection and selectedId are required so we need to initialize default values
		const vars = { hasSelection: false, selectedId: 0 };
		const {
			params: { id }
		} = match;
		const idInt = parseInt(id, 10);
		if (!Number.isNaN(idInt)) {
			vars.hasSelection = true;
			vars.selectedId = idInt;
		}

		// variables for IssueFilter
		if (params.get('status')) vars.status = params.get('status');
		const effortMin = parseInt(params.get('effortMin'), 10);
		if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
		const effortMax = parseInt(params.get('effortMax'), 10);
		if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

		// variables for Pagination
		let page = parseInt(params.get('page'), 10);
		if (Number.isNaN(page)) page = 1;
		vars.page = page;

		// use a second named operation for the query, in case the ID query parameter was passed
		const query = `query issueList(
			$status: StatusType
			$effortMin: Int
			$effortMax: Int
			$hasSelection: Boolean!
			$selectedId: Int!
			$page: Int
			) {
				issueList (
					status: $status
					effortMin: $effortMin
					effortMax: $effortMax
					page: $page
				) { 
					issues {
						id title status owner
						created effort due
					}
					pages
				}
				issue(id: $selectedId) @include (if: $hasSelection) {
					id description
				}
		}`;

		const data = await graphQLFetch(query, vars, showError);
		return data;
	}

	async loadData() {
		const {
			location: { search },
			match,
			showError
		} = this.props;

		const data = await IssueList.fetchData(match, search, showError);
		if (data) {
			this.setState({
				issues: data.issueList.issues,
				selectedIssue: data.issue,
				pages: data.issueList.pages
			});
		}
	}

	// async createIssue(issue) {
	// 	const query = `mutation issueAdd($issue: IssueInputs!) {
	//   		issueAdd(issue: $issue) {
	//     		id
	//   		}
	// 	}`;

	// 	// if adding issue was successful, then refresh data
	// 	const data = await graphQLFetch(query, { issue }, this.showError);
	// 	if (data) {
	// 		this.loadData();
	// 	}
	// }

	// gets triggered by an IssueRow button
	async closeIssue(index) {
		const query = `mutation issueClose($id: Int!) {
            issueUpdate(id: $id, changes: { status: Closed }) {
                id title status owner effort created due description
            }
        }`;
		const { issues } = this.state;

		// callbacks for ToastWrapper withToast.jsx
		const { showError } = this.props;
		const data = await graphQLFetch(query, { id: issues[index].id }, showError);
		if (data) {
			// creating a new list and replacing the old item with our new one
			this.setState((prevState) => {
				const newList = [...prevState.issues];
				newList[index] = data.issueUpdate;
				return { issues: newList };
			});
		} else {
			this.loadData();
		}
	}

	async deleteIssue(index) {
		const query = `mutation issueDelete($id: Int!) {
			issueDelete(id: $id)
		  }`;
		const { issues } = this.state;

		const {
			location: { pathname, search },
			history,
			showError,
			showSuccess
		} = this.props;
		const { id } = issues[index];

		const data = await graphQLFetch(query, { id }, showError);
		if (data && data.issueDelete) {
			this.setState((prevState) => {
				const newList = [...prevState.issues];
				// if the user is deleting the selected item, we redirect them back to an unselected view
				if (pathname === `/issues/${id}`) {
					history.push({ pathname: '/issues', search });
				}
				newList.splice(index, 1);
				return { issues: newList };
			});

			// we provide user an opportunity to undo the delete
			const undoMessage = (
				<span>
					{`Deleted Issue ${id} successfully. `}
					<Button bsStyle="link" onClick={() => this.restoreIssue(id)}>
						UNDO
					</Button>
				</span>
			);
			showSuccess(undoMessage);
		} else {
			//if api call fails, we reload
			this.loadData();
		}
	}

	async restoreIssue(id) {
		const query = `mutation issueRestore($id: Int!) {
			issueRestore(id: $id)
		}`;
		const { showSuccess, showError } = this.props;
		const data = await graphQLFetch(query, { id }, showError);
		if (data) {
			showSuccess(`Issue ${id} restored successfully.`);
			this.loadData();
		}
	}

	render() {
		// precheck to ensure we have the data
		const { issues } = this.state;
		if (issues == null) return null;

		// using SSR, if a row was selected, this value will exist and the IssueDetail component will render
		const { selectedIssue } = this.state;
		const { match } = this.props;

		const {
			location: { search }
		} = this.props;
		const params = new URLSearchParams(search);

		// START OF PAGINATION CALCULATIONS
		const { pages } = this.state;

		// grab the current page, or set it to 1 if it's invalid
		let page = parseInt(params.get('page'), 10);
		if (Number.isNaN(page)) page = 1;

		// Calculate start and end page
		// sliding window approach, with SECTION_SIZE being the window size
		const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
		const endPage = startPage + SECTION_SIZE - 1;

		// Calculate previous and next pages
		const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
		const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

		// create our sliding window of Pagination links
		const items = [];
		for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
			params.set('page', i);
			items.push(
				<PageLink key={i} params={params} activePage={page} page={i}>
					<Pagination.Item>{i}</Pagination.Item>
				</PageLink>
			);
		}
		// END OF PAGINATION CALCULATIONS

		return (
			<React.Fragment>
				<Panel>
					<Panel.Heading>
						<Panel.Title toggle>Filter</Panel.Title>
					</Panel.Heading>
					<Panel.Body collapsible>
						<IssueFilter urlBase="/issues" />
					</Panel.Body>
				</Panel>
				<hr />
				<IssueTable
					issues={this.state.issues}
					closeIssue={this.closeIssue}
					deleteIssue={this.deleteIssue}
				/>
				{/* <IssueAdd createIssue={this.createIssue} /> */}
				{/* <Route path={`${match.path}/:id`} component={IssueDetail} /> */}
				<IssueDetail issue={selectedIssue} />
				<Pagination>
					<PageLink params={params} page={prevSection}>
						<Pagination.Item>{'<'}</Pagination.Item>
					</PageLink>
					{items}
					<PageLink params={params} page={nextSection}>
						<Pagination.Item>{'>'}</Pagination.Item>
					</PageLink>
				</Pagination>
			</React.Fragment>
		);
	}
}

// ToastWrapper hides the static fetchData() function, so we need to add a reference to it to our modified component
const IssueListWithToast = withToast(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;
export default IssueListWithToast;
