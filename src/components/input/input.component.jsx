import React from 'react';
import PropTypes from 'prop-types';

import { maskValue, unMaskValue } from './input.utils';
import {
	InputFile,
	InputRadios,
	InputCheckboxes,
} from '../custom-input-fields';

import './input.style.scss';

class Input extends React.PureComponent {
	//
	// Renderizzo il campo di input in base al tipo contenuto nei props
	//

	renderField = (fieldValue, onChange, { options, innerRef, ...htmlProps }) => {
		switch (htmlProps.type) {
			case 'checkboxes':
				return (
					<InputCheckboxes
						fieldValue={fieldValue}
						onChange={onChange}
						options={options}
						{...htmlProps}
					/>
				);

			// Genera un numero diverso di pulsanti radio in base al contenuto
			//  di options. Tutti i pulsanti sono raggruppati in un div e hanno
			//  un proprio label.
			case 'radios':
				return (
					<InputRadios
						fieldValue={fieldValue}
						onChange={onChange}
						options={options}
						{...htmlProps}
					/>
				);

			// Il tag select deve essere costruito con all'interno i suoi
			//  vari tag <option>
			case 'select':
				return (
					<select
						value={fieldValue}
						ref={innerRef}
						onChange={onChange}
						{...htmlProps}>
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
						value={fieldValue}
						ref={innerRef}
						onChange={onChange}
						{...htmlProps}
					/>
				);

			// Il tipo file è un componente incontrollato
			// Lo stile del campo è customizzato
			case 'file':
				return (
					<InputFile onChange={onChange} innerRef={innerRef} {...htmlProps} />
				);

			// Tipi: text, email, password, data, tel, url, range
			default:
				return (
					<input
						value={fieldValue}
						ref={innerRef}
						onChange={onChange}
						{...htmlProps}
					/>
				);
		}
	};

	//
	// Eseguo tutte le validazioni custom che sono indipendenti dal tipo del
	//  componente input. Le validazioni specifiche per tipo sono
	//  effettuate all'interno dei rispettivi field components.
	// Al momento l'unica validazione di questo tipo supportata è equalTo.
	//

	handleChange = event => {
		// Custom validation
		const { equalTo, innerRef, errMsg } = this.props;

		// Validazione dei campi con il prop equalTo
		// Il componente padre deve passare all'interno del prop il valore
		//  attuale del campo con cui si sta effettuando il confronto.
		if (equalTo !== null) {
			if (event.target.value !== equalTo)
				innerRef.current.setCustomValidity(errMsg);
			else innerRef.current.setCustomValidity('');
		}

		this.props.onChange(event);
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
		this.handleChange(event);
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
			equalTo,
			onChange,
			...fieldProps
		} = this.props;

		// Aplico la maschera al valore inserito dall'utente prima di
		//  inserirlo nel campo.
		const masked = maskValue(fieldValue, mask);

		return (
			<section className='input-group' key={fieldProps.id}>
				{label && (
					<label className='main-label' htmlFor={fieldProps.id}>
						{label}
					</label>
				)}
				{info && <p className='info-msg'>{info}</p>}
				{mask
					? this.renderField(masked, this.handleMaskedField, fieldProps)
					: this.renderField(fieldValue, this.handleChange, fieldProps)}
				{errMsg && <p className='err-msg'>{errMsg}</p>}
			</section>
		);
	}
}

Input.propTypes = {
	// --------- REQUIRED HTML PROPS --------- //

	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,

	// --------- MANAGING FIELD CONTENT --------- //

	// Valore contenuto all'interno del campo. Deve corrispondere ad una
	//  parte dello stato del padre, altrimenti il componente diventa
	//  incontrollato
	fieldValue: PropTypes.oneOfType([
		PropTypes.string, // default
		PropTypes.object, // file
		PropTypes.arrayOf(PropTypes.bool), // checkbox
	]).isRequired,

	// Callback da passare all'evento onChange dell'elemento.
	// Deve avere due parametri: l'evento e il ref dell'elemento, posto a
	//  null di default.
	onChange: PropTypes.func.isRequired,

	// --------- FORWARDED REF --------- //

	// Un ref creato nel componente padre, da associare all'elemento HTML
	//  corrispondente all'input. In questo modo il componente padre può
	//  effettuare modifiche imperative all'elemento DOM.
	// Utile per i campi di tipo file e per la validazione custom.
	innerRef: PropTypes.shape({ current: PropTypes.any }),

	// --------- CUSTOM FIELD PROPS --------- //

	// Usato per i campi a scelta multipla come select, radio e checkbox.
	// Nel caso di select deve essere un array contente il campo value dei
	//  vari tag <option> al suo interno.
	// Nel caso del tipo radio, l'array contiene i nomi di ogni pulsante radio
	//  che fa parte della scelta.
	// Nel caso del tipo checkbox, l'array contiene un oggetto per ogni
	//  pulsante, che ne determina il label e l'attributo required
	options: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string), // select & radios
		PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				required: PropTypes.bool,
			})
		), // checkbox
	]),

	// Maschera da applicare all'input dell'utente
	// Il carattere # sarà sostituito con l'input utente
	mask: PropTypes.string,

	// Serve per la validazione del campo. Contiene il valore contenuto nel
	//  campo a cui questo campo deve essere uguale.
	// Eg: se questo è il campo confirmPassword, equalTo contiene il valore
	//  del campo passoword.
	equalTo: PropTypes.string,

	// --------- FIELD'S DECORATORS --------- //

	// Contenuto dell'elemento html <label> che verrà creato sopra l'input
	label: PropTypes.string,
	// Messaggio per fornire ulteriori dettagli riguardo al campo
	info: PropTypes.string,
	// Messaggio di errore che apparirà in caso di conenuto invalido
	errMsg: PropTypes.string,
};

export default Input;
