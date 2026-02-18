global.fw = require('./core/js/core.js');
fw.init();
// fw.debug = true;
if(fw.debug) console.log(fw);

document.body.append(utils.getNodeFromString('<div class="testComponent"> testComponent </div>'))
