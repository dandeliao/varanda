const asyncHandler 				                		= require('express-async-handler');
const serviceBichos 									= require('../services/bichos/serviceBichos');
const serviceRelacoes 									= require('../services/bichos/serviceRelacoes');
const servicePreferencias								= require('../services/bichos/servicePreferencias');
const serviceComunidades								= require('../services/bichos/serviceComunidades');
const serviceBichosPadrao								= require('../services/bichos/serviceBichosPadrao');
const serviceConvites									= require('../services/bichos/serviceConvites');
const servicePaginas									= require('../services/varandas/servicePaginas');
const serviceEdicoes									= require('../services/varandas/serviceEdicoes');
const servicePaginasPadrao								= require('../services/varandas/servicePaginasPadrao');
const { params, quemEstaAgindo, palavrasReservadas } 	= require('../utils/utilControllers');
const { objetoRenderizavel, objetoRenderizavelBloco, objetoRenderizavelContexto}	= require('../utils/utilRenderizacao');
const { vidParaId, htmlParaHtmx }										= require('../utils/utilParsers');
const { schemaPutPreferencias, schemaPostComunidade }	= require('../validations/validateBichos');
const { messages } = require('joi-translation-pt-br');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/* ---
	GET
 */

exports.getAvatar = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${arroba} não encontrado.`);
		return res.redirect(`/`);
	}
	const avatar = path.join(path.resolve(__dirname, '../../'), 'user_content', 'bichos', 'em_uso', arroba, bicho.avatar);
	res.sendFile(avatar);
});

exports.getFundo = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${arroba} não encontrado.`);
		return res.sendStatus(404);
	}
	const fundo = path.join(path.resolve(__dirname, '../../'), 'user_content', 'bichos', 'em_uso', arroba, bicho.fundo);
	res.sendFile(fundo);
});

exports.getPreferencias = asyncHandler(async (req, res, next) => {
	const usuarie_id = await quemEstaAgindo(req);

	const preferencias = await servicePreferencias.verPreferencias(usuarie_id);
	if (!preferencias){
		req.flash('erro', `Preferências de @${usuarie_id} não encontradas.`);
		return res.sendStatus(404);
	}
	res.status(200).json(preferencias);
});

