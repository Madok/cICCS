var express = require('express');
var router = express.Router();
var QueryBuilder = require("./../dbAdapter/QueryBuilder");

/* GET home page. */

var sForm = require("./../forms/studentForm");

router.get('/', function(req, res) {
  var q=new QueryBuilder("student");
    q.select();
    dbAdapter.query(q,function(r,f){
        res.render('index', { students: r,studentForm: sForm.studentForm().preperForm("/student/add","GET")});

    });

});
router.post('/student/add',function(req,res){
    cryptoServer.reqHandle(req,res,function(req,res) {
        sForm.studentForm().handle(req, {
            success: function (form) {
                var q = new QueryBuilder("student");
                q.insertInto().addData({
                    first_name: form.data.first_name,
                    last_name: form.data.last_name,
                    number: form.data.index
                });
                dbAdapter.query(q, function () {
                    dbAdapter.lastInsertID(function (i) {
                        res.cJson({status: "success", data: Object.keys(form.fields).map(function (k) {
                                f = form.fields[k];
                                return {
                                    name: f.name,
                                    error: null,
                                    value: f.value,
                                    fieldId: "id_" + f.name
                                };
                            }
                        ), id: i
                        });
                    })
                })
            },
            error: function (form) {
                res.cJson({status: "error", data: Object.keys(form.fields).map(function (k) {
                        f = form.fields[k];
                        return {
                            name: f.name,
                            error: f.error || null,
                            value: f.value,
                            fieldId: "id_" + f.name
                        };
                    }
                )});
            },
            empty: function (form) {
                res.cJson(form.data);
            }
        });
    });

});
router.post('/student/delete',function(req,res){
    var q=new QueryBuilder('student');
    q.delete();
    cryptoServer.reqHandle(req,res,function(req,res) {
        if (req.body && req.body.id) {
            q.where.where("id = " + req.body.id);
            dbAdapter.query(q, function (r, f) {
                res.cJson({
                    status: 'success'
                });
            });
        } else {
            res.cJson({
                status: 'error'
            });
        }
    });
});
router.post('/test/crypto',function(req,res){
    var m = JSON.parse(cryptoServer.decryptData(req.body.encodeMsg,res.locals.secret.iv));
    res.send(m);
});
module.exports = router;
