const dataPessoas = require('../../data/bichos/dataPessoas');
const dataBichos = require('../../data/bichos/dataBichos');
const dataBichosPadrao = require('../../data/bichos/dataBichosPadrao');
const geraHashESalt = require('../../utils/utilPassword').geraHashESalt;
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.registrarPessoa = async function (dados) {
	
	const bichoExistente = await dataBichos.getBicho(dados.bicho_id);
	if (bichoExistente.rowCount !== 0) throw new Error('bicho já existe');
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

	// sorteia um bicho padrão e copia os campos para o novo bicho
	const bichosPadrao = await dataBichosPadrao.getBichosPadrao().rows;
	let sorteio = Math.floor(Math.random() * (bichosPadrao.length));
	const padraoSorteado = bichosPadrao(sorteio);
	Object.assign(bicho, padraoSorteado);

	// cria pasta do bicho
	const pastaBicho = path.join(path.resolve(__dirname, staticPath), 'bichos', 'em_uso', `${dados.bicho_id}`);
	if (!fs.existsSync(pastaBicho)){
		fs.mkdirSync(pastaBicho);
	}

	// copia avatar padrão e fundo padrão para a pasta do bicho
	const pastaPadraoAvatar = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'avatar');
	const pastaPadraoFundo = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'fundo');
	fs.copyFileSync(path.join(pastaPadraoAvatar, `${sorteio}.jpg`), path.join(pastaBicho, 'avatar.jpg'));
	fs.copyFileSync(path.join(pastaPadraoFundo, `${sorteio}.jpg`), path.join(pastaBicho, 'fundo.jpg'));

	return await dataPessoas.postPessoa(bicho, segredos);

};

/* exports.gerarPaginaPadrao = async function () {

	// cria página pessoal padrão
	let benjor = utilRandomGenerator.geraBenJor();
	const dadosPaginaPadrao = {
		titulo: 'Sobre mim',
		publica: false,
		html: `
		<div id="container">

		<v-cartao-de-visita></v-cartao-de-visita>
		<br>
		<v-bloco>
		<h2>Comunidades:</h2>
		<v-comunidades></v-comunidades>
		</v-bloco>
		<br>
		<marquee>"${benjor}" - Jorge Ben Jor</marquee>

		</div>
		
		<style>

		#container {
			display: block;
			max-width: 960px;
			margin: 0 auto;
			text-align: center;
		}

		</style>
		`
	};

	await servicePaginasPessoais.createPaginaPessoal(dadosPaginaPadrao);

	// cadastra pessoa na comunidade varanda
	await dataPessoasComunidades.postPessoaComunidade(arrayNovaPessoa.rows[0].pessoa_id, 'varanda', {ver: true, participar: true, editar: false, moderar: false, cuidar: false});

	return arrayNovaPessoa.rows[0];

	return dadosPaginaPadrao;

}; */