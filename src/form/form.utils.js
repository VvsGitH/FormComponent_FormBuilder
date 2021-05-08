import { supportedTypes, btnTypes } from './form.types';

// Divido gli elmenti contenuti in formData in base al loro tipo
// Fields: contiene solo i campi input supportati, tranne i pulsanti
// Btns: contiene solo i pulsanti
// unsupported: contiene i campi input con tipo non supportato o sconosciuto

export const calculateFieldsArrays = formData => {
	const fields = [];
	const btns = [];
	const unsupported = [];

	let fieldsInx = 0;
	let btnsIndx = 0;
	let unsupIndx = 0;

	for (let i = 0; i < formData.length; i++) {
		if (supportedTypes.includes(formData[i].type)) {
			fields[fieldsInx] = formData[i];
			fieldsInx++;
		} else if (btnTypes.includes(formData[i].type)) {
			btns[btnsIndx] = formData[i];
			btnsIndx++;
		} else {
			unsupported[unsupIndx] = formData[i];
			unsupIndx++;
		}
	}

	return [fields, btns, unsupported];
};

// Costruisco un oggetto a partire dall'array fieldsData utilizzando reduce:
// 	estraggo il campo name da ogni elemento di fieldsData e gli associo un
// 	valore iniziale pari ad una stringa vuota
// Nel caso di un campo select, devo assegnargli la prima opzione, cioè quella
//  visibile di default, come valore iniziale

export const createInitialState = fieldsData =>
	fieldsData.reduce((acc, curr) => {
		if (curr.name) {
			if (curr.type === 'select') acc[curr.name] = curr.options[0];
			else acc[curr.name] = '';
		}
		return acc;
	}, {});

//
//
//

export const shallowCompareFormData = (oldFormData, newFormData) => {
	// Confronto la reference
	if (oldFormData !== newFormData) {
		// La reference è diversa, confronto la lunghezza dell'array
		if (oldFormData.length !== newFormData.length) {
			return true;
		} else {
			// La lunghezza è uguale, confronto oggetto per oggetto
			for (let i = 0; i < newFormData.length; i++) {
				// Confronto il numero di campi nell'oggetto
				if (oldFormData[i].length !== newFormData[i].length) {
					return true;
				} else {
					// Il numeri di campi è uguale, confronto campo per campo
					for (let key in newFormData[i]) {
						// Verifico se formData ha un nuovo campo!
						if (!oldFormData[i][key]) {
							return true;
						}
						// Verifico se i campi sono uguali.
						if (oldFormData[i][key] !== newFormData[i][key]) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
};
