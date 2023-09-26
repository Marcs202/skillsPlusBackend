var express = require('express');
var router = express.Router();

// Home
/*router.get('/', (req, res) => {
  res.render('home', { title: 'SKILLS API' });
});*/
router.get('/',(req,res)=>{
  
  res.render('index', { title: 'SKILLS API' });
});

module.exports = router;
