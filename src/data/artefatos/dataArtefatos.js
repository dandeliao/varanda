const pool = require('../../config/database');

exports.getArtefatos = function () {
	return pool.query(
		'SELECT * FROM artefatos'
	);
};

exports.getArtefato = function(artefatoPid) {
	return pool.query(
		'SELECT * FROM artefatos WHERE artefato_pid = $1',
		[artefatoPid]
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
		'INSERT INTO artefatos (artefato_pid, varanda_id, pagina_vid, bicho_criador_id, em_resposta_a_id, nome_arquivo, extensao, titulo, texto, sensivel, respondivel, publico, indexavel, denuncia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
		[artefato.artefato_pid, artefato.varanda_id, artefato.pagina_id, artefato.bicho_criador_id, artefato.em_resposta_a_id, artefato.nome_arquivo, artefato.extensao, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.publico, artefato.indexavel, artefato.denuncia]
	);
};

exports.putArtefato = function(artefato) {
	return pool.query(
		'UPDATE artefatos SET pagina_vid = $1, titulo = $2, texto = $3, sensivel = $4, respondivel = $5, publico = $6, indexavel = $7, denuncia = $8 WHERE artefato_pid = $9 RETURNING *',
		[artefato.pagina_vid, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.publico, artefato.indexavel, artefato.denuncia, artefato.artefato_pid]
	);
};

exports.deleteArtefato = function(artefatoPid) {
	return pool.query(
		'DELETE FROM artefatos WHERE artefato_pid = $1',
		[artefatoPid]
	);
};