var shell       = require('shelljs');
var fs          = require('fs-extra');
var name        = process.argv[2] || false;
var cmd         = process.argv[3] || 'create';
var createGit   = process.argv[4] || false;
var git         = '';


var getComponent = function(){
    shell.exec('node scripts/git-get.js component '+name+' '+git);
    if (!fs.existsSync('./src/components/'+name+'/'+name+'.js')){
        fs.remove('./src/components/'+name,function(err){
            if(err)
                console.log('\n'+err.message+'\n');
            else{
                // createGit = false;
                // createComponent();
            }
        });
    }
}


var deleteComponent = function(){
    fs.remove('./src/components/'+name,function(err){
        if(err)
            console.log('\n'+err.message+'\n');
        else{
            console.log('\n Component '+name+' successfully removed. Be sure to remove the corresponding entry in the framway.config.js file before compiling');
            if(shell.which('hub')){
                console.log('The git remote repository might remains. To delete it, use the following command'+(shell.which('clip') ? ' (copied to your clipboard))':'')+': \n $ hub delete '+git+'framway-component-'+name+' -y \n');
                if(shell.which('clip'))
                    shell.exec('echo hub delete '+git+'framway-component-'+name+' -y|clip');
            }
        }
    })
};


var createComponent = function(){
    let version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    fs.mkdir('./src/components/'+name,function(err){
        if(err)
            console.log('\n'+err.message+'\n');
        else{
            var className = '';
            for (var i in name.split('-')) {
                className += name.split('-')[i].charAt(0).toUpperCase() + name.split('-')[i].slice(1);
            }
            fs.appendFileSync('./src/components/'+name+'/'+name+'.less','.'+name+'{}');
            fs.appendFileSync('./src/components/'+name+'/'+name+'.js',
`module.exports = function(){
    let ${className} = Object.getPrototypeOf(fw).${className} = class ${className} extends fw.Component{
        static {
            this.debug = true;
            this.createdAt  = "${version}";
            this.lastUpdate = "${version}";
            this.version = "1.0.0";
            this.tpl = utils.getNodeFromString(require('bundle-tpl:./${name}.html')).outerHTML;
            // this.describe();
        }
        onCreate(){
            // do thing after element's creation
        }
    }
    return ${className};
}`
            );
            fs.appendFileSync('./src/components/'+name+'/'+name+'.html','<div class="'+name+'"></div>');
            if (createGit)
                shell.exec('node scripts/git-create.js component '+name+' '+git);
        }
    });
};


if(!name){
    console.log('\n Missing component\'s name \n');
}
else{
    name = name.replace('framway-component-','').replace('.git','');
    if (name.split('/').length > 1) {
        git  = name.substr(0,name.lastIndexOf('/')+1);
        name = name.substr(name.lastIndexOf('/')+1);
    }

    if (!fs.existsSync('./src/components/')){
        fs.mkdir('./src/components/',function(err){
            if(err)
                console.log('\n'+err.message+'\n');
        });
    }


    switch(cmd){
        case 'create': createComponent(); break;
        case 'delete': deleteComponent(); break;
        case 'get'   : getComponent();    break;
        default: console.log('\n Unknown command used: '+cmd+'\n'); break;
    }
}