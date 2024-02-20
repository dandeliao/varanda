const dataTextosPessoais = require('../data/dataTextosPessoais');
const path = require('path');
const fs = require('fs');
const staticPath = '../../static';

exports.getBlogsPessoais = async function (pessoaId) {
	let objetoBlogs = await dataTextosPessoais.getBlogsPessoais(pessoaId);
	return objetoBlogs;
};

exports.postBlogPessoal = async function (dados) {
	let objetoBlog = await dataTextosPessoais.postBlogPessoal(dados.pessoa_id, dados.blog_pessoal_id);
	return objetoBlog;
};

exports.getTextosPessoais = async function (pessoaId) {
	let objetoTextos = await dataTextosPessoais.getTextosPessoais(pessoaId);
	const sortedTextos = objetoTextos.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedTextos;
};

exports.getTextosBlogPessoal = async function (pessoaId, blog) {
	let objetoTextos = await dataTextosPessoais.getTextosBlogPessoal(pessoaId, blog);
	const sortedTextos = objetoTextos.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedTextos;
};

exports.getTextoPessoal = async function (pessoaId, textoId) {

	let objetoTexto = await dataTextosPessoais.getTextoPessoal(pessoaId, textoId);
	const blog = objetoTexto.rows[0].blog_pessoal_id;
	const nomeArquivo = `${objetoTexto.rows[0].texto_pessoal_id}.mkd`;

	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${pessoaId}`, 'textos', blog, nomeArquivo);
	return caminho;
};

exports.getInfoTextoPessoal = async function (pessoaId, textoId) {
	let objetoTexto = await dataTextosPessoais.getTextoPessoal(pessoaId, textoId);
	return objetoTexto.rows[0];
};

exports.postTextoPessoal = async function (dados) {

	const dataResponse = await dataTextosPessoais.createTextoPessoal(dados);
	const textoId = dataResponse.rows[0].texto_pessoal_id;

	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'textos', dados.blog_pessoal_id);

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

exports.editTextoPessoal = async function (dados) {

	const objetoTexto = await dataTextosPessoais.editTextoPessoal(dados);
	if (objetoTexto.rowCount === 0) throw new Error('texto não encontrado');
	return objetoTexto.rows[0];

};

exports.deleteTextoPessoal = async function (dados) {
	const dataResponse = await dataTextosPessoais.deleteTextoPessoal(dados);
	const nomeArquivo = `${dataResponse.rows[0].texto_pessoal_id}.mkd`;
	const blog = dataResponse.rows[0].blog;
	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'textos', blog, nomeArquivo);
	fs.unlink(caminho, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for 'arquivo não encontrado', não faz nada
				throw err;
			}
		}
	});
};