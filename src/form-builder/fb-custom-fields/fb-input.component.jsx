import React from 'react';

const FBInput = ({
	name,
	type,
	label,
	fieldValue,
	onChange,
	...htmlAttribs
}) => {
	const createLabel = fieldName => {
		if (label) return label;
		return fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ':';
	};

	switch (type) {
		case 'textarea':
			return (
				<>
					<label>{createLabel(name)}</label>
					<textarea
						name={name}
						value={fieldValue ? fieldValue : ''}
						onChange={onChange}
						{...htmlAttribs}
					/>
				</>
			);
		case 'checkbox':
			return (
				<>
					<label>{createLabel(name)}</label>
					<input
						type='checkbox'
						name={name}
						value={name}
						checked={fieldValue ? fieldValue : false}
						onChange={onChange}
						{...htmlAttribs}
					/>
				</>
			);
		default:
			return (
				<>
					<label>{createLabel(name)}</label>
					<input
						type='text'
						name={name}
						value={fieldValue ? fieldValue : ''}
						onChange={onChange}
						{...htmlAttribs}
					/>
				</>
			);
	}
};

FBInput.defaultProps = {
	type: 'text',
	label: null,
};

export default FBInput;
