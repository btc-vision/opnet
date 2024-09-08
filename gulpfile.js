import gulp from 'gulp';
import gulpcache from 'gulp-cached';
import logger from 'gulp-logger';
import ts from 'gulp-typescript';

const tsProjectESM = ts.createProject('tsconfig.json');

function onError(e) {
    console.error('Error:', e);
}

function buildESM() {
    return tsProjectESM
        .src()
        .pipe(gulpcache('ts-esm'))
        .pipe(
            logger({
                before: 'Starting ESM compilation...',
                after: 'ESM compilation done!',
                extname: '.js',
                showChange: true,
            }),
        )
        .pipe(tsProjectESM())
        .on('error', onError)
        .pipe(gulp.dest('build'));
}

function buildProtoYaml() {
    return gulp
        .src('./src/**/*.yaml')
        .pipe(
            logger({
                before: 'Processing YAML files...',
                after: 'YAML files processed!',
                extname: '.yaml',
                showChange: true,
            }),
        )
        .pipe(gulpcache('yaml'))
        .pipe(gulp.dest('./build/'))
        .on('end', () => {
            gulp.src('./src/**/*.proto')
                .pipe(
                    logger({
                        before: 'Processing Proto files...',
                        after: 'Proto files processed!',
                        extname: '.proto',
                        showChange: true,
                    }),
                )
                .pipe(gulpcache('proto'))
                .pipe(gulp.dest('./build/'));
        });
}

const build = gulp.series(buildESM, buildProtoYaml);

gulp.task('build', build);
gulp.task('default', build);

gulp.task('watch', () => {
    gulp.watch(['src/**/*.ts', 'src/**/*.js'], gulp.series(buildESM));
    gulp.watch(
        ['src/**/*.yaml', 'src/**/*.proto', '*.yaml', '*.proto', '*.conf', 'src/config/*.conf'],
        buildProtoYaml,
    );
});
