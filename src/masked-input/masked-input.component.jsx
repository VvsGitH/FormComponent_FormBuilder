import React from 'react';

class MaskedInput extends React.PureComponent {
	handleChange = event => {
		const value = event.target.value;

		// Pulisco il contenuto del campo, eliminando la maschera
		const unmasked = unMaskValue(value, this.props.mask);

		// Muto l'oggetto event, inserendo il valore senza maschera nel
		//  campo value. In questo modo il componente padre, aggiungerà nello
		//  stato l'input raw dell'utente.
		event.target.value = unmasked;
		this.props.onChange(event);
	};

	render() {
		const { value, mask, onChange, ...htmlProps } = this.props;

		// Aplico la maschera al valore inserito dall'utente prima di
		//  inserirlo nel campo.
		const masked = maskValue(value, mask);

		return <input value={masked} onChange={this.handleChange} {...htmlProps} />;
	}
}

export default MaskedInput;

/*
###############################
		UTILITIES
###############################
*/

const maskValue = (value, mask) => {
	if (!mask) return value;

	let maskIndx = 0;
	let valueIndx = 0;
	let masked = '';

	while (valueIndx < value.length && maskIndx < mask.length) {
		if (mask[maskIndx] === '#') {
			masked = masked.concat(value[valueIndx]);
			valueIndx++;
			maskIndx++;
		} else {
			masked = masked.concat(mask[maskIndx]);
			maskIndx++;
		}
	}

	return masked;
};

const unMaskValue = (masked, mask) => {
	if (!mask) return masked;

	let unmasked = '';

	for (let i = 0; i < masked.length; i++) {
		if (masked[i] !== mask[i]) {
			unmasked = unmasked.concat(masked[i]);
		}
	}

	return unmasked;
};
