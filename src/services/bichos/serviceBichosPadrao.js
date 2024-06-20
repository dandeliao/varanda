const dataBichosPadrao = require('../../data/bichos/dataBichosPadrao');
const path = require('path');
require('dotenv').config();
const staticPath = `../../../${process.env.CONTENT_FOLDER}`;

exports.sortearBichoPadrao = async function () {
	const bichosPadrao = (await dataBichosPadrao.getBichosPadrao()).rows;
	let sorteio = Math.floor(Math.random() * (bichosPadrao.length));
	return bichosPadrao[sorteio];
};

exports.criarBichosPadrao = async function () {
	for (let i = 0; i < process.env.NUMERO_DE_BICHOS_PADRAO; i++) {
		await dataBichosPadrao.postBichoPadrao(`${i + 1}.jpg`, 'ilustração de um gato', `${i + 1}.jpg`, 'ilustração de padrão repetido');
	}
	return;
}

exports.caminhoAvatarPadrao = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'avatar');
exports.caminhoFundoPadrao = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'fundo');