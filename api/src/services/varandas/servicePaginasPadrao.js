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

	return dadosPaginaPadrao;

}; */