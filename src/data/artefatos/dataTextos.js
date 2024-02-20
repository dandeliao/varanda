const pool = require('../../config/database');

exports.getTextos = function () {
	return pool.query(
		'SELECT * FROM textos'
	);
};

exports.getTexto = function(artefatoId) {
	return pool.query(
		'SELECT * FROM textos WHERE artefato_id = $1',
		[artefatoId]
	);
};

exports.getTextosNaVaranda = function(varandaContextoId) {
	return pool.query(
		'SELECT * FROM textos WHERE varanda_contexto_id = $1',
		[varandaContextoId]
	);
};

exports.getTextosDoBicho = function(bichoCriadorId) {
	return pool.query(
		'SELECT * FROM textos WHERE bicho_criador_id = $1',
		[bichoCriadorId]
	);
};

exports.postTexto = function(texto) {
	return pool.query(
		'INSERT INTO textos (titulo, texto, varanda_contexto_id, bicho_criador_id, em_resposta_a_id, sensivel, aviso_de_conteudo, publico, indexavel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
		[texto.titulo, texto.texto, texto.varanda_contexto_id, texto.bicho_criador_id, texto.em_resposta_a_id, texto.sensivel, texto.aviso_de_conteudo, texto.publico, texto.indexavel]
	);
};

exports.deleteTexto = function(artefatoId) {
	return pool.query(
		'DELETE FROM textos WHERE artefato_id = $1',
		[artefatoId]
	);
};