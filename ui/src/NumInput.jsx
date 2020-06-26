// Specialized Input Component for Forms
import React from 'react';

// convert numeric to string
function format(num) {
	return num != null ? num.toString() : '';
}

// convert string back to integer, or return null
function unformat(str) {
	const val = parseInt(str, 10);
	return Number.isNaN(val) ? null : val;
}

export default class NumInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: format(props.value) };
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	// check to see if the input value is a valid digit
	onChange(e) {
		if (e.target.value.match(/^\d*$/)) {
			this.setState({ value: e.target.value });
		}
	}

	// call the parent's onChange method when input loses focus
	onBlur(e) {
		const { onChange } = this.props;
		const { value } = this.state;
		// exporting the value as integer to the parent
		onChange(e, unformat(value));
	}

	render() {
		const { value } = this.state;
		return (
			<input
				type="text"
				// copy any other properties that the parent may have supplied
				{...this.props}
				value={value}
				onBlur={this.onBlur}
				onChange={this.onChange}
			/>
		);
	}
}
