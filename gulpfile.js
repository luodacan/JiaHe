var gulp = require('gulp');

// 各种组件
var sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),//scss编译css时添加映射关系  方便调试
    autoprefixer = require('gulp-autoprefixer'),//css添加浏览器兼容前缀
    uglify = require('gulp-uglify'),//压缩js文件
    imagemin 		= require('gulp-imagemin'),		// imagemin 图片压缩
    pngquant 		= require('imagemin-pngquant'),	// imagemin 深度压缩
    browserSync = require('browser-sync'),//监控文件  实时更新页面
    reload      = browserSync.reload;//无刷新方式更新页面

/*全局配置*/
var srcPath={
    html:'newApp',
    scss:"newApp/scss",
    css:"newApp/css",
    script:'newApp/js',
    lib:'newApp/lib',
    image:'newApp/images'
}
var buildPath={
    html:'build',
    css:"build/css",
    script:'build/js',
    image:'build/images',
    lib:'build/lib'
}

/*-------- 开发环境 --------*/

//预编译scss
gulp.task('sass', function() {
    gulp.src(srcPath.scss+'/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError)) //outputStyle 压缩风格 这里是简介格式
        .pipe(autoprefixer()) //自动处理浏览器前缀
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(srcPath.css))
        .pipe(reload({stream: true}))
        .on('change',browserSync.reload);//reload无刷新没效果  所以用刷新页面

});
// 监听
gulp.task('watch',function(){
    console.log('watch');
    // 监听HTML
    gulp.watch(srcPath.html+"/**/*.html").on('change', browserSync.reload);
    // 监听scss
    gulp.watch(srcPath.scss+"/**/*.scss",['sass']);
    // 监听js
    gulp.watch([srcPath.script+"/**/*.js",'!'+srcPath.script+"/**/*.min.js"]).on('change', browserSync.reload);
});
// 本地服务器
gulp.task('webserver', function() {
    browserSync.init({
        server: "../"
    });
});
gulp.task('default',['sass','watch','webserver'], function() {
    // 将你的默认的任务代码放在这
    console.log("default");
});


/*------ 生产环境  -------*/
// 清理文件
// gulp.task('clean', function() {
//     return gulp.src( [destPath.css+'/maps',destPath.script+'/maps'], {read: false} ) // 清理maps文件
//         .pipe(clean());
// });

//预编译scss
gulp.task('buildSass', function() {
    gulp.src(srcPath.scss+'/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError)) //outputStyle 压缩风格 这里是压缩格式
        .pipe(autoprefixer()) //自动处理浏览器前缀
        .pipe(gulp.dest(buildPath.css))
});

// 脚本压缩
gulp.task('buildScript', function() {
    return gulp.src( [srcPath.script+'/**/*.js','!'+srcPath.script+'/**/*.min.js'] ) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
        .pipe(uglify()) // 使用uglify进行压缩，并保留部分注释
        .pipe(gulp.dest( buildPath.script )); // 输出路径
});
// imagemin 图片压缩
gulp.task('buildImages', function(){
    return gulp.src( srcPath.image+'/**/*' ) // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不要移除svg的viewbox属性
            use: [pngquant()] // 深度压缩PNG
        }))
        .pipe(gulp.dest(buildPath.image )); // 输出路径
});
// HTML处理
gulp.task('buildHtml', function() {
    console.log('html');
    return gulp.src( srcPath.html+'/**/*.html')
        .pipe(gulp.dest( buildPath.html ));
});
// 转移其它文件
gulp.task('buildOther', function() {
    return gulp.src([srcPath.lib+'**/**/*'] ) // 复制lib文件夹
        .pipe(gulp.dest(buildPath.lib ));
});
gulp.task('build',['buildSass','buildScript','buildHtml','buildOther','buildImages'], function() {
    // 将你的默认的任务代码放在这
    console.log("build");
});