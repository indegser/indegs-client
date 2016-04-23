module.exports = {
    context: __dirname + '/src',
    entry: './entry.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/public/',
    },
    module: {
        loaders: [        
            {
                test: /\.js$/,            
                exclude: /node_modules/,            
                loader: 'babel-loader',
                query: {
                    presets: ["react", "es2015"],
                    cacheDirectory: true
                }        
            }    
        ]
    }
}