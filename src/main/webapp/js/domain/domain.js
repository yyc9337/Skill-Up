// 특수문자 정규식 변수(공백 미포함)
var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;

$(document).ready(function () {
  categorySelect(); // 도메인 검색시 사용할 카테고리 목록 불러오기
  searchList(); // 도메인 목록 조회

  // ENTER 입력시 searchButton이 click되게 함
  $("#keyword").keydown(function (key) {
    if (key.keyCode == 13) {
      $("#searchButton").trigger("click");
    }
  });

  // 미완성 한글 및 특수문자는 입력할 수 없게 함
  $("#domainTypeNm")
    .on("focusout", function () {
      var x = $(this).val();
      if (x.length > 0) {
        if (x.match(replaceChar) || x.match(replaceNotFullKorean)) {
          x = x.replace(replaceChar, "").replace(replaceNotFullKorean, "");
        }
        $(this).val(x);
      }
    })
    .on("keyup", function () {
      $(this).val($(this).val().replace(replaceChar, ""));
    });
});

$("html").click(function (e) {
  // modal2가 열려있을때 기존에 열려있던 modal의 zIndex 수정을 통해 modal2가 최상단에 보일수 있게 함
  if ($("#modal2").hasClass("show") === true) {
    document.getElementById("modal").style.zIndex = 1040;
  } else {
    document.getElementById("modal").style.zIndex = 1050;
  }
});

/**
 * 데이터 타입 선택 시 데이터 길이 및 소수점 길이 설정
 * @param dataType : 데이터 입력시 사용하는 dataType
 *
 */
function readOnlyOption(dataType) {
  /**
	데이터 타입을 선택하지 않은 경우 : 데이터 길이, 소수점 길이 둘다 readOnly
	데이터 타입을 선택했을 경우 : TB_DOMAIN_CD 에 저장된 데이터 타입별 옵션에 따라 처리함
	 */
  if (dataType == "") {
    $("#insert_form input[name=dataLen]").attr("readonly", true);
    $("#insert_form input[name=dcmlLen]").attr("readonly", true);
    $("#insert_form input[name=dataLen]").val("");
    $("#insert_form input[name=dcmlLen]").val("");

    $("#dataLenStar").hide();
    $("#dcmlLenStar").hide();
  } else {
    $.ajax({
      url: contextPath + "/code/domainCodeList?cdNm=" + dataType,
      contentType: "application/json",
      type: "POST",
      async: false,
      success: function (data) {
        const { dataLenYn, dcmlLenYn } = data.data[0];
        if (data.data.length > 0) {
          if (dataLenYn == "N") {
            $("#insert_form input[name=dataLen]").attr("readonly", true);
            $("#insert_form input[name=dcmlLen]").attr("readonly", true);
            $("#insert_form input[name=dataLen]").val("");
            $("#insert_form input[name=dcmlLen]").val("");

            $("#dataLenStar").hide();
            $("#dcmlLenStar").hide();
          } else if (dataLenYn == "Y" && dcmlLenYn == "N") {
            $("#insert_form input[name=dataLen]").attr("readonly", false);
            $("#insert_form input[name=dcmlLen]").attr("readonly", true);
            $("#insert_form input[name=dcmlLen]").val("");

            $("#dataLenStar").show();
            $("#dcmlLenStar").hide();
          } else {
            $("#insert_form input[name=dataLen]").attr("readonly", false);
            $("#insert_form input[name=dcmlLen]").attr("readonly", false);

            $("#dataLenStar").show();
            $("#dcmlLenStar").show();
          }
        }
      },
    });
  }
}

//도메인 검색시 사용할 카테고리 목록(셀렉트 박스) 불러오기
function categorySelect() {
  $.ajax({
    url: contextPath + "/domain/searchType",
    contentType: "application/json",
    type: "GET",
    success: function (data) {
      for (let i in data.data) {
        let option = $("<option>");
        $(option).val("domainNm").text(data.data[i].columnComment);
        $("#searchType").append($(option));
      }
    },
  });
}

