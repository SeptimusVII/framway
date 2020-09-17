var shell = require('shelljs');
var fs = require('fs-extra');
var type = process.argv[2] || false;
var name = process.argv[3] || false;
var org  = process.argv[4] || false;

if(!type || !name){
  console.log('\n Missing argument(s). Expected syntax: git-get [type] [name] \n');
} else {
	if (!fs.existsSync('./src/'+type+'s/'+name+'/')){
	    fs.mkdir('./src/'+type+'s/'+name+'/',function(err){
	      if(err)
	        console.log('\n'+err.message+'\n');
	    });
		shell.cd('./src/'+type+'s/');
		if(!org)
			shell.exec('hub clone framway-'+type+'-'+name+' '+name);
		else
			shell.exec('hub clone '+org+'/framway-'+type+'-'+name+' '+name);
		shell.cd();
	} else {
		shell.cd('./src/'+type+'s/'+name);
		shell.exec('git reset --hard');
		shell.exec('git pull --rebase');
		shell.cd();
	}
}