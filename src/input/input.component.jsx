import React, { createRef } from 'react';
import PropTypes from 'prop-types';

import { maskValue, unMaskValue } from './input.utils';

class Input extends React.PureComponent {
	constructor(props) {
		super(props);

		this.fieldRef = createRef();
	}

	//
	// Renderizzo il campo di input in base al tipo contenuto nei props
	//

	renderField = (fieldValue, onChange, htmlProps) => {
		const { id, name, options, ...input } = htmlProps;

		switch (input.type) {
			// I tipi radio e checkbox comprendono varie opzioni e richiedono
			//  un trattamento particolare
			case 'radio':
			case 'checkbox':
				return (
					<div className='radio-check-container'>
						{options.map((option, indx) => (
							<React.Fragment key={indx}>
								<label htmlFor={`${name}-${option}`}>
									{option.charAt(0).toUpperCase() + option.slice(1) + ':'}
								</label>
								<input
									className='radio-check'
									name={name}
									id={`${name}-${option}`}
									value={option}
									checked={fieldValue === option}
									onChange={onChange}
									{...input}
								/>
							</React.Fragment>
						))}
					</div>
				);
			// Il tag select deve essere costruito con all'interno i suoi
			//  vari tag option
			case 'select':
				return (
					<select
						id={id}
						name={name}
						value={fieldValue}
						onChange={onChange}
						{...input}>
						{options.map((option, indx) => (
							<option key={indx} value={option}>
								{option}
							</option>
						))}
					</select>
				);
			// Il tipo textarea richiede un trattamento speciale in quanto non
			//  è un tag <input> ma un tag <textarea>
			case 'textarea':
				return (
					<textarea
						id={id}
						name={name}
						value={fieldValue}
						onChange={onChange}
						{...input}
					/>
				);
			default:
				// NOTA1: confirmPassword necessita di un ref per la validaz.
				// NOTA2: il tipo file è un componente incontrollato e
				//  necessita un campo value pari ad undefined
				return (
					<input
						id={id}
						name={name}
						value={input.type !== 'file' ? fieldValue : undefined}
						ref={this.fieldRef}
						onChange={event => onChange(event, this.fieldRef)}
						{...input}
					/>
				);
		}
	};

	//
	// Rimuovo la maschera prima di passare il contenuto del campo al
	//  componente padre.
	//

	handleMaskedField = (event, fieldRef = null) => {
		const value = event.target.value;

		// Pulisco il contenuto del campo, eliminando la maschera
		const unmasked = unMaskValue(value, this.props.mask);

		// Muto l'oggetto event, inserendo il valore senza maschera nel
		//  campo value. In questo modo il componente padre, aggiungerà nello
		//  stato l'input raw dell'utente.
		event.target.value = unmasked;
		this.props.onChange(event, fieldRef);
	};

	//
	// RENDERING DEL COMPONENTE
	//

	render() {
		const {
			label,
			errMsg,
			id,
			mask,
			fieldValue,
			onChange,
			...htmlProps
		} = this.props;

		// Aplico la maschera al valore inserito dall'utente prima di
		//  inserirlo nel campo.
		const masked = maskValue(fieldValue, mask);

		return (
			<section className='input-group' key={id}>
				{label && <label htmlFor={id}>{label}</label>}
				{mask
					? this.renderField(masked, this.handleMaskedField, htmlProps)
					: this.renderField(fieldValue, onChange, htmlProps)}
				{errMsg && <p className='err-msg'>{errMsg}</p>}
			</section>
		);
	}
}

Input.propTypes = {
	// Tipo, id e nome del tag html che deve essere generato
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,

	// Maschera da applicare all'input dell'utente
	// Il carattere # sarà sostituito con l'input utente
	mask: PropTypes.string,

	// Valore contenuto all'interno del campo. Deve corrispondere ad una
	//  parte dello stato del padre, altrimenti il componente diventa
	//  incontrollato
	fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
		.isRequired,

	// Callback da passare all'evento onChange dell'elemento.
	// Deve avere due parametri: l'evento e il ref dell'elemento, posto a
	//  null di default.
	onChange: PropTypes.func.isRequired,

	// Contenuto dell'elemento html <label> che verrà creato sopra l'input
	label: PropTypes.string,
	// Messaggio di errore che apparirà in caso di conenuto invalido
	errMsg: PropTypes.string,
};

export default Input;
