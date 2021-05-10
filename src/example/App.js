import React, { useCallback, useState } from 'react';

import './App.scss';

import Form from '../components/form/form.component';
import { stringifyAndHash } from '../components/form/form.utils';

import myForm from './form.data';
const FORM_KEY = stringifyAndHash(myForm);

function App() {
	// TestState per testare il ri-rendering del form a seguito del
	//  ri-rendering del padre.

	const [testState, setTestState] = useState(false);
	const [isFormVisible, setFormVisible] = useState(true);
	const [formFields, setFormFields] = useState(null);

	// Il componenete padre deve fornire la propria funzione handleSubmit
	//  al form. La funzione, riceve anche i valori contenuti in tutti i
	//  campi del form.

	const handleSubmit = useCallback(fields => {
		console.log('FORM SUBMITTED');
		setFormFields(fields);
		//setFormVisible(false);
	}, []);

	// Il form richiede come prop un array di oggetti - myForm - contenente
	//  le caratteristiche degli elementi da inserire del form.

	return (
		<>
			<h1>MY CUSTOM FORM</h1>

			<div className='ri-render-test'>
				<p>Click this button to re-render the App component</p>
				<button onClick={() => setTestState(!testState)}>RI-RENDER APP</button>
				<p>Click this button to show/hide the form</p>
				<button onClick={() => setFormVisible(!isFormVisible)}>
					SHOW/HIDE
				</button>
				<p>CLick this button to log the form fields</p>
				<button onClick={() => console.log(formFields)}>LOG</button>
			</div>

			{isFormVisible && (
				<Form key={FORM_KEY} formData={myForm} onSubmit={handleSubmit} />
			)}
		</>
	);
}

export default App;
