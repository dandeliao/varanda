const dataImagensComunitarias = require('../data/dataImagensComunitarias');
const path = require('path');
const fs = require('fs');
const staticPath = '../../static'

exports.getAlbunsComunitarios = async function (comunidadeId) {
	let objetoAlbuns = await dataImagensComunitarias.getAlbunsComunitarios(comunidadeId);
	return objetoAlbuns;
};

exports.getCapaAlbumComunitario = async function(comunidadeId, albumId) {
	let objetoAlbum = await dataImagensComunitarias.getAlbumComunitario(comunidadeId, albumId);
	let caminho;
	let existeCapa = objetoAlbum.rows[0].capa_id ? true : false;
	if (existeCapa) {
		let objetoImagem = await dataImagensComunitarias.getImagemComunitaria(comunidadeId, objetoAlbum.rows[0].capa_id);
		let nomeArquivo = objetoImagem.rows[0].nome_arquivo;
		caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${comunidadeId}`, 'imagens', objetoAlbum.rows[0].album_comunitario_id, nomeArquivo);
	} else {
		caminho = path.join(path.resolve(__dirname, staticPath), 'default', 'album.png');
	}
	return caminho;
};

exports.postAlbumComunitario = async function (dados) {
	let objetoAlbum = await dataImagensComunitarias.postAlbumComunitario(dados.comunidade_id, dados.album_comunitario_id);
	return objetoAlbum;
};

exports.getImagensComunitarias = async function (comunidadeId) {
	let objetoImagens = await dataImagensComunitarias.getImagensComunitarias(comunidadeId);
	const sortedImagens = objetoImagens.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedImagens;
};

exports.getImagensAlbumComunitario = async function (comunidadeId, album) {
	let objetoImagens= await dataImagensComunitarias.getImagensAlbumComunitario(comunidadeId, album);
	const sortedImagens = objetoImagens.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedImagens;
};

exports.getImagemComunitaria = async function (comunidadeId, imagemId) {

	let objetoImagem = await dataImagensComunitarias.getImagemComunitaria(comunidadeId, imagemId);
	const album = objetoImagem.rows[0].album_comunitario_id;
	const nomeArquivo = objetoImagem.rows[0].nome_arquivo;

	const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${comunidadeId}`, 'imagens', album, nomeArquivo);
	return caminho;
};

exports.getInfoImagemComunitaria = async function (pessoaId, imagemId) {
	let objetoImagem = await dataImagensComunitarias.getImagemComunitaria(pessoaId, imagemId);
	return objetoImagem.rows[0];
};


exports.postImagemComunitaria = async function (dados, dadosArquivo) {

	// falta verificar autorização (pessoas com habilidade 'participar')

	const caminhoTemp = dadosArquivo.path;
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${dados.comunidade_id}`, 'imagens', dados.album_comunitario_id);
	const caminhoDestino = path.join(path.resolve(diretorioDestino, dadosArquivo.originalname));

	if (!fs.existsSync(diretorioDestino)){
		fs.mkdirSync(diretorioDestino);
	}	

	fs.rename(caminhoTemp, caminhoDestino, err => {
		if (err) throw err;
	});

	dados.nome_arquivo = dadosArquivo.originalname;
	const dataResponse = await dataImagensComunitarias.createImagemComunitaria(dados);

	// checa se o álbum possui capa. Caso não possua, a nova imagem se torna a capa.
	let objetoAlbum = await dataImagensComunitarias.getAlbumComunitario(dados.comunidade_id, dados.album_comunitario_id);
	if (objetoAlbum.rows[0].capa_id === null) {
		await dataImagensComunitarias.editAlbumComunitario(dados.comunidade_id, dados.album_comunitario_id, {capa_id: dataResponse.rows[0].imagem_comunitaria_id});
	}

	return dataResponse.rows[0];
};

exports.editImagemComunitaria = async function (dados) {

	// falta verificar autorização (pessoa que subiu imagem & pessoas com habilidades 'editar' e 'moderar'?)

	const objetoImagem = await dataImagensComunitarias.editImagemComunitaria(dados);
	if (objetoImagem.rowCount === 0) throw new Error('imagem não encontrada');
	return objetoImagem.rows[0];

};

exports.deleteImagemComunitaria = async function (dados) {

	// falta verificar autorização (pessoa que subiu imagem & pessoas com habilidades 'moderar'?)

	const dataResponse = await dataImagensComunitarias.deleteImagemComunitaria(dados);
	const nomeArquivo = dataResponse.rows[0].nome_arquivo;
	const album = dataResponse.rows[0].album_comunitario_id;
	const caminho = path.join(path.resolve(__dirname, staticPath), 'comunidades', `${dados.comunidade_id}`, 'imagens', album, nomeArquivo);
	fs.unlink(caminho, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for 'arquivo não encontrado', não faz nada
				throw err;
			}
		}
	});
};