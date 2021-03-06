import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Button,
	Glyphicon,
	Tooltip,
	OverlayTrigger,
	Table
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

// wrapping in React Router component so we can access Router props
class IssueRowPlain extends React.Component {
	render() {
		const {
			issue,
			location: { search },
			closeIssue,
			deleteIssue,
			index
		} = this.props;

		// for use with Authorization feature
		const user = this.context;
		const disabled = !user.signedIn;

		// appending the id to the path
		const selectLocation = { pathname: `/issues/${issue.id}`, search };
		const editTooltip = (
			<Tooltip id="close-tooltip" placement="top">
				Edit Issue
			</Tooltip>
		);
		const closeTooltip = (
			<Tooltip id="close-tooltip" placement="top">
				Close Issue
			</Tooltip>
		);
		const deleteTooltip = (
			<Tooltip id="delete-tooltip" placement="top">
				Delete Issue
			</Tooltip>
		);

		// needed so that the row isn't selected when we click the buttons in the row
		function onClose(e) {
			e.preventDefault();
			closeIssue(index);
		}
		function onDelete(e) {
			e.preventDefault();
			deleteIssue(index);
		}

		const tableRow = (
			<tr>
				<td>{issue.id}</td>
				<td>{issue.status}</td>
				<td>{issue.owner}</td>
				<td>{issue.created.toDateString()}</td>
				<td>{issue.effort}</td>
				<td>{issue.due ? issue.due.toDateString() : ''}</td>
				<td>{issue.title}</td>
				<td>
					<LinkContainer to={`/edit/${issue.id}`}>
						<OverlayTrigger delayShow={1000} overlay={editTooltip}>
							<Button bsSize="xsmall">
								<Glyphicon glyph="edit" />
							</Button>
						</OverlayTrigger>
					</LinkContainer>{' '}
					<OverlayTrigger delayShow={1000} overlay={closeTooltip}>
						<Button bsSize="xsmall" onClick={onClose} disabled={disabled}>
							<Glyphicon glyph="remove" />
						</Button>
					</OverlayTrigger>{' '}
					<OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
						<Button bsSize="xsmall" onClick={onDelete} disabled={disabled}>
							<Glyphicon glyph="trash" />
						</Button>
					</OverlayTrigger>
				</td>
			</tr>
		);

		return <LinkContainer to={selectLocation}>{tableRow}</LinkContainer>;
	}
}

// specify the Context object, for use with Authorization feature
IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
// need to delete the wrapped component's contextType or it will cause error
delete IssueRow.contextType;

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
	//retrieve the parent's callback and pass it to the row component
	const issueRows = issues.map((issue, index) => (
		<IssueRow
			key={issue.id}
			issue={issue}
			closeIssue={closeIssue}
			deleteIssue={deleteIssue}
			index={index}
		/>
	));

	return (
		<Table className="bordered-table" bordered condensed hover responsive>
			<thead>
				<tr>
					<th>ID</th>
					<th>Status</th>
					<th>Owner</th>
					<th>Created</th>
					<th>Effort</th>
					<th>Due Date</th>
					<th>Title</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>{issueRows}</tbody>
		</Table>
	);
}
