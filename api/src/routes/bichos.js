const express 	= require('express');
const router 	= express.Router();
const path = require('path');
const multer = require('multer');
const update = multer({ dest: path.join(path.resolve(__dirname, '../../static/bichos/temp' )) });
const passport 	= require('passport');
const taAutenticade = require('../middlewares/authentication');
const { getBichos, getBicho, putBicho, getAvatar, getFundo, putAvatar, putFundo } 			= require('../controllers/bichos/controllerBichos');
const { getComunidades,	getComunidade, 	postComunidade, putComunidade, 	deleteComunidade }	= require('../controllers/bichos/controllerComunidades');
const { getPessoas, 	getPessoa, 		postPessoa, 	putPessoa, 		deletePessoa } 		= require('../controllers/bichos/controllerPessoas');
const { getRelacoes,	getRelacao,		postRelacao,	putRelacao,		deleteRelacao }		= require('../controllers/bichos/controllerRelacoes');

router.use(taAutenticade);

// ---
// Bichos em geral

router.get('/', getBichos);

router.get('/:arroba', getBicho);

router.put('/:arroba', putBicho); // req.body = {nome, descricao, descricao_avatar, descricao_fundo}

router.get('/:arroba/avatar', getAvatar);

router.get('/:arroba/fundo', getFundo);

router.put('/:arroba/avatar', update.single('arquivo'), putAvatar); // req.body = {descricao_avatar}

router.put('/:arroba/fundo', update.single('arquivo'), putFundo); // req.body = {descricao_fundo}

// ---
// Relações entre bichos

router.get('/:arroba/relacoes',	getRelacoes);

router.get('/:arroba/relacao', getRelacao); // relacao?comunidade_id=arrobaDaComunidade

router.post('/:arroba/relacao', postRelacao); // req.body = {comunidade_id, convite_id}

router.put('/:arroba/relacao', putRelacao); // relacao?comunidade_id=arrobaDaComunidade | req.body = {participar, editar, moderar, representar}

router.delete('/:arroba/relacao', deleteRelacao); // relacao?comunidade_id=arrobaDaComunidade

// ---
// Comunidades

router.get('/comunidades', getComunidades);

router.get('/comunidades/:arroba', getComunidade);

router.post('/comunidades', postComunidade); // req.body = {bicho_id, nome, descricao, bicho_criador_id}

router.put('/comunidades/:arroba', putComunidade); // req.body = {participacao_livre, participacao_com_convite, periodo_geracao_convite}

router.delete('/comunidades/:arroba', deleteComunidade);

// ---
// Pessoas

router.get('/pessoas', getPessoas);

router.get('/pessoas/:arroba', getPessoa);

router.post('/pessoas', postPessoa); // req.body = {convite_id}

router.put('/pessoas/:arroba', putPessoa); // req.body = {nome, descricao, descricao_avatar, descricao_fundo, email, senha}

router.delete('/pessoas/:arroba', deletePessoa);

// ---
// Autenticação

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/bichos/login-fracasso',
	successRedirect: '/bichos/login-sucesso'
}));

router.get('/login-sucesso', 	(req, res) => {
	res.status(200).json({
		mensagem: 'login realizado com sucesso',
		autenticade: true
	});
});

router.get('/login-fracasso', 	(req, res) => {
	res.status(401).json({
		mensagem: 'pessoa ou senha não correspondem aos registros',
		autenticade: false
	});
});

router.get('/logout', 			(req, res) => {
	req.logout(err => {
		if (err) {
			res.status(500).json({
				mensagem: 'erro ao fazer o logout'
			});
		} else {
			res.status(200).json({
				mensagem: 'logout realizado com sucesso',
				autenticade: false
			});
		}
	});
});

module.exports = router;