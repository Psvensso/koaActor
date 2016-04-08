var rp = require('request-promise');

const listUrl = "http://localhost:9000/";

module.exports = (router)=>{
    router.get("/api/:listId", function *(next) {
        this.set('Content-Type', "application/json");
        var fullUrl = listUrl + "invoke/" + this.params.listId + "/getState";
        yield rp(fullUrl).then((resp) => {
                console.log(resp);
                this.body = resp;
                return next;
            });
    });
    router.post("/api/:listId", function *(next) {
        this.set('Content-Type', "application/json");
        console.log(this.request.body);
        var fullUrl = listUrl + "invoke/" + this.params.listId + "/add";
        console.log(fullUrl);
        yield rp({uri: fullUrl, method: 'POST', body: this.request.body, json: true}).then((resp) => {
                console.log(resp);
                this.body = resp;
                this.status = 201;
                return next;
            })
        .catch((err)=>{console.log('POST error');});
    });
};
