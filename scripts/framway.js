var cmd  = process.argv[2] || 'displayConfig';
var config = require('../framway.config.js');
var fs = require('fs-extra');

var configCleaned = JSON.parse(JSON.stringify(config));
// console.log(configCleaned);
for (var i in configCleaned.components) {
	if (configCleaned.components[i].split('/').length > 1) {
      configCleaned.components[i] = configCleaned.components[i].substr(configCleaned.components[i].lastIndexOf('/')+1).replace('.git','').replace('framway-component-','');
  }
}
for (var i in configCleaned.themes) {
	if (configCleaned.themes[i].split('/').length > 1) {
      configCleaned.themes[i] = configCleaned.themes[i].substr(configCleaned.themes[i].lastIndexOf('/')+1).replace('.git','').replace('framway-theme-','');
  }
}


var onBuildStart = function(){
	fs.remove('.ready',function(err){
	    if(err)
	      console.log('\n'+err.message+'\n');
	    else{
	      	console.log('\n Build has started... \n');
			rewriteRuntimeConfig()
	    }
	})
}


var onBuildEnd = function(){
	fs.appendFileSync('.ready','');
 	 console.log('\n Build has ended \n');
}

var rewriteRuntimeConfig = function(){
	// components
	let strRTC_js   = "/* /!\\ WARNING: this file is rewritten at compilation. Do not edit unless you know what you're doing. */\n";
	let strRTC_scss = "/* /!\\ WARNING: this file is rewritten at compilation. Do not edit unless you know what you're doing. */\n";
	for(var name of config['components']){
		strRTC_js += 'require(\'./../../components/'+name+'/'+name+'.js\');\n';
		strRTC_scss += '@use \'./../../components/'+name+'/'+name+'.scss\';\n';
	}
	// themes
	for(var name of config['themes']){
		strRTC_js += 'require(\'./../../themes/'+name+'/'+name+'.js\');\n';
		strRTC_scss += '@use \'./../../themes/'+name+'/'+name+'.scss\';\n';
	}

	// console.log(strRTC_js);	
	// console.log(strRTC_scss);	
 	if(strRTC_js != fs.readFileSync('./src/core/js/runtime.config.js', 'utf8')){
	  	fs.outputFileSync( './src/core/js/runtime.config.js',strRTC_js);
	    console.log('### Runtime js file rewritten \n');
	}

	if(strRTC_scss != fs.readFileSync('./src/core/scss/runtime.config.scss', 'utf8')){
	  	fs.outputFileSync( './src/core/scss/runtime.config.scss',strRTC_scss);
	    console.log('### Runtime scss file rewritten \n');
	}
}

var displayConfig = function(){
	console.log('\n### THEMES')
	for (var i = 0; i < config.themes.length; i++) {
		console.log(' - '+config.themes[i]);
	}
	console.log('\n### COMPONENTS')
	for (var i = 0; i < config.components.length; i++) {
		console.log(' - '+config.components[i]);
	}
}

switch(cmd){
	case 'displayConfig'	: displayConfig(); break;
	case 'onBuildStart' 	: onBuildStart() ; break;
	case 'onBuildEnd' 	    : onBuildEnd() ; break;
	default: console.log('\n Unknown command used: '+cmd+'\n'); break;
}