const dataBichos = require('../../data/bichos/dataBichos');
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.verBichos = async function () {
	const dataBichos = await dataBichos.getBichos();
	return dataBichos.rows;
};

exports.verBicho = async function (bichoId) {
	const dataBicho = await dataBichos.getBicho(bichoId);
	if (dataBicho.rowCount === 0) return null;
	return dataBicho.rows[0];
};

exports.editarBicho = async function (dados, caminhoAvatar, caminhoFundo) {

	const dataBicho = await dataBichos.putBicho(dados);
	if (dataBicho.rowCount !== 0) {
		const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${dados.bicho_id}`);
		if (caminhoAvatar) {
			fs.copyFileSync(path.join(caminhoAvatar), path.join(pastaBicho, 'avatar.jpg'));
		}
		if (caminhoFundo) {
			fs.copyFileSync(path.join(caminhoFundo), path.join(pastaBicho, 'fundo.jpg'));
		}
	} else {
		throw new Error('bicho não encontrado');
	}

	return dataBicho.rows[0];

};