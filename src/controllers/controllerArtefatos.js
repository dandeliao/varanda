const asyncHandler = require('express-async-handler');
const serviceRelacoes = require('../services/bichos/serviceRelacoes');
const serviceArtefatos = require('../services/artefatos/serviceArtefatos');
// validacoes
const { params, objetoRenderizavel, objetoRenderizavelBloco, quemEstaAgindo, palavrasReservadas } = require('../utils/utilControllers');
const { messages } = require('joi-translation-pt-br');
require('dotenv').config();

// captura links http(s)://endereco.com, categorias #artes, arrobas @varanda, páginas @varanda/blog-novo e artefatos @varanda/blog-novo/2024-03-10_16-20-59_676543-03
// /<[^>]*>|\[[^][]*]\([^()]*\)|(https?:\/\/[^\s"'<>]*)|#(\w+(?:\S)*)|@(\w+(?:^(?!\/).*$)*)(?:\/(\w+(?:\S)*))*/g

exports.getArtefato = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id, artefato_id } = params(req);
    let usuarie_id = await quemEstaAgindo(req);
	let view = `blocos/artefato`;

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id, false);
	obj_render.artefato = {artefato_pid: `${varanda_id}/${pagina_id}/${artefato_id}`};
	obj_render = await objetoRenderizavelBloco(obj_render, bloco_id);

	res.render(view, obj_render);
});

exports.getEditarArtefato = asyncHandler(async (req, res, next) => {
	
	const { varanda_id, pagina_id, artefato_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);
    let view = 'blocos/editar-artefato';

	const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
	if (usuarie_id !== varanda_id) {
		if (!permissoes || !permissoes.participar) {
			req.flash('erro', `Você não participa de @${varanda_id}`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}
	if (artefato_id !== 'novo_artefato') {
		const artefato = await serviceArtefatos.verArtefato(`${varanda_id}/${pagina_id}/${artefato_id}`);
		if (!artefato || artefato.bicho_criador_id !== usuarie_id) {
			req.flash('erro', `Você não pode editar este artefato.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, usuarie_id);
	if (artefato_id !== 'novo_artefato'){
		obj_render.metodo = 'put';	
	} else {
		obj_render.novo_artefato = true;
		obj_render.metodo = 'post';
	}

	res.render(view, obj_render);
});

exports.postArtefato = asyncHandler(async (req, res, next) => {
	
	/* const { titulo, html, publica } = req.body;
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
	return res.redirect(303, `/${paginaCriada.pagina_vid}`); */

});

exports.putArtefato = asyncHandler(async (req, res, next) => {
    
	/* const { varanda_id, pagina_id } = params(req);
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
	return res.redirect(303, `/${varanda_id}/${pagina_id}`); */
});

exports.deleteArtefato = asyncHandler(async (req, res, next) => {
	/* const { varanda_id, pagina_id } = params(req);
	
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
	return res.redirect(303, `/${varanda_id}/futricar`); */
});