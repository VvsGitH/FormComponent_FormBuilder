import React from 'react';
import './remove-button.style.scss';

const RemoveButton = ({ onClick, title, ...additionalHtml }) => (
	<button
		className='rm-btn'
		type='button'
		title={title}
		onClick={onClick}
		{...additionalHtml}>
		&#10006;
	</button>
);

export default RemoveButton;
