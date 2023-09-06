const dataPessoas = require('../../data/bichos/dataPessoas');
const dataBichos = require('../../data/bichos/dataBichos');
const geraHashESalt = require('../../utils/utilPassword').geraHashESalt;
const fs = require('fs');
const path = require('path');
const staticPath = '../../../static';

exports.verPessoas = async function() {
	const pessoas = await dataPessoas.getPessoas();
	return pessoas.rows;
};

exports.verPessoa = async function(pessoa_id) {
	const pessoa = await dataPessoas.getPessoa(pessoa_id);
	return pessoa.rows[0];
};

exports.verEmail = async function(pessoa_id) {
	const email = await dataPessoas.getEmail(pessoa_id);
	return email.rows[0].email;
};

exports.registrarPessoa = async function (dados) {
	let bicho = {
		bicho_id: dados.bicho_id,
		nome: dados.nome ? dados.nome : dados.bicho_id,
		descricao: dados.descricao ? dados.descricao : `Oi! Me chamo ${dados.nome ? dados.nome : dados.bicho_id}.`
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

	let novoBicho = (await dataBichos.postBicho(bicho)).rows[0];
	const novaPessoa = (await dataPessoas.postPessoa(bicho.bicho_id, segredos)).rows[0];

	novoBicho.email = novaPessoa.email;

	return novoBicho;
};

exports.editarSegredos = async function (bicho_id, dados) {
	const emailVelho = (await dataPessoas.getEmail(bicho_id)).rows[0].email;
	console.log('emailVelho:', emailVelho);
	let saltHash = (await dataPessoas.getHashSalt(bicho_id)).rows[0];
	if (dados.senha) {
		saltHash = geraHashESalt(dados.senha);
	}
	const segredos = {
		email: dados.email ? dados.email : emailVelho,
		hash: saltHash.hash,
		salt: saltHash.salt
	};
	const pessoaEditada = await dataPessoas.putPessoa(bicho_id, segredos);
	console.log('pessoaEditada:', pessoaEditada);
	console.log('rows[0]:', pessoaEditada.rows[0]);
	return pessoaEditada.rows[0];
};

exports.deletarPessoa = async function (pessoa_id) {
	const pessoaDeletada = (await dataBichos.deleteBicho(pessoa_id)).rows[0];
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${pessoaDeletada.bicho_id}`);
	if (fs.existsSync(pastaBicho)){
		fs.rmSync(pastaBicho, { recursive: true, force: true });
	}
	return pessoaDeletada;
};