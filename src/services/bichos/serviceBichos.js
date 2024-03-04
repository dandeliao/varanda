const dataBichos = require('../../data/bichos/dataBichos');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const staticPath = `../../../${process.env.CONTENT_FOLDER}`;
const caminhoBichos = '../../../user_content/bichos/em_uso';

exports.verBichos = async function () {
	const dados = await dataBichos.getBichos();
	return dados.rows;
};

exports.verBicho = async function (bichoId) {
	const dataBicho = await dataBichos.getBicho(bichoId);
	if (dataBicho.rowCount === 0) return null;
	return dataBicho.rows[0];
};

exports.editarBicho = async function (bichoId, dados) {
	const bichoVelho = (await dataBichos.getBicho(bichoId)).rows[0];
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
	const diretorioDestino = path.join(path.resolve(__dirname, caminhoBichos), bichoId);
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

exports.copiarAvatar = async function (bichoId, caminhoOriginal, nomeArquivo) {
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', bichoId);
	const caminhoDestino = path.join(path.resolve(diretorioDestino, nomeArquivo));

	fs.copyFileSync(caminhoOriginal, caminhoDestino);

	return {nome: nomeArquivo, diretorio: diretorioDestino};
};

exports.copiarFundo = async function (bichoId, caminhoOriginal, nomeArquivo) {
	const diretorioDestino = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', bichoId);
	const caminhoDestino = path.join(path.resolve(diretorioDestino, nomeArquivo));

	fs.copyFileSync(caminhoOriginal, caminhoDestino);

	return {nome: nomeArquivo, diretorio: diretorioDestino};
};

exports.deletarBicho = async function (bichoId) {
	const bichoDeletado = (await dataBichos.deleteBicho(bichoId)).rows[0];
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${bichoDeletado.bicho_id}`);
	if (fs.existsSync(pastaBicho)){
		fs.rmSync(pastaBicho, { recursive: true, force: true });
	}
	return bichoDeletado;
};