const pool = require('../config/database');

function getPaginasComunitarias(comunidadeId) {
	return pool.query(
		'SELECT * FROM paginas_comunitarias WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function createPaginaComunitaria(dados) {
	return pool.query(
		'INSERT INTO paginas_comunitarias (comunidade_id, titulo, publica) VALUES ($1, $2, $3) RETURNING *',
		[dados.comunidade_id, dados.titulo, dados.publica]
	);
}

function editPaginaComunitaria(dados){
	return pool.query(
		'UPDATE paginas_comunitarias SET titulo = $1, publica = $2 WHERE comunidade_id = $3 AND pagina_comunitaria_id = $4 RETURNING *',
		[dados.titulo, dados.publica, dados.comunidade_id, dados.pagina_comunitaria_id]	
	);
}

function deletePaginaComunitaria(dados){
	return pool.query(
		'DELETE FROM paginas_comunitarias WHERE comunidade_id = $1 AND pagina_comunitaria_id = $2 RETURNING *',
		[dados.comunidade_id, dados.pagina_comunitaria_id]
	);
}

exports.getPaginasComunitarias = getPaginasComunitarias;
exports.createPaginaComunitaria = createPaginaComunitaria;
exports.editPaginaComunitaria = editPaginaComunitaria;
exports.deletePaginaComunitaria = deletePaginaComunitaria;