module.exports = {
	'spacing': '1em',
	'colors' : {
		'blue' : '#0075BF',
		'green' : '#5cb85c',
		'red' : '#ec2c2c',
		'yellow' : '#ffe000',
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
	'primary': 'colors(blue)',
	'secondary': 'adjust-color(primary,$hue: 180deg)',
	// 'tertiary': 'colors(greystronger)',

	'success': 'colors(green)',
	'info': 'colors(blue)',
	'warning': 'colors(yellow)',
	'error': 'colors(red)',
	
	'radius': '2px',
	'border-default-size': '1px',
	'border-default-color': 'colors(black)',


	'body': {
		'background': 'change-color(primary,$lightness:98%)',
		// 'background': 'colors(greylighter)',
		'block-background': 'change-color(primary,$lightness:99%)',
		// 'block-background': 'colors(white)',
		'font-color': 'contrastFW(colors(blacklight),change-color($primary,$lightness:98%))',
		// 'font-color': 'change-color(primary,$lightness:10%)',
		// 'font-color': 'colors(greystronger)',
		// 'font-color-title': 'change-color(primary,$lightness:10%)',
		// 'font-color-title': 'colors(greystronger)',
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
	'enable-bd': true,
}