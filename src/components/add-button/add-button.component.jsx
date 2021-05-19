import React from 'react';
import './add-button.style.scss';

const AddButton = ({ label, onClick, ...additionalHtml }) => (
	<button
		className='add-btn'
		type='button'
		onClick={onClick}
		{...additionalHtml}>
		<span>&#10010;</span>
		<span>{label}</span>
	</button>
);

export default AddButton;
