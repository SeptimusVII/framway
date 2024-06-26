var shell = require('shelljs');
var fs = require('fs-extra');
var cmd  = process.argv[2] || 'displayConfig';
var forceUpdate = process.argv[3] === 'forceUpdate' ? true : false;
var config = require('../framway.config.js');

var configCleaned = JSON.parse(JSON.stringify(config));
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

var initFramway = function(){
	console.log('\n### Framway\'s initialisation...');
	checkExistingFolders().then(function(){
		if (config.themes.length) {
			console.log('\n### Importing themes...');
			getThemes(config.themes);
		}
		if (config.components.length) {
			console.log('\n### Importing components...');
			getComponents(config.components);
		}
		// toggleFilesIndex();
		console.log('\n### Framway\'s initialisation end\n');
	}).catch(function(err){
		console.log('something wrong happened: '+err);
	})
}

var updateFramway = function(){
	checkIntegrity().then(function(result){
		if (result === true || forceUpdate === true) {
			console.log('\n### Framway\'s updating...');
			checkExistingFolders().then(function(){
				console.log('\n### Stashing files...');
			  shell.exec('git stash');
				console.log('\n### Pulling framway...');
			  shell.exec('git pull');
			  console.log('\n### Unstashing files...');
			  shell.exec('git stash pop');
			  console.log('\n### Install npm dependencies...');
			  shell.exec('npm install');
				if (config.themes.length) {
					console.log('\n### Updating themes...');
					getThemes(config.themes);
				}
				if (config.components.length) {
					console.log('\n### Updating components...');
					getComponents(config.components);
				}
				console.log('\n### Framway\'s update end\n');
			}).catch(function(err){
				console.log('something wrong happened: '+err);
			})
		}
	})
}

var getThemes = function(arrThemes){
	for (var i = 0; i < arrThemes.length; i++) {
	  shell.exec('npm run theme '+arrThemes[i]+' get');      
		console.log(' - Theme "'+arrThemes[i]+'" installed');
	}
}
var getComponents = function(arrComponents){
	for (var i = 0; i < arrComponents.length; i++) {
	  shell.exec('npm run component '+arrComponents[i]+' get');      
		console.log(' - Component "'+arrComponents[i]+'" installed');
	}
}

var checkExistingFolders = function(){
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
		if (!fs.existsSync('./vendor/')){
	    fs.mkdir('./vendor/',function(err){
	  		if(err)
	    		console.log('\n'+err.message+'\n');
	    	else
					fs.appendFileSync('./vendor/index.js','');
	    });
		}
		// fs.appendFileSync('./src/scss/framway.scss','');
		resolve();
	});
}

