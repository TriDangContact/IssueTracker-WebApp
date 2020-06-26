import React from 'react';

export default function IssueDetail({ issue }) {
	if (issue) {
		return (
			<div>
				<h3>Description</h3>
				<pre>{issue.description}</pre>
			</div>
		);
	}
	return null;
}

// code for pre-SSR changes

// import graphQLFetch from './graphQLFetch.js';
// import Toast from './Toast.jsx';

// export default class IssueDetail extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			issue: {},
// 			toastVisible: false,
// 			toastMessage: '',
// 			toastType: 'info'
// 		};
// 		this.showError = this.showError.bind(this);
// 		this.dismissToast = this.dismissToast.bind(this);
// 	}

// 	componentDidMount() {
// 		this.loadData();
// 	}

// 	componentDidUpdate(prevProps) {
// 		//checking if we need to load our data again, also prevents infinite looping
// 		const {
// 			match: {
// 				params: { id: prevId }
// 			}
// 		} = prevProps;
// 		const {
// 			match: {
// 				params: { id }
// 			}
// 		} = this.props;
// 		if (prevId !== id) {
// 			this.loadData();
// 		}
// 	}

// 	showError(message) {
// 		this.setState({
// 			toastVisible: true,
// 			toastMessage: message,
// 			toastType: 'danger'
// 		});
// 	}

// 	dismissToast() {
// 		this.setState({
// 			toastVisible: false
// 		});
// 	}

// 	async loadData() {
// 		// retrieve the passed in param
// 		const {
// 			match: {
// 				params: { id }
// 			}
// 		} = this.props;

// 		// fetch the item using the param
// 		const query = `query issue($id: Int!) {
//             issue (id: $id) {
//                 id description
//             }
//         }`;
// 		// need to convert the id from string to int
// 		const ID = parseInt(id);
// 		const vars = {
// 			id: ID
// 		};
// 		const data = await graphQLFetch(query, vars, this.showError);
// 		if (data) {
// 			this.setState({ issue: data.issue });
// 		} else {
// 			this.setState({ issue: {} });
// 		}
// 	}

// 	render() {
// 		const {
// 			issue: { description }
// 		} = this.state;

// 		const { toastVisible, toastMessage, toastType } = this.state;

// 		return (
// 			<div>
// 				<h3>Description</h3>
// 				<pre>{description}</pre>
// 				<Toast
// 					showing={toastVisible}
// 					onDismiss={this.dismissToast}
// 					bsStyle={toastType}
// 				>
// 					{toastMessage}
// 				</Toast>
// 			</div>
// 		);
// 	}
// }
