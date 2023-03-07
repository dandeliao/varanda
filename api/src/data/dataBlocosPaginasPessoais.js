const pool = require('../../../config/database');

function getBlocosPaginaPessoal(pagina_pessoal_id) {
	return pool.query(
		'SELECT * FROM blocos_paginas_pessoais WHERE pagina_pessoal_id = $1',
		[pagina_pessoal_id]
	);
}

function createBlocoPaginaPessoal(dados) {
	return pool.query(
		'INSERT INTO blocos_paginas_pessoais (pagina_pessoal_id, bloco_id) VALUES ($1, $2) RETURNING *',
		[dados.pagina_pessoal_id, dados.bloco_id]
	);
}

function editBlocoPaginaPessoal(dados){
	return pool.query(
		'UPDATE blocos_paginas_pessoais SET pagina_pessoal_id = $1, bloco_id = $2 WHERE bloco_pagina_pessoal_id = $3 RETURNING *',
		[dados.pagina_pessoal_id, dados.bloco_id, dados.bloco_pagina_pessoal_id]	
	);
}

function deleteBlocoPaginaPessoal(dados){
	return pool.query(
		'DELETE FROM blocos_paginas_pessoais WHERE bloco_pagina_pessoal_id = $1 RETURNING *',
		[dados.bloco_pagina_pessoal_id]
	);
}

exports.getBlocosPaginaPessoal = getBlocosPaginaPessoal;
exports.createBlocoPaginaPessoal = createBlocoPaginaPessoal;
exports.editBlocoPaginaPessoal = editBlocoPaginaPessoal;
exports.deleteBlocoPaginaPessoal = deleteBlocoPaginaPessoal;