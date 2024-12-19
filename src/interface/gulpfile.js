const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');

function constroiEstilos() {
    return src('index.scss')
        .pipe(sass())
        .pipe(dest(path.join(path.resolve(__dirname, '../../'), 'public')))
    ;
}

function vigiaTarefa() {
    watch(['index.scss'], constroiEstilos);
}

exports.default = series(constroiEstilos, vigiaTarefa);