var toggleFilesIndex = function(disable = true){
	var files = [
		'framway.config.js',
		'webpack.config.js',
		'package.json',
		'package-lock.json',
		'vendor/index.js',
		// 'src/index.js',
	]
	var param = '--assume-unchanged';
	if (disable == 'false')
		param = '--no-assume-unchanged';
	console.log('\n### Updating files index status...');
	for(var file of files){
		shell.exec('git update-index '+param+' '+file);
		console.log(' - update index status of '+file+': '+(disable=='false'?'tracked':'not tracked'));
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



// REGEXP
//  \w+\(\w.*\) -- full function
// \(.*\)  -- function parameters
var combineConfigs = function(){
	// creating files if they don't exist
	fs.ensureFileSync('./src/combined/export.scss');
	fs.ensureFileSync('./src/combined/_config.scss');
	fs.ensureFileSync('./src/combined/framway.scss');

	var configJS = require('../src/core/config.js');
	// merging all config we have
	for (var i = 0; i < configCleaned.themes.length; i++){
		var configTheme = require('../src/themes/'+configCleaned.themes[i]+'/config.js');
		configJS = mergeDeep(configJS,configTheme);
	}

  // SCSS CONFIG COMBINER
  function SCSSconvertFN(str){
  	// console.log('-----------');
  	// console.log(str);
  	// var fnName 	 = String(str).match(/\w+\(\w.*\)/)[0].replace(/\(.*\)/,'').replace('','').replace('colors','color');
  	var fnName 	 = String(str).replace(/\(.*\)/,'').replace('','').replace('colors','color');
		var fnParams = String(str).match(/\(.*\)/)[0];
		// console.log(fnName);
		fnParams = fnParams.substr(1);
		fnParams = fnParams.substr(0, fnParams.length-1).split(',');
		str = fnName +'(';
		for(var i in fnParams){  // searching for function or vars in the function parameters
			if (fnParams[i].match(/\w+\(\w.*\)/))
				fnParams[i] = SCSSconvertFN(fnParams[i]);
			if(configJS.hasOwnProperty(fnParams[i]))
				fnParams[i] = SCSSconvertVAR(fnParams[i]);
			if (i>0)
				str+=',';
			str += String(fnParams[i]).replace('colors','color');
		}
		str += ')';
  	// console.log('-----------');
  	return str;
  }
  function SCSSconvertVAR(str){
		return '$'+str.replace('colors','color');
  }
  function formatStr(str){
  	var resultStr = '';
  	// console.log(str, typeof str, Array.isArray(str));
  	if (typeof str === 'object') {
  		if (Array.isArray(str)) resultStr += '[';
  		else resultStr += '(';
  		var i = 0;
  		for(var key in str){
  			if (i!=0)
  				resultStr += ',';
  			if (Array.isArray(str)) 
  				resultStr += ''+formatStr(str[key]);
  			else 
  				resultStr += '\''+key+'\': '+formatStr(str[key]);
  			i++;
  		}
  		if (Array.isArray(str)) resultStr += ']';
  		else resultStr += ')';
  		
  	} else {
  		if (String(str).match(/\w+\(\w.*\)/)) 
			resultStr += SCSSconvertFN(str);
		else if (configJS.hasOwnProperty(str)) 
  			resultStr += SCSSconvertVAR(str);
  		else if (String(str).match(/px$|em$|rem$|ch$|vh$|vw$|%$|^[0-9]*[0-9]$|\d.\d|transparent|^#|true|false/))
  			resultStr += String(str).replace('colors','color');
  		else
  			resultStr += '\''+String(str).replace('colors','color')+'\'';
  	}
  	return resultStr;
  }

  var strConfigSCSS = "/* /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process. */\n";
  for(var key in configJS){
  	// console.log(key, configJS[key]);
  	if (typeof configJS[key] === 'object') {
  		strConfigSCSS += '$'+key+': (\n';
  		for(var name in configJS[key]){
  			strConfigSCSS += '	\''+name+'\': '+ formatStr(configJS[key][name]) +',\n';
  		}
  		strConfigSCSS += ');\n';
  		strConfigSCSS += '@function '+(key == 'colors'?'color':key)+'($item) {@return map-get($'+key+', \'#{$item}\');}\n\n';
  	} else {
  		strConfigSCSS += '$'+key+': '+formatStr(configJS[key])+';\n'
  	}
  }
  if(strConfigSCSS != fs.readFileSync('./src/combined/_config.scss', 'utf8')){
  	fs.outputFileSync( './src/combined/_config.scss',strConfigSCSS);
    console.log('\n### Combined config SCSS rewritten \n');
	}
  // SCSS CONFIG COMBINER END
  
  // SCSS EXPORT
  var strExport = "/* /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process. */\n"
  			  			+ '@import \'../core/scss/vars\';\n'
  			  			+ '@import \'../core/scss/mixins\';\n'
  			  			+ '@import \'config\';\n'
  			  			+ ':export{\n';
  for(var key in configJS){
  	if (typeof configJS[key] === 'object') {
			strExport += '	'+key+': #{inspect($'+key+')};\n';
  	} else {
  		strExport += '	'+key+': $'+key+';\n';
  	}
  }
  strExport += '}';
  if(strExport != fs.readFileSync('./src/combined/export.scss', 'utf8')){
    fs.outputFileSync( './src/combined/export.scss',strExport);
	  console.log('\n### Export SCSS rewritten \n');
	}
  // EXPORT END

  // FRAMWAY UPDATER
  var strFramway = "/* /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process. */\n"
			   				 + "/* Default configuration & mixins */\n"
             	   + "@import '../core/scss/mixins';\n"
             	   + "@import '../core/scss/vars';\n"
             	   + "@import 'config';\n"
	strFramway += "/* Core styles */\n"
	        		+ "@import '../core/scss/core';\n";
	strFramway += "/* Components styles */\n";
	for (var i = 0; i < configCleaned.components.length; i++) {
	  strFramway += "@import '../components/"+configCleaned.components[i]+"/"+configCleaned.components[i]+"';\n";
	}
	strFramway += "/* Themes styles override */\n";
	for (var i = 0; i < configCleaned.themes.length; i++) {
	  strFramway += "@import '../themes/"+configCleaned.themes[i]+"/"+configCleaned.themes[i]+"';\n";
	}
  if(strFramway != fs.readFileSync('./src/combined/framway.scss', 'utf8')){
		fs.outputFileSync('./src/combined/framway.scss',strFramway);
	  console.log('\n### Framway rewritten \n');
	}
	fs.copySync('./src/combined', './build/combined');
  // FRAMWAY UPDATER END
  
  // VENDORS UPDATER
  var strVendors = "// /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process. \n";
		
	strVendors += "import 'bootstrap/scss/bootstrap-reboot.scss';\n"
	strVendors += "import 'bootstrap/scss/bootstrap-grid.scss';\n"
	

	if(config.useToastr)
		strVendors += "import 'toastr/toastr.scss';\n"
					// + "global.toastr = require('toastr');\n";
	
	if(config.useOutdatebrowser){
		strVendors += "import outdatedBrowser from 'outdated-browser-rework';\n";
		strVendors += "import 'outdated-browser-rework/dist/style.css';\n";
		strVendors += `var el = document.createElement('div'); el.setAttribute('id','outdated');document.body.appendChild(el);outdatedBrowser({isUnknownBrowserOK:true,requiredCssProperty:'object-fit'} );\n`;
	}


	strVendors += "import objectFitImages from 'object-fit-images';\n"
						  + "objectFitImages();\n";

	if(strVendors != fs.readFileSync('./vendor/index.js', 'utf8')){
		fs.outputFileSync('./vendor/index.js',strVendors);
	    console.log('\n### vendors rewritten \n');
	}
  // VENDORS UPDATER END
}

var onBuildStart = function(){
	fs.remove('.ready',function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      console.log('\n Build has started... \n');
			combineConfigs();
    }
  })
}
var onBuildEnd = function(){
	fs.appendFileSync('.ready','');
  console.log('\n Build has ended \n');
}

var reset = function(){
	fs.remove('./src/components/',function(err){
      if(err)
          console.log('\n'+err.message+'\n');
       else
       		console.log('### components directory removed');
  });
  fs.remove('./src/themes/',function(err){
      if(err)
          console.log('\n'+err.message+'\n');
       else
       		console.log('### themes directory removed');
  });
  fs.remove('./src/combined/',function(err){
      if(err)
          console.log('\n'+err.message+'\n');
       else
       		console.log('### combined directory removed');
  });
}

var checkIntegrity = async function(){
		var updateCheck = {
			themes:[],
			components:[],
			requirestash: false,
		}
		// console.log(configCleaned);
		// console.log('\n### THEMES')
		for (var i = 0; i < configCleaned.themes.length; i++) {
			await new Promise(function(resolve,reject){
				if (fs.existsSync('./src/themes/'+configCleaned.themes[i]+'/.git')){
					shell.cd('./src/themes/'+configCleaned.themes[i]);
					shell.exec('git status --porcelain=v1',{silent:true},function(code,stdout,stderr){
						if (stdout) {
							updateCheck.themes.push(configCleaned.themes[i]);
							updateCheck.requirestash = true;
						}
						shell.cd('./../../..');
						resolve()
					})
				} else {
						resolve()
				}
			});
		}
		// console.log('\n### COMPONENTS')
		for (var i = 0; i < configCleaned.components.length; i++) {
			await new Promise(function(resolve,reject){
				if (fs.existsSync('./src/components/'+configCleaned.components[i]+'/.git')){
					shell.cd('./src/components/'+configCleaned.components[i]);
					shell.exec('git status --porcelain=v1',{silent:true},function(code,stdout,stderr){
						if (stdout) {
							updateCheck.components.push(configCleaned.components[i]);
							updateCheck.requirestash = true;
						}
						shell.cd('./../../..');
						resolve()
					})
				} else {
						resolve()
				}
			});
		}
		// console.log(updateCheck);
		if (updateCheck.requirestash) {
			console.log('\n### The followings have unsaved changes\n');
			if(updateCheck.themes.length){
				console.log('Themes:');
				for(var theme of updateCheck.themes)
					console.log(' - '+ theme);
			}
			if(updateCheck.components.length){
				console.log('Components:');
				for(var component of updateCheck.components)
					console.log(' - '+ component);
			}
			console.log('\nPlease commit or stash your changes before going further.\n');
			return false;
		} else {
			return true;
		}
}

var test = function(){
};

switch(cmd){
	case 'init'						: initFramway()  ; break;
	case 'update'					: updateFramway(); break;
	case 'displayConfig'	: displayConfig(); break;
	case 'combineConfigs' : combineConfigs() ; break;
	case 'toggleFiles'  	: toggleFilesIndex(process.argv[3]) ; break;
	case 'onBuildStart' 	: onBuildStart() ; break;
	case 'onBuildEnd'  		: onBuildEnd() ; break;
	case 'reset'  				: reset() ; break;
	case 'test'  				  : test() ; break;
	default: console.log('\n Unknown command used: '+cmd+'\n'); break;
}


// UTILITIES

function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object';
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) 
        prev[key] = pVal.concat(...oVal);
      else if (isObject(pVal) && isObject(oVal)) 
        prev[key] = mergeDeep(pVal, oVal);
      else 
        prev[key] = oVal;
    });
    return prev;
  }, {});
}



