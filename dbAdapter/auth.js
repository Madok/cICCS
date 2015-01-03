/**
* Created by Politechnika on 2014-12-22.
    */
var QueryBuilder = require("./QueryBuilder");

function saveSession(req,userID,secrest){
    var query = new QueryBuilder("session");
    query.insertInto().addData({
        session_id : req.sessionID,
        user_id : userID,
        sicret : secrest||123456
    });
    dbAdapter.query(query,function(){

    });
};
function checkSession(sessionId){


}
module.exports.auth = function(req,callback){
    var queryBuilder = new QueryBuilder("users");
    queryBuilder.select().where.where('name = "'+req.body.name+'"').and('password = MD5("'+req.body.password+'")');
    console.log("auth\n"+queryBuilder.build());
    dbAdapter.query(queryBuilder,function(a,b){
        if(a && a[0]){
            saveSession(req,a[0]['id'],cryptoServer.generateKey());
            callback(true,a[0]);
        }else{
            callback(false,null);
        }
    });
};
module.exports.authSession = function(req,callback){
    if(!req.sessionID){
        return false;
    }
    var query = new QueryBuilder("session");
    query.select().where.where("session_id = \""+req.sessionID+'"');
    var selectUser = new QueryBuilder("users");

    dbAdapter.query(query,function(row,f){
        if(row[0]){
            selectUser.select().where.where("id="+row[0]['user_id']);
            dbAdapter.query(selectUser,function(us,f){
                callback(true,us[0],row[0]['sicret']);
            });
        }else{
            callback(false,null);
        }
    });

}
module.exports.destroySession = function(req,callback){
    var q = new QueryBuilder('session');
    q.delete().where.where("session_id=\""+req.sessionID+'"');
    dbAdapter.query(q,function(r,f){
        callback();
    })
}