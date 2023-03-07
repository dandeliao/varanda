const dataPessoas = require('../data/dataPessoas');
const dataAutenticacao = require('../data/dataAutenticacao');
const dataPessoasComunidades = require('../data/dataPessoasComunidades');
const servicePaginasPessoais = require('./servicePaginasPessoais');
const utilRandomGenerator = require('../utils/utilRandomGenerators');
const geraHashESalt = require('../utils/utilPassword').geraHashESalt;
const fs = require('fs');
const path = require('path');
const staticPath = '../../static';

exports.postRegistro = async function (dados) {
	const pessoaExistente = await dataPessoas.getPessoa(dados.pessoa_id);
	if (pessoaExistente.rowCount !== 0) throw new Error('pessoa já existe');
	const pessoa = {
		pessoa_id: dados.pessoa_id,
		nome: dados.nome,
		descricao: dados.descricao ? dados.descricao : 'Oi! Acabei de chegar na varanda!'
	};
	const saltHash = geraHashESalt(dados.senha);
	const segredos = {
		email: dados.email,
		hash: saltHash.hash,
		salt: saltHash.salt
	};
	
	const arrayNovaPessoa = await dataPessoas.postPessoa(pessoa);
	const pessoaId = arrayNovaPessoa.rows[0].pessoa_id;
	await dataAutenticacao.postSegredos(pessoaId, segredos);
	
	// cria pastas pessoais
	const pastaPessoal = path.join(path.resolve(__dirname, staticPath), 'pessoas', `${dados.pessoa_id}`);
	if (!fs.existsSync(pastaPessoal)){
		fs.mkdirSync(pastaPessoal);
	}
	if (!fs.existsSync(path.join(pastaPessoal, 'imagens'))){
		fs.mkdirSync(path.join(pastaPessoal, 'imagens'));
	}
	if (!fs.existsSync(path.join(pastaPessoal, 'paginas'))){
		fs.mkdirSync(path.join(pastaPessoal, 'paginas'));
	}
	if (!fs.existsSync(path.join(pastaPessoal, 'textos'))){
		fs.mkdirSync(path.join(pastaPessoal, 'textos'));
	}
	
	
	// sorteia e copia avatar padrão para pasta pessoal / imagens
	let pastaDefault = path.join(path.resolve(__dirname, staticPath), 'default', 'avatarPessoas');
	let numArquivos = fs.readdirSync(pastaDefault).length;
	let sorteio = Math.floor(Math.random() * (numArquivos));
	fs.copyFileSync(path.join(pastaDefault, `${sorteio}.jpg`), path.join(pastaPessoal, 'imagens', 'avatar.jpg'));

	// sorteia e copia fundo padrão para pasta pessoal / imagens
	pastaDefault = path.join(path.resolve(__dirname, staticPath), 'default', 'fundoPessoas');
	numArquivos = fs.readdirSync(pastaDefault).length;
	sorteio = Math.floor(Math.random() * (numArquivos));
	fs.copyFileSync(path.join(pastaDefault, `${sorteio}.jpg`), path.join(pastaPessoal, 'imagens', 'fundo.jpg'));

	// cria página pessoal padrão
	let benjor = utilRandomGenerator.geraBenJor();
	const dadosPaginaPadrao = {
		pessoa_id: pessoaId,
		titulo: 'sobre',
		publica: true,
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
};