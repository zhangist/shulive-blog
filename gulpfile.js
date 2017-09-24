const gulp = require('gulp');
const clean = require('gulp-clean');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
// const pug = require('gulp-pug');
// const sourcemaps = require('gulp-sourcemaps');

const SRC_PATH = './src/assets';
const DEST_PATH = './dist/assets';
const PATH = {
  IMG_SRC: `${SRC_PATH}/img/**/*`,
  IMG_DEST: `${DEST_PATH}/img`,
  CSS_SRC: `${SRC_PATH}/css/**/*.css`,
  CSS_DEST: `${DEST_PATH}/css`,
  JS_SRC: `${SRC_PATH}/js/**/*.js`,
  JS_DEST: `${DEST_PATH}/js`,
  VENDORS_SRC: `${SRC_PATH}/vendors/**/*`,
  VENDORS_DEST: `${DEST_PATH}/vendors`,
  FONTS_SRC: `${SRC_PATH}/fonts/**/*`,
  FONTS_DEST: `${DEST_PATH}/fonts`,
  VIEWS_SRC: './src/views/**/*',
  VIEWS_DEST: './dist/views',
};

// image
gulp.task('cleanimg', () => (
  gulp.src(`${PATH.IMG_DEST}/*`).pipe(clean())
));
gulp.task('img', ['cleanimg'], () => (
  gulp.src(PATH.IMG_SRC)
    .pipe(rev()).pipe(gulp.dest(PATH.IMG_DEST)) // 文件名加md5
    .pipe(rev.manifest()) // 生成rev-manifest.json
    .pipe(gulp.dest('./rev/img')) // 保存rev-manifest.json
));

// fonts
gulp.task('cleanfonts', () => (
  gulp.src(`${PATH.FONTS_DEST}/*`).pipe(clean())
));
gulp.task('fonts', ['cleanfonts'], () => (
  gulp.src(PATH.FONTS_SRC).pipe(gulp.dest(PATH.FONTS_DEST))
));

// vendors
gulp.task('cleanvendors', () => (
  gulp.src(`${PATH.VENDORS_DEST}/*`).pipe(clean())
));
gulp.task('vendors', ['cleanvendors'], () => (
  gulp.src(PATH.VENDORS_SRC).pipe(gulp.dest(PATH.VENDORS_DEST))
));

// css
gulp.task('cleancss', () => (
  gulp.src(`${PATH.CSS_DEST}/*`).pipe(clean())
));
gulp.task('css', ['cleancss', 'img'], () => (
  gulp.src(['./rev/img/*.json', PATH.CSS_SRC])
    .pipe(revCollector({ replaceReved: true }))
    .pipe(minifyCss())
    .pipe(rev()) // 文件名加md5
    .pipe(gulp.dest(PATH.CSS_DEST))
    .pipe(rev.manifest()) // 生成rev-manifest.json
    .pipe(gulp.dest('./rev/css')) // 保存rev-manifest.json
));

// js
gulp.task('cleanjs', () => (
  gulp.src(`${PATH.JS_DEST}/*`).pipe(clean())
));
gulp.task('js', ['cleanjs'], () => (
  gulp.src(PATH.JS_SRC)
    .pipe(uglify()) // 压缩js
    .pipe(rev()) // 文件名加md5
    .pipe(gulp.dest(PATH.JS_DEST))
    .pipe(rev.manifest()) // 生成rev-manifest.json
    .pipe(gulp.dest('./rev/js')) // 保存rev-manifest.json
));

// view
gulp.task('cleanview', () => (
  gulp.src(`${PATH.VIEWS_DEST}/*`).pipe(clean())
));
gulp.task('view', ['cleanview', 'css', 'js'], () => (
  gulp.src(['./rev/**/*.json', './src/views/**/*.pug'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/css/': '/css/',
        '/js/': '/js/',
        '/img/': '/img/',
      },
    }))
    /* .pipe(pug({
    doctype: 'html'
    })) */
    .pipe(gulp.dest(PATH.VIEWS_DEST))
));

gulp.task('default', ['img', 'css', 'vendors', 'fonts', 'js', 'view']);
