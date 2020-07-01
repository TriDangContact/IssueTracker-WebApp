import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
	Col,
	Panel,
	Form,
	FormGroup,
	FormControl,
	ControlLabel,
	ButtonToolbar,
	Button,
	Alert
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import store from './store.js';
import withToast from './withToast.jsx';
import UserContext from './UserContext.js';

class IssueEdit extends React.Component {
	constructor() {
		super();
		// check to see if existing data exists in the global store
		const issue = store.initialData ? store.initialData.issue : null;
		// delete the data once we've consumed it
		delete store.initialData;
		this.state = {
			issue,
			invalidFields: {},
			showingValidation: false
		};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onValidityChange = this.onValidityChange.bind(this);
		this.showValidation = this.showValidation.bind(this);
		this.dismissValidation = this.dismissValidation.bind(this);
	}

	componentDidMount() {
		const { issue } = this.state;
		if (issue == null) this.loadData();
	}

	// standard checking to see if we need to re-render the page
	componentDidUpdate(prevProps) {
		const {
			match: {
				params: { id: prevId }
			}
		} = prevProps;
		const {
			match: {
				params: { id }
			}
		} = this.props;
		if (id !== prevId) {
			this.loadData();
		}
	}

	// common fetch function that can be used for browser or server rendering
	static async fetchData(match, search, showError) {
		const query = `query issue($id: Int!) {
            issue(id: $id) {
                id title status owner
                effort created due description
            }
		}`;

		const {
			params: { id }
		} = match;

		const ID = parseInt(id, 10);
		const vars = { id: ID };

		const result = await graphQLFetch(query, vars, showError);
		return result;
	}

	// programmatically set the state for whichever field was changed, using the spread "..." operator
	onChange(event, naturalValue) {
		// since we're using Specialized Inputs, check to see which one we should use
		const { name, value: textValue } = event.target;
		const value = naturalValue === undefined ? textValue : naturalValue;
		this.setState((prevState) => ({
			issue: { ...prevState.issue, [name]: value }
		}));
	}

	// if any of our inputs aren't valid, they will trigger this callback
	onValidityChange(event, valid) {
		const { name } = event.target;
		this.setState((prevState) => {
			const invalidFields = { ...prevState.invalidFields, [name]: !valid };
			if (valid) delete invalidFields[name];
			return { invalidFields };
		});
	}

	showValidation() {
		this.setState({ showingValidation: true });
	}

	dismissValidation() {
		this.setState({ showingValidation: false });
	}

	// gets triggered by form submit
	async handleSubmit(e) {
		e.preventDefault();
		this.showValidation();
		const { issue, invalidFields } = this.state;

		// quick checking to make sure there's no invalids
		if (Object.keys(invalidFields).length !== 0) return;

		const query = `mutation issueUpdate($id: Int!
            $changes: IssueUpdateInputs!) {
                issueUpdate(id: $id changes: $changes) {
                    id title status owner effort created due description
                }
            }`;

		// need to strip the fields that we're not supposed to update
		const { id, created, ...changes } = issue;

		// callbacks for ToastWrapper withToast.jsx
		const { showSuccess, showError } = this.props;
		const data = await graphQLFetch(query, { changes, id }, showError);
		if (data) {
			this.setState({ issue: data.issueUpdate });
			showSuccess('Updated issue successfully!');
		}
	}

	async loadData() {
		// retrieve the match object so we can get its param
		// and callbacks for ToastWrapper withToast.jsx
		const { match, showError } = this.props;

		const data = await IssueEdit.fetchData(match, null, showError);
		this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
	}

	render() {
		// pre-check since there's a possibility we didn't initialize it
		const { issue } = this.state;
		if (issue == null) return null;

		const {
			issue: { id }
		} = this.state;
		const {
			match: {
				params: { id: propsId }
			}
		} = this.props;

		// check to see if we were given a valid id, and that we fetched something, before we render entire thing
		// if we fetched a valid object, its id would've been set as state
		if (id == null) {
			// if the id was valid, it would've been passed in the url
			if (propsId != null) {
				return <h3>{`Issue with ID ${propsId} not found`}</h3>;
			}
			// otherwise, it's still fetching
			return <h3>Loading</h3>;
		}

		// if there are any invalid fields, we display a message to inform user
		const { invalidFields, showingValidation } = this.state;
		let validationMessage;
		if (Object.keys(invalidFields).length !== 0 && showingValidation) {
			validationMessage = (
				<Alert bsStyle="danger" onDismiss={this.dismissValidation}>
					Please correct invalid fields before submitting
				</Alert>
			);
		}

		const {
			issue: { title, status }
		} = this.state;
		const {
			issue: { owner, effort, description }
		} = this.state;
		const {
			issue: { created, due }
		} = this.state;

		const user = this.context;

		// render the entire form if we were able to fetch a valid object
		return (
			<Panel>
				<Panel.Heading>
					<Panel.Title>{`Editing issue: ${id}`}</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<Form horizontal onSubmit={this.handleSubmit}>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Created
							</Col>
							<Col sm={9}>
								<FormControl.Static>
									{created.toDateString()}
								</FormControl.Static>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Status
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass="select"
									name="status"
									value={status}
									onChange={this.onChange}
								>
									<option value="New">New</option>
									<option value="Assigned">Assigned</option>
									<option value="Fixed">Fixed</option>
									<option value="Closed">Closed</option>
								</FormControl>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Owner
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass={TextInput}
									name="owner"
									value={owner}
									onChange={this.onChange}
									key={id}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Effort
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass={NumInput}
									name="effort"
									value={effort}
									onChange={this.onChange}
									key={id}
								/>
							</Col>
						</FormGroup>
						<FormGroup validationState={invalidFields.due ? 'error' : null}>
							<Col componentClass={ControlLabel} sm={3}>
								Due
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass={DateInput}
									name="due"
									value={due}
									onChange={this.onChange}
									onValidityChange={this.onValidityChange}
									key={id}
								/>
								<FormControl.Feedback />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Title
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass={TextInput}
									size={50}
									name="title"
									value={title}
									onChange={this.onChange}
									key={id}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={3}>
								Description
							</Col>
							<Col sm={9}>
								<FormControl
									componentClass={TextInput}
									tag="textarea"
									rows={8}
									cols={50}
									name="description"
									value={description}
									onChange={this.onChange}
									key={id}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={3} sm={6}>
								<ButtonToolbar>
									<Button
										bsStyle="primary"
										type="submit"
										disabled={!user.signedIn}
									>
										Submit
									</Button>
									<LinkContainer to="/issues">
										<Button bsStyle="link">Back</Button>
									</LinkContainer>
								</ButtonToolbar>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={3} sm={9}>
								{validationMessage}
							</Col>
						</FormGroup>
					</Form>
				</Panel.Body>
				<Panel.Footer>
					<Link to={`/edit/${id - 1}`}>Prev</Link>
					{' | '}
					<Link to={`/edit/${id + 1}`}>Next</Link>
				</Panel.Footer>
			</Panel>
		);
	}
}

// specify the Context object, for use with Authorization feature
IssueEdit.contextType = UserContext;

// ToastWrapper hides the static fetchData() function, so we need to add a reference to it to our modified component
const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
export default IssueEditWithToast;
