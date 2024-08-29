module.exports.createPost = (reg, res, next) => {
    if (!reg.body.title) {
        reg.flash("error", titleErrorInfo());
        res.redirect("back");
        return;
    }

    next();
}