exports.getEditarPreferencias = asyncHandler(async (req, res, next) => {
	const view = 'paginas/editar-preferencias';
	const usuarie_id = await quemEstaAgindo(req);
	const { varanda_id, pagina_id } = params(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('erro', `Você não pode editar as preferências de ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	obj_render.query.bicho = varanda_id;
	obj_render = await objetoRenderizavelContexto(obj_render, 'editar-preferencias');
	obj_render = await objetoRenderizavelBloco(obj_render, ['bicho', 'preferencias']);
	res.render(view, obj_render);
});

exports.getClonar = asyncHandler(async (req, res, next) => {
	const { varanda_id } = params(req);
	const pagina_id = 'clonar';
	let view = 'paginas/clonar';
	const usuarie_id = await quemEstaAgindo(req);

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	if (!comunidade) {
		req.flash('erro', 'Não é possível clonar páginas pessoais');
		res.redirect(`/${varanda_id}/futricar`);
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	obj_render = await objetoRenderizavelContexto(obj_render, 'clonar');
	obj_render = await objetoRenderizavelBloco(obj_render, ['paginas']);
	res.render(view, obj_render);
});

exports.getFutricarVaranda = asyncHandler(async (req, res, next) => {
	const { varanda_id } = params(req);
	const pagina_id = 'futricar';
    let view = 'paginas/futricar';
	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	obj_render = await objetoRenderizavelContexto(obj_render, 'bicho');
	obj_render = await objetoRenderizavelBloco(obj_render, ['bicho', 'paginas', 'relacao']);
	const comunidades = await serviceRelacoes.verComunidadesDoBicho(varanda_id);
	let participantes;
	if (varanda_id === process.env.INSTANCIA_ID) {
		participantes = await serviceRelacoes.verPessoasNaComunidade(varanda_id);
	} else {
		participantes = await serviceRelacoes.verBichosNaComunidade(varanda_id);
	}
	obj_render.bloco.futricar = true;
	obj_render.bloco.comunidades = comunidades;
	obj_render.bloco.participantes = participantes;
	if (varanda_id === process.env.INSTANCIA_ID) {
		obj_render.instancia = true;
	}
	res.render(view, obj_render);
});

exports.getCriarComunidade = asyncHandler(async (req, res, next) => {
    let view = 'paginas/editar-bicho';
	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, 'nova_comunidade', 'criar-comunidade', null, usuarie_id);
	obj_render.metodo = 'post';
	obj_render.nova_comunidade = true;
	obj_render = await objetoRenderizavelContexto(obj_render, 'editar-bicho');

	res.render(view, obj_render);
});

exports.getEditarBicho = asyncHandler(async (req, res, next) => {
	let view = `paginas/editar-bicho`;
	const { varanda_id, pagina_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('erro', `Você não pode editar o perfil de ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	obj_render = await objetoRenderizavelContexto(obj_render, 'editar-bicho');
	obj_render.query.bicho = varanda_id;
	obj_render = await objetoRenderizavelBloco(obj_render, ['bicho']);
	const bicho = await serviceBichos.verBicho(varanda_id);
	obj_render.varanda.bicho = bicho;
	obj_render.metodo = 'put';	

	res.render(view, obj_render);
});

exports.getEditarPagina = asyncHandler(async (req, res, next) => {

	const { varanda_id, pagina_id } = params(req);

	if (palavrasReservadas().includes(pagina_id) && pagina_id !== 'nova_pagina') {
		req.flash('erro', `Você não pode editar a página ${pagina_id}`);
		return res.redirect(`/${varanda_id}`);
	}

    let view = 'paginas/editar-pagina';
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('erro', `Você não pode editar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}/futricar`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	if (pagina_id !== 'nova_pagina'){
		obj_render.metodo = 'put';	
	} else {
		obj_render.nova_pagina = true;
		obj_render.metodo = 'post';
	}
	obj_render = await objetoRenderizavelContexto(obj_render, 'editar-pagina');

	res.render(view, obj_render);

});

exports.getErro = asyncHandler(async (req, res, next) => {
	const varanda_id = req.params.bicho_id;
	const pagina_id = 'erro';
    let view = 'paginas/erro';
	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, null, usuarie_id);
	obj_render = await objetoRenderizavelBloco(obj_render, []);
	obj_render.bloco.codigo = req.query.codigo ? req.query.codigo : 500;
	obj_render.bloco.mensagem = req.query.mensagem ? req.query.mensagem : 'Erro no servidor. Por favor, tente novamente.'
	res.render(view, obj_render);
});

/* ---
	PUT
*/

exports.putPreferencias = asyncHandler(async (req, res, next) => {
	
	const arroba = req.params.bicho_id;
	const preferencias = {
		tema_id: req.body.tema ? parseInt(req.body.tema) : 0
	}
	const {error} = schemaPutPreferencias.validate(preferencias, { messages });
	if (error) {
		req.flash('erro', `Erro ao validar as informações. Detalhes:${error.details[0].message}`);
		return res.redirect(303, `/${arroba}`);
	}

	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== arroba) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, arroba);
		if (!permissoes.representar) {
			req.flash('erro', `Você não pode editar as preferências de @${arroba}.`);
			return res.redirect(303, `/${arroba}`);
		}
	}
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${req.params.arroba} não encontrado.`);
		return res.redirect(303, '/');
	}

	await servicePreferencias.editarPreferencias(arroba, preferencias);
	return res.status(200);

});

/* ---
	POST
*/

exports.postClonar = asyncHandler(async (req, res, next) => {;

	const { varanda_id, pagina_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	const bicho = {
		bicho_id:			req.body.bicho_id,
		nome: 				req.body.nome ? req.body.nome : req.body.bicho_id,
		descricao:			req.body.descricao,
		bicho_criador_id:	usuarie_id
	}

	const { error, value } = schemaPostComunidade.validate(bicho, { messages });
	if (error) {
		req.flash('erro', `Erro ao validar as informações da nova comunidade. Detalhes: ${error.details[0].message}`);
		return res.redirect(303, `/${varanda_id}/clonar`);
	}

	if (palavrasReservadas().includes(bicho.bicho_id)) {
		req.flash('erro', `Você não pode criar um bicho com o nome de perfil @${bicho.bicho_id}.`);
		return res.redirect(303, `/${varanda_id}/clonar`);
	}

	const bichoExiste = await serviceBichos.verBicho(req.body.bicho_id);
	if (bichoExiste) {
		req.flash('erro', `O bicho @${req.body.bicho_id} já existe. Por favor, escolha outra arroba.`);
		return res.redirect(303, `/${varanda_id}/clonar`);
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

	// cria relação entre a comunidade e a instância, com a habilidade de participar
	await serviceRelacoes.criarRelacao(novaComunidade.bicho_id, process.env.INSTANCIA_ID, {participar: true, editar: false, moderar: false, representar: false});

	// clona páginas para nova comunidade
	let keys = Object.keys(req.body)
	let paginaOriginal;
	let novaPagina;
	for (let campo of keys) {
		if (campo !== 'bicho_id' && campo !== 'nome' && campo !== 'descricao') {
			paginaOriginal = await servicePaginas.verPaginas(varanda_id, vidParaId(campo));
			novaPagina = await servicePaginas.criarPagina(novaComunidade.bicho_id, paginaOriginal);
			await serviceEdicoes.criarEdicao(usuarie_id, novaPagina, novaPagina.html);
		}
	}
	const paginaInicio = await servicePaginas.verPaginas(novaComunidade.bicho_id, 'inicio');
	if (!paginaInicio) {
		const comunitaria = true;
		let paginaPadrao = {};
		paginaPadrao = await servicePaginasPadrao.gerarPaginaPadrao(comunitaria);
		paginaPadrao.pagina_vid = `${novaComunidade.bicho_id}/inicio`;
		const novaPaginaInicial = await servicePaginas.criarPagina(novaComunidade.bicho_id, paginaPadrao);
		await serviceEdicoes.criarEdicao(novaComunidade.bicho_id, novaPaginaInicial, paginaPadrao.html);
	}

	req.flash('aviso', 'Comunidade clonada com sucesso!');
	return res.redirect(303, `/${novaComunidade.bicho_id}`);
});

exports.postConvite = asyncHandler(async (req, res, next) => {
	const { varanda_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	if (!comunidade) {
		req.flash('erro', `@${varanda_id} não é uma comunidade.`);
	}

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes.representar) {
			req.flash('erro', `Você não pode criar convites para @${varanda_id}. Converse com representantes da comunidade.`);
			return res.redirect(303, `/${varanda_id}/futricar`);
		}
	}

	const convite = await serviceConvites.criarConvite(varanda_id, usuarie_id);
	res.render('partials/convite', {convite: convite.convite_id, layout: false});
});

exports.postMiniatura = asyncHandler(async (req, res, next) => {
	const { varanda_id, pagina_id } = params(req);
	console.log(req.body);
	const { html } = req.body;
	const usuarie_id = await quemEstaAgindo(req);

	const htmx = await htmlParaHtmx(html, varanda_id, pagina_id);
	res.send(htmx);
});