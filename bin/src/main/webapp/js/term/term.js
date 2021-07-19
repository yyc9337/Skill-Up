$(window).on('load', function() {
	
	$("#keyword").keydown(function(key) {
		if (key.keyCode == 13) {
			$("#searchButton").trigger('click');
		}
	});
	
//용어 신규 등록)) 구성 단어명 선택을 입력했을시 selectBox에 "keyword" : term.term, "searchType" : "wordNm" 형식으로 데이터를 생성함  //스크롤로 나옴
	$("#wordSelectTag").select2({
		ajax: {
			url : contextPath + "/word/list",
			type : "POST",
			dataType: 'json',
			delay: 250,
			data : function(term){
				let data = {
					"keyword" : term.term,
					"searchType" : "wordNm"
				};
				return data;
			},
			processResults: function (data, params) {
				$.each(data.data,function(index,item){
					data.data[index]["id"]=item.wordSeq;
					if(item.synmList == null){ //synmList가 없을 경우 불러오지 않음.
						data.data[index]["text"]=item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordAbbr+"]";
					}else{ //동의어가 있을 경우 item.synmList를 불러옴
						data.data[index]["text"]=item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordAbbr+", 동의어 : "+item.synmList+"]";
					}
				});
				return {
					results: data.data
				};
			},
			cache: true
		},
		placeholder: 'Search a Word',
		minimumInputLength: 1,
		templateSelection : function(data){    //배열 데이터 소스 또는 ajax 데이터 소스 등에서 오는 입력을 받아들입니다
			return data.wordNm;
		},
		language: {            //Ajax에 내장되어 있는 함수들  
			inputTooShort: function () {
				return "1글자 이상 입력하세요.";
			},
			noResults: function() {
           		return "등록되지 않은 단어입니다.";
       		},
       		searching: function(){
				return "검색중...";
			}
		}
	});


	$("#wordSelectTag").on("select2:select",function(e){ //글자를 입력하면 자동으로 박스가 생성됨
		termNameAutoCreate(e.params.data.wordNm, e.params.data.wordAbbr);
	});
	$("#wordSelectTag").on("select2:unselect",function(e){  //글자가 0이되면 자동으로 사라짐
		e.params.data.text = '';
		termNameAutoRemover(e.params.data.wordNm, e.params.data.wordAbbr);
	});

	$("#domainSeq").on("change",function(e){  //도메인 명을 클릭하면 자동으로 selectDamain에 있는 value 값이 생성됨
		selectDoamin(this.value);
	})
	categorySelect();
	loadDomainData();
	searchList();

	$('#termTable tbody').on( 'dblclick', 'tr', function (event) {    //더블클릭하면 모달이 생성됨
		let table = $("#termTable").DataTable();
		let tr = table.row($(this).closest('tr'));
		let row = table.row(tr);
		let rowData = table.row(this).data();
		if(rowData != undefined) {
			modalOn(false,rowData);
			event.stopPropagation();
		}
	});


});

// function formatRepo (item) {
// 	let option = $("<option>");
// 	if(item.synmList == null){
// 		$(option).text(item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordEngShortNm+"]");
// 	}else{
// 		$(option).text(item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordEngShortNm+", 동의어 : "+item.synmList+"]");
// 	}
// 	$(option).text(item.wordNm);
// 	$(option).val(item.wordSeq);
// 	$(option).attr("wordEngShortNm",item.wordEngShortNm);
// 	return option;
// }
//
// function formatRepoSelection (item) {
// 	console.log(item);
// 	return item.wordNm;
// }

function selectDoamin(domainSeq){  
	// ID domainDetail
	$.ajax({
		url : contextPath + "/domain/select?domainSeq="+domainSeq,
		type : "GET",
		contentType : "application/json",
		success : function(data){
			if(data.dataType == "NUMBER")  //타입이 NUMBER이면 소수점 길이가 생성되고 아니면 생성되지 않음.
				$("#domainDetail").text("도메인 분류명 : " + data.data.domainTypeNm+", 데이터 타입 : "+data.data.dataType+", 데이터 길이 : "+data.data.dataLen+", 소수점 길이 : "+data.data.dcmlLen);
			else
				$("#domainDetail").text("도메인 분류명 : " + data.data.domainTypeNm+", 데이터 타입 : "+data.data.dataType+", 데이터 길이 : "+data.data.dataLen);
		}
	});

}

