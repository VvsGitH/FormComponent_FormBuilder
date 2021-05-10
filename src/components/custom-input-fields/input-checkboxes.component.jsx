import React from 'react';
import PropTypes from 'prop-types';

import './input-checkboxes.style.scss';

// Il tipo checkbox è un campo booleano controllato dall'attributo
// checked e non da value.
// Richiede anche un secondo label affiancato.

const InputCheckboxes = ({ fieldValue, onChange, options, name, id }) => {
	const handleChange = indx => {
		const currentValues = [...fieldValue];
		currentValues[indx] = !currentValues[indx];

		const customEvent = { target: { name, value: currentValues } };
		onChange(customEvent);
	};

	return (
		<div id={id} name={name} className='checkbox-container'>
			{options.map((option, indx) => (
				<React.Fragment key={name + indx}>
					<label htmlFor={name + indx}>{option.label}</label>
					<input
						type='checkbox'
						name={name}
						id={name + indx}
						checked={fieldValue[indx]}
						onChange={() => handleChange(indx)}
						required={option.required}
					/>
				</React.Fragment>
			))}
		</div>
	);
};

InputCheckboxes.propTypes = {
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,

	fieldValue: PropTypes.arrayOf(PropTypes.bool).isRequired,
	onChange: PropTypes.func.isRequired,

	options: PropTypes.PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			required: PropTypes.bool,
		})
	).isRequired,
};

export default InputCheckboxes;
