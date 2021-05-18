import React from 'react';

import FieldBuilder from '../field-builder/field-builder.component';
import './form-builder.style.scss';

class FormBuilder extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			fieldsData: [{}],
		};
	}

	addField = () => {
		this.setState({ fieldsData: [...this.state.fieldsData, {}] });
	};

	removeField = indx => {
		const newFieldsData = [...this.state.fieldsData];
		newFieldsData.splice(indx, 1);
		this.setState({ fieldsData: newFieldsData });
	};

	handleChange = (fieldData, indx) => {
		const newFieldsData = [...this.state.fieldsData];
		newFieldsData[indx] = fieldData;
		this.setState({ fieldsData: newFieldsData });
	};

	spreadAdditionalAttribs = fieldsData => {
		for (let i = 0; i < fieldsData.length; i++) {
			if (fieldsData[i].additionalAttribs) {
				// From:
				// {..., additionalAttribs: [{name, value}, {name,value}, ...], ...}
				// To:
				// {..., name:value, name:value, ..., ...}
				const attribsArr = [...fieldsData[i].additionalAttribs];
				delete fieldsData[i].additionalAttribs;
				for (let j = 0; j < attribsArr.length; j++) {
					fieldsData[i][attribsArr[j].name] = attribsArr[j].value;
				}
			}
		}
	};

	handleSubmit = event => {
		event.preventDefault();

		if (this.state.fieldsData.length === 0) return;

		// Deep copy
		const stateCopy = JSON.parse(JSON.stringify(this.state.fieldsData));

		// Faccio lo spreading di additionalAttribs in ogni campo
		this.spreadAdditionalAttribs(stateCopy);

		// Aggiungo submit e reset button
		const submitBtn = {
			type: 'submit',
			name: 'submit-btn',
			id: 'submit-btn',
			value: 'SUBMIT',
		};
		const resetBtn = {
			type: 'reset',
			name: 'reset-btn',
			id: 'reset-btn',
			value: 'RESET',
		};
		stateCopy.push(submitBtn, resetBtn);

		// Invio i campi al componente padre
		this.props.onSubmit(stateCopy);
	};

	render() {
		const usedNames = this.state.fieldsData
			.filter(field => field.name)
			.map(field => field.name);

		return (
			<form onSubmit={this.handleSubmit} className='form-builder'>
				{this.state.fieldsData.map((fieldData, indx) => (
					<fieldset key={indx} className='fb-container'>
						<div className='builder-header'>
							<h2>Build the {setNumeration(indx + 1)} field</h2>
							<button
								type='button'
								onClick={() => this.removeField(indx)}
								className='add-btn'>
								REMOVE FIELD
							</button>
						</div>
						<FieldBuilder
							indx={indx}
							fieldData={fieldData}
							usedNames={usedNames}
							onChange={this.handleChange}
						/>
					</fieldset>
				))}
				<button type='button' onClick={this.addField} className='add-btn'>
					ADD NEW FIELD
				</button>
				<button type='submit' className='submit-btn'>
					SUBMIT
				</button>
			</form>
		);
	}
}

export default FormBuilder;

const setNumeration = indx => {
	switch (indx) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return indx + 'th';
	}
};
