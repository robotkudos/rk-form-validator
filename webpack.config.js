const path = require('path');
const prod = process.env.NODE_ENV === 'production';

const babelOptions = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": "> 0.25%, not dead"
            }
        ]
    ]
}
module.exports = {
    entry: './src/index.ts',
    output: {
        filename: prod ? '[name].[bash].js' : '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    'ts-loader'
                ]
            }
        ]
    }
}