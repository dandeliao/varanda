const dataComunidades = require('../../data/bichos/dataComunidades');
const dataBichos = require('../../data/bichos/dataBichos');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const staticPath = `../../../${process.env.CONTENT_FOLDER}`;

exports.verComunidades = async function () {
	const comunidades = await dataComunidades.getComunidades();
	return comunidades.rows;
};

exports.verComunidade = async function (comunidade_id) {
	const comunidade = await dataComunidades.getComunidade(comunidade_id);
	return comunidade.rows[0];
};

exports.criarComunidade = async function (dados, bichoCriadorId) {

	const bichoExistente = await dataBichos.getBicho(dados.bicho_id);
	if (bichoExistente.rowCount !== 0) throw new Error('Bicho já existe.');

	const bicho = {
		bicho_id: dados.bicho_id,
		nome: dados.nome ? dados.nome : dados.bicho_id,
		descricao: dados.descricao ? dados.descricao : `Oi! Bem-vinde à comunidade ${dados.nome ? dados.nome : dados.bicho_id}.`
	};

	// cria pasta da comunidade
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${bicho.bicho_id}`);
	if (!fs.existsSync(pastaBicho)){
		fs.mkdirSync(pastaBicho);
	}

	let novoBicho = (await dataBichos.postBicho(bicho)).rows[0];
	console.log(novoBicho);
	const novaComunidade = (await dataComunidades.postComunidade(dados.bicho_id, bichoCriadorId)).rows[0];
	console.log(novaComunidade);
	
	novoBicho.bicho_criador_id = novaComunidade.bicho_criador_id;
	novoBicho.participacao_livre = novaComunidade.participacao_livre;
	novoBicho.participacao_com_convite = novaComunidade.participacao_com_convite;
	novoBicho.periodo_geracao_convite = novaComunidade.periodo_geracao_convite;

	return novoBicho;
};

exports.editarComunidade = async function (comunidade_id, dados) {
	console.log('entrou em service editarComunidade');
	console.log(dados);
	const comunidade = (await dataComunidades.getComunidade(comunidade_id)).rows[0];
	console.log(comunidade);
	const novosDados = {
		bicho_id: comunidade_id,
		participacao_livre: dados.participacao_livre != null ? dados.participacao_livre : comunidade.participacao_livre,
		participacao_com_convite: dados.participacao_com_convite != null ? dados.participacao_com_convite : comunidade.participacao_com_convite,
		periodo_geracao_convite: dados.periodo_geracao_convite ? dados.periodo_geracao_convite : comunidade.periodo_geracao_convite
	};
	console.log(novosDados);
	const comunidadeEditada = await dataComunidades.putComunidade(novosDados);
	return comunidadeEditada.rows[0];
};

exports.deletarComunidade = async function (bicho_id) {
	const comunidadeDeletada = (await dataBichos.deleteBicho(bicho_id)).rows[0];
	// deleta pasta da comunidade
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${comunidadeDeletada.bicho_id}`);
	if (fs.existsSync(pastaBicho)){
		fs.rmSync(pastaBicho, { recursive: true, force: true });
	}
	return comunidadeDeletada;
};