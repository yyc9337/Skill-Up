$(document).ready(function () {

	menuList();
	

});


function changeMenu(menuUrl, selectItem){
            /* Block current page on button click */
            $('#block-page').on('click', function() {
                $.blockUI({
                    message: '<i class="icon-spinner4 spinner"></i>',
                    timeout: 300,
                    overlayCSS: {
                        backgroundColor: '#1b2024',
                        opacity: 0.8,
                        cursor: 'wait'
                    },
                    css: {
                        border: 0,
                        color: '#fff',
                        padding: 0,
                        backgroundColor: 'transparent'
                    }
                });
            });


         	$("#mainMenu").text($(selectItem).parent().parent().parent().find('span').text());
        	$("#subMenu").text($(selectItem).text());
        	
			var second = document.getElementsByClassName('second');        	
  			for(var i=0; i < second.length; i++) {
  				$($('.second')[i]).removeClass('active');
  			}	
        	     	
        	$(selectItem).addClass('active');
            $("#contentMain").attr("src",menuUrl);
}


function menuList() {
	
	
	//나중에 쿠키 사용해서 메뉴 언어 변경 할 수 있게 해보기.
	//console.log(document.cookie);
	
	$.ajax({
	        url : contextPath +"/menu/list",
	        contentType : "application/json",
	        type : "GET",
			async : false,
	        success : function(data){			
				for(var i = 0; i < data.length; i++) {
					var li = "";
					
					if(i == 0) {
						li  = $('<li class="nav-item"><a href="#" id="defaultConnect" onclick="changeMenu(\''+data[i].menuUri+'\',this)" class="nav-link active second">'+
						'<i class="icon-price-tag2"></i>'+data[i].menuNm+'</a></li>');
					} else {
						li  = $('<li class="nav-item"><a href="#" id="defaultConnect" onclick="changeMenu(\''+data[i].menuUri+'\',this)" class="nav-link second">'+
						'<i class="icon-price-tag2"></i>'+data[i].menuNm+'</a></li>');
					}
					$("#block-page1").append($(li));
				}
	        }
	});
}