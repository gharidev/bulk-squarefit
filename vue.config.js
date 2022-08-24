const { defineConfig } = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Bulk SquareFit',
    },
  },
  outputDir: path.resolve(__dirname, "./docs/"),
  publicPath: '/bulk-squarefit/',
  pwa: {
    name: "Bulk SquareFit",
    themeColor: "#8a00e6",
    icons: {
      favicon32: './public/favicon-32x32.png',
      favicon16: './public/favicon-16x16.png',
      appleTouchIcon: './public/apple-touch-icon.png',
      maskIcon: './public/safari-pinned-tab.svg',
      msTileImage: './public/mstile-150x150.png'
    }
  }
})
