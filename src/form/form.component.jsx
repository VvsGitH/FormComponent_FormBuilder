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

		// Dizionario che contiene i refs a tutti i campi del form.
		// Permette di interagire imperativamente con gli elmenti nel DOM.
		// Indispensabile per i campi di tipo file e per alcune validazioni.

		this.fieldsRefs = {};
		for (let i = 0; i < this.fields.length; i++) {
			this.fieldsRefs[this.fields[i].name] = {
				type: this.fields[i].type,
				ref: React.createRef(),
			};
		}
	}

	//
	// Aggiorna lo stato in base ai valori inseriti nei campi del form
	//

	handleChange = event => {
		const { value, files, name, type } = event.target;

		// Vario lo stato in base in base al tipo di campo che è variato
		// Il tipo file contiene il/i file nel campo files e non value
		// Il tipo checkbox è un boolean
		// Per tutti gli altri va bene il campo value
		if (type === 'file') {
			this.setState({ [name]: files });
		} else if (type === 'checkbox') {
			this.setState({ [name]: !this.state[name] });
		} else {
			this.setState({ [name]: value });
		}

		// Validazione del campo confirmPassword, se presente
		if (name === 'confirmPassword') {
			if (value !== this.state.password) {
				this.fieldsRefs[name].ref.current.setCustomValidity(
					"Passwords don't match"
				);
			} else {
				this.fieldsRefs[name].ref.current.setCustomValidity('');
			}
		}

		// Validazione dei campi di tipo file
		// Solo se l'elemento html specifica l'attributo accept
		if (type === 'file' && event.target.accept) {
			this.fieldsRefs[name].ref.current.setCustomValidity('');
			if (event.target.value) {
				// Estraggo l'estensione del file dal campo value
				let extIndx = event.target.value.lastIndexOf('.');
				let extension = event.target.value.slice(extIndx);

				// Estraggo l'array delle estensioni valide dall'attributo
				//  accept dell'elemento html
				const validExtensions = event.target.accept.split(', ');

				// Verifico che l'estensione del file sia nell'array
				if (!validExtensions.includes(extension)) {
					this.fieldsRefs[name].ref.current.setCustomValidity(
						'File format not supported'
					);
				}
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
		for (let key in this.fieldsRefs) {
			if (this.fieldsRefs[key].type === 'file') {
				this.fieldsRefs[key].ref.current.value = null;
				this.fieldsRefs[key].ref.current.setCustomValidity('');
			}
		}
	};

	//
	// Passa la gestione del submit al componente padre
	//

	handleSubmit = event => {
		event.preventDefault();

		// Invia i campi alla funzione onChange del padre
		this.props.onSubmit(this.state);

		// Cancella il form
		this.handleReset(event);
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
				{this.fields.map(field => (
					<Input
						key={field.id}
						fieldValue={this.state[field.name]}
						innerRef={this.fieldsRefs[field.name].ref}
						onChange={this.handleChange}
						{...field}
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
