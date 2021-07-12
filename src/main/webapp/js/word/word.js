$(document).ready(function () {
    categorySelect();
    searchList();

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

$(window).on('load', function() {
    $("#keyword").keydown(function(key) {
        if (key.keyCode == 13) {
            $("#searchButton").trigger('click');
        }
    });

	$('div.modal-body').find('#wordNm').change(function(){
		$('div.modal-body').find('#wordNm').removeClass('valid');
	});
	$('div.modal-body').find('#wordEngNm').change(function(){
		$('div.modal-body').find('#wordEngNm').removeClass('valid');
	});
	$('div.modal-body').find('#wordAbbr').change(function(){
		$('div.modal-body').find('#wordAbbr').removeClass('valid');
	});

	/*
	
	$('#modalTable1').dataTable( {
		"createdRow": function( row, data, dataIndex){
                if( data.fatalExist == "T"){
                    $(row).addClass('redClass');
                }
            }
	});
	*/

});

//검색 SelectBox 초기화
function categorySelect() {
    $.ajax({
        url : contextPath +"/word/searchType",
        contentType : "application/json",
        type : "GET",
        success : function(data){         
            for(var i = 0; i < data.length; i++) {
                if(data[i].columnName == 'WORD_NM') {
                    var option  = $("<option>");
                    $(option).val('wordNm').text('단어명');
                    $("#searchType").append($(option));
                }

                if(data[i].columnName == 'WORD_ABBR') {
                    var option  = $("<option>");
                    $(option).val('wordAbbr').text('단어 영문 약어명');
                    $("#searchType").append($(option));
                }

                if(data[i].columnName == 'WORD_ENG_NM') {
                    var option  = $("<option>");
                    $(option).val('wordEngNm').text('단어 영문명');
                    $("#searchType").append($(option));
                }

                if(data[i].columnName == 'WORD_DSCRPT') {
                    var option  = $("<option>");
                    $(option).val('wordDscrpt').text('단어 설명');
                    $("#searchType").append($(option));
                }

                if(data[i].columnName == 'SYNM_LIST') {
                    var option  = $("<option>");
                    $(option).val('synmList').text('이음동의어');
                    $("#searchType").append($(option));
                }
            }
        }
    });
}

// 단어 목록
function searchList(searchType, keyword, orderNumber) {

    let order = 'asc';

    if(orderNumber == undefined) {
        orderNumber = 1;
    }

    if (orderNumber == 1){
        order = 'asc';
    } else {
        order = 'desc';
    }

    //Sorting 하기 위한 컬럼들 서버로 가지고감
    var columns = ['WORD_SEQ','WORD_NM','WORD_ABBR','WORD_ENG_NM', 'WORD_DSCRPT', 'SYNM_LIST'];

    var param = {
			"searchType" : searchType,
			"keyword" : keyword
			}

    //sAjaxSource 를 사용하면 기본적인 DataTable에 사용되는 옵션들을 객체로 가지고 감.
    $("#wordTable").DataTable({
	  	processing: true, 
	  	serverSide: true,
        responsive: true,
        autoWidth: true,
        sAjaxSource : contextPath + '/word/list?columns='+columns +'&keyword=' + keyword + '&searchType=' + searchType,
        sServerMethod: "POST",
		"drawCallback": function (settings, json) {
			//$('[data-toggle="tooltip"]').tooltip('update');
			$('[data-toggle="popover"]').popover('update');
		},
		columns: [
          { data: 'wordSeq', width: "10%"},
          { data: 'wordNm' },
          { data: 'wordAbbr' },
          { data: 'wordEngNm' },
          { data: 'summaryWordDscrpt' }, //summaryWordDscrpt
          { data: 'synmList' }
       ],
       columnDefs: [
			{ targets:[0], title: 'ID' },
			{ targets:[1], title: '단어명' },
			{ targets:[2], title: '단어 영문 약어명' },
			{ targets:[3], title: '단어 영문명' },
			{ targets:[4], title: '단어 설명' },
			{ targets:[5], title: '이음동의어' }
		],
        // order: [[orderNumber, 'asc']]
        order: [[orderNumber, order]],

		createdRow: function (row, data, dataIndex) {
			// $(row).find('td:eq(4)').attr('data-toggle', "tooltip");

			//$(row).find('td:eq(4)').attr('title', data["wordSeq"]);
			$(row).find('td:eq(4)').attr('data-container', 'body');
			$(row).find('td:eq(4)').attr('data-content', data["wordDscrpt"]);
			// $(row).find('td:eq(4)').attr('data-placement', "bottom");
			$(row).find('td:eq(4)').attr('data-toggle', "popover");
			$(row).find('td:eq(4)').attr('data-trigger', "hover");
		}
	});


    $('#wordTable tbody').on('dblclick', 'tr', function () {

        let table = $("#wordTable").DataTable();

        var rowData = table.row( this ).data();

		if(rowData != undefined) {
        	$("#newButton").click();
        	openModal('update', rowData.wordSeq);
        }
    });

    $("#searchType").change(function () {
        $("#keyword").focus();
    });
    
    let dataTableHeight = document.getElementsByClassName('dataTables_scrollBody')[0];
	dataTableHeight.style.minHeight = '580px';
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
		// 신규등록 모달 진입 => stage0 보여줌
        $("#modal #saveButton").show();
        $("#modal #updateButton").hide();
        $("#modal #deleteButton").hide();
		$('#modal #nmDuplCheck').show();

		$('div.stage').css('display', 'none');
		
		$('#stage0Helper').show();
		$('#stage2Helper').show();
		
		$('#wordEngNm').addClass('input-short');
		$('#wordAbbr').addClass('input-short');

		//$("div.modal-body").children().css('display', 'flex');	// 개발중 : 진입시 모두 보이게
		//$("div.modal-footer").css('display', 'none');
        
		$("#modal .modal-title").html('단어 신규 등록');
		
		// 비활성화
		$("#wordNm").attr('readonly', false);
		$("#wordEngNm").attr('readonly', false);
		$("#wordAbbr").attr('readonly', false);

    } else if (type == 'update'){
		
		$('div.modal-body').children().show();
		
		// 등록 프로세스 관련 구역 및 버튼 hide
		$('div #stage0').find('button').hide();
		$('#stage0Helper').hide();
		$('div #stage2').find('button').hide();
		$('#stage2Helper').hide();
		$('div.insertWord').hide();
		
		//버튼 관리
        $("#modal #deleteButton").show();
		$("#modal #updateButton").show();
        $("#modal #saveButton").hide();
        $("#modal .modal-title").html('단어 상세보기');
        $("#insert_form input[name=wordSeq]").val(wordSeq);
		
		// 비활성화
		$("#wordNm").attr('readonly', true).addClass('valid');
		$("#wordEngNm").attr('readonly', true).addClass('valid');
		$("#wordAbbr").attr('readonly', true).addClass('valid');
		
		// 인풋 길이
		$('#wordEngNm').removeClass('input-short');
		$('#wordAbbr').removeClass('input-short');

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
                $("#insert_form #wordSeq").val(data.wordSeq);
                $("#insert_form #wordNm").val(data.wordNm);
                $("#insert_form #wordAbbr").val(data.wordAbbr);
                $("#insert_form #wordEngNm").val(data.wordEngNm);
                if(data.wordDscrpt != null) {
					$("#insert_form #wordDscrpt").val(data.wordDscrpt.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n'));
				}
                $("#insert_form #synmList").val(data.synmList);
            }
        });
    }
}


