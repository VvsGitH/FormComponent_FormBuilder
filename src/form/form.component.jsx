import React, { createRef } from 'react';

import MaskedInput from '../masked-input/masked-input.component';
import { supportedTypes, btnTypes } from './form.types';
import './form.style.scss';

class Form extends React.PureComponent {
	constructor(props) {
		super(props);

		// Creo uno stato in cui sono presenti i valori di tutti i campi del form
		this.state = createInitialState(this.props.formData);

		// Riferimento all'elemento confirmPassword, se presente
		// Utile per la validazione custom nella funzione handleChange
		this.confPassRef = createRef();
	}

	// Aggiorna lo stato in base ai valori inseriti nei campi del form
	handleChange = event => {
		const { value, files, name } = event.target;

		// Gli input di tipo file conservano i file nel campo files e non
		//  nel campo value
		files ? this.setState({ [name]: files }) : this.setState({ [name]: value });

		// Validazione del campo confirmPassword, se presente
		if (name === 'confirmPassword') {
			if (value !== this.state.password) {
				this.confPassRef.current.setCustomValidity("Passwords don't match");
			} else {
				this.confPassRef.current.setCustomValidity('');
			}
		}
	};

	// Resetta lo stato alla pressione del pulsante reset, se presente
	handleReset = event => {
		event.preventDefault();
		this.setState(createInitialState(this.props.formData));
	};

	/* 
	#################################
		RENDER DEI CAMPI DEL FORM
	#################################
	*/

	renderField = ({ id, name, value, mask, options, ...input }) => {
		switch (input.type) {
			// Supporto le maschere per i tipi text e tel
			case 'text':
			case 'tel':
				return (
					<MaskedInput
						id={id}
						name={name}
						mask={mask}
						value={this.state[name]}
						onChange={this.handleChange}
						{...input}
					/>
				);
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
									checked={this.state[name] === option}
									onChange={this.handleChange}
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
						value={this.state[name]}
						onChange={this.handleChange}
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
						value={this.state[name]}
						onChange={this.handleChange}
						{...input}
					/>
				);
			default:
				// Non renderizzo i pulsanti ed i tipi non supportati
				// Il render dei pulsanti è gestito da renderBtns()
				if (!supportedTypes.includes(input.type)) {
					!btnTypes.includes(input.type) &&
						console.warn(
							'Incompatible type was discarded by the form: ',
							input.type
						);
					return null;
				}
				// NOTA1: confirmPassword necessita di un ref per la validaz.
				// NOTA2: il tipo file è un componente incontrollato e
				//  necessita un campo value pari ad undefined
				return (
					<input
						id={id}
						name={name}
						value={input.type !== 'file' ? this.state[name] : undefined}
						ref={name === 'confirmPassword' ? this.confPassRef : null}
						onChange={this.handleChange}
						{...input}
					/>
				);
		}
	};

	/*
	############################
		RENDER DEI PULSANTI
	############################
	*/

	formButtons = () => {
		// Costruisco un array con tutti i pulsanti presenti in formData
		const btns = this.props.formData.filter(input =>
			btnTypes.includes(input.type)
		);

		// Genero il JSX in base all'array
		// Tutti i pulsanti sono posizionati all'interno di un div, in modo da
		//  poterne gestire separatamente la posizione nel css
		// I pulsanti di tipo 'button' devono includere una funzione onClick
		//  custom
		// I pulsanti di tipo 'submit' e 'reset' non richiedono una funzione
		//  onClick in quanto triggerano in automatico i rispettivi eventi
		return (
			<div className='btns-container'>
				{btns.map(btn => (
					<input
						className='inp-btn'
						key={btn.id}
						type={btn.type}
						value={btn.value}
						onClick={btn.type === 'button' ? btn.onClick : null}
					/>
				))}
			</div>
		);
	};

	/*
	#############################
		RETURN DEL COMPONENTE
	#############################
	*/
	render() {
		return (
			<form
				className='form'
				onSubmit={e => this.props.onSubmit(e, this.state)}
				onReset={this.handleReset}>
				{this.props.formData.map(({ label, errMsg, ...input }) => (
					<React.Fragment key={input.id}>
						{label && <label htmlFor={input.id}>{label}</label>}
						{this.renderField(input)}
						{errMsg && <p className='err-msg'>{errMsg}</p>}
					</React.Fragment>
				))}
				{this.formButtons()}
			</form>
		);
	}
}

export default Form;

// UTILITIES

// Costruisco un oggetto a partire dall'array formData utilizzando reduce:
// 	estraggo il campo name da ogni elemento di formData e gli associo un
// 	valore iniziale pari ad una stringa vuota
// Nel caso di un campo select, devo assegnargli la prima opzione, cioè quella
//  visibile di default, come valore iniziale
// Escludo i pulsanti e gli elementi non supportati dalla selezione
const createInitialState = formData =>
	formData.reduce((acc, curr) => {
		if (curr.name && supportedTypes.includes(curr.type)) {
			if (curr.type === 'select') acc[curr.name] = curr.options[0];
			else acc[curr.name] = '';
		}
		return acc;
	}, {});
