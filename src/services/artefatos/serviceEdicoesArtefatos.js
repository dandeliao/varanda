const dataEdicoesArtefatos = require('../../data/artefatos/dataEdicoesArtefatos');

exports.verEdicaoArtefato = async function(edicao_artefato_id) {
    let resposta = {};
	if (edicao_artefato_id !== null) {
		const edicaoArtefato = await dataEdicoesArtefatos.getEdicaoArtefato(edicao_artefato_id);
		resposta = edicaoArtefato.rows[0];
	}
    return resposta;
};

exports.verEdicoesArtefato = async function(artefato_pid) {

};

exports.criarEdicaoArtefato = async function(artefato) {
    const edicaoArtefato = await dataEdicoesArtefatos.postEdicaoArtefato(artefato);
    return edicaoArtefato.rows[0];
};

exports.editarEdicaoArtefato = async function(artefato) {

};

exports.removerEdicaoArtefato = async function(artefato_pid) {

};