/*
// 단어명 및 단어영문명 중복조회 & 단어영문약어명 중복조회
function duplicationValidation(type){

	let tableId = "";
	let param = {}
	
	if (type == "full") {
		
		if($("#wordNm").val().length == 0){
	        alertMessage("경고!","단어명을 입력해주세요.","warning");
	        $("#wordNm").focus();
	        return false;
	    } else if($("#wordEngNm").val().length == 0){
	        alertMessage("경고!","단어 영문명을 입력해주세요.","warning");
	        $("#wordEngNm").focus();
	        return false;
	    } else{
			$("#wordEngShortNm").val("");
			tableId = "#modalTable1"
			param = {
			        "searchType" : type,
			        "wordNm" : $("#wordNm").val(),
					"wordEngNm" : $("#wordEngNm").val()
			    }
		}
				
	} else if (type == "short") {
		
		if($('#wordNm').attr('class').split(' ').indexOf('valid') == -1){
			alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
	        return false;
		}
		if($('#wordEngNm').attr('class').split(' ').indexOf('valid') == -1){
			alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
	        return false;
		}
		if($("#wordEngShortNm").val().length == 0){
	        alertMessage("경고!","단어 영문 약어명을 입력해주세요.","warning");
	        $("#wordEngShortNm").focus();
	        return false;
	    } else {
			tableId = "#modalTable2"
			param = {
			        "searchType" : type,
			        "wordEngShortNm" : $("#wordEngShortNm").val()
			    }
		}
		
	} 
	// 데이터테이블 초기화
	let dataTable = $(tableId).DataTable();
    dataTable.destroy();
	
	console.log("보내는 쿼리", param);
	const modalTable = {
        ele: tableId,
        table: null,
        option: {
            columns: [
				//{ data: 'wordSeq' },
                { data: 'wordNm' },
                { data: 'wordEngShortNm' },
                { data: 'wordEngNm' },
                { data: 'wordDscrpt' }, // summaryWordDscrpt
                { data: 'synmList' }

            ]
        },
        init: function () {
			// 생성하는 동안 가려주기
			//$(this.ele+'_wrapper').hide()
            // DataTables 생성
            this.table = DatatablesCustom.order(this.ele, this.option, 0);
            this.search();
        },
        search: function () {
            
            // 조회 조건에 따라 데이터를 조회해서 DataTables에 넣는다.
            DatatablesCustom.rowsAdd(this.table, contextPath + '/word/nameDuplicationCheck', param, type, true);
			//$(this.ele+'_wrapper').show();
        }
    };

    modalTable.init();
	$('.'+type).addClass('valid');

}*/



