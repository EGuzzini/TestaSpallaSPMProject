const app = require("../server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
let userId = 0;
let token;
describe("Server!", () => {
    it("welcomes user to the api", (done) => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);

                done();
            });
    });

    describe("POST\User", () => {
        it('it should POST a user ', (done) => {
            let user = {
                username: "dante",
                email: "dd@gmail.it",
                password: "samuele"
            }

            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username', "dante");
                    expect(res.body).to.have.property('email', "dd@gmail.it");
                    expect(res.body).to.have.property('password');

                    done();

                });


        });

        it('it try to POST a user without email', (done) => {
            let user = {
                username: "emanuele",

                password: "samuele"
            }

            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    done();

                });


        });
    });
    describe("Driver login", () => {
        it('user login ', (done) => {
            let user = {
                username: "dante",
                email: "dd@gmail.it",
                password: "samuele"
            }

            chai.request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('jwtToken');
                    token = res.body.jwtToken;
                    done();

                });


        });

    });
    describe('/GET/ALL USERS', () => {
        it("it should GET all users", done => {
            chai.request(app)
                .get('/users')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    userId = res.body[0].idDriver;
                    done();
                });

        });
    });
    describe('/GET/:id', () => {
        it("it should GET a user given the id'", done => {
            chai.request(app)
                .get('/users/' + userId)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                });

        });
        /* it("try to GET a user given the wrong id'", done => {
             let id = 0;
             chai.request(app)
                 .get('/users/' + id)
                 .set('Authorization', 'Bearer ' + token)
                 .end((err, res) => {
                     expect(res).to.have.status(404);
                     expect(res.body.message).to.equals("Not found driver with id " + id + ".");
                     done();
                 });

         });*/
    });
    describe('/PUT/:id', () => {
        it("it should UPDATE a user given the id'", done => {
            let user = {
                username: "dantedomizi",
                email: "dante.domizi@studenti.unicam.it",
                password: "samuele"
            }

            chai.request(app)
                .put('/users/' + userId)
                .set('Authorization', 'Bearer ' + token)
                .send(user)
                .end((err, res) => {

                    expect(res).to.have.status(200);

                    expect(res.body).to.have.property('username', "dantedomizi");
                    expect(res.body).to.have.property('email', "dante.domizi@studenti.unicam.it");

                    done();
                });

        });
        /*
        it("it should change user password", done => {
            let password = {

                oldpassword: "samuele",
                newpassword: "samfiore"
            }
            chai.request(app)
                .put('/users/' + userId + '/changePassword')
                .set('Authorization', 'Bearer ' + token)
                .send(password)
                .end((err, res) => {

                    expect(res).to.have.status(200);

                    //expect(res.body).to.have.property('username', "dantedomizi");
                    // expect(res.body).to.have.property('email', "dante.domizi@studenti.unicam.it");


                    done();
                });
        });*/
        it("try to UPDATE a user given the wrong id'", done => {
            let user = {
                username: "dantedomizi",
                email: "dante.domizi@studenti.unicam.it",
                password: "samuele"
            }
            let id = 0;
            chai.request(app)
                .put('/users/' + id)
                .set('Authorization', 'Bearer ' + token)
                .send(user)
                .end((err, res) => {

                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Driver with id " + id + ".");

                    done();
                });

        });




    });
    describe('Recovery password', () => {
        it('Send an email with new password', (done) => {
            let email = {

                email: "dante.domizi@studenti.unicam.it"
            }
            chai.request(app)
                .put("/passwordReset")
                .send(email)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    console.log('------------------------------------');
                    console.log(res.body);
                    console.log('------------------------------------');
                    done();
                });
        });
    });
    describe('/DELETE/:id', () => {
        it('it should DELETE a user given the id', (done) => {

            chai.request(app)
                .delete('/users/' + userId)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equals("driver was deleted successfully!");
                    done();
                });
        });
        it('try to DELETE a user given the wrong id', (done) => {
            let id = 0;
            chai.request(app)
                .delete('/users/' + id)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Parking slot with id " + id + ".");
                    done();
                });
        });
    });
    describe('/DELETE/ALL', () => {
        it('it should DELETE all users', (done) => {
            chai.request(app)
                .delete('/users')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equals("All drivers were deleted successfully!");
                    done();

                });
        });
    });


});