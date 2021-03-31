var shell = require('shelljs');
var fs = require('fs-extra');
var name        = process.argv[2] || false;
var cmd         = process.argv[3] || 'create';
var createGit   = process.argv[4] || false;
var org         = '';

if (name.split('/').length > 1) {
    org  = name.split('/')[0];
    name = name.split('/')[1];
}

var getComponent = function(){
    if(!org)
        shell.exec('node scripts/git-get.js component '+name);      
    else
        shell.exec('node scripts/git-get.js component '+name+' '+org);      
}


var deleteComponent = function(){
    fs.remove('./src/components/'+name,function(err){
        if(err)
            console.log('\n'+err.message+'\n');
        else{
            if(!org){
                console.log('\n Component '+name+' successfully removed, but the git repository might remains. To delete it, use the following command (copied to your clipboard): \n $ hub delete framway-component-'+name+' -y \n');
                shell.exec('echo hub delete framway-component-'+name+' -y|clip');
            }
            else{
                console.log('\n Component '+name+' successfully removed, but the git repository might remains. To delete it, use the following command (copied to your clipboard): \n $ hub delete '+org+'/framway-component-'+name+' -y \n');
                shell.exec('echo hub delete '+org+'/framway-component-'+name+' -y|clip');
            }
        }
    })
};


var createComponent = function(){
    json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    version = json.version;
    fs.mkdir('./src/components/'+name,function(err){
        if(err)
            console.log('\n'+err.message+'\n');
        else{
            var className = '';
            for (var i in name.split('-')) {
                className += name.split('-')[i].charAt(0).toUpperCase() + name.split('-')[i].slice(1);
            }
            fs.appendFileSync('./src/components/'+name+'/_'+name+'.scss','.'+name+'{}');
            fs.appendFileSync('./src/components/'+name+'/'+name+'.js',
`module.exports = function(app){
    var `+className+` = Object.getPrototypeOf(app).`+className+` = new app.Component("`+name+`");
    // `+className+`.debug = true;
    `+className+`.createdAt      = "`+version+`";
    `+className+`.lastUpdate     = "`+version+`";
    `+className+`.version        = "1";
    // `+className+`.factoryExclude = true;
    // `+className+`.loadingMsg     = "This message will display in the console when component will be loaded.";
    // `+className+`.requires       = [];

    // `+className+`.prototype.onCreate = function(){
    // do thing after element's creation
    // }
    return `+className+`;
}`
            );
            fs.appendFileSync('./src/components/'+name+'/sample.html','<div class="'+name+'"></div>');
            if (createGit) {
                if(!org)
                    shell.exec('node scripts/git-create.js component '+name);
                else      
                    shell.exec('node scripts/git-create.js component '+name+' '+org);
            }
        }
    });
};


if(!name){
    console.log('\n Missing component\'s name \n');
}
else{
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