// table.js
$.extend($.fn.dataTable.defaults, {
  autoWidth: false,
  dom: '<"datatable-scroll"t><"datatable-footer"ilp>',
  searching: false,
  scrollX: false,
  sPaginationType: "input",
  scrollY: "580",
  scrollCollapse: true, 
  pageLength: 50,
  lengthMenu: [50, 100, 150, 200],
  language: {
    emptyTable: '데이터가 없습니다.',
    infoEmpty: '',
    info: ' _TOTAL_ '+totalDataCount,
    lengthMenu: '_MENU_',    
    paginate: {
      first: '처음',
      last: '마지막',
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