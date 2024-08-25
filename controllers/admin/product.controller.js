const Product = require("../../models/products.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
var updateSuccessInfo = () => {
    return "Cập nhật trạng thái thành công!";
}
var updateSuccessManyInfo = (ids) => {
    return `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`;
}
var deleteSuccessInfo = (ids) => {
        return `Xóa ${ids.length} sản phẩm thành công!`;
    }
    // [GET] /admin/products
module.exports.product = async(reg, res) => {


    // console.log(reg.query.status);
    // tùy thuộc vào param truyền tới
    let find = {
        deleted: false
    };


    const filterStatus = filterStatusHelper(reg.query);
    const objectSearch = searchHelper(reg.query);

    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        },
        reg.query,
        countProducts
    );

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    if (reg.query.status) {
        find.status = reg.query.status;
    }
    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);


    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(reg, res) => {
    const status = reg.params.status;
    const id = reg.params.id;


    await Product.updateOne({ _id: id }, { status: status });

    reg.flash("success", updateSuccessInfo());

    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async(reg, res) => {
    const type = reg.body.type;
    const ids = reg.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            break;
    }

    reg.flash("success", updateSuccessManyInfo(ids));

    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id
module.exports.delete = async(reg, res) => {
    const id = reg.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    reg.flash("success", deleteSuccessInfo(ids));
    res.redirect('back');
}