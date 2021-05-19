import React from 'react';
import { supportedHtmlAttributes } from './html-attributes';
import './fb-additional-html.style.scss';

import AddButton from '../../components/add-button/add-button.component';
import RemoveButton from '../../components/remove-button/remove-button.component';

const FBAdditionalHtml = ({ onChange, additionalAttribs }) => (
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
					onChange={e => updateAttribName(additionalAttribs, e, indx, onChange)}
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
					onChange={e =>
						updateAttribValue(additionalAttribs, e, indx, onChange)
					}
					placeholder="Insert the attribute's value"
					disabled={attrib.name === ''}
					required
				/>
				<RemoveButton
					title='Remove this html attribute'
					onClick={() => removeAttrib(additionalAttribs, indx, onChange)}
				/>
			</div>
		))}

		<AddButton
			label='ADD NEW HTML ATTRIBUTE'
			onClick={() => addAttrib(additionalAttribs, onChange)}
		/>
	</fieldset>
);

// Setto qui il valore di default di additionalAttribs
// Lo faccio qui e non direttamente in field-builder (come per gli altri campi)
//  perchè l'array vuoto avrebbe una reference sempre diversa e causerebbe
//  il ri-render del componente ad ogni ri-render di field-builder
// Per fb-options il problema non si pone, in quanto al montaggio genera in
//  automatico la prima opzione, che crea l'array options in fieldData e dunque
//  l'array vuoto non viene più passato.
FBAdditionalHtml.defaultProps = {
	additionalAttribs: [],
};

export default React.memo(FBAdditionalHtml);

//							//
// ########################	//
//       	UTILS			//
// ########################	//
//							//

const addAttrib = (attribsArray, eventCallback) => {
	const newArray = [...attribsArray];
	newArray.push({ name: '', value: '' });
	eventCallback({ target: { name: 'additionalAttribs', value: newArray } });
};

const updateAttribName = (attribsArray, event, indx, eventCallback) => {
	const newArray = [...attribsArray];
	newArray[indx].name = event.target.value;
	eventCallback({ target: { name: 'additionalAttribs', value: newArray } });
};

const updateAttribValue = (attribsArray, event, indx, eventCallback) => {
	const newArray = [...attribsArray];
	newArray[indx].value = event.target.value;
	eventCallback({ target: { name: 'additionalAttribs', value: newArray } });
};

const removeAttrib = (attribsArray, indx, eventCallback) => {
	const newArray = [...attribsArray];
	newArray.splice(indx, 1);
	eventCallback({ target: { name: 'additionalAttribs', value: newArray } });
};
