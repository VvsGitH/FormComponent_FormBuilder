import React from 'react';

import { supportedTypes } from '../../form-custom/form/form.types';
import Input from '../../form-custom/input/input.component';

import { FBOptions, FBAdditionalHtml } from '../fb-custom-fields';

import './field-builder.style.scss';

const TYPES_WITH_OPTIONS = ['select', 'radios', 'checkboxes'];
const TEXT_TYPES = ['text', 'email', 'password', 'url', 'tel'];

class FieldBuilder extends React.PureComponent {
	handleChange = event => {
		const { indx, onChange, fieldData, usedNames } = this.props;
		const newFieldData = { ...fieldData };
		switch (event.target.name) {
			case 'name':
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
			case 'required':
				newFieldData[event.target.name] = event.target.checked;
				break;
			case 'type':
				if (fieldData.type && fieldData.type !== event.target.value) {
					// Il valore di type è stato cambiato
					// Mi assicuro di eliminare tutti gli attributi specifici
					//  per particolari tipi dallo stato.
					if (TYPES_WITH_OPTIONS.includes(fieldData.type)) {
						// Il vecchio type includeva la possibilità di inserire
						//  delle opzioni
						// Elimino il campo options dallo stato se esiste
						newFieldData.options && delete newFieldData.options;
					}
					if (TEXT_TYPES.includes(fieldData.type)) {
						// Il vecchio type era un tipo testuale
						// Elimino i campi mask e equalTo dalo stato se esistono
						newFieldData.mask && delete newFieldData.mask;
						newFieldData.equalTo && delete newFieldData.equalTo;
					}
				}
				newFieldData[event.target.name] = event.target.value;
				break;
			default:
				newFieldData[event.target.name] = event.target.value;
		}
		onChange(newFieldData, indx);
	};

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
							optionsArray={options ? options : []}
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

export default FieldBuilder;
