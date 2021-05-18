import React from 'react';

import { supportedTypes } from '../../form-custom/form/form.types';

import { FBInput, FBOptions, FBAdditionalHtml } from '../fb-custom-fields';

import './field-builder.style.scss';

const TYPES_WITH_OPTIONS = ['select', 'radios', 'checkboxes'];
const TEXT_TYPES = ['text', 'email', 'password', 'url', 'tel'];

const FieldBuilder = ({ indx, onChange, fieldData, usedNames }) => {
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
	} = fieldData;

	const handleChange = event => {
		const newFieldData = { ...fieldData };
		switch (event.target.name) {
			case 'name':
				event.target.setCustomValidity('');
				if (usedNames.includes(event.target.value)) {
					event.target.setCustomValidity('This name has already been used!');
				}
				newFieldData.name = event.target.value;
				// Genero l'id in base al nome: name-234
				newFieldData.id =
					event.target.value + '-' + Math.floor(Math.random() * 1000);
				break;
			case 'required':
				if (!newFieldData.required) {
					newFieldData.required = false;
				}
				newFieldData.required = !newFieldData.required;
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

	return (
		<div className='field-builder'>
			<fieldset className='fb-title'>
				<legend>Field Title</legend>
				<FBInput
					name='name'
					fieldValue={name}
					onChange={handleChange}
					required
				/>
				<FBInput name='id' fieldValue={id} readOnly />
			</fieldset>

			<fieldset className='fb-type'>
				<legend>Field Type</legend>
				<label>Type: </label>
				<select
					name='type'
					value={type ? type : ''}
					onChange={handleChange}
					required>
					<option value=''>Choose a type</option>
					{supportedTypes.map(type => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>

				{type && TYPES_WITH_OPTIONS.includes(type) && (
					<FBOptions
						optionsArray={options ? options : []}
						onChange={handleChange}
						isCheckboxes={type === 'checkboxes'}
					/>
				)}

				{type && type !== 'checkboxes' && (
					<FBInput
						type='checkbox'
						name='required'
						fieldValue={required}
						onChange={handleChange}
					/>
				)}
			</fieldset>

			{type && TEXT_TYPES.includes(type) && (
				<fieldset className='fb-validation'>
					<legend>Custom Field Validation</legend>
					<FBInput
						name='equalTo'
						fieldValue={equalTo}
						onChange={handleChange}
					/>
					<FBInput name='mask' fieldValue={mask} onChange={handleChange} />
				</fieldset>
			)}

			<FBAdditionalHtml
				additionalAttribs={additionalAttribs ? additionalAttribs : []}
				onChange={handleChange}
			/>

			<fieldset className='fb-descriptors'>
				<legend>Field Descriptors</legend>
				<FBInput
					name='label'
					fieldValue={label}
					onChange={handleChange}
					required
				/>
				<FBInput
					type='textarea'
					name='info'
					fieldValue={info}
					onChange={handleChange}
				/>
				<FBInput
					type='textarea'
					name='errMsg'
					fieldValue={errMsg}
					onChange={handleChange}
					required
				/>
			</fieldset>
		</div>
	);
};

export default FieldBuilder;