//검색 SelectBox 초기화ㅋ
function categorySelect() {   //카테고리를 선택하는 함수
	$.ajax({
        url : contextPath +"/term/searchType",
        contentType : "application/json",
        type : "GET",
        success : function(data){
        	if(data.returnCode === "F")
        		return false;

			for(var i = 0; i < data.data.length; i++) {       //하드코딩 되어 있는 '단어들을 불러오지 않고 data를 호출함 sql쿼리문에서 용어라는 말이 들어가 있는 부분만 가져옴'
				if(data.data[i].columnName) {
						var option  = $("<option>");
					$(option).val('termNm').text(data.data[i].columnComment);   //옵션을 하나하나 추가하지 않으면 목록이 제 역할을 못함.
					$(option).val('termAbbr').text(data.data[i].columnComment);
					$(option).val('termDscrpt').text(data.data[i].columnComment);
					$("#searchType").append($(option));
				}
				
				/*
				if(data.data[i].columnName == 'TERM_ABBR') {
					var option  = $("<option>");
					$(option).val('termAbbr').text(data.data[i].columnComment);
				//	$(option).val('termAbbr').text('용어영문약어명');
					$("#searchType").append($(option));
				}
				
				if(data.data[i].columnName == 'TERM_NM') {
					var option  = $("<option>");
					$(option).val('termNm').text('용어 이름');
					$("#searchType").append($(option));
				}

				if(data.data[i].columnName == 'TERM_DSCRPT') {
					var option  = $("<option>");
					$(option).val('termDscrpt').text('용어 설명');
					$("#searchType").append($(option));
				}*/
			}
        }
    });
}

//용어 목록
function searchList(searchType, keyword, orderNumber) {

	if(orderNumber == undefined) {
		orderNumber = 1;
	}

	$("#termTable").DataTable({   //데이터 테이블 생성
	  	processing: true,    //테이블을 생성한 후 어떠한 기능들을 허용하겠다는 기능을 갖고 있는데 정확히 무엇인지 파악 중 
	  	serverSide: true,
		responsive: true,
		autoWidth: true,  
		sAjaxSource : contextPath + '/term/list?keyword=' + keyword + '&searchType=' + searchType,
	  	sServerMethod: "POST",

		// popover
		"drawCallback": function (settings, json) {     //마우스를 가져다 대면 팝업 방식으로 용어 설명란에 설명 팝업이생김
			//$('[data-toggle="tooltip"]').tooltip('update');
			$('[data-toggle="popover"]').popover('update');
		},

		columns: [    //테이블에 생성될 데이터 목록들
		    { data: 'termSeq', width: "10%"},
			{ data: 'termNm'},
			{ data: 'termAbbr'},
	      	{ data: 'domainNm'},
	      	{ data: 'summaryTermDscrpt'},
			{ data: 'updDt'}
	      ],
		columnDefs: [  //목록들을(targets은 위에있는 data들) title로 한글로 변경
			{ targets:[0], title: 'ID' },
			{ targets:[1], title: '용어명' },
			{ targets:[2], title: '용어 영문 약어명' },
			{ targets:[3], title: '도메인명' },
			{ targets:[4], title: '용어 설명' },
			{ targets:[5], title: '수정 날짜', visible: false }
		],
		order: [[orderNumber, 'asc']],  //오름차순

		// popover
		createdRow: function (row, data, dataIndex) {
			// $(row).find('td:eq(4)').attr('data-toggle', "tooltip");

			$(row).find('td:eq(4)').attr('data-container', 'body');
			$(row).find('td:eq(4)').attr('data-content', data["termDscrpt"]);
			$(row).find('td:eq(4)').attr('data-toggle', "popover");
			$(row).find('td:eq(4)').attr('data-trigger', "hover");
		}
	  });	
	 
	 //"dataTables_scrollBody"클래스를 가진 div는 플러그인에 의해 자동 생성됩니다. 이 테이블의 높이를 580px로 고정시킴 
	 let dataTableHeight = document.getElementsByClassName('dataTables_scrollBody')[0];
	 dataTableHeight.style.minHeight = '580px'; 
}

