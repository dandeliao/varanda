const pool = require('../../config/database');

exports.getArtefatos = function () {
	return pool.query(
		'SELECT * FROM artefatos'
	);
};

exports.getArtefato = function(artefatoId) {
	return pool.query(
		'SELECT * FROM artefatos WHERE artefato_id = $1',
		[artefatoId]
	);
};

exports.getArtefatosNaVaranda = function(varandaId) {
	return pool.query(
		'SELECT * FROM artefatos WHERE varanda_id = $1',
		[varandaId]
	);
};

exports.getArtefatosNaPagina = function(paginaVid) {
	return pool.query(
		'SELECT * FROM artefatos WHERE pagina_vid = $1',
		[paginaVid]
	);
};

exports.getArtefatosDoBicho = function(bichoCriadorId) {
	return pool.query(
		'SELECT * FROM artefatos WHERE bicho_criador_id = $1',
		[bichoCriadorId]
	);
};

exports.postArtefato = function(artefato) {
	return pool.query(
		'INSERT INTO artefatos (varanda_id, pagina_vid, bicho_criador_id, em_resposta_a_id, nome_arquivo, extensao, descricao, titulo, texto, sensivel, respondivel, indexavel, mutirao, denuncia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
		[artefato.varanda_id, artefato.pagina_vid, artefato.bicho_criador_id, artefato.em_resposta_a_id, artefato.nome_arquivo, artefato.extensao, artefato.descricao, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.indexavel, artefato.mutirao, artefato.denuncia]
	);
};

exports.putArtefato = function(artefato) {
	return pool.query(
		'UPDATE artefatos SET pagina_vid = $1, descricao = $2, titulo = $3, texto = $4, sensivel = $5, respondivel = $6, indexavel = $7, mutirao = $8, denuncia = $9 WHERE artefato_id = $10 RETURNING *',
		[artefato.pagina_vid, artefato.descricao, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.indexavel, artefato.mutirao, artefato.denuncia, artefato.artefato_id]
	);
};

exports.deleteArtefato = function(artefatoId) {
	return pool.query(
		'DELETE FROM artefatos WHERE artefato_id = $1 RETURNING *',
		[artefatoId]
	);
};