const app = require("../server/server");
const request = require("supertest").agent(app.listen());
const expect = require('chai').expect;
const listUrl = "localhost:9000";
describe("/", ()=>{
    it("should return the list items array", (d)=>{
        request
            .get(listUrl + "/someListName")
            .set('Accept', 'application/json')
            .expect(200, [], d);
    });

    it("should be able to add stuff", (d)=>{
        var listitem = { title: "Feed cat"};

        request.post(listUrl + "someListName/add")
            
            .send(listitem)
            .expect(200);
    });
});