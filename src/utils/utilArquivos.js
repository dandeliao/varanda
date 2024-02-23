const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pastaViews 	= `../views`;

exports.editarArquivoHandlebars = (varanda_id, paginaNova, paginaOriginal = null) => {
    
    // se o título da página mudou, deleta o arquivo handlebars atual (para depois criar um novo arquivo com o nome correspondente ao novo título)
    if (paginaOriginal) {
        if (paginaNova.titulo !== paginaOriginal.titulo) {
            const caminhoOriginal = path.join(path.resolve(__dirname, pastaViews), 'varandas', `${varanda_id}`, `${encodeURIComponent(paginaOriginal.titulo)}.handlebars`);
            fs.unlink(caminhoOriginal, (erro) => {
                if (erro) {
                    if (erro.code !== 'ENOENT') { // se o arquivo não foi encontrado, ignora
                        throw erro;
                    }
                }
            });
        }    
    }

    // edita ou cria o arquivo handlebars
    const conteudo = paginaNova.handlebars ? paginaNova.handlebars : '';
    const caminho = path.join(path.resolve(__dirname, pastaViews), 'varandas', `${varanda_id}`, `${encodeURIComponent(paginaNova.titulo)}.handlebars`);
	fs.writeFile(caminho, conteudo, erro => {
		if (erro) {
			throw erro;
		}
	});

    return caminho;
};

exports.deletarArquivoHandlebars = (varanda_id, nome_arquivo) => {
    const caminho = path.join(path.resolve(__dirname, pastaViews), 'varandas', `${varanda_id}` `${nome_arquivo}.handlebars`);
	fs.unlink(caminho, (erro) => {
		if (erro) {
			if (erro.code !== 'ENOENT') { // se o arquivo não foi encontrado, ignora
				throw erro;
			}
		}
	});
}

exports.htmlParaHandlebars = (html) => {
    return html;
};

exports.handlebarsParaHtml = (handlebars) => {

};