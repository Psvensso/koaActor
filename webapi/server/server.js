const koa = require("koa");
const router = require('koa-router')();
const app = koa();
const fs = require('fs');
const path = require('path');
var bodyParser = require('koa-bodyparser');

app.use(bodyParser());

fs.readdirSync(path.join(__dirname, "controllers")).forEach(function(file) {
    var ctrl = require("./controllers/" + file);
    !ctrl || ctrl(router);
});

app.use(router.routes())
    .use(router.allowedMethods());

app.router = router;

module.exports = app;