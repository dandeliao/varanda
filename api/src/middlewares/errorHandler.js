const CustomError = require('../utils/CustomError');

exports.errorHandler = (erro, req, res, next) => {

	if (erro instanceof CustomError) {
		return res.status(erro.status).json({
			message: erro.message
		});
	}

	/* if (erro.message === 'pessoa não encontrada') {
		return res.status(404).send(erro.message);
	}
	if (erro.message === 'pessoa já existe') {
		return res.status(409).send(erro.message);
	} */
	res.status(500).send(erro.message);
};

exports.tryCatch = (controller) => async (req, res, next) => {
	try {
		await controller(req, res);
	} catch (erro) {
		return next(erro);
	}
};