module.exports.dashboard = (reg, res) => {
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan"
    });
}