import React from 'react';
import PropTypes from 'prop-types';

import { supportedHtmlAttributes } from './html-attributes';
import './fb-additional-html.style.scss';

import AddButton from '../../components/add-button/add-button.component';
import RemoveButton from '../../components/remove-button/remove-button.component';

// Questo componente crea un sub-form dinamico per la definizione degli
//  attributi html da associare al campo creato nel componente FieldBuilder.

// Per ogni attributo html deve essere specificato il nome e il valore.
// Il nome è controllato attraverso un campo select generato a partire da
//  supportedHtmlAttributes.
// Il valore non è validato in alcun modo e sta all'utente inserire un valore
//  opportuno. Nel caso di valori errati, html ignorerà l'attributo.

const FBAdditionalHtml = ({ onChange, additionalAttribs = [] }) => {
	// Aggiungo una nuova sezione per la definizione di un attributo html
	const addAttrib = () => {
		const newArray = [...additionalAttribs];
		newArray.push({ name: '', value: '' });

		// Invio un "evento" custom al componente padre
		onChange({ target: { name: 'additionalAttribs', value: newArray } });
	};

	// Aggiorno il nome dell'attributo in posizione indx in base all'input
	const updateAttribName = (event, indx) => {
		const newArray = [...additionalAttribs];
		newArray[indx].name = event.target.value;

		onChange({ target: { name: 'additionalAttribs', value: newArray } });
	};

	// Aggiorno il valore dell'attributo in posizione indx in base all'input
	const updateAttribValue = (event, indx) => {
		const newArray = [...additionalAttribs];
		newArray[indx].value = event.target.value;

		onChange({ target: { name: 'additionalAttribs', value: newArray } });
	};

	// Rimuovo la sezione per la definizione dell'attributo in posizione indx
	const removeAttrib = indx => {
		const newArray = [...additionalAttribs];
		newArray.splice(indx, 1);

		onChange({ target: { name: 'additionalAttribs', value: newArray } });
	};

	return (
		<fieldset className='html-attributes'>
			<legend>HTML Attributes</legend>
			{additionalAttribs.map((attrib, indx) => (
				<div className='attribute-container' key={'attrib' + indx}>
					<label>Attribute {indx + 1}: </label>
					<label htmlFor={'attr-name' + indx}>Name</label>
					<label htmlFor={'attr-value' + indx}>Value</label>
					<select
						id={'attr-name' + indx}
						value={attrib.name}
						onChange={e => updateAttribName(e, indx)}
						required>
						<option value=''>Choose the HTML attribute</option>
						{supportedHtmlAttributes.map((htmlAttrib, indx) => (
							<option key={htmlAttrib + indx} value={htmlAttrib}>
								{htmlAttrib}
							</option>
						))}
					</select>
					<input
						type='text'
						name={attrib}
						id={'attr-value' + indx}
						value={attrib.value}
						onChange={e => updateAttribValue(e, indx)}
						placeholder="Insert the attribute's value"
						disabled={attrib.name === ''}
						required
					/>
					<RemoveButton
						title='Remove this html attribute'
						onClick={() => removeAttrib(indx)}
					/>
				</div>
			))}

			<AddButton label='ADD NEW HTML ATTRIBUTE' onClick={addAttrib} />
		</fieldset>
	);
};

FBAdditionalHtml.propTypes = {
	// Array contenente gli attributi html già inseriti dall'utente e quelli
	//  vuoti ancora da compilare. Nel caso sia undefined viene inizializzato
	//  come un array vuoto.
	additionalAttribs: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			value: PropTypes.string,
		})
	),

	// La funzione onChange del componente padre. Riceve in input un evento.
	onChange: PropTypes.func.isRequired,
};

export default React.memo(FBAdditionalHtml);
