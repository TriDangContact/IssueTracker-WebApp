import React from 'react';
import {
	Navbar,
	Nav,
	NavItem,
	NavDropdown,
	MenuItem,
	Glyphicon,
	Grid,
	Col
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import Search from './Search.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import UserContext from './UserContext.js';
import render from '../server/render.jsx';

// create a simple navbar that links to our routes
function NavBar({ onUserChange }) {
	return (
		<Navbar fluid collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>Issue Tracker</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					<LinkContainer exact to="/">
						<NavItem>Home</NavItem>
					</LinkContainer>
					<LinkContainer to="/issues">
						<NavItem>Issue List</NavItem>
					</LinkContainer>
					<LinkContainer to="/report">
						<NavItem>Report</NavItem>
					</LinkContainer>
				</Nav>

				<Col sm={5}>
					<Navbar.Form>
						<Search />
					</Navbar.Form>
				</Col>

				<Nav pullRight>
					<IssueAddNavItem />
					<SignInNavItem onUserChange={onUserChange} />
					<NavDropdown
						id="user-dropdown"
						title={<Glyphicon glyph="option-vertical" />}
						noCaret
					>
						<LinkContainer to="/about">
							<MenuItem>About</MenuItem>
						</LinkContainer>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

function Footer() {
	return (
		<small>
			<p className="text-center">
				Full source code available at this{' '}
				<a href="https://github.com/vasansr/pro-mern-stack-2">
					GitHub repository
				</a>
			</p>
		</small>
	);
}

export default class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { user: { signedIn: false, givenName: '' } };
		this.onUserChange = this.onUserChange.bind(this);
	}

	async componentDidMount() {
		const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
		const response = await fetch(`${apiEndpoint}/user`, {
			method: 'POST'
		});
		const body = await response.text();
		const result = JSON.parse(body);
		const { signedIn, givenName } = result;
		this.setState({ user: { signedIn, givenName } });
	}

	onUserChange(user) {
		this.setState({ user });
	}

	render() {
		const { user } = this.state;
		return (
			<div>
				<NavBar onUserChange={this.onUserChange} />
				<Grid fluid>
					<UserContext.Provider value={user}>
						<Contents />
					</UserContext.Provider>
				</Grid>
				<hr />
				<Footer />
			</div>
		);
	}
}
