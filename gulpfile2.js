var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');//scss编译css时添加映射关系  方便调试
var autoprefixer = require('gulp-autoprefixer');//css添加浏览器兼容前缀
var uglify = require('gulp-uglify');//压缩js文件
var browserSync = require('browser-sync');//监控文件  实时更新页面
var reload      = browserSync.reload;

/*全局配置*/
var srcPath={
    html:'newApp',
    css:"newApp/scss",
    script:'newApp/js',
    image:'newApp/images'
}
var destPath={
    css:"newApp/css"
}


gulp.task('sass', function() {
    return sass(srcPath.css, {style: 'compact', sourcemap: true})//指明文件路径，进行文件匹配
            .on('error', function (err){
                console.log('sassError:',err.message);
            })
        .pipe(gulp.dest(destPath.css));//输出路径

});
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "../"
    });
    gulp.watch('./newApp/scss/diagnosis/*.scss', ['sass']);
    gulp.watch('./newApp/scss/personal/*.scss', ['sass']);
    gulp.watch('./newApp/scss/hospitalTable/*.scss', ['sass']);
    gulp.watch('./newApp/scss/healthRecord/*.scss', ['sass']);
    gulp.watch('./newApp/scss/healthEvaluation/*.scss', ['sass']);
    gulp.watch('./newApp/scss/common.scss', ['sass']);
    gulp.watch("./newApp/diagnosis/*.html").on('change', browserSync.reload);
    gulp.watch("./newApp/personal/*.html").on('change', browserSync.reload);
    gulp.watch("./newApp/hospitalTable/*.html").on('change', browserSync.reload);
    gulp.watch("./newApp/healthRecord/*.html").on('change', browserSync.reload);
    gulp.watch("./newApp/healthEvaluation/*.html").on('change', browserSync.reload);
    gulp.watch("./newApp/css/app/diagnosis/*.css").on('change', browserSync.reload);
    gulp.watch("./newApp/css/app/personal/*.css").on('change', browserSync.reload);
    gulp.watch("./newApp/css/app/hospitalTable/*.css").on('change', browserSync.reload);
    gulp.watch("./newApp/css/app/healthRecord/*.css").on('change', browserSync.reload);
    gulp.watch("./newApp/css/app/healthEvaluation/*.css").on('change', browserSync.reload);
    // gulp.watch("./newApp/js/app/diagnosis/*.js").on('change', browserSync.reload);
    // gulp.watch("./newApp/js/app/personal/*.js").on('change', browserSync.reload);
});

//gulp.task('sass:watch', function() {
//    gulp.watch('./newApp/scss/diagnosis/*.scss', ['sass']);
//});

// 编译sass&压缩css
gulp.task('sass-compress', ['move'], function() {
    return gulp.src('./newApp/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())

        .pipe(gulp.dest('./release/css'));
});
gulp.task('default',['serve','sass'], function() {
    // 将你的默认的任务代码放在这
    console.log("default");
});