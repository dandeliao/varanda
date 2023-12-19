const passport = require('passport');
const LocalStrategy = require('passport-local');
const pool = require('./database');
const validaSenha = require('../utils/utilPassword').validaSenha;

// nomes dos campos recebidos do cliente em req.body
const customFields = {
	usernameField: 'bicho_id',
	passwordField: 'senha'
};

// configura autenticação com estratégia local
passport.use(new LocalStrategy(customFields,
	async function(username, password, pronto) {
		try {
			const segredos = await pool.query(
				// esta query deve ter os dados validados antes.
				// 		além disso, deve ser feita pela camada 'data'(?).
				//		reavaliar estrutura de diretórios do projeto.
				'SELECT * FROM pessoas WHERE bicho_id=$1',
				[username]
			);
			if(segredos.rows.length > 0) {
				const segr = segredos.rows[0];
				const isValid = validaSenha(password, segr.hash, segr.salt);
				if (isValid) {
					return pronto(null, segr);
				} else {
					return pronto(null, false, { message: 'Informações incorretas, tente novamente.' });
				}
			} else {
				return pronto(null, false, { message: 'Informações incorretas, tente novamente.' });
			}
		} catch (erro) {
			console.log('erro ao autenticar pessoa (passport.js):', erro.message);
			pronto(erro);
		}
	}	
));

passport.serializeUser((user, pronto) => {
	pronto(null, user.bicho_id);
});

passport.deserializeUser((userId, pronto) => {
	try {
		pool.query(
			// esta query deve ter os dados validados antes?
			// 		além disso, deve ser feita pela camada 'data'(?).
			//		reavaliar estrutura de diretórios do projeto.
			'SELECT * FROM bichos WHERE bicho_id=$1',
			[userId]
		).then(pessoa => {
			if (pessoa.rows.length > 0) {
				const p = pessoa.rows[0];
				pronto(null, p);
			} else {
				return pronto(null, false);
			}
		});
	} catch (erro) {
		console.log('erro ao deserializar pessoa (passport.js):', erro.message);
	}
});