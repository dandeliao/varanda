const dataForuns = require('../data/dataForuns');

exports.getForuns = async function (comunidadeId) {
	let objetoForuns = await dataForuns.getForuns(comunidadeId);
	return objetoForuns.rows;
};

exports.postForum = async function (dados) {
	let objetoForum = await dataForuns.postForum(dados.comunidade_id, dados.forum_id);
	return objetoForum.rows[0];
};

exports.getTopicos = async function (forumId) {
	let objetoTopicos = await dataForuns.getTopicos(forumId);
	const sortedTopicos = objetoTopicos.rows.sort((a, b) => {
		return a.data_criacao - b.data_criacao;
	});
	return sortedTopicos;
};

exports.getTopico = async function (topicoId) {
	let objetoTopico = await dataForuns.getTopico(topicoId);
	return objetoTopico.rows[0];
};

exports.postTopico = async function (dados) {
	const dataResponse = await dataForuns.createTopico(dados);
	return dataResponse.rows[0];
};

exports.editTopico = async function (dados) {
	const objetoTopico = await dataForuns.editTopico(dados);
	if (objetoTopico.rowCount === 0) throw new Error('tópico não encontrado');
	return objetoTopico.rows[0];
};

exports.deleteTopico = async function (topicoId) {
	const dataResponse = await dataForuns.deleteTopico(topicoId);
	return dataResponse.rows[0];
};