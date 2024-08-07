import gulp from "gulp";
import gpug from "gulp-pug";
import { deleteAsync } from "del";
import gws from "gulp-webserver";
import image from "gulp-image";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import minifyCss from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";
import ts from "gulp-typescript";
import browserify from "browserify";
import vinySourceStream from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import tsify from "tsify";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import watchify from "watchify";
import fancy_log from "fancy-log";


const tsProject = ts.createProject("tsconfig.json");
const sass = gulpSass(dartSass);

const routes = {
  pug: {
    src: "src/**/*.pug",
    dest: "build",
    watch: "src/**/*.pug",
  },
  img: {
    src: "src/images/**/*",
    dest: "build/images",
  },
  scss: {
    src: "src/scss/style.scss",
    dest: "build/css",
    watch: "src/scss/**/*.scss",
  },
  js: {
    src: ["src/js/main.js", "src/js/owl.carousel.js"],
    dest: "build/js",
    watch: "src/js/**/*.js",
  },
  ts: {
    dest: "build/js",
    watch: "src/ts/**/*.ts",
  },
  font:{
    src: ["src/fonts/mvoting/*"],
    dest: "build/fonts"
  }
};

// FUNCTIONS
// const watchedBrowserify = async ()=>{
//   await watchify(browserify({
//     basedir: '.',
//     debug: true,//debug:true의 값을 사용하면, tsify는 번들된 JavaScript 파일 안에 소스맵을 내보낸다. 소스맵을 사용하면 번들로 제공된 JavaScript 대신 브라우저에서 원본 Typescript 코드를 디버깅할 수 있다.  browser디버거를 열고 test.ts 안에 브레이크 포인트를 넣으면 소스 맵이 작동하는지 테스트할 수 있다. 페이지를 새로고침하면 브레이크 포인트가 페이지를 일시 중지하고 test.ts 에서 import로 먼저 들어오는 utils.ts를 디버깅할 수 있어야 한다. 
//     entries: ['src/main.ts'],
//     cache: {},
//     packageCache: {}
//   }).plugin(tsify));
// }
// function bundle() {
//   return watchedBrowserify
//       .bundle()
//       .on('error', fancy_log)
//       .pipe(source('bundle.js'))
//       .pipe(gulp.dest(routes.ts.dest));
// }
const fonts = async ()=>{
    await gulp.src(routes.font.src, {read:false})
    .pipe(gulp.dest(routes.font.dest));
}

const watchedBrowserify = watchify( //#1 수정사항 지켜보기
  browserify({ //#0 typescript파일에서 require 또는 import 구분의 파일을 찾아내서 연결해 준다. 
    basedir:'.',
    debug:true,//debug:true의 값을 사용하면, tsify는 번들된 JavaScript 파일 안에 소스맵을 내보낸다. 소스맵을 사용하면 번들로 제공된 JavaScript 대신 브라우저에서 원본 Typescript 코드를 디버깅할 수 있다.  browser디버거를 열고 test.ts 안에 브레이크 포인트를 넣으면 소스 맵이 작동하는지 테스트할 수 있다. 페이지를 새로고침하면 브레이크 포인트가 페이지를 일시 중지하고 test.ts 에서 import로 먼저 들어오는 utils.ts를 디버깅할 수 있어야 한다. 
    entries:['src/ts/test.ts'],
    cache:{},
    packageCache:{}
  })
  .plugin(tsify, { noImplicitAny: true })
);

const ts_bundler = ()=>{ //#2 typescript를 번들링한다.
  
  return  watchedBrowserify
          .transform('babelify', {
            presets:['@babel/preset-env'],
            extensions: ['.ts']
          })
          .bundle() 
}



const tsToJs = () =>{ //#3. typescript를 js파일로 변환
  return ts_bundler()
        .on('error', fancy_log)
        .pipe(vinySourceStream('test.js'))
        .pipe(buffer())
        .pipe( babel({
           presets:['@babel/preset-env']
         }))
        .pipe(sourcemaps.init({loadMaps: true}))
        
}

// const typescript = async ()=>{
//   await tsProject.src().pipe(tsProject()).js.pipe(sourcemaps.init()).pipe(babel()).pipe(gulp.dest(routes.ts.dest));
// }

const tsCompile = () =>{ // #4. typescript파일 컴파일
  return tsToJs()
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(routes.ts.dest))
}
  
const js = async () => {
  await gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));
};
const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug({pretty:true})).pipe(gulp.dest(routes.pug.dest));
const webServer = () => {
  gulp.src("build").pipe(gws({ livereload: true, open: true }));
};
const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  //gulp.watch(routes.img.src, img); //너무 큰 이미지가 있다면 고려해야할 사항
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
  //gulp.watch(routes.ts.watch, typescript);  
};
watchedBrowserify.on("update", ts_bundler);

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
      })
    )
    //.pipe(minifyCss())    
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(routes.scss.dest));

const ghDeploy = () =>
  gulp.src("build/**/*").pipe(
    ghPages([
      {
        remoteUrl: "https://github.com/hanguKang/gulp-test",
      },
    ])
  ); //github




// TASKS
const clean = await deleteAsync(["build/**/*", "!build"]);
const prepare = gulp.series([fonts, img]);
//const assets = gulp.series([pug, styles, js, typescript]);
const assets = gulp.series([pug, styles, js, tsCompile]);
const live = gulp.parallel([webServer, watch]);

// EXPORT
export const build = gulp.series([clean, prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, ghDeploy]);
