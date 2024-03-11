const pool = require('../../config/database');

exports.getEdicoesArtefato = function (artefatoPid) {
	return pool.query(
		'SELECT * FROM edicoes_artefatos WHERE artefato_pid = $1',
        [artefatoPid]
	);
};

exports.getEdicaoArtefato = function(edicaoArtefatoId) {
	return pool.query(
		'SELECT * FROM edicoes_artefatos WHERE edicao_artefato_id = $1',
		[edicaoArtefatoId]
	);
};

exports.postEdicaoArtefato = function(artefato) {
	return pool.query(
		'INSERT INTO edicoes_artefatos (artefato_pid, pagina_contexto_id, bicho_editor_id, titulo, texto, sensivel, respondivel, publico, indexavel, denuncia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
		[artefato.artefato_pid, artefato.pagina_contexto_id, artefato.bicho_editor_id, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.publico, artefato.indexavel, artefato.denuncia]
	);
};