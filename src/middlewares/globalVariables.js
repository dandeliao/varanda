exports.flashMessages = (req, res, next) => {
    res.locals.flash_aviso = req.flash('aviso');
    res.locals.flash_erro = req.flash('erro');
    next();
};