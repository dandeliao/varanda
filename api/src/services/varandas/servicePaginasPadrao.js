const randomGenerators = require('../../utils/utilRandomGenerators');

exports.gerarPaginaPadrao = async function (comunitaria) {
	let dadosPaginaPadrao;

	if (comunitaria) {
		// cria página padrão comunitária
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'Início',
			publica: false,
			html: `
			<div id="container">

			<v-cartao-de-visita></v-cartao-de-visita>
			<br>
			<v-bloco>
			<h2>Participantes:</h2>
			<v-participantes></v-participantes>
			</v-bloco>
			<br>
			<marquee>esta comunidade foi benzida com ${emoji} e está pronta para receber pessoas</marquee>

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
	} else {
		// cria página padrão pessoal
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'Início',
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
			<marquee>meu emoji da sorte é ${emoji}</marquee>

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
	}

	

	return dadosPaginaPadrao;

};