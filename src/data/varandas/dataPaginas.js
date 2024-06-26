const pool = require('../../config/database');

exports.getPaginas = function (varandaId, publica) {
	let resultado;
	if (publica !== null) {
		resultado = pool.query(
			'SELECT * FROM paginas WHERE varanda_id = $1 AND publica = $2 ORDER BY criacao ASC',
			[varandaId, publica]
		);
	} else {
		resultado = pool.query(
			'SELECT * FROM paginas WHERE varanda_id = $1 ORDER BY criacao ASC',
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
		'INSERT INTO paginas (pagina_vid, varanda_id, titulo, publica, postavel, html) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[pagina.pagina_vid, varanda_id, pagina.titulo, pagina.publica, pagina.postavel, pagina.html]
	);
};

exports.editPagina = function (pagina_vid, pagina){
	return pool.query(
		'UPDATE paginas SET titulo = $1, publica = $2, postavel = $3, html = $4 WHERE pagina_vid = $5 RETURNING *',
		[pagina.titulo, pagina.publica, pagina.postavel, pagina.html, pagina_vid]	
	);
};

exports.deletePagina = function (pagina_vid){
	return pool.query(
		'DELETE FROM paginas WHERE pagina_vid = $1 RETURNING *',
		[pagina_vid]
	);
};