//  -------------------------------------------------------------------------- TRASH BIN --------------------------------------------------------------------------------------------

// JS CONFIG COMBINER
// function replacer(key,value){
// 	if(typeof value === 'string'){
// 		// console.log(value);
// 		if (value.match(/\w+\(\w.*\)/)) 
// 			value = JSconvertFN(value);
// 		if (configJS.hasOwnProperty(value)) 
// 			value = JSconvertVAR(value);
// 	}
// 	return value
// }
// function JSconvertVAR(str){
// 	if (configJS[str].match(/\w+\(\w.*\)/)) // if the var value is a function tag, convert it to the correct value
// 		str = JSconvertFN(configJS[str]);
// 	else
// 		str = configJS[str];
// 	if (configJS.hasOwnProperty(str))
// 		str = JSconvertVAR(str);
// 	return str;
// }
// function JSconvertFN(str){
// 	var fnName = str.match(/\w+\(\w.*\)/)[0].replace(/\(.*\)/,'').replace('','');
// 	var fnParams = str.match(/\(.*\)/)[0];
// 	fnParams = fnParams.substr(1);
// 	fnParams = fnParams.substr(0, fnParams.length-1).split(',');
// 	if (configJS.hasOwnProperty(fnName) && fnParams.length == 1){ // config has fnName as property, meaning we are searching for a config value
// 		if (configJS[fnName].hasOwnProperty(fnParams)){
// 			if (configJS[fnName][fnParams].match(/\w+\(\w.*\)/))
// 				str = JSconvertFN(configJS[fnName][fnParams]);
// 			else if (configJS.hasOwnProperty(configJS[fnName][fnParams]))
// 				str = JSconvertVAR(configJS[fnName][fnParams]);
// 			else
// 				str = configJS[fnName][fnParams];
// 		} else{
// 			str = 'undefined';
// 		}
// 	} else {  // else it's an external function, most certainly a sass or css one
// 		str = fnName+'(';
// 		for(var i in fnParams){  // searching for function or vars in the function parameters
// 			if (fnParams[i].match(/\w+\(\w.*\)/))
// 				fnParams[i] = JSconvertFN(fnParams[i]);
// 			if(configJS.hasOwnProperty(fnParams[i]))
// 				fnParams[i] = JSconvertVAR(fnParams[i]);
// 			if (i>0)
// 				str+=',';
// 			str+=fnParams[i];
// 		}
// 		str += ')';
// 	}
// 	return str;
// }
// if('module.exports = '+ JSON.stringify(configJS, replacer, 4) != fs.readFileSync('./src/combined/config.js', 'utf8')){
// 	fs.outputFileSync( './src/combined/config.js','module.exports = '+ JSON.stringify(configJS, replacer, 4))
//     console.log('\n### Combined config JS rewritten \n');
// }
// JS CONFIG COMBINER END


