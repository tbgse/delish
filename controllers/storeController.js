const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  res.render('index', {
    name: req.query.name
  })
}

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Location'
  })
}

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.redirect('/');
}
