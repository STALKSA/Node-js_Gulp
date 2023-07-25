
import { src, dest, parallel, series, watch } from 'gulp';
import pug from 'gulp-pug';
import stylus from 'gulp-stylus';
import clean from 'gulp-clean';
import terser from 'gulp-terser';
import nop from 'gulp-nop';
import {create} from 'browser-sync';

const
    SRC = './src/',
    DEST = './_dest/',
    JS_SOURCE = SRC+ '*.js',
    PUG_SOURCE = SRC + '**/*.pug',
    STYL_SIURCE = SRC + '*.styl',
    browserSync = create();

let minification = false;

export const html = () =>
    src([PUG_SOURCE, '!./src/_includes/**/*.*'])
        .pipe(pug({ pretty: !minification }))
        .pipe(dest(DEST));

export const css = () =>
    src(STYL_SIURCE, { sourcemaps: !minification })
        .pipe(stylus({ compress: minification }))
        .pipe(dest(DEST, { sourcemaps: '.' }));


export function js() {
    return src(JS_SOURCE, { sourcemaps: !minification})
        .pipe(minification ? terser() : nop())
        .pipe(dest(DEST, { sourcemaps: '.' }));

}




const cleanDir = () =>
    src(DEST + '**/*.*', { read: true })
        .pipe(clean());

const useMinification = cb => {
    minification = true;
    cb()
};

const BsReload = cb => {
    browserSync.reload(); 
    cb()
};

const serv = cb => {
    browserSync.init({
        server: { baseDir: DEST }
    });
    watch(DEST + '**/*.*', BsReload);
    watch(PUG_SOURCE, html);
    watch(STYL_SIURCE, css);
    watch(JS_SOURCE,js);
    cb();
};

const upload = cb => {
    console.log('отправляем файлы на севрер');
    cb()
};

const make = parallel(html, css, js);

export const dev = series(make, serv);

export const prod = series(cleanDir, useMinification, make, upload);

