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

// create a simple navbar that links to our routes
function NavBar() {
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
					<SignInNavItem />
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

export default function Page() {
	return (
		<div>
			<NavBar />
			<Grid fluid>
				<Contents />
			</Grid>
			<hr />
			<Footer />
		</div>
	);
}
