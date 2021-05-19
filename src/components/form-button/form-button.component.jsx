import React from 'react';
import PropTypes from 'prop-types';
import './form-button.style.scss';

// I pulsanti di tipo 'button' devono includere una funzione onClick custom.
// I pulsanti di tipo 'submit' e 'reset' non richiedono una funzione onClick
//  in quanto triggerano in automatico i rispettivi eventi nel form.

const FormButton = ({ id, type, value, onClick }) => {
	return (
		<button
			className='form-btn'
			type={type}
			id={id}
			onClick={type === 'button' ? onClick : null}>
			{value}
		</button>
	);
};

FormButton.propTypes = {
	// Tipo, id del pulsante html che deve essere generato
	id: PropTypes.string.isRequired,
	type: PropTypes.string, // default: button

	// Stringa da far apparire sul pulsante
	value: PropTypes.string.isRequired,

	// Callback richiesta solo per i pulsanti di tipo button
	// Specifica l'azione custom che svolgono questi pulsanti
	onClick: (props, propName, componentName) => {
		if (props.type === 'button') {
			if (!(props[propName] instanceof Function)) {
				return new Error(
					`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
				);
			}
		}
	},
};

FormButton.defaultProps = {
	type: 'button',
};

export default React.memo(FormButton);
