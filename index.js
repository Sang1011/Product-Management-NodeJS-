const express = require('express');
// import express framework
require("dotenv").config();

import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require("express-flash");


const database = require("./config/database");

const systemConfig = require("./config/system");

const app = express();
// tạo 1 express application và lưu trữ vào app

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

const route = require("./routes/client/index.route");
// import 1 module từ file... 

const routeAdmin = require("./routes/admin/index.route");

database.connect();

app.set("views", `${__dirname}/views`);
// đường dẫn nơi pug đc lưu trữ
// để express biết nơi tìm file khi render

app.set("view engine", "pug");
// để render HTML động bằng pug
// khi gọi render thì express sẽ tìm file .pug

// flash

app.use(cookieParser("JKASDYQIWDJHHASD"));
app.use(session({ cookie: { maxAge: 6000 } }));
app.use(flash());

// end flash

//App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

console.log(__dirname);

//Routes
route(app);
routeAdmin(app);
//điều phối app qua các router

const PORT = process.env.PORT;


// Start the server, chạy server

app.listen(PORT, () => {
    // hàm listen sẽ lấy tham số(cổng, hàm callback) để lắng nghe và chạy server
    console.log(`Server is running on http://localhost:${PORT}`);
});