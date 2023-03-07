const pool = require('../config/database');

function getAlbunsPessoais(pessoaId) {
	return pool.query(
		'SELECT * FROM albuns_pessoais WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function getAlbumPessoal(pessoaId, albumId) {
	return pool.query(
		'SELECT * FROM albuns_pessoais WHERE pessoa_id = $1 AND album_pessoal_id = $2',
		[pessoaId, albumId]
	);
}

function postAlbumPessoal(pessoaId, albumId) {
	return pool.query(
		'INSERT INTO albuns_pessoais (pessoa_id, album_pessoal_id) VALUES ($1, $2) RETURNING *',
		[pessoaId, albumId]
	);
}

function editAlbumPessoal(pessoaId, albumId, dados) {
	return pool.query(
		'UPDATE albuns_pessoais SET capa_id = $1 WHERE pessoa_id = $2 AND album_pessoal_id = $3 RETURNING *',
		[dados.capa_id, pessoaId, albumId]
	);
}


function getImagensPessoais(pessoaId) {
	return pool.query(
		'SELECT * FROM imagens_pessoais WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function getImagensAlbumPessoal(pessoaId, album) {
	return pool.query(
		'SELECT * FROM imagens_pessoais WHERE pessoa_id = $1 AND album_pessoal_id = $2',
		[pessoaId, album]
	);
}

function getImagemPessoal(pessoaId, imagemId) {
	return pool.query(
		'SELECT * FROM imagens_pessoais WHERE pessoa_id = $1 AND imagem_pessoal_id = $2',
		[pessoaId, imagemId]
	);
}

function createImagemPessoal(dados) {
	return pool.query(
		'INSERT INTO imagens_pessoais (pessoa_id, nome_arquivo, descricao, album_pessoal_id) VALUES ($1, $2, $3, $4) RETURNING *',
		[dados.pessoa_id, dados.nome_arquivo, dados.descricao, dados.album_pessoal_id]
	);
}

function editImagemPessoal(dados){
	return pool.query(
		'UPDATE imagens_pessoais SET descricao = $1, album = $2 WHERE pessoa_id = $3 AND imagem_pessoal_id = $4 RETURNING *',
		[dados.descricao, dados.album, dados.pessoa_id, dados.imagem_pessoal_id]	
	);
}

function deleteImagemPessoal(dados){
	return pool.query(
		'DELETE FROM imagens_pessoais WHERE pessoa_id = $1 AND imagem_pessoal_id = $2 RETURNING *',
		[dados.pessoa_id, dados.imagem_pessoal_id]
	);
}

exports.getAlbunsPessoais = getAlbunsPessoais;
exports.getAlbumPessoal = getAlbumPessoal;
exports.postAlbumPessoal = postAlbumPessoal;
exports.editAlbumPessoal = editAlbumPessoal;
exports.getImagensPessoais = getImagensPessoais;
exports.getImagensAlbumPessoal = getImagensAlbumPessoal;
exports.getImagemPessoal = getImagemPessoal;
exports.createImagemPessoal = createImagemPessoal;
exports.editImagemPessoal = editImagemPessoal;
exports.deleteImagemPessoal = deleteImagemPessoal;