const path = require('path')
const postcssPresetEnv = require('postcss-preset-env')
const sprites = require('postcss-sprites')
const px2rem = require('postcss-px2rem')

module.exports = {
  plugins: [
    //自动补全css前缀
    postcssPresetEnv(),
    sprites({
      filterBy: ({ path: imgPath }) => {
        //非sprite文件夹下的图片不合并
        const [first, second] = path.dirname(imgPath).split(path.sep).reverse()
        return first == 'sprite' || second === 'sprite'
          ? Promise.resolve()
          : Promise.reject()
      },
      groupBy: ({ path: imgPath }) => {
        //以sprite文件夹下的子目录作为分组，子目录下的图片和合并成一张雪碧图
        const [first, second, third] = path
          .dirname(imgPath)
          .split(path.sep)
          .reverse()
        const { name } = path.parse(imgPath)
        if (first === 'sprite') {
          return Promise.resolve(`${second}-${name}`)
        } else if (second === 'sprite') {
          return Promise.resolve(`${third}-${first}`)
        } else {
          return Promise.reject()
        }
      },
      hooks: {
        onUpdateRule: (
          rule,
          token,
          { coords, ratio, spriteWidth, spriteHeight, spriteUrl }
        ) => {
          //start:修改自postcss-sprites/lib/core中的updateRule方法
          const posX = -Math.abs(coords.x / ratio)
          const posY = -Math.abs(coords.y / ratio)
          const sizeX = spriteWidth / ratio
          const sizeY = spriteHeight / ratio
          token
            .cloneAfter({
              type: 'decl',
              prop: 'background-image',
              value: `url(./${spriteUrl})`,
            })
            .cloneAfter({
              prop: 'background-position',
              value: `${posX}px ${posY}px`,
            })
            .cloneAfter({
              prop: 'background-size',
              value: `${sizeX}px ${sizeY}px`,
            })
          //end:修改自postcss-sprites/lib/core中的updateRule方法

          //start:若原始样式中没有设置width或height，则根据图片大小自动添加width或height属性
          const dimensions = ['width', 'height']
          rule.some(({ prop }) => {
            dimensions.some((targetProp, idx) => {
              if (prop === targetProp) {
                dimensions.splice(idx, 1)
              }
            })
          })
          dimensions.forEach((prop) => {
            const val = coords[prop]
            rule.insertAfter(
              rule.last,
              postcss.decl({
                prop: prop,
                value: `${val}px`,
              })
            )
          })
          //end:若原始样式中没有设置width或height，则根据图片大小自动添加width或height属性
        },
      },
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
