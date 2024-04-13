const express 	= require('express');
const router 	= express.Router();
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const { getVaranda,         postVaranda,    putVaranda, deleteVaranda   } = require('../controllers/controllerVarandas');
const { getPagina,          postPagina,     putPagina,  deletePagina    } = require('../controllers/controllerPaginas');
const {                     postParticipar, 			deleteRelacao   } = require('../controllers/controllerRelacoes');
const { getFutricarVaranda,
        getCriarComunidade,
		getErro,
		getPreferencias,
		getEditarPreferencias,
        getEditarBicho,
        getEditarPagina,
											putPreferencias, 
        getAvatar,                          putAvatar,
        getFundo,                           putFundo,
							postClonar,				                  	} = require('../controllers/controllerReservadas');
const { getArtefato,		postArtefato,	putArtefato, deleteArtefato, 
		getEditarArtefato,												} = require('../controllers/controllerArtefatos');


// configura multer para upload das imagens de avatar e fundo
const update = multer({
	dest: path.join(path.resolve(__dirname, '../../user_content/bichos/em_uso' )),
	limits: {
		fields: 1,
		//fieldNameSize: 50,
		//fieldSize: 500,
		fileSize: 15000000, // 15 MB
	},
	fileFilter: function(_req, file, cb){
		const filetypes = /jpeg|jpg|png|gif|svg/;
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null, true);
		} else {
			return cb(null, false);
		}
	}
});

router.get   ('/',                      		getVaranda				);
router.get   ('/preferencias',					getPreferencias			); // esta rota retorna JSON
router.get   ('/criar-comunidade',      		getCriarComunidade		);
router.get	 ('/erro',							getErro 				);
router.get   ('/:bicho_id',             		getVaranda				);
router.get   ('/:bicho_id/futricar',    		getFutricarVaranda		);
router.get   ('/:bicho_id/editar-bicho',		getEditarBicho			);
router.get	 ('/:bicho_id/editar-preferencias',	getEditarPreferencias	);
router.get   ('/:bicho_id/avatar',      		getAvatar				);
router.get   ('/:bicho_id/fundo',       		getFundo				);

router.post  ('/',                      		postVaranda		);
router.put   ('/:bicho_id/avatar',
              update.single('avatar'),  		putAvatar		);
router.put   ('/:bicho_id/fundo',
              update.single('fundo'),   		putFundo		);
router.put	 ('/:bicho_id/preferencias',		putPreferencias	);
router.put   ('/:bicho_id',             		putVaranda		);
router.delete('/:bicho_id',             		deleteVaranda	);

router.post  ('/:bicho_id/participar',  		postParticipar	);
router.post  ('/:bicho_id/clonar',				postClonar		);
router.delete('/:bicho_id/relacao',				deleteRelacao	);

router.get   ('/:bicho_id/:pagina_id',          getPagina		);
router.get   ('/:bicho_id/:pagina_id/editar',   getEditarPagina );

router.post  ('/:bicho_id',                     postPagina		);
router.put   ('/:bicho_id/:pagina_id',          putPagina		);
router.delete('/:bicho_id/:pagina_id',          deletePagina	);

router.get	 ('/:bicho_id/:pagina_id/:artefato_id', 			getArtefato		  		);
router.get	 ('/:bicho_id/:pagina_id/:artefato_id/editar',  	getEditarArtefato 		);
router.post	 ('/:bicho_id/:pagina_id/',				 			postArtefato	  		);
router.put	 ('/:bicho_id/:pagina_id/:artefato_id', 			putArtefato		  		);
router.delete('/:bicho_id/:pagina_id/:artefato_id', 			deleteArtefato	  		);

module.exports = router;