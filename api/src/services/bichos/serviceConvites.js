const dataConvites = require ('../../data/bichos/dataConvites');

exports.verConvite = async function (conviteId) {
	const convite = await dataConvites.getConvite(conviteId);
	return convite.rows[0];
};

exports.verConvitesParaComunidade = async function (comunidade_id) {
	const convites = await dataConvites.getConvitesParaComunidade(comunidade_id);
	return convites.rows;
};

exports.verConvitesCriadosPeloBicho = async function (bicho_criador_id) {
	const convites = await dataConvites.getConvitesDoBicho(bicho_criador_id);
	return convites.rows;
};

exports.criarConvite = async function (comunidade_id, bicho_criador_id) {
	const convite = await dataConvites.postConvite(bicho_criador_id, comunidade_id);
	return convite.rows[0];
};

exports.deletarConvite = async function (convite_id) {
	const convite = await dataConvites.deleteConvite(convite_id);
	return convite.rows[0];
};