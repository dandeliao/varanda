const express = require('express');
const cors = require('cors');

const rotasPessoas = require('./routes/routePessoas');
const rotasAutenticacao = require('./routes/routeAutenticacao');
const rotasComunidades = require('./routes/routeComunidades');

const errorHandler = require('./middlewares/errorHandler');

const session = require('express-session');
const sessionConfig = require('../../config/session'); // objeto com configurações de sessão
const PostgreSqlStore = require('connect-pg-simple')(session); // para armazenamento de sessão
const pool = require('../../config/database'); // para armazenamento de sesssão
const passport = require('passport');
require('../../config/passport');

const app = express();

// armazenamento de sessão
const sessionStore = new PostgreSqlStore({
	pool: pool,
	tableName: 'sessoes'
});
sessionConfig.store = sessionStore;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
	origin: 'http://localhost:4200',
	credentials: true
}));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use('/comunidades', rotasComunidades);
app.use('/pessoas', rotasPessoas);
app.use('/autenticacao', rotasAutenticacao);
app.use(errorHandler);

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

// roda servidor
app.listen(4000);