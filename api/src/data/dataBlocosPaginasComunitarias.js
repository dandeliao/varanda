const pool = require('../../../config/database');

function getBlocosPaginaComunitaria(pagina_comunitaria_id) {
	return pool.query(
		'SELECT * FROM blocos_paginas_comunitarias WHERE pagina_comunitaria_id = $1',
		[pagina_comunitaria_id]
	);
}

function createBlocoPaginaComunitaria(dados) {
	return pool.query(
		'INSERT INTO blocos_paginas_comunitarias (pagina_comunitaria_id, bloco_id) VALUES ($1, $2) RETURNING *',
		[dados.pagina_comunitaria_id, dados.bloco_id]
	);
}

function editBlocoPaginaComunitaria(dados){
	return pool.query(
		'UPDATE blocos_paginas_comunitarias SET pagina_comunitaria_id = $1, bloco_id = $2 WHERE bloco_pagina_comunitaria_id = $3 RETURNING *',
		[dados.pagina_comunitaria_id, dados.bloco_id, dados.bloco_pagina_comunitaria_id]	
	);
}

function deleteBlocoPaginaComunitaria(dados){
	return pool.query(
		'DELETE FROM blocos_paginas_comunitarias WHERE bloco_pagina_comunitaria_id = $1 RETURNING *',
		[dados.bloco_pagina_comunitaria_id]
	);
}

exports.getBlocosPaginaComunitaria = getBlocosPaginaComunitaria;
exports.createBlocoPaginaComunitaria = createBlocoPaginaComunitaria;
exports.editBlocoPaginaComunitaria = editBlocoPaginaComunitaria;
exports.deleteBlocoPaginaComunitaria = deleteBlocoPaginaComunitaria;