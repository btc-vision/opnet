process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});

import gulp from 'gulp';
import gulpcache from 'gulp-cached';
import logger from 'gulp-logger';
import ts from 'gulp-typescript';

const tsProject = ts.createProject('tsconfig.json');
const tsProjectCJS = ts.createProject('tsconfig.cjs.json');

function onError(e) {
    console.log('Errored', e);
}

async function build() {
    return new Promise(async (resolve) => {
        tsProject
            .src()
            .pipe(gulpcache())
            .pipe(
                logger({
                    before: 'Starting...',
                    after: 'Project compiled!',
                    extname: '.js',
                    showChange: true,
                }),
            )
            .pipe(tsProject())
            .on('error', onError)
            .pipe(gulp.dest('build'))
            .on('end', async () => {
                resolve();
            });
    });
}

async function buildCJS() {
    return new Promise(async (resolve) => {
        tsProject
            .src()
            .pipe(gulpcache())
            .pipe(
                logger({
                    before: 'Starting...',
                    after: 'Project compiled!',
                    extname: '.js',
                    showChange: true,
                }),
            )
            .pipe(tsProjectCJS())
            .on('error', onError)
            .pipe(gulp.dest('cjs'))
            .on('end', async () => {
                resolve();
            });
    });
}

async function buildProtoYaml() {
    return new Promise(async (resolve) => {
        gulp.src('./src/**/*.yaml')
            .pipe(
                logger({
                    before: 'Starting...',
                    after: 'Compiled yaml.',
                    extname: '.yaml',
                    showChange: true,
                }),
            )
            .pipe(gulpcache())
            .pipe(gulp.dest('./build/'))
            .on('end', () => {
                gulp.src('./src/**/*.proto')
                    .pipe(
                        logger({
                            before: 'Starting...',
                            after: 'Compiled protobuf.',
                            extname: '.proto',
                            showChange: true,
                        }),
                    )
                    .pipe(gulp.dest('./build/'))
                    .on('end', async () => {
                        gulp.src('./src/config/*.conf')
                            .pipe(
                                logger({
                                    before: 'Starting...',
                                    after: 'Compiled conf.',
                                    extname: '.conf',
                                    showChange: true,
                                }),
                            )
                            .pipe(gulpcache())
                            .pipe(gulp.dest('./build/config'))
                            .on('end', async () => {
                                resolve();
                            });
                    });
            });
    });
}

gulp.task('default', async () => {
    await build().catch((e) => {});
    await buildProtoYaml();

    return true;
});

gulp.task('cjs', async () => {
    await buildCJS().catch((e) => {});
    await buildProtoYaml();

    return true;
});

gulp.task('watch', () => {
    gulp.watch(
        ['src/**/**/*.ts', 'src/**/*.ts', 'src/**/*.js', 'src/*.ts', 'src/*.js'],
        async (cb) => {
            await build().catch((e) => {
                console.log('Errored 2', e);
            });

            cb();
        },
    );

    gulp.watch(
        [
            'src/components/*.yaml',
            'src/**/*.yaml',
            'src/src/*.yaml',
            'src/*.proto',
            'src/**/**/*.proto',
            'src/**/*.proto',
            '*.proto',
            '*.yaml',
            '*.conf',
            'src/config/*.conf',
        ],
        async (cb) => {
            await buildProtoYaml().catch((e) => {
                console.log('Errored 2', e);
            });

            cb();
        },
    );
});
