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
		getClonar,			postClonar,				                  	} = require('../controllers/controllerReservadas');
const { getArtefato,		postArtefato,	putArtefato, deleteArtefato, 
		getEditarArtefato,
		getArquivo,														} = require('../controllers/controllerArtefatos');


// configura multer para upload das imagens de avatar e fundo
const update = multer({
	dest: path.join(path.resolve(__dirname, '../../user_content/bichos/temp' )),
	limits: {
		//fields: 1,
		//fieldNameSize: 50,
		//fieldSize: 500,
		fileSize: 15000000, // 15 MB
	},
	fileFilter: function(_req, file, cb){
		const filetypes = /jpeg|jpg|png|gif|svg/;
		const extname = filetypes.test(path.extname(file.originalname));
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null, true);
		} else {
			return cb(null, false);
		}
	}
});
// configura multer para upload de arquivos para artefatos
const sobeArtefato = multer({
	dest: path.join(path.resolve(__dirname, '../../user_content/artefatos/temp')),
	limits: {
		//fields: 1,
		fileSize: 15000000, // 15MB
	},
	fileFilter:  function(_req, file, cb){
		const filetypes = /jpeg|jpg|png|gif|svg|bmp|mp3|opus|wav|aac|flac|3gp|aiff|m4a|ogg|oga|mog|wma|webm|mkv|ogv|avi|mov|wmv|rmvb|mp4|m4v|mpg|mpeg|mpv|txt|md|mkd|/;
		const extname = filetypes.test(path.extname(file.originalname));
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null, true);
		} else {
			return cb(null, false);
		}
	}
});

/* --- */
/* Bichos */

router.get   ('/',                      		getVaranda				);
router.get   ('/preferencias',					getPreferencias			); // esta rota retorna JSON
router.get   ('/criar-comunidade',      		getCriarComunidade		);
router.get	 ('/erro',							getErro 				);
router.get   ('/:bicho_id',             		getVaranda				);
router.get	 ('/:bicho_id/clonar',				getClonar				);
router.get   ('/:bicho_id/editar-bicho',		getEditarBicho			);
router.get	 ('/:bicho_id/editar-preferencias',	getEditarPreferencias	);
router.get   ('/:bicho_id/futricar',    		getFutricarVaranda		);
router.get   ('/:bicho_id/avatar',      		getAvatar				);
router.get   ('/:bicho_id/fundo',       		getFundo				);

router.post  ('/', update.none(),          		postVaranda		);
router.put	 ('/:bicho_id/preferencias',		putPreferencias	);
router.put   ('/:bicho_id',
				update.fields([{
					name: 'avatar',
					maxCount: 1
				}, {
					name: 'fundo',
					maxCount: 1
				}]),	        				putVaranda		);
router.delete('/:bicho_id',             		deleteVaranda	);

router.post  ('/:bicho_id/participar',  		postParticipar	);
router.post  ('/:bicho_id/clonar',				postClonar		);
router.delete('/:bicho_id/relacao',				deleteRelacao	);

/* --- */
/* Páginas */

router.get   ('/:bicho_id/:pagina_id',          getPagina		);
router.get   ('/:bicho_id/:pagina_id/editar',   getEditarPagina );

router.post  ('/:bicho_id',                     postPagina		);
router.put   ('/:bicho_id/:pagina_id',          putPagina		);
router.delete('/:bicho_id/:pagina_id',          deletePagina	);

/* --- */
/* Artefatos */

router.get	 ('/:bicho_id/:pagina_id/:artefato_id', 			 getArtefato	  		);
router.get	 ('/:bicho_id/:pagina_id/:artefato_id/arquivo',		 getArquivo				);
router.get	 ('/:bicho_id/:pagina_id/:artefato_id/editar',  	 getEditarArtefato 		);
router.post	 ('/:bicho_id/:pagina_id/',
				sobeArtefato.single('arquivo'),					postArtefato	  		);
router.put	 ('/:bicho_id/:pagina_id/:artefato_id',
				sobeArtefato.single('arquivo'),			 		putArtefato		  		);
router.delete('/:bicho_id/:pagina_id/:artefato_id', 			deleteArtefato	  		);

module.exports = router;