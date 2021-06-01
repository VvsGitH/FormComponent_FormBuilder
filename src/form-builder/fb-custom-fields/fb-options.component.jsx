import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './fb-options.style.scss';

import AddButton from '../../components/add-button/add-button.component';
import RemoveButton from '../../components/remove-button/remove-button.component';

// Questo componente crea un sub-form dinamico per la definizione delle opzioni
//  dei campi select, radios e checkboxes.
// Vedi il componente Input per informazioni su radios e checkboxes!

// Le opzioni sono definite attraverso delle stringhe o degli oggetti (nel caso
//  del tipo checkboxes). La stringa contiene il campo value dell'opzione;
//  l'oggetto contiene il label che affianca il checkbox e definisce se esso
//  sia required o meno.

const FBOptions = ({ onChange, optionsArray = [], isCheckboxes }) => {
	// Creo la prima sezione in automatico quando l'array è vuoto
	useEffect(() => {
		if (optionsArray.length === 0) addOption();
	});

	// Aggiungo una nuova sezione per la definizione di un'opzione
	const addOption = () => {
		const currentOptions = [...optionsArray];

		// Tipo di dato cambia per i campi checkboxes
		isCheckboxes
			? currentOptions.push({ label: '', required: false })
			: currentOptions.push('');

		// Invio un "evento" custom al componente padre
		onChange({ target: { name: 'options', value: currentOptions } });
	};

	// Aggiorno il campo corretto dell'opzione corretta in base all'input
	// indx identifica l'opzione
	// event.target.name identifica il campo all'interno dell'opzione
	const updateOption = (event, indx) => {
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

		onChange({ target: { name: 'options', value: currentOptions } });
	};

	// Rimuovo la sezione per la definizione dell'opzione in posizione indx
	const removeOption = indx => {
		if (optionsArray.length > 1) {
			const currentOptions = [...optionsArray];
			currentOptions.splice(indx, 1);

			onChange({ target: { name: 'options', value: currentOptions } });
		}
	};

	return (
		<fieldset className='options-builder'>
			{optionsArray.map((option, indx) => (
				<div
					className={
						!isCheckboxes ? 'option-container' : 'checkboxes-container'
					}
					key={'option' + indx}>
					{!isCheckboxes ? (
						<>
							<label htmlFor={indx}>Option {indx + 1}: </label>
							<input
								type='text'
								name='option'
								id={indx}
								value={option}
								onChange={e => updateOption(e, indx)}
								placeholder="Option's name"
								required
							/>
						</>
					) : (
						<>
							<label>Option {indx + 1}: </label>
							<label htmlFor={indx}>Checkbox Label </label>
							<label htmlFor={'req-' + indx}>Required? </label>
							<input
								type='text'
								name='option-label'
								id={indx}
								value={option.label}
								onChange={e => updateOption(e, indx)}
								placeholder="Option's name"
								required
							/>
							<input
								type='checkbox'
								name='option-required'
								id={'req-' + indx}
								value='isRequired'
								checked={option.required}
								onChange={e => updateOption(e, indx)}
								disabled={option.label === ''}
							/>
						</>
					)}
					<RemoveButton
						title={
							optionsArray.length === 1
								? "You can't remove this option"
								: 'Remove this option'
						}
						onClick={() => removeOption(indx)}
						disabled={optionsArray.length === 1}
					/>
				</div>
			))}
			<AddButton label='ADD NEW OPTION' onClick={addOption} />
		</fieldset>
	);
};

FBOptions.propTypes = {
	// Array contenente le opzioni già inserite dall'utente e quelle non ancora
	//  compilate. Nel caso sia undefined viene inizializzato come array vuoto.
	optionsArray: PropTypes.arrayOf(
		PropTypes.oneOfType([
			// E' la stringa che sarà contenuta nel campo value della singola
			//  opzione del campo select o radios generato.
			PropTypes.string,

			// Per il tipo checkboxes.
			PropTypes.shape({
				label: PropTypes.string,
				required: PropTypes.bool,
			}),
		])
	),

	// La funzione onChange del componente padre. Riceve in input un evento.
	onChange: PropTypes.func.isRequired,

	// Bool che determina se il campo che l'utente sta creando è di tipo
	//  checkboxes o meno. Il tipo checkboxes richiede infatti un trattamento
	//  specifico.
	isCheckboxes: PropTypes.bool.isRequired,
};

export default React.memo(FBOptions);
