// Este trabalho vai para o controlador (novo bicho)

/* Object.assign(bicho, padraoSorteado); */

// Este trabalho vai em parte para o controlador (novo bicho)
// e em parte já foi para o serviço de editar bicho e para o servico de bichos padrao

/* // copia avatar padrão e fundo padrão para a pasta do bicho
const pastaPadraoAvatar = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'avatar');
const pastaPadraoFundo = path.join(path.resolve(__dirname, staticPath), 'bichos', 'padrao', 'fundo');
fs.copyFileSync(path.join(pastaPadraoAvatar, `${sorteio}.jpg`), path.join(pastaBicho, 'avatar.jpg'));
fs.copyFileSync(path.join(pastaPadraoFundo, `${sorteio}.jpg`), path.join(pastaBicho, 'fundo.jpg')); */

// Este trabalho vai em parte para o controlador (nova página)
// e em parte para o serviço de criar página, na pasta varandas
// e em parte para o serviço de pertencimentos

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