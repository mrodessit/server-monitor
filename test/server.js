
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

var serverTestId = null;
var serverIp = "255.0.0.210";

describe('Server methods', () => {

    describe('/POST & GET Server', () => { 

        it('it should show all server list', (done) => {
            
            chai.request(server)
                .get('/api/server/get/list')                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                        
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);			  	    
                    done();
                });
        });

        it('it should add new server '+serverIp, (done) => {

            var reqData = {
                servers: serverIp
            };            

            chai.request(server)
                .post('/api/server/add/array')
                .send(reqData)
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                        
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });        

        it('it should find server by IP', (done) => {            

            chai.request(server)
                .get('/api/server/get/ip/'+serverIp)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    serverTestId = resData.data[0].id;

                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should find server by ID', (done) => {            

            chai.request(server)
                .get('/api/server/get/id/'+serverTestId)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should pause server by ID', (done) => {

            chai.request(server)
                .get('/api/server/pause-run/'+serverTestId)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should add tag to server', (done) => {

            var reqData = {
                servers: [serverTestId],
                tags: ['windows', 'linux']
            };

            chai.request(server)
                .post('/api/server/tags/insert')
                .send(reqData)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should delete tag from server', (done) => {

            var reqData = {
                servers: [serverTestId],
                tags: ['windows', 'linux']
            };

            chai.request(server)
                .post('/api/server/tags/delete')
                .send(reqData)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should delete server by ID', (done) => {            

            chai.request(server)
                .get('/api/server/delete/'+serverTestId)
                .end((err, res) => {
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

    });
});