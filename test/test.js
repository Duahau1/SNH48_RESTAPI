let chai = require('chai');
let server = require('../index');
let chai_http = require('chai-http');
const { response } = require('express');

// Assertion style

chai.should();
chai.use(chai_http);

// Setting up the server and db
before(function (done) {
    server.on("appStarted", function(){
            done();
        });
    });
describe('Test API endpoints',()=>{
    /*
        Test the GET routes 
    */
   describe('GET /api/snh48',()=>{
       it("It should get all the members",(done)=>{
           chai.request(server)
           .get("/api/snh48")
           .end((err,res)=>{
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.eql(120);
           done();
            })
       })
       it("It should return the member with the correct ID",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member/"+id)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Name').equal('Dai Meng');
        done();
         })
       })
       it("It should not return the member with the incorrect ID",(done)=>{
        let id="5f1661ef422e89382099f2d";
        chai.request(server)
        .get("/api/snh48/member/"+id)
        .end((err,res)=>{
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('Error');
        done();
         })
       })
       it("It should return the member with the correct name",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Meng")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Name').equal('Dai Meng');
        done();
         })
       })
       it("It should return the member with the correct name and team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Meng&team=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('Name').equal('Dai Meng');
        done();
         })
       })
       it("It should not return with the incorrect name and correct team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Mng&team=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should not return with the correct name and incorrect team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Meng&team=YII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should not return with the incorrect name and incorrect team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Mng&team=YII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should not return with the empty name and correct team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=&team=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should not return with the correct name and empty team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Meng&team=")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should not return with the empty name and empty team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=&team=")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       it("It should return correct name and nonvalid fields",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Dai Meng&teams=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Name').equal('Dai Meng');
        done();
         })
       })
       it("It should not return correct team and nonvalid fields",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?names=Dai Meng&team=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('array');
        done();
         })
       })
       it("It should not return with incorrect member's name",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?name=Mia Nguyen")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })

       it("It should return all the members with the same team",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?team=SII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('array');
        done();
         })
       })
       it("It should not return with incorrect team name",(done)=>{
        let id="5f1661ef422e89382099f2cd";
        chai.request(server)
        .get("/api/snh48/member?team=YII")
        .set('token',process.env.TEST)
        .end((err,res)=>{
            res.should.have.status(404);
        done();
         })
       })
       
      

    })
   

   /*
    Test the POST routes
   */

  describe('POST /user/signup',()=>{
      it("It should create a new User",(done)=>{
          let tempUser = {
              email: "test2@gmail.com",
              password:"happyCoding123"
          }
          chai.request(server)
          .post("/user/signup")
          .send(tempUser)
          .end((err,res)=>{
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('Message');
              res.body.should.have.property('Message').equal('User is created');

            done();
          })
      })
  })
  
  describe('POST /user/signin/',()=>{
      it("It should return tokens",(done)=>{
        let tempUser = {
            email: "test@gmail.com",
            password:"happyCoding123"
        }
        chai.request(server)
          .post("/user/signin")
          .send(tempUser)
          .end((err,res)=>{
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('Message');
              res.body.should.have.property('Access_Token');
              res.body.should.have.property('Refresh_Token');
            done();
          })
      })
  })
  describe('POST /refresh_Token',()=>{
      it("It should return a new access token",(done)=>{
          chai.request(server)
          .post('/refresh_Token')
          .set('token','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOiI1ZjNjMzczMGUwNjA1NTFjM2MyYWZlZjkiLCJpYXQiOjE1OTc3ODI1MDh9.TY0wC1ukcxk8pjaMOTStqtQLZYS5NmPIp_X7vQ5whAc')
          .end((err,res)=>{
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('AccessToken');
              done();
          })
        })
  })


})