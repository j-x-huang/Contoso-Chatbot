var timer = require("timers");
var assert = require('assert');
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should;
var request = require("request");



describe('Rest', function() {
  describe('#getRequest', function() {
    it('should return balance of savings account', function(done) {
        this.timeout(0);
        var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';   
        
        request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body) {
            expect(res.statusCode).to.equal(200);
            done();
        });

    });
  });
});

describe('Rest', function() {
    describe('#postRequest', function() {
      it('should return balance of savings account', function(done) {
          this.timeout(0);
          var url = 'http://contosobankgroup.azurewebsites.net/tables/Account'; 
          
          var options = {
            url: url,
            method: 'POST',
            headers: {
                'ZUMO-API-VERSION': '2.0.0',
                'Content-Type':'application/json'
            },
            json: {
                "username" : "Test",
                "account_number" : "00-0000-0000000-00",
                "account_type" : "test",
                "balance" : 0
            }
          };
          
          request(options, function (err, res, body) {
            expect(res.statusCode).to.equal(201);
            done();
          });
  
      });
    });
  });

  describe('Rest', function() {
    describe('#getStocks', function() {
      it('should return balance of savings account', function(done) {
          this.timeout(0);
          var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=P20P9RQXQ5YG6ZCT';
          
          var options = {
            url: url,
            method: 'GET'
        }
    
        request(options,function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
  
      });
    });
  });

  describe('Rest', function() {
    describe('#getRates', function() {
      it('should return balance of savings account', function(done) {
          this.timeout(0);
          var url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=NZD&apikey=P20P9RQXQ5YG6ZCT';
          
          var options = {
            url: url,
            method: 'GET'
        }
    
        request(options,function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
  
      });
    });
  });

  describe('Rest', function() {
    describe('#postQnAResults', function() {
      it('should return balance of savings account', function(done) {
          this.timeout(0);
          var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/202ea05b-d3ae-4b45-8b81-32d6313f1b87/generateAnswer';
          
          var options = {
            url: url,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': 'd1ee374ec2804822b7134039a2811828',
                'Content-Type':'application/json'
            },
            json: {
                "question" : "Hi"
            }
          };
    
        request(options,function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
  
      });
    });
  });

  describe('Rest', function() {
    describe('#postImage', function() {
      it('should return balance of savings account', function(done) {
          this.timeout(0);
          var url = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/135e5615-498b-4a2b-a9ed-134815a07f6a/url?iterationId=b7f65256-ec2d-40d9-8687-985bf0e308c9';
          
          var options = {
            url: url,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'b582db3effb145019697ca4ea0b6a6f6'
            },
            json: { 'Url': 'https://i.imgur.com/HfuBWea.png' }
        };
    
        request(options,function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
  
      });
    });
  });
