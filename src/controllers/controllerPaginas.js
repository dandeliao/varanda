const asyncHandler 									= require('express-async-handler');
const customError	 								= require('http-errors');
const serviceRelacoes								= require('../services/bichos/serviceRelacoes');
const servicePaginas								= require('../services/varandas/servicePaginas');
const serviceEdicoes								= require('../services/varandas/serviceEdicoes');
const { validarPutPagina, validarPostPagina }		= require('../validations/validateVarandas');
const { params, objetoRenderizavel, quemEstaAgindo, palavrasReservadas } = require('../utils/utilControllers');
require('dotenv').config();

exports.getPagina = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id } = params(req);
    let usuarie_id = await quemEstaAgindo(req);

	let view;
	switch (pagina_id) {
		case 'clonar':
		case 'futricar':
			view = `blocos/${pagina_id}`;
			break;
		default:
			view = `varandas/${varanda_id}/${pagina_id}`;
			break;
	}

	const obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	res.render(view, obj_render);

});

exports.postPagina = asyncHandler(async (req, res, next) => {
	
	const { titulo, html, publica } = req.body;
	const varanda_id = req.params.bicho_id;

	if (palavrasReservadas().includes(encodeURIComponent(titulo))) {
		req.flash('error', `Você não pode criar uma página com o título ${titulo}.`);
		return res.redirect(`/${varanda_id}/nova_pagina/editar`);
	}

	const pagina = {
		varanda_id: varanda_id,
		titulo: titulo,
		publica: publica,
		html: html
	}

	const { value, error } = validarPostPagina(pagina);
	if (error) {
	    req.flash('error', error.message);
        return res.redirect(303, `/${varanda_id}/nova_pagina/editar`);
	}
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode criar páginas em ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}`);
		}
	}

	console.log('varanda_id:', varanda_id);
	console.log('pagina:', pagina);
	const paginaCriada = await servicePaginas.criarPagina(varanda_id, pagina);
	console.log('paginaCriada:', paginaCriada);
	await serviceEdicoes.criarEdicao(usuarie_id, paginaCriada, paginaCriada.html);

	req.flash('aviso', 'A página foi criada com sucesso!');
	return res.redirect(303, `/${paginaCriada.pagina_vid}`);

});

exports.putPagina = asyncHandler(async (req, res, next) => {
    
	const { varanda_id, pagina_id } = params(req);
	const paginaOriginal = await servicePaginas.verPaginas(varanda_id, pagina_id);
	const pagina = {
		pagina_vid: paginaOriginal.pagina_vid,
		varanda_id: varanda_id,
		titulo: req.body.titulo ? req.body.titulo: paginaOriginal.titulo,
		publica: req.body.publica ? req.body.publica : paginaOriginal.publica,
		html: req.body.html ? req.body.html : paginaOriginal.html
	}

	const { value, error } = validarPutPagina(pagina);
	if (error) {
	    req.flash('error', error.message);
        return res.redirect(303, `/${varanda_id}/${pagina_id}`);
	}
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode editar ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}/${pagina_id}`);
		}
	}

	const paginaEditada = await servicePaginas.editarPagina(varanda_id, pagina_id, pagina);
	await serviceEdicoes.criarEdicao(usuarie_id, paginaEditada, paginaEditada.html);

	req.flash('aviso', 'A página foi editada com sucesso!');
	return res.redirect(303, `/${varanda_id}/${pagina_id}`);
});

exports.deletePagina = asyncHandler(async (req, res, next) => {
	const { varanda_id, pagina_id } = params(req);
	
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar || !permissoes.moderar) {
			req.flash('error', `Você não pode apagar páginas de ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}/${pagina_id}`);
		}
	}

	await servicePaginas.deletarPagina(varanda_id, pagina_id);

	req.flash('aviso', 'A página foi removida com sucesso!');
	return res.redirect(303, `/${varanda_id}/futricar`);
});