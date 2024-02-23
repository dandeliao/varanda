const dataPaginas 					= require('../../data/varandas/dataPaginas');
const fs 							= require('fs');
const path 							= require('path');
const { editarArquivoHandlebars,
		deletarArquivoHandlebars, 
		htmlParaHandlebars }		= require('../../utils/utilArquivos');
require('dotenv').config();

exports.verPaginas = async function (varanda_id, pagina_id, publica) {
	let resposta;
	if (pagina_id !== null) {
		const pagina = await dataPaginas.getPagina(pagina_id);
		resposta = pagina.rows[0];
	} else {
		const paginas = await dataPaginas.getPaginas(varanda_id, publica);
		resposta = paginas.rows;
	}
	
	return resposta;
};

exports.criarPagina = async function (varanda_id, dados) {

	const pagina = {
		titulo: 	dados.titulo,
		publica: 	dados.publica ? dados.publica : true,
		html:		dados.html
	}

	let novaPagina = (await dataPaginas.createPagina(varanda_id, pagina)).rows[0];
	novaPagina.handlebars = htmlParaHandlebars(novaPagina.html);
	console.log('novaPagina:', novaPagina);
	editarArquivoHandlebars(varanda_id, novaPagina);

	return novaPagina;
};

exports.editarPagina = async function (pagina_id, dados) {
	
	const paginaOriginal = (await dataPaginas.getPagina(pagina_id)).rows[0];
	let paginaEditada = (await dataPaginas.editPagina(pagina_id, {titulo: dados.titulo, publica: dados.publica, html: dados.html})).rows[0];
	paginaEditada.handlebars = htmlParaHandlebars(paginaEditada.html);
	editarArquivoHandlebars(varanda_id, paginaEditada, paginaOriginal);

	return paginaEditada;
};

exports.deletarPagina = async function (pagina_id) {

	const paginaDeletada = (await dataPaginas.deletePagina(pagina_id)).rows[0];
	deletarArquivoHandlebars(varanda_id, encodeURIComponent(paginaDeletada.titulo));

	return paginaDeletada;
};