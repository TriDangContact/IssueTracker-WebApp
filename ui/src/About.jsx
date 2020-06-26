import React from 'react';
import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

export default class About extends React.Component {
	constructor(props) {
		super(props);
		const apiAbout = store.initialData ? store.initialData.about : null;
		// clean the store once we've consumed the data, to prevent other components from incorrectly using it
		delete store.initialData;
		this.state = { apiAbout };
	}

	static async fetchData(match, search) {
		const data = await graphQLFetch('query {about}');
		return data;
	}

	async componentDidMount() {
		const { apiAbout } = this.state;
		if (apiAbout == null) {
			const data = await About.fetchData();
			this.setState({ apiAbout: data.about });
		}
	}

	render() {
		const { apiAbout } = this.state;
		return (
			<div className="text-center">
				<h3>Issue Tracker version 0.9</h3>
				<h4>{apiAbout}</h4>
			</div>
		);
	}
}
