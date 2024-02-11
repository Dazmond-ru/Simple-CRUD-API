const path = require('path')
const nodeExternals = require('webpack-node-externals')

const isMulti = process.env.NODE_ENV == 'cluster'

module.exports = {
  target: 'node',
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [nodeExternals()],
  entry: isMulti
    ? path.join(__dirname, 'src', 'cluster.ts')
    : path.join(__dirname, 'src', 'index.ts'),
  output: {
    path: path.join(__dirname, 'bundle'),
    filename: 'server.js',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
