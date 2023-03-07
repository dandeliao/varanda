const dataTextosComunitarios = require('../data/dataTextosComunitarios');
const path = require('path');
const fs = require('fs');

exports.getBlogsComunitarios = async function (comunidadeId) {
	let objetoBlogs = await dataTextosComunitarios.getBlogsComunitarios(comunidadeId);
	return objetoBlogs;
};

exports.postBlogComunitario = async function (dados) {
	let objetoBlog = await dataTextosComunitarios.postBlogComunitario(dados.comunidade_id, dados.blog_comunitario_id);
	return objetoBlog;
};

exports.getTextosComunitarios = async function (comunidadeId) {
	let objetoTextos = await dataTextosComunitarios.getTextosComunitarios(comunidadeId);
	const sortedTextos = objetoTextos.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedTextos;
};

exports.getTextosBlogComunitario = async function (comunidadeId, blog) {
	let objetoTextos = await dataTextosComunitarios.getTextosBlogComunitario(comunidadeId, blog);
	const sortedTextos = objetoTextos.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedTextos;
};

exports.getTextoComunitario = async function (comunidadeId, textoId) {

	let objetoTexto = await dataTextosComunitarios.getTextoComunitario(comunidadeId, textoId);
	const blog = objetoTexto.rows[0].blog_comunitario_id;
	const nomeArquivo = `${objetoTexto.rows[0].texto_comunitario_id}.mkd`;

	const caminho = path.join(path.resolve(__dirname, '../../../../static'), 'comunidades', `${comunidadeId}`, 'textos', blog, nomeArquivo);
	return caminho;
};

exports.getInfoTextoComunitario = async function (comunidadeId, textoId) {
	let objetoTexto = await dataTextosComunitarios.getTextoComunitario(comunidadeId, textoId);
	return objetoTexto.rows[0];
};

exports.postTextoComunitario = async function (dados) {

	const dataResponse = await dataTextosComunitarios.createTextoComunitario(dados);
	const textoId = dataResponse.rows[0].texto_comunitario_id;

	const diretorioDestino = path.join(path.resolve(__dirname, '../../../../static'), 'comunidades', `${dados.comunidade_id}`, 'textos', dados.blog_comunitario_id);

	if (!fs.existsSync(diretorioDestino)) {
		fs.mkdirSync(diretorioDestino);
	}

	const caminho = path.join(path.resolve(diretorioDestino, `${textoId}.mkd`));

	fs.writeFile(caminho, dados.texto, erro => {
		if (erro) {
			throw erro;
		}
	});	

	return dataResponse.rows[0];
};

exports.editTextoComunitario = async function (dados) {

	const objetoTexto = await dataTextosComunitarios.editTextoComunitario(dados);
	if (objetoTexto.rowCount === 0) throw new Error('texto não encontrado');
	return objetoTexto.rows[0];

};

exports.deleteTextoComunitario = async function (dados) {
	const dataResponse = await dataTextosComunitarios.deleteTextoComunitario(dados);
	const nomeArquivo = `${dataResponse.rows[0].texto_comunitario_id}.mkd`;
	const blog = dataResponse.rows[0].blog;
	const caminho = path.join(path.resolve(__dirname, '../../../../static'), 'comunidades', `${dados.comunidade_id}`, 'textos', blog, nomeArquivo);
	fs.unlink(caminho, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for 'arquivo não encontrado', não faz nada
				throw err;
			}
		}
	});
};