/**
 * Created by Politechnika on 2014-12-21.
 */
var Where = require("./Where");

function QueryBuilder(from){
    var o = this;

    var queryType = "Select";
    var table = from;
    var select = "*";
    var update = "";
    var insert = [[],[]];
    var where = Object.freeze(new Where());

    o.select = function(selecting){
        if(selecting === undefined || selecting === null || selecting === ""){
            select = "*";
        }else{
            select = selecting;
        }
        queryType = "Select";
        return o;
    };
    o.addData = function(a){
        Object.keys(a).forEach(function(b){
            insert[0].push(b);
            insert[1].push('"'+a[b]+'"');

        });
        return o;
    };
    o.update = function(updating){
        if(updating === undefined || updating === null || updating === "" || !Object.keys(updating).length){
            update = null;
        }else{
            update = updating;
        }
        queryType = "Update";
        return o;

    };
    o.insertInto = function(inserting){
        if(inserting === undefined || inserting === null || inserting === "" || !Object.keys(inserting).length){
            insert = [[],[]];
        }else{
            insert = inserting;
        }
        queryType = "InsertInto";
        return o;
    };
    o.delete = function(){
        queryType = "Delete";
        return o;
    };
    o.__defineGetter__("where",function(a){
        return where;
    });
    /** select */
    function buildSelected(){
        var quety = "Select ";
        if(select instanceof String && select !== ""){
            quety += select;
        }else{
            quety += "* ";
        }
        quety += 'FROM '+preperFrom();
        var w=where.buildQuery();
        if(w!="")
            quety += "WHERE "+w;
        return quety;
    }
    function buildInserInto(){
        var query = "INSERT INTO "+preperFrom();
        query +='('+insert[0].toString()+')VALUES(';
        query += insert[1].toString()+')';
        return query;
    }
    function buildDelete(){
        var query = "DELETE FROM "+preperFrom()+" WHERE "+where.buildQuery();
        return query;
    }
    function preperFrom(){
        var a = "";
        if(typeof table ===  "string"){
            a = table+" ";
        }
        return a;
    }
    o.build = function(){
        var query = "";
        query += queryType+" ";
        if(queryType==="Select"){
            return buildSelected();
        } else if(queryType==="InsertInto"){
            return buildInserInto();
        } else if(queryType==="Delete"){
            return buildDelete();
        }
    };

}

module.exports = QueryBuilder;