// 깜빡이 문제 해결중
function duplicationValidation2(step){

	let tableId = "";
	let param = {};
	let option = {};
	$("#wordDscrpt").val('');
	$("#synmList").val('');
	
	if (step == "full") {
		
		if($("#wordNm").val().length == 0){
	        alertMessage("경고!","단어명을 입력해주세요.","warning");
	        $("#wordNm").focus();
	        return false;
	    } else if($("#wordEngNm").val().length == 0){
	        alertMessage("경고!","단어 영문명을 입력해주세요.","warning");
	        $("#wordEngNm").focus();
	        return false;
	    } else{
			$("#wordAbbr").val("");
			tableId = "#modalTable1"
			param = {
			        "searchType" : step,
			        "wordNm" : $("#wordNm").val(),
					"wordEngNm" : $("#wordEngNm").val()
			    }
			option = {
			            columns: [
					                { data: 'wordNm' },
					                { data: 'wordAbbr' },
					                { data: 'wordEngNm' },
					                { data: 'summaryWordDscrpt' },
					                { data: 'synmList' },
		                			{ data: 'fatalExist' }
					            ],
						columnDefs: [
										{
											targets:[5],
											visible: false
										}
									],
						order: [[5, 'desc'], [0, 'asc']]
									
			        }
		}
				
	} else if (step == "short") {
		
		if($('#wordNm').attr('class').split(' ').indexOf('valid') == -1){
			alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
	        return false;
		}
		if($('#wordEngNm').attr('class').split(' ').indexOf('valid') == -1){
			alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
	        return false;
		}
		if($("#wordAbbr").val().length == 0){
	        alertMessage("경고!","단어 영문 약어명을 입력해주세요.","warning");
	        $("#wordAbbr").focus();
	        return false;
	    } else {
			tableId = "#modalTable2"
			param = {
			        "searchType" : step,
			        "wordAbbr" : $("#wordAbbr").val()
			    }
			option = {
			            columns: [
					                { data: 'wordNm' },
					                { data: 'wordAbbr' },
					                { data: 'wordEngNm' },
					                //{ data: 'summaryWordDscrpt' },
					                //{ data: 'synmList' },
		                			{ data: 'fatalExist' }
					            ],
						columnDefs: [
										{
											targets:[3],
											visible: false
										}
									],
						order: [[3, 'desc'], [0, 'asc']]
									
			        }
		}
		
	} 
	
	
	$.ajax({
	      url: contextPath + '/word/nameDuplicationCheck',
	      type: 'POST',
	      data: JSON.stringify(param),
	      contentType: 'application/json; charset=utf-8',
	      success: function (data) {
	        insertStatusControl(step, data);
			if (data.length == 0) {
				$(tableId).parent().hide()
			} else {
				let dataTable = $(tableId).DataTable();
			    dataTable.destroy();
				let modalTable= DatatablesCustom.order(tableId, option, 0);
				$(tableId).parent().show();
				modalTable.clear();
				modalTable.rows.add(data).draw();
			}
	      },
	    });

	$('.'+step).addClass('valid');

}



