import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
	Button,
	ButtonToolbar,
	FormGroup,
	FormControl,
	ControlLabel,
	InputGroup,
	Row,
	Col
} from 'react-bootstrap';

class IssueFilter extends React.Component {
	constructor({ location: { search } }) {
		super();
		const params = new URLSearchParams(search);
		this.state = {
			status: params.get('status') || '',
			effortMin: params.get('effortMin') || '',
			effortMax: params.get('effortMax') || '',
			changed: false
		};
		this.onChangeStatus = this.onChangeStatus.bind(this);
		this.applyFilter = this.applyFilter.bind(this);
		this.showOriginalFilter = this.showOriginalFilter.bind(this);
		this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
		this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
	}

	// making sure that the url and our currently selected filter matches
	componentDidUpdate(prevProps) {
		const {
			location: { search: prevSearch }
		} = prevProps;
		const {
			location: { search }
		} = this.props;
		if (prevSearch !== search) {
			this.showOriginalFilter();
		}
	}

	onChangeStatus(e) {
		this.setState({ status: e.target.value, changed: true });
	}

	onChangeEffortMin(e) {
		const effortString = e.target.value;
		if (effortString.match(/^\d*$/)) {
			this.setState({ effortMin: e.target.value, changed: true });
		}
	}

	onChangeEffortMax(e) {
		const effortString = e.target.value;
		if (effortString.match(/^\d*$/)) {
			this.setState({ effortMax: e.target.value, changed: true });
		}
	}

	// resetting the filter
	showOriginalFilter() {
		const {
			location: { search }
		} = this.props;
		const params = new URLSearchParams(search);
		this.setState({
			status: params.get('status') || '',
			effortMin: params.get('effortMin') || '',
			effortMax: params.get('effortMax') || '',
			changed: false
		});
	}

	//we actually push our query parameters to the URL route here
	applyFilter() {
		const { status, effortMin, effortMax } = this.state;
		const { history, urlBase } = this.props;

		const params = new URLSearchParams();
		if (status) params.set('status', status);
		if (effortMin) params.set('effortMin', effortMin);
		if (effortMax) params.set('effortMax', effortMax);

		// dynamically build our query parameters based on what parameters we have
		const search = params.toString() ? `?${params.toString()}` : '';
		history.push({ pathname: urlBase, search });
	}

	render() {
		//retrieve the query parameter
		const { status, effortMin, effortMax, changed } = this.state;
		return (
			<Row>
				<Col xs={6} sm={4} md={3} lg={2}>
					<FormGroup>
						<ControlLabel>Status:</ControlLabel>
						<FormControl
							componentClass="select"
							value={status}
							onChange={this.onChangeStatus}
						>
							<option value="">(All)</option>
							<option value="New">New</option>
							<option value="Assigned">Assigned</option>
							<option value="Fixed">Fixed</option>
							<option value="Closed">Closed</option>
						</FormControl>
					</FormGroup>
				</Col>
				<Col xs={6} sm={4} md={3} lg={2}>
					<FormGroup>
						<ControlLabel>Effort between:</ControlLabel>
						<InputGroup>
							<FormControl
								value={effortMin}
								onChange={this.onChangeEffortMin}
							/>
							<InputGroup.Addon>-</InputGroup.Addon>
							<FormControl
								value={effortMax}
								onChange={this.onChangeEffortMax}
							/>
						</InputGroup>
					</FormGroup>
				</Col>

				<Col xs={6} sm={4} md={3} lg={2}>
					{/* Wrapped ButtonToolbar in FormGroup to make it align properly with other forms */}
					<FormGroup>
						<ControlLabel>&nbsp;</ControlLabel>
						<ButtonToolbar>
							<Button
								bsStyle="primary"
								type="button"
								onClick={this.applyFilter}
							>
								Apply
							</Button>
							<Button
								type="button"
								onClick={this.showOriginalFilter}
								disabled={!changed}
							>
								Reset
							</Button>
						</ButtonToolbar>
					</FormGroup>
				</Col>
			</Row>
		);
	}
}

// need to wrap it with React Router in order to use React Router props
export default withRouter(IssueFilter);