// var updateConfig = function(){
// 	updateFramway();
// 	updateVendors();
// }

// var updateFramway = function(){
// 	var strFramway = "/* /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process.  */\n"
// 				+ "/* Default configuration & mixins */\n"
//                	+ "@import '../core/scss/mixins';\n"
//                	+ "@import '../core/scss/vars';\n"
//                	+ "@import 'config';\n"
// 	strFramway += "/* Core styles */\n"
// 	        	+ "@import '../core/scss/core';\n";
// 	strFramway += "/* Components styles */\n";
// 	for (var i = 0; i < config.components.length; i++) {
// 	    strFramway += "@import '../components/"+config.components[i]+"/"+config.components[i]+"';\n";
// 	}
// 	strFramway += "/* Themes styles override */\n";
// 	for (var i = 0; i < config.themes.length; i++) {
// 	    strFramway += "@import '../themes/"+config.themes[i]+"/"+config.themes[i]+"';\n";
// 	}
// 	fs.outputFileSync('src/combined/framway.scss',strFramway);

// 	// var strEmails  = "/* Default configuration & mixins */\n"
// 	//                + "@import '../scss/mixins';\n"
// 	//                + "@import '../scss/vars';\n"
// 	//                + "@import '../scss/config';\n";
// 	// strEmails  += "/* Themes configuration override */\n";
// 	// for (var i = 0; i < config.themes.length; i++)
// 	//     strEmails  += "@import '../themes/"+config.themes[i]+"/config';\n";
// 	// strEmails  += "/* Core styles */\n"
// 	//             + "@import 'core';\n";

