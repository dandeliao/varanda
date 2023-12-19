const express 	            = require('express');
const session 	            = require('express-session');
const sessionConfig 	    = require('./config/session.js'); // objeto com configurações de sessão
const PostgreSqlStore 	    = require('connect-pg-simple')(session); // para armazenamento de sessão
const pool 				    = require('./config/database.js'); // para armazenamento de sesssão
const passport 			    = require('passport');
const flash 			    = require('connect-flash');
const customError 		    = require('http-errors');
const rotasVarandas 		= require('./routes/varandas.js');
const rotasAutenticacao 	= require('./routes/autenticacao.js');
const rotasBichos 			= require('./routes/bichos.js');
const rotasArtefatos 		= require('./routes/artefatos.js');
require('./config/passport.js');
require('dotenv').config();

const PORT  = process.env.port || 4000;
const app   = express();

// armazenamento de sessão
const sessionStore = new PostgreSqlStore({
	pool: pool,
	tableName: 'sessoes'
});
sessionConfig.store = sessionStore;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// rotas
app.use('/',		 		rotasVarandas		);
app.use('/autenticacao',	rotasAutenticacao	);
/* app.use('/bichos', 			rotasBichos			);
app.use('/artefatos', 		rotasArtefatos		); */

// tratamento de erros
// !!! modificar resposta para ser html, não JSON
/* app.use((req, res, next) => {
	next(customError(404, 'Página não encontrada.'));
});
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		status: error.status,
		message: error.message
	});
}); */

// roda o servidor
app.listen(PORT, () => {
	console.log(`Escutando atentamente na porta ${PORT}...`);
});