//데이터 타입 선택 셀렉트 박스 불러오기
function dataTypeSelect() {
  $.ajax({
    url: contextPath + "/code/domainCodeList",
    contentType: "application/json",
    type: "POST",
    async: false,
    success: function (data) {
      $("#dataType").children("option:not(:first)").remove();
      for (let i in data.data) {
        let option = $("<option>");
        $(option).val(data.data[i].cdNm).text(data.data[i].cdNm);
        $("#dataType").append($(option));
      }
    },
  });
}

/**
 * 도메인 목록 조회
 * @param searchType 검색 카테고리
 * @param keyword 검색어
 * @param orderNumber 정렬순서
 */
function searchList(searchType, keyword, orderNumber) {
  //Sorting 하기 위한 컬럼들 서버로 가지고감
  let columns = [
    "DOMAIN_SEQ",
    "DOMAIN_NM",
    "DOMAIN_TYPE_NM",
    "DATA_TYPE",
    "DATA_LEN",
    "DCML_LEN",
    "DOMAIN_DSCRPT",
    "UPD_DT",
  ];

  if (orderNumber == undefined) {
    orderNumber = 1;
  }
  let order = orderNumber == 1 ? "asc" : "desc";

  //sAjaxSource 를 사용하면 기본적인 DataTable에 사용되는 옵션들을 객체로 가지고 감. 서버의 DomainVO 객체 확인하기
  $("#domainTable").DataTable({
    processing: true,
    serverSide: true,
    responsive: true,
    autoWidth: true,
    sAjaxSource:
      contextPath +
      "/domain/list?columns=" +
      columns +
      "&keyword=" +
      keyword +
      "&searchType=" +
      searchType,
    sServerMethod: "POST",

    // popover
    drawCallback: function (settings, json) {
      //$('[data-toggle="tooltip"]').tooltip('update');
      $('[data-toggle="popover"]').popover("update");
    },
    columns: [
      { data: "domainSeq", width: "10%" },
      { data: "domainNm" },
      { data: "domainTypeNm" },
      { data: "dataType" },
      { data: "dataLen", width: "10%" },
      { data: "dcmlLen", width: "10%" },
      { data: "summaryDomainDscrpt" },
      { data: "updDt" },
    ],
    columnDefs: [
      { targets: [0] },
      { targets: [1] },
      { targets: [2] },
      { targets: [3] },
      { targets: [4] },
      { targets: [5] },
      { targets: [6] },
      { targets: [7], title: "수정 날짜", visible: false },
    ],
    order: [[orderNumber, order]],

    // pop over
    createdRow: function (row, data, dataIndex) {
      // 설명이 존재할 경우에만 pop over 사용
      if (data["domainDscrpt"] != "-") {
        $(row).find("td:eq(6)").attr("data-container", "body");
        $(row).find("td:eq(6)").attr("data-content", data["domainDscrpt"]);
        $(row).find("td:eq(6)").attr("data-toggle", "popover");
        $(row).find("td:eq(6)").attr("data-trigger", "hover");
      }
    },
  });

  // 테이블의 tr태그 더블클릭시 update modal 열림
  $("#domainTable tbody").on("dblclick", "tr", function () {
    let table = $("#domainTable").DataTable();
    let rowData = table.row(this).data();

    if (rowData != undefined) {
      $("#newButton").click();

      if (searchType == "DeleteList") {
        openModal("revival", rowData.domainSeq);
      } else {
        openModal("update", rowData.domainSeq);
      }
    }
  });

  // 검색어 카테고리 변경시 검색어 Input box에 focus on 됨
  $("#searchType").change(function () {
    $("#keyword").focus();
  });

  // 검색 결과가 바뀌어도 dataTable의 최소 높이를 580px로 고정
  let dataTableHeight = document.getElementsByClassName(
    "dataTables_scrollBody"
  )[0];
  dataTableHeight.style.minHeight = "580px";
}

