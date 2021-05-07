import React from 'react';

class MaskedInput extends React.Component {
	shouldComponentUpdate(newProps) {
		if (this.props.label !== newProps.label) return true;
		if (this.props.errMsg !== newProps.errMsg) return true;
		if (this.props.mask !== newProps.mask) return true;
		if (this.props.value !== newProps.value) return true;
		if (this.props.onChange !== newProps.onChange) return true;

		for (var key in newProps.htmlProps) {
			if (!(key in this.props.htmlProps)) {
				return true;
			}

			if (newProps.htmlProps[key] !== this.props.htmlProps[key]) {
				return true;
			}
		}

		return false;
	}

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
		const { label, errMsg, mask, value, htmlProps } = this.props;
		const { id, type } = htmlProps;

		// Aplico la maschera al valore inserito dall'utente prima di
		//  inserirlo nel campo.
		const masked = maskValue(value, mask);

		return type === 'text' || type === 'tel' ? (
			<section className='input-group' key={id}>
				{label && <label htmlFor={id}>{label}</label>}
				<input value={masked} onChange={this.handleChange} {...htmlProps} />
				{errMsg && <p className='err-msg'>{errMsg}</p>}
			</section>
		) : null;
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
