const asyncHandler 				                = require('express-async-handler');
const customError	 			                = require('http-errors');
const serviceBichos 							= require('../services/bichos/serviceBichos');
const serviceBichosPadrao 						= require('../services/bichos/serviceBichosPadrao');
const serviceComunidades 						= require('../services/bichos/serviceComunidades');
const serviceRelacoes 							= require('../services/bichos/serviceRelacoes');
const servicePaginasPadrao 						= require('../services/varandas/servicePaginasPadrao');
const servicePaginas							= require('../services/varandas/servicePaginas');
const serviceEdicoes							= require('../services/varandas/serviceEdicoes');
const { validarPostComunidade, validarPutBicho }							= require('../validations/validateBichos');
const { params, objetoRenderizavel, quemEstaAgindo, palavrasReservadas }	= require('../utils/utilControllers');
require('dotenv').config();

exports.getVaranda = asyncHandler(async (req, res, next) => { // params.bicho_id == varanda_id; query.bicho_id == usuarie_id

	const { varanda_id } = params(req);
	const view = `varandas/${varanda_id}/inicio`
	const usuarie_id = await quemEstaAgindo(req);
	const obj_render = await objetoRenderizavel(req, res, varanda_id, 'inicio', usuarie_id);
	res.render(view, obj_render);
	
});

exports.postVaranda = asyncHandler(async (req, res, next) => {

	const usuarie_id = await quemEstaAgindo(req);

	const bicho = {
		bicho_id:			req.body.bicho_id,
		nome: 				req.body.nome ? req.body.nome : req.body.bicho_id,
		descricao:			req.body.descricao,
		bicho_criador_id:	usuarie_id
	}

	const { erro, resultado } = validarPostComunidade(bicho);
	if (erro) {
		req.flash('erro', `Erro ao validar as informações da nova comunidade. Detalhes: ${erro.details}`);
		req.redirect('/criar-comunidade');
	}

	if (palavrasReservadas().includes(bicho.bicho_id)) {
		req.flash('error', `Já existe um bicho com a arroba ${bicho.bicho_id}.`);
		return res.redirect(`/criar-comunidade`);
	}

	const bichoExiste = await serviceBichos.verBicho(req.body.bicho_id);
	if (bichoExiste) {
		req.flash('erro', `O bicho @${req.body.bicho_id} já existe. Por favor, escolha outra arroba.`);
		res.redirect('/criar-comunidade');
	}

	const comunidade = await serviceComunidades.criarComunidade(bicho, bicho.bicho_criador_id);

	// adiciona avatar e fundo padrão
	const bichoPadrao = await serviceBichosPadrao.sortearBichoPadrao();
	const novaComunidade = await serviceBichos.editarBicho(comunidade.bicho_id, {
		//descricao: bichoPadrao.descricao,
		avatar: 'avatar.jpg',
		descricao_avatar: bichoPadrao.descricao_avatar,
		fundo: 'fundo.jpg',
		descricao_fundo: bichoPadrao.descricao_fundo
	});
	await serviceBichos.copiarAvatar(novaComunidade.bicho_id, `${serviceBichosPadrao.caminhoAvatarPadrao}/${bichoPadrao.avatar}`, novaComunidade.avatar);
	await serviceBichos.copiarFundo(novaComunidade.bicho_id, `${serviceBichosPadrao.caminhoFundoPadrao}/${bichoPadrao.fundo}`, novaComunidade.fundo);
	
	// cria relação entre o bicho criador e a comunidade, com todas as habilidades (participar, editar, moderar e representar)
	await serviceRelacoes.criarRelacao(usuarie_id, novaComunidade.bicho_id, {participar: true, editar: true, moderar: true, representar: true});

	// cria varanda da comunidade, com página padrão
	const comunitaria = true;
	let paginaPadrao = {};
	paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
	paginaPadrao.pagina_vid = `${comunidade.bicho_id}/inicio`;
	const novaPagina = await servicePaginas.criarPagina(comunidade.bicho_id, paginaPadrao);
	await serviceEdicoes.criarEdicao(comunidade.bicho_id, novaPagina, paginaPadrao.html);

	req.flash('aviso', 'Comunidade criada com sucesso!');
	return res.redirect(`/${comunidade.bicho_id}`);

});

exports.putVaranda = asyncHandler(async (req, res, next) => {
    
	const { varanda_id, pagina_id } = params(req);
	let bichoOriginal = await serviceBichos.verBicho(varanda_id);
	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	if (comunidade) {
		bichoOriginal.participacao_livre = comunidade.participacao_livre,
		bichoOriginal.participacao_com_convite = comunidade.participacao_com_convite
	}
	const bicho = {
		nome: 						req.body.nome ? req.body.nome : bichoOriginal.nome,
		descricao:					req.body.descricao ? req.body.descricao : bichoOriginal.descricao,
		participacao_livre: 		req.body.participacao_livre ? req.body.participacao_livre : bichoOriginal.participacao_livre,
		participacao_com_convite:	req.body.participacao_com_convite ? req.body.participacao_com_convite : bichoOriginal.participacao_com_convite
	}

	const { value, error } = validarPutBicho(bicho);
	if (error) {
	    req.flash('error', `Erro ao validar as informações. Detalhes: ${error.message}`);
        return res.redirect(303, `/${varanda_id}`);
	}
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('error', `Você não pode editar o perfil de ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}`);
		}
	}

	await serviceBichos.editarBicho(varanda_id, bicho);

	req.flash('aviso', 'O perfil foi editado com sucesso!');
	return res.redirect(303, `/${varanda_id}`);
});

exports.deleteVaranda = asyncHandler(async (req, res, next) => {

});