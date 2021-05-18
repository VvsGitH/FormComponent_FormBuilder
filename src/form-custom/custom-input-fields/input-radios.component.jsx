import React from 'react';
import PropTypes from 'prop-types';

import './input-radios.style.scss';

// Il tipo radio è usato per selezionare una tra varie opzioni.
// Tali opzioni devono essere contenute nel campo options dei props
//  e generano un pulsante radio ciascuna. Il campo value di un
//  radio contiene il nome dell'opzione che rappresenta.
// A ciascun pulsante è dunque affiancato un label che contiene
//  il nome dell'opzione di quel pulsante, con la lettera maiuscola.
// I pulsanti e i loro label sono raggruppati all'interno di un div.

const InputRadios = ({
	fieldValue,
	onChange,
	options,
	id,
	name,
	type,
	required,
	...htmlProps
}) => (
	<div id={id} className='radio-container'>
		{options.map(option => (
			<React.Fragment key={`${name}-${option}`}>
				<label htmlFor={`${name}-${option}`}>
					{option.charAt(0).toUpperCase() + option.slice(1) + ':'}
				</label>
				<input
					type='radio'
					name={name}
					id={`${name}-${option}`}
					value={option}
					checked={fieldValue === option}
					onChange={onChange}
					required={required}
					{...htmlProps}
				/>
			</React.Fragment>
		))}
	</div>
);

InputRadios.propTypes = {
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,

	fieldValue: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,

	options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InputRadios;
