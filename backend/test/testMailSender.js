const app = require("../server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
let token;
let userId = 0;
let parkingId = 0;
const { expect } = chai;
chai.use(chaiHttp);
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
                username: "Guzzo",
                email: "sam@gmail.it",
                password: "samuele"
            }

            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();

                });


        });
    });
    describe("Driver login", () => {
        it('user login ', (done) => {
            let user = {
                username: "Guzzo",
                email: "sam@gmail.it",
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

    describe("MailSender!", () => {
        it("Try to send an email for report a problem", (done) => {
            let email = {
                subject: "email di prova",
                text: "test email"
            }
            chai.request(app)
                .post('/users/' + userId + '/report')
                .set('Authorization', 'Bearer ' + token)
                .send(email)
                .end((err, res) => {
                    expect(res).to.have.status(200);


                });
            done();
        });
        it("it should return status 400 ", (done) => {
            let email = {
                text: "test email"

            }
            chai.request(app)
                .post('/users/' + userId + '/report')
                .set('Authorization', 'Bearer ' + token)
                .send(email)
                .end((err, res) => {
                    expect(res).to.have.status(400);


                });
            done();
        });
    });
    describe("Police notification!", () => {
        it("it should return status 400 ", (done) => {
            chai.request(app)
                .get('/parking/notification/' + parkingId)
                .end((err, res) => {
                    expect(res).to.have.status(200);


                });
            done();


        });
    });

    describe('/DELETE/:id', () => {
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