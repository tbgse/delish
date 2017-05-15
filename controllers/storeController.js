const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!'}, false);
    }
  }
}

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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next(); // skipping to next middleware if there is no file
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // photo has been written do filesystem
  next();
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id});
  res.render('editStore', {title: `Edit ${store.name}`, store})
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body).save());
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/stores/${store.slug}`);
}

exports.updateStore = async (req, res) => {
  // set location data to point
  if (req.body.location) {
    req.body.location.type = 'Point';
  }
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();

  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
}

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores});
}

exports.getSingleStore = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) next();
  res.render('store', store);
}

exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();
  const tag = req.params.tag;
  res.render('tag', { title: 'Tags', tags, tag })
}
