const pool = require('../../config/database');

exports.getArquivos = function () {
	return pool.query(
		'SELECT * FROM arquivos'
	);
};

exports.getArquivo = function(artefatoId) {
	return pool.query(
		'SELECT * FROM arquivos WHERE artefato_id = $1',
		[artefatoId]
	);
};

exports.getArquivosNaVaranda = function(varandaContextoId) {
	return pool.query(
		'SELECT * FROM arquivos WHERE varanda_contexto_id = $1',
		[varandaContextoId]
	);
};

exports.getArquivosDoBicho = function(bichoCriadorId) {
	return pool.query(
		'SELECT * FROM arquivos WHERE bicho_criador_id = $1',
		[bichoCriadorId]
	);
};

exports.postArquivo = function(arquivo) {
	return pool.query(
		'INSERT INTO arquivos (nome_arquivo, descricao, varanda_contexto_id, bicho_criador_id, em_resposta_a_id, sensivel, aviso_de_conteudo, publico, indexavel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
		[arquivo.nome_arquivo, arquivo.descricao, arquivo.varanda_contexto_id, arquivo.bicho_criador_id, arquivo.em_resposta_a_id, arquivo.sensivel, arquivo.aviso_de_conteudo, arquivo.publico, arquivo.indexavel]
	);
};

exports.deleteArquivo = function(artefatoId) {
	return pool.query(
		'DELETE FROM arquivos WHERE artefato_id = $1',
		[artefatoId]
	);
};