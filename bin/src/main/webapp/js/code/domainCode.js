$(document).ready(function () {
	
	categorySelect();
	searchList();
	
	$("#keyword").keydown(function(key) {
		if (key.keyCode == 13) {
			$("#searchButton").trigger('click');
		}
	});

});

//검색 SelectBox 초기화
function categorySelect() {
	
	$.ajax({
        url : contextPath +"/code/searchTypeDomainCode",
        contentType : "application/json",
        type : "GET",
        success : function(data){
			for(var i = 0; i < data.length; i++) {
				if(data[i].columnName == 'CD_NM') {
					let option  = $("<option>");
					$(option).val('cdNm').text('데이터 타입명');
					$("#searchType").append($(option));
				}
				
				if(data[i].columnName == 'CD_DSCRPT') {
					let option  = $("<option>");
					$(option).val('cdDscrpt').text('데이터 타입 설명');
					$("#searchType").append($(option));
				}
				
				if(data[i].columnName == 'DB_CD') {
					let option  = $("<option>");
					$(option).val('dbCd').text('데이터 베이스');
					$("#searchType").append($(option));
				}
			}
        }

    });	
	
}

//도메인 목록
function searchList(searchType, keyword, orderNumber) {

	//Sorting 하기 위한 컬럼들 서버로 가지고감
	let columns = ['CD_SEQ','CD_NM','CD_DSCRPT','DB_CD', 'DATA_LEN_YN', 'DCML_LEN_YN', 'UPD_DT'];
	let order = 'asc';
	
	if(orderNumber == undefined) {
		orderNumber = 1;
	}
	
	if(orderNumber == 1) {
		order = 'asc';
	} else {
		order = 'desc'
	}
	
	
	//sAjaxSource 를 사용하면 기본적인 DataTable에 사용되는 옵션들을 객체로 가지고 감. 서버의 DomainVO 객체 확인하기
	$("#domainCodeTable").DataTable({	
	  	processing: true, 
	  	serverSide: true,
		responsive: true,
		autoWidth: true,
	  	sAjaxSource : contextPath + '/code/domainCodeList?columns='+columns +'&keyword=' + keyword + '&searchType=' + searchType,
		sServerMethod: "POST",
		columns: [
		    { data: 'cdSeq', width: "10%" },
			{ data: 'cdNm' },
			{ data: 'summaryCdDscrpt' },
	      	{ data: 'dbCd' },
	      	{ data: 'dataLenYn'},
	      	{ data: 'dcmlLenYn'},
			{ data: 'updDt'}
	      ],
		columnDefs: [
			{ targets:[0], title: 'ID' },
			{ targets:[1], title: '데이터 타입명' },
			{ targets:[2], title: '설명' },
			{ targets:[3], title: '데이터 베이스 유형' },
			{ targets:[4], title: '데이터 길이 유무' },
			{ targets:[5], title: '소수점 길이 유무' },
			{ targets:[6], title: '수정 날짜', visible: false }
		],
		order: [[orderNumber, order]]
		
	  });
	
	$("#searchType").change(function () {		
	 	$("#keyword").focus();		
	});
	
	$('#domainCodeTable tbody').on('dblclick', 'tr', function () {
		
		let table = $("#domainCodeTable").DataTable();
		let rowData = table.row( this ).data();
		
		if(rowData != undefined) {
			$("#newButton").click();
			openModal('update', rowData.cdSeq);
		}
		
	});
	
	let dataTableHeight = document.getElementsByClassName('dataTables_scrollBody')[0];
	dataTableHeight.style.minHeight = '580px';
}


//검색 버튼 클릭 이벤트
function searchDomainCode() {
	
	let searchType = $("#searchType").val();
	let keyword = $("#keyword").val();
	let dataTable = $("#domainCodeTable").DataTable();
  
	if(keyword == '') {
		if($("#searchType").val() == 'all') {
			dataTable.clear().destroy();
			searchList();
		} else {
			alertMessage("경고!","검색할 키워드를 입력해주세요.","warning");
			return false;
		};
	} else {
		dataTable.clear().destroy();
		searchList(searchType, keyword);
	}
}