// 단어 등록 프로세스 플래그 관리
function insertStatusControl(step, data){
	let flag = "";
	let dataset = {'length':data.length};
	
	if (step == 'full'){			// 단어명,단어영문명 중복조회
		let fatalExistFlag = false;
		let abbrExistFlag = false;
		
					
		data.forEach(function(e){
			if(e.fatalExist){
				fatalExistFlag = true;
				dataset['fatalExist'] = e;
			}
			if(e.abbrExist){
				abbrExistFlag = true;
				dataset['abbrExist'] = e;
			}
		});
		
		if(fatalExistFlag){
			// 치명중복 존재 (case1)
			flag = "reject"
		} else if (!fatalExistFlag && abbrExistFlag){
			// 치명중복 x, 사전 등록 약어 o (case2)
			flag = "accept"
		} else {
			// 치명중복 x, 사전 등록 약어 x (case3)
			flag = "newAbbr"
		}
		
			
	} else if (step == 'short'){	// 단어영문약어명 중복조회
		let abbrDuplFlag = false;
		let dataset = {};
		
		data.forEach(function(e){
			if(e.abbrExist){
				abbrDuplFlag = true;
				dataset['abbrDupl'] = e;
			}
		});
		
		if(abbrDuplFlag){
			// 중복 약어명 존재 (unable to use)
			flag = "unable"
		} else{
			// 중복 약어명 x (able to use)
			flag = "able"
		}
		
	}
	
	insertModalControl(step, flag, dataset);
	
}


// 단어 등록 프로세스 (플래그별) 항목 노출 관리
function insertModalControl(step, flag, dataset){
	var showList = {
		'reject':['#stage1'],
		'accept':['#stage1', '#stage2','#stage4-1','#stage4-2', 'div.modal-footer'],
		'newAbbr':['#stage1','#stage2'],
		'unable':['#stage1','#stage2','#stage3'],
		'able':['#stage1','#stage2','#stage3','#stage4-1','#stage4-2', 'div.modal-footer']
	}
	var banList = {
		'reject':['#stage2','#stage3','#stage4-1','#stage4-2', 'div.modal-footer'],
		'accept':['#stage3'],
		'newAbbr':['#stage3','#stage4-1','#stage4-2', 'div.modal-footer'],
		'unable':['#stage4-1','#stage4-2', 'div.modal-footer'],
		'able':[]
	}
	
	
	if (step == 'full') {
		
		
		switch (flag) {
			case "reject":
				$('#stage1Helper').text("단어명과 단어영문명이 모두 중복되는 단어가 존재합니다.")
								.css('color', 'red');
						
				break;
				
			case "accept":
				if (dataset['length']) {
					$('#stage1Helper').text("중복 가능성이 있는 단어들의 목록입니다. 중복 단어를 등록하지 않도록 주의해주세요.")
							.css('color', '');	
				} else {
					$('#modalTable1_wrapper').css('display', 'none');
					$('#stage1Helper').text('등록할 수 있는 단어명 및 단어영문명입니다.').css('color', 'blue');
				}
				
				$('#stage2').find('button').attr('disabled', true);
				$('#stage2').find('input').attr('readonly', true).val(dataset.abbrExist.wordAbbr);
				$('#abbrDuplCheck').show();
				$('#stage2').find('span').text("해당 단어영문명 사용 시 단어영문약어명은 기존 등록 데이터로 설정됩니다.");
				$('#stage2').find('text').hide();
				$('.short').addClass('valid');
				
				break;
				
			case "newAbbr":
				if (dataset['length']) {
					$('#stage1Helper').text("중복 가능성이 있는 단어들의 목록입니다. 중복 단어를 등록하지 않도록 주의해주세요.")
							.css('color', '');	
				} else {
					$('#modalTable1_wrapper').css('display', 'none');
					$('#stage1Helper').text('등록할 수 있는 단어명 및 단어영문명입니다.').css('color', 'blue');
				}
				$('#stage2').find('span').text("입력한 단어영문명의 단어영문약어명이 존재하지 않아 신규 입력이 필요합니다.");
				$('#abbrDuplCheck').show();
				$('#stage2').find('button').attr('disabled', false);
				$('#stage2').find('input').attr('readonly', false);
				$('#stage2').find('text').show();
				$('.short').removeClass('valid');
				
				break;
		}
		
	} else if(step == 'short') {
		switch (flag) {
			case "unable":
				$('#stage3Helper').text("사용할 수 없는 단어영문약어명입니다.")
								.css('color', 'red');
						
				break;
				
			case "able":
				$('#modalTable2_wrapper').css('display', 'none');
				$('#stage3Helper').text('사용할 수 있는 단어영문약어명입니다.').css('color', 'blue');
				
				break;
		}
	}
	
	banList[flag].forEach(function(e){
		$(e).css('display', 'none');
	});
	showList[flag].forEach(function(e){
		$(e).css('display', 'flex');
	});
	
	
}

/*
// 단어 등록 프로세스 헬퍼메세지 관리
function insertHelperionControl() {
	const stage0Flag = {'default':'단어명 및 단어영문명의 중복 여부를 확인해주세요.'}
	
}
*/






