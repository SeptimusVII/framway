var config  =  require('../../../fwl.config.js');
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

require('./runtime.config.js');

class FramwayLite {
	constructor(){
		let fwl = this;
		fwl.version = require('../../../package.json').version;
		for(var key in config)
		  fwl[key] = config[key];
	
	}
}


module.exports = new FramwayLite();