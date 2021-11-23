global.app = require('./core/js/framway.js');
app.lang 	??= document.querySelector('html').getAttribute('lang') || navigator.language.split('-')[0];
app.labels 	??= {
	errors: {
		inputs:{
			empty: {
				fr: 'Veuillez remplir le champ "%s"',
				en: 'Please fill the field "%s"',
			},
			incorrect: {
				fr: 'La valeur renseignée dans le champ "%s" est incorrecte',
				en: 'The value entered in the "%s" field is incorrect',
			}
		}
	},
	buttons: {
		next : {
			fr: 'Suivant',
			en: 'Next',
		},
		prev : {
			fr: 'Précédent',
			en: 'Previous',
		},
		send : {
			fr: 'Envoyer',
			en: 'Send',
		},
	}
};
app.loadComponents(app.components);
app.loadThemes(app.themes);