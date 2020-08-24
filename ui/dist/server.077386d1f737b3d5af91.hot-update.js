exports.id = "server";
exports.modules = {

/***/ "./src/SignInNavItem.jsx":
/*!*******************************!*\
  !*** ./src/SignInNavItem.jsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _UserContext_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UserContext.js */ "./src/UserContext.js");





class SignInNavItem extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
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
        window.gapi.auth2.init({
          client_id: clientId
        }).then(() => {
          this.setState({
            disabledGoogleAuth: false
          });
        });
      }
    });
    await this.loadData();
  }

  showModal() {
    // initial attempt to retrieve the Google Client ID
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const {
      showError
    } = this.props;

    if (!clientId) {
      showError('Missing environment variable GOOGLE_CLIENT_ID');
      return;
    }

    this.setState({
      showing: true
    });
  }

  hideModal() {
    this.setState({
      showing: false
    });
  }

  async signOut() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const {
      showError
    } = this.props;

    try {
      // API call to clear cookie on the back-end server
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include'
      }); // sign out of the Google Authentication session

      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut(); // call back from Page.jsx, so that it can update its state and context value, and re-renders the page

      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn: false,
        givenName: ''
      });
    } catch (error) {
      showError(`Error signing out: ${error}`);
    }
  }

  async signIn() {
    this.hideModal();
    const {
      showError
    } = this.props;
    let googleToken; // we use Google API's Authentication library to retrieve the token

    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError(`Error authenticating with Google: ${error.error}`);
    } // send the token to our back-end Authentication API so that it can be verified


    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_token: googleToken
        })
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const {
        signedIn,
        givenName,
        picture
      } = result; // call back from Page.jsx, so that it can update its state and context value, and re-renders the page

      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn,
        givenName
      });
    } catch (error) {
      showError(`Error signing into the app: ${error}`);
    }
  } // called on browser refresh to retrieve credentials from back-end persistent session


  async loadData() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST'
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const {
      signedIn,
      givenName,
      picture
    } = result;
    this.setState({
      user: {
        signedIn,
        givenName,
        picture
      }
    });
  }

  render() {
    const {
      user
    } = this.props; // const picture = (
    // 	<Image src={user.picture} responsive circle id="profile_pic" />
    // );

    if (user.signedIn) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavDropdown"], {
        title: user.givenName,
        id: "user"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["MenuItem"], {
        onClick: this.signOut
      }, "Sign Out"));
    }

    const {
      showing,
      disabledGoogleAuth
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], {
      onClick: this.showModal
    }, "Sign In"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"], {
      keyboard: true,
      show: showing,
      onHide: this.hideModal,
      bsSize: "sm"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Header, {
      closeButton: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Title, null, "Sign In")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Body, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      block: true,
      disabled: disabledGoogleAuth,
      bsStyle: "primary",
      onClick: this.signIn
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: "./ui/assets/btn_google_signin_dark_normal_web.png",
      alt: ""
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Footer, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      bsStyle: "link",
      onClick: this.hideModal
    }, "Cancel"))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_2__["default"])(SignInNavItem));

/***/ })

};
//# sourceMappingURL=server.077386d1f737b3d5af91.hot-update.js.map