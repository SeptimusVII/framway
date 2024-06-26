var config = require('../../../framway.config.js');
require('../../combined/framway.scss');

for (var i in config.components) {
  if (config.components[i].split('/').length > 1) {
      config.components[i] = config.components[i].substr(config.components[i].lastIndexOf('/')+1).replace('.git','').replace('framway-component-','');
  }
}
for (var i in config.themes) {
  if (config.themes[i].split('/').length > 1) {
      config.themes[i] = config.themes[i].substr(config.themes[i].lastIndexOf('/')+1).replace('.git','').replace('framway-theme-','');
  }
}

function Framway(){
  	var framway = this;
  	framway.version = require('../../../package.json').version;
    for(var key in config)
      framway[key] = config[key];
	  framway.components_active = {};
  	framway.$debug = $('<div id="debug"></div>').appendTo($('body'));
    framway.styles = require('../../combined/export.scss');
    if (framway.styles.default)
      framway.styles = framway.styles.default;
    // console.log(framway.styles);
    $.each(framway.styles,function(key,value){
      // console.log(key,value);
      if(value[0] == '(' && value[value.length - 1] == ")"){
        // var objValue = value.replace('(','{').replace(')','}').replace(/ /g, '')
        var objValue = value.replace(/^\(/,'{').replace(/\)$/,'}').replace(/ /g, '') // replace the global parenthesis with brackest
                .replace(/\((.*?)\)/g,'{$1}') // replace any internal parenthesis with brackets
                .replace(/([\w]+):/g, '"$1":') // wrap any property name into quotes
                .replace(/:([\w]+.+\))/g, ':"$1"') // wrap rgba
                .replace(/([\w]+)%/g, '"$1%"') // wrap any %
                .replace(/:([\w].[\w]*)/g, ':"$1"') // wrap any word
                .replace(/:(\.[\w].[\w]*)/g, ':"$1"') // wrap any word including thing like ".8em"
                .replace(/#([\w]+)/g, '"#$1"') // wrap any hexadecimal color
                .replace(/:([\d]+)/g, function(m, num) {return ':'+parseFloat(num)}) // don't know
                .replace(/:([[{])/g, ':$1'); // don't know
        framway.styles[key] = JSON.parse(objValue);
        // console.log(framway.styles[key]);
      }
    });

    // replace occurrences of aliases in classes by their true value
    for (var alias in framway.styles.aliases) {
      for(var el of document.querySelectorAll('[class*="-'+alias+' "],[class$="-'+alias+'"]')){
        el.className = el.className.replace(alias,framway.styles.aliases[alias])
      }
    }

    // if (framway.useFA == 'free') {
    //   var switchIconToFree = function(item){
    //     item.classList.remove('fal');
    //     item.classList.remove('fad');
    //     item.classList.add('fas');
    //   }
    //   for(var item of document.querySelectorAll('i.fal,i.fad'))
    //     switchIconToFree(item);
    //   utils.addHtmlHook('i.fal,i.fad', function(item){
    //     $(item).each(function(){switchIconToFree(this)})
    //   });
    // }
    

  	return framway;
};

Framway.prototype.Component = require('./component.js');
Framway.prototype.utils     = global.utils = require('./utils.js');
/**
 * load the components passed in parameters
 * @param  {Array of Strings} arrComponents [array containing the components names]
 */
Framway.prototype.loadComponents = function(arrComponents){
  var framway = this;
  return new Promise(function(resolve,reject){
    $.each(arrComponents,function(index,name){
      try{
        var className = utils.getClassName(name);
        var component = require('../../components/'+name+'/'+name+'.js')(framway);
        if(framway[className]){
          if(utils.versionToInt(framway.version) < utils.versionToInt(framway[className].createdAt))
            throw 'This component was created in a later framway\'s version ('+framway[className].createdAt+'). Please update the framway before using this component.\nFramway\'s current version: '+framway.version+'';
          if(utils.versionToInt(framway.version) < utils.versionToInt(framway[className].lastUpdate))
            framway.log('Component '+ name + ' is compatible with the current version of the framway, but was updated in a later iteration ('+framway[className].lastUpdate+'). Be aware that problems might occur when using it without upgrading the framway first.\nFramway\'s current version: '+framway.version+'');
          if(framway[className].loadingMsg)
            framway.log('Component '+ name +': \n'+framway[className].loadingMsg);
        }
      } catch(e){
        framway.log('Component '+ name + ' failed to load.\n'+e);
      }
    });
    if(framway.components.length && framway.debug)
      framway.log('Component(s) sucessfully loaded: \n - '+ framway.components.join('\n - '));
    resolve();
  });
};

/**
 * load the themes passed in parameters
 * @param  {Array of Strings} arrThemes [array containing the themes names]
 */
Framway.prototype.loadThemes = function(arrThemes){
  var framway = this;
  return new Promise(function(resolve,reject){
    $.each(arrThemes,function(index,name){
      try{
        require('../../themes/'+name+'/'+name+'.js');
      } catch(e){
        framway.log('Theme '+ name + ' failed to load.\n'+e);
      }
    });
    if(framway.themes.length && framway.debug)
      framway.log('Theme(s) sucessfully loaded: \n - '+ framway.themes.join('\n - '));
    resolve();
  });
};


/**
 * display things in the browser's console and in a custom debug window
 * @param  {[type]}  strLog
 * @param  {Boolean} blnDebug
 * TODO : style debug window
 */
Framway.prototype.log = function(strLog, blnDebug = false){
  var framway = this;
  if (blnDebug) {
      var content = framway.$debug.html();
      content += strLog.replace(/(?:\r\n|\r|\n)/g,'<br>') + '<br>';
      framway.$debug.html(content).show();
      framway.$debug.scrollTop(framway.$debug[0].scrollHeight);
  }
  if (typeof strLog == 'string')
    console.log('\n'+'#'.repeat(strLog.split('\n')[0].length - 1));
  else
    console.log('\n'+'#'.repeat(15));
  console.log(strLog);
  return framway;
};

/**
 * clear the custom debug window
 */
Framway.prototype.clearLogs = function(){
  var framway = this;
  framway.$debug.html('').hide();
  return framway;
};

/**
 * adjust position of overlapping tooltips
 */
Framway.prototype.adjustTooltips = function(){
  var framway = this;
  $('[tooltip]').each(function(i,el){
    el.classList.remove('tooltipOffset--right','tooltipOffset--left')
    var container = utils.findParentWithCSS(el, 'overflow', ['hidden','auto']);
    if (window.getComputedStyle(container).position == 'static')
      container.style.position = 'relative';
    // console.log(el,container);
    if ((el.offsetLeft + (parseInt(window.getComputedStyle(el, ':before').width)/2)) > container.offsetWidth)
        el.classList.add('tooltipOffset--right')
    else if ((el.offsetLeft - (parseInt(window.getComputedStyle(el, ':before').width)/2)) < 0)
        el.classList.add('tooltipOffset--left')
  })
};

Framway.prototype.isWithinViewport = function(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};


global.$ = $;
global.viewport = utils.getDimensions();
module.exports = new Framway();

window.addEventListener("resize", function(){
  viewport = utils.getDimensions();
  app.adjustTooltips();
});

if (document.getElementById('framway__backstage')) {
  /**
   * read url's parameter and navigate throught dom (framway__backstage)
   */
  Framway.prototype.applyUrlNavigation = function(){
    var search = {};
    for(var item of window.location.search.substring(1).split('&'))
      search[item.split('=')[0]] = item.split('=')[1];
    // console.log("applyUrlNavigation");
    // console.log(search);
    for(var item in search){
      if($('*[data-'+item+']').length && $('*[data-'+item+']').get(0).nodeName == 'BUTTON')
        $('*[data-'+item+'="'+search[item]+'"]').first().trigger('click');
      if($('*[data-'+item+']').length && $('*[data-'+item+']').get(0).nodeName == 'SELECT')
        $('*[data-'+item+']').first().val(search[item]).trigger('change');
    }
  }

  /**
   * update url according to dom state (framway__backstage)
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  Framway.prototype.updateUrlNavigation = function(config){
    var url = window.location.origin+window.location.pathname+'?';
    var i = 0;
    // console.log("updateUrlNavigation");
    // console.log(config);
    for(var item in config){
      if (i!=0)
        url += '&';
      url += item+'='+config[item];
      i++;
    }
    window.history.replaceState({path:url},'',url);
  }

/**
 * manage navigation throught framway__backstage
 */
  window.addEventListener("load", function(e) {
    setTimeout(function(){
      $('#framway__backstage>.tabs__nav button').on('click',function(e){
        var section = $(this).attr('data-framnav');
        // console.log('click '+section);
        var objNav = {framnav : section};
        if (Framway.prototype[utils.getClassName(section)] && typeof Framway.prototype[utils.getClassName(section)].prototype.getNavState == 'function' && $('.'+section).length)
          objNav = $('.'+section)[section]('get').getNavState();
        // console.log(objNav);
        Framway.prototype.updateUrlNavigation(objNav);
      });
      Framway.prototype.applyUrlNavigation();
    },100)
  });
  window.onpopstate = function(event) {
    // console.log("onpopstate", event);
    Framway.prototype.applyUrlNavigation();
  };
}