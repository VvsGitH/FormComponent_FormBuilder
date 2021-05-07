import React, { createRef } from 'react';

class Input extends React.Component {
	constructor(props) {
		super(props);

		this.fieldRef = createRef();
	}

	shouldComponentUpdate(newProps) {
		if (this.props.label !== newProps.label) return true;
		if (this.props.errMsg !== newProps.errMsg) return true;
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

	renderField = (
		fieldValue,
		onChange,
		{ id, name, value, options, mask, ...input }
	) => {
		switch (input.type) {
			// I tipi radio e checkbox comprendono varie opzioni e richiedono
			//  un trattamento particolare
			case 'radio':
			case 'checkbox':
				return (
					<div className='radio-check-container'>
						{options.map((option, indx) => (
							<React.Fragment key={indx}>
								<label htmlFor={`${name}-${option}`}>
									{option.charAt(0).toUpperCase() + option.slice(1) + ':'}
								</label>
								<input
									className='radio-check'
									name={name}
									id={`${name}-${option}`}
									value={option}
									checked={fieldValue === option}
									onChange={onChange}
									{...input}
								/>
							</React.Fragment>
						))}
					</div>
				);
			// Il tag select deve essere costruito con all'interno i suoi
			//  vari tag option
			case 'select':
				return (
					<select
						id={id}
						name={name}
						value={fieldValue}
						onChange={onChange}
						{...input}>
						{options.map((option, indx) => (
							<option key={indx} value={option}>
								{option}
							</option>
						))}
					</select>
				);
			// Il tipo textarea richiede un trattamento speciale in quanto non
			//  è un tag <input> ma un tag <textarea>
			case 'textarea':
				return (
					<textarea
						id={id}
						name={name}
						value={fieldValue}
						onChange={onChange}
						{...input}
					/>
				);
			default:
				// NOTA1: confirmPassword necessita di un ref per la validaz.
				// NOTA2: il tipo file è un componente incontrollato e
				//  necessita un campo value pari ad undefined
				return (
					<input
						id={id}
						name={name}
						value={input.type !== 'file' ? fieldValue : undefined}
						ref={name === 'confirmPassword' ? this.fieldRef : null}
						onChange={event => onChange(event, this.fieldRef)}
						{...input}
					/>
				);
		}
	};

	render() {
		const { label, errMsg, value, htmlProps, onChange } = this.props;
		const id = htmlProps.id;

		return (
			<section className='input-group' key={id}>
				{label && <label htmlFor={id}>{label}</label>}
				{this.renderField(value, onChange, htmlProps)}
				{errMsg && <p className='err-msg'>{errMsg}</p>}
			</section>
		);
	}
}

export default Input;
