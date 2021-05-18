import React from 'react';
import { supportedHtmlAttributes } from './html-attributes';
import './fb-additional-html.style.scss';

const FBAdditionalHtml = ({ onChange, additionalAttribs }) => (
	<fieldset className='html-attributes'>
		{additionalAttribs.map((attrib, indx) => (
			<React.Fragment key={'attrib' + indx}>
				<label>Name</label>
				<label>Value</label>
				<select
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
					value={attrib.value}
					onChange={e =>
						updateAttribValue(additionalAttribs, e, indx, onChange)
					}
					disabled={attrib.name === ''}
					required
				/>
				<button
					className='rm-btn'
					type='button'
					onClick={() => removeAttrib(additionalAttribs, indx, onChange)}>
					&#10006;
				</button>
			</React.Fragment>
		))}

		<button
			className='add-btn'
			type='button'
			onClick={() => addAttrib(additionalAttribs, onChange)}>
			ADD HTML ATTRIBUTES
		</button>
	</fieldset>
);

export default FBAdditionalHtml;

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
