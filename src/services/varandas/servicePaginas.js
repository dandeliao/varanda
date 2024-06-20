const dataPaginas 					= require('../../data/varandas/dataPaginas');
const { editarArquivoHandlebars,
		deletarArquivoHandlebars }	= require('../../utils/utilArquivos');
const { vidParaId, sanitizarHtml,
		htmlParaHtmx }				= require('../../utils/utilParsers');
const { sanitizarNomeDeArquivo }	= require('../../utils/utilParsers');

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
	const pagina_id = dados.pagina_vid ? vidParaId(dados.pagina_vid) : encodeURIComponent(sanitizarNomeDeArquivo(dados.titulo));
	const pagina = {
		pagina_vid:	`${varanda_id}/${pagina_id}`,
		titulo: 	dados.titulo,
		publica: 	dados.publica ? dados.publica : true,
		html:		await sanitizarHtml(dados.html, dados.comunitaria)
	}
	let novaPagina = (await dataPaginas.createPagina(varanda_id, pagina)).rows[0];
	novaPagina.handlebars = await htmlParaHtmx(novaPagina.html, varanda_id, pagina_id);
	editarArquivoHandlebars(varanda_id, novaPagina);

	return novaPagina;
};

exports.editarPagina = async function (varanda_id, pagina_id, dados) {
	
	const pagina_vid = `${varanda_id}/${pagina_id}`;

	dados.html = await sanitizarHtml(dados.html, dados.comunitaria);
	let paginaEditada = (await dataPaginas.editPagina(pagina_vid, {titulo: dados.titulo, publica: dados.publica, html: dados.html})).rows[0];
	paginaEditada.handlebars = await htmlParaHtmx(paginaEditada.html, varanda_id, pagina_id);
	editarArquivoHandlebars(varanda_id, paginaEditada);

	return paginaEditada;
};

exports.deletarPagina = async function (varanda_id, pagina_id) {

	const pagina_vid = `${varanda_id}/${pagina_id}`;
	const paginaDeletada = (await dataPaginas.deletePagina(pagina_vid)).rows[0];
	deletarArquivoHandlebars(varanda_id, vidParaId(paginaDeletada.pagina_vid));

	return paginaDeletada;
};