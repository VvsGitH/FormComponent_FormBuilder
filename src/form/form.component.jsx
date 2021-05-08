import React from 'react';

import {
	createInitialState,
	calculateFieldsArrays,
	shallowCompareFormData,
} from './form.utils';
import Input from '../input/input.component';
import Button from '../button/button.component';

import './form.style.scss';

class Form extends React.Component {
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
		this.state = createInitialState(this.fields);

		// Variabile per monitorare i cambiamenti in formData
		this.isFormDataOld = false;
	}

	//
	// Il prop formData è un array di oggetti. Mi assicuro che sia cambiato
	// prima di aggiornare inutilmente il componente.
	//

	shouldComponentUpdate(newProps, newState) {
		let shouldUpdate = false;

		if (this.state !== newState) shouldUpdate = true;
		if (this.props.onSubmit !== newProps.onSubmit) shouldUpdate = true;

		this.isFormDataOld = shallowCompareFormData(
			this.props.formData,
			newProps.formData
		);

		return shouldUpdate || this.isFormDataOld;
	}

	//
	// Se il componente si è aggiornato ed il prop formData è cambiato,
	//  ricalcolo gli array fields, btns e unsopported e resetto lo stato
	//

	componentDidUpdate() {
		if (this.isFormDataOld) {
			this.isFormDataOld = false;

			[this.fields, this.btns, this.unsupported] = calculateFieldsArrays(
				this.props.formData
			);

			this.setState(createInitialState(this.fields));
		}
	}

	//
	// Aggiorna lo stato in base ai valori inseriti nei campi del form
	//

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

	//
	// Resetta lo stato alla pressione del pulsante reset, se presente
	//

	handleReset = event => {
		event.preventDefault();
		this.setState({ ...createInitialState(this.fields) });
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
				onSubmit={e => this.props.onSubmit(e, this.state)}
				onReset={this.handleReset}>
				{this.fields.map(({ label, errMsg, mask, ...htmlProps }) => (
					<Input
						key={htmlProps.id}
						label={label}
						errMsg={errMsg}
						mask={mask}
						value={this.state[htmlProps.name]}
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

export default Form;
