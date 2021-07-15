<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<html>
<head>
    <script>
        var contextPath = "${pageContext.request.contextPath}";
    </script>
    <script>
    /*COMMON*/
	    var contextPath = "${pageContext.request.contextPath}";
	    var modalYes = "<spring:message code='common.modalYes'/>";
	    var modalNo = "<spring:message code='common.modalNo'/>";
	    var warning = "<spring:message code='common.warning'/>";
	    var succ = "<spring:message code='common.succ'/>";
	    var danger = "<spring:message code='common.danger'/>";
	    var totalDataCount = "<spring:message code='common.totalDataCount'/>";
    </script>
    <script src="${pageContext.request.contextPath}/js/table/inputPage.js"></script>
	<script src="${pageContext.request.contextPath}/js/table/pageListBox.js"></script>
    <script src="${pageContext.request.contextPath}/js/table/dataTable.js"></script>
    <script src="${pageContext.request.contextPath}/js/word/word.js"></script>

    <!-- Main content -->

    <style>
    	table.modalTable thead th,
    	table.modalTable tbody th, 
    	table.modalTable tbody td {
		    padding: 5px 20px; 
		}
    	.helper {
    		font-size:11px;
    		margin-left:8px;
    		
    	}
    	.paginate_input {
    	    text-align: center;
			width: 70px;
			display: inline;
		    padding: .4375rem .875rem;
		    font-size: .8125rem;
		    font-weight: 400;
		    line-height: 1.5385;
		    color: #333;
		    background-color: #fff;
		    background-clip: padding-box;
		    border: 1px solid #ddd;
		    border-radius: .1875rem;
		    box-shadow: 0 0 0 0 transparent;
		    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
		}
    
    	.input-short {
    		width: 30%;
    		margin-right: 8px;
    		display: inline;
    	}
    	.table-bordered-0 {
			table-layout: fixed;
		}
        .modalTable {
            table-layout: fixed;
    		max-height: 120px !important;
    		
        }
		row.fatal {
			background-color: blanchedalmond;
		}	
	    #wordTable tbody tr {
			cursor: pointer;
		}
        .alert {
            display: none;
            position: fixed;
            top: 85%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            z-index: 9999;
        }

        #wordTypeTable tr {
            width: 1000px;
        }

        table {
            font-size: 12px;
        }
        
        table.modalTable > thead {
            font-size: 12px;
            background-color: gainsboro;;
        }

        div.stage {
        	display: none;
        }

        td{
            text-overflow: ellipsis;
            overflow-x: hidden;
        }

        #wordTable tr:hover{
            background: lightgrey;
        }

        #cancelButton{
            background: darkgray;
        }

        .card {
            float: left;
            width: 100%;
            height: 816px;
        }
    </style>
</head>
<body>
    <div class="content-wrapper">
        <!-- Table area Start-->
        <div class="content">
            <div class="card">
                <div class="card-header header-elements-inline font-size-base">
                    <h5 class="card-title font-size-lg"><strong><spring:message code="word.wordlist"/></strong></h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" onclick="resetSearch();"></a>
                        </div>
                    </div>
                </div>
                
                <form id="search_form" onsubmit="return false;">
				<div class="form-group row font-size-xs" style="margin-left: 10px;">
						<select class="form-control font-size-xs" aria-hidden="true" style="width: 150px; margin-left: 10px;" name="searchType" id="searchType">
							<option value="all"><spring:message code="word.all"/></option>
						</select>
						<div class="col-lg-9">
							<div class="input-group" style="width: 400px;">
								<input type="text" class="form-control border-right-0 font-size-xs" placeholder="" name="keyword" id="keyword">
								<span class="input-group-append">
									<button class="btn border font-size-xs" type="button" onclick="searchWord();" id="searchButton"><i class="icon-search4"></i></button>
								</span>
							</div>
						</div>
						<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="button" onclick="excelDownload_doc();" style="margin-left: auto; margin-right: 5px;"><spring:message code="common.excelButton"/></button>
