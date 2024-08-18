const dataPreferencias = require('../../data/bichos/dataPreferencias');

exports.verPreferencias = async function (bichoId) {
	const preferencias = await dataPreferencias.getPreferencias(bichoId);
	return preferencias.rows[0];
};

exports.criarPreferencias = async function (bichoId, prefs) { // preferencias é um objeto { tema_id: <integer> }
	const preferencias = await dataPreferencias.postPreferencias(bichoId, prefs);
	return preferencias.rows[0];
};

exports.editarPreferencias = async function (bichoId, prefs) {
	const preferencias = await dataPreferencias.putPreferencias(bichoId, prefs);
	return preferencias.rows[0];
};