var gulp = require('gulp');
var zip = require('gulp-zip');
var babel = require('gulp-babel');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var awsLambda = require("node-aws-lambda");

var src_dir = './src/**/*.es6';
gulp.task('build', function () {
    return gulp.src(src_dir)
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('watch', function () {
    gulp.watch(src_dir, ['build']);
});

gulp.task('clean', function () {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', function () {
    return gulp.src('lib/*.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({production: true}));
});

gulp.task('zip', function () {
    return gulp.src(['dist/**/*', '!dist/package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function (callback) {
    awsLambda.deploy('./dist.zip', require("./lambda-config.js"), callback);
});

gulp.task('deploy', function (callback) {
    return runSequence(
        ['clean'],
        ['build'],
        ['js', 'node-mods'],
        ['zip'],
        ['upload'],
        callback
    );
});

var AWS = require("aws-sdk");
var minimist = require('minimist');

var knownOptions = {
    string: 'logslimit',
    'default': {
        'logslimit': 1
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('logs', function (callback) {
    var config = require("./lambda-config.js");
    var cloudwatchlogs = new AWS.CloudWatchLogs({
        region: config.region
    });

    var logGroupName = '/aws/lambda/' + config.functionName;
    cloudwatchlogs.describeLogStreams({
        logGroupName: logGroupName,
        descending: true, // 直近のログを取得する
        limit: options.logslimit, // --logslimit オプションで指定可能
        orderBy: 'LastEventTime'
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            return;
        }
        data.logStreams.forEach(function (logStream) {
            // ログの取得。paginationは未実装
            cloudwatchlogs.getLogEvents({
                logGroupName: logGroupName,
                logStreamName: logStream.logStreamName
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    return;
                }
                // ログ出力
                data.events.forEach(function (event) {
                    var lines = event.message.split('\n');
                    lines.pop(); // 最後に付与されている改行文字を除去
                    // 先頭行を出力
                    console.log(lines.shift());
                    // 1ログに2行以上ログがあれば出力。その際にインデントする
                    for (var i in lines) {
                        console.log('\t' + lines[i]);
                    }
                });
            });
        });
    });
});
