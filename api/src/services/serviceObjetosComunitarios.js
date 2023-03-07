const dataPessoasComunidades = require('../data/dataPessoasComunidades');

exports.getPessoasNaComunidade = async function (comunidadeId) {
	const objetoPessoas = await dataPessoasComunidades.getPessoasComunidade(comunidadeId);
	return objetoPessoas.rows;
};

exports.getPessoaNaComunidade = async function (comunidadeId, pessoaId) {
	const objetoPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, comunidadeId);
	return objetoPessoaComunidade.rows;
};

exports.editComunidadePessoal = async function (comunidadeId, pessoaId, habilidades) {
	
	// falta validar dados da variável habilidades
	
	const dadosPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, comunidadeId);
	if (dadosPessoaComunidade.moderar) {
		const dataResponse = await dataPessoasComunidades.putPessoaComunidade(pessoaId, comunidadeId, habilidades);
		return dataResponse.rows[0];
	} else {
		throw new Error ('pessoa não tem habilidade para acessar este recurso');
	}
};

exports.kickPessoa = async function (comunidadeId, pessoaId) {
	const dadosPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, comunidadeId);
	if (dadosPessoaComunidade.moderar) {
		const dataResponse = await dataPessoasComunidades.deletePessoaComunidade(pessoaId, comunidadeId);
		return dataResponse.rows;
	} else {
		throw new Error ('pessoa não tem habilidade para acessar este recurso');
	}
};