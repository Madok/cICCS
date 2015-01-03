/**
 * Created by Politechnika on 2014-12-19.
 */

var mysql = require("mysql");

function DbAdapter(){
    var o = this;
    var configConnetion = {
        host : "127.9.5.130",
        user : "adminrz7ZPdQ",
        password : "MSMv7FLblvIk",
        database : "ciccs"

        };
    var lastResult = null;
    var connection=null;
    o.setHost = function(a){
        configConnetion.host = a;
    };
    o.setUser = function(a){
        configConnetion.user = a;
    };
    o.setPassword = function(a){
        configConnetion.password = a;
    };
    o.setDatabase = function(a){
        configConnetion.database = a;
    };
    o.connection = function(){
        connection = mysql.createConnection({
            host     : configConnetion.host,
            user     : configConnetion.user,
            password : configConnetion.password,
            database : configConnetion.database
        });
        connection.connect();
        console.info("dbAdapter : database connecting");
    };
    o.query = function(query,callback){
        console.info("dbAdapter query\n"+query.build());
        connection.query(query.build(),function(err, rows, fields){
            console.log("Mysql \n"+query.build());
            if (err) throw err;
            callback(rows,fields);
        });
    }
    o.getResult = function(){
        var r = lastResult;
        return r;
    };
    o.close = function(){
        connection.end();
        console.info("dbAdapter : database connection close ");
    }
    o.lastInsertID = function(callback){
        connection.query("SELECT LAST_INSERT_ID() ",function(err, rows, fields){
            console.log("Mysql \nSELECT LAST_INSERT_ID() "+rows);
            if (err) throw err;
            callback(rows[0]["LAST_INSERT_ID()"]);
        });
    }
}

module.exports = new DbAdapter();