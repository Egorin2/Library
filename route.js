const express = require('express');
const router = express.Router();
const path = require('path');

let booklistPath = path.join(__dirname, 'public', 'Booklist');

router.get('/', (req, res) => {
  res.sendFile(booklistPath + "/index.html");
});
/*
router.get('/css/css.css', (req, res) => {
  res.sendFile(booklistPath + req.url);
});
router.get('/base-script.js', (req, res) => {
  res.sendFile(booklistPath + req.url);
});
router.get('/js-system/JQuery.css', (req, res) => {
  res.sendFile(booklistPath + req.url);
});
router.get('/data/one.txt', (req, res) => {
  res.sendFile(booklistPath + req.url);
});*/
module.exports = router;
