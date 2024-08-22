const Product = require("../../models/products.model");


module.exports.index = async(reg, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    });

    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
    })

    console.log(products);

    res.render("client/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products
    });
};