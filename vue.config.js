const { defineConfig } = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Bulk SquareFit',
    },
  },
  outputDir: path.resolve(__dirname, "../docs/"),
  publicPath: '/bulk-squarefit/'
})
