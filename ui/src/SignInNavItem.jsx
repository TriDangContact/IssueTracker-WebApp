import React from 'react';
import {
	NavItem,
	Modal,
	Button,
	NavDropdown,
	MenuItem,
	Image,
	Glyphicon
} from 'react-bootstrap';

import withToast from './withToast.jsx';
import UserContext from './UserContext.js';

class SignInNavItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showing: false,
			disabledGoogleAuth: true
		};
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.signOut = this.signOut.bind(this);
		this.signIn = this.signIn.bind(this);
	}

	async componentDidMount() {
		// load the Google API Library
		const clientId = window.ENV.GOOGLE_CLIENT_ID;
		if (!clientId) return;
		window.gapi.load('auth2', () => {
			if (!window.gapi.auth2.getAuthInstance()) {
				window.gapi.auth2.init({ client_id: clientId }).then(() => {
					this.setState({ disabledGoogleAuth: false });
				});
			}
		});
		await this.loadData();
	}

	showModal() {
		// initial attempt to retrieve the Google Client ID
		const clientId = window.ENV.GOOGLE_CLIENT_ID;
		const { showError } = this.props;
		if (!clientId) {
			showError('Missing environment variable GOOGLE_CLIENT_ID');
			return;
		}
		this.setState({ showing: true });
	}

	hideModal() {
		this.setState({ showing: false });
	}

	async signOut() {
		const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
		const { showError } = this.props;
		try {
			// API call to clear cookie on the back-end server
			await fetch(`${apiEndpoint}/signout`, {
				method: 'POST',
				credentials: 'include'
			});
			// sign out of the Google Authentication session
			const auth2 = window.gapi.auth2.getAuthInstance();
			await auth2.signOut();

			// call back from Page.jsx, so that it can update its state and context value, and re-renders the page
			const { onUserChange } = this.props;
			onUserChange({ signedIn: false, givenName: '' });
		} catch (error) {
			showError(`Error signing out: ${error}`);
		}
	}

	async signIn() {
		this.hideModal();
		const { showError } = this.props;
		let googleToken;
		// we use Google API's Authentication library to retrieve the token
		try {
			const auth2 = window.gapi.auth2.getAuthInstance();
			const googleUser = await auth2.signIn();
			googleToken = googleUser.getAuthResponse().id_token;
		} catch (error) {
			showError(`Error authenticating with Google: ${error.error}`);
		}

		// send the token to our back-end Authentication API so that it can be verified
		try {
			const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
			const response = await fetch(`${apiEndpoint}/signin`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ google_token: googleToken })
			});
			const body = await response.text();
			const result = JSON.parse(body);
			const { signedIn, givenName, picture } = result;

			// call back from Page.jsx, so that it can update its state and context value, and re-renders the page
			const { onUserChange } = this.props;
			onUserChange({ signedIn, givenName });
		} catch (error) {
			showError(`Error signing into the app: ${error}`);
		}
	}

	// called on browser refresh to retrieve credentials from back-end persistent session
	async loadData() {
		const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
		const response = await fetch(`${apiEndpoint}/user`, {
			method: 'POST'
		});
		const body = await response.text();
		const result = JSON.parse(body);
		const { signedIn, givenName, picture } = result;
		this.setState({ user: { signedIn, givenName, picture } });
	}

	render() {
		const { user } = this.props;
		// const picture = (
		// 	<Image src={user.picture} responsive circle id="profile_pic" />
		// );
		if (user.signedIn) {
			return (
				<NavDropdown title={user.givenName} id="user">
					<MenuItem onClick={this.signOut}>Sign Out</MenuItem>
				</NavDropdown>
			);
		}

		const { showing, disabledGoogleAuth } = this.state;
		return (
			<React.Fragment>
				<NavItem onClick={this.showModal}>Sign In</NavItem>
				<Modal keyboard show={showing} onHide={this.hideModal} bsSize="sm">
					<Modal.Header closeButton>
						<Modal.Title>Sign In</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Button
							block
							disabled={disabledGoogleAuth}
							bsStyle="primary"
							onClick={this.signIn}
						>
							<img
								src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
								alt="Sign in with Google"
							/>
						</Button>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="link" onClick={this.hideModal}>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>
			</React.Fragment>
		);
	}
}

export default withToast(SignInNavItem);
