function taAutenticade (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({
			msg: 'Desculpe, você não tem permissão para acessar esse recurso. Já fez o login?',
			logade: false
		});
	}
}

module.exports = taAutenticade;