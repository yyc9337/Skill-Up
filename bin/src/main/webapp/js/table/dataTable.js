// table.js
/*DataTable 기능 기본 세팅*/
/*문법적으로 보면 Jquery 형태로 $.extend = merge의 의미,
  $.fn.dataTable.defaults라는 기본 설정에 아래 입력값으로 대체*/
$.extend($.fn.dataTable.defaults, {
  autoWidth: false,
  /*Tag 생성*/
  /* Dom Positioning
  ==> <div class="datatable-scroll">
  	{table}<f~></f~>
  	</div>
  	i = info
  	l = length
  	p = paging
  	t = table
  	*/
  dom: '<"datatable-scroll"t><"datatable-footer"ilp>',
  searching: false,
  //가로 스크롤
  scrollX: false,
  sPaginationType: "input",
  // Table 스크롤 설정 Y축 580px
  scrollY: "580",
  // 제한된 수의 행이 표시될 때 Table의 높이를 줄일 것인가?
  scrollCollapse: true,
  // 한번에 보여줄 data 수
  pageLength: 50,
  // 한번에 보여줄 data 수를 정할 리스트
  lengthMenu: [50, 100, 150, 200],
  // 각 상황에 따른 메세지 설정
  language: {
	// Table이 없을 때
    emptyTable: '데이터가 없습니다.',
    // Data가 없을 때
    infoEmpty: '',
    // 총 Data를 나타내는 메세지
    info: ' _TOTAL_ '+totalDataCount,
    lengthMenu: '_MENU_',
    //Paging 할 때 나타낼 각 정보들    
    paginate: {
      first: '처음',
      last: '마지막',
      //<-,-> 화살표 표시
      next: $('html').attr('dir') == 'rtl' ? '&larr;' : '&rarr;',
      previous: $('html').attr('dir') == 'rtl' ? '&rarr;' : '&larr;',
    }
  }
});
const Datatables = {
  // 기본 테이블 구조
  basic: function (id, tableOption, info) {
    let table = $(id).DataTable({
      // 반응형 테이블 설정
      responsive: true,     
      language: {
        info: info ? info : ' _TOTAL_ '+commonTotalDataCount,
      },
      columns: tableOption ? tableOption.columns : null,
      order: [[0, 'asc']] 	
    });

    return table;
  },
  // 정렬하는 컬럼을 설정하도록
  order: function (id, tableOption, num, info) {
    let table = $(id).DataTable({
      responsive: true,
      language: {
        info: info ? info : ' _TOTAL_ '+commonTotalDataCount,
      },
      columns: tableOption ? tableOption.columns : null,
      columnDefs: [
/*    
	  { orderable: false, className: 'reorder', targets: 0 }
      { orderable: true, className: 'reorder', targets: num },
      { orderable: false, targets: '_all' }
*/
      ],
      order: [[num, 'desc']],
    });

    return table;
  },
  // 데이터 추가
  rowsAdd: function (table, url, param, isSuccessResponse = false) {
    table.clear();

    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(param),
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
        if(isSuccessResponse){
          if(data.returnCode === "F")
            return false;
          table.rows.add(data.data).draw();
        }else{
		  console.log(data);
          table.rows.add(data).draw();
        }
        // 반응형 테이블 사용
        //table.responsive.recalc();
      },
    });
  },

  // 새로고침
  refresh: function (table, data) {
    table.clear();
    table.rows.add(data).draw();
  }
};