$(document).ready(function(){
    $("#scheduleTable").DataTable({
        autoWidth : false,
        scrollY: true,
        dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
        searching : false,
        sorting : false,
        filter:false,
        pagingType: "full",
        language: {
            lengthMenu: '<span>Show:</span> _MENU_',
        },
        columns : [
            {"data" : "scheduleIdx"},
            {"data" : "scheduleName"},
            {"data" : "scheduleType"},
            {"data" : "useYn"},
            {"data" : "updDt"}
        ],
        serverSide : true,
        processing : true,
        ajax : {
            url: contextPath + "/schedule/search",
            type: "POST",
            contentType: "application/json",
            data: function(sendData){
                sendData["limit"] = sendData.start+sendData.length;
                sendData["limitStart"] = sendData.start;
                sendData["currentPage"] = sendData.start/sendData.length;
                return JSON.stringify(sendData);
            }
        }
    });

    let scheduleTable = $("#scheduleTable").DataTable();

    $('#scheduleTable tbody').on('dblclick', 'tr', function () {
        var data = scheduleTable.row( this ).data();
        $("#scheduleIdx").val(data.scheduleIdx);
        loadMailingData();
        $("#mailingModal").modal('show')
    });

    $('.tagsinput').tagsinput();

    taginputEventInit($("#receivers"));
    taginputEventInit($("#referencers"));

    $("#mailingModal").on("hide.bs.modal",function(){
        $("#referencers").tagsinput("removeAll");
        $("#receivers").tagsinput("removeAll");
    });

});



function saveMailingData(){
    let sendData = [];
    let receivers = $("#receivers").tagsinput("items");
    let scheduleIdx = $("#scheduleIdx").val()
    for(let i = 0 ; i < receivers.length ; i++){
        let data = {};
        data["infoScheduleIdx"] = scheduleIdx;
        data["infoType"] = "RECEIVER";
        data["infoContent"] = receivers[i];
        sendData.push(data);
    }

    let referencers = $("#referencers").tagsinput("items");
    for(let i = 0 ; i < referencers.length ; i++){
        let data = {};
        data["infoScheduleIdx"] = scheduleIdx;
        data["infoType"] = "REFERENCER";
        data["infoContent"] = referencers[i];
        sendData.push(data);
    }

    $.ajax({
        url : contextPath + "/mailing/insert",
        type : "POST",
        contentType : "application/json",
        data : JSON.stringify(sendData),
        success : function(data){
           if(data.data){
                alertMessage("Success!","Save Mailing Information","success");
                $("#mailingModal").modal('hide')
           }else{
               alertMessage("Fail!","Call Developer or Admin","danger");
               $("#mailingModal").modal('hide');
           }
        },
        fail : function(error){
            console.log(error);
        }
    });
}

function loadMailingData(){
    let sendData = {};
    sendData["infoScheduleIdx"] = $("#scheduleIdx").val();
    $.ajax({
        url : contextPath+"/mailing/list",
        type : "POST",
        contentType : "application/json",
        data : JSON.stringify(sendData),
        success : function(data){
            if(data.data.length > 0){
                for(let i = 0 ; i < data.data.length ; i++){
                    if(data.data[i].infoType == "REFERENCER"){
                        $("#referencers").tagsinput("add",data.data[i].infoContent);
                    }else if(data.data[i].infoType == "RECEIVER"){
                        $("#receivers").tagsinput("add",data.data[i].infoContent);
                    }
                }
            }

        },
        fail : function(error){
            console.log(error);
        }
    });
}

function taginputEventInit(item){
    $(item).on("beforeItemAdd",function(event){
        if(!testEmailRule(event.item)){
            tagsInputAnimation($(this).parent().children("div"),"shake");
            event.cancel = true;
            return false;
        }
    });
}





