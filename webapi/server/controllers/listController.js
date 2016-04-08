let request = require('fetchy-request');

const listUrl = "localhost:9000/";

module.exports = (router)=>{
    router.get("/:listId", function *(next) {
        this.set('Content-Type', "application/json");
        yield request(listUrl + "invoke/" + this.params.listId + "/getState").then((response)=>{
            console.log(response);
            this.body = response.json();
            return next;
        });
    });
};