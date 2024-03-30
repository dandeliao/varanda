const pool = require('../../config/database');

exports.getEdicoesArtefato = function (artefatoId) {
	return pool.query(
		'SELECT * FROM edicoes_artefatos WHERE artefato_id = $1',
        [artefatoId]
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
		'INSERT INTO edicoes_artefatos (artefato_id, pagina_vid, bicho_editor_id, descricao, titulo, texto, sensivel, respondivel, indexavel, mutirao, denuncia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
		[artefato.artefato_id, artefato.pagina_vid, artefato.bicho_editor_id, artefato.descricao, artefato.titulo, artefato.texto, artefato.sensivel, artefato.respondivel, artefato.indexavel, artefato.mutirao, artefato.denuncia]
	);
};