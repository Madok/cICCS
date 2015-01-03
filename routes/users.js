var express = require('express');
var router = express.Router();
var auth = require("./../dbAdapter/auth");

/* GET users listing. */
router.get('/login', function(req, res) {

    res.render('login');
});
router.post('/login', function(req, res) {

    auth.auth(req,function(isAuth,user){
        if(isAuth){
            res.redirect("/");
        }else{

            res.render('login');
        }
    });
});
router.get('/logout', function(req, res) {

    auth.destroySession(req,function(){
        req.session.destroy();
        req.session = null;
        res.redirect("user/login");

    })
});
module.exports = router;
