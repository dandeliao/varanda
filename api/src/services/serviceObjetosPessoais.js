const dataPessoasComunidades = require('../data/dataPessoasComunidades');
const dataComunidades = require('../data/dataComunidades');

exports.getComunidadesPessoais = async function (pessoaId) {
	const objetoComunidades = await dataPessoasComunidades.getPessoaComunidades(pessoaId);
	return objetoComunidades.rows;
};

exports.getComunidadePessoal = async function (pessoaId, comunidadeId) {
	const objetoPessoaComunidade = await dataPessoasComunidades.getPessoaComunidade(pessoaId, comunidadeId);
	if (objetoPessoaComunidade.rows[0]) {
		return objetoPessoaComunidade.rows[0];
	} else {
		return {
			pessoa_id: 		pessoaId,
			comunidade_id:	comunidadeId,
			participar:		false,
			editar:			false,
			moderar: 		false,
			cuidar:			false
		};
	}
};

exports.editComunidadePessoal = async function (pessoaId, comunidadeId, habilidades) {
	
	// falta validar dados da variável papeis

	const dataResponse = await dataPessoasComunidades.putPessoaComunidade(pessoaId, comunidadeId, habilidades);
	return dataResponse.rows[0];
};

exports.enterComunidade = async function (pessoaId, comunidadeId) {
	const objetoComunidade = await dataComunidades.getComunidade(comunidadeId);
	if (objetoComunidade.rows[0].aberta) {
		const habilidades = {
			participar: true,
			editar: false,
			moderar: false,
			cuidar: false
		};
		const dataResponse = await dataPessoasComunidades.postPessoaComunidade(pessoaId, comunidadeId, habilidades);
		return dataResponse.rows;
	} else {
		return new Error ('comunidade fechada');
	}
	
};

exports.leaveComunidade = async function (pessoaId, comunidadeId) {
	const dataResponse = await dataPessoasComunidades.deletePessoaComunidade(pessoaId, comunidadeId);
	return dataResponse.rows;
};