var shell = require('shelljs');
var fs = require('fs-extra');
var name = process.argv[2] || false;
var cmd  = process.argv[3] || 'create';
var createGit   = process.argv[4] || false;
var git  = '';

if (name.split('/').length > 1) {
  git  = name.split('/')[0];
  name = name.split('/')[1];
}

var getTheme = function(){
  shell.exec('node scripts/git-get.js Theme '+name+' '+git);
    if (!fs.existsSync('./src/Themes/'+name+'/'+name+'.js')){
        fs.remove('./src/Themes/'+name,function(err){
            if(err)
                console.log('\n'+err.message+'\n');
            else{
                createGit = false;
                createTheme();
            }
        });
    }
}


var deleteTheme = function(){
  fs.remove('./src/themes/'+name,function(err){
      if(err)
          console.log('\n'+err.message+'\n');
      else{
          console.log('\n theme '+name+' successfully removed, but the git remote repository might remains. To delete it, use the following command (copied to your clipboard): \n $ hub delete '+git+'/framway-theme-'+name+' -y \n');
          shell.exec('echo hub delete '+git+'framway-theme-'+name+' -y|clip');
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
      
      if (createGit) 
        shell.exec('node scripts/git-create.js theme '+name+' '+git);
    }
  });
};


if(!name){
  console.log('\n Missing theme\'s name \n');
}
else{
  name = name.replace('framway-theme-','').replace('.git','').replace('github.com/','fakeLogin:fakePwd@github.com/');
  if (name.split('/').length > 1) {
      git  = name.substr(0,name.lastIndexOf('/')+1);
      name = name.substr(name.lastIndexOf('/')+1);
  }

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