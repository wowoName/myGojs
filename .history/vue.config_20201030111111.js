module.exports = {
    pluginOptions: {
        quasar: {
            treeShake: true
        }
    },
    transpileDependencies: [
        /[\\\/]node_modules[\\\/]quasar[\\\/]/
    ],
    chainWebpack: config => {
        config.devTool = "none"
    }
}