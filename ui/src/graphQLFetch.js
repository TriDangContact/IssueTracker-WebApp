import fetch from 'isomorphic-fetch';
import dotenv from 'dotenv';
dotenv.config();

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
	if (dateRegex.test(value)) return new Date(value);
	return value;
}

// generic function that helps us handle errors from API calls
export default async function graphQLFetch(
	query,
	variables = {},
	showError = null
) {
	// check if we're calling in browser rendered or server rendered mode
	const apiEndpoint = __isBrowser__ // eslint-disable-line no-undef
		? window.ENV.UI_API_ENDPOINT
		: process.env.UI_SERVER_API_ENDPOINT;

	try {
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables })
		});
		const body = await response.text();
		const result = JSON.parse(body, jsonDateReviver);

		if (result.errors) {
			const error = result.errors[0];
			if (error.extensions.code == 'BAD_USER_INPUT') {
				const details = error.extensions.exception.errors.join('\n ');
				// alert(`${error.message}:\n ${details}`);
				if (showError) {
					showError(`${error.message}:\n${details}`);
				}
			} else if (showError) {
				showError(`${error.extensions.code}:${error.message}`);
				// alert(`${error.extensions.code}: ${error.message}`);
			}
		}
		return result.data;
	} catch (e) {
		if (showError) {
			showError(`Error in sending data to server: ${e.message}`);
			return null;
		}
		alert(`Error in sending data to server: ${e.message}`);
	}
}
