const serviceRelacoes 													= require('../../services/bichos/serviceRelacoes');
const serviceComunidades 												= require('../../services/bichos/serviceComunidades');
const serviceConvites 													= require('../../services/bichos/serviceConvites');
const { validarPostRelacao, validarPutRelacao, validarDeleteRelacao } 	= require('../../validations/validateBichos');
const asyncHandler 														= require('express-async-handler');
const customError 														= require('http-errors');

exports.getRelacoes = asyncHandler(async (req, res, next) => { // relacoes?comunidade_id=arrobaDaComunidade (opcional. Se fornecido, mostra relação com essa comunidade apenas)

	let relacoes;

	if (req.query.comunidade_id) {
		relacoes = await serviceRelacoes.verRelacao(req.params.arroba, req.query.comunidade_id);
		if (!relacoes) throw customError(404, `Não foi possível encontrar relação entre o bicho @${req.params.arroba} e a comunidade @${req.query.comunidade_id}`);
	} else {
		relacoes = {
			bichos_na_comunidade: [],
			comunidades_do_bicho: []
		};
		const ehComunidade = await serviceComunidades.verComunidade(req.params.arroba);
		if (ehComunidade) {
			relacoes.bichos_na_comunidade = await serviceRelacoes.verBichosNaComunidade(req.params.arroba);
		}
		relacoes.comunidades_do_bicho = await serviceRelacoes.verComunidadesDoBicho(req.params.arroba);
	}

	res.status(200).json(relacoes); 
});

exports.postRelacao = asyncHandler(async (req, res, next) => { // req.body = {comunidade_id, convite_id}

	const { erro, resultado } = validarPostRelacao(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	const comunidade = await serviceComunidades.verComunidade(req.body.comunidade_id);

	const habilidades = {
		participar: true,
		editar: false,
		moderar: false,
		representar: false
	};
	if (req.user.bicho_id !== req.params.arroba) {
		const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
		if (!permissoes || !permissoes.representar) {
			throw customError(403, `O bicho @${req.user.bicho_id} não pode cadastrar @${req.params.arroba} em comunidades.`);
		}
	}
	if (comunidade.participacao_com_convite && req.body.convite_id) {
		const convite = await serviceConvites.verConvite(req.body.convite_id);
		if (!convite || convite.comunidade_id !== req.body.comunidade_id) {
			throw customError(404, `Não foi possível encontrar este convite para a comunidade @${req.body.comunidade_id}.`);
		}
		await serviceConvites.deletarConvite(req.body.convite_id);
	} else {
		if (!comunidade.participacao_livre) throw customError(403, `Não foi possível cadastrar @${req.params.arroba} na comunidade @${req.body.comunidade_id}. Verifique se a comunidade está aberta ou se você precisa de um código de convite.`);
	}

	const relacao = await serviceRelacoes.criarRelacao(req.params.arroba, req.body.comunidade_id, habilidades);
	res.status(201).json(relacao);
});

exports.putRelacao = asyncHandler(async (req, res, next) => { // req.body = {comunidade_id, participar, editar, moderar, representar}

	const { erro, resultado } = validarPutRelacao(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	const permissoes = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.comunidade_id);
	if (!permissoes || !permissoes.moderar) {
		throw customError(403, `O bicho @${req.user.bicho_id} não pode alterar esta relação. Procure a equipe de moderação da comunidade @${req.query.comunidade_id}.`);
	}
	const relacao = await serviceRelacoes.editarRelacao(req.params.arroba, req.body.comunidade_id, req.body);
	res.status(200).json(relacao);
});

exports.deleteRelacao = asyncHandler(async (req, res, next) => { // req.body = {comunidade_id}

	const { erro, resultado } = validarDeleteRelacao(req.body);
	if (erro) {
		console.log(erro);
		return res.status(400).json(erro.details);
	}

	if (req.user.bicho_id !== req.params.arroba) {
		const permissoesDeRepresentante = await serviceRelacoes.verRelacao(req.user.bicho_id, req.params.arroba);
		if (!permissoesDeRepresentante.representar) {
			const permissoesNaComunidade = await serviceRelacoes.verRelacao(req.user.bicho_id, req.body.comunidade_id);
			if (!permissoesNaComunidade.moderar) {
				throw customError(403, `O bicho @${req.user.bicho_id} não pode remover @${req.params.arroba} da comunidade @${req.body.comunidade_id}.`);
			}
		}
	}
	const relacao = await serviceRelacoes.deletarRelacao(req.params.arroba, req.body.comunidade_id);
	res.status(200).json(relacao);
});