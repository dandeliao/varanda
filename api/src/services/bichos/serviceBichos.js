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

exports.editarBicho = async function (bichoId, dados) {
	const bichoVelho = await dataBichos.getBicho(bichoId).rows[0];
	const bicho = {
		bicho_id: bichoId,
		nome: dados.nome ? dados.nome : bichoVelho.nome,
		descricao: dados.descricao ? dados.descricao : bichoVelho.descricao,
		avatar: dados.avatar ? dados.avatar : bichoVelho.avatar,
		descricao_avatar: dados.descricao_avatar ? dados.descricao_avatar : bichoVelho.descricao_avatar,
		fundo: dados.fundo ? dados.fundo : bichoVelho.fundo,
		descricao_fundo: dados.descricao_fundo ? dados.descricao_fundo : bichoVelho.descricao_fundo,
	};
	const bichoNovo = await dataBichos.putBicho(bicho);
	return bichoNovo.rows[0];
};

exports.subirAvatar = async function (bichoId, arquivo) {
	const caminhoTemporario = arquivo.path;
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', bichoId);
	const nomeArquivo = `avatar.${path.extname(arquivo.originalname).toLowerCase()}`;
	const caminhoDestino = path.join(path.resolve(diretorioDestino, nomeArquivo));

	fs.rename(caminhoTemporario, caminhoDestino, err => {
		if (err) return null;
	});

	return {nome: nomeArquivo};
};

exports.subirFundo = async function (bichoId, arquivo) {
	const caminhoTemporario = arquivo.path;
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', bichoId);
	const nomeArquivo = `fundo.${path.extname(arquivo.originalname).toLowerCase()}`;
	const caminhoDestino = path.join(path.resolve(diretorioDestino, nomeArquivo));

	fs.rename(caminhoTemporario, caminhoDestino, err => {
		if (err) return null;
	});

	return {nome: nomeArquivo};
};