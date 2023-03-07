const dataImagensPessoais = require('../data/dataImagensPessoais');
const path = require('path');
const fs = require('fs');
const staticPath = '../../static'

exports.getAlbunsPessoais = async function (pessoaId) {
	let objetoAlbuns = await dataImagensPessoais.getAlbunsPessoais(pessoaId);
	return objetoAlbuns;
};

exports.getCapaAlbumPessoal = async function(pessoaId, albumId) {
	let objetoAlbum = await dataImagensPessoais.getAlbumPessoal(pessoaId, albumId);
	let caminho;
	let existeCapa = objetoAlbum.rows[0].capa_id ? true : false;
	if (existeCapa) {
		let objetoImagem = await dataImagensPessoais.getImagemPessoal(pessoaId, objetoAlbum.rows[0].capa_id);
		let nomeArquivo = objetoImagem.rows[0].nome_arquivo;
		caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${pessoaId}`, 'imagens', objetoAlbum.rows[0].album_pessoal_id, nomeArquivo);
	} else {
		caminho = path.join(path.resolve(__dirname, staticPath), 'default', 'album.png');
	}
	return caminho;
};

exports.postAlbumPessoal = async function (dados) {
	let objetoAlbum = await dataImagensPessoais.postAlbumPessoal(dados.pessoa_id, dados.album_pessoal_id);
	return objetoAlbum;
};

exports.getImagensPessoais = async function (pessoaId) {
	let objetoImagens = await dataImagensPessoais.getImagensPessoais(pessoaId);
	const sortedImagens = objetoImagens.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedImagens;
};

exports.getImagensAlbumPessoal = async function (pessoaId, album) {
	let objetoImagens= await dataImagensPessoais.getImagensAlbumPessoal(pessoaId, album);
	const sortedImagens = objetoImagens.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedImagens;
};

exports.getImagemPessoal = async function (pessoaId, imagemId) {

	let objetoImagem = await dataImagensPessoais.getImagemPessoal(pessoaId, imagemId);
	const album = objetoImagem.rows[0].album_pessoal_id;
	const nomeArquivo = objetoImagem.rows[0].nome_arquivo;

	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${pessoaId}`, 'imagens', album, nomeArquivo);
	return caminho;
};

exports.getInfoImagemPessoal = async function (pessoaId, imagemId) {
	let objetoImagem = await dataImagensPessoais.getImagemPessoal(pessoaId, imagemId);
	return objetoImagem.rows[0];
};

exports.postImagemPessoal = async function (dados, dadosArquivo) {

	const caminhoTemp = dadosArquivo.path;
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'imagens', dados.album_pessoal_id);
	const caminhoDestino = path.join(path.resolve(diretorioDestino, dadosArquivo.originalname));

	if (!fs.existsSync(diretorioDestino)){
		fs.mkdirSync(diretorioDestino);
	}	

	fs.rename(caminhoTemp, caminhoDestino, err => {
		if (err) throw err;
	});

	dados.nome_arquivo = dadosArquivo.originalname;
	const dataResponse = await dataImagensPessoais.createImagemPessoal(dados);

	// checa se o álbum possui capa. Caso não possua, a nova imagem se torna a capa.
	let objetoAlbum = await dataImagensPessoais.getAlbumPessoal(dados.pessoa_id, dados.album_pessoal_id);
	if (objetoAlbum.rows[0].capa_id === null) {
		await dataImagensPessoais.editAlbumPessoal(dados.pessoa_id, dados.album_pessoal_id, {capa_id: dataResponse.rows[0].imagem_pessoal_id});
	}

	return dataResponse.rows[0];
};

exports.editImagemPessoal = async function (dados) {

	const objetoImagem = await dataImagensPessoais.editImagemPessoal(dados);
	if (objetoImagem.rowCount === 0) throw new Error('imagem não encontrada');
	return objetoImagem.rows[0];

};

exports.deleteImagemPessoal = async function (dados) {
	const dataResponse = await dataImagensPessoais.deleteImagemPessoal(dados);
	const nomeArquivo = dataResponse.rows[0].nome_arquivo;
	const album = dataResponse.rows[0].album_pessoal_id;
	const caminho = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`, 'imagens', album, nomeArquivo);
	fs.unlink(caminho, (err) => {
		if (err) {
			if (err.code !== 'ENOENT') { // se o erro for 'arquivo não encontrado', não faz nada
				throw err;
			}
		}
	});
};