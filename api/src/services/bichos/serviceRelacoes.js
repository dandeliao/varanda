const dataRelacoes = require('../../data/bichos/dataRelacoes');

exports.verBichosNaComunidade = async function (comunidadeId) {
	const bichosNaComunidade = await dataRelacoes.getBichosNaComunidade(comunidadeId);
	return bichosNaComunidade.rows;
};

exports.verComunidadesDoBicho = async function (bichoId) {
	const comunidadesDoBicho = await dataRelacoes.getComunidadesDoBicho(bichoId);
	return comunidadesDoBicho.rows;
};

exports.verRelacao = async function (bichoId, comunidadeId) {
	const relacao = await dataRelacoes.getRelacao(bichoId, comunidadeId);
	return relacao.rows[0];
};

exports.criarRelacao = async function (bichoId, comunidadeId, habilidades) { // habilidades é um objeto {participar: true | false, editar: true | false, moderar: true | false, representar: true | false}
	const relacao = await dataRelacoes.postRelacao(bichoId, comunidadeId, habilidades);
	return relacao.rows[0];
};

exports.editarRelacao = async function (bichoId, comunidadeId, habilidades) {
	const relacao = await dataRelacoes.putRelacao(bichoId, comunidadeId, habilidades);
	return relacao.rows[0];
};

exports.deletarRelacao = async function (bichoId, comunidadeId) {
	const relacao = await dataRelacoes.deleteRelacao(bichoId, comunidadeId);
	return relacao.rows[0];
};