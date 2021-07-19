$(document).ready(function() {
	
	var filterOption = {
		sysNm: { type: "text" },
		cd: { type: "text" },
		cdNm: { type: "text" },
		cdSbst: { type: "text" },
		useYn: {type: "text"},
		regDt: { type: "text" }
	}

	jui.ready(function(ui, uix, _) {
		var table_width = $("#xtable").outerWidth();
		xtable = uix.xtable("#xtable", {
			fields: [
				"sysNm",
				"cd",
				"cdNm",
				"cdSbst",
				"useYn",
				"regDt"
			],
			sort: true,
			sortLoading: false,
			sortExclude: "",
			buffer: "scroll",
			filterOption: filterOption,
			bufferCount: 200,
			scrollWidth: table_width,
			resize: true,
			colshow: true,
			// filterOption : filterOption,
			width: table_width,
			event: {
				colmenu: function(column, e) {
					this.toggleColumnMenu(e.pageX - 25);
				},
				select: function(row, e) {
					selectedRow = row.data;
					this.select(row.index);
				},
				colshow: function(column, e) { },
				colhide: function(column, e) { },
				colresize: function(column, e) { },
				dblclick: function(row, e) { 
					openDetail(row.data.sysCdNo);
				},
				sort: function(column, e) {
					var className = {
						desc: "icon-arrow1",
						asc: "icon-arrow3",
					}[column.order];
					$(xtable.listColumn()).each(function() {
						$(this.element).children("i").remove();
					});
					$(column.element).append("<i class='" + className + "'></i>");
				},
				filterChange: function(column){
					lastFilterData = column;						
					xtableFilterChange(xtable,column);
			
				},
			},
		});
	});

	jui.ready(["uix.window"], function(win) {
		modal = win("#modal", {
			width: window.innerWidth,
			height: window.innerHeight,
			modal: true,
		});
	});

	jui.ready(["uix.window"], function(win) {
		loading_modal = win("#loading_modal", {
			width: 50,
			height: 50,
			modal: true,
		});
	});

	jui.ready(["uix.window"], function(win) {
		alertModal = win("#alertModal", {
			width: 300,
			height: 200,
			modal: true,
		});
	});
})
	.on("click", "#modalClose", function() {
		$("#modalSystem").val("");
		$("#modalCd").val("");
		$("#modalCdNm").val("");
		$("#modalCdCmt").val("");
		$("#modalUse").val("");
		modal.hide();
	})
	.on("click", ".modal-footer .btn-light", function() {
		$("#modalSystem").val("");
		$("#modalCd").val("");
		$("#modalCdNm").val("");
		$("#modalCdCmt").val("");
		$("#modalUse").val("");
		modal.hide();
	})

$(window).load(function() {
	// 그리드 사이즈 조절
	$("#iw_container").height(window.innerHeight - 410);
	xtable.height($("#iw_container").height());
	$("#xtable > .body").height($("#iw_container").height() - 32);

	// 모달 사이즈 조절


	$("input[name=stDt]").val("");
	$("input[name=fnsDt]").val("");

	setSystemSelect();
	setSystemList(1);
	
	$("#opt_linelength").on("change", function(){
		setSystemList(1);
	});

	$(document).keydown(function(e){
		if(e.keyCode == 13){
			searchList(1);
		}
	});

	$("#page_input").keydown(function(e){
		if(e.keyCode == 13){
			e.stopPropagation();
		}
	});
});

function mbsAlert(msg, type) {
	var tost = swal.mixin({
		toast: true,
		position: "bottom",
		showConfirmButton: false,
		timer: 3000,
	});

	tost({
		type: type,
		title: msg,
	});

	$(".swal2-shown").css({
		"z-index": "9999",
	});
}

function mbsConfirm(title, msg, funcName, confirmButtonText = "Save") {
	var swalWithBootstrapButtons = swal.mixin({
		confirmButtonClass: "btn btn-primary mb-2",
		cancelButtonClass: "btn btn-danger mr-2 mb-2",
		buttonsStyling: false,
	});

	swalWithBootstrapButtons({
		title: title,
		text: msg,
		type: "info",
		showCancelButton: true,
		confirmButtonText: confirmButtonText,
		cancelButtonText: "Close",
		reverseButtons: true,
	}).then((result) => {
		if (result.value) {
			eval(funcName);
		}
	});

	$(".swal2-shown").css({
		"z-index": "9999",
	});
}