//모달 열기
function openModal(type, cdSeq) {
	clearFormData();
	readOnlyOption('');
	
	//add = 신규등록 , update = 상세보기
	if(type == 'add') {
		$("#modal #deleteButton").hide();
		$("#modal #saveButton").html('저장');
		$("#modal .modal-title").html('도메인 코드 신규 등록');
	} else if(type == 'update') {
		$("#modal #deleteButton").show();
		$("#modal #saveButton").html('수정');
		$("#modal .modal-title").html('도메인 코드 수정');

		$("#insert_form input[name=cdSeq]").val(cdSeq);
		
		let sendData = {
			"cdSeq" : cdSeq
		}
		
		$.ajax({
	        url : contextPath +"/code/selectDomainCode",
	        contentType : "application/json",
	        type : "GET",
	        data : sendData,
			async : false,
	        success : function(data){
				$("#cdNm").val(data.cdNm);
				$("#dbCd").val(data.dbCd);
				$("#dataLenYn").val(data.dataLenYn);
				$("#dcmlLenYn").val(data.dcmlLenYn);
				if(data.cdDscrpt != null) {
					$("#cdDscrpt").val(data.cdDscrpt.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n'));
				}
				readOnlyOption(data.dataLenYn);
	        }
	    });

	
	}
	
	$("#dataLenYn").change(function () {		
	 	let selectDataTypeValue = $("#insert_form #dataLenYn").val().trim();
		readOnlyOption(selectDataTypeValue);		
	});

}

//등록 및 수정 시 데이터 유효성 검사
function insertValidation(){
		
	let result = true;	
		
	if($("#cdNm").val().trim().length == 0){
        alertMessage("경고!","데이터 타입명을 입력해주세요.","warning");
        $("#cdNm").focus();
        result = false;
    } else if($("#dbCd").val().trim() == ''){
        alertMessage("경고!","데이터 베이스 유형을 입력해주세요.","warning");
        $("#dbCd").click();
        result = false;
    } else if($("#dataLenYn").val().trim() == ''){
        alertMessage("경고!","데이터 길이 사용 유무를 선택해주세요.","warning");
        $("#dataLenYn").click();
        result = false;
    } else if($("#dataLenYn").val() == 'Y' && $("#dcmlLenYn").val().trim() == ''){
        alertMessage("경고!","소수점 길이 사용 유무를 선택해주세요.","warning");
        $("#dcmlLenYn").click();
        result = false;
    }
    
    
	return result;

}

function duplicateCheckDomainCode() {
	
	let sendData = $("#insert_form").serializeObject();
	let result = true;
	
	$.ajax({
        url : contextPath +"/code/duplicateCheckDomainCode",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
		async : false,
        success : function(data){
			if(data==2) {
				alertMessage("경고!","이미 등록된 도메인 코드입니다.","warning");
				result = false;
			}
        }

    });
    
    return result;
	
}

//저장 여부 Confirm 메세지 도메인 분류명 -> 도메인명 
function saveConfirm() {

	let message = '';
	let title = '';
	let type = 0;

	if(!insertValidation()) {
		return;
	}
	
	if(!duplicateCheckDomainCode()) {
		return;
	}
	
	if($("#cdSeq").val() == "") {
		type = 1;
		title = '도메인 코드 신규 등록';
		message = '도메인 코드를 신규 등록하시겠습니까?';
	} else {
		type = 2;
		title = '도메인 코드 수정';
		message = '도메인 코드를 수정하시겠습니까?';
	}
				
	checkConfirm(title, message, 'insertDomainCode('+type+');')
}

function insertDomainCode(type) {
		
	//상세 내용 입력칸에서 엔터값 br로 변경
	$("#cdDscrpt").val($("#cdDscrpt").val().trim().replace(/(?:\r\n|\r|\n)/g, '<br>'));
	
	let sendData = $("#insert_form").serializeObject();
	let dataTable = $("#domainCodeTable").DataTable();
	
	$.ajax({
        url : contextPath +"/code/insertDomainCode",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
		async : false,
        success : function(data){
			if(data >= 1) {
				$("#cancelButton").click();
				dataTable.destroy();
				if(type == 1) {
					alertMessage("성공!","도메인 코드가 생성되었습니다.","success");
				} else {
					alertMessage("성공!","도메인 코드가 수정되었습니다.","success");
				}
				searchList('','',7);
			} else {
				if(type == 1) {
					alertMessage("실패!","도메인 코드 생성에 실패했습니다.","danger");
				} else {
					alertMessage("실패!","도메인 코드 수정에 실패했습니다.","danger");
				}
				$("#cancelButton").click();
			}
        }

    });
	
}

function deleteConfirm() {
	var cdSeq = $("#modal #cdSeq").val().trim();
	checkConfirm('도메인 코드 삭제','해당 도메인 코드를 삭제하시겠습니까?','deleteDomainCode('+cdSeq+')');
}

function deleteDomainCode(cdSeq) {
	
	let dataTable = $("#domainCodeTable").DataTable();
	let sendData = {
		"cdSeq" : cdSeq
	}
	
	$.ajax({
        url : contextPath +"/code/deleteDomainCode",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
		async : false,
        success : function(data){
			if(data==1) {
				alertMessage("성공!","해당 도메인 코드가 삭제되었습니다.","success");
				$("#cancelButton").click();
				dataTable.destroy();
				searchList();
			} else {
				alertMessage("실패!","도메인 코드 삭제에 실패했습니다.","danger");
			}
        }

    });
}

function readOnlyOption(dataLenYn) {
	if(dataLenYn == '') {
		$("#dcmlLenYn").attr('disabled', true);
		$("#dcmlLenYn").val('');
		$("#dataLenYnStar").hide();
	} else if(dataLenYn == 'Y') {
		$("#dcmlLenYn").attr('disabled', false);
		$("#dataLenYnStar").show();
	} else {
		$("#dcmlLenYn").attr('disabled', true);
		$("#dcmlLenYn").val('N');
		$("#dataLenYnStar").hide();
	}
}	


function resetSearch() {
	
	$("#searchType").val('all');
	$("#keyword").val('');
	
	let dataTable = $("#domainCodeTable").DataTable();
	dataTable.destroy();
	searchList();
	
}