const express = require('express') //nodejs的web框架
const app = express() //实例化框架
const fs = require('fs') //操作文件的模块
const dir = './server' //接口路径

//readdirSync 该方法返回一个包含指定目录下所有文件名称的数组对象
const list = fs.readdirSync(dir).map((v) => {
  require(dir + '/' + v)(app) //拼接出文件路径后，导入执行，同时传入app
})

app.listen('9092') //监听端口
