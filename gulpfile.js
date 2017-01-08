'use strict';

let gulp = require('gulp');
let less = require('gulp-less');
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('gulp-autoprefixer');
let del = require('del');
let cssnano = require('gulp-cssnano');
let gconcat = require('gulp-concat');
let runSequence = require('run-sequence');
let util = require('gulp-util');
let uglify = require('gulp-uglify');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
let rename = require('gulp-rename');
let inject = require('gulp-inject');
let eslint = require('gulp-eslint');
let ngAnnotate = require('gulp-ng-annotate');
let fs = require('fs');

let path = require('path');
let appDirectory = './';
let buildDirectory = './build';
let config = require(`${appDirectory}/client/config/config.json`);

let serverConfig = {
    server: {
        baseDir: appDirectory
    },
    port: 8000
};

function getPath(src, relatedTo) {
    relatedTo = relatedTo || appDirectory;

    if (!src) {
        return path.join(relatedTo);
    } else {
        if (Array.isArray(src)) {
            return src.map(function (s) {
                return path.join(relatedTo, s);
            });
        }
        return path.join(relatedTo, src);
    }
}

// ** ================================= DEVELOPMENT TASKS ====================================== **

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    inject
/// Purpose: Inject js/css files into index.html
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('inject', function () {
    let jsPath = config.javascript;
    let index = gulp.src(getPath('index.html'));
    let filesPath = [].concat(jsPath.thirdparty, jsPath.client, config.css);

    let filesSource = gulp.src(filesPath, { read: false });
    console.log(filesPath)

    return index.pipe(inject(filesSource, { ignorePath: '', addRootSlash: false }))
        .pipe(gulp.dest(getPath()));
});

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    lint
/// Purpose: linting JavaScript code files
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('lint', function () {
    return gulp.src(getPath('client/js/client/**/*.js'))
        .pipe(eslint())
        .pipe(eslint.format('table', process.stdout))
        .pipe(eslint.failAfterError())
        .on('error', function (er) {
            throw er.message;
        });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    styles
/// Purpose: Re-compile less files
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('styles', function () {
    return gulp.src(getPath('client/styles/less/main.less'))
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (error) {
            util.log(util.colors.yellow(`${error}`));
            this.emit('end');
        }))
        .pipe(autoprefixer('last 3 version'))
        .pipe(rename({ suffix: '.dev' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(getPath('client/styles')))
        .pipe(reload({ stream: true }));
});

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    watch
/// Purpose: Watcher for scss/js/html files
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function () {
    // Watch *less files
    gulp.watch(getPath('client/styles/less/**/*.less'), ['styles']);

    // Watch *html files
    gulp.watch([getPath('index.html'), getPath('client/examples/**/*.html'), getPath('client/views/**/*.html')], browserSync.reload);

    // Watch *js files
    gulp.watch(getPath('client/js/client/**/*.js'), browserSync.reload);
});

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    webserver
/// Purpose: Init and run simple web server
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('webserver', function () {
    browserSync.init({
        server: serverConfig.server,
        port: serverConfig.port,
        notify: false
    });
});

// ** ================================= PRODUCTION TASKS ======================================= **
///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    clean:build
/// Purpose: Remove all files from build folder
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('clean:build', function () {
//     return del(getPath('/*', buildDirectory));
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    inject:build
/// Purpose: Inject minified js/css files into index.html
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('inject:build', function () {
//     let index = gulp.src(getPath('/index.html'));
//     let filesPath = [].concat(getPath('js/libs.min.js', buildDirectory), getPath('js/app.min.js', buildDirectory), getPath('css/main.min.css', buildDirectory));
//     let filesSource = gulp.src(filesPath, { read: false });

//     return index.pipe(inject(filesSource, { ignorePath: 'build', addRootSlash: false }))
//         .pipe(gulp.dest(getPath('/', buildDirectory)));
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    scripts:build
/// Purpose: Concat and uglify js files
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('scripts:build', function () {
//     let jsPath = config.javascript;
//     let filesPath = [].concat(jsPath.thirdparty, jsPath.client);

//     del(getPath(config.env.appConfigPath) + config.env.appConfigName);
//     gulp.src('./env/prod.js')
//         .pipe(rename(config.env.appConfigName))
//         .pipe(gulp.dest(getPath('js/client/constants/')))
//         .on('end', function () {
//             gulp.src(filesPath)
//                 .pipe(gconcat('app.js'))
//                 .pipe(rename({ suffix: '.min' }))
//                 .pipe(ngAnnotate())
//                 .pipe(uglify())
//                 .pipe(gulp.dest(getPath('js/', buildDirectory)));
//         });
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    scripts:build
/// Purpose: Concat and uglify js files for each environment
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('scripts:build:env', function () {
//     let jsPath = config.javascript;

//     config.env.environments.forEach(function (environment) {
//         let configName = environment.name + '.' + config.env.appConfigName;

//         if (environment.name === 'dev') {
//             let fileContent = fs.readFileSync(environment.path, 'utf8');
//             if (fileContent.indexOf('ecsc001047ad') > 0) {
//                 throw 'String ecsc001047ad was founded.';
//             }
//             if (fileContent.indexOf('ECSC001047AD') > 0) {
//                 throw 'String ECSC001047AD was founded.';
//             }
//         }

//         gulp.src(environment.path)
//             .pipe(rename(configName))
//             .pipe(gulp.dest(getPath('js/client/constants/')))
//             .on('end', function () {
//                 jsPath.client.forEach(function (file, index) {
//                     if (file.endsWith(config.env.appConfigName)) {
//                         jsPath.client[index] = 'client/js/client/constants/' + configName;
//                     }
//                 });

//                 if (environment.boxes.length === 0) { return; }

//                 let filesPath = [].concat(jsPath.thirdparty, jsPath.client);
//                 let jsSource = gulp.src(filesPath);

//                 let min = jsSource.pipe(gconcat('app.js'))
//                     .pipe(rename({ suffix: '.min' }))
//                     .pipe(ngAnnotate())
//                     .pipe(uglify());

//                 environment.boxes.forEach(function (box) {
//                     min.pipe(gulp.dest(getPath(config.env.destination + box, './deployment/')));
//                 });
//             });
//     });
// });

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    styles:build
/// Purpose: Compile less to minified css file
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('styles:build', function () {
    return gulp.src(getPath('client/styles/less/main.less'))
        .pipe(less())
        .pipe(autoprefixer('last 3 version'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest(getPath('css/', buildDirectory)));
});

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    move:build
/// Purpose: Copy content files to build folder
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('move:build', function () {
    let filesPath = [].concat(config.html.templates, config.html.views, config.localization, config.assets);

    return gulp.src(filesPath, { base: appDirectory })
        .pipe(gulp.dest(getPath('', buildDirectory)));
});


// ** ====================================== MAIN TASKS ========================================= **
///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    dev
/// Purpose: Run application in development mode
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('dev', ['lint', 'webserver', 'styles', 'watch', 'inject']);

///////////////////////////////////////////////////////////////////////////////////////////////////
/// Name:    build
/// Purpose: Run application in production mode
/// Type:    task
/// Status:  [stable]
///////////////////////////////////////////////////////////////////////////////////////////////////
// gulp.task('build', function () { runSequence('clean:build', ['scripts:build', 'styles:build'], 'move:build', 'scripts:build:env', 'inject:build'); });
