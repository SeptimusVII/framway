module.exports = function(app){
	var Documentation = Object.getPrototypeOf(app).Documentation = new app.Component("documentation");
	// Documentation.debug = true;
	Documentation.createdAt      = "2.0.0";
	Documentation.lastUpdate     = "2.0.0";
	Documentation.version        = "1";
	Documentation.factoryExclude = true;
	// Documentation.loadingMsg     = "This message will display in the console when component will be loaded.";

	var arrManuals = ['utilities','buttons','backgrounds','borders','margin-padding','flex','grid','opacity','images'];
	if(app.components.includes('modalFW'))
	    arrManuals.push('modalFW');
	Documentation.prototype.onCreate = function(){
		var doc = this;
		var html = {nav : '', content : ''};
		for(var manual of arrManuals){
			html.nav += '<button class="btn-sm btn-bg-secondary" data-manual="'+manual+'"">'+app.utils.capitalize(manual)+'</button> ';
			html.content += '<div class="tab block-std p-all-x2">'
						+ require('mustache-loader!html-loader?interpolate!./templates/manual_'+manual+'.html')()
						+ '</div>';
		}
		$(html.content).find('pre').each(function(){
			var trimHtml = $(this).html().split('\n').map(function(line){
				if(line.substr(0,4) == '    ') 
					return line.substr(4);
				else 
					return line;
			}).join('\n');
			html.content = html.content.replace($(this).html(),trimHtml.replace(/</g,'&lt;').trim());
	    });

		doc.$body = $(require('mustache-loader!html-loader?interpolate!./templates/index.html')({
			nav: html.nav,
			content: html.content
		}));

		doc.$el.html(doc.$body);
		if (typeof app.updateUrlNavigation != 'undefined') {
			doc.$body.find('.tabs__nav button').on('click',function(){
				setTimeout(function(){app.updateUrlNavigation(doc.getNavState());})
			});
		}
	}

	Documentation.prototype.getNavState = function(){
		var doc = this;
		return {
			framnav: 'documentation',
			manual: doc.$body.find('.tabs__nav button[data-manual].active').attr('data-manual') || '',
		}
	}
	return Documentation;
}