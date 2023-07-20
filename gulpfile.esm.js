
import { src, dest, parallel, series } from 'gulp';
import pug from 'gulp-pug';
import stylus from 'gulp-stylus';
import clean from 'gulp-clean';
import terser from 'gulp-terser';
import nop from 'gulp-nop';

const
    SRC = './src/',
    DEST = './_dest/';

let minification = false;

export const html = () =>
    src(SRC + '*.pug')
        .pipe(pug({ pretty: !minification }))
        .pipe(dest(DEST));

export const css = () =>
    src(SRC + '*.styl', { sourcemaps: !minification })
        .pipe(stylus({ compress: minification }))
        .pipe(dest(DEST, { sourcemaps: '.' }));


export function js() {
    return src(SRC + '*.js', { sourcemaps: !minification })
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

const serv = cb => cb();

const upload = cb => {
    console.log('отправляем файлы на севрер');
    cb()
};

const make = parallel(html, css, js);

export const dev = series(make, serv);

export const prod = series(cleanDir, useMinification, make, upload);

