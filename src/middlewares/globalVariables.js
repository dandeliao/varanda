exports.flashMessages = (req, res, next) => {
    res.locals.flash_message = req.session.flash.error ? req.session.flash.error[0] : req.flash('message');
    console.log(res.locals);
    next();
};