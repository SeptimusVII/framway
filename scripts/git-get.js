var shell = require('shelljs');
var fs = require('fs-extra');
var type 	= process.argv[2] || false;
var name 	= process.argv[3] || false;
var git  	= process.argv[4] || 'https://github.com/SeptimusVII/';

if(!type || !name){
  console.log('\nMissing argument(s). Expected syntax: git-get [type] [name] \n');
} else {
	if (!fs.existsSync('./src/'+type+'s/'+name+'/')){
	    fs.mkdir('./src/'+type+'s/'+name+'/',function(err){
	      if(err)
	        console.log('\n'+err.message+'\n');
	    });
		shell.cd('./src/'+type+'s/');
		// console.log('target: ' + git+'framway-'+type+'-'+name);
		shell.exec('git clone '+git+'framway-'+type+'-'+name+' '+name);
		shell.cd();
	} else {
		if (fs.existsSync('./src/'+type+'s/'+name+'/.git')){
			shell.cd('./src/'+type+'s/'+name);
			// shell.exec('git reset --hard');
			// shell.exec('git stash');
			shell.exec('git pull --rebase');
			// shell.exec('git stash pop');
			shell.cd();
		} else {
			console.log('Error: '+name+' has no git repository \n');
		}
	}
}