// 유효성 검사 - 필수 입력칸 체크
function insertValidation(){
	if($('#wordNm').attr('class').split(' ').indexOf('valid') == -1){
		alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
        return false;
	}
	if($('#wordEngNm').attr('class').split(' ').indexOf('valid') == -1){
		alertMessage("경고!","단어명과 단어영문명의 중복검사를 먼저 진행해주세요.","danger");
        return false;
	}
	
	if($('.short').attr('class').split(' ').indexOf('valid') == -1){
		alertMessage("경고!","단어영문약어명의 중복검사를 먼저 진행해주세요.","danger");
        return false;
	}
	
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

//저장 여부 Confirm 메세지
function saveConfirm() {
    if (!insertValidation()){
        return;
    }
	checkConfirm('단어 신규 등록', '단어 신규 등록을 신청하시겠습니까?', 'insertWord();');
}

//수정 여부 Confirm 메세지
function updateConfirm() {
    if (!insertValidation()){
        return;
    }
	checkConfirm('단어 수정', '단어의 수정사항을 저장하시겠습니까??', 'updateWord();');
}


//저장 기능
function insertWord() {

    let sendData = {
        "wordNm" : $("#wordNm").val().trim(),
        "wordAbbr" : $("#wordAbbr").val(),
        "wordEngNm" : $("#wordEngNm").val(),
        "synmList" : $("#synmList").val(),
        "wordDscrpt" : $("#wordDscrpt").val()
    };
    let dataTable = $("#wordTable").DataTable();   

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
                searchList('','',0);
            } else {
                alertMessage("경고!","실패하였습니다. 관리자에게 문의해주세요.","danger");
                $("#cancelButton").click();
            }
        }
    });
}

//수정 기능
function updateWord() {

    let sendData = {
        "wordSeq" : $("#wordSeq").val(),
        //"wordNm" : $("#wordNm").val(),
        //"wordAbbr" : $("#wordAbbr").val(),
        //"wordEngNm" : $("#wordEngNm").val(),
        "synmList" : $("#synmList").val(),
        "wordDscrpt" : $("#wordDscrpt").val()
    };
    let dataTable = $("#wordTable").DataTable();   

    $.ajax({
        url : contextPath +"/word/update",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
        success : function(data){
            if(data==1) {
                alertMessage("성공!","단어 수정이 완료되었습니다.","success");
                $("#cancelButton").click();
                dataTable.destroy();
                searchList('','',0);
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


function excelDownload_doc() {
	let serviceName = 'wordListExcelDownload';
	let fileName = 'WORD_LIST_DOC';
	apiRequestExcel(serviceName, fileName, $("#search_form"));
}

function excelDownload_exerd() {
	let serviceName = 'wordListExcelDownload';
	let fileName = 'WORD_LIST_EXERD';	
	apiRequestExcel(serviceName, fileName, $("#search_form"));
}



/*데이터테이블 커스텀*/

const DatatablesCustom = {
  // 기본 테이블 구조
  basic: function (id, tableOption, info) {
    let table = $(id).DataTable({
      // 반응형 테이블 설정
      responsive: true,
      language: {
		emptyTable: '중복되는 명칭이 없습니다.',
      },
      columns: tableOption ? tableOption.columns : null,
      order: [[0, 'asc']]
    });

    return table;
  },
  // 정렬하는 컬럼을 설정하도록
  order: function (id, tableOption, num, info) {
    let table = $(id).DataTable({
	  paging: false,
      responsive: true,
	  info: false,

  	  scrollY: "130",	
      language: {
		emptyTable: '중복되는 명칭이 없습니다.',
      },
      columns: tableOption ? tableOption.columns : null,
      columnDefs: tableOption ? tableOption.columnDefs : null,
	  order: tableOption ? tableOption.order : null,
      //order: [[5, 'desc']],
	  "createdRow": function( row, data, dataIndex ) {
		    if ( data.fatalExist == "T" ) {
		      $(row).addClass( 'fatal' );
		      $(row).css( 'background-color', 'beige');
		    }
			if ( data.abbrExist == "T" ) {
				data.wordSeq = 0;
		      $(row).addClass( 'abbr' );
		      //$(row).css( 'font-weight', 'bold');
		    }
		  }
    });

    return table;
  },
  // 데이터 추가
  rowsAdd: function (table, url, param, step) {
    table.clear();

    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(param),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
		
        insertStatusControl(step, data);
		table.rows.add(data).draw();
		
       
      },
    });
  },

  // 새로고침
  refresh: function (table, data) {
    table.clear();
    table.rows.add(data).draw();
  }
};
