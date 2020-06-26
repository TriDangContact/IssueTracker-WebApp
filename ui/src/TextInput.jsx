import React from 'react';

function format(text) {
	return text != null ? text : '';
}

function unformat(text) {
	return text.trim().length === 0 ? null : text;
}

export default class TextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: format(props.value) };
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.setState({ value: e.target.value });
	}

	// call the parent callback and pass back the Natural Data type
	onBlur(e) {
		const { onChange } = this.props;
		const { value } = this.state;
		onChange(e, unformat(value));
	}

	render() {
		const { value } = this.state;
		// get the desired input element (or default to input if not passed), and any other passed in props
		const { tag = 'input', ...props } = this.props;
		// programmatically create the input component
		return React.createElement(tag, {
			...props,
			value,
			onBlur: this.onBlur,
			onChange: this.onChange
		});
	}
}
