const pool = require('../../config/database');

exports.getPaginas = function (varandaId) {
	return pool.query(
		'SELECT * FROM paginas WHERE varanda_id = $1',
		[varandaId]
	);
};

exports.getPagina = function (paginaId) {
	return pool.query(
		'SELECT * FROM paginas WHERE pagina_id = $1',
		[paginaId]
	);
};

exports.createPagina = function (pagina) {
	return pool.query(
		'INSERT INTO paginas (varanda_id, titulo, publica) VALUES ($1, $2, $3) RETURNING *',
		[pagina.varanda_id, pagina.titulo, pagina.publica]
	);
};

exports.editPagina = function (pagina){
	return pool.query(
		'UPDATE paginas SET titulo = $1, publica = $2 WHERE varanda_id = $3 AND pagina_id = $4 RETURNING *',
		[pagina.titulo, pagina.publica, pagina.varanda_id, pagina.pagina_id]	
	);
};

exports.deletePagina = function (pagina){
	return pool.query(
		'DELETE FROM paginas WHERE varanda_id = $1 AND pagina_id = $2 RETURNING *',
		[pagina.varanda_id, pagina.pagina_id]
	);
};