const dataPessoas = require('../../data/bichos/dataPessoas');
const geraHashESalt = require('../../utils/utilPassword').geraHashESalt;
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.verPessoas = async function() {
	const pessoas = await dataPessoas.getPessoas();
	return pessoas.rows;
};

exports.verPessoa = async function(pessoa_id) {
	const pessoa = await dataPessoas.getPessoa(pessoa_id);
	return pessoa.rows[0];
};

exports.registrarPessoa = async function (dados) {
	
	let bicho = {
		bicho_id: dados.bicho_id,
		nome: dados.nome ? dados.nome : dados.bicho_id,
		descricao: dados.descricao ? dados.descricao : `Oi! Me chamo ${dados.nome ? dados.nome : dados.bicho_id} e esta é a minha varanda.`
	};
	const saltHash = geraHashESalt(dados.senha);
	const segredos = {
		email: dados.email,
		hash: saltHash.hash,
		salt: saltHash.salt
	};

	// cria pasta do bicho
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${bicho.bicho_id}`);
	if (!fs.existsSync(pastaBicho)){
		fs.mkdirSync(pastaBicho);
	}

	const novaPessoa = dataPessoas.postPessoa(bicho, segredos);
	return novaPessoa.rows[0];
};

exports.editarPessoa = async function (pessoa_id, dados) {
	const pessoaVelha = (await dataPessoas.getPessoa(pessoa_id)).rows[0];
	const novosDados = {
		bicho_id: pessoa_id,
		nome: dados.nome ? dados.nome : pessoaVelha.nome,
		descricao: dados.descricao ? dados.descricao : pessoaVelha.descricao,
		avatar: dados.avatar ? dados.avatar : pessoaVelha.avatar,
		descricao_avatar: dados.descricao_avatar ? dados.descricao_avatar : pessoaVelha.descricao_avatar,
		fundo: dados.fundo ? dados.fundo : pessoaVelha.fundo,
		descricao_fundo: dados.descricao_fundo ? dados.descricao_fundo : pessoaVelha.descricao_fundo,
	};
	const pessoaEditada = await dataPessoas.putPessoa(novosDados);
	return pessoaEditada.rows[0];
};

exports.editarSegredos = async function (pessoa_id, dados) {
	const emailVelho = (await dataPessoas.getEmail(pessoa_id)).rows[0];
	let saltHash = (await dataPessoas.getHashSalt(pessoa_id)).rows[0];
	if (dados.senha) {
		saltHash = geraHashESalt(dados.senha);
	}
	const segredos = {
		email: dados.email ? dados.email : emailVelho,
		hash: saltHash.hash,
		salt: saltHash.salt
	};
	const pessoaEditada = await dataPessoas.putSegredos(pessoa_id, segredos);
	return pessoaEditada.rows[0];
};

exports.deletarPessoa = async function (pessoa_id) {
	const pessoaDeletada = await dataPessoas.deletePessoa(pessoa_id);
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${pessoaDeletada.bicho_id}`);
	if (fs.existsSync(pastaBicho)){
		fs.rmSync(pastaBicho, { recursive: true, force: true });
	}
	return pessoaDeletada.rows[0];
};