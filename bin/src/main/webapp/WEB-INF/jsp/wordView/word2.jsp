<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<html>
<head>
    <script>
        var contextPath = "${pageContext.request.contextPath}";
    </script>
    <script src="${pageContext.request.contextPath}/js/table/dataTable.js"></script>
    <script src="${pageContext.request.contextPath}/js/word/word2.js"></script>

    <!-- Main content -->

    <style>
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
    </style>
</head>
<body>
    <div class="content-wrapper">
        <!-- Page header -->
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <%--       컨텐츠 페이지 타이틀      --%>
                    <h4>
                        <span class="font-weight-semibold">GLZZA</span> - 단어 관리
                    </h4>
                    <a href="#" class="header-elements-toggle text-default d-md-none">
                        <i class="icon-more"></i></a>
                </div>
            </div>
        </div>

        <!-- Table area Start-->
        <div class="content">
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title"><strong>단어 목록</strong></h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" onclick="resetSearch();"></a>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="form-group row" style="margin-left: 10px;">
                        <select class="form-control" aria-hidden="true" style="width: 150px; margin-right: 10px;" name="searchType" id="searchType">
                            <option value="all">전체</option>
                            <option value="wordNm">단어명</option>
                            <option value="wordAbbr">영문약어명</option>
                            <option value="wordEngNm">영문명</option>
                            <option value="wordDscrpt">단어 설명</option>
                            <option value="synmList">이음동의어</option>
                        </select>
                        <div class="col-lg-1" style="margin-left: -10px;">
                            <div class="input-group" style="width: 400px;">
                                <input type="text" class="form-control border-right-0" placeholder="" name="keyword" id="keyword">
                                <span class="input-group-append">
                                    <button class="btn bg-teal" type="button" onclick="searchWord();" id="searchButton">검색</button>
                                </span>
                            </div>
                        </div>
                        <button class="btn bg-teal" type="button" data-toggle="modal" data-target="#modal" id="newButton" onclick="openModal('add');" style="margin-left: auto; margin-right: 15px;">신규 등록</button>
                    </div>
                </div>

                <table class="table datatable-pagination table-striped table-hover" id="wordTable" style="width: 100%;">
                    <thead>
                    <tr>
                        <th width="5%">번호</th>
                        <th width="10%">단어명</th>
                        <th width="10%">단어영문약어명</th>
                        <th width="23%">단어영문명</th>
                        <th width="36%">단어설명</th>
                        <th width="16%">이음동의어</th>
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
        <div id="modal" class="modal fade" tabindex="-1" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title"><strong>단어 신규 등록</strong></h3>
                        <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>

                    <form action="#" class="form-horizontal" id="insert_form">
                        <input type="hidden" id="wordSeq" name="wordSeq">
                        <div class="modal-body">
                            <div class="form-group row">
                                <div class="col-sm-6">
                                    <label>단어명</label>
                                    <input type="text" name="wordNm" id="wordNm" placeholder="" class="form-control">
                                </div>

                                <div class="col-sm-6">
                                    <label>이음동의어</label>
                                    <input type="text" name="synmList" id="synmList" placeholder="" class="form-control">
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-sm-6">
                                    <label>단어영문약어명</label>
                                    <input type="text" name="wordAbbr" id="wordAbbr" placeholder="" class="form-control">
                                </div>

                                <div class="col-sm-6">
                                    <label>단어영문명</label>
                                    <input type="text" name="wordEngNm" id="wordEngNm" placeholder="" class="form-control">
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-sm-12">
                                    <label>단어설명</label>
                                    <textarea rows="4" cols="4" name="wordDscrpt" id="wordDscrpt" class="form-control" style="resize: none;"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="modal-footer">
                        <button type="button" id="saveButton" class="btn bg-teal" onclick="saveConfirm();">저장</button>
                        <button type="button" id="deleteButton" class="btn btn-danger" onclick="deleteConfirm();">삭제</button>
                        <button type="button" id="cancelButton" class="btn bg-teal" data-dismiss="modal">닫기</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal End -->
        </div>
    </div>
</body>

</html>
