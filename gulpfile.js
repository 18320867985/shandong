var gulp = require('gulp');
var watch = require("gulp-watch");
var del = require("del");
var minCss = require('gulp-clean-css'); //gulp-minify-css:压缩css文件 npm install gulp-clean-css
var connect = require('gulp-connect'); //gulp-connect 创建服务器  npm install --save-dev gulp-connect
var minJs = require('gulp-uglify'); //压缩javascript文件  npm install gulp-uglify
var img = require('gulp-imagemin'); //gulp-imagemin:压缩png、jpj、git、svg格式图片 npm install --save-dev gulp-imagemin
var rename = require("gulp-rename"); // npm install gulp-rename --save-dev  重命名文件，把一个文件储存不同版本时使用
var concat = require('gulp-concat'); //npm install gulp-concat --save-dev  整合文件
var minHtml = require('gulp-htmlmin'); //npm install gulp-htmlmin --save-dev 压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作

var vue = require('rollup-plugin-vue');
var vembedCss = require('rollup-plugin-embed-css');


//var css = require('rollup-plugin-css-only');
// var scss = require('rollup-plugin-scss');
// var postcss = require('rollup-plugin-postcss');

var replace = require('rollup-plugin-replace');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var json = require("rollup-plugin-json");
var postcss = require("gulp-postcss"); // 手机端自动补全css3前缀  cnpm install --save-dev gulp-postcss
var autoprefixer = require('autoprefixer'); // npm install --save-dev autoprefixer
var sass = require('gulp-sass');
var eslint = require("gulp-eslint"); // 检查es5 ees6 js gulp-eshint

var less = require("gulp-less");

var appJs = require("./entry-js.js"); // js 打包入口
var appScss = require("./entry-css.js"); // scss 打包入口
var isScss = true; // scss=>true 或 less=>false

// 文件路径
var paths = {
	stylePath: ['./src/styles/**/*.*', './src/scss/**/*.scss', './src/less/**/*.less'],
	htmlPath: ['./src/**/*.html'],
	jspath: ['./src/modules/**/*.*', './src/components/**/*.*', './src/libs/**/*.*'],
}


// 清空目录gulp-del
gulp.task('del', function(cd) {

	del(["./dist"], cd); //gulp-del
});


/******发布文件*******/
gulp.task('release', ["build-css", "build-js"], function() {

	gulp.src(['./src/**/*.html'])
		//.pipe(minHtml({ collapseWhitespace: true }))  // 压缩html
		.pipe(gulp.dest('./dist/')); //复制html

	gulp.src(['./src/static/css/*.css'])
		.pipe(minCss()).pipe(gulp.dest('./dist/static/css')); //复制css

	gulp.src(['./src/static/css/fonts/**/*.*'])
		.pipe(gulp.dest('./dist/static/css/fonts')); //复制fonts-css

	gulp.src(['./src/static/css/cstFonts/**/*.*'])
		.pipe(gulp.dest('./dist/static/css/cstFonts')); //复制cstFonts-css

	gulp.src('./src/static/js/**/*.*')
		.pipe(gulp.dest('./dist/static/js/')); //复制js

	gulp.src('./src/static/images/**/*.*')
		//.pipe(img())                     // 压缩图片
		.pipe(gulp.dest('./dist/static/images/')); //复制img

	gulp.src(['./src/ueditor/**/*.*']) // ueditor 富文本编辑器
		.pipe(gulp.dest('./dist/ueditor'));

	gulp.src(['./src/static/**/*.*', '!./src/static/css/**/*.*', '!./src/static/js/**/*.*',
		'!./src/static/images/**/*.*'
	]).pipe(gulp.dest('./dist/static'));

});

/* watch监听*/
gulp.task("watch", ['build-css', 'build-js', 'connect'], function() {

	//合拼vue组件css和js文件
	watch(paths.jspath, function() {
		gulp.start("dev-js");
	});

	//styles的scss
	watch(paths.stylePath, function() {
		gulp.start("dev-css");

	});

	//监听html
	watch(paths.htmlPath, function() {
		gulp.start("html");
	});

});

gulp.task("html", function() {
	gulp.src(paths.htmlPath).pipe(connect.reload());
});


//开启http服务器

var sev = function() {
	connect.server({
		root: 'src',
		livereload: true,
		port: 8888,


	});
}
gulp.task('connect',
	function() {
		sev();
	});



