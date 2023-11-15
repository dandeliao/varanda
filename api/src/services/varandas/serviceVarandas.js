const dataVarandas = require('../../data/varandas/dataVarandas');
const fs = require('fs');
const path = require('path');
const staticPath = '../../../static';

exports.verVarandas = async function (bicho_id, comunitaria, aberta) {
	if (bicho_id !== null) {
		const varandaDoBicho = await dataVarandas.getVarandaDoBicho(bicho_id);
		return varandaDoBicho.rows[0];
	}
	const varandas = await dataVarandas.getVarandas(comunitaria, aberta);
	return varandas.rows;
};

exports.verVaranda = async function (varanda_id) {
	const varanda = await dataVarandas.getVaranda(varanda_id);
	return varanda.rows[0];
};

exports.criarVaranda = async function (bicho_id, comunitaria) {

	const novaVaranda = (await dataVarandas.createVaranda(bicho_id, comunitaria)).rows[0];
	console.log(novaVaranda);

	// cria pasta da varanda
	const pastaVaranda = path.join(path.resolve(__dirname, staticPath), 'varandas', 'em_uso', `${novaVaranda.varanda_id}`);
	if (!fs.existsSync(pastaVaranda)){
		fs.mkdirSync(pastaVaranda);
	}

	return novaVaranda;
};

exports.editarVaranda = async function (varanda_id, dados) {
	const varandaEditada = await dataVarandas.editVaranda(varanda_id, dados.aberta);
	return varandaEditada.rows[0];
};

exports.deletarVaranda = async function (varanda_id) {
	const varandaDeletada = (await dataVarandas.deletarVaranda(varanda_id)).rows[0];

	const pastaVaranda = path.join(path.resolve(__dirname, staticPath), 'varandas', 'em_uso', `${varandaDeletada.varanda_id}`);
	fs.rmdirSync(pastaVaranda, {recursive: true, force: true});

	return varandaDeletada;
};