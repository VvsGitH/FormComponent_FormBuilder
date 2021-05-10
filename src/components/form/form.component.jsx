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
		const { value, name, files, type } = event.target;

		// Vario lo stato in base in base al tipo di campo che è variato
		// Il tipo file contiene il/i file nel campo files e non value
		// Il tipo checkbox è un boolean
		// Per tutti gli altri va bene il campo value
		if (type === 'file') {
			this.setState({ [name]: files.length > 0 ? files : '' });
		} else {
			this.setState({ [name]: value });
		}
	};

	//
	// Resetta lo stato alla pressione del pulsante reset, se presente
	//

	handleReset = event => {
		event.preventDefault();
		this.setState(createInitialState(this.fields));

		// Resetto manualmente i campi file utilizzando i loro refs.
		// Essendo campi non controllati, la variazione dello stato non
		//  influisce sul loro contenuto.
		for (let key in this.fieldsRefs) {
			if (this.fieldsRefs[key].type === 'file') {
				this.fieldsRefs[key].ref.current.value = '';
				this.fieldsRefs[key].ref.current.files = null;

				// Triggero manualmente l'evento change dell'elemento: in
				//  questo modo viene eseguita la funzione handleChange che
				//  resetta la scritta riportata sull'elemento file custom.
				let changeEvent = new Event('change', { bubbles: true });
				this.fieldsRefs[key].ref.current.dispatchEvent(changeEvent);
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
				{this.fields.map(({ equalTo, ...field }) => (
					<Input
						key={field.id}
						fieldValue={this.state[field.name]}
						innerRef={this.fieldsRefs[field.name].ref}
						equalTo={equalTo ? this.state[equalTo] : null}
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
