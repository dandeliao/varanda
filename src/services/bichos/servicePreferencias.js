const dataPreferencias = require('../../data/bichos/dataPreferencias');
require('dotenv').config();

exports.verPreferencias = async function (bichoId) {
	let bicho_id = bichoId;
	if (!bichoId) {
		bicho_id = process.env.INSTANCIA_ID;
	}
	const preferencias = await dataPreferencias.getPreferencias(bicho_id);
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