import React from 'react';
import PropTypes from 'prop-types';

import './form-builder.style.scss';

import FieldBuilder from '../field-builder/field-builder.component';
import Input from '../../form-custom/input/input.component';
import FormButton from '../../components/form-button/form-button.component';
import AddButton from '../../components/add-button/add-button.component';
import RemoveButton from '../../components/remove-button/remove-button.component';

// Il FormBuilder è un form che permette all'utente di creare graficamente un
//  array di oggetti js compatibile con il componente Form.
// Sfruttando FormBuilder e Form insieme è possibile creare graficamente un
//  form completamente customizzato e pre-stilizzato.

// Una applicazione del FormBuilder potrebbe essere all'interno di un servizio
//  per la creazione facile di siti web. Tuttavia in questo caso, il FormBuilder
//  è utilizzato per mostrare le potenzialità dei componenti Form e Input.

// FormBuilder utilizza al suo interno il componente FieldBuilder.
// FieldBuilder si occupa di generare un sub-form che consente all'utente di
//  specificare tutte le proprietà html e custom relative ad un singolo campo
//  del form custom che sta creando.

class FormBuilder extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			// Titolo del form che l'utente sta creando
			title: '',
			// Array di oggetti. Ogni oggetto corrisponde ai campi contenuti
			//  nel sub-form FieldBuilder corrispondente a quell'indice.
			fieldsData: [{}],
		};

		// Lista dei nomi usati in FieldsBuilder per identificare i campi
		// Tali nomi devono essere unici!
		this.usedNames = [];
	}

	// Aggiunge un nuovo FieldBuilder vuoto
	addField = () => {
		this.setState({ fieldsData: [...this.state.fieldsData, {}] });
	};

	// Rimuove il FieldBuilder con indice pari a indx
	removeField = indx => {
		if (this.state.fieldsData.length > 1) {
			const newFieldsData = [...this.state.fieldsData];
			newFieldsData.splice(indx, 1);
			this.setState({ fieldsData: newFieldsData });
		}
	};

	// Riceve i campi aggiornati del sub-form FieldBuilder con indice indx
	handleChange = (newFieldData, indx) => {
		const newFieldsData = [...this.state.fieldsData];
		newFieldsData[indx] = newFieldData;
		this.setState({ fieldsData: newFieldsData });
	};

	// Gestisce la variazione del campo title
	handleTitleChange = event => {
		this.setState({ title: event.target.value });
	};

	// Gestisce il submit
	handleSubmit = event => {
		event.preventDefault();

		if (this.state.fieldsData.length === 0) return;

		// Deep copy
		const fieldsDataCopy = JSON.parse(JSON.stringify(this.state.fieldsData));

		// Faccio lo spreading di additionalAttribs in ogni campo
		this.spreadAdditionalAttribs(fieldsDataCopy);

		// Aggiungo un submit e un reset button
		const submitBtn = {
			type: 'submit',
			name: 'submit-btn',
			id: 'submit-btn',
			value: 'SUBMIT',
		};
		const resetBtn = {
			type: 'reset',
			name: 'reset-btn',
			id: 'reset-btn',
			value: 'RESET',
		};
		fieldsDataCopy.push(submitBtn, resetBtn);

		// Invio i campi al componente padre
		this.props.onSubmit(this.state.title, fieldsDataCopy);

		// Resetto il form
		this.setState({ title: '', fieldsData: [{}] });
	};

	// additionalAttribs è un array di oggetti contenuto in fieldsData:
	//  FD: {..., additionalAttribs: [{name, value}, {name,value}, ...], ...}
	// Voglio distribuire i suoi elementi in fieldsData:
	//  FD: {..., name:value, name:value, ..., ...}
	// IMPORTANTE: questa funzione muta l'oggetto che riceve in input!
	spreadAdditionalAttribs = fieldsData => {
		// Cerco additionalAttribs in fieldsData
		for (let i = 0; i < fieldsData.length; i++) {
			if (fieldsData[i].additionalAttribs) {
				// se additionalAttribs è presente, lo copio in attribsArr e
				//  poi lo elimino da fieldsData
				const attribsArr = [...fieldsData[i].additionalAttribs];
				delete fieldsData[i].additionalAttribs;

				// Creo dei nuovi elementi in fieldsData che hanno i nomi e i
				//  valori degli elementi contenuti in attribsArr
				for (let j = 0; j < attribsArr.length; j++) {
					fieldsData[i][attribsArr[j].name] = attribsArr[j].value;
				}
			}
		}
	};

	// Calcolo il valore di usedNames in base allo stato fieldsData.
	// Evito di mutare usedNames se il suo valore non è cambiato rispetto al
	//  render precedente. In questo modo i componenti FieldBuilders non
	//  verranno rirenderizzati inutilmente.
	recomputeUsedNames = () => {
		// Calcolo il valore aggiornato di usedNames utilizzando una nuova
		//  variabile in modo da non mutare this.usedNames.
		const newUsedNames = this.state.fieldsData
			.filter(field => field.name)
			.map(field => field.name);

		// Confronto newUsedNames e this.usedNames. Muto this.usedNames solo se
		//  i due array sono diversi.
		// Per tentare di ottimizzare il confronto verifico prima se le
		//  lunghezze sono uguali.
		if (newUsedNames.length !== this.usedNames.length) {
			this.usedNames = newUsedNames;
			return true;
		}
		for (let i = 0; i < newUsedNames.length; i++) {
			if (newUsedNames[i] !== this.usedNames[i]) {
				this.usedNames = newUsedNames;
				return true;
			}
		}

		// Non ci sono stati cambiamenti, this.usedNames è immutato.
		return false;
	};

	//
	// RENDER DEL COMPONENTE
	//

	render() {
		this.recomputeUsedNames();

		return (
			<form onSubmit={this.handleSubmit} className='form-builder'>
				<h1>FORM BUILDER</h1>

				<fieldset className='title-container'>
					<Input
						type='text'
						name='formTitle'
						id='formTitle'
						fieldValue={this.state.title}
						onChange={this.handleTitleChange}
						label='Form Title'
						errMsg='Only numbers and letters'
						required={true}
						pattern='[a-zA-Z0-9 ]{0,}'
						placeholder='Insert the title of the form you are building'
					/>
				</fieldset>

				{this.state.fieldsData.map((fieldData, indx) => (
					<fieldset key={indx} className='fb-container'>
						<header className='builder-header'>
							<h2>BUILD FIELD {indx + 1}</h2>
							<RemoveButton
								id='remove-field'
								onClick={() => this.removeField(indx)}
								title={
									this.state.fieldsData.length === 1
										? "YOU CAN'T REMOVE THIS FIELD"
										: 'REMOVE THIS FIELD'
								}
								disabled={this.state.fieldsData.length === 1}
							/>
						</header>

						<FieldBuilder
							indx={indx}
							fieldData={fieldData}
							usedNames={this.usedNames}
							onChange={this.handleChange}
						/>
					</fieldset>
				))}

				<AddButton
					id='add-field'
					label='ADD NEW FIELD'
					onClick={this.addField}
				/>
				<FormButton type='submit' id='submit' value='SUBMIT' />
			</form>
		);
	}
}

FormBuilder.propTypes = {
	// Funzione per la gestione del submit da parte del componente padre.
	// Il componente Form chiamerà questa funzione inserendo in input i valori
	//  title e fieldsData contenuti nel suo stato.
	onSubmit: PropTypes.func.isRequired,
};

export default FormBuilder;
