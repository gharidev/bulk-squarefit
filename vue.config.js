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
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'white',
    // configure the workbox plugin
    // workboxPluginMode: 'InjectManifest',
    iconPaths: {
      faviconSVG: 'favicon.svg',
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-16x16.png',
      appleTouchIcon: 'apple-touch-icon.png',
      maskIcon: 'safari-pinned-tab.svg',
      msTileImage: 'mstile-150x150.png'
    },
  }
})
