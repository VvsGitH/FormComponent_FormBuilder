import React, { useCallback, useState } from 'react';

import './App.scss';

import FormBuilder from '../form-builder/form-builder/form-builder.component';
import Form from '../form-custom/form/form.component';
import { stringifyAndHash } from '../form-custom/form/form.utils';

import FORM_DATA from './form.data';
const FORM_KEY = stringifyAndHash(FORM_DATA);

// Questa è una semplice demo per mostrare le potenzialità del componente Form.

// Form genera un form a partire da un array di oggetti js; ogni oggetto
//  contiene gli attributi che descrivono un campo del form. I campi supportati
//  sono elencati in form.types.js
// Form genera il proprio stato interno a partire dall'array js che gli viene
//  passato come prop ed è un componente completamente incontrollato, in quanto
//  presuppone che tale array sia una costante.
// Per tutti quei casi in cui l'array varia dinamicamente, è necessario passare
//  a Form una chiave univoca generata a partire dall'array. Per farlo, in
//  form.utils.js è presente la funzione stringifyAndHash.

// La demo si divide in tre sezioni.

// La prima è il default-form, un semplice form generato a partire dal file
//  form.data.js, che cerca di mostrare la varietà di campi generabili dal
//  componente Form.

// La seconda è il componente FormBuilder, che permette all'utente di creare
//  graficamente un form. FormBuilder genera infatti un array js compatibile
//  con il componente Form.

// La terza sezione appare solo dopo aver sottoscritto il formBuilder e contiene
//  il form generato graficamente dall'utente.

const App = () => {
	// Per semplicità, al posto di creare tre diverse pagine, utilizzando il
	//  routing, utilizzo lo stato tabsState per mostrare/nascondere
	//  dinamicamente le tre sezioni di cui è composta questa app.
	const [tabsState, setTabs] = useState({
		default: false, // Il form di esempio generato da FORM_DATA
		builder: false, // Il form builder
		custom: false, // Il form generato dopo il submit del form builder
	});

	// Deve essere mostrata a schermo solo una tab alla volta
	const toggleTab = tabName => {
		const newTabsState = { default: false, custom: false, builder: false };
		newTabsState[tabName] = !tabsState[tabName];
		setTabs(newTabsState);
	};

	// Questo stato raccoglie i dati forniti dal submit del formbuilder e
	//  serve a generare il custom form. In sostanza, contiene quelli che per
	//  il form di esempio sono title, FORM_DATA e FORM_KEY
	const [customForm, setCustomForm] = useState({
		title: '',
		formData: null,
		key: null,
	});

	// Ricevo i dati contenuti nei campi del FormBuilder e li carico nello
	//  stato customForm, in modo da generare il form descritto dall'utente
	const handleFBSubmit = useCallback((title, formData) => {
		// Creo la chiave univoca
		const key = stringifyAndHash(formData);
		// Setto lo stato con i dati aggiornati del custom form
		setCustomForm({
			title,
			formData,
			key,
		});
	}, []);

	// Funzione a scopo dimostrativo che viene evocata quando il default form
	//  o il custom form vengono sottoscritti.
	const handleFormSubmit = useCallback(fields => {
		console.log('FORM SUBMITTED');
		console.log(fields);
	}, []);

	return (
		<>
			<div className='tabs-container'>
				<button onClick={() => toggleTab('builder')}>
					{(tabsState.builder ? 'HIDE' : 'SHOW') + ' FORM BUILDER'}
				</button>
				{customForm.formData && (
					<button onClick={() => toggleTab('custom')}>
						{(tabsState.custom ? 'HIDE' : 'SHOW') + ' BUILDED FORM'}
					</button>
				)}
				<button onClick={() => toggleTab('default')}>
					{(tabsState.default ? 'HIDE' : 'SHOW') + ' DEMO FORM'}
				</button>
			</div>

			{tabsState.builder && <FormBuilder onSubmit={handleFBSubmit} />}

			{tabsState.custom && (
				<Form
					key={customForm.key}
					title={customForm.title}
					formData={customForm.formData}
					onSubmit={handleFormSubmit}
				/>
			)}

			{tabsState.default && (
				<Form
					key={FORM_KEY}
					title='DEMO FORM'
					formData={FORM_DATA}
					onSubmit={handleFormSubmit}
				/>
			)}
		</>
	);
};

export default App;
