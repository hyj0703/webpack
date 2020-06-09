const postcssPresetEnv = require('postcss-preset-env')
const sprites = require('postcss-sprites')
const px2rem = require('postcss-px2rem')

module.exports = {
  plugins: [
    //自动补全css前缀
    postcssPresetEnv({
      overrideBrowserslist: [
		"Android >= 4.0",
		"iOS >= 6",
		"last 10 QQAndroid versions",
		"last 10 UCAndroid versions"
	  ],
    }),
    sprites({
      relativeTo: 'rule',
      spritePath: './src/img',
      spritesmith: {
        padding: 4,
      },
      stylesheetPath: './src/css',
    }),
    px2rem({
      remUnit: 100,
    }),
  ],
}
