const serviceConvites = require('../../services/bichos/serviceConvites');
const serviceRelacoes = require('../../services/bichos/serviceRelacoes');
const asyncHandler = require('express-async-handler');
const customError = require('http-errors');

exports.getConvites = asyncHandler(async (req, res, next) => { // convites?comunidade_id=arroba | convites?bicho_criador_id=arroba | nada -> utiliza req.user.bicho_id

	if (req.body.comunidade_id) {
		if (req.user.bicho_id !== req.query.comunidade_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.comunidade_id);
			if (!relacao.representar) {
				throw customError(403, `O bicho ${req.user.bicho_id} não pode ver os convites de ${req.query.comunidade_id}. Procure representantes da comunidade`);
			}
		}
		const convites = await serviceConvites.verConvitesParaComunidade(req.query.comunidade_id);
		res.status(200).json(convites);

	}

	if (req.query.bicho_criador_id) {
		if (req.user.bicho_id !== req.query.bicho_criador_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.query.bicho_criador_id);
			if (!relacao.representar) {
				throw customError(403, `O bicho ${req.user.bicho_id} não pode ver os convites de ${req.query.bicho_criador_id}. Procure representantes da comunidade`);
			}
		}
		const convites = await serviceConvites.verConvitesCriadosPeloBicho(req.query.bicho_criador_id);
		res.status(200).json(convites);
	}

	const convites = await serviceConvites.verConvitesCriadosPeloBicho(req.user.bicho_id);
	res.status(200).json(convites); 
});

exports.postConvite = asyncHandler(async (req, res, next) => { // req.body = {comunidade_id, bicho_criador_id} | nada -> utiliza req.user.bicho_id

	if (req.user.bicho_id !== req.body.comunidade_id) {
		const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.comunidade_id);
		if (!relacao.representar) {
			throw customError(403, `O bicho ${req.user.bicho_id} não pode criar convites para ${req.body.comunidade_id}. Procure representantes da comunidade`);
		}
	}

	if (req.body.bicho_criador_id) {
		if (req.user.bicho_id !== req.body.bicho_criador_id) {
			const relacao = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.bicho_criador_id);
			if (!relacao.representar) {
				throw customError(403, `O bicho ${req.user.bicho_id} não pode criar convites em nome de ${req.body.bicho_criador_id}. Procure representantes da comunidade`);
			}
		}
	}
    
	const convite = await serviceConvites.criarConvite(req.body.comunidade_id, req.body.bicho_criador_id ? req.body.bicho_criador_id : req.user.bicho_id);
	res.status(200).json(convite);
});

exports.deleteConvite = asyncHandler(async (req, res, next) => { // req.body = {convite_id}

	if (!req.body.convite_id) {
		throw customError(400, 'Solicitação não pode ser atendida, falta o código do convite');
	}
    
	const convite = await serviceConvites.verConvite(req.body.convite_id);
	if (!convite || !convite.length) throw customError(404, 'Não foi possível encontrar o convite');
	if (convite.bicho_criador_id !== req.user.bicho_id) {
		const relacaoComCriador = await serviceRelacoes.verRelacao(req.user.bicho_id, convite.bicho_criador_id);
		if (!relacaoComCriador.representar) {
			const relacaoComComunidade = await serviceRelacoes.verRelacao(req.user.bicho_id, convite.comunidade_id);
			if (!relacaoComComunidade.representar) {
				throw customError(404, 'Não foi possível encontrar o convite'); // na verdade, o erro é que o bicho solicitante não é o bicho criador (nem o representa), por isso não pode acessar o convite. Para não indicar se há ou não um convite com esse id, responde-se com um erro 404 não encontrado.
			}
		}
	}

	await serviceConvites.deletarConvite(req.body.convite_id);
	res.status(204);
});