import React from 'react';
import PropTypes from 'prop-types';

import { createInitialState, calculateFieldsArrays } from './form.utils';
import Input from '../input/input.component';
import Button from '../button/button.component';

import './form.style.scss';

class Form extends React.PureComponent {
	constructor(props) {
		super(props);

		// Divido gli elementi contenuti in formData in base al loro tipo
		// fields -> elmenti di input supportati
		// btns -> pulsanti (submit, reset, button)
		// unsupported -> elmenti di input non supportati o sconosciuti
		[this.fields, this.btns, this.unsupported] = calculateFieldsArrays(
			props.formData
		);

		// Costruisco lo stato in base ai fields contenuti in formdata
		// Ogni campo dello stato coneterrà il valore contenuto nel field.

		// Lo stato dipende completamente dal prop formData.
		// E' stato scelto di rendere il componente completametne incontrollato
		//  , dunque lo stato viene fissato solo nel costruttore.

		// Se si desidera che il form vari dinamicamente al variare di formData
		//  , il componente padre deve associare una chiave al componente Form
		//  che dipende univocamente da formData. In questo modo, al variare di
		//  formData, l'intero componente viene automaticamente resettato.

		// In form.utilis è presente una funzione di hashing che permette di
		//  ottenere una chiave intera a 32bit a partire dall'oggetto formData:
		//  e.g: let formKey = stringifyAndHash(formData)

		this.state = createInitialState(this.fields);

		// Oggetto pensato per raccogliere i refs dei campi file presenti
		//  nel form. Tali refs servono per validazione e reset.

		this.fileFieldsRefs = {};
	}

	//
	// Aggiorna lo stato in base ai valori inseriti nei campi del form
	//

	handleChange = (event, fieldRef = null) => {
		const { value, files, name, type } = event.target;

		// Gli input di tipo file conservano i file nel campo files e non
		//  nel campo value
		files ? this.setState({ [name]: files }) : this.setState({ [name]: value });

		// Inserisco i ref dei campi di tipo file, se presenti, all'interno del
		//  l'oggetto fileFieldsRefs. Necessario per il reset.
		if (type === 'file' && fieldRef) {
			this.fileFieldsRefs[name] = fieldRef;
		}

		// Validazione del campo confirmPassword, se presente
		if (name === 'confirmPassword' && fieldRef) {
			if (value !== this.state.password) {
				fieldRef.current.setCustomValidity("Passwords don't match");
			} else {
				fieldRef.current.setCustomValidity('');
			}
		}
	};

	//
	// Resetta lo stato alla pressione del pulsante reset, se presente
	//

	handleReset = event => {
		event.preventDefault();
		this.setState(createInitialState(this.fields));

		// Resetto manualmente l'attributo value dei campi file utilizzando
		//  i loro refs. Essendo campi non controllati, la variazione dello
		//  stato non influisce sul loro contenuto.
		for (let key in this.fileFieldsRefs) {
			this.fileFieldsRefs[key].current.value = null;
		}
	};

	//
	// Gestisce il submit
	//

	handleSubmit = event => {
		event.preventDefault();

		// Invia i campi alla funzione onChange del padre
		this.props.onSubmit(this.state);
	};

	//
	// RENDER DEL COMPONENTE
	//

	render() {
		this.unsupported.length !== 0 &&
			console.warn(
				'Incompatible types were discarded by the form: ',
				this.unsupported
			);

		return (
			<form
				className='form'
				onSubmit={this.handleSubmit}
				onReset={this.handleReset}>
				{this.fields.map(({ label, errMsg, mask, ...htmlProps }) => (
					<Input
						key={htmlProps.id}
						label={label}
						errMsg={errMsg}
						mask={mask}
						fieldValue={this.state[htmlProps.name]}
						onChange={this.handleChange}
						{...htmlProps}
					/>
				))}

				<div className='btns-container'>
					{this.btns.map(btn => (
						<Button key={btn.id} {...btn} />
					))}
				</div>
			</form>
		);
	}
}

Form.propTypes = {
	formData: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			id: PropTypes.string.isRequired,
		})
	).isRequired,

	onSubmit: PropTypes.func.isRequired,
};

export default Form;
