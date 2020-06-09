const express = require('express')
const app = express()

app.get('/api/info',(req,res) => {
    res.json({
        name:'my name',
        age:5,
        msg:"欢迎来到mock数据现场"
    })
})

app.listen('9092')