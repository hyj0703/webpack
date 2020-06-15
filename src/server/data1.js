module.exports = function (app) {
  app.get('/api', function (req, res) {
    res.jsonp({ name: 'lisi', age: 11 })
  })
  app.get('/api/about', function (req, res) {
    res.jsonp({ name: 'zhangsan', age: 40 })
  })
}
