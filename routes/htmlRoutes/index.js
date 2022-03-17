const path = require('path');
const router = require('express').Router();
const model = require('../../tfjs/model.json')
console.log(model)
//sets path for /notes to the notes html
router.get('/tf/model', (req, res) => {
  console.log(model)
  res.json(model)
});

router.get('/tf', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/tf.html'));
});
//sets path for a catchall to default to index.html
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;