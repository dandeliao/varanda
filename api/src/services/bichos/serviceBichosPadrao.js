const dataBichosPadrao = require('../../data/bichos/dataBichosPadrao');
const path = require('path');
const staticPath = '../../static';

exports.sortearBichoPadrao = async function () {

	const bichosPadrao = await dataBichosPadrao.getBichosPadrao().rows;
	let sorteio = Math.floor(Math.random() * (bichosPadrao.length));
	return bichosPadrao[sorteio];

};

exports.caminhoAvatarPadrao = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'avatar');
exports.caminhoFundoPadrao = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'fundo');