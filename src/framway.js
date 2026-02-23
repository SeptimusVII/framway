global.fw = require('./core/js/core.js');
// fw.debug = true;
fw.init();

document.body.append(utils.getNodeFromString('<div class="testComponent"> testComponent </div>'))
