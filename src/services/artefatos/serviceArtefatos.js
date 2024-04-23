const dataArtefatos = require('../../data/artefatos/dataArtefatos');
const caminhoArtefatos = '../../../user_content/artefatos/em_uso';
const fs = require('fs');
const path = require('path');

exports.verArtefato = async function(artefato_id) {
    let resposta = null;
	if (artefato_id !== null) {
		if (/^(0|[1-9][0-9]*)$/.test(artefato_id)) { // se artefato_id for um número inteiro
			const artefato = await dataArtefatos.getArtefato(artefato_id);
			resposta = artefato.rows[0];
		}
	}
    return resposta;
};

exports.criarArtefato = async function(artefato) {
	const artefatoCriado = await dataArtefatos.postArtefato(artefato);
	return artefatoCriado.rows[0];
};

exports.subirArquivo = async function(varanda_id, pagina_id, arquivo) {
	const caminhoTemporario = arquivo.path;
	const diretorioDestino = path.join(path.resolve(__dirname, caminhoArtefatos), varanda_id, pagina_id);
	const nomeArquivo = arquivo.originalname.toLowerCase();
	const caminhoDestino = path.join(path.resolve(diretorioDestino, nomeArquivo));

	// cria diretório de destino, se ainda não existe
	fs.mkdir(diretorioDestino, { recursive: true }, (err) => {
		if (err) {
			throw err;
		} else {
			// move arquivo temporário para destino final
			fs.rename(caminhoTemporario, caminhoDestino, err => {
				if (err) {
					throw err;
				} else {
					return {nome: nomeArquivo};
				}
			});
		}
	});
};