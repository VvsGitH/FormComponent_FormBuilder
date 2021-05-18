import React, { useEffect } from 'react';
import './fb-options.style.scss';

const FBOptions = ({ onChange, optionsArray, isCheckboxes }) => {
	// Creo la prima opzione in automatico quando l'array è vuoto
	useEffect(() => {
		if (optionsArray.length === 0) addOption([], onChange, isCheckboxes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [optionsArray]);

	const getClassName = () =>
		!isCheckboxes ? 'option-container' : 'checkboxes-container';

	return (
		<div className='options-builder'>
			{optionsArray.map((option, indx) => (
				<div className={getClassName()} key={'option' + indx}>
					{!isCheckboxes ? (
						<>
							<label>Option {indx + 1}: </label>
							<input
								type='text'
								name='option'
								value={option}
								onChange={e => updateOption(optionsArray, e, indx, onChange)}
								required
							/>
						</>
					) : (
						<>
							<label>Checkbox Label: </label>
							<label>Is required? </label>
							<input
								type='text'
								name='option-label'
								id={indx}
								value={option.label}
								onChange={e => updateOption(optionsArray, e, indx, onChange)}
								required
							/>
							<input
								type='checkbox'
								name='option-required'
								value='isRequired'
								checked={option.required}
								onChange={e => updateOption(optionsArray, e, indx, onChange)}
								disabled={option.label === ''}
							/>
						</>
					)}
					<button
						className='rm-btn'
						type='button'
						onClick={() => removeOption(optionsArray, indx, onChange)}>
						&#10006;
					</button>
				</div>
			))}
			<button
				className='add-btn'
				type='button'
				onClick={() => addOption(optionsArray, onChange, isCheckboxes)}>
				ADD OPTION
			</button>
		</div>
	);
};

export default FBOptions;

//							//
// ########################	//
//       	UTILS			//
// ########################	//
//							//

const addOption = (optionsArray, eventCallback, isCheckboxes) => {
	const currentOptions = [...optionsArray];
	isCheckboxes
		? currentOptions.push({ label: '', required: false })
		: currentOptions.push('');
	eventCallback({ target: { name: 'options', value: currentOptions } });
};

const updateOption = (optionsArray, event, indx, eventCallback) => {
	const currentOptions = [...optionsArray];

	switch (event.target.name) {
		case 'option':
			currentOptions[indx] = event.target.value;
			break;
		case 'option-label':
			currentOptions[indx].label = event.target.value;
			break;
		case 'option-required':
			let isRequired = currentOptions[indx].required;
			currentOptions[indx].required = !isRequired;
			break;
		default:
			console.error('Wrong event name in Options Builder');
	}

	eventCallback({ target: { name: 'options', value: currentOptions } });
};

const removeOption = (optionsArray, indx, eventCallback) => {
	if (!optionsArray.length === 1) {
		const currentOptions = [...optionsArray];
		currentOptions.splice(indx, 1);
		eventCallback({ target: { name: 'options', value: currentOptions } });
	}
};
