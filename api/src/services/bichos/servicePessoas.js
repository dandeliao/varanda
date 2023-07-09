const dataPessoas = require('../../data/bichos/dataPessoas');
const geraHashESalt = require('../../utils/utilPassword').geraHashESalt;
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

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

	return await dataPessoas.postPessoa(bicho, segredos).rows[0];

};