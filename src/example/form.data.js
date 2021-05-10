const myForm = [
	// FULL NAME
	{
		type: 'text',
		name: 'fullName',
		id: 'fn-1',
		placeholder: 'Insert your full name',
		label: 'Full Name',
		pattern: '[a-zA-Z ]{0,}',
		errMsg: 'Only letters allowed',
	},

	// GENDER RADIO SELECTORS
	{
		type: 'radios',
		name: 'gender',
		// Questo è l'id del fragment principale
		id: 'gender-radios',
		// Questo è il label principale, che descrive tutte le opzioni
		label: 'Select your gender',
		// Ogni opzione avrà un suo id generato come name-option
		// Ogni opzione avrà un proprio label, generato a paritire dal nome
		options: ['male', 'female', 'other'],
	},

	// BIRTHDATE
	{
		type: 'date',
		name: 'birthdate',
		id: 'birth-1',
		label: 'Insert your birth date',
		min: '1920-01-01',
		max: '2021-05-05',
		errMsg:
			'Dates previous to 1920 are not allowed\nDates next to today are not allowed',
	},

	// COUNTRY SELECTOR
	// Genera un tag <select> con all'interno i tag <option>
	//  specificati nel campo 'options'
	{
		type: 'select',
		name: 'country',
		// id e label si riferiscono al tag <select>
		id: 'country-1',
		label: 'Select your country',
		// Ogni <option> avrà una key univoca e un campo value pari alla
		//  stringa inserita qui sotto.
		options: ['Italy', 'USA', 'UK', 'France', 'Spain', 'Germany'],
	},

	// PHONE NUMBER - Si potrebbe migliorare
	{
		type: 'tel',
		name: 'tel',
		id: 'tel-1',
		placeholder: '+39',
		label: 'Phone Number',
		mask: '+39 ### ### ####',
		pattern: '^\\+39 ([0-9]{3}) ([0-9]{3}) ([0-9]{4})$',
		errMsg: 'Insert a valid phone number\nEg: +39 333 444 5555',
	},

	// USERNAME
	{
		type: 'text',
		name: 'user',
		id: 'user-1',
		placeholder: 'Insert your user name',
		label: 'User Name',
		required: true,
		maxLength: '10',
		pattern: "[^$&+,:;.=?@#|'<>^*()%! ]{0,}",
		errMsg: 'Max 10 chars\nNo spaces, no special chars.',
	},

	// EMAIL
	{
		type: 'email',
		name: 'email',
		id: 'email-1',
		placeholder: 'Insert your email',
		label: 'Email',
		required: true,
		pattern: '^([a-z0-9-]+\\.?)+[a-z0-9-]+@([a-z-]+\\.)+[a-z-]{2,4}$',
		errMsg: 'Insert a correct email address\nEg: my.address@domain.com',
	},

	// PASSWORD
	{
		type: 'password',
		name: 'password',
		id: 'pass-1',
		placeholder: 'Insert your password',
		label: 'Password',
		required: true,
		pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,15}',
		errMsg: `From 6 to 15 character.
    	At least one lower case char.
    	At least one upper case char.
    	At least one number.`,
	},

	// CONFIRM PASSWORD - La validazione è fatta in React
	{
		type: 'password',
		name: 'confirmPassword',
		id: 'conf-pass-1',
		placeholder: 'Confirm your password',
		label: 'Confirm Password',
		required: true,
		equalTo: 'password',
		errMsg: 'The two password fields must be identical!',
	},

	// FILE - CURRICULUM VITAE
	{
		type: 'file',
		name: 'curriculum',
		id: 'curriculum',
		label: 'Curriculum Vitae',
		accept:
			'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.oasis.opendocument.text',
		errMsg: 'The file format is invalid',
	},

	// TEXTAREA - ADDITIONAL INFO
	// Genera un tag <textarea />
	{
		type: 'textarea',
		name: 'additionalInfo',
		id: 'add-info',
		placeholder: 'Write some additional info',
		rows: '5',
		label: 'Additional Info',
		info:
			'Inserisci tutte le informazioni aggiuntive che sono state richieste nel bando.',
	},

	// CHECKBOX -> PRIVACY
	{
		type: 'checkboxes',
		name: 'privacy',
		id: 'privacy-1',
		options: [
			{
				label:
					'Acconsenti al trattamento dei dati necessari per il funzionamento?',
				required: true,
			},
			{
				label: 'Acconsenti al trattamento dei dati per fini commerciali?',
				required: false,
			},
			{
				label: 'Acconsenti al trattamento dei dati da parte di terzi?',
				required: false,
			},
		],
		label: 'Acconsenti al trattamento dei dati?',
		info: "Leggi l'informativa sulla privacy al seguente link: _link_",
	},

	// SUBMIT E RESET
	{
		type: 'submit',
		name: 'submit-button',
		id: 'submit-1',
		// Il campo value descrive la scritta sul pulsante
		value: 'SUBMIT',
	},
	{
		type: 'reset',
		name: 'reset-button',
		id: 'reset-1',
		// Il campo value descrive la scritta sul pulsante
		value: 'RESET',
	},
	{
		type: 'button',
		name: 'custom-button',
		id: 'custom-1',
		value: 'LOG',
		onClick: () => console.log('I AM A CUSTOM BUTTON'),
	},
];

export default myForm;
