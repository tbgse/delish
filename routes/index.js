const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// Do work here
router.get('/', storeController.homepage);

router.get('/json', (req, res) => {
  res.json({
    name: 'Tobias',
    isCool: true,
    something: {
      blabla: 'yeahhh',
      youCan: 'do this'
    }
  })
});

router.get('/params', (req, res) => {
    res.json(req.query);
});

router.get('/reverse/:name', (req, res) => {
  const reversed = [...req.params.name].reverse().join('');
  res.send(reversed);
});

module.exports = router;