function termNameAutoCreate(wordNm, wordAbbr){    //위에서 쓰기위해 함수를 정리해 둠
	let termNm = $("#wordSelectTag").val().length == 1 ? wordNm : $("#termNm").val() + wordNm;
	let termAbbr = $("#wordSelectTag").val().length == 1 ? wordAbbr : $("#termAbbr").val() + "_" + wordAbbr;
	$("#termNm").val(termNm);
	$("#termAbbr").val(termAbbr);
}

function termNameAutoRemover(wordNm, wordAbbr){   //위에서 쓰기위해 함수를 정리해 둠
	let termNm = $("#termNm").val().replace(wordNm,"");
	let termAbbr = $("#wordSelectTag").val().length == 0 ? "" : $("#termAbbr").val().replace("_" + wordAbbr, "");
	$("#termNm").val(termNm);
	$("#termAbbr").val(termAbbr);
}

//검색 버튼 클릭 이벤트
function searchTerm() {
	
	let searchType = $("#searchType").val();   //목록
	let keyword = $("#keyword").val();  //검색창

	if(searchType =="all"){
		if(keyword != ''){     //목록을 전체로 해두고 어떠한 글자를 입력했을 시 원래있던 테이블이 사라지고 검색된 테이블을 찾음
			destroyTable();
			searchList(searchType,keyword);
			return false;
		}     
		destroyTable();
		searchList();
		return false;
	}else{
		if(keyword == '') {   //아무것도 입력하지 않으면,
			alertMessage("경고!","검색할 키워드를 입력해주세요.","warning");
			return false;
		}
	}
	//검색한 도메인 정보들을 보여주기 위해 기존 데이터 초기화
	destroyTable();
	
	//조회 조건을 이용하여 도메인 리스트 조회
	searchList(searchType, keyword);
}

function destroyTable(){
	let dataTable = $("#termTable").DataTable();
	dataTable.destroy();
}

//검색 초기화 아이콘 클릭 이벤트
function resetSearch() {
	$("#searchType").val('all');
	$("#keyword").val('');
	
	var dataTable = $("#termTable").DataTable();
	dataTable.destroy();
	searchList();
}

//저장 여부 Confirm 메세지
function saveConfirm() { 
	let sendData = {   //데이터를 담아서 보냄
		"termNm" : $("#termNm").val().trim(),
		"termAbbr" : $("#termAbbr").val().trim(),
		"domainSeq" : $("#domainSeq").val().trim(),
		"termDscrpt" : $("#termDscrpt").val().trim(),
	};

	if(!validationTerm(sendData))    //validationTerm 함수에 걸리지 않으면, 
		return false;

	sendData = {  
		"termNm":$("#termNm").val(), 
		"useYn" : "Y"   //useYn Y로 전송
	};

	let content = '용어 신규 등록을 신청하시겠습니까?';
	if(!duplicateCheck(sendData)){    //중복단어체크에 데이터가 담겨 있다면
		content = "동일한 용어명을 가진 용어가 존재합니다. 계속하시겠습니까?";   //문자 반환
	}

	checkConfirm('용어 신규 등록', content,'createTerm()');
}

// function loadWordData(){
// 	let sendData = {
// 		"searchType" : "NULL"
// 	};
//
// 	$.ajax({
// 		url : contextPath +"/word/list",
// 		contentType : "application/json",
// 		type : "POST",
// 		data : sendData,
// 		success : function(data){
// 			if(data.data.length > 0){
// 				$.each(data.data,function(index,item){
// 					let temp = $("<option>");
// 					$(temp).val(item.wordSeq);
// 					if(item.synmList == null){
// 						$(temp).text(item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordEngShortNm+"]");
// 					}else{
// 						$(temp).text(item.wordNm + "    [영어명 : "+item.wordEngNm+", 약어명 : "+item.wordEngShortNm+", 동의어 : "+item.synmList+"]");
// 					}
//
// 					$(temp).attr("wordEngShortNm",item.wordEngShortNm);
// 					$("#previewTag").append($(temp));
// 					$("#wordSelectTag").trigger('change');
// 				});
//
// 			}
// 		}
// 	});
// }

