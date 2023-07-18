const servicePessoas = require('../../services/bichos/servicePessoas');
const serviceBichos = require('../../services/bichos/serviceBichos');
const serviceConvites = require('../../services/bichos/serviceConvites');
const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');

exports.getPessoas = asyncHandler(async (req, res, next) => {
	const pessoas = await servicePessoas.verPessoas();
	res.status(200).json(pessoas);
});

exports.getPessoa = asyncHandler(async (req, res, next) => {
	const pessoa = await servicePessoas.verPessoa(req.params.arroba);
	if (!pessoa) throw customError(404, `Pessoa @${req.params.arroba} não encontrada.`);
	res.status(200).json(pessoa);
});

exports.postPessoa = asyncHandler(async (req, res, next) => {
	const pessoa = {
		bicho_id: req.body.bicho_id,
		nome: req.body.nome,
		email: req.body.email,
		senha: req.body.senha
	};
	const convite = await serviceConvites.verConvite(req.body.convite_id);
	if (!convite || convite.comunidade_id === 'varanda') throw customError(404, 'Não foi possível encontrar esse convite para a varanda.');
	const bichoExiste = await serviceBichos.getBicho(pessoa.bicho_id);
	if (bichoExiste) throw customError(409, `O apelido @${pessoa.bicho_id} já existe. Por favor, escolha outro apelido.`);	
	const novaPessoa = await servicePessoas.registrarPessoa(pessoa);
	res.status(201).json(novaPessoa);
});

exports.putPessoa = asyncHandler(async (req, res, next) => {
	if (req.user.bicho_id !== req.params.arroba) throw customError(404, `O bicho @${req.user.bicho_id} não pode editar os dados de @${req.params.arroba}.`);
	const pessoaAntes = await servicePessoas.verPessoa(req.params.arroba);
	if (!pessoaAntes) throw customError(404, `Pessoa @${req.params.arroba} não encontrada.`);
	const pessoaDepois = await servicePessoas.editarPessoa(req.params.arroba, req.body);
	const emailDepois = await servicePessoas.editarSegredos(req.params.arroba, req.body);
	const pessoa = {
		bicho_id: pessoaDepois.bicho_id,
		nome: pessoaDepois.nome,
		descricao: pessoaDepois.descricao,
		avatar: pessoaDepois.avatar,
		descricao_avatar: pessoaDepois.descricao_avatar,
		fundo: pessoaDepois.fundo,
		descricao_fundo: pessoaDepois.descricao_fundo,
		email: emailDepois
	};
	res.status(200).json(pessoa);
});

exports.deletePessoa = asyncHandler(async (req, res, next) => {
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoesGlobais = await serviceRelacoes.verRelacao(req.user.bicho_id, 'varanda');
		if (!permissoesGlobais.moderar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode remover a pessoa ${req.params.arroba}. Procure a equipe de moderação da instância.`);
		}
	}
	await servicePessoas.deletarPessoa(req.params.arroba);
	res.status(204).end();
});