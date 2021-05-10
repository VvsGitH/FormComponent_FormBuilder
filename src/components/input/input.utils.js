export const maskValue = (value, mask) => {
	if (!mask || !value) return value;

	let maskIndx = 0;
	let valueIndx = 0;
	let masked = '';

	while (valueIndx < value.length && maskIndx < mask.length) {
		if (mask[maskIndx] === '#') {
			masked = masked.concat(value[valueIndx]);
			valueIndx++;
		} else {
			masked = masked.concat(mask[maskIndx]);
		}
		maskIndx++;
	}

	return masked;
};

export const unMaskValue = (masked, mask) => {
	if (!mask || !masked) return masked;

	let unmasked = '';

	for (let i = 0; i < masked.length; i++) {
		if (masked[i] !== mask[i]) {
			unmasked = unmasked.concat(masked[i]);
		}
	}

	return unmasked;
};
