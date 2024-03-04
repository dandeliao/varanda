const randomGenerators = require('../../utils/utilRandomGenerators');

exports.gerarPaginaPadrao = async function (comunitaria) {
	let dadosPaginaPadrao;

	if (comunitaria) {
		// cria página padrão comunitária
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'inicio',
			html: `<div class="pagina">
  <v-cartao-de-visita />
  <br>
  <div class="bloco">
    <p>esta comunidade foi benzida com ${emoji} e está pronta para receber pessoas</p>
  </div>
</div>`
		};
	} else {
		// cria página padrão pessoal
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'inicio',
			html: `<div class="pagina">
  <v-cartao-de-visita />
  <br>
  <div class="bloco">
    <p>meu emoji da sorte é ${emoji}</p>
  </div>
</div>`
		};
	}

	return dadosPaginaPadrao;

};