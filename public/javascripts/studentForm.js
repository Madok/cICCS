/**
 * Created by Politechnika on 2014-12-28.
 */
$(document).ready(function(){
    $("#addStudentForm").submit(function (e) {
        e.preventDefault();
    });
    $('#spinStudent .spin').spin();
    $("#addStudentButton").on("click",function(e) {
        var d = {};
        $('#spinStudent .spin').spin('show');
        $('#spinStudent').show();
        $.each($("#addStudentForm").preperForm(), function (i, b) {
            d[b.name] = b.value;
        });

        $.cryptoClient.send("/student/add", {
            data: d,
            beforePrepareData: function (data) {
                console.info("cC : ", data);
            },
            afterPrepareData: function(data){
                console.info("aC: ",data);
            },
            success: function (data) {
                console.log("sD : ",data);
                $(".student-field-alert-error").remove();
                if (data.status == 'error') {
                    for (e in data.data) {
                        if (data.data[e].error) {
                            $('#' + data.data[e].fieldId).parent().before("<div class=\"alert alert-danger student-field-alert-error\">" + data.data[e].error + "</div>")
                        }
                    }
                } else {
                    var tr = $("#studentsList tbody").append("<tr>").children('tr').last();
                    tr.append("<td>" + ($('#studentsList tbody').children('tr').length));
                    for (e in data.data) {
                        tr.append("<td>" + data.data[e].value);
                    }
                    tr.append("<td><button class='btn btn-danger'data-studentid=\"" + data.id + "\"><span class=\"glyphicon glyphicon-remove\"");
                    $("#addStudentForm")[0].reset();
                    $('#addStudentModal').modal('hide');
                }
            },
            error: function (data) {
                $("#addStudentForm")[0].reset();
                $('#addStudentModal').modal('hide');
            },
            complete: function () {
                $('#spinStudent').animate({
                    opacity: 1
                }, 1000, function () {
                    $('#spinStudent').hide();
                    $('#spinStudent .spin').spin('hide');

                });
            }
        });
    });
//        $.post("/student/add",d).done(function(data){
//            $(".student-field-alert-error").remove();
//            if(data.status=='error'){
//                for(e in data.data){
//                    if(data.data[e].error) {
//                        $('#'+data.data[e].fieldId).parent().before("<div class=\"alert alert-danger student-field-alert-error\">" + data.data[e].error +"</div>")
//                    }
//                }
//            }else {
//                var tr = $("#studentsList tbody").append("<tr>").children('tr').last();
//                tr.append("<td>"+($('#studentsList tbody').children('tr').length));
//                for (e in data.data) {
//                    tr.append("<td>"+data.data[e].value);
//                }
//                tr.append("<td><button class='btn btn-danger'data-studentid=\""+data.id+"\"><span class=\"glyphicon glyphicon-remove\"");
//                $("#addStudentForm")[0].reset();
//                $('#addStudentModal').modal('hide');
//            }
//        }).fail(function(data){
//            $("#addStudentForm")[0].reset();
//            $('#addStudentModal').modal('hide');
//        }).always(function(){
//            $('#spinStudent').animate({
//                opacity: 1
//            },1000,function(){
//                $('#spinStudent').hide();
//                $('#spinStudent .spin').spin('hide');
//
//            });
//        });
//    });
    $(document).delegate('#studentsList .btn-danger[data-studentid]','click',function(e){
        var row = $(this).parents('tr');
        $('#deleteStudentModal button.btn-danger').data({'id':$(this).data('studentid'),row:row});
        $('#deleteStudentModal').modal('show');
    });
    $('#deleteStudentModal button.btn-danger').on('click',function(e){
        var row = $(this).data('row');
        console.log($(this).data());
        $('#spinStudent .spin').spin('show');
        $('#spinStudent').show();
        $.cryptoClient.send("/student/delete",{
            data:{id:$(this).data('id')},
            success:function(data){
                row.remove();
            },
            complete:function(data){
                $('#spinStudent').animate({
                    opacity: 1
                },500,function(){
                    $('#spinStudent').hide();
                    $('#spinStudent .spin').spin('hide');

                });
                $('#deleteStudentModal').modal('hide');
            }

        });
//        $.post("/student/delete",{id:$(this).data('id')}).
//            done(function(data){
//                row.remove();
//            }).
//            always(function(data){
//                $('#spinStudent').animate({
//                    opacity: 1
//                },500,function(){
//                    $('#spinStudent').hide();
//                    $('#spinStudent .spin').spin('hide');
//
//                });
//                $('#deleteStudentModal').modal('hide');
//            });
    });
});