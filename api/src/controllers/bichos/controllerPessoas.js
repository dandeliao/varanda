const servicePessoas = require('../../services/bichos/servicePessoas');
const serviceBichos = require('../../services/bichos/serviceBichos');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');

exports.postPessoa = asyncHandler(async (req, res, next) => {
	const pessoa = {
		bicho_id: req.body.bicho_id,
		nome: req.body.nome,
		email: req.body.email,
		senha: req.body.senha
	};

	const bichoExiste = await serviceBichos.getBicho(pessoa.bicho_id);
	if (bichoExiste) throw customError(409, `O apelido @${pessoa.bicho_id} já existe. Por favor, escolha outro apelido.`);
	
	const novaPessoa = await servicePessoas.registrarPessoa(pessoa);
	res.status(201).json(novaPessoa);
});