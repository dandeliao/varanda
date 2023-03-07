const pool = require('../config/database');

exports.getForuns = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM foruns WHERE comunidade_id = $1',
		[comunidadeId]
	);
};

exports.postForum = function (comunidadeId, forumId) {
	return pool.query(
		'INSERT INTO foruns (comunidade_id, forum_id) VALUES ($1, $2) RETURNING *',
		[comunidadeId, forumId]
	);
};

exports.getTopicos = function (forumId) {
	return pool.query(
		'SELECT * FROM topicos WHERE forum_id = $1',
		[forumId]
	);
};

exports.getTopico = function (topicoId) {
	return pool.query(
		'SELECT * FROM topicos WHERE topico_id = $1',
		[topicoId]
	);
};

exports.createTopico = function (dados) {
	return pool.query(
		'INSERT INTO topicos (pessoa_id, forum_id, titulo, texto) VALUES ($1, $2, $3, $4) RETURNING *',
		[dados.pessoa_id, dados.forum_id, dados.titulo, dados.texto]
	);
};

exports.editTopico = function (dados){
	return pool.query(
		'UPDATE topicos SET forum_id = $1, titulo = $2, texto = $3 WHERE topico_id = $4 RETURNING *',
		[dados.forum_id, dados.titulo, dados.texto, dados.topico_id]	
	);
};

exports.deleteTopico = function (topicoId){
	return pool.query(
		'DELETE FROM topicos WHERE topico_id = $1 RETURNING *',
		[topicoId]
	);
};