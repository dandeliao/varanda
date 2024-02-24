const randomGenerators = require('../../utils/utilRandomGenerators');

exports.gerarPaginaPadrao = async function (comunitaria) {
	let dadosPaginaPadrao;

	if (comunitaria) {
		// cria página padrão comunitária
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'inicio',
			html: `<div id="container">\n<div hx-get="/blocos/cartao-de-visita?bicho={{varanda.bicho_id}}" hx-trigger="load"></div>\n<br>\n<marquee>esta comunidade foi benzida com ${emoji} e está pronta para receber pessoas</marquee>\n</div>\n<style>\n#container {\ndisplay: block;\nmax-width: 960px;\nmargin: 0 auto;\ntext-align: center;\n}\n</style>`
		};
	} else {
		// cria página padrão pessoal
		let emoji = randomGenerators.geraEmoji();
		dadosPaginaPadrao = {
			titulo: 'inicio',
			html: `<div id="container">\n<div hx-get="/blocos/cartao-de-visita?bicho={{varanda.bicho_id}}" hx-trigger="load"></div>\n<br>\n<marquee>meu emoji da sorte é ${emoji}</marquee>\n</div>\n<style>\n#container {\ndisplay: block;\nmax-width: 960px;\nmargin: 0 auto;\ntext-align: center;\n}\n</style>`
		};
	}

	return dadosPaginaPadrao;

};