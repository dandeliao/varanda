const pool = require('../config/database');

function getAlbunsComunitarios(comunidadeId) {
	return pool.query(
		'SELECT * FROM albuns_comunitarios WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function getAlbumComunitario(comunidadeId, albumId) {
	return pool.query(
		'SELECT * FROM albuns_comunitarios WHERE comunidade_id = $1 AND album_comunitario_id = $2',
		[comunidadeId, albumId]
	);
}

function postAlbumComunitario(comunidadeId, albumId) {
	return pool.query(
		'INSERT INTO albuns_comunitarios (comunidade_id, album_comunitario_id) VALUES ($1, $2) RETURNING *',
		[comunidadeId, albumId]
	);
}

function editAlbumComunitario(comunidadeId, albumId, dados) {
	return pool.query(
		'UPDATE albuns_comunitarios SET capa_id = $1 WHERE comunidade_id = $2 AND album_comunitario_id = $3 RETURNING *',
		[dados.capa_id, comunidadeId, albumId]
	);
}

function getImagensComunitarias(comunidadeId) {
	return pool.query(
		'SELECT * FROM imagens_comunitarias WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function getImagensAlbumComunitario(comunidadeId, album) {
	return pool.query(
		'SELECT * FROM imagens_comunitarias WHERE comunidade_id = $1 AND album_comunitario_id = $2',
		[comunidadeId, album]
	);
}

function getImagemComunitaria(comunidadeId, imagemId) {
	return pool.query(
		'SELECT * FROM imagens_comunitarias WHERE comunidade_id = $1 AND imagem_comunitaria_id = $2',
		[comunidadeId, imagemId]
	);
}

function createImagemComunitaria(dados) {
	return pool.query(
		'INSERT INTO imagens_comunitarias (comunidade_id, pessoa_id, nome_arquivo, descricao, titulo, album_comunitario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[dados.comunidade_id, dados.pessoa_id, dados.nome_arquivo, dados.descricao, dados.titulo, dados.album_comunitario_id]
	);
}

function editImagemComunitaria(dados){
	return pool.query(
		'UPDATE imagens_comunitarias SET descricao = $1, album = $2 WHERE comunidade_id = $3 AND imagem_comunitaria_id = $4 RETURNING *',
		[dados.descricao, dados.album, dados.comunidade_id, dados.imagem_comunitaria_id]	
	);
}

function deleteImagemComunitaria(dados){
	return pool.query(
		'DELETE FROM imagens_comunitarias WHERE comunidade_id = $1 AND imagem_comunitaria_id = $2 RETURNING *',
		[dados.comunidade_id, dados.imagem_comunitaria_id]
	);
}

exports.getAlbunsComunitarios = getAlbunsComunitarios;
exports.getAlbumComunitario = getAlbumComunitario;
exports.postAlbumComunitario = postAlbumComunitario;
exports.editAlbumComunitario = editAlbumComunitario;
exports.getImagensComunitarias = getImagensComunitarias;
exports.getImagensAlbumComunitario = getImagensAlbumComunitario;
exports.getImagemComunitaria = getImagemComunitaria;
exports.createImagemComunitaria = createImagemComunitaria;
exports.editImagemComunitaria = editImagemComunitaria;
exports.deleteImagemComunitaria = deleteImagemComunitaria;