//modal2에서 중복인 도메인 리스트 목록 조회
function searchList2() {
  let keyword = $("#domainTypeNm").val().trim();
  let searchType = "domainTypeNm";
  let domainSeq = $("#domainSeq").val().trim();

  $("#domainTypeTable").DataTable({
    dom: '<"datatable-scroll"t><"datatable-footer">',
    paging: false,
    autoWidth: false,
    scrollY: "210",
    language: {},
    sAjaxSource:
      contextPath +
      "/domain/list?keyword=" +
      keyword +
      "&searchType=" +
      searchType +
      "&domainSeq=" +
      domainSeq,
    sServerMethod: "POST",
    columns: [
      { data: "domainSeq" },
      { data: "domainNm" },
      { data: "domainTypeNm" },
      { data: "dataType" },
      { data: "dataLen" },
      { data: "dcmlLen" },
    ],
    initComplete: function (settings, json) {
      setTimeout(function () {
        $("#orderId").click();
      }, 200);
    },
  });
}

//검색 버튼 클릭 이벤트
function searchDomain() {
  let searchType = $("#searchType").val();
  let keyword = $("#keyword").val();
  let dataTable = $("#domainTable").DataTable();

  /**
 	  키워드 미입력 + 전체 + 검색버튼 클릭 -> 전체 리스트 조회
 	  키워드 미입력 + 카테고리 선택(전체 제외) + 검색버튼 클릭 -> warningNoKeywordMessage 출력
 	  키워드 입력 + 카테고리 선택 + 검색버튼 클릭 -> 해당 키워드 및 카테고리로 검색
 	 */
  if (keyword == "") {
    if ($("#searchType").val() == "all") {
      dataTable.clear().destroy();
      searchList();
    } else {
      alertMessage(warning, warningNoKeywordMessage, "warning");
      return false;
    }
  } else {
    dataTable.clear().destroy();
    searchList(searchType, keyword);
  }
}

//검색 초기화 아이콘 클릭 이벤트
function resetSearch() {
  // 검색어 분류는 전체로, 검색어는 비워줌
  $("#searchType").val("all");
  $("#keyword").val("");

  // dataTable도 다시 그려줌
  let dataTable = $("#domainTable").DataTable();
  dataTable.destroy();
  searchList();
}

/**
 * 모달 초기화 (신규 등록 및 상세 보기)
 * @param type : 모달 창의 종류 (add, update)
 * @param domainSeq : 도메인시퀀스 번호
 */
function openModal(type, domainSeq) {
  dataTypeSelect(); // 데이터 타입 셀렉트박스 불러옴
  clearFormData(); // form안에 입력 내용을 비워줌 (common.js)
  readOnlyOption(""); // 데이터 타입이 선택되지 않았으므로 데이터 길이 및 소수점 길이 입력 불가

  //add = 신규등록 , update = 상세보기, revival = 단어 복원
  if (type == "add") {
    $("#modal #saveButton").show();
    $("#modal #updateButton").hide();
    $("#modal #deleteButton").hide();
    $("#modal #revivalButton").hide();
    $("#modal .modal-title").html(modalRegistHeader);
  } else if (type == "update" || type == "revival") {
    $("#modal #saveButton").hide();
    
    if (type == "update") {
	  $("#modal .modal-title").html(modalUpdateHeader);
      $("#modal #revivalButton").hide();
      $("#modal #updateButton").show();
      $("#modal #deleteButton").show();
    } else {
	  $("#modal .modal-title").html("도메인 복원");
      $("#modal #revivalButton").show();
      $("#modal #deleteButton").hide();
      $("#modal #updateButton").hide();
      $("#insert_form input[name=domainTypeNm]").attr("readonly", true);
      $("#insert_form select[name=dataType]").attr("readonly", true);
      $("#insert_form textarea[name=domainDscrpt]").attr("readonly", true);
    }
    
    $("#insert_form input[name=domainSeq]").val(domainSeq);

    let sendData = {
      domainSeq: domainSeq,
    };

    // domain/select에 넘겨준 domainSeq로 선택한 도메인 정보를 불러와 화면에 뿌려줌
    $.ajax({
      url: contextPath + "/domain/select",
      contentType: "application/json",
      type: "GET",
      data: sendData,
      async: false,
      success: function (data) {
        const {
          domainTypeNm,
          domainNm,
          dataType,
          dataLen,
          domainDscrpt,
          dcmlLen,
        } = data.data;
        $("#insert_form input[name=domainTypeNm]").val(domainTypeNm);
        $("#insert_form input[name=domainNm]").val(domainNm);
        $("#insert_form #dataType").val(dataType);
        $("#insert_form input[name=dataLen]").val(dataLen);
        if (domainDscrpt != null) {
          $("#insert_form #domainDscrpt").val(
            domainDscrpt.replace(/(<br>|<br\/>|<br \/>)/g, "\r\n")
          );
        }
        $("#insert_form input[name=dcmlLen]").val(dcmlLen);
        readOnlyOption(dataType);
      },
    });
  }

  // 데이터 타입 변경시 변경된 데이터 타입에 맞게 readOnlyOption 함수 재실행
  // NUMBER일 경우 소수점 길이 활성화
  // XML 또는 DATETIME 일 경우 데이터 길이 및 소수점 길이 비활성화
  $("#dataType").change(function () {
    let selectDataTypeValue = $("#insert_form #dataType").val().trim();
    readOnlyOption(selectDataTypeValue);
  });

  $(".autoCreate").on("propertychange change keyup paste input", function () {
    domainNameAutoCreate(
      $("#domainTypeNm").val(),
      $("#dataType").val(),
      $("#dataLen").val(),
      $("#dcmlLen").val()
    );
  });
}

