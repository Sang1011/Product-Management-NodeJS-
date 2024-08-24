const Product = require("../../models/products.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
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
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(reg, res) => {
    const status = reg.params.status;
    const id = reg.params.id;


    await Product.updateOne({ _id: id }, { status: status });

    res.redirect('back');
}

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
        default:
            break;
    }
    res.redirect('back');
}