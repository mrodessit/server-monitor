
//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

var userTestId = null;

describe('User methods', () => {

    // clean DB after test
    /*
    after((done) => { 
        
        userManager.findByName('test-user')
            .then((user) => {
                return userManager.delete(user);
            })
            .then(() => {
                done();
            })
            .catch((err) => {
                console.log(err);
            })
	});
    */

    describe('/POST & GET User', () => { 

        it('it should show all user list', (done) => {
            
            chai.request(server)
                .get('/api/user/get/list')                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                        
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);			  	    
                    done();
                });
        });
        
        it('it should add new test-user', (done) => {

            var reqData = {
                username: "test-user",
                password: "test-password",
                isadmin: 1
            };

            chai.request(server)
                .post('/api/user/add')
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

        it('it should get test-user by name', (done) => {

            chai.request(server)
                .get('/api/user/get/name/test-user')                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);  
                    
                    userTestId = resData.data.id;                    
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should get test-user by id', (done) => {

            chai.request(server)
                .get('/api/user/get/id/'+userTestId)                
                .end((err, res) => {       
                    res.should.have.status(200);
 
                    var resData = JSON.parse(res.text);                                                                                
                    
                    resData.should.be.a('object');
                    resData.should.have.property('result').eql(true);
			  	    resData.should.have.property('msg');
                    done();
                });
        });

        it('it should update test-user password', (done) => {

            var reqData = {
                id : userTestId,
                oldPassword : "test-password",
                newPassword1 : "qwerty123",
                newPassword2 : "qwerty123"
            };

            chai.request(server)
                .post('/api/user/update')
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

        it('it should delete test-user', (done) => {

            var reqData = {
                id : userTestId
            };

            chai.request(server)
                .post('/api/user/delete')
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