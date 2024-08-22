const Product = require("../../models/products.model");



module.exports.product = async(reg, res) => {
    let filterStatus = [{
            name: "Tất cả",
            status: "",
            class: "active"
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    console.log(reg.query.status);
    // tùy thuộc vào param truyền tới
    let find = {
        deleted: false
    };

    if (reg.query.status) {
        const index = filterStatus.findIndex(item => item.status == reg.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    const products = await Product.find(find);

    console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus
    });
};