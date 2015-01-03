/**
 * Created by Politechnika on 2015-01-03.
 */
$(document).ready(function(){
    var contentId = "managerCC";
    var s = '<div id="'+contentId+'"><div class="managerCC-body clientRequest"></div>'+
        '<div class="managerCC-body serverRes"></div>'+
        '</div>';
    var cR = '<div class="managerCC-head">zapytanie</div>'+
        '<div class="managerCC-content"><div></div></div>';
    var sR = '<div class="managerCC-head">odpowiedz servera</div>'+
        '<div class="managerCC-content"><div></div></div>';
    $.fn.managerCC = function(){
        this.append(s);
        var cRHandle= this.find("#"+contentId+" .clientRequest");
        var sRHandle = this.find("#"+contentId+" .serverRes");
        cRHandle.append(cR);
        sRHandle.append(sR);

        $.cryptoClient.setEveryBeforePrepareData(function(data){
            var a=cRHandle.find('.managerCC-content div');
            var b=sRHandle.find('.managerCC-content div');
            b.html("");
            a.html("");
            a.append("<h4>dane do wyslania:</h4>"+var_dump_json(data,2)+'<br>');
        });
        $.cryptoClient.setEveryAfterPrepareData(function(data){
            var a=cRHandle.find('.managerCC-content div');

            a.append("<h4>dane zaszyfrowane:</h4>"+var_dump_json(data)+'<br>');
        });
        $.cryptoClient.setEveryBeforeFilterData(function(data){
            var a=sRHandle.find('.managerCC-content div');
            a.append("<h4>odpowiedz servera:</h4>"+var_dump_json(data)+'<br>');
        });
        $.cryptoClient.setEverySuccess(function(data){
            var a=sRHandle.find('.managerCC-content div');
            a.append("<h4>dane odszyfrowane:</h4>"+var_dump_json(data,2)+'<br>');
        });
        $.cryptoClient.setEveryError(function(j,s,m){
            var a=sRHandle.find('.managerCC-content div');
            a.append("<div class=\"alert alert-danger\">Error: "+m+" </div>");
        });
        $.cryptoClient.setEveryCryptoError(function(d,j){
            var a=sRHandle.find('.managerCC-content div');
            a.append("<div class=\"alert alert-danger\">Error: "+d.error+" </div>");
        });
    }
    $("#managerCryptoClient #managerCryptoClientViewRequest").managerCC();
});