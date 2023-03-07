const pool = require('../config/database');

function getBlogsComunitarios(comunidadeId) {
	return pool.query(
		'SELECT * FROM blogs_comunitarios WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function postBlogComunitario(comunidadeId, blogId) {
	return pool.query(
		'INSERT INTO blogs_comunitarios (comunidade_id, blog_comunitario_id) VALUES ($1, $2) RETURNING *',
		[comunidadeId, blogId]
	);
}

function getTextosComunitarios(comunidadeId) {
	return pool.query(
		'SELECT * FROM textos_comunitarios WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function getTextosBlogComunitario(comunidadeId, blog) {
	return pool.query(
		'SELECT * FROM textos_comunitarios WHERE comunidade_id = $1 AND blog_comunitario_id = $2',
		[comunidadeId, blog]
	);
}

function getTextoComunitario(comunidadeId, textoId) {
	return pool.query(
		'SELECT * FROM textos_comunitarios WHERE comunidade_id = $1 AND texto_comunitario_id = $2',
		[comunidadeId, textoId]
	);
}

function createTextoComunitario(dados) {
	return pool.query(
		'INSERT INTO textos_comunitarios (comunidade_id, pessoa_id, titulo, blog_comunitario_id) VALUES ($1, $2, $3, $4) RETURNING *',
		[dados.comunidade_id, dados.pessoa_id, dados.titulo, dados.blog_comunitario_id]
	);
}

function editTextoComunitario(dados){
	return pool.query(
		'UPDATE textos_comunitarios SET titulo = $1, blog = $2 WHERE comunidade_id = $3 AND texto_comunitario_id = $4 RETURNING *',
		[dados.titulo, dados.blog, dados.comunidade_id, dados.texto_comunitario_id]	
	);
}

function deleteTextoComunitario(dados){
	return pool.query(
		'DELETE FROM textos_comunitario WHERE comunidade_id = $1 AND texto_comunitario_id = $2 RETURNING *',
		[dados.comunidade_id, dados.texto_comunitario_id]
	);
}

exports.getBlogsComunitarios = getBlogsComunitarios;
exports.postBlogComunitario = postBlogComunitario;
exports.getTextosComunitarios = getTextosComunitarios;
exports.getTextosBlogComunitario = getTextosBlogComunitario;
exports.getTextoComunitario = getTextoComunitario;
exports.createTextoComunitario = createTextoComunitario;
exports.editTextoComunitario = editTextoComunitario;
exports.deleteTextoComunitario = deleteTextoComunitario;