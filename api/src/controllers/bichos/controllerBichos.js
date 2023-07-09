const serviceBichos = require('../../services/bichos/serviceBichos');
const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');
const path = require('path');

exports.getBichos = asyncHandler(async (req, res, next) => {
	const bichos = await serviceBichos.verBichos();
	res.status(200).json(bichos);
});

exports.getBicho = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.params.arroba);
	if (!bicho) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	res.status(200).json(bicho);
});

exports.getAvatar = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.params.arroba);
	if (!bicho) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	const avatar = path.join(path.resolve(__dirname, '../../../static'), 'bichos', 'em_uso', req.params.arroba, bicho.avatar);
	res.sendFile(avatar);
});

exports.getFundo = asyncHandler(async (req, res, next) => {
	const bicho = await serviceBichos.verBicho(req.params.arroba);
	if (!bicho) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	const fundo = path.join(path.resolve(__dirname, '../../../static'), 'bichos', 'em_uso', req.params.arroba, bicho.fundo);
	res.sendFile(fundo);
});

exports.putBicho = asyncHandler(async (req, res, next) => { // req.body = {nome, descricao, descricao_avatar, descricao_fundo}
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
		if (!permissoes.representar) throw customError(404, `O bicho @${req.user.bicho_id} não pode editar os dados de @${req.params.arroba}.`);
	}
	const bichoAtual = await serviceBichos.verBicho(req.params.arroba);
	if (!bichoAtual) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	const bicho = await serviceBichos.editarBicho(req.params.arroba, req.body);
	res.status(200).json(bicho);
});

exports.putAvatar = asyncHandler(async (req, res, next) => {
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
		if (!permissoes.representar) throw customError(404, `O bicho @${req.user.bicho_id} não pode editar os dados de @${req.params.arroba}.`);
	}
	const bicho = await serviceBichos.verBicho(req.params.arroba);
	if (!bicho) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	const dadosArquivo = await serviceBichos.subirAvatar(req.params.arroba, req.file);
	if (!dadosArquivo) throw customError(500, 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
	const bichoNovo = await serviceBichos.editarBicho(req.params.arroba, {avatar: dadosArquivo.nome, descricao_avatar: req.body.descricao_avatar});
	res.status(201).json(bichoNovo);
});

exports.putFundo = asyncHandler(async (req, res, next) => {
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
		if (!permissoes.representar) throw customError(404, `O bicho @${req.user.bicho_id} não pode editar os dados de @${req.params.arroba}.`);
	}
	const bicho = await serviceBichos.verBicho(req.params.arroba);
	if (!bicho) throw customError(404, `Bicho @${req.params.arroba} não encontrado.`);
	const dadosArquivo = await serviceBichos.subirFundo(req.params.arroba, req.file);
	if (!dadosArquivo) throw customError(500, 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
	const bichoNovo = await serviceBichos.editarBicho(req.params.arroba, {fundo: dadosArquivo.nome, descricao_fundo: req.body.descricao_fundo});
	res.status(201).json(bichoNovo);
});