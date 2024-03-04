const { objetoRenderizavel, quemEstaAgindo } = require('../utils/utilControllers');

exports.errorHandler = async (error, req, res, next) => {

    console.log(error);
    let redirect = error.redirect ? error.redirect : '/blocos/500';
    req.flash('erro', error.message ? error.message : 'Erro no servidor, tente novamente.');

    return res.redirect(303, redirect);
};