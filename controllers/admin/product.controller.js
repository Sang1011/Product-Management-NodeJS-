const Product = require("../../models/products.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

var updateSuccessInfo = () => {
    return "Cập nhật trạng thái thành công!";
}
var updateSuccessManyInfo = (ids) => {
    return `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`;
}
var deleteSuccessInfo = () => {
    return "Xóa sản phẩm thành công!";
}
var deleteSuccessManyInfo = (ids) => {
    return `Xóa ${ids.length} sản phẩm thành công!`;
}
var createSuccessInfo = () => {
    return "Tạo sản phẩm thành công!";
}
var titleErrorInfo = () => {
        return "Vui lòng nhập tiêu đề cho sản phẩm";
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

    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);





    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    if (reg.query.status) {
        find.status = reg.query.status;
    }



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
            reg.flash("success", updateSuccessManyInfo(ids));
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            reg.flash("success", updateSuccessManyInfo(ids));
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            reg.flash("success", deleteSuccessManyInfo(ids));
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            reg.flash("success", updateSuccessManyInfo(ids));
            break;
    }


    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id
module.exports.delete = async(reg, res) => {
    const id = reg.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    reg.flash("success", deleteSuccessInfo(id));
    res.redirect('back');
}

// [GET] /admin/products/create
module.exports.create = async(reg, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
};

// [POST] /admin/products/create
module.exports.createPost = async(reg, res) => {

    reg.body.price = parseInt(reg.body.price);
    reg.body.stock = parseInt(reg.body.stock);
    reg.body.discountPercentage = parseInt(reg.body.discountPercentage);

    if (reg.body.position == "") {
        const countProducts = await Product.countDocuments();
        reg.body.position = countProducts + 1;
    } else {
        reg.body.position = parseInt(reg.body.position);
    }
    if (reg.file) {
        reg.body.thumbnail = `/uploads/${reg.file.filename}`;
    }

    const product = new Product(reg.body);
    await Product.insertMany([product]);

    reg.flash("success", createSuccessInfo());

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async(reg, res) => {
    try {
        const find = {
            deleted: false,
            _id: reg.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm sản phẩm",
            product: product
        });
    } catch (error) {
        reg.flash("error", "Sản phẩm không tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async(reg, res) => {
    const id = reg.params.id;
    reg.body.price = parseInt(reg.body.price);
    reg.body.stock = parseInt(reg.body.stock);
    reg.body.discountPercentage = parseInt(reg.body.discountPercentage);
    reg.body.position = parseInt(reg.body.position);

    if (reg.file) {
        reg.body.thumbnail = `/uploads/${reg.file.filename}`;
    }

    try {

        await Product.updateOne({ _id: id }, reg.body);

        reg.flash("success", "Cập nhật sản phẩm thành công");

        res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        reg.flash("error", "Cập nhật sản phẩm thất bại");
        res.redirect("back");
    }
}