var http = require('http');
var url = require("url");
var towtruck = require('towtruck');


towtruck(listActorFactory).listen(9000);
towtruck(itemActorFactory).listen(9001);
// you need to supply a function which will create actors (objects)
var listDb = {};
var itemsDb = {};
function getListItem(id){
    listDb[id] = listDb[id] || {items: {}};
    return listDb[id];
}
function getItem(id){
    itemsDb[id] = itemsDb[id] || {};
    return itemsDb[id];
}

function listActorFactory(id, client){

    function deleteItem(itemId){
        post("localhost:9001", "/invoke/" + itemId + "/del", null, function(data){
            delete getListItem(id).items[itemId];
        });
    }


    return {
        getState(_, cb){
            console.log("Getting state");
            cb(null, Object.keys(getListItem(id).items));
        },
        add(data, cb){
            console.log('add item to list ' + id);
            var state = getListItem(id);
            var itemId = id + "-item-" + (Object.keys(state.items).length + 1);
            state.items[itemId] = itemId;
            console.log('created ' + itemId);
            console.log('change title ' + data);
            post("localhost:9001", "/invoke/" + itemId + "/changeTitle", data.title, function(data){
                console.log('returning ' + data);
                cb(data);
            });
        },
        deleteAll(data, cb){
            Promise.all(Object.keys(getListItem(id).items).map((key)=>{
                return new Promise((res, _)=>{
                    deleteItem(key, res);
                });
            })).then(cb);
        },

        del(itemId, cb){
            new Promise((res, _)=>{
                deleteItem(itemId, res);
            }).then(cb);
        }

    }
}
function itemActorFactory(id, client){
    return {
        getState(_, cb){
            cb(null, getItem(id));
        },
        complete(){},
        changeTitle(title, c){
            //Persist to DB
            console.log('changing title');
            var state = getItem(id);
            state.title = title; // Persist to "DB"
            console.log('title changed to ' + title);
            c(null, id);
        },
        del(_, cb){
           delete itemsDb[id];
           cb();
        }
    }
}
function post(server, path, data, cb){
    var options = url.parse("http://" + server + path);
    options.method = "POST";
    var req = http.request(options, function(resp){
        var responseData = "";
        resp.on("data", function(chunk){
            responseData += chunk;
        });
        resp.on("end", function(){
            cb(JSON.parse(responseData));
        });
    });

    req.write(JSON.stringify(data));
    req.end();
}
