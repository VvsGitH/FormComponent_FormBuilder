import React from 'react';
import PropTypes from 'prop-types';

import { supportedTypes } from '../../form-custom/form/form.types';
import Input from '../../form-custom/input/input.component';

import { FBOptions, FBAdditionalHtml } from '../fb-custom-fields';

import './field-builder.style.scss';

// FieldBuilder si occupa di generare un sub-form che consente all'utente di
//  specificare tutte le proprietà html e custom relative ad un singolo campo
//  del form custom che sta creando.

const TYPES_WITH_OPTIONS = ['select', 'radios', 'checkboxes'];
const TEXT_TYPES = ['text', 'email', 'password', 'url', 'tel'];

class FieldBuilder extends React.PureComponent {
	//
	// HANDLE CHANGE
	// Costruisce un nuovo oggetto fieldData a seguito dell'input dell'utente,
	//  in maniera consona al tipo di campo che sta venendo costruito
	//

	handleChange = event => {
		const { indx, onChange, fieldData, usedNames } = this.props;

		// Copia di fieldData, in modo da non mutare l'originale
		const newFieldData = { ...fieldData };

		switch (event.target.name) {
			// Il nome di un campo del form deve essere unico, in quanto da
			//  esso dipende il nome dello stato interno al form
			// L'id del campo viene generato automaticamente a partire dal nome
			case 'name':
				// Utilizzo il prop usedNames per validare il campo
				event.target.setCustomValidity('');
				if (usedNames.includes(event.target.value)) {
					event.target.setCustomValidity('This name has already been used!');
				}
				newFieldData.name = event.target.value;

				// Genero l'id in base al nome: name_234
				if (event.target.value) {
					newFieldData.id =
						event.target.value + '_' + Math.floor(Math.random() * 1000);
				} else {
					newFieldData.id = '';
				}
				break;

			// I checkbox salvano lo stato booleano in checked
			case 'required':
				newFieldData[event.target.name] = event.target.checked;
				break;

			// Il tipo del campo influenza i suoi attributi!
			// Mi assicuro di eliminare tutti gli attributi specifici
			//  per particolari tipi dallo stato
			case 'type':
				// Mi assicuro che il tipo sia stato variato
				if (fieldData.type && fieldData.type !== event.target.value) {
					// Campi select, radios e checkboxes
					if (TYPES_WITH_OPTIONS.includes(fieldData.type)) {
						// Il vecchio type includeva la possibilità di inserire
						//  delle opzioni
						// Elimino il campo options dallo stato se esiste
						newFieldData.options && delete newFieldData.options;
					}

					// Campi text, email, password, ...
					if (TEXT_TYPES.includes(fieldData.type)) {
						// Il vecchio type era un tipo testuale
						// Elimino i campi mask e equalTo se esistono
						newFieldData.mask && delete newFieldData.mask;
						newFieldData.equalTo && delete newFieldData.equalTo;
					}
				}
				newFieldData[event.target.name] = event.target.value;
				break;

			// NOTA: i sub-form FBOptions e FBHtml gestiscono internamente la
			//  logica di handling e chiamano questa funzione con un evento
			//  custom gestibile da default
			default:
				newFieldData[event.target.name] = event.target.value;
		}
		onChange(newFieldData, indx);
	};

	//
	// RENDER DEL COMPONENTE
	// Renderizzo tutti i campi necessari a definire tutte le proprietà di un
	//  singolo campo di un form. Ragguppo i campi in fieldsets.
	//

