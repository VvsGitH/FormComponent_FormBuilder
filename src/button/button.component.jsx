import React from 'react';

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

export default React.memo(Button);
