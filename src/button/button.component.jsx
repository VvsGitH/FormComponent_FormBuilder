import React from 'react';
import PropTypes from 'prop-types';

// I pulsanti di tipo 'button' devono includere una funzione onClick custom.
// I pulsanti di tipo 'submit' e 'reset' non richiedono una funzione onClick
//  in quanto triggerano in automatico i rispettivi eventi nel form.

const Button = ({ id, type, value, onClick }) => {
	return (
		<input
			className='inp-btn'
			id={id}
			type={type}
			value={value}
			onClick={type === 'button' ? onClick : null}
		/>
	);
};

Button.propTypes = {
	// Tipo, id del pulsante html che deve essere generato
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,

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

export default React.memo(Button);
