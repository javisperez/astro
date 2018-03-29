const mix = require('laravel-mix');
const path = require('path');
const tailwindcss = require('tailwindcss');
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g) || [];
    }
}
/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel application. By default, we are compiling the Sass
| file for your application, as well as bundling up your JS files.
|
*/

mix

    .webpackConfig({
        resolve: {
            modules: [
                path.resolve('./node_modules'),
                path.resolve('./src/renderer/js')
            ],
            alias: {
                '@': path.resolve('./src/renderer/scss'),
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        target: 'electron-renderer'
    });

mix

    .setPublicPath('dist')

    .copyDirectory('./assets/images', 'dist/images')

    .copy('./src/renderer/index.html', 'dist/index.html')

    // Copy fonts
    .copyDirectory([
        './node_modules/typeface-roboto/files',
        './assets/fonts',
    ], './dist/fonts')

    .js('./src/renderer/js/index.js', 'dist/js/app.js')

    .sass('./src/renderer/scss/app.scss', 'dist/css/app.css')

    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.js')]
    })

    .browserSync({
        proxy: false,
        files: [
            './src/renderer/**/.js',
            './src/renderer/**/.vue',
            './src/renderer/**/.html',
        ],
        open: false,
        server: {
            baseDir: './dist'
        },
        host: 'localhost',
        notify: false,
    });

// Only run PurgeCSS during production builds for faster development builds
// and so you still have the full set of utilities available during
// development.
// if (mix.inProduction()) {
//  @todo - this is not working currently, fix it!
//     mix.webpackConfig({
//         plugins: [
//             new PurgecssPlugin({

//                 // Specify the locations of any files you want to scan for class names.
//                 paths: glob.sync([
//                     path.join(__dirname, 'src/**/*.vue'),
//                     path.join(__dirname, 'src/**/*.js'),
//                     path.join(__dirname, 'src/**/*.html')
//                 ]),
//                 // whitelistPatterns: [/error-msg-.*/, /scale-list-.*/],
//                 extractors: [
//                     {
//                         extractor: TailwindExtractor,

//                         // Specify the file extensions to include when scanning for
//                         // class names.
//                         extensions: ['html', 'js', 'vue']
//                     }
//                 ]
//             })
//         ]
//     });
// }
if (!mix.inProduction()) {
    mix.sourceMaps();
}

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.ts(src, output); <-- Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
