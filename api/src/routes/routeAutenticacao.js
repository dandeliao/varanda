const express = require('express');
const router = express.Router();
const serviceAutenticacao = require('../services/serviceAutenticacao');
const passport = require('passport');

router.post('/registro', async (req, res, next) => {
	try {
		// falta fazer validação dos dados antes
		// (qual a camada responsável por chamar a validação?)
		
		const pessoa = {
			pessoa_id: req.body.pessoa_id,
			nome: req.body.nome,
			email: req.body.email,
			senha: req.body.senha
		};
		const novaPessoa = await serviceAutenticacao.postRegistro(pessoa);
		res.status(201).json(novaPessoa);
	} catch (erro) {
		next(erro);
	}
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/autenticacao/login-fracasso',
	successRedirect: '/autenticacao/login-sucesso'
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