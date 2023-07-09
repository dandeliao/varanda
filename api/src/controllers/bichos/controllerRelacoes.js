const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const serviceComunidades = require('../../services/bichos/serviceComunidades');
const serviceConvites = require('../../services/bichos/serviceConvites');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');

exports.getRelacoes = asyncHandler(async (req, res, next) => {
	const relacoes = {
		bichos_na_comunidade: [],
		comunidades_do_bicho: []
	};
	const ehComunidade = await serviceComunidades.getComunidade(req.params.arroba);
	if (ehComunidade) {
		relacoes.bichos_na_comunidade = await serviceRelacoes.verBichosNaComunidade(req.params.arroba);
	}
	relacoes.comunidades_do_bicho = await serviceRelacoes.verComunidadesDoBicho(req.params.arroba);
	res.status(200).json(relacoes); 
});

exports.getRelacao = asyncHandler(async (req, res, next) => { // relacao?comunidade_id=nomeDaComunidade
	const relacao = await serviceRelacoes.verRelacao(req.params.arroba, req.query.comunidade_id);
	if (!relacao) throw customError(404, `Não foi possível encontrar relação entre o bicho @${req.params.arroba} e a comunidade @${req.query.comunidade_id}`);
	res.status(200).json(relacao);
});

exports.postRelacao = asyncHandler(async (req, res, next) => { // relacao?comunidade_id=nomeDaComunidade&convite=codigoDoConvite
	const comunidade = await serviceComunidades.verComunidade(req.query.comunidade_id);
	const habilidades = {
		participar: true,
		editar: false,
		moderar: false,
		representar: false
	};
	if (req.user.bicho_id !== req.params.bicho_id ) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.bicho_id);
		if (!permissoes.representar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode cadastrar @${req.params.bicho_id} em comunidades.`);
		}
	}
	if (comunidade.participacao_com_convite && req.query.convite) {
		const convite = await serviceConvites.verConvite(req.query.convite);
		if (!convite || convite.comunidade_id === req.query.comunidade_id) {
			throw customError(404, `Não foi possível encontrar este convite para a comunidade @${req.query.comunidade_id}.`);
		}
	}
	if (!comunidade.participacao_livre) {
		throw customError(403, `Não foi possível cadastrar @${req.params.arroba} na comunidade @${req.query.comunidade_id}. Verifique se a comunidade está aberta ou se você precisa de um código de convite.`);
	}
	const relacao = await serviceRelacoes.criarRelacao(req.params.arroba, req.query.comunidade_id, habilidades);
	res.status(200).json(relacao);
});

exports.putRelacao = asyncHandler(async (req, res, next) => { // relacao?comunidade_id=nomeDaComunidade
	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.comunidade_id);
	if (!permissoes.moderar) {
		throw customError(403, `O bicho @${req.user.bicho_id} não pode alterar esta relação. Procure a equipe de moderação da comunidade @${req.query.comunidade_id}.`);
	}
	const relacao = await serviceRelacoes.editarRelacao(req.params.arroba, req.params.comunidadeId, req.body);
	res.status(200).json(relacao);
});

exports.deleteRelacao = asyncHandler(async (req, res, next) => { // relacao?comunidade_id=nomeDaComunidade
	if (req.user.bicho_id !== req.params.bicho_id ) {
		const permissoesDeRepresentante = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.bicho_id);
		if (!permissoesDeRepresentante.representar) {
			const permissoesNaComunidade = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.comunidade_id);
			if (!permissoesNaComunidade.moderar) {
				throw customError(403, `O bicho @${req.user.bicho_id} não pode remover @${req.params.bicho_id} da comunidade @${req.query.comunidade_id}.`);
			}
		}
	}
	const relacao = await serviceRelacoes.deletarRelacao(req.params.arroba, req.query.id);
	res.status(200).json(relacao);
});