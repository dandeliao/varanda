const pool = require('../../../config/database');

function getBlogsPessoais(pessoaId) {
	return pool.query(
		'SELECT * FROM blogs_pessoais WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function postBlogPessoal(pessoaId, blogId) {
	return pool.query(
		'INSERT INTO blogs_pessoais (pessoa_id, blog_pessoal_id) VALUES ($1, $2) RETURNING *',
		[pessoaId, blogId]
	);
}

function getTextosPessoais(pessoaId) {
	return pool.query(
		'SELECT * FROM textos_pessoais WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function getTextosBlogPessoal(pessoaId, blog) {
	return pool.query(
		'SELECT * FROM textos_pessoais WHERE pessoa_id = $1 AND blog_pessoal_id = $2',
		[pessoaId, blog]
	);
}

function getTextoPessoal(pessoaId, textoId) {
	return pool.query(
		'SELECT * FROM textos_pessoais WHERE pessoa_id = $1 AND texto_pessoal_id = $2',
		[pessoaId, textoId]
	);
}

function createTextoPessoal(dados) {
	return pool.query(
		'INSERT INTO textos_pessoais (pessoa_id, titulo, blog_pessoal_id) VALUES ($1, $2, $3) RETURNING *',
		[dados.pessoa_id, dados.titulo, dados.blog_pessoal_id]
	);
}

function editTextoPessoal(dados){
	return pool.query(
		'UPDATE textos_pessoais SET titulo = $1, blog = $2 WHERE pessoa_id = $3 AND texto_pessoal_id = $4 RETURNING *',
		[dados.titulo, dados.blog, dados.pessoa_id, dados.texto_pessoal_id]	
	);
}

function deleteTextoPessoal(dados){
	return pool.query(
		'DELETE FROM textos_pessoais WHERE pessoa_id = $1 AND texto_pessoal_id = $2 RETURNING *',
		[dados.pessoa_id, dados.texto_pessoal_id]
	);
}

exports.getBlogsPessoais = getBlogsPessoais;
exports.postBlogPessoal = postBlogPessoal;
exports.getTextosPessoais = getTextosPessoais;
exports.getTextosBlogPessoal = getTextosBlogPessoal;
exports.getTextoPessoal = getTextoPessoal;
exports.createTextoPessoal = createTextoPessoal;
exports.editTextoPessoal = editTextoPessoal;
exports.deleteTextoPessoal = deleteTextoPessoal;