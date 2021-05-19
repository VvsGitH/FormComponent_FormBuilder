import React, {
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';

import './App.scss';

import FormBuilder from '../form-builder/form-builder/form-builder.component';

import Form from '../form-custom/form/form.component';
import { stringifyAndHash } from '../form-custom/form/form.utils';
import myForm from './form.data';

const FORM_KEY = stringifyAndHash(myForm);

const tabsReducer = (state, action) => {
	switch (action.type) {
		case 'defaultVisibile':
			return {
				default: !state.default,
				custom: false,
				builder: false,
			};
		case 'customVisible':
			return {
				default: false,
				custom: !state.custom,
				builder: false,
			};
		case 'builderVisible':
			return {
				default: false,
				custom: false,
				builder: !state.builder,
			};
		default:
			return state;
	}
};

function App() {
	const [visible, dispatch] = useReducer(tabsReducer, {
		default: false,
		custom: false,
		builder: false,
	});

	const [customFormData, setCustomFormData] = useState(null);

	const customFormKey = useRef();
	useEffect(
		() => (customFormKey.current = stringifyAndHash(customFormData)),
		[customFormData]
	);

	// Il componenete padre deve fornire la propria funzione handleSubmit
	//  al form. La funzione, riceve i valori contenuti in tutti i
	//  campi del form.

	const handleSubmit = useCallback(fields => {
		console.log('FORM SUBMITTED');
		console.log(fields);
	}, []);

	const receiveCustomFormData = useCallback(
		data => setCustomFormData(data),
		[]
	);

	// Il form richiede come prop un array di oggetti - myForm - contenente
	//  le caratteristiche degli elementi da inserire del form.

	return (
		<>
			<h1>MY CUSTOM FORM</h1>

			<div className='tabs-container'>
				<button onClick={() => dispatch({ type: 'builderVisible' })}>
					{(visible.builder ? 'HIDE' : 'SHOW') + ' FORM BUILDER'}
				</button>
				{customFormData && (
					<button onClick={() => dispatch({ type: 'customVisible' })}>
						{(visible.custom ? 'HIDE' : 'SHOW') + ' BUILDED FORM'}
					</button>
				)}
				<button onClick={() => dispatch({ type: 'defaultVisibile' })}>
					{(visible.default ? 'HIDE' : 'SHOW') + ' DEMO FORM'}
				</button>
			</div>

			{visible.default && (
				<Form key={FORM_KEY} formData={myForm} onSubmit={handleSubmit} />
			)}
			{visible.builder && <FormBuilder onSubmit={receiveCustomFormData} />}
			{visible.custom && (
				<Form
					key={customFormKey.current}
					formData={customFormData}
					onSubmit={handleSubmit}
				/>
			)}
		</>
	);
}

export default App;