<%--					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="" onclick="excelDownload_exerd();" style="margin-right: 5px;"><spring:message code="common.exerdButton"/></button>  --%>
						<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" data-toggle="modal" data-target="#modal" id="newButton" onclick="openModal('add');" style="margin-right: 30px;"><spring:message code="word.modalRegistHeader"/></button>
						<!--  -->
				</div>
				</form>

                <table class="table-bordered-0 table-sm datatable-pagination table-striped table-hover" id="wordTable">
                    <thead>
                    <tr style="background-color: #4DB6AC; color: white">
                        <th><spring:message code="word.wordSeq"/></th>
                        <th><spring:message code="word.wordNm"/></th>
                        <th><spring:message code="word.wordAbbr"/></th>
                        <th><spring:message code="word.wordENm"/></th>
                        <th><spring:message code="word.wordDscrpt"/></th>
                        <th><spring:message code="word.wordSynm"/></th>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
        <!-- Table area End-->

        <!-- Alert 메세지 창 -->
        <div class="alert text-white alert-styled-left alert-dismissible" id="alert">
            <span class="font-weight-semibold" id="alertTitle">Well done!</span><br><span id="alertMessage">You successfully read alert message.</span>
        </div>

        <!-- Modal Start -->
        <div id="modal" class="modal fade" tabindex="-1" style="display: none; height: 1000px;" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title"><strong><spring:message code="word.wordmodalRegistHeader"/></strong></h3>
                        <button type="button" class="close" data-dismiss="modal" style="color: black"><spring:message code="word.xbutton"/></button>
                    </div>

                    <form action="#" class="form-horizontal" id="insert_form">
                        <input type="hidden" id="wordSeq" name="wordSeq">
                        <div class="modal-body">
                        	<!-- 0. 단어명&단어영문명 시도 -->
                            <div class="form-group row" id="stage0">
                                <div class="col-md-3">
                                    <label><spring:message code="word.wordNm"/> <text class="text-danger"><spring:message code="word.wordrequire"/></text></label>
                                    <input type="text" name="wordNm" id="wordNm" placeholder="" class="form-control full important">
                                </div>
                                <div class="col-md-9">
                                    <label style="display:flex"><spring:message code="word.wordENm"/><text class="text-danger">*</text></label>
                                    <input type="text" name="wordEngNm" id="wordEngNm" placeholder="" class="form-control full important">
                                    <button type="button" id="nmDuplCheck" class="insertOnly btn bg-pink" onclick="duplicationValidation('full');"><spring:message code="word.wordduplication"/></button>
                                    <span class="insertOnly helper" id="stage0Helper"><spring:message code="word.warningwordduplication"/></span>
                               	 </div>
                            </div>
                        	<!-- 0. 단어명&단어영문명 끝 -->
                        	
							<!-- I. 단어명&영문명 데이터테이블 -->
							<div class="form-group row stage insertWord insertOnly" id="stage1">
                                <div class="col-sm-12">
                                	<table class="modalTable table-xs datatable-pagination table-striped table-hover" id="modalTable1" style="width: 100%;">
					                    <thead>
						                    <tr>
						                       <!-- <th width="10%"><spring:message code="word.wordSeq"/></th> -->
                        						<th width="10%"><spring:message code="word.wordNm"/></th>
                       							<th width="16%"><spring:message code="word.wordAbbr"/></th>
                        						<th width="22%"><spring:message code="word.wordENm"/></th>
                       							<th width="36%"><spring:message code="word.wordDscrpt"/></th>
                       							<th width="16%"><spring:message code="word.wordSynm"/></th>
							                    <th style="display:none" width="0%">fatal</th>
						                    </tr>
					                    </thead>
					                </table>
                                </div>
					                <span class="helper" id="stage1Helper"></span>
                            </div>
							<!-- I. 단어명&영문명 데이터테이블 끝 -->
							
							<!-- II. 약어명 입력 -->
							<div class="form-group row stage" id="stage2">
                                <div class="col-md-12">
                                    <label style="display:flex"><spring:message code="word.wordAbbr"/><text class="text-danger">*</text> </label>
                                    <input type="text" name="wordAbbr" id="wordAbbr" placeholder="" class="form-control short important">
                                   	<button type="button" id="abbrDuplCheck" class="insertOnly btn bg-pink" onclick="duplicationValidation('short');"><spring:message code="word.wordduplication"/></button>
                               	 	<span id="stage2Helper" class="insertOnly helper"></span>
                               	 </div>
                            </div>
							<!-- II. 약어명 입력 끝 -->
							
                            <!-- III. 약어명 조회 데이터테이블 -->
							<div class="form-group row stage insertWord insertOnly" id="stage3">
                                <div class="col-sm-12">
                                	<table class="modalTable table-xs datatable-pagination table-striped table-hover" id="modalTable2" style="position: relative; width: 100%; overflow: auto;">
					                    <thead>
					                    <tr>
					                        <!-- <th width="7%">번호</th> -->
					                        <th width="30%"><spring:message code="word.wordNm"/></th>
					                        <th width="30%"><spring:message code="word.wordAbbr"/></th>
					                        <th width="40%"><spring:message code="word.wordENm"/></th>
					                        
					                        <th style="display:none" width="0%">fatal</th>
					                        <!-- <th width="36%">단어설명</th>
					                        <th width="16%">이음동의어</th> -->
					                    </tr>
					                    </thead>
					                </table>
                                </div>
				             	<span class="helper" id="stage3Helper"></span>                                
                            </div>
							<!-- III. 약어명 조회 데이터테이블 끝 -->
							
							<!-- IV(1). 단어 설명 입력 -->
                            <div class="form-group row stage" id="stage4-1">
                                <div class="col-sm-12">
                                    <label><spring:message code="word.wordDscrpt"/></label>
                                    <textarea rows="2" cols="4" name="wordDscrpt" id="wordDscrpt" class="form-control" style="resize: none;"></textarea>
                                </div>
                            </div>
                            <!-- IV(1). 단어 설명 입력 끝 -->
                            <!-- IV(2). 동의어 목록 입력 -->
							<div class="form-group row stage" id="stage4-2">
                                <div class="col-sm-12">
                                    <label><spring:message code="word.wordSynmlist"/></label>
                                    <input type="text" name="synmList" id="synmList" placeholder="" class="form-control">
                                </div>
                            </div>
							<!-- IV(2). 동의어 목록 끝 -->
                        </div>
                    </form>
                    <!-- 버튼 영역 -->
                    <div class="modal-footer">
                        <button type="button" id="saveButton" class="btn bg-teal" onclick="saveConfirm();"><spring:message code="word.wordsave"/></button>
                        <button type="button" id="updateButton" class="btn bg-teal" onclick="updateConfirm();"><spring:message code="word.wordupdate"/></button>
                        <button type="button" id="deleteButton" class="btn btn-danger" onclick="deleteConfirm();"><spring:message code="word.worddelete"/></button>
                        <button type="button" id="cancelButton" class="btn btn-outline" data-dismiss="modal"><spring:message code="word.wordcancel"/></button>
                    </div>
                    <!-- 버튼 영역 끝 -->
                </div>
            </div>
        </div>
        <!-- Modal End -->
        </div>
    </div>
</body>

</html>
