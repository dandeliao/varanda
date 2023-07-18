const dataComunidades = require('../../data/bichos/dataComunidades');
const dataBichos = require('../../data/bichos/dataBichos');
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.verComunidades = async function () {
	const comunidades = await dataComunidades.getComunidades();
	return comunidades.rows;
};

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

	// cria pasta da comunidade
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${comunidade.bicho_id}`);
	if (!fs.existsSync(pastaBicho)){
		fs.mkdirSync(pastaBicho);
	}

	const novaComunidade = await dataComunidades.postComunidade(comunidade);
	return novaComunidade.rows[0];
};

exports.editarComunidade = async function (comunidade_id, dados) {
	const comunidade = await dataComunidades.getComunidade(comunidade_id).rows[0];
	const novosDados = {
		bicho_id: comunidade_id,
		participacao_livre: dados.participacao_livre ? dados.participacao_livre : comunidade.participacao_livre,
		participacao_com_convite: dados.participacao_com_convite ? dados.participacao_com_convite : comunidade.participacao_com_convite,
		periodo_geracao_convite: dados.periodo_geracao_convite ? dados.periodo_geracao_convite : comunidade.periodo_geracao_convite
	};
	const comunidadeEditada = await dataComunidades.putComunidade(novosDados);
	return comunidadeEditada.rows[0];
};

exports.deletarComunidade = async function (comunidade_id) {
	const comunidadeDeletada = await dataComunidades.deleteComunidade(comunidade_id);
	// deleta pasta da comunidade
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${comunidadeDeletada.bicho_id}`);
	if (fs.existsSync(pastaBicho)){
		fs.rmSync(pastaBicho, { recursive: true, force: true });
	}
	return comunidadeDeletada.rows[0];
};