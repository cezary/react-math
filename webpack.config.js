module.exports = {
  entry: './index.js',
  output: {
    filename: './dist/react-math.js',
    sourceMapFilename: './dist/react-math.map',
    library: 'MathML',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'React',
    'react/addons': 'React'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'}
    ]
  }
};
