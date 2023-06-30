const express = require('express');
const router = express.Router();
const tryCatch = require('../middlewares/errorHandler');
const serviceBichos = require('../services/bichos/serviceBichos');
const servicePessoas = require('../services/bichos/servicePessoas');
const passport = require('passport');

router.post('/registro', tryCatch( async (req, res) => {
	const pessoa = {
		bicho_id: req.body.bicho_id,
		nome: req.body.nome,
		email: req.body.email,
		senha: req.body.senha
	};
	const novaPessoa = await servicePessoas.registrarPessoa(pessoa);
	res.status(201).json(novaPessoa);
}));

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