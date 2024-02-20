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

exports.getArtefatosNaVaranda = function(varandaContextoId) {
	return pool.query(
		'SELECT * FROM artefatos WHERE varanda_contexto_id = $1',
		[varandaContextoId]
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
		'INSERT INTO artefatos (varanda_contexto_id, bicho_criador_id, em_resposta_a_id, sensivel, aviso_de_conteudo, publico, indexavel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
		[artefato.varanda_contexto_id, artefato.bicho_criador_id, artefato.em_resposta_a_id, artefato.sensivel, artefato.aviso_de_conteudo, artefato.publico, artefato.indexavel]
	);
};

exports.deleteArtefato = function(artefatoId) {
	return pool.query(
		'DELETE FROM artefatos WHERE artefato_id = $1',
		[artefatoId]
	);
};