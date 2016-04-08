var rp = require('request-promise');

const listUrl = "http://localhost:9000/";

module.exports = (router)=>{
    router.get("/:listId", function *(next) {
        this.set('Content-Type', "application/json");
        var fullUrl = listUrl + "invoke/" + this.params.listId + "/getState";
        yield rp(fullUrl).then((resp) => {
                console.log(resp);
                this.body = resp;
                return next;
            });
    });
};