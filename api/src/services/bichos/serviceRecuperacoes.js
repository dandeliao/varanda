const dataRecuperacoes = require('../../data/bichos/dataRecuperacoes');

exports.verRecuperacao = async function(pessoa_id) {
	const recuperacao = await dataRecuperacoes.getRecuperacao(pessoa_id);
	return recuperacao ? recuperacao.rows[0] : false;
};

exports.criarRecuperacao = async function(pessoa_id) {
	const recuperacao = await dataRecuperacoes.postRecuperacao(pessoa_id);
	return recuperacao.rows[0];
};

exports.deletarRecuperacao = async function(recuperacao_id) {
	const recuperacao = await dataRecuperacoes.deleteRecuperacao(recuperacao_id);
	return recuperacao.rows[0];
};