const express 	= require('express');
const router 	= express.Router();
const passport 	= require('passport');
const asyncHandler = require('express-async-handler');
const taAutenticade = require('../middlewares/authentication');
const { getBichos, 		getBicho, 		getAvatar, 		getFundo } 							= require('../controllers/bichos/controllerBichos');
const { getComunidades,	getComunidade, 	postComunidade, putComunidade, 	deleteComunidade }	= require('../controllers/bichos/controllerComunidades');
const { getPessoas, 	getPessoa, 		postPessoa, 	putPessoa, 		deletePessoa } 		= require('../controllers/bichos/controllerPessoas');
const { getRelacoes,	getRelacao,		postRelacao,	putRelacao,		deleteRelacao }		= require('../controllers/bichos/controllerRelacoes');

router.use(taAutenticade);

// ---
// Bichos em geral

router.get('/', getBichos);

router.get('/:arroba', getBicho);

router.get('/:arroba/avatar', getAvatar);

router.get('/:arroba/fundo', getFundo);

// ---
// Relações entre bichos

router.get('/:arroba/relacoes',	getRelacoes);

router.get('/:arroba/relacao', getRelacao); // relacao?comunidade_id=nomeDaComunidade

router.post('/:arroba/relacao', postRelacao); // relacao?comunidade_id=nomeDaComunidade&convite=codigoDoConvite

router.put('/:arroba/relacao', putRelacao); // relacao?comunidade_id=nomeDaComunidade

router.delete('/:arroba/relacao', deleteRelacao); // relacao?comunidade_id=nomeDaComunidade

// ---
// Comunidades

router.get('/comunidades', 				asyncHandler(async (req, res, next) => {
	const comunidades = await getComunidades(req, res);
	res.status(200).json(comunidades);
}));

router.get('/comunidades/:arroba',		asyncHandler(async (req, res, next) => {
	const comunidade = await getComunidade(req, res);
	res.status(200).json(comunidade);
}));

router.post('/comunidades', 			asyncHandler(async (req, res, next) => {
	const comunidade = await postComunidade(req, res);
	res.status(201).json(comunidade);
}));

router.put('/comunidades/:arroba',		asyncHandler(async (req, res, next) => {
	const comunidade = await putComunidade(req, res);
	res.status(204).json(comunidade);
}));

router.delete('/comunidades/:arroba',	asyncHandler (async (req, res, next) => {
	await deleteComunidade(req, res);
	res.status(204).end();
}));

// ---
// Pessoas

router.get('/pessoas', 				asyncHandler(async (req, res, next) => {
	const pessoas = await getPessoas(req, res);
	res.status(200).json(pessoas);
}));

router.get('/pessoas/:arroba', 		asyncHandler(async (req, res, next) => {
	const pessoa = await getPessoa(req, res);
	res.status(200).json(pessoa);
}));

router.post('/pessoas', postPessoa);

router.put('/pessoas/:arroba', 		asyncHandler (async (req, res, next) => {
	const pessoa = await putPessoa(req, res);
	res.status(204).json(pessoa);
}));

router.delete('/pessoas/:arroba',	asyncHandler (async (req, res, next) => {
	await deletePessoa(req, res);
	res.status(204).end();
}));

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