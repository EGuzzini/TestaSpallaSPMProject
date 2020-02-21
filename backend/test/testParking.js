const app = require("../server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
let parkingId = 0;
let token;
let userId = 0;
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

    describe("POST\Parking", () => {
        it('it should POST a parking ', (done) => {
            let parking = {
                status: 0,
                coord: "13.063203,43.140406",
                comune: "montecassiano",
                costoorario: 6.3
            }

            chai.request(app)
                .post('/parking')
                .set('Authorization', 'Bearer ' + token)
                .send(parking)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('coord', "13.063203,43.140406");
                    expect(res.body).to.have.property('comune', "montecassiano");
                    expect(res.body).to.have.property('costoorario', 6.3);

                    done();

                });


        });
        it('try to POST a parking with the same coordinates  ', (done) => {
            let parking = {
                status: 0,
                coord: "13.063203,43.140406",
                comune: "montecassiano",
                costoorario: 6.3
            }

            chai.request(app)
                .post('/parking')
                .set('Authorization', 'Bearer ' + token)
                .send(parking)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("already exist a Parking with coord " + parking.coord + " .");
                    done();
                });
        });
    });

    describe('/GET/ALL PARKING', () => {
        it("it should GET all parking", done => {
            chai.request(app)
                .get('/parking/')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    parkingId = res.body[0].idparkingslot;
                    done();
                });

        });
    });
    describe('/GET/:id', () => {
        it("it should GET a parking given the id'", done => {
            chai.request(app)
                .get('/parking/' + parkingId)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                });

        });
        it("try to GET a parking given the wrong id'", done => {
            let id = 0;
            chai.request(app)

            .get('/parking/' + id)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Parking with id " + id + ".");
                    done();
                });

        });
    });
    describe('/UPDATE/:id', () => {
        it("it should UPDATE a parking given the id'", done => {
            let parking = {
                status: 1,
                coord: "13.075009882450105,43.13747491759090",
                comune: "Roma",
                costoorario: 6.3
            }

            chai.request(app)
                .put('/parking/' + parkingId)
                .set('Authorization', 'Bearer ' + token)
                .send(parking)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', 1);
                    expect(res.body).to.have.property('coord', "13.075009882450105,43.13747491759090");
                    expect(res.body).to.have.property('comune', "Roma");
                    expect(res.body).to.have.property('costoorario', 6.3);
                    done();
                });

        });
        it("try to UPDATE a parking given the wrong id'", done => {
            let parking = {
                status: 0,
                coord: "13.163203,43.240406",
                comune: "montecassiano",
                costoorario: 6.3
            }
            let id = 0;
            chai.request(app)
                .put('/parking/' + id)
                .set('Authorization', 'Bearer ' + token)
                .send(parking)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Parking slot with id " + id + ".");
                    done();
                });

        });
        it("Cancellation of park reserved", done => {
            chai.request(app)
                .get("/parkingnearest/cancellation/" + "13.075009882450105,43.13747491759090")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('coord', "13.075009882450105,43.13747491759090");
                    expect(res.body).to.have.property('comune', "Roma");
                    expect(res.body).to.have.property('costoorario', 6.3);
                    done();
                });
        });

    });

    describe('Test nearest function', () => {
        it('try to find the nearest parking to the destination ', (done) => {
            let destination =

                "13.075009882450105,43.13747491759090"

            chai.request(app)
                .get("/parkingnearest/" + destination)

            .end((err, res) => {

                expect([13.074867, 43.137282]);
                done();
            });
        });
        it('expected a empty array of nearest parking to the destination', (done) => {
            let destination =

                "1.075009882450105,44.13747491759090"
            chai.request(app)
                .get("/parkingnearest/" + destination)

            .end((err, res) => {

                expect([]);
                done();
            });
        });
    });
    describe('/DELETE/:id', () => {
        it('try to DELETE a parking given the wrong id', (done) => {
            let id = 0;

            chai.request(app)
                .delete('/parking/' + id)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equals("Not found Parking slot with id " + id + ".");
                    done();
                });
        });
        it('it should DELETE a parking given the id', (done) => {

            chai.request(app)
                .delete('/parking/' + parkingId)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equals("Parking slot was deleted successfully!");
                    done();
                });
        });

    });

    describe('/DELETE/ALL', () => {
        it('it should DELETE all parking', (done) => {
            chai.request(app)
                .delete('/parking')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equals("All Parking slot were deleted successfully!");

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