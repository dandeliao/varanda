const pool = require('../../config/database');

exports.getBlocosPagina = function (paginaId) {
	return pool.query(
		'SELECT * FROM blocos_paginas WHERE pagina_id = $1',
		[paginaId]
	);
};

exports.createBlocoPagina = function (paginaId, blocoId) {
	return pool.query(
		'INSERT INTO blocos_paginas (pagina_id, bloco_id) VALUES ($1, $2) RETURNING *',
		[paginaId, blocoId]
	);
};

exports.editBlocoPagina = function (paginaId, blocoId, blocoPaginaId){
	return pool.query(
		'UPDATE blocos_paginas SET pagina_id = $1, bloco_id = $2 WHERE bloco_pagina_id = $3 RETURNING *',
		[paginaId, blocoId, blocoPaginaId]	
	);
};

exports.deleteBlocoPagina = function (blocoPaginaId) {
	return pool.query(
		'DELETE FROM blocos_paginas WHERE bloco_pagina_id = $1 RETURNING *',
		[blocoPaginaId]
	);
};