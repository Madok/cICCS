/**
 * Created by Politechnika on 2014-12-28.
 */
if(!console.error){
    console.error = console.log;
}
if(!Array.prototype.map){
    Array.prototype.map = function(callback){
        for(a in this){
            this[a]= callback(this[a],a,this);
        }
        return this;
    }
}
if(!Array.prototype.forEach){
    Array.prototype.forEach = function(callback){
        for(a in this){
            callback(this[a],a,this);
        }
    }
}
if(!Array.prototype.reduce){
    Array.prototype.reduce = function(callback){
        if(this.length == 0){
            return null;
        }
        if(this.length == 1){
            return callback(this[0],this[0],0,this);
        }
        var res=this[0];
        for(a in this.slice(1)){
            res=callback(res,this[a],a,this);
        }
        return res;
    }
}
$.fn.preperForm = function(){
    if(!this.is('form')){
        return {};
    };
    var v={};
    $.each(this[0].elements, function(i, field) {
        v[field.name] = {
            value: field.value,
            id: field.id,
            name: field.name,
            e: field
        };
    });
    return v;
};
$.myCookie = (function(){
    var cookie = null;
    var o = {};

    function parse(a){
        var z = a.split('=').map(function(b){
           return decodeURIComponent(b);
        });
        return z;
    }
    cookie = document.cookie.split('; ').reduce(function(a,b,c){
        var z;
        console.log(a,b,c);
        if(c==1){
            var r = a;
            a={};
            z = parse(r);
            r[z[0]] = z[1];
        }
        z=parse(b);
        a[z[0]] = z[1];
        return a;

    });

    return cookie;
})();
var_dump_json = function(a,b){
  var h = "";
    var g=b;
   if(!g){
      g=1;
  }
  function r(d,s){
    var kk = "";
    if(s==0){
        return JSON.stringify(d);
    }
    if(typeof(d) === "object"){
        Object.keys(d).forEach(function(a,i){
            kk += a+':'+r(d[a],s-1)+',<br>';
        });
        return '{'+kk.slice(0,kk.length-5)+"}";
    }
    return JSON.stringify(d);
  }
  if(typeof(a) != "object"){
      return JSON.stringify(a);
  }
  Object.keys(a).forEach(function(o,i){
        h += o+':'+r(a[o],g)+',<br>';
   });
   return '{'+h.slice(0, h.length-5)+'}';
};