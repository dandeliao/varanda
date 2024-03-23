const dataArtefatos = require('../../data/artefatos/dataArtefatos');

exports.verArtefato = async function(artefato_pid) {
    let resposta = null;
	if (artefato_pid !== null) {
		const artefato = await dataArtefatos.getArtefato(artefato_pid);
		resposta = artefato.rows[0];
	}
    return resposta;
};

exports.criarArtefato = async function(artefato) {
	const artefatoCriado = await dataArtefatos.postArtefato(artefato);
	return artefatoCriado.rows[0];
}