const fs = require('fs');
const path = require('path');
const { vidParaId } = require('./utilParsers');
require('dotenv').config();
const pastaTemas 	= '../../public/temas'
const pastaViews 	= `../views`;
const pastaUsuaries = `../../${process.env.CONTENT_FOLDER}`


exports.separaExtensao = (nomeOriginal) => {
	const posicaoUltimoPonto = nomeOriginal.lastIndexOf('.');
	const arquivo = nomeOriginal.slice(0, posicaoUltimoPonto);
	const extensao = nomeOriginal.slice(posicaoUltimoPonto + 1);
	return [arquivo, extensao];
};

exports.tipoDeArquivo = (extensao) => {
	let tipo;
	if (['jpg','jpeg','gif','png','svg','bmp','webp'].includes(extensao)) 											tipo = 'imagem';
	if (['mp3','opus','wav','aac','flac','3gp','aiff','m4a','ogg','oga','mog','wma'].includes(extensao))	tipo = 'audio';
	if (['webm','mkv','ogv','avi','mov','wmv','rmvb','mp4','m4v','mpg','mpeg','mpv'].includes(extensao))	tipo = 'video';
	return tipo;
}

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

exports.editarArquivoTema = (tema_id, nome, conteudo) => {

	// edita ou cria o arquivo css do tema
	const caminho = path.join(path.resolve(__dirname, pastaTemas), `${tema_id}-${nome}.css`);
	fs.writeFile(caminho, conteudo, erro => {
		if (erro) {
			throw erro;
		}
	});

	return caminho;
}

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

exports.deletarArquivoArtefato = (artefato) => {
	const caminho = path.join(path.resolve(__dirname, pastaUsuaries), 'artefatos', 'em_uso', artefato.pagina_vid, `${artefato.nome_arquivo}.${artefato.extensao}`);
	fs.unlink(caminho, (erro) => {
		if (erro) {
			if (erro.code !== 'ENOENT') { // se o arquivo não foi encontrado, ignora
				throw erro;
			}
		}
	});
}