// 	// if(strEmails != fs.readFileSync('src/emails/emails.scss', 'utf8')){
// 	//     var streamEmail = fs.createWriteStream("src/emails/emails.scss");
// 	//     streamEmail.once('open', (fd) => {
// 	//         streamEmail.write(strEmails);
// 	//         // Important to close the stream when you're ready
// 	//         streamEmail.end();
// 	//     });
// 	// }
// }

// var updateVendors = function(){
// 	var strVendors = "// /!\\ WARNING: Do not edit this file. It will be rewritten in the compilation process. \n";
		
// 	strVendors += "import 'bootstrap/scss/bootstrap-reboot.scss';\n"
// 	strVendors += "import 'bootstrap/scss/bootstrap-grid.scss';\n"
	
// 	if (config.useFA == 'pro') {
// 		strVendors += "import '@fortawesome/fontawesome-pro/js/all.min.js';\n"
// 	} else if(config.useFA == 'free'){
// 		strVendors += "import '@fortawesome/fontawesome-free/js/all.min.js';\n"
// 					+ "import '@fortawesome/free-solid-svg-icons';\n"
// 					+ "import '@fortawesome/free-regular-svg-icons';\n"
// 					+ "import '@fortawesome/free-brands-svg-icons';\n";
// 	}
// 	if(config.useToastr)
// 		strVendors += "import 'toastr/toastr.scss';\n"
// 					+ "global.toastr = require('toastr');\n";

// 	strVendors += "import 'native-promise-only';\n"
// 				+ "import objectFitImages from 'object-fit-images';\n"
// 				+ "objectFitImages();\n";

// 	if(strVendors != fs.readFileSync('vendor/index.js', 'utf8')){
// 	    var stream = fs.createWriteStream("vendor/index.js");
// 	    stream.once('open', (fd) => {
// 	        stream.write(strVendors);
// 	        // Important to close the stream when you're ready
// 	        stream.end();
// 	    });
// 	    console.log('\n### vendors rewritten \n');
// 	}
// }
