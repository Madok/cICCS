/**
 * Created by Politechnika on 2014-12-21.
 */
function Where(){
    var o = this;
    var where = [];

    function preperInstruction(e){
        var query;
        if(e instanceof Where){
            query = e.buildQuery();
        }else{
            query = e;
        }
        return query;
    }

    o.where = function(a){
        where.push({type:'and',q:a});
        return o;
    }
    o.and = function(a){
        where.push({type:'and',q:a});
        return o;
    }
    o.or = function(a){
        where.push({type:'or',q:a});
        return o;
    }
    o.clear = function(){
        where = [];
    };
    o.buildQuery = function(){
        var query = "(";
        if(where.length){
            query += where[0].q;

            where.slice(1).forEach(function(e){
                if(e.type == "or"){
                    query += " OR "+preperInstruction(e.q);
                }else{
                    query += " AND "+preperInstruction(e.q);
                }
            });

            query += ")";
        }else query = "";
        return query;
    };

};

module.exports = Where;