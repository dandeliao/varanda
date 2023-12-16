const express 		= require('express');
const router 		= express.Router();
const path 			= require('path');
const multer 		= require('multer');
const taAutenticade	= require('../middlewares/authentication');

// Controllers
const { getArtefatos, 	getArtefato,	postArtefato,	putArtefato,	deleteArtefato 		} = require('../controllers/artefatos/controllerArtefatos');
const { getDenuncias,																	 	} = require('../controllers/artefatos/controllerDenuncias');
const { getEdicoes, 	getEdicao, 				 						deleteEdicao 		} = require('../controllers/artefatos/controllerEdicoes');
const { getTags,                 		postTag,						deleteTag			} = require('../controllers/artefatos/controllerTags');
const { 								postTagArtefato, 				deleteTagArtefato	} = require('../controllers/artefatos/controllerTagsArtefatos');

router.use(taAutenticade);

// configura multer para upload de arquivos
const update = multer({
	dest: path.join(path.resolve(__dirname, '../../static/artefatos/temp')),
	limits: {
		fields: 1,
		//fieldNameSize: 50,
		fieldSize: 500,
		fileSize: 100000000, // 100 MB
	},
	fileFilter: function(_req, file, cb){
		const filetypes = /jpeg|jpg|png|gif|tiff|webp|bmp|svg|webm|mid|midi|kar|flac|mp3|mpga|mpa|mp2|wav|ogx|ogg|ogm|ogv|oga|spx|opus|mpg|mpeg|mpe|mp4|mkv|txt|mkd|md/; // pdf|xcf|odt|docx|doc|odp|pptx|ppt|ods|xlsx|xls ... ?
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null, true);
		} else {
			return cb(null, false);
		}
	}
});

//---
// Denuncias

router.get('/denuncias', getDenuncias); // ?filtros&?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.post('/denuncias', postArtefato); // req.body = {varanda_contexto_id, bicho_criador_id, em_resposta_a_id, sensivel, aviso_de_conteudo, respondivel, publico, indexavel, texto, titulo, denunciados: [denunciado_id1, denunciado_id2, ...]} (bicho_criador_id é opcional. Por padrão, usa req.user.bicho_id)

// ---
// Edições

router.get('/edicoes', getEdicoes); // ?filtros&bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.get('/edicao/:edicao_id', getEdicao); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.delete('/edicao/:edicao_id', deleteEdicao); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

// ---
// Tags

router.get('/tags', getTags); // ?filtros

router.post('/tags', postTag); // req.body = {tag_id}

router.delete('/tags/:tag_id', deleteTag); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)


// ---
// Tags_Artefatos

router.post('/tags/artefato', postTagArtefato); // req.body = {tag_id, artefato_id, bicho_id} (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.delete('/tags/:tag_id/artefato/:artefato_id', deleteTagArtefato); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

// ---
// Artefatos

router.get('/', getArtefatos); // ?varanda_contexto_id=comunidade&em_resposta_a_id=IdDoArtefato&tags=tag1+tag2&arquivo=boolean&bicho_criador_id=IdDoBicho&bicho_id=IdDoBicho (bicho_id é opcional. Por padrão usa req.user.bicho_id) (não retornar denúncias) (só retornar não-indexáveis se o bicho_id == varanda_contexto_id)

router.get('/:artefato_id', getArtefato); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.post('/', update.single('arquivo'), postArtefato); // req.body = {varanda_contexto_id, bicho_criador_id, em_resposta_a_id, sensivel, aviso_de_conteudo, respondivel, publico, indexavel [, texto, titulo] || [, descricao]} + arquivo (texto e titulo caso seja texto, descricao + arquivo caso seja arquivo) (bicho_criador_id é opcional, por padrão usa req.user.bicho_id)

router.put('/:artefato_id', putArtefato); // req.body = {sensivel, aviso_de_conteudo, respondivel, publico, indexavel, [titulo, texto] || [descricao], bicho_id} (bicho_id é opcional. Por padrão, usa req.user.bicho_id)

router.delete('/:artefato_id', deleteArtefato); // ?bicho_id=IdDoBicho (bicho_id é opcional. Por padrão, usa req.user.bicho_id)




module.exports = router;