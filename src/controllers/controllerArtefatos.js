const asyncHandler 					= require('express-async-handler');
const serviceRelacoes 				= require('../services/bichos/serviceRelacoes');
const serviceArtefatos 				= require('../services/artefatos/serviceArtefatos');
const serviceEdicoesArtefatos 		= require('../services/artefatos/serviceEdicoesArtefatos');
const { schemaPostArtefato,
	    schemaPutArtefato } 		= require('../validations/validateArtefatos');
const { textoParaHtml }				= require('../utils/utilParsers');
const { params, 
		quemEstaAgindo, 
		palavrasReservadas } 		= require('../utils/utilControllers');
const { objetoRenderizavel, 
		objetoRenderizavelBloco,
		objetoRenderizavelContexto}	= require('../utils/utilRenderizacao');
const { messages } 					= require('joi-translation-pt-br');
const { randomUUID } 				= require('crypto');
const { separaExtensao } 			= require('../utils/utilArquivos');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

exports.getArtefato = asyncHandler(async (req, res, next) => {
    
    const { varanda_id, pagina_id, artefato_id } = params(req);
    let usuarie_id = await quemEstaAgindo(req);
	let view = `paginas/artefato`;

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, artefato_id, usuarie_id);
	if (obj_render.artefato === null) {
		console.log('obj_render.artefato é null');
		//view = 'blocos/tapume';
	} else {
		obj_render.artefato.texto = await textoParaHtml(obj_render.artefato.texto);
		obj_render = await objetoRenderizavelContexto(obj_render, 'artefato');
	}

	res.render(view, obj_render);
});

exports.getArquivo = asyncHandler(async (req, res, next) => {
    const { varanda_id, pagina_id, artefato_id } = params(req);
	const artefato = await serviceArtefatos.verArtefato(artefato_id);
	if (artefato) {
		if (artefato.pagina_vid !== `${varanda_id}/${pagina_id}`) {
			artefato = null;
		}
	}
	
	if (!artefato) {
		req.flash('erro', `Artefato @${varanda_id}/${pagina_id}/${artefato_id} não encontrado.`);
		return res.redirect(`/${varanda_id}/${pagina_id}`);
	}

	const arquivo = path.join(path.resolve(__dirname, '../../'), 'user_content', 'artefatos', 'em_uso', varanda_id, pagina_id, `${artefato.nome_arquivo}.${artefato.extensao}`);
	res.sendFile(arquivo);
});


exports.getEditarArtefato = asyncHandler(async (req, res, next) => {
	
	const { varanda_id, pagina_id, artefato_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);
    let view = 'paginas/editar-artefato';

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.participar) {
			req.flash('erro', `Você não participa de @${varanda_id}`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}
	
	if (artefato_id !== 'novo_artefato') {
		const artefato = await serviceArtefatos.verArtefato(artefato_id);
		if (!artefato || artefato.bicho_criador_id !== usuarie_id) {
			req.flash('erro', `Você não pode editar este artefato.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	} else {
		if (palavrasReservadas().includes(pagina_id)) {
			req.flash('erro', `Você não pode criar um artefato na página ${pagina_id}.`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	let obj_render = await objetoRenderizavel(req, res, varanda_id, pagina_id, artefato_id, usuarie_id);
	if (artefato_id === 'novo_artefato'){
		obj_render.novo_artefato = true;
		obj_render.metodo = 'post';
	} else {
		obj_render.metodo = 'put';
	}
	obj_render = await objetoRenderizavelContexto(obj_render, 'editar-artefato');

	res.render(view, obj_render);
});

exports.postArtefato = asyncHandler(async (req, res, next) => {

	const { titulo, texto, sensivel, respondivel, indexavel, mutirao, em_resposta_a, denuncia, descricao } = req.body;
	const { varanda_id, pagina_id } = params(req);
	const usuarie_id = await quemEstaAgindo(req);

	const artefato = {
		varanda_id: 		varanda_id,
		pagina_vid: 		`${varanda_id}/${pagina_id}`,
		bicho_criador_id: 	usuarie_id,
		em_resposta_a_id: 	em_resposta_a 	? em_resposta_a 								: null,
		nome_arquivo: 		req.file 		? separaExtensao(req.file.originalname)[0] 		: null,
		extensao: 			req.file 		? separaExtensao(req.file.originalname)[1] 		: null,
		descricao: 			descricao 		? descricao										: '',
		titulo: 			titulo 			? titulo 										: '',
		texto: 				texto			? texto											: '',
		sensivel: 			sensivel 		? true 											: false,
		respondivel: 		respondivel 	? true 											: false,
		indexavel: 			indexavel 		? true 											: false,
		mutirao: 			mutirao 		? true 											: false,
		denuncia: 			denuncia 		? true 											: false
	}

	const { error } = schemaPostArtefato.validate(artefato, { messages });
	if (error) {
		console.log('erro de validação:', error.details[0]);
	    req.flash('erro', error.details[0].message);
        return res.redirect(303, `/${varanda_id}/${pagina_id}/novo_artefato/editar`);
	}

	if (usuarie_id !== varanda_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, varanda_id);
		if (!permissoes || !permissoes.participar) {
			req.flash('erro', `Você não participa de @${varanda_id}`);
			return res.redirect(`/${varanda_id}/${pagina_id}`);
		}
	}

	if (req.file) {
		await serviceArtefatos.subirArquivo(varanda_id, pagina_id, req.file);
	}

	const artefatoCriado = await serviceArtefatos.criarArtefato(artefato);
	await serviceEdicoesArtefatos.criarEdicaoArtefato(artefatoCriado);

	let pagina_retorno = `/${artefatoCriado.pagina_vid}`;
	if (artefato.em_resposta_a_id) {
		pagina_retorno = `/${artefato.pagina_vid}/${artefato.em_resposta_a_id}`;
	}
	req.flash('aviso', 'O artefato foi criado com sucesso!');
	return res.redirect(303, pagina_retorno);

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
	const { varanda_id, pagina_id, artefato_id } = params(req);
	
	let usuarie_id = await quemEstaAgindo(req);
	let artefato = await serviceArtefatos.verArtefato(artefato_id);
	if (artefato) {
		if (artefato.pagina_vid !== `${varanda_id}/${pagina_id}`) {
			artefato = null;
		}
	}

	if (!artefato) {
		req.flash('erro', `Artefato @${varanda_id}/${pagina_id}/${artefato_id} não encontrado.`);
		return res.redirect(`/${varanda_id}/${pagina_id}`);
	}

	if (usuarie_id !== artefato.bicho_criador_id) {
		const permissoes = await serviceRelacoes.verRelacao(usuarie_id, artefato.varanda_id);
		if (!permissoes || !permissoes.moderar) {
			req.flash('erro', `Você não pode apagar artefatos de ${varanda_id}.`);
			return res.redirect(303, `/${varanda_id}/${pagina_id}`);
		}
	}

	await serviceArtefatos.deletarArtefato(artefato_id);

	let pagina_retorno = `/${artefato.pagina_vid}`;
	if (artefato.em_resposta_a_id) {
		pagina_retorno = `/${artefato.pagina_vid}/${artefato.em_resposta_a_id}`;
	}
	req.flash('aviso', 'O artefato foi removido com sucesso!');
	return res.redirect(303, pagina_retorno);
});