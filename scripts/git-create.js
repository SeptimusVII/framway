var shell = require('shelljs');
var type = process.argv[2] || false;
var name = process.argv[3] || false;
var org  = process.argv[4] || false;
var git  = process.argv[4] || '';


if(!type || !name){
  console.log('\n Missing argument(s). Expected syntax: git-create [type] [name] \n');
} else {
	if (git !== '') 
		git = git.replace('https://github.com/','').replace(name,'');
	shell.cd('./src/'+type+'s/'+name);
	shell.exec('git init');
	shell.exec('git add .');
	shell.exec('git commit -m "Initial commit"');
	
	if(shell.which('hub')){
		shell.exec('hub create -d "'+type+' '+name+' for Framway" '+git+'framway-'+type+'-'+name);
		shell.exec('git push -u origin master');
	}

	shell.cd();
}