$(document).ready(function () {
    categorySelect();
    searchList();
});

$(window).on('load', function() {
    $("#keyword").keydown(function(key) {
        if (key.keyCode == 13) {
            $("#searchButton").trigger('click');
        }
    });
});

// 영문과 숫자만 입력가능 textbox
$(document).ready(function(){
    //한글입력 안되게 처리
    $("input[name=wordAbbr]").keyup(function(event){
        if (!(event.keyCode >=37 && event.keyCode<=40)) {
            var inputVal = $(this).val().toUpperCase();
            $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
        }
    });

    $("input[name=wordEngNm]").keyup(function(event){
        if (!(event.keyCode >=37 && event.keyCode<=40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
        }
    });
});

//검색 SelectBox 초기화
function categorySelect() {
    $.ajax({
        url : contextPath +"/word/searchType",
        contentType : "application/json",
        type : "GET",
        success : function(data){
            // for(var i = 0; i < data.length; i++) {
            //     if(data[i].columnName == 'WORD_NM') {
            //         var option  = $("<option>");
            //         $(option).val('wordNm').text('단어명');
            //         $("#searchType").append($(option));
            //     }
            //
            //     if(data[i].columnName == 'WORD_ENG_SHORT_NM') {
            //         var option  = $("<option>");
            //         $(option).val('wordEngShortNm').text('단어 영문 약어명');
            //         $("#searchType").append($(option));
            //     }
            //
            //     if(data[i].columnName == 'WORD_ENG_NM') {
            //         var option  = $("<option>");
            //         $(option).val('wordEngNm').text('단어 영문명');
            //         $("#searchType").append($(option));
            //     }
            //
            //     if(data.data[i].columnName == 'WORD_DSCRPT') {
            //         var option  = $("<option>");
            //         $(option).val('wordDscrpt').text('단어 설명');
            //         $("#searchType").append($(option));
            //     }
            // }
        }
    });
}

// 단어 목록
function searchList(searchType, keyword) {
    const dataTable = {
        ele: '#wordTable',
        table: null,
        option: {
            columns: [
                { data: 'wordSeq' },
                { data: 'wordNm' },
                { data: 'wordAbbr' },
                { data: 'wordEngNm' },
                { data: 'summaryWordDscrpt' },
                { data: 'synmList' }
            ]
        },
        init: function () {
            // DataTables 생성
            this.table = Datatables.order(this.ele, this.option, 0);
            this.search();
        },
        search: function () {
            var param = new Object();
            if(keyword != '') {
                param = {
                    "searchType" : searchType,
                    "keyword" : keyword
                }
            }

            // 조회 조건에 따라 데이터를 조회해서 DataTables에 넣는다.
            Datatables.rowsAdd(this.table, contextPath + '/word/list', param);
        }
    };

    dataTable.init();


    $('#wordTable tbody').on('dblclick', 'tr', function () {

        let table = $("#wordTable").DataTable();

        var rowData = table.row( this ).data();

        $("#newButton").click();
        openModal('update', rowData.wordSeq);
    });

    $("#searchType").change(function () {
        $("#keyword").focus();
    });
}

//검색 버튼 클릭 이벤트
function searchWord() {
    let searchType = $("#searchType").val();
    let keyword = $("#keyword").val();
    let table = $("#wordTable").DataTable();

    if(keyword == '') {
        if($("#searchType").val() == 'all') {
            table.destroy();
            searchList();
        } else {
            alertMessage("경고!","검색할 키워드를 입력해주세요.","warning");
            return false;
        };
    }

    //검색한 도메인 정보들을 보여주기 위해 기존 데이터 초기화
    let dataTable = $("#wordTable").DataTable();
    dataTable.destroy();

    //조회 조건을 이용하여 단어 리스트 조회
    searchList(searchType, keyword);
}

//검색 초기화 아이콘 클릭 이벤트
function resetSearch() {
    $("#searchType").val('all');
    $("#keyword").val('')

    let dataTable = $("#wordTable").DataTable();
    dataTable.destroy();
    searchList();
}

//모달 초기화
//신규 등록 및 상세 보기
function openModal(type, wordSeq) {
    clearFormData();

    //add = 신규등록 , update = 상세보기
    if(type == 'add') {
        $("#modal #saveButton").show();
        $("#modal #updateButton").hide();
        $("#modal #deleteButton").hide();
        $("#modal .modal-title").html('단어 신규 등록');
    } else if (type == 'update'){
        $("#modal #saveButton").hide();
        $("#modal #updateButton").hide();
        $("#modal #deleteButton").show();
        $("#modal .modal-title").html('단어 상세보기');

        $("#insert_form input[name=wordSeq]").val(wordSeq);


        let sendData = {
            "wordSeq" : wordSeq
        }

        $.ajax({
            url : contextPath +"/word/select",
            contentType : "application/json",
            type : "GET",
            data : sendData,
            async : false,
            success : function(data){
                $("#insert_form #wordNm").val(data.wordNm);
                $("#insert_form #wordAbbr").val(data.wordAbbr);
                $("#insert_form #wordEngNm").val(data.wordEngNm);
                $("#insert_form #wordDscrpt").val(data.wordDscrpt);
                $("#insert_form #synmList").val(data.synmList);
            }
        });
    }
}

// 유효성 검사 - 필수 입력칸 체크
function insertValidation(){
    if($("#wordNm").val().length == 0){
        alertMessage("경고!","단어명을 입력해주세요.","danger");
        $("#wordNm").focus();
        return false;
    }

    if($("#wordAbbr").val().length == 0){
        alertMessage("경고!","단어 영문 약어명을 입력해주세요.","danger");
        $("#wordAbbr").focus();
        return false;
    }

    return true;
}

// 유효성 검사 - 중복 단어명 체크
function duplicationNameCheck(wordNm, wordAbbr, wordEngNm, synmList) {
    let sendData = {
        "wordNm" : wordNm,
        "wordAbbr" : wordAbbr,
        "wordEngNm" : wordEngNm,
        "synmList" : synmList
    }

    $.ajax({
        url : contextPath +"/word/duplicationCheck",
        contentType : "application/json",
        type : "GET",
        data : sendData,
        async : false,
        success : function(data){
            if (data == 0){
                checkConfirm('단어 신규 등록','단어 신규 등록을 신청하시겠습니까?','insertWord();');
                return true;
            } else {
                if(data == 1) {
                    alertMessage("경고!","이미 등록된 단어명입니다.","warning");
                } else if (data == 2){
                    alertMessage("경고!","이미 등록된 단어 영문 약어명입니다.","danger");
                } else if (data == 3){
                    alertMessage("경고!","이미 등록된 단어 영문명입니다.","danger");
                } else if (data == 4){
                    alertMessage("경고!","해당 단어의 동의어가 이미 등록되어 있습니다.","danger");
                } else if (data == -1){
                    alertMessage("경고!","빈칸이 존재합니다.","danger");
                }
                return false;
            }
        }
    });
}

//저장 여부 Confirm 메세지
function saveConfirm() {
    if (!insertValidation()){
        return;
    } else {
        duplicationNameCheck($.trim($("input[name='wordNm']").val()), $.trim($("input[name='wordAbbr']").val()),
            $.trim($("input[name='wordEngNm']").val()), $.trim($("input[name='synmList']").val()));
    }
}

//저장 기능
function insertWord() {
    if (!insertValidation()){
        return;
    }

    //상세 내용 입력칸에서 엔터값 br로 변경
    $("#wordDscrpt").val($("#wordDscrpt").val().replace(/(?:\r\n|\r|\n)/g, '<br>'));

    let sendData = {
        "wordNm" : $("#wordNm").val(),
        "wordAbbr" : $("#wordAbbr").val(),
        "wordEngNm" : $("#wordEngNm").val(),
        "synmListList" : $("#synmListList").val(),
        "wordDscrpt" : $("#wordDscrpt").val()
    };
    let dataTable = $("#wordTable").DataTable();
    console.log("sendData:", sendData);

    $.ajax({
        url : contextPath +"/word/insert",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
        success : function(data){
            if(data==1) {
                alertMessage("성공!","단어 등록 신청이 완료되었습니다.","success");
                $("#cancelButton").click();
                dataTable.destroy();
                searchList();
            } else {
                alertMessage("경고!","실패하였습니다. 관리자에게 문의해주세요.","danger");
                $("#cancelButton").click();
            }
        }
    });
}

//삭제 여부 Confirm 메세지 (Use N)
function deleteConfirm(wordSeq) {
    var wordSeq = $("#modal #wordSeq").val();
    checkConfirm('단어 삭제','해당 단어를 삭제 하시겠습니까?','deleteWord('+wordSeq+')');
}

//삭제 기능 (Use N)
function deleteWord(wordSeq) {
    let dataTable = $("#wordTable").DataTable();
    let sendData = {
        "wordSeq" : wordSeq
    }

    $.ajax({
        url : contextPath +"/word/delete",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
        async : false,
        success : function(data){
            if(data==1) {
                alertMessage("성공!","해당 단어가 삭제되었습니다.","success");
                $("#cancelButton").click();
                dataTable.destroy();
                searchList();
            } else {
                alertMessage("경고!","실패하였습니다. 관리자에게 문의해주세요.","danger");
            }
        }
    });
}
