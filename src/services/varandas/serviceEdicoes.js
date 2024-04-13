const dataEdicoes = require('../../data/varandas/dataEdicoes');

exports.verEdicoes = async function (pagina_vid, edicao_id) {
	let resposta;
	if (edicao_id !== null) {
		const edicao = await dataEdicoes.getEdicao(edicao_id);
		resposta = edicao.rows[0];
	} else {
		const edicoes = await dataEdicoes.getEdicoesDaPagina(pagina_vid);
		resposta = edicoes.rows;
	}
	return resposta;
};


exports.criarEdicao = async function (bicho_editor_id, pagina, html) {

	let novaEdicao = await dataEdicoes.createEdicao(bicho_editor_id, pagina, html);

	return novaEdicao.rows[0];
};

exports.deletarEdicao = async function (edicao_id) {
	
	const edicaoDeletada = await dataEdicoes.deleteEdicao(edicao_id);

	return edicaoDeletada.rows[0];
};