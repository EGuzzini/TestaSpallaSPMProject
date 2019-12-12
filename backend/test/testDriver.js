const app = require("../server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
let userId = 0;
describe("Server!", () => {
    it("welcomes user to the api", (done) => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals("Welcome to our application.");
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
        it('it try to POST a user without password', (done) => {
            let user = {
                username: "emanuele",
                email: "eg@gmail.it",

            }

            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();

                });


        });

    });

    describe('/GET/ALL USERS', () => {
        it("it should GET all users", done => {
            chai.request(app)
                .get('/users')
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
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                });

        });
        it("try to GET a user given the wrong id'", done => {
            let id = 0;
            chai.request(app)
                .get('/users/' + id)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found driver with id " + id + ".");
                    done();
                });

        });
    });
    describe('/PUT/:id', () => {
        it("it should UPDATE a user given the id'", done => {
            let user = {
                username: "dantedomizi",
                email: "dd@gmail.it",
                password: "samuele"
            }

            chai.request(app)
                .put('/users/' + userId)
                .send(user)
                .end((err, res) => {

                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username', "dantedomizi");
                    expect(res.body).to.have.property('email', "dd@gmail.it");

                    done();
                });

        });

        it("try to UPDATE a user given the wrong id'", done => {
            let user = {
                username: "dantedomizi",
                email: "dd@gmail.it",
                password: "samuele"
            }
            let id = 0;
            chai.request(app)
                .put('/users/' + id)
                .send(user)
                .end((err, res) => {

                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Driver with id " + id + ".");

                    done();
                });

        });

    });
    describe('/DELETE/:id', () => {
        it('it should DELETE a user given the id', (done) => {

            chai.request(app)
                .delete('/users/' + userId)
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
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equals("All drivers were deleted successfully!");
                    done();

                });
        });
    });


});