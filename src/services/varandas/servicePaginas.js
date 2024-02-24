const dataPaginas 					= require('../../data/varandas/dataPaginas');
const fs 							= require('fs');
const path 							= require('path');
const { editarArquivoHandlebars,
		deletarArquivoHandlebars, 
		htmlParaHandlebars }		= require('../../utils/utilArquivos');
const { vidParaId }					= require('../../utils/utilControllers');
require('dotenv').config();

exports.verPaginas = async function (varanda_id, pagina_id = null, publica = null) {
	let resposta;
	if (pagina_id !== null) {
		const pagina_vid = `${varanda_id}/${pagina_id}`;
		const pagina = await dataPaginas.getPagina(pagina_vid);
		resposta = pagina.rows[0];
	} else {
		const paginas = await dataPaginas.getPaginas(varanda_id, publica);
		resposta = paginas.rows;
	}
	
	return resposta;
};

exports.criarPagina = async function (varanda_id, dados) {

	const pagina = {
		pagina_vid:	`${varanda_id}/${encodeURIComponent(dados.titulo)}`,
		titulo: 	dados.titulo,
		publica: 	dados.publica ? dados.publica : true,
		html:		dados.html
	}

	let novaPagina = (await dataPaginas.createPagina(varanda_id, pagina)).rows[0];
	novaPagina.handlebars = htmlParaHandlebars(novaPagina.html);
	editarArquivoHandlebars(varanda_id, novaPagina);

	return novaPagina;
};

exports.editarPagina = async function (varanda_id, pagina_id, dados) {
	
	const pagina_vid = `${varanda_id}/${pagina_id}`;

	let paginaEditada = (await dataPaginas.editPagina(pagina_vid, {titulo: dados.titulo, publica: dados.publica, html: dados.html})).rows[0];
	paginaEditada.handlebars = htmlParaHandlebars(paginaEditada.html);
	editarArquivoHandlebars(varanda_id, paginaEditada);

	return paginaEditada;
};

exports.deletarPagina = async function (varanda_id, pagina_id) {

	const pagina_vid = `${varanda_id}/${pagina_id}`;
	const paginaDeletada = (await dataPaginas.deletePagina(pagina_vid)).rows[0];
	deletarArquivoHandlebars(varanda_id, vidParaId(paginaDeletada.pagina_vid));

	return paginaDeletada;
};