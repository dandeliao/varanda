const dataArtefatos = require('../../data/artefatos/dataArtefatos');

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
}