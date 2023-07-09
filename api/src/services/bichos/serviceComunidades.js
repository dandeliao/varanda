const dataComunidades = require('../../data/bichos/dataComunidades');
const dataBichos = require('../../data/bichos/dataBichos');
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.verComunidade = async function (comunidade_id) {
	const comunidade = await dataComunidades.getComunidade(comunidade_id);
	return comunidade.rows[0];
};

exports.criarComunidade = async function (dados) {

	const bichoExistente = await dataBichos.getBicho(dados.bicho_id);
	if (bichoExistente.rowCount !== 0) throw new Error('Bicho já existe.');

	const comunidade = {
		bicho_id: dados.bicho_id,
		nome: dados.nome ? dados.nome : dados.bicho_id,
		descricao: dados.descricao ? dados.descricao : `Oi! Bem-vinde à varanda da comunidade ${dados.nome ? dados.nome : dados.bicho_id}.`,
		bicho_criador_id: dados.bicho_criador_id
	};

	// cria pasta do bicho
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${comunidade.bicho_id}`);
	if (!fs.existsSync(pastaBicho)){
		fs.mkdirSync(pastaBicho);
	}

	return await dataComunidades.postComunidade(comunidade).rows[0];

};