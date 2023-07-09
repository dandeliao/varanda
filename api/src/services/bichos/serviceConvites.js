const dataConvites = require ('../../data/bichos/dataConvites');

exports.verConvite = async function (conviteId) {
	const convite = await dataConvites.getConvite(conviteId);
	return convite.rows[0];
};