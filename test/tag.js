
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

var tagTestId = null;

describe('Tag methods', () => {

    describe('/POST & GET Tag', () => { 

        it('it should show all tag list', (done) => {
            
            chai.request(server)
                .get('/api/tag/get/list')                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                        
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);			  	    
                    done();
                });
        });
        
        it('it should add new test-tag', (done) => {

            var reqData = {
                tag: "test-tag",
                color: "000000"
            };

            chai.request(server)
                .post('/api/tag/add')
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

        it('it should get test-tag by name', (done) => {

            chai.request(server)
                .get('/api/tag/get/name/test-tag')                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);  
                    
                    tagTestId = resData.data.id;                    
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should get test-tag by id', (done) => {

            chai.request(server)
                .get('/api/tag/get/id/'+tagTestId)                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                                                                
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should update test-tag color', (done) => {

            var reqData = {
                id : tagTestId,
                tag : "test-tag",
                color : "111111"                
            };

            chai.request(server)
                .post('/api/tag/update')
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

        it('it should delete test-tag', (done) => {

            var reqData = {
                id : tagTestId
            };

            chai.request(server)
                .post('/api/tag/delete')
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
        
    });
});