//입력 정보 유효성 검사
function insertValidation() {
  let result = true;

  // 도메인 분류명을 입력하지 않은 경우
  if ($("#domainTypeNm").val().trim().length == 0) {
    alertMessage(warning, warningNoDomainTypeName, "warning");
    $("#domainTypeNm").focus();
    //$("#cancelButton2").click();
    result = false;
  }

  // 데이터 타입을 입력하지 않은 경우
  if ($("#dataType").val().trim() == "") {
    alertMessage(warning, warningNoDataType, "warning");
    $("#dataType").focus();
    $("#cancelButton2").click();
    result = false;
  } else {
    // 도메인 분류명, 데이터 타입을 모두 입력한 경우
    // 데이터 타입에 따라 데이터 길이, 소수점 길이 입력 필요 여부 확인
    $.ajax({
      url:
        contextPath +
        "/code/domainCodeList?cdNm=" +
        $("#dataType").val().trim(),
      contentType: "application/json",
      type: "POST",
      async: false,
      success: function (data) {
        const { dataLenYn, dcmlLenYn } = data.data[0];
        if ($("#dataLen").val().length == 0 && dataLenYn == "Y") {
          alertMessage(warning, warningNoDataLength, "warning");
          $("#dataLen").focus();
          result = false;
        } else if (dcmlLenYn == "Y") {
          if ($("#dcmlLen").val().length == 0) {
            alertMessage(warning, warningNoDecimalLength, "warning");
            $("#dataLen").focus();
            result = false;
          } else if (
            parseInt($("#dcmlLen").val()) > parseInt($("#dataLen").val())
          ) {
            alertMessage(warning, warningNoDataDecimal, "warning");
            $("#dataLen").focus();
            result = false;
          }
        }
      },
    });
  }

  // 도메인명이 입력되지 않은 경우
  if ($("#domainNm").val().trim().length == 0) {
    alertMessage(warning, warningNoDomainName, "warning");
    $("#doaminNm").focus();
    result = false;
  }

  return result;
}

/**
 * 도메인명 중복 검사
 * @param sendData : form에 입력된 데이터
 * @returns flag : 중복 여부 (boolean)
 */
function duplicateNameCheck(sendData) {
  let flag = true;

  $.ajax({
    url: contextPath + "/domain/duplicationNameCheck",
    contentType: "application/json",
    type: "GET",
    data: sendData,
    async: false,
    success: function (data) {
      if (data.data >= 1) {
        alertMessage(warning, warningExistDomainName, "warning");
        //$("#cancelButton2").click();
        $("#modal2").removeClass("show");
        flag = false;
      }
    },
  });

  return flag;
}

/**
 * 도메인 분류명 중복검사
 * @param domainTypeNm : 도메인 분류명
 * @param type : 1 - 신규등록, 2 - 수정
 */
