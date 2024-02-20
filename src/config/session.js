/* eslint-disable no-undef */
require('dotenv').config();

// objeto de configuração das sessões, para uso com express-session
const sessionConfig = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	//store: é definido em app.js
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 28, // 28 dias
		sameSite: true,
		secure: false // habilitar quando ativar https
	}
};

module.exports = sessionConfig;