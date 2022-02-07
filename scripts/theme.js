var shell = require('shelljs');
var fs = require('fs-extra');
var name = process.argv[2] || false;
var cmd  = process.argv[3] || 'create';
var createGit   = process.argv[4] || false;
var org  = '';

if (name.split('/').length > 1) {
  org  = name.split('/')[0];
  name = name.split('/')[1];
}

var getTheme = function(){
  if(!org)
    shell.exec('node scripts/git-get.js theme '+name);
  else
    shell.exec('node scripts/git-get.js theme '+name+' '+org);
}


var deleteTheme = function(){
  fs.remove('./src/themes/'+name,function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      if(!org){
        console.log('\n Theme '+name+' successfully removed, but the git remote repository might remains. To delete it, use the following command (copied to your clipboard): \n $ hub delete framway-theme-'+name+' -y \n');
        shell.exec('echo hub delete framway-theme-'+name+' -y|clip');
      }
      else{
        console.log('\n Theme '+name+' successfully removed, but the git remote repository might remains. To delete it, use the following command (copied to your clipboard): \n $ hub delete '+org+'/framway-theme-'+name+' -y \n');
        shell.exec('echo hub delete '+org+'/framway-theme-'+name+' -y|clip');
      }
    }
  })
};


var createTheme = function(){
  fs.mkdir('./src/themes/'+name,function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      // fs.copyFileSync('./src/scss/_config.scss','./src/themes/'+name+'/_config.scss');
      fs.appendFileSync('./src/themes/'+name+'/config.js','module.exports = {};');
      fs.appendFileSync('./src/themes/'+name+'/_'+name+'.scss','');
      fs.appendFileSync('./src/themes/'+name+'/'+name+'.js','$(function(){\n\n});');
      
      if (createGit) {
        if(!org)
          shell.exec('node scripts/git-create.js theme '+name);
        else      
          shell.exec('node scripts/git-create.js theme '+name+' '+org);
      }
    }
  });
};


if(!name){
  console.log('\n Missing theme\'s name \n');
}
else{
  if (!fs.existsSync('./src/themes/')){
    fs.mkdir('./src/themes/',function(err){
      if(err)
        console.log('\n'+err.message+'\n');
    });
  }

  switch(cmd){
    case 'create': createTheme(); break;
    case 'delete': deleteTheme(); break;
    case 'get'   : getTheme();    break;
    default: console.log('\n Unknown command used: '+cmd+'\n'); break;
  }
  
}