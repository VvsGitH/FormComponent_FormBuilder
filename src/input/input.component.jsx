import React from 'react';
import PropTypes from 'prop-types';

import { maskValue, unMaskValue } from './input.utils';

import './input.style.scss';

class Input extends React.PureComponent {
	//
	// Renderizzo il campo di input in base al tipo contenuto nei props
	//

	renderField = (fieldValue, onChange, htmlProps) => {
		const { id, name, options, innerRef, ...input } = htmlProps;

		switch (input.type) {
			// Il tipo checkbox richiede un trattamento speciale in quanto
			//  è un campo booleano controllato dall'attrivbuto checked e non
			//  da value.
			// Richiede anche un secondo label affiancato come un radio btn.
			case 'checkbox':
				return (
					<div className='check-container'>
						<label htmlFor={id}>
							{name.charAt(0).toUpperCase() + name.slice(1) + ':'}
						</label>
						<input
							className='radio-check'
							id={id}
							name={name}
							checked={fieldValue}
							ref={innerRef}
							onChange={onChange}
							{...input}
						/>
					</div>
				);

			// Il tipo radio è usato per selezionare una tra varie opzioni.
			// Tali opzioni devono essere contenute nel campo options dei props
			//  e generano un pulsante radio ciascuna. Il campo value di un
			//  radio contiene il nome dell'opzione che rappresenta.
			// A ciascun pulsante è dunque affiancato un label che contiene
			//  il nome dell'opzione di quel pulsante, con la lettera maiuscola.
			// I pulsanti e i loro label sono raggruppati all'interno di un div.
			case 'radio':
				return (
					<div className='radio-container'>
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
						ref={innerRef}
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
						ref={innerRef}
						onChange={onChange}
						{...input}
					/>
				);

			// Tipi: text, email, password, data, file, tel, url, range
			default:
				// Il tipo file è un componente incontrollato e necessita un
				//  campo value pari ad undefined
				return (
					<input
						id={id}
						name={name}
						value={input.type !== 'file' ? fieldValue : undefined}
						ref={innerRef}
						onChange={onChange}
						{...input}
					/>
				);
		}
	};

	//
	// Rimuovo la maschera prima di passare il contenuto del campo al
	//  componente padre.
	//

	handleMaskedField = event => {
		const value = event.target.value;

		// Pulisco il contenuto del campo, eliminando la maschera
		const unmasked = unMaskValue(value, this.props.mask);

		// Muto l'oggetto event, inserendo il valore senza maschera nel
		//  campo value. In questo modo il componente padre, aggiungerà nello
		//  stato l'input raw dell'utente.
		event.target.value = unmasked;
		this.props.onChange(event);
	};

	//
	// RENDERING DEL COMPONENTE
	//

	render() {
		const {
			label,
			info,
			errMsg,
			mask,
			fieldValue,
			onChange,
			...htmlProps
		} = this.props;

		// Aplico la maschera al valore inserito dall'utente prima di
		//  inserirlo nel campo.
		const masked = maskValue(fieldValue, mask);

		return (
			<section className='input-group' key={htmlProps.id}>
				{label && <label htmlFor={htmlProps.id}>{label}</label>}
				{info && <p className='info-msg'>{info}</p>}
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
	fieldValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.bool,
	]).isRequired,

	// Un ref creato nel componente padre, da associare all'elemento HTML
	//  corrispondente all'input. In questo modo il componente padre può
	//  effettuare modifiche imperative all'elemento DOM.
	// Utile per i campi di tipo file e per la validazione custom.
	innerRef: PropTypes.shape({ current: PropTypes.any }),

	// Callback da passare all'evento onChange dell'elemento.
	// Deve avere due parametri: l'evento e il ref dell'elemento, posto a
	//  null di default.
	onChange: PropTypes.func.isRequired,

	// Contenuto dell'elemento html <label> che verrà creato sopra l'input
	label: PropTypes.string,
	// Messaggio per fornire ulteriori dettagli riguardo al campo
	info: PropTypes.string,
	// Messaggio di errore che apparirà in caso di conenuto invalido
	errMsg: PropTypes.string,
};

export default Input;
