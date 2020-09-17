var shell = require('shelljs');
var type = process.argv[2] || false;
var name = process.argv[3] || false;
var org  = process.argv[4] || false;


if(!type || !name){
  console.log('\n Missing argument(s). Expected syntax: git-create [type] [name] \n');
} else {
	shell.cd('./src/'+type+'s/'+name);
	shell.exec('git init');
	shell.exec('git add .');
	shell.exec('git commit -m "Initial commit"');
	
	if(!org)
		shell.exec('hub create -d "'+type+' '+name+' for Framway" framway-'+type+'-'+name);
	else
		shell.exec('hub create -d "'+type+' '+name+' for Framway" '+org+'/framway-'+type+'-'+name);


	shell.exec('git push -u origin master');
	shell.cd();
}