function duplicateDomainTypeName(domainTypeNm, type) {
  let sendData = {
    domainTypeNm: domainTypeNm,
  };

  let domainSeq = $("#domainSeq").val();

  $.ajax({
    url: contextPath + "/domain/duplicateDomainTypeName",
    contentType: "application/json",
    type: "GET",
    data: sendData,
    async: false,
    success: function (data) {
      let table2 = $("#domainTypeTable").DataTable();
      table2.destroy();

      if (data.data.length == 0) {
        //중복 된 리스트가 없을 경우 바로 신규 등록, 수정 됨
        if (type == 1) {
          saveConfirm();
        } else if (type == 2) {
          updateConfirm();
        }
      } else if (data.data.length == 1) {
        // 중복 된 리스트가 한개만 있을경우
        // 신규 등록 : 중복안내 및 등록 여부 확인
        // 업데이트 : 해당 데이터 수정 시 입력한 도메인 분류명이 동일한지 확인 후 중복 안내
        if (type == 1) {
          $("#domainTypeNmListTitle").html(modalRegistHeader);
          $("#domainTypeButton").click();
          $("#saveButton2").show();
          $("#updateButton2").hide();
        } else if (type == 2) {
          if (data.data[0].domainSeq == domainSeq) {
            updateConfirm();
          } else {
            $("#domainTypeNmListTitle").html(modalUpdateHeader);
            $("#domainTypeButton").click();
            $("#saveButton2").hide();
            $("#updateButton2").show();
          }
        }
      } else if (data.data.length >= 2) {
        //중복 된 리스트가 2개 이상일 경우 모두 중복 안내
        if (type == 1) {
          $("#domainTypeNmListTitle").html(modalRegistHeader);
          $("#domainTypeButton").click();
          $("#saveButton2").show();
          $("#updateButton2").hide();
        } else if (type == 2) {
          $("#domainTypeNmListTitle").html(modalUpdateHeader);
          $("#domainTypeButton").click();
          $("#saveButton2").hide();
          $("#updateButton2").show();
        }
      }
    },
  });
}

/**
 * 저장 시 입력값 유효성 검사 및 중복 검사 실행
 * 중복검사는 도메인명 -> 도메인분류명 순서로 실행됨
 * 도메인 분류명은 중복 사용 가능
 * @param type : 1 - 신규등록, 2 - 수정
 */
function checkDoaminTypeNameConfirm(type) {
  let duplicateNameCheckData = $("#insert_form").serializeObject();

  // 입력 값 유효성 검사
  if (!insertValidation()) {
    return;
  }

  // 도메인명 중복 검사
  if (!duplicateNameCheck(duplicateNameCheckData)) {
    return;
  }

  // 도메인 분류명 중복 검사
  let domainTypeName = $("#domainTypeNm").val().trim();
  duplicateDomainTypeName(domainTypeName, type);
}

// 저장 여부 확인
function saveConfirm() {
  checkConfirm(modalRegistHeader, registConfirmMessage, "insertDomain();");
}

//저장 기능
function insertDomain() {
  let sendData = $("#insert_form").serializeObjectCustom();
  let dataTable = $("#domainTable").DataTable();

  $.ajax({
    url: contextPath + "/domain/insert",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(sendData),
    async: false,
    success: function (data) {
      if (data.data == 1) {
        alertMessage(succ, succInsertDomain, "success");
        $("#cancelButton").click();
        $("#cancelButton2").click();
        dataTable.destroy();
        searchList("", "", 7); // 방금 저장된 도메인이 최 상단에 나올수 있게 정렬순서 지정
      } else {
        alertMessage(danger, dangerInsertDomain, "danger");
        $("#cancelButton").click();
      }
    },
  });
}

//삭제 여부 확인
function deleteConfirm(domainSeq) {
  var domainSeq = $("#modal #domainSeq").val().trim();
  checkConfirm(
    modalDeleteHeader,
    deleteConfirmMessage,
    "deleteDomain(" + domainSeq + ")"
  );
}

