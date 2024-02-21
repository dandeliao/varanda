exports.flashMessages = (req, res, next) => {
    res.locals.flash_message = req.flash('message');
    res.locals.flash_error = req.flash('error');
    next();
};