function loadDomainData(){    //모달 안에서 도메인명 선택 리스트 띄워주는 함수

	$.ajax({
		url : contextPath + "/domain/selectall",
		type : "GET",
		contentType : "application/json",
		success : function(data){
			if(data.data.length == 0){
				return false;
			}

			$.each(data.data,function(index, item){
				let option = $("<option>");
				$(option).val(item.domainSeq);
				$(option).text(item.domainNm);
				$("#domainSeq").append(option);
			});
		}
	});
}

function validationTerm(termObject){       
	let validated = true;
	if($("#wordSelectTag").val().length == 0){      //신규 등록할 때 구성 단어명 칸에 길이가 0일경우
		alertMessage("경고", "구성 단어명을 선택해주세요.", "warning");
		return false;

	}

	if(termObject.termNm.length == 0){    //신규 등록할 때 용어명 칸에 길이가 0일경우
		alertMessage("경고", "용어명을 입력해주세요.","warning");
		return false;
	}

	if(termObject.termAbbr.length == 0){      //신규 등록할 때 용어 영문 약어명 칸에 길이가 0일경우
		alertMessage("경고", "용어영문약어명을 입력해주세요.", "warning");
		return false;
	}

	if(termObject.domainSeq == "nonSelected"){        //신규 등록할 때 도메인 선택을 하지 않을 경우 
		alertMessage("경고", "도메인을 선택해주세요.", "warning");
		return false;
	}

	return validated;
}

function duplicateCheck(termObject){  //중복체크
	let validated = true;
	$.ajax({
		url : contextPath + "/term/duplicateCheck",
		type : "POST",
		contentType : "application/json",
		data : JSON.stringify(termObject),
		async : false,
		success : function(data){
			if(!data.data){
				validated = false;
			}
		}
	});
	return validated;
}


