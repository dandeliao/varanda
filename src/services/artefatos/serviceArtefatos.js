const dataArtefatos = require('../../data/artefatos/dataArtefatos');

exports.verArtefato = async function(artefato_pid) {
    let resposta = {};
	if (artefato_pid !== null) {
		const artefato = await dataArtefatos.getArtefato(artefato_pid);
		resposta = artefato.rows[0];
	}
    return resposta;
};