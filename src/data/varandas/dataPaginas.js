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

exports.getPagina = function (paginaVid) {
	return pool.query(
		'SELECT * FROM paginas WHERE pagina_vid = $1',
		[paginaVid]
	);
};

exports.createPagina = function (varanda_id, pagina) {
	return pool.query(
		'INSERT INTO paginas (pagina_vid, varanda_id, titulo, publica, html) VALUES ($1, $2, $3, $4, $5) RETURNING *',
		[pagina.pagina_vid, varanda_id, pagina.titulo, pagina.publica, pagina.html]
	);
};

exports.editPagina = function (pagina_vid, pagina){
	return pool.query(
		'UPDATE paginas SET titulo = $1, publica = $2, html = $3 WHERE pagina_vid = $4 RETURNING *',
		[pagina.titulo, pagina.publica, pagina.html, pagina_vid]	
	);
};

exports.deletePagina = function (pagina_vid){
	return pool.query(
		'DELETE FROM paginas WHERE pagina_vid = $1 RETURNING *',
		[pagina_vid]
	);
};