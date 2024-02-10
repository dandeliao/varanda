const pool = require('../../config/database');

exports.getEdicoesDaPagina = function (paginaId) {
	return pool.query(
		'SELECT * FROM edicoes WHERE pagina_id = $1',
		[paginaId]
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
		'INSERT INTO edicoes (pagina_id, bicho_id, ordem, titulo, publica, html) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[pagina.pagina_id, bichoId, pagina.ordem, pagina.titulo, pagina.publica, html]
	);
};

exports.deleteEdicao = function (edicaoId){
	return pool.query(
		'DELETE FROM edicoes WHERE edicao_id = $1 RETURNING *',
		[edicaoId]
	);
};