function goBeforePage(){
	if($("#page_input").val() > 1){
		setSystemList(parseInt($("#page_input").val())-1);
	}
}

//다음페이지
function goNextPage(){
	if($("#tot_page").text().replace(",","") != "" && $("#page_input").val() < parseInt($("#tot_page").text().replace(",",""))){
		searchList(parseInt($("#page_input").val())+1);
	}
}

function onlyNumber(event) {
	event = event || window.event;
	var keyID = event.which ? event.which : event.keyCode;
	if (
		(keyID >= 48 && keyID <= 57) ||
		(keyID >= 96 && keyID <= 105) ||
		keyID == 8 ||
		keyID == 9 ||
		keyID == 46 ||
		keyID == 37 ||
		keyID == 39
	) {
		return;
	} else {
		return false;
	}
}
function removeChar(event) {
	event = event || window.event;
	var keyID = event.which ? event.which : event.keyCode;
	if (keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39)
		return;
	else event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

function resetModal() {
		$("#modalSystem").val("MBS");
		$("#modalUse").val("Y");
		$("#modalCdNm").val("");
		$("#modalCdCmt").val("");
		$("#modalCd").val("");
		$("#confRegiModi").val("Register");
		$("#modalSysNo").val("");
}

function modalDataUp(cdNm) {
	if (cdNm == 0) {
		$("#modalSystem").val("MBS");
		$("#modalUse").val("Y");
		$("#modalCdNm").val("");
		$("#modalCdCmt").val("");
		$("#confRegiModi").val("Register");
		$("#modalSysNo").val("");
		return;
	}
	let $this = $(cdNm);
	$("#modalSystem").val($this.prev().prev().text());
	$("#modalUse").val($this.prev().text());
	$("#modalCdNm").val($this.text());
	$("#modalCdCmt").val($this.next().text());
	$("#modalSysNo").val($this.attr("title"));
	$("#confRegiModi").val("Modify");
}

function setSystemSelect() {
	$.ajax({
		url: contextPath + "/common/setSystemSelect",
		type: "POST",
		dataType: "json",
		success: function(res) {
			if (res.length > 0) {
				for (var i = 0; i < res.length; i++) {
					$("#sysNm").append(`
							<option value="${res[i].sysNm}">${res[i].sysNm}</option>
					`);
				}
			}
		},
		error: function(x, s, e) {
			console.log(x, s, e);
		},
	});
}

function setSystemList(currentPage = 1) {
	$("#allCheck").prop("checked", false);
	
	var listSize = Number($('#opt_linelength').val());
	var limitStart = Number((currentPage - 1)*listSize);
	
	$("#search_form [name=currentPage]").val(currentPage);
	$("#search_form [name=limitStart]").val(limitStart);
	$("#search_form [name=limit]").val(listSize);
	
	apiRequest("/common/setSystemList", $("#search_form"), "POST", true , xtable)
		.done(function(data) {
			xtable.update(data.data);
			$("#page_input").val(data.pagination.currentPage);
			$("#tot_page").text(numberWithCommas(data.pagination.rowCountPerPage));
			$("#tot_cnt").text(numberWithCommas(data.pagination.totalCount) + " rows");
		})
		.fail(function() { });
}

function setListPaging() {
	var data = getData();

	$.ajax({
		url: contextPath + "/common/setListPaging",
		type: "POST",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(result) {
			$("#endPage").val(result.endPage);
			var $area = $("#pagingArea");
			$area.html("");
			$area.append(`
					<button id="prevv" disabled>&lt;&lt;</button>
					<button id="prev" disabled>&lt;</button>
					<button class="pagingNo cPage" disabled>1</button>
			`);
			for (var i = 2; i <= result.endPage; i++) {
				if (i == 6) break;
				$area.append(`
						<button class="pagingNo">${i}</button>
				`);
			}
			$area.append(`
					<button id="next">&gt;</button>
					<button id="nextt">&gt;&gt;</button>
			`);

			if (result.endPage < 6) {
				$("#next").attr("disabled", true);
				$("#nextt").attr("disabled", true);
			}
			$("#pagingSysNm").val(data.sysNm);
			$("#pagingCdNm").val(data.cdNm);
		},
		error: function(x, s, e) {
			console.log(x, s, e);
		},
	});
}

function getData() {
	var sysNm = $("#sysNm :selected").val();
	var code = $("[name=sysCd]").val();

	if (code == "" || code == undefined) code = "";

	var data = {
		sysNm: sysNm,
		cdNm: code,
	};

	return data;
}

function resetList(sPage, cPage) {
	var data = getData();
	var _currentPage = $("#page_input").val();
	var _listSize = Number($("#opt_linelength").val());
	var _limitStart = Number((_currentPage - 1) * _listSize);

	var param = {
		sysNm: data.sysNm,
		cdNm: "",
		currentPage: _currentPage,
		limitStart: _limitStart,
		limit: _listSize,
	};

	apiRequest("/common/resetList", param, "POST")
		.done(function(data) {
			xtable.update(data.data);
			$("#tot_page").text(data.pagination.rowCountPerPage);
			$("#tot_cnt").text(data.pagination.totalCount + " rows");
		})
		.fail(function() { });
}

function openPopUp(type) {
	if ((type = "add")) {
		$("#confRegiModi").val("Register");
	}
	resetModal();
	modal.show();
}
function resetPaging(sPage, cPage) {
	var data = regetData();
	data.sPage = sPage;
	data.cPage = cPage;

	$.ajax({
		url: contextPath + "/common/resetPaging",
		type: "POST",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(result) {
			var $area = $("#pagingArea");
			$area.html("");
			$area.append(`
					<button id="prevv">&lt;&lt;</button>
					<button id="prev">&lt;</button>
			`);
			if (sPage < 6) {
				$("#prevv").attr("disabled", true);
				$("#prev").attr("disabled", true);
			}

			for (var i = sPage; i <= result.endPage; i++) {
				if (i == sPage + 5) break;
				if (i == cPage) {
					$area.append(`
							<button class="pagingNo" disabled>${i}</button>
					`);
				} else {
					$area.append(`
							<button class="pagingNo">${i}</button>
					`);
				}
			}
			$area.append(`
					<button id="next">&gt;</button>
					<button id="nextt">&gt;&gt;</button>
			`);

			if (sPage + 5 > result.endPage) {
				$("#next").attr("disabled", true);
				$("#nextt").attr("disabled", true);
			}
		},
		error: function(x, s, e) {
			console.log(x, s, e);
		},
	});
}

function regetData() {
	var data = {
		sysNm: $.trim($("#pagingSysNm").val()),
		cdNm: $.trim($("#pagingCdNm").val()),
	};
	if (data.sysNm == "" || data.sysNm == undefined) data.sysNm = "";
	if (data.cdNm == "" || data.cdNm == undefined) data.cdNm = "";

	return data;
}

function sysRegiConfirm() {
	if (mbsConfirm("Are you sure you want to proceed?")) return true;
	else return false;
}

function deleteSearch() {
	$("#sysNm").val("all");
	$("#cdNm").val("");
	$("#useYn1").val("");
	$("#cd").val("");
	$("#cdSbst").val("");
}

function deleteBtn() {
	if ($('#xtable input[name="packageList"]:checked').length == 0) {
		mbsAlert("Please select a code to delete.");
		return;
	}

	$("#select_form").children().remove();

	var _delLeng = $('#xtable input[name="packageList"]:checked').length;
	var delList = "";
	$('#xtable input[name="packageList"]:checked').each(function(index) {
		delList += $(this).val();

		if (_delLeng - 1 != index) {
			delList += ",";
		}
	});

	$("#select_form").append(
		"<input type='hidden' name='packageList' value=" + delList + ">"
	);

	$.ajax({
		url: contextPath + "/common/deleteSysCd",
		type: "POST",
		data: $("#select_form").serialize(),
		dataType: "json",
		success: function(data) {
			mbsAlert("Deleted", "success");
			searchList(1);
		},
		error: function(request, status, error) {
			mbsAlert("Failed. Please contact your administrator.");
			console.log(error);
		},
	});
}


function validation(){	
	if( isEmpty($("#insert_form [name=modalSystem]").val()) ){
		mbsAlert("System must not empty", "error");
		return true;
	}
	if( isEmpty($("#insert_form [name=modalCd]").val()) ){
		mbsAlert("Code must not empty", "error");
		return true;
	}
	if( isEmpty($("#insert_form [name=modalCdNm]").val()) ){
		mbsAlert("Code Name must not empty", "error");
		return true;
	}
	
	if(  isEmpty($("#insert_form [name=modalCdCmt]").val()) ){
		mbsAlert("Code Comment must not empty", "error");
		return true;
	}
	
	if(  isEmpty($("#insert_form [name=modalUse]").val()) ){
		mbsAlert("Use must not empty", "error");
		return true;
	}
	return false;
}

function fnSave() {
	
	//validation
	if(validation()){
		return;
	}
	
	mbsConfirm('Save', 'Would you want to save System Code?', 'RegiModi()');	
	
}
function RegiModi() {
	var data = {
		sysNm: $("#modalSystem").val(),
		useYn: $("#modalUse").val(),
		cd: $("#modalCd").val(),
		cdNm: $("#modalCdNm").val(),
		cdSbst: $("#modalCdCmt").val(),
		sysCdNo: $("#modalSysNo").val()
	};

	if ($("#confRegiModi").val() == "Register") {
		data.regrId = JSON.parse(sessionStorage.getItem("memberInfo")).id;

		apiRequest("/common/selectExistSysCode", data, "POST")
			.done(function(_data) {
				if (_data.result != 0) {
					mbsAlert("The code is already registered.", "error");
					return;
				} else {
					$.ajax({
						url: contextPath + "/common/sysRegister",
						type: "POST",
						contentType: "application/json;charset=utf-8",
						data: JSON.stringify(data),
						success: function(res) {
							if (res == "1") {
								mbsAlert("Registration Complete","success");

								$("#modalClose").trigger("click");

								resetList(1, 1);
							}
						},
						error: function(x, s, e) {
							badRequestProcess(x);
						},
					});
				}
			})
			.fail(function() { });
	} else if ($("#confRegiModi").val() == "Modify") {
		apiRequest("/common/sysModify", data, "POST")
			.done(function() {
				mbsAlert("Modify Complete","success");
				modal.hide();
				setSystemList(1);
			})
			.fail(function(data){
				badRequestProcess(data);
			});
	}
}

// xtable filterChange
function xtableFilterChange(_xtable , column){
   if(_xtable == null){
      return;
   }
   
   var f = function(xtable) {
      return function(data,index) {
         var flag = true;
         
         xt = xtable;

         $.each(Object.keys(column),function(colIdx) {
            
            
            var _str = this.toString();
            var _colIdx = xt.options.fields.indexOf(_str);
            if (_colIdx < 0){ _colIdx = 0; }
            var _searchStr = column[_str].toUpperCase();
            var _dataStr = data[_str];
            var _rowList = xt.rowList;
            var _colText = _rowList.length ? _colText = _rowList[index].list[_colIdx].textContent.toUpperCase() : null;
            var _colType = xt.options.filterOption[_str].type;
            
            
            if (_searchStr != "") {
               if(_colType == "number"){
                  _colText = _colText.replaceAll(/,/g,"");
               }
               if (_colText == null|| _colText.indexOf(_searchStr) == -1) {
                  flag = false;
                  return;
               }
               
            }
         });

         return flag;
      };
   }(_xtable);
   
   _xtable.filter(f);
}

function excelDownload(){
	apiRequestExcel("systemCodeExcelDownload","System Code List",$("#search_form"));
}

function openDetail(sysCdNo){

	$("#modal .modal-footer .insert-btn").hide();
	$("#modal .modal-footer .update-btn").show();
	$("#modal .modal-footer .close-btn").show();
	$("#modal .modal-title").html('System Code Detail');
	
	var param = {
		"sysCdNo" : sysCdNo
	};
	
	apiRequest("/common/selectSystemCode", param, "POST")
	.done(function(data){
		if(data.data != null && data.data != undefined){
			$("#confRegiModi").val("Modify");
			$("#modalSystem").val(data.data.sysNm);
			$("#modalCd").val(data.data.cd);
			$("#modalCdNm").val(data.data.cdNm);
			$("#modalCdCmt").val(data.data.cdSbst);
			$("#modalUse").val(data.data.useYn);
			$("#modalSysNo").val(data.data.sysCdNo);
			modal.show();
			$("#modal .modal-body").scrollTop(0);
		}
	})
	.fail(function(){});
	
}

function cellBackground(data){
	if(data == "Y"){
		return "background-color:paleturquoise;";
	}else{
		return "background-color:lightcoral;";
	}
}