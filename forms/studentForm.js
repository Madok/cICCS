/**
 * Created by Politechnika on 2014-12-27.
 */
var forms = require('forms');
var field = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;
var QueryBuilder = require('./../dbAdapter/QueryBuilder');

var studentForm = forms.create({
    first_name: field.string({
        required: true,
        validators: [validators.minlength(3,"min 3 znaki"),validators.maxlength(30,"max 30 znakow")]
    }),
    last_name: field.string({
        required: true,
        validators: [validators.minlength(3,"min 3 znaki"),validators.maxlength(30,"max 30 znakow")]
    }),
    index: field.number({
        required: true,
        validators: [validators.integer("prosze podac liczbe calkowita"),validators.range(100000,999999,"prosze podac liczbe 6 cyfrowa")]

    })
});
studentForm.preperForm = function(action,method,c){
    var form  = "<form action=\""+action+'" method="'+method+'" id="addStudentForm"';
    if(c && typeof c.length){
        form += 'class="'+c.reduce(function(a,b){return a+' '+b;} );
        form += '" ';
    }
    form += ">"+this.toHTML(bootstrapField)+"</form>";
    return form;
};
var bootstrapField = function (name, object) {
    object.widget.classes = object.widget.classes || [];
    object.widget.classes.push('form-control');

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="alert alert-error help-block">' + object.error + '</div>' : '';

    var validationclass = object.value && !object.error ? 'has-success' : '';
    validationclass = object.error ? 'has-error' : validationclass;

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group ' + validationclass + '">' + label + widget + error + '</div>';
};
function myView(req, res,dbAdapter) {
    studentForm.handle(req, {
        success: function (form) {
            var q=new QueryBuilder('student');
            q.insertInto().addData({
                first_name: form.data.first_name,
                last_name: form.data.last_name,
                number: form.data.index
            });
            dbAdapter.query(q,function(a,b){
                res.json(form.data);
            });
        },
        error: function (form) {
            res.send(form.toHTML());
        },
        empty: function (form) {
            res.send(form.toHTML());
        }
    });
}
module.exports.studentForm = function(){
    return studentForm;
};
module.exports.bootstrapField = function(name, object){
    return bootstrapField(name, object);
};
module.exports.view = function(req, res,dbAdapter){
    myView(req, res,dbAdapter);
};
