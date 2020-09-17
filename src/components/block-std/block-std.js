module.exports = function(app){
	var BlockStd = Object.getPrototypeOf(app).BlockStd = new app.Component("block-std");
	// BlockStd.debug = true;
	BlockStd.createdAt      = "2.0.0";
	BlockStd.lastUpdate     = "2.0.0";
	BlockStd.version        = "1";
	// BlockStd.factoryExclude = true;
	// BlockStd.loadingMsg     = "This message will display in the console when component will be loaded.";

	// BlockStd.prototype.onCreate = function(){
	  // do thing after element's creation
	// }
	return BlockStd;
}