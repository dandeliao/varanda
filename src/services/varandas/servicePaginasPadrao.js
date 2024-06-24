const randomGenerators = require('../../utils/utilRandomGenerators');

exports.gerarPaginaPadrao = async function (comunitaria) {
	let dadosPaginaPadrao;

	if (comunitaria) {
		// cria página padrão comunitária
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'Início',
			comunitaria: true,
			html: `<div class="pagina">
  <v-cartao-de-visita/>
  <v-paginas/>
  <v-artefatos dado-novidades />
</div>`
		};
	} else {
		// cria página padrão pessoal
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'Início',
			html: `<div class="pagina">
  <v-cartao-de-visita/>
  <v-paginas/>
  <div class="bloco">
    <p>meu emoji da sorte é ${emoji}</p>
  </div>
</div>`
		};
	}

	return dadosPaginaPadrao;

};

exports.gerarPaginaTematica = async function (tema, comunitaria) {
	return {
		titulo: tema,
		comunitaria: comunitaria,
		html: `<v-cabecalho/>
<div class="pagina">
  <v-titulo/>
  <v-artefatos/>
</div>`
	};
}