const dataTemas = require('../../data/bichos/dataTemas');
const dataArtefatos = require('../../data/artefatos/dataArtefatos');
const { editarArquivoTema } = require('../../utils/utilArquivos');

exports.verTemas = async function () {
    const temas = await dataTemas.getTemas();
    return temas.rows;
}

exports.verTema = async function (temaId) {
	const tema = await dataTemas.getTema(temaId);
	return tema.rows[0];
};

exports.criarTema = async function (nome, artefatoId) {
    const css = (await dataArtefatos.getArtefato(artefatoId)).rows[0].texto;
	const tema = (await dataTemas.postTema(nome, artefatoId)).rows[0];

    editarArquivoTema(tema.tema_id, tema.nome, css);

	return tema;
};

exports.deletarTema = async function (tema_id) {
	const tema = await dataTemas.deleteTema(tema_id);
	return tema.rows[0];
};