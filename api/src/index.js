const express = require('express');
const rotasBichos = require('./routes/bichos.js');
const rotasArtefatos = require('./routes/artefatos.js');
const rotasVarandas = require('./routes/varandas.js');
const session = require('express-session');
const sessionConfig = require('./config/session'); // objeto com configurações de sessão
const PostgreSqlStore = require('connect-pg-simple')(session); // para armazenamento de sessão
const pool = require('./config/database'); // para armazenamento de sesssão
require('./config/passport');
const cors = require('cors');
const passport = require('passport');
const customError = require('http-errors');
require('dotenv').config();
const PORT = process.env.port || 4000;

const app = express();

// armazenamento de sessão
const sessionStore = new PostgreSqlStore({
	pool: pool,
	tableName: 'sessoes'
});
sessionConfig.store = sessionStore;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
	origin: 'http://localhost:4200',
	credentials: true
}));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// rotas
app.use('/bichos', 		rotasBichos		);
app.use('/artefatos', 	rotasArtefatos	);
app.use('/varandas', 	rotasVarandas	);

// rota padrão fornece informações sobre pessoa logada
app.get('/', async (req, res, next) => {
	try {
		if (req.user) {
			req.user.logade = true;
			res.json(req.user);
		} else {
			res.json({
				logade: false,
			});
		}
		
	} catch (erro) {
		next(erro);
	}
});

// tratamento de erros
app.use((req, res, next) => {
	next(customError(404, 'Página não encontrada.'));
});
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		status: error.status,
		message: error.message
	});
});

// roda o servidor
app.listen(PORT, () => {
	console.log(`Servidor escutando atentamente na porta ${PORT}`);
});