function createTerm() {
	
	//상세 내용 입력칸에서 엔터값 br로 변경
	$("#termDscrpt").val($("#termDscrpt").val().replace(/(?:\r\n|\r|\n)/g, '<br>'));
	
	let sendData = {
		"termNm" : $("#termNm").val(),
		"termAbbr" : $("#termAbbr").val(),
		"domainSeq" : $("#domainSeq").val(),
		"termDscrpt" : $("#termDscrpt").val().trim(),
		"useYn" : "Y"
	};

	if(!duplicateCheck(sendData)){   //중복체크에서 중복되면 경고메시지
		alertMessage("경고", "이미 등록된 용어입니다.", "warning");
		return false;
	}
	toggleInputStatus(true);   //termNm과 termabbr 토글 함수
	$.ajax({
		url : contextPath + "/term/create",
		type : "POST",
		data : JSON.stringify(sendData),
		contentType : "application/json",
		success : function(data){
			if(data.data){
				alertMessage("성공", "용어가 생성되었습니다.", "success");
			} else{
				alertMessage("실패", "용어 생성에 실패했습니다.", "danger");
			}

			destroyTable();
			modalOff();
			toggleInputStatus(false);
			searchList(undefined,undefined,5);    //5개의 행 다시불러옴 
		}
	});
}
function modalOn(isCreated = true, termData = null){
	toggleInputStatus(false);
	clearFormData();
	$("#wordSelectTag").val(null).trigger("change");
	if(isCreated){
		$("#modalTitle").text("용어 신규 등록");
		$("#compositionDiv").css("display","flex");
		$("#modalConfirmButton").attr("onclick","saveConfirm();");
		$("#modalConfirmButton").attr("class","btn bg-teal");
		$("#modalConfirmButton").text("저장");
		$("#modalUpdateButton").css("display","none");
		$("#domainDetail").text("");
	}else{   //둘다 꺼짐
		$("#modalUpdateButton").css("display","block");
		$("#compositionDiv").css("display","none");
		let termSeq;
		$.ajax({
			url : contextPath + "/term/search",
			contentType : "application/json",
			type : "POST",
			data : JSON.stringify(termData),
			async : false,
			success : function(data){
				if(data.returnCode == "F")
					alertMessage("경고", "용어 정보를 불러오는데 실패했습니다.", "danger");

				$("#termNm").val(data.data.termNm);
				$("#termAbbr").val(data.data.termAbbr);
				if(data.data.termDscrpt != null) {
					$("#termDscrpt").val(data.data.termDscrpt.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n'));
				}
				$("#domainSeq").val(data.data.domainSeq);
				selectDoamin(data.data.domainSeq);
				termSeq = data.data.termSeq;
			}
		});
		$("#modalUpdateButton").attr("onclick",'updateConfirm('+termSeq+')');
		$("#modalConfirmButton").attr("class","btn bg-danger");
		$("#modalConfirmButton").attr("onclick",'deleteConfirm('+termSeq+')');
		$("#modalConfirmButton").text("삭제");
		$("#modalTitle").text("용어 상세 보기");
	}
	$("#modal_form_horizontal").modal("show");
}
function deleteConfirm(termSeq){
	checkConfirm('용어 삭제', '정말 삭제하시겠습니까?','deleteTerm('+termSeq+')');
}

function updateConfirm(termSeq){
	checkConfirm('용어 수정', '정말 수정하시겠습니까?','updateTerm('+termSeq+')');
}

function deleteTerm(termSeq){
	let sendData = {"termSeq" : termSeq};
	$.ajax({
		url : contextPath + "/term/delete",
		contentType : "application/json",
		data : JSON.stringify(sendData),
		type : "DELETE",
		success : function(data){
			if(data.data){
				alertMessage("성공", "용어가 삭제되었습니다.", "success");
			}else{
				alertMessage("실패", "용어 삭제에 실패했습니다.", "danger");
			}

			modalOff();
			toggleInputStatus(true);
			destroyTable();
			searchList();
		}
	});
}

function modalOff(){
	$("#modal_form_horizontal").modal("hide");
	$("#wordSelectTag").val(null).trigger("change");
	$("#termNm").val('');
	$("#termAbbr").val('');
	$("#termDscrpt").val('');
	$("#domainSeq").val("nonSelected");
}

function englishInputEvent(e){
	e.value = e.value.replace(/[^A-Za-z_]/ig, '');
}

function updateTerm(termSeq){
	
	//상세 내용 입력칸에서 엔터값 br로 변경
	$("#termDscrpt").val($("#termDscrpt").val().replace(/(?:\r\n|\r|\n)/g, '<br>'));
	
	let sendData = {
		"termDscrpt" : $("#termDscrpt").val(),
		"termSeq" : termSeq,
		"domainSeq" : $("#domainSeq").val()
	};
	$.ajax({
		url : contextPath + "/term/update",
		type : "PUT",
		data : JSON.stringify(sendData),
		contentType : "application/json",
		success : function(data){
			if(data.data){
				alertMessage("성공", "용어가 수정되었습니다.", "success");
			}else{
				alertMessage("실패", "용어 수정에 실패했습니다.", "danger");
			}

			modalOff();
			toggleInputStatus(true);
			destroyTable();
			searchList(undefined,undefined,5);
		}

	});
}

function toggleInputStatus(isEnabled){
	if(isEnabled){
		$("#termNm").removeAttr("disabled");
		$("#termAbbr").removeAttr("disabled");
	}else{
		$("#termNm").attr("disabled",true);
		$("#termAbbr").attr("disabled",true);
	}
}

function excelDownload_doc() {
	let serviceName = 'termListExcelDownload';
	let fileName = 'TERM_LIST_DOC';
	apiRequestExcel(serviceName, fileName, $("#search_form"));
}

function excelDownload_exerd() {
	let serviceName = 'termListExcelDownload';
	let fileName = 'TERM_LIST_EXERD';	
	apiRequestExcel(serviceName, fileName, $("#search_form"));
}
