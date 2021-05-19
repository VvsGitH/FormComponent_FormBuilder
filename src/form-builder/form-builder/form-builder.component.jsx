import React from 'react';
import PropTypes from 'prop-types';

import './form-builder.style.scss';

import FieldBuilder from '../field-builder/field-builder.component';
import Input from '../../form-custom/input/input.component';
import FormButton from '../../components/form-button/form-button.component';
import AddButton from '../../components/add-button/add-button.component';
import RemoveButton from '../../components/remove-button/remove-button.component';

class FormBuilder extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			title: '',
			fieldsData: [{}],
		};
		this.usedNames = [];
	}

	addField = () => {
		this.setState({ fieldsData: [...this.state.fieldsData, {}] });
	};

	removeField = indx => {
		const newFieldsData = [...this.state.fieldsData];
		newFieldsData.splice(indx, 1);
		this.setState({ fieldsData: newFieldsData });
	};

	handleChange = (newFieldData, indx) => {
		const newFieldsData = [...this.state.fieldsData];
		newFieldsData[indx] = newFieldData;
		this.setState({ fieldsData: newFieldsData });
	};

	// From: {..., additionalAttribs: [{name, value}, {name,value}, ...], ...}
	// To: {..., name:value, name:value, ..., ...}
	spreadAdditionalAttribs = fieldsData => {
		for (let i = 0; i < fieldsData.length; i++) {
			if (fieldsData[i].additionalAttribs) {
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
		const fieldsDataCopy = JSON.parse(JSON.stringify(this.state.fieldsData));

		// Faccio lo spreading di additionalAttribs in ogni campo
		this.spreadAdditionalAttribs(fieldsDataCopy);

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
		fieldsDataCopy.push(submitBtn, resetBtn);

		// Invio i campi al componente padre
		this.props.onSubmit(this.state.title, fieldsDataCopy);

		// Resetto il form
		this.setState({ title: '', fieldsData: [{}] });
	};

	recomputeUsedNames = () => {
		const newUsedNames = this.state.fieldsData
			.filter(field => field.name)
			.map(field => field.name);

		if (newUsedNames.length !== this.usedNames.length) {
			this.usedNames = newUsedNames;
			return true;
		}

		for (let i = 0; i < newUsedNames.length; i++) {
			if (newUsedNames[i] !== this.usedNames[i]) {
				this.usedNames = newUsedNames;
				return true;
			}
		}

		// Non ci sono stati cambiamenti, this.usedNames è la stessa di prima
		return false;
	};

	render() {
		this.recomputeUsedNames();

		return (
			<form onSubmit={this.handleSubmit} className='form-builder'>
				<h1>FORM BUILDER</h1>

				<fieldset className='title-container'>
					<Input
						type='text'
						name='formTitle'
						id='formTitle'
						fieldValue={this.state.title}
						onChange={e => this.setState({ title: e.target.value })}
						label='Form Title'
						errMsg='Only numbers and letters'
						required={true}
						pattern='[a-zA-Z0-9 ]{0,}'
						placeholder='Insert the title of the form you are building'
					/>
				</fieldset>

				{this.state.fieldsData.map((fieldData, indx) => (
					<fieldset key={indx} className='fb-container'>
						<header className='builder-header'>
							<h2>BUILD FIELD {indx + 1}</h2>
							<RemoveButton
								id='remove-field'
								onClick={() => this.removeField(indx)}
								title='REMOVE THIS FIELD'
							/>
						</header>
						<FieldBuilder
							indx={indx}
							fieldData={fieldData}
							usedNames={this.usedNames}
							onChange={this.handleChange}
						/>
					</fieldset>
				))}
				<AddButton
					id='add-field'
					label='ADD NEW FIELD'
					onClick={this.addField}
				/>
				<FormButton
					type='submit'
					id='submit'
					onClick={this.addField}
					value='SUBMIT'
				/>
			</form>
		);
	}
}

FormBuilder.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

export default FormBuilder;
