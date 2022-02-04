import babel from 'rollup-plugin-babel';

const path = require('path');
const pkg = require(path.resolve(__dirname, 'package.json'))

export default [
    {
        input: 'src/Collection.js',
        plugins: [
            babel({
                exclude: 'node_modules/**'
            })
        ],
        output: {
            banner: `/*!
  * Berlioz Form JS v${pkg.version} (${pkg.homepage})
  * Copyright 2022 ${pkg.author}
  * Licensed under MIT (https://github.com/BerliozFramework/Form.js/blob/master/LICENSE)
  */`,
            format: 'umd',
            name: 'BerliozCollection',
            sourcemap: true,
            file: 'dist/collection.js',
        }
    },
    {
        input: 'src/jQueryCollection.js',
        external: ['jquery'],
        plugins: [
            babel({
                exclude: 'node_modules/**'
            })
        ],
        output: {
            banner: `/*!
  * Berlioz Form JS v${pkg.version} (${pkg.homepage})
  * Copyright 2022 ${pkg.author}
  * Licensed under MIT (https://github.com/BerliozFramework/Form.js/blob/master/LICENSE)
  */`,
            format: 'umd',
            name: 'BerliozCollection',
            sourcemap: true,
            globals: {
                jquery: 'jQuery'
            },
            file: 'dist/jQueryCollection.js',
        }
    }
];
