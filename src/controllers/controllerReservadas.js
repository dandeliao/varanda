const asyncHandler 				                		= require('express-async-handler');
const serviceBichos 									= require('../services/bichos/serviceBichos');
const serviceRelacoes 									= require('../services/bichos/serviceRelacoes');
const servicePaginas									= require('../services/varandas/servicePaginas');
const { params, objetoRenderizavel, quemEstaAgindo, palavrasReservadas } = require('../utils/utilControllers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

exports.getAvatar = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${arroba} não encontrado.`);
		return res.sendStatus(404);
	}
	const avatar = path.join(path.resolve(__dirname, '../../'), 'user_content', 'bichos', 'em_uso', arroba, bicho.avatar);
	res.sendFile(avatar);
});

exports.getFundo = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${arroba} não encontrado.`);
		return res.send(404);
	}
	const fundo = path.join(path.resolve(__dirname, '../../'), 'user_content', 'bichos', 'em_uso', arroba, bicho.fundo);
	res.sendFile(fundo);
});

exports.getFutricarVaranda = asyncHandler(async (req, res, next) => {

	const { varanda_id } = params(req);
	const pagina_id = 'futricar';
    let view = 'blocos/futricar';
	const usuarie_id = await quemEstaAgindo(req);

	/* if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.participar) {
			req.flash('error', `Você não pode futricar ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	} */

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	const paginas = await servicePaginas.verPaginas(varanda_id);
	obj_render.bloco.futricar = true;
	obj_render.bloco.paginas = paginas;

	res.render(view, obj_render);

});

exports.getCriarComunidade = asyncHandler(async (req, res, next) => {
    let view = 'blocos/editar-bicho';
	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, 'nova_comunidade', 'criar-comunidade', usuarie_id);
	obj_render.metodo = 'post';	
	obj_render.nova_comunidade = true;

	res.render(view, obj_render);
});

exports.getEditarBicho = asyncHandler(async (req, res, next) => {
	let view = 'blocos/editar-bicho';
	const { varanda_id, pagina_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('error', `Você não pode editar o perfil de ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	const bicho = await serviceBichos.verBicho(varanda_id);
	obj_render.varanda.bicho = bicho;
	obj_render.metodo = 'put';	

	console.log(obj_render);

	res.render(view, obj_render);
});

exports.getEditarPagina = asyncHandler(async (req, res, next) => {

	const { varanda_id, pagina_id } = params(req);

	if (palavrasReservadas().includes(pagina_id) && pagina_id !== 'nova_pagina') {
		req.flash('error', `Você não pode editar a página ${pagina_id}`);
		return res.redirect(`/${varanda_id}`);
	}

    let view = 'blocos/editar';
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('error', `Você não pode editar ${varanda_id}.`);
			let pagina_redirect = pagina_id;
			if (pagina_id === 'nova_pagina') pagina_redirect = 'inicio';
			return res.redirect(`/${varanda_id}/${pagina_redirect}`);
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