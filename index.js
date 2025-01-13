const express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("express-flash");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser("JSASDJLENVEA"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// Route
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
