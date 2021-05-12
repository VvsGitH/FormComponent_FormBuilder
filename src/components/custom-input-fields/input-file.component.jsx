import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './input-file.style.scss';

const InputFile = ({ innerRef, onChange, required, ...htmlProps }) => {
	const [filesInfo, setFilesInfo] = useState('Choose a file');
	const [isValid, setIsValid] = useState(true);

	// Genera una stringa con nome e dimensione dei file selezionati
	// Verifica che il formato dei file sia valido
	// Passa i file al componente padre

	const handleChange = event => {
		const files = event.target.files;

		// Calcolo la stringa da mostrare nella custom label
		let newFileLabel = '';
		for (let i = 0; i < files.length; i++) {
			// Determino il modo migliore in cui mostrare la dimensione
			const sizeWithUnit = calculateSizeUnit(files[i].size);

			// Aggiungo nome e dimensione del file alla stringa
			newFileLabel = newFileLabel.concat(`${files[i].name} [${sizeWithUnit}]`);

			// Se il file non è l'ultimo, aggiungo un \n
			newFileLabel =
				i !== files.length - 1 ? newFileLabel.concat('\n') : newFileLabel;
		}
		setFilesInfo(newFileLabel ? newFileLabel : 'Choose a file');

		// Verifico se i file inseriti sono nel formato corretto
		const areFilesValid = validateFiles(event.target, innerRef.current);

		if (!areFilesValid) {
			// Se il campo è invalido, fornisco un evento vuoto alla
			//  funzione onChange del padre
			const fakeEvent = { target: { type: 'file', files: [] } };
			onChange(fakeEvent);
		} else {
			// Se invece il campo è valido, passo tutto l'evento al padre
			//  in modo che possa gestire il da farsi
			onChange(event);
		}

		setIsValid(areFilesValid);
	};

	// Renderizzo un campo input customizzato.
	// Nascondo il campo input di default in css, lasciando visibile solo
	//  il div successivo che contiene un label e un pulsante. Imposto anche
	//  il tabindex a -1 in modo che non venga focalizzato durante la
	//  navigazione con tastiera.
	// Il label mostra i file selezionati dall'utente.
	// Cliccare sia sul pulsante che sul label equivale a cliccare sul campo
	//  input.

	return (
		<>
			<div className='custom-file-field'>
				<button
					className='custom-file-btn'
					type='button'
					onClick={() => innerRef.current.click()}>
					Browse
				</button>
				<label
					className={`custom-file-label${!isValid ? ' file-invalid' : ''}`}
					htmlFor={htmlProps.id}>
					{filesInfo}
				</label>
			</div>
			<input
				className='hidden-file-field'
				ref={innerRef}
				tabIndex='-1'
				onChange={handleChange}
				required={required}
				{...htmlProps}
			/>
		</>
	);
};

InputFile.propTypes = {
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,

	onChange: PropTypes.func.isRequired,

	innerRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};

export default InputFile;

// UTILS
// Verifica che il tipo di file inserito sia incluso tra quelli specificati
//  nel campo html accept.
// Se l'estensione del file non è corretta, setta il campo input come
//  invalido, con un messaggio di invalidità custom

const validateFiles = (fileInput, fieldRef) => {
	const { accept, files } = fileInput;

	// Validazione dei campi di tipo file
	// Solo se l'elemento html specifica l'attributo accept
	if (accept) {
		// Estraggo l'array delle estensioni valide dall'attributo
		//  accept dell'elemento html
		const validExtensions = accept.split(', ');

		for (let i = 0; i < files.length; i++) {
			// Verifico che l'estensione del file sia nell'array
			if (!validExtensions.includes(files[i].type)) {
				fieldRef.setCustomValidity('File format not supported');
				return false;
			}
		}
	}

	fieldRef.setCustomValidity('');
	return true;
};

// UTILS
// Converte un numero di bytes in una stringa del tipo 128.20 Kb

const calculateSizeUnit = bytes => {
	const UNITS = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];

	// Determina quale sia l'unità di misura più opportuna
	let value = bytes;
	let i = 0;
	while (value > 1024 && i < UNITS.length) {
		value = value / 1024;
		i++;
	}

	// Converte il float in una stringa con due cifre dopo la virgola
	let valueString = Number.parseFloat(value).toFixed(2);

	// Aggiunge l'unità di misura
	valueString = valueString + ' ' + UNITS[i];

	return valueString;
};
