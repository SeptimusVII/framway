class Component {
	constructor(name){
		let name_l = utils.lowerize(name);
		let component = {
			[name]: function(el){
				let obj = this;
				if (el instanceof HTMLElement) 
					obj.el = el;
				else{
					obj.el = utils.getNodeFromString('<div class="'+name+'"></div>');
					if (typeof el == 'object') {
						for(var attr in el){
							obj[attr] = el[attr];
						}
					}
				}

				obj.el.component = this;
				obj.type = name;

				fw.components_active[name_l] = fw.components_active[name_l] || [];
				fw.components_active[name_l].push(obj);
				obj.onCreate();
			}
		}

		
		component = component[name];
		component.prototype = Object.create(Component.prototype);
		component.prototype.constructor = component;

		component.debug = false;
		return component;
	}
}
Component.prototype.onCreate = function(){
	this.log('created','This is the callback on the component\'s creation. You can overwrite it by redefining '+this.type+'.prototype.onCreate');
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


Component.prototype.log = function(title,msg = false){
  if(this.constructor.debug){
    let tstamp = new Date();
    tstamp = '['+ tstamp.getHours() +':'+ tstamp.getMinutes() +':'+ tstamp.getSeconds() +']';
    console.log(tstamp+" Component "+this.type+": "+title);
    if(msg)
      console.log(msg);
    console.log(this);
  }
}


let componentObserver = new MutationObserver(function(mutations) {
	mutations.forEach( function (mutation) {
		if (typeof mutation.addedNodes == "object") {
			mutation.addedNodes.forEach(function (node) {
				let isComponent = node.classList.fw__containsAny(fw.components);
			  	if (isComponent && typeof fw[utils.getClassName(isComponent)] == 'function') {
	  				new fw[utils.getClassName(isComponent)](node);
	  				if (fw.debug) console.log('A component '+isComponent+' has been added to the DOM and initialized',node.component);
			  	}
			})
		}
		if (typeof mutation.removedNodes == "object") {
			mutation.removedNodes.forEach(function (node) {
				let isComponent = node.classList.fw__containsAny(fw.components);
				if (isComponent && typeof node.component == 'object') {
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
