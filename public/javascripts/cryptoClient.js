/**
 * Created by Politechnika on 2014-12-30.
 */
if(jQuery && jQuery.ajax)
    if(!CryptoJS || !CryptoJS.AES){
        throw new Error("Error in cryptoClient: CryptoJS or CryptoJS.AES not exist");
    }else
     if(!jQuery.myCookie){
        throw new Error("Error in cryptoClient: jQuery.myCookie not exist");
    }else
    (function($){
        var t=this;
        var iv = $.myCookie['user.iv'];
        var key = "ced575f7724086f405e009cb49ed102a";
        var aes = CryptoJS.AES;
        var hex = CryptoJS.enc.Hex;
        var base64 = CryptoJS.enc.Base64;
        var utf8 = CryptoJS.enc.UTF8;
        var everyBeforePrepareData = null;
        var everyComplete = null;
        var everySuccess = null;
        var everyError = null;
        var everyAfterPrepareData = null;
        var everyBeforeFilterData = null;
        var everyCryptoError = null;

        function senderStorage(o){
            var ca = {
                beforeSend: function(){},
                cryptoError:function(){},
                error: function(){},
                complete: function(){},
                success: function(){},
                beforePrepareData: function(){},
                afterPrepareData: function(){},
                beforeFilterData: function(){}
            };
            var t = this;
            if(o.beforeSend instanceof Function){
                ca.beforeSend = o.beforeSend;
            }
            if(o.error instanceof Function){
                ca.error = o.error;
            }
            if(o.complete instanceof Function){
                ca.complete = o.complete;
            }
            if(o.success instanceof Function){
                ca.success = o.success;
            }
            if(o.cryptoError instanceof Function){
                ca.cryptoError = o.cryptoError;
            }
            if(o.beforePrepareData instanceof Function)
                ca.beforePrepareData = o.beforePrepareData;
            if(o.afterPrepareData instanceof Function)
                ca.afterPrepareData = o.afterPrepareData;
            if(o.beforeFilterData instanceof Function)
                ca.beforeFilterData = o.beforeFilterData;
            return {
                error: ca.error,
                success: ca.success,
                complete: ca.complete,
                beforeSend: ca.beforeSend,
                cryptoError: ca.cryptoError,
                beforePrepareData: ca.beforePrepareData,
                afterPrepareData: ca.afterPrepareData,
                beforeFilterData: ca.beforeFilterData
            }

        };
        var sender = new senderStorage({});
        function dataFilter(d,t){

            if(t === 'json'){
                var p_d = JSON.parse(d);
                beforeFilterData(p_d);
                if(p_d['cryptoServer'] === true){
                    var b64 = base64.stringify(hex.parse(p_d['secret']));
                    var data = aes.decrypt(b64,key,{iv:iv}).toString(CryptoJS.enc.Utf8);

                    return JSON.stringify({
                        status:1,
                        data: JSON.parse(data),
                        error:null
                    });
                }else{
                    return JSON.stringify({
                        status:2,
                        data:p_d,
                        error:"data does not derive from the cryptoServer"
                    });
                }
            }
            return JSON.stringify({
                status:3,
                data:d,
                error:"data is not of type json"
            });
        }
        function cryptoEncode(data){
            var d = JSON.stringify(data);
            var en = aes.encrypt(d,key,iv).toString();
            var h = hex.stringify(base64.parse(en));
            return h;
        }
        function prepareBeforeSendHandler(jqXHR, settings){
            beforeSend();
            sender.beforeSend();
        }
        function prepareErrorHandler(jqXHR, textStatus, errorThrown ){
            error(jqXHR,textStatus,errorThrown);
            sender.error(jqXHR,textStatus,errorThrown);
        }
        function prepareSuccessHandler(data,textStatus,jqXHR){

            switch (data.status){
                case 1:
                    success(data.data);
                    break;
                case 2:
                    cryptoError(data,jqXHR);
                    break;
                case 3:
                    cryptoError(data,jqXHR);
                    break;
                default :
                    cryptoError(data,jqXHR);
            }
        }
        function prepareCompleteHandler(jqXHR, textStatus){
            complete();
        }
        function beforePrepareData(data){
            if(everyBeforePrepareData instanceof Function)
                everyBeforePrepareData(data);

            sender.beforePrepareData(data);
        }
        function afterPrepareData(data){
            if(everyAfterPrepareData instanceof Function){
                everyAfterPrepareData(data);
            }
            sender.afterPrepareData(data);
        }
        function beforeFilterData(data){
            if(everyBeforeFilterData instanceof Function){
                everyBeforeFilterData(data);
            }
            sender.beforeFilterData(data);
        }
        function error(jqX,tS,eT){
            if(everyError instanceof Function)
                everyError(jqX,tS,eT);

            sender.error(jqX,tS,eT);
        }
        function beforeSend(jqH,s){
            sender.beforeSend(jqH,s);
        }
        function success(data,tS,jqX){
            sender.success(data,tS,jqX);
            if(everySuccess instanceof Function)
                everySuccess(data,tS,jqX);

        }
        function complete(jqX,tS){
            if(everyComplete instanceof Function)
                everyComplete(jqX,tS);
            sender.complete(jqX,tS);

        }
        function cryptoError(data,jqXHR){
            if(everyCryptoError instanceof Function)
                everyCryptoError(data,jqXHR);
            sender.cryptoError(data.data,data.status,jqXHR);
        }
        function prepareAjaxFunction(o){
            delete sender;
            sender = new senderStorage(o);
            var ajax = {
                dataType: "json",
                beforeSend: prepareBeforeSendHandler,
                error: prepareErrorHandler,
                complete: prepareCompleteHandler,
                success: prepareSuccessHandler,
                data: {cryptoClient: true},
                dataFilter: dataFilter,
                type: 'POST'
            };
            if(o.type){
                ajax.type = o.type;
            }
            if(o.data){
                ajax.data.secret = o.data;
            }else{
                ajax.data.secret = {};
            }
            beforePrepareData(ajax.data.secret);
            ajax.data.secret = cryptoEncode(ajax.data.secret);
            afterPrepareData(ajax.data);
            return ajax;
        }


        $.cryptoClient = {
            send: function(u,o){
                return $.ajax(u,prepareAjaxFunction(o));
            },
            setEveryBeforePrepareData: function(f){
                everyBeforePrepareData = f;
            },
            setEveryAfterPrepareData:function(f){
                everyAfterPrepareData = f;
            },
            setEveryComplete: function(f){
                everyComplete = f;
            },
            setEveryError: function(f){
                everyError = f;
            },
            setEverySuccess : function(f){
                everySuccess = f;
            },
            setEveryBeforeFilterData: function(f){
                everyBeforeFilterData = f;
            },
            setEveryCryptoError: function(f){
                everyCryptoError = f;
            },
            setIV: function(i){
                iv = i;
            },
            getIV: function(){
                return iv;
            }
        }
    })(jQuery);