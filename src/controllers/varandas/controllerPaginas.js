const asyncHandler 									= require('express-async-handler');
const customError	 								= require('http-errors');
const serviceRelacoes								= require('../../services/bichos/serviceRelacoes');
const servicePaginas								= require('../../services/varandas/servicePaginas');
const serviceEdicoes								= require('../../services/varandas/serviceEdicoes');
const { validarPutPagina }							= require('../../validations/validateVarandas');
const { params, objetoRenderizavel, quemEstaAgindo } = require('../../utils/utilControllers');
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

exports.getEditarPagina = asyncHandler(async (req, res, next) => {

	const { varanda_id, pagina_id } = params(req);

	console.log(pagina_id);

	if (['editar', 'clonar', 'futricar'].includes(pagina_id)) {
		req.flash('error', `Você não pode editar a página ${pagina_id}`);
		return res.redirect(`/${varanda_id}`);
	}

    let view = 'blocos/editar';
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode editar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	if (pagina_id !== 'nova_pagina'){
		const pagina = await servicePaginas.verPaginas(varanda_id, pagina_id);
		obj_render.pagina.html = pagina.html;
		obj_render.metodo = 'put';	
	} else {
		obj_render.nova_pagina = true;
		obj_render.metodo = 'post';
	}

	res.render(view, obj_render);

});

exports.postPagina = asyncHandler(async (req, res, next) => {
	console.log('entrou em postPagina');
	// proibir postar pagina com o nome "nova_pagina"
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
	console.log('entrou em deletePagina');
});