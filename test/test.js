var timer = require("timers");
var assert = require('assert');
var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should;
var account = require('../Controller/AccountControl');
var restClient = require('../API/RestClient');

chai.use(require('chai-json'));

describe('AccountControl', function() {
  describe('#handleBalanceResponse', function() {
    it('should return balance of savings account', function(done) {
        this.timeout(0);
        var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';        
        restClient.getAccount(url, null, 'Jack', 'savings', function(body, session, username, accountType) {
            expect(body).to.be.a.jsonFile();
          });
    });
  });
});

var session = {
    msg : "",

    get msg() {
        return this.msg;
    },

    set msg(x) {
        this.msg = x;
    },

    send(x) {
        this.msg = x;
    }

}

var validBody = [
    {
        "id": "d2241c31-b500-434d-97af-9aba987697c2",
        "createdAt": "2017-11-26T01:59:39.945Z",
        "updatedAt": "2017-11-26T01:59:40.023Z",
        "version": "AAAAAAAAB9I=",
        "deleted": false,
        "username": "Jack",
        "account_number": "12-3456-7891011-12",
        "account_type": "savings",
        "balance": 89.56
    },
    {
        "id": "30dab39a-a1c8-491e-8f02-1d248d94dd17",
        "createdAt": "2017-11-26T03:27:08.653Z",
        "updatedAt": "2017-11-26T03:27:08.653Z",
        "version": "AAAAAAAAB9c=",
        "deleted": false,
        "username": "Jack",
        "account_number": "91-7257-1164271-07",
        "account_type": "fastsaver",
        "balance": 0
    }
]