//삭제 기능
// 실제로 DB에서 삭제되는게 아니라 USE_YN = "N" 으로 변경됨
function deleteDomain(domainSeq) {
  let dataTable = $("#domainTable").DataTable();
  let sendData = {
    domainSeq: domainSeq,
  };

  $.ajax({
    url: contextPath + "/domain/delete",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(sendData),
    async: false,
    success: function (data) {
      if (data.data == 1) {
        alertMessage(succ, succDeleteDomain, "success");
        $("#cancelButton").click();
        dataTable.destroy();
        searchList();
      } else {
        alertMessage(danger, dangerDeleteDomain, "danger");
      }
    },
  });
}

//수정 여부 확인
function updateConfirm() {
  checkConfirm(modalUpdateHeader, updateConfirmMessage, "updateDomain();");
}

//수정 기능
function updateDomain() {
  let sendData = $("#insert_form").serializeObjectCustom();
  let dataTable = $("#domainTable").DataTable();

  $.ajax({
    url: contextPath + "/domain/insert",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(sendData),
    async: false,
    success: function (data) {
      if (data.data == 2) {
        alertMessage(succ, succUpdateDomain, "success");
        $("#cancelButton").click();
        $("#cancelButton2").click();
        dataTable.destroy();
        searchList("", "", 7); // 방금 저장된 도메인이 최 상단에 나올수 있게 정렬순서 지정
      } else {
        alertMessage(danger, dangerUpdateDomain, "danger");
        $("#cancelButton").click();
        $("#cancelButton2").click();
      }
    },
  });
}

/**
 * 도메인명 자동 생성
 * @param domainTypeNm : 도메인 분류명
 * @param dataType : 데이터 타입
 * @param dataLen : 데이터 길이
 * @param dcmlLen : 소수점 길이
 */
function domainNameAutoCreate(domainTypeNm, dataType, dataLen, dcmlLen) {
  if (dataType == "VARCHAR") {
    dataType = "VC";
  }

  if (dataLen == "" && dcmlLen == "") {
    $("#modal #domainNm").val(`${domainTypeNm.trim()}${dataType}`);
  } else if (dcmlLen != "") {
    $("#modal #domainNm").val(
      `${domainTypeNm.trim()}${dataType}(${dataLen.trim()},${$("#dcmlLen")
        .val()
        .trim()})`
    );
  } else {
    $("#modal #domainNm").val(
      `${domainTypeNm.trim()}${dataType}(${dataLen.trim()})`
    );
  }
}

// excel 다운로드
function excelDownload_doc() {
  let serviceName = "domainListExcelDownload";
  let fileName = "DOMAIN_LIST_DOC";
  apiRequestExcel(serviceName, fileName, $("#search_form"));
}

// exerd 다운로드
function excelDownload_exerd() {
  let serviceName = "domainListExcelDownload";
  let fileName = "DOMAIN_LIST_EXERD";
  apiRequestExcel(serviceName, fileName, $("#search_form"));
}

// 삭제 기록 조회
function Delete_History() {
  let dataTable = $("#domainTable").DataTable();
  dataTable.destroy();
  searchList("DeleteList","",7); // 가장 최근에 삭제된 도메인이 맨 위로 오게 정렬
  $("#revivalButton").hide();
  $("#listButton").show();
}

// 복원 여부 확인
function revivalConfirm() {
  if (!insertValidation()) {
    return;
  }
  checkConfirm("단어 복원", "단어를 재사용하시겠습니까?", "revivalDomain();");
}

// 복원 기능
function revivalDomain() {
  let sendData = $("#insert_form").serializeObjectCustom();
  let dataTable = $("#domainTable").DataTable();

  $.ajax({
    url: contextPath + "/domain/revival",
    contentType: "application/json",
    type: "POST",
    data: JSON.stringify(sendData),
    async: false,
    success: function (data) {
      if (data.data == 1) {
        alertMessage("성공!", "단어 복원이 완료되었습니다.", "success");
        $("#cancelButton").click();
        Delete_History();
      } else {
        alertMessage(
          "경고!",
          "실패하였습니다. 관리자에게 문의해주세요.",
          "danger"
        );
        $("#cancelButton").click();
      }
    },
  });
}

// 원래 목록 보기
function showList() {
	let dataTable = $("#domainTable").DataTable();
  dataTable.destroy();
  searchList("","",7);
  $("#revivalButton").show();
  $("#listButton").hide();
}
