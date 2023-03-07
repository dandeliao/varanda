const pool = require('../../../config/database');

function getPaginasPessoais(pessoaId) {
	return pool.query(
		'SELECT * FROM paginas_pessoais WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function createPaginaPessoal(dados) {
	return pool.query(
		'INSERT INTO paginas_pessoais (pessoa_id, titulo, publica) VALUES ($1, $2, $3) RETURNING pessoa_id, pagina_pessoal_id, titulo, publica, criacao',
		[dados.pessoa_id, dados.titulo, dados.publica]
	);
}

function editPaginaPessoal(dados){
	return pool.query(
		'UPDATE paginas_pessoais SET titulo = $1, publica = $2 WHERE pessoa_id = $3 AND pagina_pessoal_id = $4 RETURNING pessoa_id, pagina_pessoal_id, titulo, publica, criacao',
		[dados.titulo, dados.publica, dados.pessoa_id, dados.pagina_pessoal_id]	
	);
}

function deletePaginaPessoal(dados){
	return pool.query(
		'DELETE FROM paginas_pessoais WHERE pessoa_id = $1 AND pagina_pessoal_id = $2 RETURNING pessoa_id, pagina_pessoal_id, titulo, publica, criacao',
		[dados.pessoa_id, dados.pagina_pessoal_id]
	);
}

exports.getPaginasPessoais = getPaginasPessoais;
exports.createPaginaPessoal = createPaginaPessoal;
exports.editPaginaPessoal = editPaginaPessoal;
exports.deletePaginaPessoal = deletePaginaPessoal;