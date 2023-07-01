const express = require('express');
const router = express.Router();
const tryCatch = require('../middlewares/errorHandler');
const passport = require('passport');
const { getBichos, getBicho } = require('../controllers/bichos/controllerBichos');
const { getComunidades, getComunidade, postComunidade, putComunidade, deleteComunidade} = require('../controllers/bichos/controllerComunidade');
const { getPessoas, getPessoa, postPessoa, putPessoa, deletePessoa } = require('../controllers/bichos/controllerPessoas');

// ---
// Bichos em geral

router.get('/', tryCatch(async (req, res) => {
	const bichos = await getBichos(req, res);
	res.status(200).json(bichos);
}));

router.get('/:arroba', tryCatch(async (req, res) => {
	const bicho = await getBicho(req, res);
	res.status(200).json(bicho);
}));

// ---
// Comunidades

router.get('/comunidades', tryCatch(async (req, res) => {
	const comunidades = await getComunidades(req, res);
	res.status(200).json(comunidades);
}));

router.get('/comunidades/:arroba', tryCatch(async (req, res) => {
	const comunidade = await getComunidade(req, res);
	res.status(200).json(comunidade);
}));

router.post('/comunidades', tryCatch(async (req, res) => {
	const comunidade = await postComunidade(req, res);
	res.status(201).json(comunidade);
}));

router.put('/comunidades/:arroba', tryCatch(async (req, res) => {
	const comunidade = await putComunidade(req, res);
	res.status(204).json(comunidade);
}));

router.delete('/comunidades/:arroba', tryCatch (async (req, res) => {
	await deleteComunidade(req, res);
	res.status(204).end();
}));

// ---
// Pessoas

router.get('/pessoas', tryCatch(async (req, res) => {
	const pessoas = await getPessoas(req, res);
	res.status(200).json(pessoas);
}));

router.get('/pessoas/:arroba', tryCatch(async (req, res) => {
	const pessoa = await getPessoa(req, res);
	res.status(200).json(pessoa);
}));

router.post('/pessoas', tryCatch(async (req, res) => {
	const novaPessoa = await postPessoa(req, res);
	res.status(201).json(novaPessoa);
}));

router.put('/pessoas/:arroba', tryCatch (async (req, res) => {
	const pessoa = await putPessoa(req, res);
	res.status(204).json(pessoa);
}));

router.delete('/pessoas/:arroba', tryCatch (async (req, res) => {
	await deletePessoa(req, res);
	res.status(204).end();
}));

// ---
// Autenticação

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/bichos/login-fracasso',
	successRedirect: '/bichos/login-sucesso'
}));

router.get('/login-sucesso', (req, res, next) => {
	res.status(200).json({
		mensagem: 'login realizado com sucesso',
		autenticade: true
	});
});

router.get('/login-fracasso', (req, res, next) => {
	res.status(401).json({
		mensagem: 'pessoa ou senha não correspondem aos registros',
		autenticade: false
	});
});

router.get('/logout', (req, res, next) => {
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