	render() {
		const {
			name,
			id,
			type,
			options,
			equalTo,
			mask,
			required,
			additionalAttribs,
			label,
			info,
			errMsg,
		} = this.props.fieldData;

		return (
			<div className='field-builder'>
				<fieldset className='fb-basic'>
					<legend>Basic Field Properties</legend>
					<Input
						type='text'
						name='name'
						id='name'
						fieldValue={name}
						onChange={this.handleChange}
						required={true}
						placeholder='Eg: userName'
						pattern="[^$&+,:;.=?@#|'<>^*()%! ]{1,}"
						label='Name'
						errMsg={`The name must be unique
							No spaces and special characters!`}
					/>
					<Input
						type='text'
						name='id'
						id='id'
						fieldValue={id}
						readOnly
						placeholder='This field will auto-fill'
						label='Id'
					/>
					<Input
						type='select'
						name='type'
						id='type'
						fieldValue={type}
						onChange={this.handleChange}
						options={supportedTypes}
						required={true}
						label='Type'
						errMsg='Choose the field type'
					/>

					{type && TYPES_WITH_OPTIONS.includes(type) && (
						<FBOptions
							optionsArray={options}
							onChange={this.handleChange}
							isCheckboxes={type === 'checkboxes'}
						/>
					)}

					{type && type !== 'checkboxes' && (
						<Input
							type='checkbox'
							name='required'
							id='required'
							fieldValue={required}
							onChange={this.handleChange}
							label='Is Required?'
						/>
					)}
				</fieldset>

				{type && TEXT_TYPES.includes(type) && (
					<fieldset className='fb-validation'>
						<legend>Custom Field Validation</legend>
						<Input
							type='text'
							name='equalTo'
							id='equalTo'
							fieldValue={equalTo}
							onChange={this.handleChange}
							placeholder='Insert the name of the other field'
							label='EqualTo'
							info='This custom attribute allows to specify a field that this field must be equal to in order to be valid.'
						/>
						<Input
							type='text'
							name='mask'
							id='mask'
							fieldValue={mask}
							onChange={this.handleChange}
							placeholder='Eg: (###) ###-###'
							label='Mask'
							info='This custom attribute allows to specify a mask for the field. The mask must have # as the masked character.'
						/>
					</fieldset>
				)}

				<FBAdditionalHtml
					additionalAttribs={additionalAttribs}
					onChange={this.handleChange}
				/>

				<fieldset className='fb-descriptors'>
					<legend>Field Descriptors</legend>
					<Input
						type='text'
						name='label'
						id='label'
						fieldValue={label}
						onChange={this.handleChange}
						required={true}
						placeholder='Insert the label of the field'
						label='Label'
					/>
					<Input
						type='textarea'
						name='info'
						id='info'
						fieldValue={info}
						onChange={this.handleChange}
						placeholder='Eg: Write a small description about the field to help the user understand it'
						label='Info Message'
						info='Write a small description about the field to help the user understand it'
					/>
					<Input
						type='textarea'
						name='errMsg'
						id='errMsg'
						fieldValue={errMsg}
						onChange={this.handleChange}
						required={true}
						placeholder='Eg: Only letters allowed'
						label='Error Message'
						info='Write the error message that should appear when the field is invalid'
					/>
				</fieldset>
			</div>
		);
	}
}

FieldBuilder.propTypes = {
	// Il FieldBuilder è sostanzialmente controllato dal prop fieldData, che
	//  contiene i valori contenuti nei suoi campi.
	// Ognuno di questi campi rappresenta una proprietà di un singolo campo
	//  del form che l'utente sta creando.

	fieldData: PropTypes.shape({
		name: PropTypes.string,
		id: PropTypes.string,
		type: PropTypes.string,
		options: PropTypes.array,
		equalTo: PropTypes.string,
		mask: PropTypes.string,
		required: PropTypes.bool,
		additionalAttribs: PropTypes.array,
		label: PropTypes.string,
		info: PropTypes.string,
		errMsg: PropTypes.string,
	}),

	// indx serve a identificare il FieldBuilder all'interno del FormBuilder.
	// E' la posizione di fieldData all'interno dell'array fieldsData utilizzato
	//  nel componente FormBuilder

	indx: PropTypes.number.isRequired,

	// Array contenente i valori dei campi 'name' di ogni FieldBuilder presente
	//  in FormBuilder. Serve per la validazione del campo 'name', che deve
	//  essere univoco

	usedNames: PropTypes.arrayOf(PropTypes.string).isRequired,

	// Funzione per la gestione dell'input di FormBuilder. Deve essere chiamata
	//  dopo ogni input dell'utente e riceve in ingresso una copia aggiornata
	//  del prop fieldData e l'indice del FieldBuilder

	onChange: PropTypes.func.isRequired,
};

export default FieldBuilder;
