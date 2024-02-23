const pool = require('../../config/database');

exports.getPaginas = function (varandaId, publica) {
	let resultado;
	if (publica !== null) {
		resultado = pool.query(
			'SELECT * FROM paginas WHERE varanda_id = $1 AND publica = $2',
			[varandaId, publica]
		);
	} else {
		resultado = pool.query(
			'SELECT * FROM paginas WHERE varanda_id = $1',
			[varandaId]
		);
	}
	return resultado;
};

exports.getPagina = function (paginaId) {
	return pool.query(
		'SELECT * FROM paginas WHERE pagina_id = $1',
		[paginaId]
	);
};

exports.createPagina = function (varanda_id, pagina) {
	return pool.query(
		'INSERT INTO paginas (varanda_id, titulo, publica, html) VALUES ($1, $2, $3, $4) RETURNING *',
		[varanda_id, pagina.titulo, pagina.publica, pagina.html]
	);
};

exports.editPagina = function (pagina_id, pagina){
	return pool.query(
		'UPDATE paginas SET titulo = $1, publica = $2, html = $3 WHERE pagina_id = $4 RETURNING *',
		[pagina.titulo, pagina.publica, pagina.html, pagina_id]	
	);
};

exports.deletePagina = function (pagina){
	return pool.query(
		'DELETE FROM paginas WHERE varanda_id = $1 AND pagina_id = $2 RETURNING *',
		[pagina.varanda_id, pagina.pagina_id]
	);
};