// 全局的css 
gulp.task("dev-css", async function() {

	try {
		appScss.list.forEach(function(item) {

			if (item == appScss.watch) {
				if (isScss) {
					gulp.src(appScss.dir + item + "/all.scss")
						.pipe(sass().on('error', sass.logError)) // sass编译
						.pipe(postcss([autoprefixer])) // 自动添加css3缀-webkit-  适合用于手机端 
						.pipe(rename(item + ".css")).pipe(gulp.dest('./src/static/css')).pipe(connect.reload());
				} else {
					gulp.src(appScss.dir + item + "/all.less")
						.pipe(less()) // less编译
						.pipe(postcss([autoprefixer])) // 自动添加css3缀-webkit-  适合用于手机端 
						.pipe(rename(item + ".css")).pipe(gulp.dest('./src/static/css')).pipe(connect.reload());
				}
			}
		});

	} catch (error) {
		console.log(error);
	}

});

gulp.task("build-css", async function() {

	try {
		return await Promise.all(appScss.list.map(async function(item) {
			return compileCss(item, appScss.dir);
		}));

	} catch (error) {
		console.log(error);
	}

});


function compileCss(item, dir) {

	if (isScss) {
		try {

			return new Promise(function(resolve, reject) {
				var result = gulp.src(dir + item + "/all.scss")
					.pipe(sass().on('error', sass.logError)) // sass编译
					.pipe(postcss([autoprefixer])) // 自动添加css3缀-webkit-  适合用于手机端 
					.pipe(rename(item + ".css")).pipe(gulp.dest('./src/static/css'));
				resolve(result);
			});

		} catch (error) {
			console.log(error);
		}
	}

	// less
	else {
		try {
			return new Promise(function(resolve, reject) {
				var result = gulp.src(dir + item + "/all.less")
					.pipe(less()) // less编译
					.pipe(postcss([autoprefixer])) // 自动添加css3缀-webkit-  适合用于手机端 
					.pipe(rename(item + ".css")).pipe(gulp.dest('./src/static/css'));
				resolve(result);
			});

		} catch (error) {
			console.log(error);
		}
	}

}



function reloadJs() {
	return new Promise(function(resolve, reject) {
		var result = gulp.src(paths.jspath).pipe(connect.reload());
		resolve(result);
	});
}


// 检查js
// gulp.task('t_eslint', function() {
// 	//gulp.src(paths.jsBabel).pipe(eslint()).pipe(eslint.format());
// });

gulp.task('dev-js', async function() {

	try {
		return await Promise.all(appJs.list.map(async function(item) {
			if (item == appJs.watch) {
				return asyncDevList(item, appJs.dir);
			}

		})).then(function() {
			reloadJs(); // 重启浏览器
		});

	} catch (error) {
		console.log(error);
	}

});

gulp.task('build-js', async function() {
	try {
		return await Promise.all(appJs.list.map(async function(item) {
			return asyncBuildList(item, appJs.dir);
		}));
	} catch (error) {
		console.log(error);
	}


});


async function asyncDevList(item, dir) {

	const bundle = await rollupBuild(false, item, dir);
	await bundle.write({
		file: './src/static/js/' + item + ".js",
		format: 'umd',
		name: 'umd',
		//sourcemap: true,
		strict: false, //在生成的包中省略`"use strict";`
	});


}

async function asyncBuildList(item, dir) {

	const bundle = await rollupBuild(true, item, dir);
	await bundle.write({
		file: './src/static/js/' + item + ".js",
		format: 'umd',
		name: 'umd',
		//sourcemap: true,
		strict: false, //在生成的包中省略`"use strict";`
	});

}

// 是否压缩js
function uglify_list(isBuild) {
	return isBuild ? uglify() : function() {};
}

function rollupBuild(isBuild, name, dir) {
	
	return rollup.rollup({

		input: dir + name + "/app.js",

		/* 默认情况下，模块的上下文 - 即顶级的this的值为undefined。您可能需要将其更改为其他内容，如 'window'。*/
		context: "window",

		plugins: [
			vue(),
			vembedCss(),
			/*commonjs 转换 es6*/
			resolve(),
			commonjs(),
			replace({
				'process.env.NODE_ENV': isBuild ? JSON.stringify('production') : JSON.stringify('development'),
			}),

			babel({
				exclude: ['node_modules/**'],
				presets: ["es2015-rollup", "stage-2"]
			}),
			/* 使用uglify压缩js 不能output 输出 format: 'es' 格式 否会报错*/
			uglify_list(isBuild)

		],
	});
}
