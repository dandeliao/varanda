function errorHandler (erro, req, res, next) {
	if (erro.message === 'pessoa não encontrada') {
		return res.status(404).send(erro.message);
	}
	if (erro.message === 'pessoa já existe') {
		return res.status(409).send(erro.message);
	}
	res.status(500).send(erro.message);
}

module.exports = errorHandler;