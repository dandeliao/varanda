const fs = require('fs');
const path = require('path');
const { vidParaId } = require('./utilParsers');
require('dotenv').config();
const pastaViews 	= `../views`;

exports.editarArquivoHandlebars = (varanda_id, pagina) => {
    
    // edita ou cria o arquivo handlebars
    const conteudo = pagina.handlebars ? pagina.handlebars : '';
    const caminho = path.join(path.resolve(__dirname, pastaViews), 'varandas', `${varanda_id}`, `${vidParaId(pagina.pagina_vid)}.handlebars`);
	fs.writeFile(caminho, conteudo, erro => {
		if (erro) {
			throw erro;
		}
	});

    return caminho;
};

exports.deletarArquivoHandlebars = (varanda_id, nome_arquivo) => {
    const caminho = path.join(path.resolve(__dirname, pastaViews), 'varandas', `${varanda_id}`, `${nome_arquivo}.handlebars`);
	fs.unlink(caminho, (erro) => {
		if (erro) {
			if (erro.code !== 'ENOENT') { // se o arquivo não foi encontrado, ignora
				throw erro;
			}
		}
	});
}