
// scss主打包入口

module.exports = {
	// 模块列表
	list: [
		"index", // 默认主模块
	],

	dir: "./src/styles/",   // 默认文件父级
	watch: "index",               // 监听和打包当前的模块，
	isWatchAll: false     		// 为true=>时监听和打包所有模块  

}

