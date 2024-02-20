const express 	= require('express');
const router 	= express.Router();

const { getBloco } = require('../controllers/blocos/controllerBlocos');

router.get('/:bloco_id', getBloco);



module.exports = router;