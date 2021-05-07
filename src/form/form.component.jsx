import React from 'react';

import Input from '../input/input.component';
import MaskedInput from '../masked-input/masked-input.component';
import { supportedTypes, btnTypes } from './form.types';
import './form.style.scss';

class Form extends React.PureComponent {
	constructor(props) {
		super(props);

		// Creo uno stato in cui sono presenti i valori di tutti i campi del form
		this.state = createInitialState(this.props.formData);

		// Array con tutti i campi supportati in formData
		this.fields = this.props.formData.filter(field =>
			supportedTypes.includes(field.type)
		);

		// Array con tutti i pulsanti presenti in formData
		this.btns = this.props.formData.filter(input =>
			btnTypes.includes(input.type)
		);

		// Array con tutti i campi non supportati in formData
		this.unsupportedFields = this.props.formData.filter(
			field =>
				!supportedTypes.includes(field.type) && !btnTypes.includes(field.type)
		);
	}

	// Aggiorna lo stato in base ai valori inseriti nei campi del form
	handleChange = (event, fieldRef = null) => {
		const { value, files, name } = event.target;

		// Gli input di tipo file conservano i file nel campo files e non
		//  nel campo value
		files ? this.setState({ [name]: files }) : this.setState({ [name]: value });

		// Validazione del campo confirmPassword, se presente
		if (name === 'confirmPassword') {
			if (value !== this.state.password) {
				fieldRef.current.setCustomValidity("Passwords don't match");
			} else {
				fieldRef.current.setCustomValidity('');
			}
		}
	};

	// Resetta lo stato alla pressione del pulsante reset, se presente
	handleReset = event => {
		event.preventDefault();
		this.setState(createInitialState(this.props.formData));
	};

	/*
	############################
		RENDER DEI PULSANTI
	############################
	*/

	formButtons = () => {
		// Genero il JSX in base all'array btns
		// Tutti i pulsanti sono posizionati all'interno di un div, in modo da
		//  poterne gestire separatamente la posizione nel css
		// I pulsanti di tipo 'button' devono includere una funzione onClick
		//  custom
		// I pulsanti di tipo 'submit' e 'reset' non richiedono una funzione
		//  onClick in quanto triggerano in automatico i rispettivi eventi
		return (
			<div className='btns-container'>
				{this.btns.map(btn => (
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
		RENDER DEL COMPONENTE
	#############################
	*/

	render() {
		this.unsupportedFields.length !== 0 &&
			console.warn(
				'Incompatible types were discarded by the form: ',
				this.unsupportedFields
			);

		return (
			<form
				className='form'
				onSubmit={e => this.props.onSubmit(e, this.state)}
				onReset={this.handleReset}>
				{this.fields.map(({ label, errMsg, mask, ...htmlProps }) =>
					mask ? (
						<MaskedInput
							key={htmlProps.id}
							label={label}
							errMsg={errMsg}
							mask={mask}
							value={this.state[htmlProps.name]}
							htmlProps={htmlProps}
							onChange={this.handleChange}
						/>
					) : (
						<Input
							key={htmlProps.id}
							label={label}
							errMsg={errMsg}
							value={this.state[htmlProps.name]}
							htmlProps={htmlProps}
							onChange={this.handleChange}
						/>
					)
				)}
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
