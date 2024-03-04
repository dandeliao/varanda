const asyncHandler 				                		= require('express-async-handler');
const serviceBichos 									= require('../services/bichos/serviceBichos');
const serviceRelacoes 									= require('../services/bichos/serviceRelacoes');
const servicePaginas									= require('../services/varandas/servicePaginas');
const { params, objetoRenderizavel, quemEstaAgindo, palavrasReservadas, objetoRenderizavelBloco } = require('../utils/utilControllers');
const { schemaPutAvatar, schemaPutFundo }				= require('../validations/validateBichos');
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
	const view = 'blocos/preferencias';
	const usuarie_id = await quemEstaAgindo(req);
	let obj_render = await objetoRenderizavel(req, res, null, null, usuarie_id);
	obj_render = await objetoRenderizavelBloco(obj_render, 'preferencias');
	res.render(view, obj_render);
});

exports.getFutricarVaranda = asyncHandler(async (req, res, next) => {
	const varanda_id = req.params.bicho_id;
	const pagina_id = 'futricar';
    let view = 'blocos/futricar';
	const usuarie_id = await quemEstaAgindo(req);

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	obj_render = await objetoRenderizavelBloco(obj_render, 'futricar');
	const comunidades = await serviceRelacoes.verComunidadesDoBicho(varanda_id);
	const participantes = await serviceRelacoes.verBichosNaComunidade(varanda_id);
	obj_render.bloco.futricar = true;
	obj_render.bloco.comunidades = comunidades;
	obj_render.bloco.participantes = participantes;
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
	let view = `blocos/editar-bicho`;
	const { varanda_id, pagina_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.representar) {
			req.flash('erro', `Você não pode editar o perfil de ${varanda_id}.`);
			return res.redirect(`/${varanda_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	obj_render.query.bicho = varanda_id;
	obj_render = await objetoRenderizavelBloco(obj_render, 'editar-bicho');
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

    let view = 'blocos/editar';
	let usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.editar) {
			req.flash('erro', `Você não pode editar ${varanda_id}.`);
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

/* ---
	PUT
*/

exports.putAvatar = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	let avatar = {
		descricao_avatar: req.body.descricao_avatar ? req.body.descricao_avatar : ''
	}
	const {error} = schemaPutAvatar.validate(avatar, { messages });
	if (error) {
		req.flash('erro', `Erro ao validar as informações. Detalhes:${error.details[0].message}`);
		return res.redirect(303, `/${arroba}`);
	}

	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== arroba) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, arroba);
		if (!permissoes.representar) {
			req.flash('erro', `Você não pode editar os dados de @${arroba}`);
			return res.redirect(303, `/${arroba}`);
		}
	}
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${req.params.arroba} não encontrado.`);
		return res.redirect(303, '/');
	}

	let dadosNovos = {descricao_avatar: avatar.descricao_avatar}
	if (req.file) {
		const dadosArquivo = await serviceBichos.subirAvatar(arroba, req.file);
		if (!dadosArquivo) {
			req.flash('erro', 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
			return res.redirect(303, `/${arroba}`);
		}
		dadosNovos = {avatar: dadosArquivo.nome, descricao_avatar: avatar.descricao_avatar};
	}
	
	const bichoEditado = await serviceBichos.editarBicho(arroba, dadosNovos);

	let view = `blocos/editar-bicho`;
	let obj_render = await objetoRenderizavel(req, res, arroba, 'editar-bicho', usuarie_id, false);
	obj_render = await objetoRenderizavelBloco(obj_render, 'editar-bicho');
	obj_render.bloco.bicho = bichoEditado;
	res.render(view, obj_render);

});

exports.putFundo = asyncHandler(async (req, res, next) => {
	const arroba = req.params.bicho_id;
	let fundo = {
		descricao_fundo: req.body.descricao_fundo ? req.body.descricao_fundo : ''
	}
	const {error} = schemaPutFundo.validate(fundo, { messages });
	if (error) {
		req.flash('erro', `Erro ao validar as informações. Detalhes:${error.details[0].message}`);
		return res.redirect(303, `/${arroba}`);
	}

	const usuarie_id = await quemEstaAgindo(req);

	if (usuarie_id !== arroba) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, arroba);
		if (!permissoes.representar) {
			req.flash('erro', `Você não pode editar os dados de @${arroba}.`);
			return res.redirect(303, `/${arroba}`);
		}
	}
	const bicho = await serviceBichos.verBicho(arroba);
	if (!bicho) {
		req.flash('erro', `Bicho @${req.params.arroba} não encontrado.`);
		return res.redirect(303, '/');
	}


	let dadosNovos = {descricao_fundo: fundo.descricao_fundo}
	if (req.file) {
		const dadosArquivo = await serviceBichos.subirFundo(arroba, req.file);
		if (!dadosArquivo) {
			req.flash('erro', 'Houve um erro ao carregar o arquivo. Por favor, tente novamente.');
			return res.redirect(303, `/${arroba}`);
		}
		dadosNovos = {avatar: dadosArquivo.nome, descricao_fundo: fundo.descricao_fundo};
	}
	
	const bichoEditado = await serviceBichos.editarBicho(arroba, dadosNovos);
	
	let view = `blocos/editar-bicho`;
	let obj_render = await objetoRenderizavel(req, res, arroba, 'editar-bicho', usuarie_id, false);
	obj_render = await objetoRenderizavelBloco(obj_render, 'editar-bicho');
	obj_render.bloco.bicho = bichoEditado;
	res.render(view, obj_render);
});
