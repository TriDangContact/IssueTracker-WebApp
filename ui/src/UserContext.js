// using React Context to share global data to other components, instead of lifting up a state
// This Context is used to keep track of sign in status for Authorization feature

import React from 'react';

const UserContext = React.createContext({
	signedIn: false,
	givenName: ''
});

export default UserContext;
