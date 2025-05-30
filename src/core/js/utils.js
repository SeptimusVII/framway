var Utils = function Utils(){
  var utils = this;

  /**
   * Do ajax without use of jQuery
   * @param {String} url
   * @param {Object} data
   * @return {Promise}
   */
  utils.request = async function(data, url = "", method = "POST"){
    var request = new FormData();

    for(var i in data) {
      if (typeof data[i] == 'object'){
        for(var f in data[i]) {
          request.append(i+'['+f+']', data[i][f]);
        }
      } else{
        request.append(i, data[i]);
      }
    }
    var strUrl = url ? url : window.location.href;
    var strMethod = method ? method: "POST";

    const response = await fetch(strUrl, {
      method: strMethod,
      mode: 'same-origin',
      cache: 'no-cache',
      body: request
    });

    return response.json();
  };

  /**
   * Add a function callback to most of the jQuery dom modification functions, based on a selector.@async
   * When an element mathcing the selector is added to the dom, it fires the related callback
   * @param {String}   selector
   * @param {Function} callback [if the callback has a parameter called "item", the added element will be passed as param to the callback]
   */
  utils.addHtmlHook = function(selector,callback){

    // update html()
    var OldHtml = $.fn.html;
    $.fn.html = function () {
      var EnhancedHtml = OldHtml.apply(this, arguments);
      if (typeof EnhancedHtml != "string" && arguments.length && EnhancedHtml.find(selector).length) {
        if(utils.getParameters(callback).indexOf('item') != -1)
          callback(EnhancedHtml.find(selector));
        else
          callback();
      }
      return EnhancedHtml;
    }
  }

  // apply prefixed event handlers
  utils.prefixedEvent = function(element, type, callback) {
    var pfx = ["webkit", "moz", "MS", "o", ""];
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p]+type, callback, false);
    }
  }

  /**
  * Traverse the DOM upwards and checks the computed styles
  * of each element is passes. Compares the value of the 
  * requested property with the passed value and returns 
  * the element if the value is a match
  *
  * @param   {HTMLElement} element Element to start from.
  * @param   {string} property CSS property to research.
  * @param   {string} value Value to compare CSS property value with.
  * @returns {HTMLElement|null}
  */
  utils.findParentWithCSS = (element, property, value) => {
  while(element !== null) {
    const style = window.getComputedStyle(element);
    const propValue = style.getPropertyValue(property);
    if (value.includes(propValue)) {
      return element;
    }
      element = element.parentElement;
    }
    return document.body;
  };
  
  utils.invertColor = function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
  }

  utils.padZero = function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  utils.stringToColor = function(strText){
    strText = strText.replace(/\s+/g, '');
    strText = strText.replace(/[^a-zA-Z 0-9]+/g, '');
    var lengthC = strText.length; //length of the string
    var amount = Math.ceil(lengthC/3); //Determine length of the 3 parts that will define R, G, and B
    var add = amount*3 - lengthC; //Determine how many characters need to be added to reach the length needed
    if(strText.length > add) //if the string is longer than the number of characters to be added (if length != 1, basically)
        strText+=strText.substring(0, add); //x is the number of characters to be added, takes x characters from the start of the string and adds them to the end.
    else { //if length == 1, basically
        for(var i = 0; i < add; i++) {
            strText += strText.substring(0,1); //adds the first charecter until you have enough charecters
        }
    }
    var red36 = strText.substring(0, amount); //splits the string into 3 sections of equal length
    var green36 = strText.substring(amount, amount*2);
    var blue36 = strText.substring(amount*2, amount*3);
    if(red36 == '')
        red36 = '0';
    if(green36 =='')
        green36 = '0';
    if(blue36 == '')
        blue36 = '0';
    var red = parseInt(red36,36); //Turns the numbers from base-36 to base-10 (decimal)
    var green = parseInt(green36,36);
    var blue = parseInt(blue36,36);
    var max = Math.pow(36,amount)-1; // calculates the maximum possible value for a base-36 number of the length that each of the sections is
    if(max == 0)
        max = 1;
    var red16 = Math.round((red/max)*255).toString(16); //scales each value down to fit between 0 and 255, then converts them to base-16 (hexadecimal)
    var green16 = Math.round((green/max)*255).toString(16);
    var blue16 = Math.round((blue/max)*255).toString(16);
    if(red16.length < 2) //makes sure all 3 parts are 2 digits long
        red16 = "0" + red16;
    if(green16.length < 2)
        green16 = "0" + green16;
    if(blue16.length < 2)
        blue16 = "0" + blue16;
    var color = "#"+red16+green16+blue16; //creates the color
    return color; //returns the color
  }

  /**
   * return true if the url provided lead to an image.
   * @param  {String}  url [description]
   * @return {Boolean}     [description]
   */
  utils.isImageUrl = function(url){
    return(url.match(/\.(jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG)$/) != null);
  }

  /**
   * Build a string for css transforms, combining the existent properties of an element and the new string provided
   * @param  {jQuery} el  [can be a jQuery object or a Dom element]
   * @param  {String} str [expect a valid css transform string]
   * @return {String}
   */
  utils.mergeTransforms = function(el,str){
    try{el = el.get(0);} catch(e){}
    var strTransform = el.style.transform || $(el).css('content').replace(/"/g,'');
    var baseTransform = String(strTransform).split(' ');
    var targetTransform = str.split(' ');
    var objTransform = {};
    if(baseTransform[0] != "none"){
      $.each(baseTransform,function(index,value){
          var key = value.replace(/\((.+?)\)/,'');
          objTransform[key] = value.replace(key,'');
      });
    }
    $.each(targetTransform,function(index,value){
        var key = value.replace(/\((.+?)\)/,'');
        objTransform[key] = value.replace(key,'');
    });
    var strResult = '';
    $.each(objTransform,function(key,value){
        strResult += key+value+' ';
    })
    return strResult;
  }


  utils.mergeArrays = function(arr1,arr2){
    return [... new Set([...arr1,...arr2])];
  }

  utils.getClassName = function(str){
    var className = '';
    for (var i in str.split('-')) {
      className += str.split('-')[i].charAt(0).toUpperCase() + str.split('-')[i].slice(1);
    }
    return className;
  }

  /**
   * return an array of a function's parameters. Works only if the parameters don't have defaults values
   * @param  {Function} fn
   * @return {Array}
   */
  utils.getParameters = function(fn){
    var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
       result = [];
    return result;
  };
  var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;


  /**
   * return an Object from an array of Objects that match a property and a specific value
   * @param  {Array of Objects} arrObj
   * @param  {String} property
   * @param  {[type]} value
   * @return {Object}
   */
  utils.getObjBy = function(arrObj,property,value){
    var items;
    if (Array.isArray(arrObj)) {
        items = arrObj.filter(function (obj) {
          if(obj[property] instanceof jQuery && value instanceof jQuery)
            return obj[property].is(value);
          else
            return obj[property] == value;
        });
        if (items.length > 1) return items;else return items[0];
    } else if ((typeof arrObj === "undefined" ? "undefined" : typeof arrObj ) == "object") {
        items = Object.filter(arrObj, property, value);
        if (utils.getObjSize(items) > 1) return items;else return items[Object.keys(items)[0]];
    }
  }
  // utility function used by getObjBy - not intended to be used out of this context
  Object.filter = function (obj, property, value) {
      return Object.keys(obj).filter(function (key) {
          return obj[key][property] == value;
      }).reduce(function (res, key) {
          return res[key] = obj[key], res;
      }, {});
  };

  /**
   * return an array of method's names from an object
   * @param  {Object} obj
   * @return {Array}
   */
  utils.getObjMethods = function(obj){
    var res = [];
    for (var m in obj) {
      if (typeof obj[m] == "function")
          res.push(m);
    }
    return res;
  }

  /**
   * return true or false whether the object submitted has a key or not
   * @param  {Object}  obj
   * @param  {String}  key
   * @return {Boolean}
   */
  Object.hasKey = function(obj,key){
   if(Object.keys(obj).indexOf(key) != -1)
     return true;
   else
     return false;
  }

  /**
   * return the size of an Object
   * @param  {Object} obj
   * @return {Integer}
   */
  utils.getObjSize = function(obj){
    return Object.keys(obj).length;
  }

  /**
   * generate a unique ID based on the date and a random number
   * @return {String}
   */
  utils.uniqid = function() {
      var date = new Date();
      var components = [date.getYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), "-", Math.floor(Math.random() * (9999 - 1000) + 1000)];
      return components.join("");
  }

  /**
   * from an array of objects, return an object containing a set of grouped objects by properties values passed as parameters
   * @param  {Array of Objects} arrObj
   * @param  {Array of strings} arrOptions
   * @return {Object}
   */
  utils.groupByObj = function(arrObj, arrOptions){
    var results = {};
    $.each(arrObj, function (alias, value) {
        var strGroup = '';
        $.each(arrOptions, function (index, option) {
            if (index != 0) strGroup += ',';
            strGroup += value[option];
        });
        if (!results[strGroup]) results[strGroup] = {};
        results[strGroup][alias] = value;
    });
    return results;
  };

  /**
   * return a key of an object from a value
   * @param  {Object} obj
   * @param  {[type]} value
   * @return {String}
   */
  utils.getObjKeyByValue = function(obj,value){
    return Object.keys(obj).find(key => obj[key] === value);
  };

  /**
   * Copy the content of the element provided to the clipboard
   * @param  {DOM element} elem
   * @return {Boolean}
   */
  utils.copyToClipboard = function(elem,full=false) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "fixed";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        if(full)
          target.textContent = elem.outerHTML;
        else
          target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
  }


  utils.capitalize = function(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  utils.lowerize = function(str){
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
  utils.normalize = function(str){
    return str.toLowerCase().replace(/ |\./g,'_');
  }

  utils.versionToInt = function(strVersion){
    return parseFloat(strVersion.replace('.','-').replace('.','').replace('-','.'));
  }


  // NOTIFICATIONS SETUP
  global.toastr = require('toastr');
  var toastrDefault = {"newestOnTop": false, "closeButton": true, "timeOut": 0, "extendedTimeOut": 0, "showMethod": "slideDown", "positionClass": "toast-bottom-left", "closeHtml": "<button type='button' class='toast-close-button exclude' role='button'>×</button>", "progressBar": false };
  var toastrTimeOut = {"newestOnTop": false, "closeButton": true, "timeOut": 5000, "extendedTimeOut": 1000, "showMethod": "slideDown", "positionClass": "toast-bottom-left", "closeHtml": "<button type='button' class='toast-close-button exclude' role='button'>×</button>", "progressBar": true };
  toastr.options = toastrDefault;


  /**
   * display a common notification
   * @type {Object}
   */
  global.notif = {
    error : function(str){
      if(app.useToastr)
        toastr.error(str);
    },
    success : function(str){
      if(app.useToastr)
        toastr.success(str);
    },
    warning : function(str){
      if(app.useToastr)
        toastr.warning(str);
    },
    info : function(str){
      if(app.useToastr)
        toastr.info(str);
    },
  };
  /**
   * display a notification that will fade past time
   */
  global.notif_fade = {
    error : function(str){
      if(app.useToastr){
        toastr.options = toastrTimeOut;
        toastr.error(str);
        toastr.options = toastrDefault;
      }
    },
    success : function(str){
      if(app.useToastr){
        toastr.options = toastrTimeOut;
        toastr.success(str);
        toastr.options = toastrDefault;
      }
    },
    warning : function(str){
      if(app.useToastr){
        toastr.options = toastrTimeOut;
        toastr.warning(str);
        toastr.options = toastrDefault;
      }
    },
    info : function(str){
      if(app.useToastr){
        toastr.options = toastrTimeOut;
        toastr.info(str);
        toastr.options = toastrDefault;
      }
    },
  };

  return utils;
};
/**
 * return a object containing the viewport width and height
 * @return {Object}
 */
Utils.prototype.getDimensions = function(){
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
};

/**
 * return the viewport height without headers
 * @return {int}
 */
Utils.prototype.getViewportHeight = function(){
  var height = viewport.height - ($('.headerFW').outerHeight() || 0);
  if($('.topbar').length && !$('.topbar').closest('.headerFW'))
   height -= ($('.topbar').outerHeight() || 0);
  return height;
};

/**
 * [checkForm description]
 * @param  {[type]}  el          [form container]
 * @param  {Boolean} renderError 
 */
Utils.prototype.checkForm = function(el,renderError = true,reportFormValidity = true){
  if (app.debug) 
    app.log('checkForm');
  if (el.nodeName == 'FORM')
    el.reportValidity()
  var $el = $(el);
  var inputs = $el.find('input,textarea,select').filter(function(i){return this.name != "" && this.getAttribute('disabled') == null && !$(this).hasClass('fileUploader__input');});
  var specials = {};
  var $errors = $el.find('.error-container').length ? $el.find('.error-container') : false;
  // var $errors = $el.find('.error-container').length ? $el.find('.error-container') : $('<div class="error-container"></div>').appendTo($el);
  var results = {
    valid: true,
    inputs: {}
  }

  $.each(inputs, function(index, input){
      if (input.getAttribute('name') === undefined)
        return false;
    
    var valid = true;
      if(input.value == '' && input.getAttribute('required') !== null)
        valid = false;
      var inputRow = {
        'name'     : input.getAttribute('name').replace('[]', ''),
        'id'       : input.getAttribute('id'),
        'type'     : input.nodeName !== 'INPUT' ? input.nodeName.toLowerCase() : input.getAttribute('type'),
        'required' : input.getAttribute('required') !== null ? true : false,
        'value'    : input.value,
        'valid'    : valid,
      };
      if($(input).is(':invalid')) // regular check if input is invalid, then result is false by default
          inputRow.valid = false;

      // SELECT MULTIPLE
      if (inputRow.type=='select' && input.hasAttribute('multiple')) {
        inputRow.value=Array.from(input.selectedOptions).map(v=>v.value);
      }
      
      // CHECKBOXES
      // multiple checkboxes all need the required attribute to be effectively tested
      if (inputRow.type == 'checkbox') {
          inputRow.valid = true;
          if ($el.find('input').filter('[name="'+input.getAttribute('name')+'"]').length > 1) { // multiple checkbox, should return array of values
              inputRow.value = [];
              $el.find('input').filter('[name="'+input.getAttribute('name')+'"]').each(function(){
                  if ($(this).isChecked())
                      inputRow.value.push(this.value);
              });
              if (inputRow.required === true && !inputRow.value.length)
                  inputRow.valid = false;
          } else { // unique checkbox, should return 1 or 0
              inputRow.value = ($(input).isChecked()) ? 1 : 0;
              if (inputRow.required === true && inputRow.value == 0)
                  inputRow.valid = false;
          }
      }
      // RADIOS
      // multiple radios all need the required attribute to be effectively tested
      if (inputRow.type == 'radio') {
          inputRow.valid = true;
          inputRow.value = false;
          $el.find('input').filter('[name="'+input.getAttribute('name')+'"]').each(function(){
              if ($(this).isChecked())
                  inputRow.value = (this.value);
          });
          if (inputRow.required === true && !inputRow.value)
              inputRow.valid = false;
      }

      // FILEUPLOADER 
      if($(input).hasClass('fileUploader') && app.components.includes('fileUploader')){
        var fileUploader = $(input).fileUploader('get');
          inputRow.valid = true;
        if (fileUploader.multiple) {
              inputRow.value = [];
          fileUploader.$wrapper.find('.fileUploader__input').each(function(){
            inputRow.value.push(this.value);
          });
          if ($(input).attr('required') && !inputRow.value.length)
                  inputRow.valid = false;
        } else {
          inputRow.value = fileUploader.$wrapper.find('.fileUploader__input').val();
          if ($(input).attr('required') && inputRow.value == '')
                  inputRow.valid = false;
        }
      }

      // DATEPICKERS
      if($(input).hasClass('datepicker') && app.components.includes('datepicker')){
          inputRow.value = $(input).attr('data-tstamp');
      }

      // WIZARDS
      if($(input).hasClass('wizard') && app.components.includes('wizard')){
        var wizardData    = $(input).wizard('get').getValue();
        inputRow.type     = 'wizard';
        inputRow.value    = wizardData.values;
        inputRow['valid'] = wizardData.valid;
        // if wizard's value is invalid, the form must not be sent. so the all form is considered invalid
        if (!wizardData.valid)
          results.valid = false;
      }


      // FORM VALIDATION
      if(input.required && !$(input).hasClass('nofill')){  // regular required input
          if(inputRow.valid === false){
            // console.log(input, inputRow);
            results.valid = false;
          }
          results.inputs[inputRow.name] = inputRow;
      // }
      // else if(input.getAttribute('data-required') !== null && !$(input).hasClass('nofill')){ // required input according to another input (aka "specials") // TODO  
      //   var params = input.getAttribute('data-required').split('/');
      //   requiredParams = {
      //     'inputName' : params[0],
      //     'inputValue' : params[1],
      //     'operator' : params[2]||'and'
      //   };
      //   if(!specials[requiredParams.inputName]) {
      //     specials[requiredParams.inputName] = new Object();
      //     specials[requiredParams.inputName].params = requiredParams;
      //     specials[requiredParams.inputName].inputs = [];
      //     specials[requiredParams.inputName].inputs[inputRow.name] = inputRow;
      //   } else {
      //     specials[requiredParams.inputName].inputs[inputRow.name] = inputRow;
      //   }
      } else { // input not required
          results.inputs[inputRow.name] = inputRow;
      }
      // console.log(inputRow);
  });
  
  // console.log(specials);
  // if(Object.keys(specials).length > 0){  // do this if we have special inputs registred
  //   $.each(specials, function(index, mode){
  //     console.log(mode);
  //     var refInput;
  //     for(var i = 0; i < inputs.length; i++) {
  //       if(inputs[i].getAttribute('name') === mode.params.inputName)
  //         refInput = inputs[i];
  //     }
  //     var refInputValue = $(refInput).val();
  //     console.log(refInputValue == mode.params.inputValue);
  //     if(refInputValue == mode.params.inputValue) {
  //       var arrayCheck = [];
  //        $.each(mode.inputs, function(index, input){
  //           if(!input.valid)
  //               arrayCheck.push(0);
  //           else
  //               arrayCheck.push(1);
  //           results.inputs.push(input);
  //       });
  //       switch(mode.params.operator) {
  //         case 'or':
  //           if(arrayCheck.indexOf(1) == -1)
  //               results.valid = false;
  //           break;
  //         case 'xor':
  //           var indexes = [], i = -1;
  //           while ((i = arrayCheck.indexOf(1, i+1)) != -1){
  //               indexes.push(i);
  //           }
  //           if(indexes.length != 1)
  //               results.valid = false;
  //           break;
  //         case 'and':
  //         default:
  //           $.each(mode.inputs, function(index, input){
  //               if(!input.valid)
  //                   results.valid = false;
  //               results.inputs.push(input);
  //           });
  //           break;
  //       }
  //     }
  //   });
  // }


  // ERROR MANAGEMENT
  if(results.valid === false && renderError === true){  // display errors - the container need to have a div.error-container
    $.each(results.inputs, function(index, input){
      if(!input.valid){
        var labelError = utils.getInputLabel(input.id,input.name.replace('[]', ''));
        if (input.value == false) // assuming input's value is empty / falsy
          labelError = app.labels.errors.inputs.empty[app.lang].replace('%s',labelError);
        else  // assuming input's value is incorrect
          labelError = app.labels.errors.inputs.incorrect[app.lang].replace('%s',labelError);
        utils.renderError(input.name.replace('[]', ''),labelError,$errors);
      } else {
        utils.renderError(input.name.replace('[]', ''),false,$errors);
      }
    });
    } else { // form is valid, clean all error messages
      $.each(inputs, function(index, input){
        utils.renderError(input.name.replace('[]', ''),false,$errors);
    });
  }

  // if (app.debug) 
    // console.table(results.inputs);

  return results;
};

Utils.prototype.getInputLabel = function(inputID, placeholder=undefined){
  if($('#'+inputID).attr('type') == 'radio' || $('#'+inputID).attr('type') == 'checkbox'){
    if ($('#'+inputID).parent().children('label:not(for)').first().length) {}
      return $('#'+inputID).parent().children('label:not(for)').first().html().replace(':','').trim();
  }
  if($('label[for="'+inputID+'"]').first().length) // if exist, get label of the input
    return $('label[for="'+inputID+'"]').first().html().replace(':','').trim();
  else{
    if (placeholder !== undefined) 
      return placeholder;
    else 
      return inputID;
  }
}

/**
 * [renderError description]
 * @param  {[type]}  name    [error name]
 * @param  {Boolean} msg     [error message]
 * @param  {Boolean} $el     [errors container]
 * @param  {Boolean} success [error status]
 */
Utils.prototype.renderError = function(name,msg=false,$el=false,success=false){
  if (app.debug) {
    app.log('renderError');
    console.log('name :',name);
    console.log('msg    :',msg);
    console.log('$el    :',$el!==false);
    console.log('success  :',success);
  }
  // no error container defined, so we use the notif system
  if ($el === false){
    if(msg !== false){
      if (success===true)
        notif_fade.success(msg);
          else
              notif_fade.error(msg);
    }
        return false;
  }
  // there is an error container, so we proceed 
  $el = $($el);
  $el.find('blockquote.'+name).fadeOut().remove();
  if (msg!==false) {
    $el.append('<blockquote class="'+name+'"><p>'+msg+'</p></blockquote>');
    $el.find('blockquote.'+name).hide().fadeIn();
    $el.get(0).scrollIntoView({behavior: "smooth",block:"center",inline:"nearest"}); // need testing in modalFW
  }
}



/**
 * return a set of jQuery object filtered by the data attribute value submitted
 * @param  {[type]} prop [description]
 * @param  {[type]} val  [description]
 * @return {[type]}      [description]
 */
$.fn.filterByData = function(prop, val) {
 return this.filter(
     function() { return $(this).data(prop)==val; }
 );
}

// check end of scrolling
$.fn.scrollEnd = function (callback, timeout) {
    $(this).scroll(function () {
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
};

/**
 * check the state of a checkbox
 * @return {Boolean}
 *  TODO : real test
 */
$.fn.isChecked = function () {
  if ($(this).is(':checked')) return true;else return false;
};

$.event.special.destroyed = {
  remove: function(o) {
    if (o.handler) {
      o.handler()
    }
  }
};


module.exports = new Utils();