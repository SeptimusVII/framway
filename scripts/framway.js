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
			constructPipeline()
	    }
	})
}
var onBuildEnd = function(){
	fs.appendFileSync('.ready','');
 	 console.log('\n Build has ended \n');
}

var onWatchStart = function(){
	checkFoldersAndFiles()
}
var onWatchEnd = function(){}

var checkFoldersAndFiles = function(){
	return new Promise(function(resolve,reject){
		if (!fs.existsSync('./src/themes/')){
			fs.mkdir('./src/themes/',function(err){
				if(err)
					console.log('\n'+err.message+'\n');
			});
		}
		if (!fs.existsSync('./src/components/')){
		    fs.mkdir('./src/components/',function(err){
		    		if(err)
		      		console.log('\n'+err.message+'\n');
		    });
		}

		// create files if they do not exist 
		if (!fs.existsSync('./src/core/less/pipeline.less'))
			fs.appendFileSync('./src/core/less/pipeline.less','');
		if (!fs.existsSync('./src/core/js/pipeline.js'))
			fs.appendFileSync('./src/core/js/pipeline.js','');
		resolve();
	});
}

var constructPipeline = function(){
	fs.ensureFileSync('./src/core/js/pipeline.js');
	fs.ensureFileSync('./src/core/less/pipeline.less');

	let warning_msg = "/* /!\\ WARNING: this file is rewritten at compilation. Do not edit unless you know what you're doing. */\n";
	let strPip_js   = "";
	let strPip_less = "";
	let strPip_less_config     = "/* Default configuration & mixins */\n@import 'config';\n";
	let strPip_less_components = "/* Components styles */\n";
	let strPip_less_themes     = "/* Themes styles override */\n";

	// components
	for(var name of config['components']){
		strPip_js += 'require(\'./../../components/'+name+'/'+name+'.js\');\n';
		strPip_less_components += '@import \'./../../components/'+name+'/'+name+'.less\';\n';
	}
	// themes
	for(var name of config['themes']){
		strPip_js += 'require(\'./../../themes/'+name+'/'+name+'.js\');\n';
		strPip_less_config += '@import \'./../../themes/'+name+'/config\';\n';
		strPip_less_themes += '@import \'./../../themes/'+name+'/'+name+'\';\n';
	}

	strPip_js = warning_msg + strPip_js;
	strPip_less = warning_msg + strPip_less_config + '/* Core styles */\n@import \'core\';\n' + strPip_less_components + strPip_less_themes;

 	if(strPip_js != fs.readFileSync('./src/core/js/pipeline.js', 'utf8')){
	  	fs.outputFileSync( './src/core/js/pipeline.js',strPip_js);
	    console.log('### Runtime js file rewritten \n');
	}

	if(strPip_less != fs.readFileSync('./src/core/less/pipeline.less', 'utf8')){
	  	fs.outputFileSync( './src/core/less/pipeline.less',strPip_less);
	    console.log('### Runtime less file rewritten \n');
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
	case 'displayConfig'	    : displayConfig(); break;
	case 'onWatchStart' 	    : onWatchStart() ; break;
	case 'onWatchEnd' 	        : onWatchEnd() ; break;
	case 'onBuildStart' 	    : onBuildStart() ; break;
	case 'onBuildEnd' 	        : onBuildEnd() ; break;
	case 'constructPipeline' : constructPipeline(); break;
	default: console.log('\n Unknown command used: '+cmd+'\n'); break;
}