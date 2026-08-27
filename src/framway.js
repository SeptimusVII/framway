global.fw = require('./core/js/core.js');
fw.init();

window.addEventListener("load", function(e) {
	window.dispatchEvent(new Event('resize'));
});