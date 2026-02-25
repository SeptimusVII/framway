class Component{
	static debug = false;
	constructor(el){
		let component = this;
		let name = utils.strToPascalCase(this.constructor.name);
		if (el instanceof HTMLElement) 
			component.el = el;
		else{
			component.el = this.constructor.tpl ? this.getTemplate() : utils.htmlToNode('<div class="'+name+'"></div>');
			if (typeof el == 'object') {
				for(var attr in el){
					obj[attr] = el[attr];
				}
			}
		}
		component.el.component = this;

		fw.components_active[name] = fw.components_active[name] || [];
		fw.components_active[name].push(component);
		
		component.onCreate();
	}
	static describe = function(){
		if (typeof fw !== 'undefined') {
			let component = this.prototype;
			window.addEventListener("load", function(e) {
				console.groupCollapsed('COMPONENT '+name+' DEBUG DISPLAY');
				console.group('Methods');
				console.log('Owned :',Object.getOwnPropertyNames(component));
				console.log('Inherited :',Object.getOwnPropertyNames(Object.getPrototypeOf(component)));
				console.groupEnd();
				console.group('Attributes');
				for (var prop in component) {
				  console.log(prop+' ['+typeof component[prop]+'] : ', component[prop]);
				}
				console.groupEnd();
				console.groupEnd();
			});
		} else {
			throw "Error: Framway is not ready. Wait for it to be initialized";
		}
	}
}

/**
 * callback on component instance creation
 */
Component.prototype.onCreate = function(){
	this.log('created','This is the callback on the component\'s creation. You can overwrite it by redefining '+this.type+'.prototype.onCreate');
};

/**
 * callback on resize event
 */
Component.prototype.onResize = function(){
  this.log('resized','This is the callback on resize event. You can overwrite it by redefining '+this.type+'.prototype.onResize');
};

/**
 * remove the component from the dom
 */
Component.prototype.destroy = function() {
	this.el.remove();
};

/**
 * callback on destroy event
 */
Component.prototype.onDestroy = function(){
  this.log('destroyed','This is the callback on destroy event. You can overwrite it by redefining '+this.type+'.prototype.onDestroy');
};

/**
 * return a new Node element from the component's template
 */
Component.prototype.getTemplate = function(){
	return utils.htmlToNode(this.constructor.tpl);
}

Component.prototype.log = function(title,msg = false){
  if(this.constructor.debug){
    let tstamp = new Date();
    tstamp = '['+ tstamp.getHours() +':'+ tstamp.getMinutes() +':'+ tstamp.getSeconds() +']';
    console.log(tstamp+" Component "+this.constructor.name+": "+title);
    if(msg)
      console.log(msg);
    console.log(this);
  }
}

Component.prototype.getData = function(label, placeholder = undefined){
  let component = this;
  if(component.el.dataset[label] !== undefined && component.el.dataset[label] !== "")
      return component.el.dataset[label];
    else
      return placeholder;
}

Component.prototype.getAttr = function(label, placeholder = undefined){
  let component = this;
  if(component.el.getAttribute(label) !== null && component.el.getAttribute(label) !== "")
      return component.el.getAttribute(label);
    else
      return placeholder;
}

let componentObserver = new MutationObserver(function(mutations) {
	mutations.forEach( function (mutation) {
		if (typeof mutation.addedNodes == "object") {
			mutation.addedNodes.forEach(function (node) {
				let isComponent = node.classList.fw__containsAny(fw.components);
			  	if (isComponent && typeof fw[utils.strToPascalCase(isComponent)] == 'function' && typeof node.component == 'undefined') {
	  				new fw[utils.strToPascalCase(isComponent)](node);
	  				if (fw.debug) console.log('A component '+isComponent+' has been added to the DOM and initialized',node.component);
			  	}
			})
		}
		if (typeof mutation.removedNodes == "object") {
			mutation.removedNodes.forEach(function (node) {
				let isComponent = node.classList.fw__containsAny(fw.components);
				if (isComponent && typeof node.component == 'object') {
					isComponent = utils.strToPascalCase(isComponent);
			  	let i = fw.components_active[isComponent].indexOf(node.component);
			  	if (i != -1){
			  		fw.components_active[isComponent].splice(i,1)
	  				if (fw.debug) console.log('A component '+isComponent+' has been removed from the DOM',node.component);
					node.component.onDestroy();
					node.component = undefined;
			  	} else {
			  		if (fw.debug) console.log('A component '+isComponent+' has been destroyed, but was not found in the register');
			  	}
				}
			})
		}
 	});
});
componentObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

module.exports = Component;
