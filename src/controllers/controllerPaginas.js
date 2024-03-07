const asyncHandler 									= require('express-async-handler');
const customError	 								= require('http-errors');
const serviceRelacoes								= require('../services/bichos/serviceRelacoes');
const servicePaginas								= require('../services/varandas/servicePaginas');
const serviceEdicoes								= require('../services/varandas/serviceEdicoes');
const serviceComunidades							= require('../services/bichos/serviceComunidades');
const { schemaPutPagina, schemaPostPagina }			= require('../validations/validateVarandas');
const { params, objetoRenderizavel, objetoRenderizavelBloco, quemEstaAgindo, palavrasReservadas } = require('../utils/utilControllers');
const { messages } = require('joi-translation-pt-br');
require('dotenv').config();

exports.getPagina = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id } = params(req);
    let usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	let view;
	switch (pagina_id) {
		case 'clonar':
		case 'futricar':
			view = `blocos/${pagina_id}`;
			obj_render = await objetoRenderizavelBloco(obj_render, pagina_id);
			break;
		default:
			view = `varandas/${varanda_id}/${pagina_id}`;
			break;
	}
	res.render(view, obj_render);

});

exports.postPagina = asyncHandler(async (req, res, next) => {
	
	const { titulo, html, publica } = req.body;
	const varanda_id = req.params.bicho_id;

	if (palavrasReservadas().includes(encodeURIComponent(titulo))) {
		req.flash('erro', `Você não pode criar uma página com o título ${titulo}.`);
		return res.redirect(303, `/${varanda_id}/nova_pagina/editar`);
	}

	let pagina = {
		varanda_id: varanda_id,
		titulo: titulo,
		publica: publica,
		html: html
	}

	const { error } = schemaPostPagina.validate(pagina, { messages });
	if (error) {
	    req.flash('erro', error.details[0].message);
        return res.redirect(303, `/${varanda_id}/nova_pagina/editar`);
	}

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	pagina.comunitaria = comunidade ? true : false;
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('erro', `Você não pode criar páginas em ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}`);
		}
	}

	const jaExiste = await servicePaginas.verPaginas(varanda_id, encodeURIComponent(titulo));
	if (jaExiste) {
		req.flash('erro', `Já existe uma página com o título ${titulo}. Por favor, escolha outro título.`);
		return res.redirect(303, `/${varanda_id}/nova_pagina/editar`);
	}

	const paginaCriada = await servicePaginas.criarPagina(varanda_id, pagina);
	await serviceEdicoes.criarEdicao(usuarie_id, paginaCriada, paginaCriada.html);

	req.flash('aviso', 'A página foi criada com sucesso!');
	return res.redirect(303, `/${paginaCriada.pagina_vid}`);

});

exports.putPagina = asyncHandler(async (req, res, next) => {
    
	const { varanda_id, pagina_id } = params(req);
	const paginaOriginal = await servicePaginas.verPaginas(varanda_id, pagina_id);
	let pagina = {
		pagina_vid: paginaOriginal.pagina_vid,
		varanda_id: varanda_id,
		titulo: req.body.titulo ? req.body.titulo : paginaOriginal.titulo,
		publica: req.body.publica ? req.body.publica : paginaOriginal.publica,
		html: req.body.html ? req.body.html : paginaOriginal.html
	}
	const { error, value } = schemaPutPagina.validate(pagina, { messages });
	if (error) {
	    req.flash('erro', error.details[0].message);
        return res.redirect(303, `/${pagina.pagina_vid}/editar`);
	}
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('erro', `Você não pode editar ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}/${pagina_id}`);
		}
	}

	const comunidade = await serviceComunidades.verComunidade(varanda_id);
	pagina.comunitaria = comunidade ? true : false;

	const paginaEditada = await servicePaginas.editarPagina(varanda_id, pagina_id, pagina);
	await serviceEdicoes.criarEdicao(usuarie_id, paginaEditada, paginaEditada.html);

	//req.flash('aviso', 'A página foi editada com sucesso!');
	return res.redirect(303, `/${varanda_id}/${pagina_id}`);
});

exports.deletePagina = asyncHandler(async (req, res, next) => {
	const { varanda_id, pagina_id } = params(req);
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar || !permissoes.moderar) {
			req.flash('erro', `Você não pode apagar páginas de ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}/${pagina_id}`);
		}
	}

	await servicePaginas.deletarPagina(varanda_id, pagina_id);

	req.flash('aviso', 'A página foi removida com sucesso!');
	return res.redirect(303, `/${varanda_id}/futricar`);
});