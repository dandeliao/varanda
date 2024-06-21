exports.flashMessages = (req, res, next) => {

    let a = req.flash('aviso')[0];
    let e = req.flash('erro')[0];

    let flash_aviso = a ? encodeURIComponent(a) : null;
    let flash_erro = e ? encodeURIComponent(e) : null;

    res.locals.flash_aviso = flash_aviso ? flash_aviso : req.query.flash_aviso;
    res.locals.flash_erro = flash_erro ? flash_erro : req.query.flash_erro;
    next();
};