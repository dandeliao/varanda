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

exports.createEdicao = function (paginaId, bichoId, texto) {
	return pool.query(
		'INSERT INTO edicoes (pagina_id, bicho_id, texto) VALUES ($1, $2, $3) RETURNING *',
		[paginaId, bichoId, texto]
	);
};

exports.deleteEdicao = function (edicaoId){
	return pool.query(
		'DELETE FROM edicoes WHERE edicao_id = $1 RETURNING *',
		[edicaoId]
	);
};