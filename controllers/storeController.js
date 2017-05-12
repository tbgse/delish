exports.homepage = (req, res) => {
  res.render('index', {
    name: req.query.name
  })
}
