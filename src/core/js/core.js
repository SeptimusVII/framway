var config  =  require('../../../framway.config.js');
for (var i in config.components) {
  if (config.components[i].split('/').length > 1) {
      config.components[i] = config.components[i].substr(config.components[i].lastIndexOf('/')+1).replace('.git','').replace('framway-component-','');
  }
}
for (var i in config.themes) {
  if (config.themes[i].split('/').length > 1) {
      config.themes[i] = config.themes[i].substr(config.themes[i].lastIndexOf('/')+1).replace('.git','').replace('framway-theme-','');
  }
}

class Framway {
	constructor(){
			let framway = this;
			framway.debug = config.debug?config.debug:false;
			framway.version = require('../../../package.json').version;
			for(var key in config)
			  framway[key] = config[key];
		  framway.components_active = {};
			
			return framway;
	}

	init(){
		let framway = this;
		require('./pipeline.js');

		// load components
		for(var component of framway.components){
			// init elements in dom
			if (typeof framway[utils.strToPascalCase(component)] == 'function') {
				document.querySelectorAll('.'+component).forEach((el)=>{
					new framway[utils.strToPascalCase(component)](el)
				})
			}
	    var timerResize;
			window.addEventListener("resize", function(){
			  clearTimeout(timerResize);
			  timerResize = setTimeout(function(){
			  	for(var el of fw.components_active[component])
			      el.onResize();
			  },300);
			});
		}
	}
}

Framway.prototype.utils = global.utils = require('./utils.js');
Framway.prototype.Component = require('./component.js');

if(navigator.userAgent.indexOf('AppleWebKit') != -1)
  document.querySelector('html').classList.add('webkit');

global.viewport = utils.getDimensions();
window.addEventListener("resize", function(){
  viewport = utils.getDimensions();
  utils.adjustTooltips(); // todo: move this to futur component
});

module.exports = new Framway();
