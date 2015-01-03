/**
 * Created by Politechnika on 2014-12-29.
 */
var cr = require("crypto-js");
var key="ced575f7724086f405e009cb49ed102a";

function cryptoServer(){
    var o=this;


    o.generateKey = function(){

        return cr.enc.Hex.parse("").random(16).toString()
    };
    o.encryptData = function(data,iv){
        var dp = '';
        var en = "";
        var op = {};
        if(typeof data === 'object'){
            dp = JSON.stringify(data);
        }else{
            dp = data.toString();
        }
        if(iv){
            op.iv = iv;
        }
        en = cr.AES.encrypt(dp,key,op).toString();
        return cr.enc.Hex.stringify(cr.enc.Base64.parse(en));
    };
    o.decryptData = function(data,iv){
        var r = "";
        var op={};
        r = cr.enc.Base64.stringify(cr.enc.Hex.parse(data));

        if(iv){
            op.iv = iv;
        }
        return cr.AES.decrypt(r,key,op).toString(cr.enc.Utf8);
    };
    o.getKey = function(){
        return key;
    };
    o.reqHandle = function(req,res,callback,errorHandle){
        if(req.body && req.body.cryptoClient){
            var d = JSON.parse(o.decryptData(req.body.secret,res.locals.iv));
            req.body = d;

            res.cJson = function(j){
                var f = o.encryptData(j,res.locals.iv);
                res.json({
                    'cryptoServer': true,
                    secret:f
                });
            };
            callback(req,res);
        }else{
            res.status(422);
            res.json({error:"INVALID data for cryptoServer"});
        }
    }
}
module.exports = new cryptoServer();
