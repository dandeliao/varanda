const express 	= require('express');
const router 	= express.Router();
const passport = require('passport');
/* const taAutenticade = require('../middlewares/authentication'); */

/* router.use(taAutenticade); */

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/varanda/entrar',
	failureFlash: true, // testar flash message, ver localização pt-br
	successRedirect: '/'
}));

router.get('/logout', 		(req, res) => {
	req.logout(err => {
		if (err) {
			req.flash('message', 'Erro ao sair da varanda. Por favor, tente novamente.');
			res.redirect('/');
			/* res.status(500).json({
				mensagem: 'erro ao fazer o logout'
			}); */
		}/*  else {
			res.status(200).json({
				mensagem: 'logout realizado com sucesso',
				autenticade: false
			});
		} */
		res.redirect('/');
	});
});


module.exports = router;