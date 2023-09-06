function taAutenticade (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		console.log('body:', req.body);
		console.log('baseUrl + path:', req.baseUrl + req.path);
		console.log('method:', req.method);

		const caminho = req.baseUrl + req.path;

		if (caminho === '/bichos/pessoas' && req.method === 'POST') {
			console.log('permitido!');
			next();
		} else if (caminho.match(/\/bichos\/pessoas\/\w*\/recuperar/)) {
			console.log('permitido!');
			next();
		} else {
			res.status(401).json({
				msg: 'Desculpe, você não tem permissão para acessar esse recurso. Já fez o login?',
				logade: false
			});
		}
	}
}

module.exports = taAutenticade;