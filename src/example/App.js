import React from 'react';

import Form from '../form/form.component';
import myForm from './form.data';
import './App.scss';

function App() {
	// Il componenete padre deve fornire la propria funzione handleSubmit
	//  al form. La funzione, oltre all'evento, riceve anche i valori
	//  contenuti in tutti i campi del form.

	const handleSubmit = (event, fields) => {
		event.preventDefault();
		console.log('FORM SUBMITTED');
		console.log(fields);
	};

	// Il form richiede come prop un array di oggetti - myForm - contenente
	//  le caratteristiche degli elementi da inserire del form.

	return (
		<div className='App'>
			<h1>MY CUSTOM FORM</h1>
			<Form formData={myForm} onSubmit={handleSubmit} />
		</div>
	);
}

export default App;
