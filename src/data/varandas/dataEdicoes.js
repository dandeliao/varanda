const pool = require('../../config/database');

exports.getEdicoesDaPagina = function (paginaVid) {
	return pool.query(
		'SELECT * FROM edicoes WHERE pagina_vid = $1',
		[paginaVid]
	);
};

exports.getEdicao = function (edicaoId) {
	return pool.query(
		'SELECT * FROM edicoes WHERE edicao_id = $1',
		[edicaoId]
	);
};

exports.createEdicao = function (bichoId, pagina, html) {
	return pool.query(
		'INSERT INTO edicoes (pagina_vid, bicho_editor_id, titulo, publica, postavel, html) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[pagina.pagina_vid, bichoId, pagina.titulo, pagina.publica, pagina.postavel, html]
	);
};

exports.deleteEdicao = function (edicaoId){
	return pool.query(
		'DELETE FROM edicoes WHERE edicao_id = $1 RETURNING *',
		[edicaoId]
	);
};