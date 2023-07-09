const serviceComunidades = require('../../services/bichos/serviceComunidades');
const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');

exports.getComunidades = asyncHandler(async (req, res, next) => {
	const comunidades = await serviceComunidades.verComunidades();
	res.status(200).json(comunidades);
});

exports.getComunidade = asyncHandler(async (req, res, next) => {
	const comunidade = await serviceComunidades.verComunidade(req.params.arroba);
	if (!comunidade) throw customError(404, `Comunidade @${req.params.arroba} não encontrada.`);
	res.status(200).json(comunidade);
});

exports.postComunidade = asyncHandler(async (req, res, next) => { // req.body = {bicho_id, nome, descricao, bicho_criador_id}
	if (req.body.bicho_criador_id) {
		if (req.body.bicho_criador_id !== req.user.bicho_id) {
			const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_criador_id);
			if (!permissoes.representar) {
				throw customError(403, `O bicho @${req.user.bicho_id} não pode criar uma comunidade em nome de @${req.body.bicho_criador_id}.`);
			}
		}
	} else {
		req.body.bicho_criador_id = req.user.bicho_id;
	}
	const comunidade = await serviceComunidades.criarComunidade(req.body);
	res.status(201).json(comunidade);
});

exports.putComunidade = asyncHandler(async (req, res, next) => { // req.body = {participacao_livre, participacao_com_convite, periodo_geracao_convite}
	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
	if (!permissoes.moderar) {
		throw customError(403, `O bicho @${req.user.bicho_id} não pode alterar as opções de entrada na comunidade ${req.params.arroba}. Procure a equipe de moderação da comunidade.`);
	}
	const comunidade = await serviceComunidades.editarComunidade(req.params.arroba, req.body);
	res.status(204).json(comunidade);
});

exports.deleteComunidade = asyncHandler (async (req, res, next) => {
	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
	if (!permissoes.representar) {
		throw customError(403, `O bicho @${req.user.bicho_id} não pode deletar a comunidade ${req.params.arroba}. Procure representantes da comunidade.`);
	}
	await serviceComunidades.deletarComunidade(req.params.arroba);
	res.status(204).end();
});