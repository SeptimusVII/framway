module.exports = {
	'spacing': '1rem',
	'colors' : {
		'blue' : '#0075BF',
		'green' : '#5cb85c',
		'red' : '#E54949',
		'darkblue' : '#0c264c',
		'gold' : '#EDDD00',
		'black' : '#000000',
		'blacklight' : '#111414',
		'blacklighter' : '#222222',
		'greystronger' : '#424041',
		'greystrong' : '#535052',
		'grey' : '#7A7778',
		'greylight' : '#DDDDDD',
		'greylighter' : '#EEEEEE',
		'white' : '#ffffff',
		'none' : 'transparent',
	},
	'primary': 'colors(darkblue)',
	'secondary': 'colors(blue)',
	'tertiary': 'colors(greystronger)',

	'success': 'colors(green)',
	'info': 'colors(blue)',
	'warning': 'colors(gold)',
	'error': 'colors(red)',
	
	'radius': '2px',
	'border-default-size': '1px',
	'border-default-color': 'colors(black)',


	'body': {
		'background': 'colors(greylighter)',
		'block-background': 'colors(white)',
		'font-color': 'colors(greystronger)',
		'font-color-title': 'colors(greystronger)',
		'font-size'		: '18px',
		'font-size-sm'	: '16px',
		'font-size-xxs'	: '14px',
		'line-height' 	: '1.45',
	},
	'header': {
		'background': 'colors(white)',
		'font-color': 'body(font-color)',
		'font-size': 'body(font-size)',
	},
	'footer': {
		'background': 'colors(white)',
		'font-color': 'body(font-color)',
		'font-size': 'body(font-size)',
	},


	'input': {
		'background': 'colors(white)',
		'font-color': 'colors(greystronger)',
		'border-color': 'colors(grey)',
		'border-size': 'border-default-size',
		'placeholder-font-color': 'colors(grey)',
		'radius': false,
	},
	'input-focus': {
		'background': 'input(background)',
		'font-color': 'input(font-color)',
		'border-color': 'input(border-color)',
	},
	'input-valid': {
		'background': 'input(background)',
		'font-color': 'input(font-color)',
		'border-color': 'input(border-color)',
	},
	'input-invalid': {
		'background': 'input(background)',
		'font-color': 'input(font-color)',
		'border-color': 'error',
	},


	'link': {
		'font-color': 'primary',
		'font-color-hover': 'primary',
		'font-color-focus': 'primary',
		'underline': false,
		'underline-on-hover': true,
	},
	'btn':{
		'background': 'primary',
		'font-color': 'contrastFW(colors(white),primary)',
		'border-size': 'border-default-size',
		'radius': true,
		'uppercase': true,
		'font-weight': 300,
		'exclude': ['.exclude'],
	},

	'breakpoints': {
		'xl' 	: '1400px',
		'lg' 	: '1200px',
		'md' 	: '992px',
		'sm' 	: '768px',
		'xs' 	: '620px',
		'xxs'   : '520px',
	},

	'enable-bg': true,
	'enable-bg-extended': false,
	'enable-bd': true,
}