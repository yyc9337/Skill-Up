(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var widget = require('./iui.dashboard.widget');
var items = require('./iui.dashboard.items');
var modal = require('./iui.dashboard.modal');
var bar = require('./iui.chart.bar');
var column = require('./iui.chart.column');
var line = require('./iui.chart.line');
var timeseries = require('./iui.chart.timeseries');
var table = require('./iui.chart.table');
var messagetable = require('./iui.chart.messagetable');
var grid = require('./iui.chart.grid');
var messagegrid = require('./iui.chart.messagegrid');
var map = require('./iui.dashboard.map');
var parametermap = require('./iui.dashboard.parametermap');
var pie = require('./iui.chart.pie');
var highmaps = require('./iui.chart.highmaps');
var tabtable = require('./iui.chart.tabtable');
var treemap = require('./iui.chart.treemap');
var topology = require('./iui.topology');

function isElement(o) {
	return (typeof HTMLElement === "object" 
		? o instanceof HTMLElement
				: //DOM2
					o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string");
}

window.iui = window.iui || {};

//start crome with flag "--disable-web-security" then you use XSS XSR 
//window.iui.urlprifix = 'http://211.196.252.111:9080';

var onChangeDashboardItem = function (e, item) {
	if (item.checked) {
		if (iui.dashboard.findWidgetById(item.id)) {return;}
		var _item = $.extend({}, item);
		_item.el = iui.dashboard.addWidget(0, 0, 3, 4, true, {
			id: _item.id,
			type: _item.type,
			label: _item.label,
			rotate: _item.rotate,
			items: _item.items			
			? _item.items
					: _item,
					strict: 'MUST_CREATE'
		}); 
	} else {iui
		.dashboard
		.removeWidgetById(item.id);}
};

/*
 * 위겟 아이템
 * 마우스 오버
 */
var onItemRollOver = function (event, data) {
	$(parent.document).find('header > #widget_setting_panel').find(".widget-description > img").attr("src", "/images/dashboard/" + data.id + ".png");
	$(parent.document).find('header > #widget_setting_panel').find(".widget-description > h4").text(data.label);
	$(parent.document).find('header > #widget_setting_panel').find(".widget-description > p").text(data.description);
};

/*
 * 위겟 아이템
 * 마우스 아웃
 */
var onItemRollOut = function (eventdata) {};

/*
 * CONTENTS
 */
 
var itemContainer = $(parent.document).find('header > #widget_setting_panel').find(".widget-list");
var itemsData = "/kbn/dashboard/data/items1.json";
/* 
if(userType == "3002"){
	itemsData = "/dashboard/data/items2.json";
}else if(userType == "3003"){
	itemsData = "/dashboard/data/items4.json";
}else if(userType == "3004" || userType == "3005"){
	itemsData = "/dashboard/data/items3.json";
}
*/

$('<div></div>')
.dashboarditems({id: 'itemgroup1', label: '대시보드', description: '사용하실 위젯을 선택하세요.', data: itemsData, change: onChangeDashboardItem, rollover: onItemRollOver, rollout: onItemRollOut})
.appendTo(itemContainer);


/*
 * GRID STACK
 */
var options = {
		animate: true,
		handle: '.widget-header'
};

$('.grid-stack')
.attr('data-gs-height', window.innerHeight - $('header').outerHeight())
.gridstack(options);

var LAYOUT_ID = 0;

iui.dashboard = new function () {
	this.widgets = [];
	this.layoutId = LAYOUT_ID++;

	this.grid = $('.grid-stack').data('gridstack');

	this.findWidgetById = function (id) {
		return _.find(this.widgets, function (widget) {
			return id === widget.options.id;
		})
	}.bind(this);

	this.removeWidgetById = function (id) {
		this.removeWidget(this.findWidgetById(id));
	}.bind(this);

	/**
	 * 위겟들을 그리드에 로딩하여 배치
	 * 기존에 그리드에 올라가 있는 모든 위겟들을 삭제한다.
	 */
	this.loadGrid = function (url) {
		var self = this;
		var _widgets = [];
		$.ajax({url: url, dataType: 'json', type: 'get'}).done(function (data, textStatus, jqXHR) {
			_widgets = GridStackUI.Utils.sort(data);   
		}).fail(function (jqXHR, textStatus, errorThrown) {
			if (console && console.log) {console.log(textStatus);}
		}).always(function () {
			self.clearGrid();
			// self.widgets = _widgets;
			_.each(_widgets, function (widget) {
				$(parent.document).find('header > #widget_setting_panel').find(".iui-dashboard-items").dashboarditems('toggleItem', widget.id, true, false);
				widget.el = self.addWidget(widget.x, widget.y, widget.width, widget.height, widget.autoPosition, widget.options);
			}, self);
		});
	}.bind(this);

	this.getGridJSON = function (isRemoveElement) {
		isRemoveElement = isRemoveElement === false
		? false
				: true;
		return _.map($('.grid-stack > .grid-stack-item:visible'), function (widget) {

			widget = $(widget);
			var node = widget.data('_gridstack_node');
			var options = widget.data('_widget_options');
			var new_node = {
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
					autoPosition: node.autoPosition,
					options: {
						id: options.id,
						label : options.label,
						type: options.type,
						rotate : options.rotate,
						items: options.items/*_.map(options.items, function (item) {
							var _item = {
									id: item.id,
									label: item.label,
									type: item.type,
									interval: item.interval,
									template: item.template,
									data: item.data,
									color: item.color,
									width: item.width,
									height: item.height
							};
							if (!isRemoveElement && item.el) {
								_item.el = item.el;
							}
							if (item.min !== null || item.min !== undefined) {
								_item.min = item.min;
							}
							if (item.max !== null || item.max !== undefined) {
								_item.max = item.max;
							}
							return _item;
						})*/
					}
			};
			if (!isRemoveElement) {
				new_node.el = widget;
			}
			return new_node;
		}, this);
	}.bind(this);
	/**
	 * 현재 화면에 보이는 레이아웃 저장
	 */
	this.saveGrid = function (type) {
		var options = this.getGridJSON();
		
		if (console && console.log) {
			console.log(JSON.stringify(options, null, ' '));
		}
		
		$("#layoutForm [name='template']").val(JSON.stringify(options, null, ' '));

		return $.ajax({
			url: '/logAnalysis/logAnalysis/mapviewDashboardSave.do',
			dataType: 'json',
			type: 'POST',			
			data: $("#layoutForm").serialize(),
			contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		})
		.done(function (data) {
			if(type == 'dashboard'){
				var putFlag = true;
				$(parent.document).find('header > #dashboard_widget_div').find("#layout_list > li > a").each(function(){
					if($(this).text() == $("#input_new_layout_name").val()){
						putFlag = false;
						return;
					}
				});
				if (putFlag) {
					addLayoutToList({
						'id': 'user_defined_layout',
						'label': $("#input_new_layout_name").val()
					});
					console.log('save layout succeed.');
				}
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			if (console && console.log) {
				console.log(textStatus);
			}
		});
	}.bind(this);

	/*
	 * 레이아웃 삭제 모든 아이템을 지운다.
	 */
	this.clearGrid = function () {
		var self = this;
		
		$(parent.document).find('header > #widget_setting_panel').find(".iui-dashboard-items").dashboarditems('toggleAll', false, false);
		_.each(self.widgets, function (widget) {
			self.removeWidget(widget);
		});
		self.widgets = [];
	}.bind(this);

	// TODO 아이템 목록에서 체크 해제시 삭제
	// 고려할 사항이 많네 ...
	this.removeWidget = function (widget) {
		if (!widget) {return;}
		var element;
		if (isElement(widget)) {
			element = $(widget);
			widget = element.data('_widget_options');
		} else {
			element = $('#' + widget.options.id);
		}
		$(parent.document).find('header > #widget_setting_panel').find(".iui-dashboard-items").dashboarditems('toggleItem', widget.id, false, false);
		this.grid.remove_widget(element);
		this.widgets = this.getGridJSON(false);
		element = null;
	}.bind(this);

	/**
	 * 새로운 아이템을 레이아웃에 등록한다.
	 */
	this.addWidget = function (x, y, width, height, autoPosition, options) {
		var self = this;
		var items = null;
		items = $.isArray(options.items)
		? options.items
				: [options.items];
		options.items = items;
		options.id = options.id || 'widget_' + self.widgets.length;

		options.create = function (e, ui) {
			var _self = this;
			setTimeout(function (e) {
				if(options.type != null && options.type == "group" && options.rotate == "horizon"){
					_.each(items, function (item) {
						item.itemtype = options.type;
						item.rotate = options.rotate;
						item.el = items[0].el;
						self.setContents(item, _self, options.strict === 'MUST_CREATE'
							? false
									: true);
					}, _self);
					items = null;
					_self = null;
				}else{
					_.each(items, function (item) {
						item.itemtype = options.type;
						item.rotate = options.rotate;
						self.setContents(item, _self, options.strict === 'MUST_CREATE'
							? false
									: true);
					}, _self);
					items = null;
					_self = null;	  
				}
			}, 100);
		};

		options.willmount = function (e) {
			if (console && console.log) {console.log('Widget will be mounted.');}
		};

		var widget = $('<div id="' + options.id + '"></div>').addClass('grid-stack-item').dashboardwidget(options).bind('dashboardwidgetwillupdate', function (e) {
			if (console && console.log) {console.log('widget will update');}
		})
		// 위겟 닫기
		.bind('dashboardwidgetclose', function (e) {
			var $this = $(this);
			// 최대화 시에는 작동하지 않는다.
			if ($this.hasClass('widget-maximized')) {return;}
			self.removeWidget(this);
			// 모든 이벤트 핸들러 제거
			// close, togglesize, togglelock
			// $this.unbind();

			// 모든 차트 폐기
			// _.each(items, function (item) {
			//  self.removeContents(item);
			// });
			//
			// $this.dashboardwidget('destroy');
			// self.grid.remove_widget(this, true);
			$this = null;
		})
		// Toggle widget follsize
		.bind('dashboardwidgettogglesize', function (e) {
			var $this = $(this);
			var btn = $($('.iui-btn-toggle-minmax', this).get(0));
			var sizeStatus = "";
			if (btn.hasClass('minimize')) {
				// Minimize
				sizeStatus = "min";
				//$('#widgetwrapper').css('overflow-y', 'auto');
				$this.removeClass('widget-maximized');
				btn.removeClass('minimize');
				$this.css({left: '', top: '', width: '', height: ''});
				self.grid.add_widget($this, 0, 0, $this.attr('data-gs-width'), $this.attr('data-gs-height'), true);
				self.grid.movable($this, true);
				self.grid.resizable($this, true);
				_.each(self.grid.grid.nodes, function (node) {
					$($('.iui-btn-toggle-lock', node.el).get(0)).removeClass('unlock');
					self.grid.locked(node.el, false);
				}, self);
				fullscreenFlag = false;
				$("#widget_setting > button").attr("disabled",false);
				
				$(".grid-stack").height($(".grid-stack").height() + 15);

			} else {
				// Maximize
				sizeStatus = "max";
				//$('#widgetwrapper').css('overflow-y', 'hidden');
				$this.addClass('widget-maximized');
				btn.addClass('minimize');
				_.each(self.grid.grid.nodes, function (node) {
					$($('.iui-btn-toggle-lock', node.el).get(0)).addClass('unlock');
					self.grid.locked(node.el, true);
				}, self);
				self
				.grid
				.movable($this, false);
				self
				.grid
				.resizable($this, false);
				// Bring the widget to front
				// detach the widget from gridstack
				self
				.grid
				.remove_widget($this, false);
				// and add the widget at last
				$('.grid-stack').append($this);
				// and then set the widget as full size as possible.
				$this.css({
					left: '0px',
					top: $('.dashboard').scrollTop() > 0 ? $('.dashboard').scrollTop() - 10 : 2,
					width: '100%',
					height: window.innerHeight - $('header').outerHeight() - 15 - $('.panel-header').outerHeight() - $('.panel-footer').outerHeight()
				});
				fullscreenFlag = true;
				$("#widget_setting > button").attr("disabled","disabled");
			}

			var resize = function () {
				$('.iui-dashboard-chart', e.target).each(function (i, chart) { 
					chart = $(chart);
					var name = 'chart' + chart.data('chart');
					sizeStatus = fullscreenFlag ? "max" : "min";
					if (chart[name]) {
						(chart[name])('resize', sizeStatus);
					}
					name = null;
				});
			};


			setTimeout(function () {
				resize();
			}, 600);

			$this = btn = sizeStatus = null;;
		})
		// toggle widgets lockable.
		.bind('dashboardwidgettogglelock', function (e) {
			var me = $(this);
			if (me.hasClass('widget-maximized')) {return;}
			var btn = $($('.iui-btn-toggle-lock', this).get(0));
			if (btn.hasClass('unlock')) {
				btn.removeClass('unlock');
				self.grid.locked(me, false);
			} else {
				btn.addClass('unlock');
				self
				.grid
				.locked(me, true);
			}
			me = null;
		});

		widget.data('_widget_options', options);
		self.grid.add_widget(widget, x, y, width, height, autoPosition);
		// 위겟 선택 체크박스 체크
		$(parent.document).find('header > #widget_setting_panel').find(".iui-dashboard-items").dashboarditems('toggleItem', options.id, true, false);
		self.widgets = self.getGridJSON(false);
		setTimeout(function (e) {
			//위겟 탭 선택
			self.setWidgetLevel();
			initWidgetPaddings(widget);
		}, 100);
		try{
			return widget;
		}finally{
			widget = null;
		}
	}.bind(this);

	this.chartId = 0;

	this.setTopology = function (item, widget) {
		if (item && item.el) {item.el.empty();}
		$(item.el).addClass('topology-panel');
		// .attr("class", $(item.el)
		//  .attr("class") + " topology-panel");
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group"){
			widthStyle = "style='width:"+item.width+"'";
		}
		$('<div id="chart_' + this.chartId++ + '"></div>').addClass('widget-list list-style3 flowtype iui-dashboard-chart topology').attr('data-chart', 'topology').appendTo(item.el).charttopology({data: item.data, interval: item.interval});
	};

	this.setTableChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			
			if(item.search){
				makeSearchElement(item, groupObj, "table");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart table").attr('data-chart', 'table').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).charttable({
					data: item.data,
					interval: item.interval,
					template: item.template
				}));	
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart table"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'table').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).charttable({
				data: item.data,
				interval: item.interval,
				template: item.template,
				create: function (e, ui) {
				}
			});
		}
	};

	this.setMessageTableChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			//groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			
			if(item.search){
				makeSearchElement(item, groupObj, "messagetable");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart messagetable").attr('data-chart', 'messagetable').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).chartmessagetable({
					data: item.data,
					interval: item.interval,
					template: item.template
				}));	
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart messagetable"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'messagetable').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).chartmessagetable({
				data: item.data,
				interval: item.interval,
				template: item.template,
				create: function (e, ui) {
				}
			});
		}
	};

	this.setBarChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			//groupObj.append("<div class='item-header border-bottom'><h3 class='border'>"+item.label+"</h3></div>");
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "bar");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart bar"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'bar').appendTo(item.el).chartbar({data: item.data, max: item.max, min: item.min, interval: item.interval, color: item.color, graphType: item.graphType}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart bar"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'bar').appendTo(item.el).chartbar({data: item.data, max: item.max, min: item.min, interval: item.interval, color: item.color, id : item.id, graphType: item.graphType});
		}
	};

	this.setColumnChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "column");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart column"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'column').appendTo(item.el).chartcolumn({item: item}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart column"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'column').appendTo(item.el).chartcolumn({item: item});
		}	
	};

	this.setLineChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			
			if(item.search){
				makeSearchElement(item, groupObj, "line");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart line"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'line').appendTo(item.el).chartline({'data': item.data, interval: item.interval, color: item.color, id : item.id}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart line"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'line').appendTo(item.el).chartline({'data': item.data, interval: item.interval, color: item.color , id : item.id});
		}
	};

	this.setTimeseriesChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "timeseries");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart timeseries"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'timeseries').appendTo(item.el).charttimeseries({item: item}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart timeseries"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'timeseries').appendTo(item.el).charttimeseries({item: item});
		}
	};

	this.setPieChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "pie");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart pie"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'pie').appendTo(item.el).chartpie({data: item.data, interval: item.interval, color: item.color}));
			}
			
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart pie"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'pie').appendTo(item.el).chartpie({data: item.data, interval: item.interval, color: item.color});
		}
	};

	this.setGridChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "grid");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart grid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart grid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item});
		}		
	};

	
	this.setMessagegridChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			//groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "messagegrid");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart messagegrid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'messagegrid').appendTo(item.el).chartmessagegrid({item: item}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart messagegrid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'messagegrid').appendTo(item.el).chartmessagegrid({item: item});
		}		
	};

	this.setMap = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart map"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'map').appendTo(item.el).chartmap({title: item.label, data: item.data, template: item.template}));
			if(item.search){
				makeSearchElement(item, groupObj, "map");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart grid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart map"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'map').appendTo(item.el).chartmap({title: item.label, data: item.data, interval: item.interval, template: item.template});
		}		
	};

	
	this.setParametermap = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "parametermap");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart parametermap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'parametermap').appendTo(item.el).chartparametermap({title: item.label, data: item.data, template: item.template}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart parametermap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'parametermap').appendTo(item.el).chartparametermap({title: item.label, data: item.data, interval: item.interval, template: item.template});
		}		
	};

	this.setHighmaps = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "highmaps");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart highmaps"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'highmaps').appendTo(item.el).charthighmaps({title: item.label, data: item.data, template: item.template}));
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart highmaps"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'highmaps').appendTo(item.el).charthighmaps({title: item.label, data: item.data, interval: item.interval, template: item.template});
		}		
	};

	this.setTabTableChart = function (item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			//groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			
			if(item.search){
				makeSearchElement(item, groupObj, "tabtable");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart tabtable").attr('data-chart', 'tabtable').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).charttabtable({
					data: item.data,
					interval: item.interval,
					template: item.template
				}));	
			}	
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart tabtable"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'tabtable').appendTo(item.el).flowtype({minFont: 11, maxFont: 40, fontRatio: 40}).charttabtable({
				data: item.data,
				interval: item.interval,
				template: item.template,
				create: function (e, ui) {
				}
			});
		}
	};
	
	this.setTreeMapChart = function(item, widget) {
		if (item && item.el && item.itemtype && item.itemtype !== "group") {item.el.empty();}
		var widthStyle = "";
		if(item.itemtype && item.itemtype === "group" && item.rotate == "horizon"){
			widthStyle = "style='width:"+item.width+"'";
		}else if(item.itemtype && item.itemtype === "group" && item.rotate == "vertical"){
			var agent = navigator.userAgent.toLowerCase();
 
			if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				widthStyle = "style='height:100%'";
			}
		}
		var groupObj = $("<li class='border-bottom' "+widthStyle+">");

		if(item.itemtype && item.itemtype === "group"){
			groupObj.append("<div class='item-header border-bottom'></div>");
			groupObj.append("<div class='item-body'></div>");
			groupObj.appendTo(item.el);
			if(item.search){
				makeSearchElement(item, groupObj, "treemap");
			}else{
				groupObj.find(".item-body").append($('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart treemap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'treemap').appendTo(item.el).charttreemap({data: item.data, interval: item.interval, color: item.color}));
			}
			
		}else{		
			$('<div id="chart_' + this.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart treemap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'treemap').appendTo(item.el).charttreemap({data: item.data, interval: item.interval, color: item.color});
		}
	}


	this.chartCreatorMap = {
			'topology': this.setTopology,
			'bar': this.setBarChart,
			'line': this.setLineChart,
			'timeseries': this.setTimeseriesChart,
			'column': this.setColumnChart, 
			'table': this.setTableChart,
			'messagetable': this.setMessageTableChart,
			'grid': this.setGridChart,
			'messagegrid': this.setMessagegridChart,
			'map': this.setMap,
			'parametermap': this.setParametermap,
			'pie': this.setPieChart,
			'highmaps' : this.setHighmaps,
			'tabtable' : this.setTabTableChart,
			'treemap' : this.setTreeMapChart
	};

	this.setContents = function (item, widget, strictMode) {
		if (strictMode && item.checked === true) {return;}
		// var chartPicker = $('div.iui-dashboard-items');
		// chartPicker.dashboarditems('toggleItem', item.id, true, false);
		this.chartCreatorMap[item.type || 'table'].call(this, item, widget);
	};

	this.removeContents = function (items) {
		// var chartPicker = $('div.iui-dashboard-items');
		items = $.isArray(items)
		? items
				: [items];
		_.each(items, function (item) {
			// if (item.checked !== true)
			//  return;
			// chartPicker.dashboarditems('toggleItem', item.id, false, false);
			$('.iui-dashboard-chart', item.el).each(function (i, chart) {
				chart = $(chart);
				var name = 'chart' + item.type;
				if (chart[name]) {
					(chart[name])('destroy');
				}
			});
		});
	}

	this.setWidgetParams = function (params) {
		dashboardWidgetIdx = 0;
		_.each(this.widgets, function (widget, index) {
			_.each(widget.options.items, function (item) {
				if(item.el){
					$('.iui-dashboard-chart', item.el).each(function (i, chart) {
						chart = $(chart);
						//var name = 'chart' + item.type;
						var name = 'chart' + chart.attr("data-chart")
						if (chart[name]) {
							(chart[name])('option', 'params', params);
						}
						name = null;
					});
				}
			});
		});
	};

	this.setWidgetLevel = function (level) {
		var self = this;
		level = level === undefined
		? self.tabIndex
				? self.tabIndex
						: 0
						: level;
		if (level === 0) {
			// 통합 관제
			self.tabIndex = 0;
		} else {
			// 통합 현황
			self.tabIndex = 1;
		}
		_.each(self.widgets, function (widget) {
			if (widget.options.items.length > 1) {$(widget.el).dashboardwidget('option', 'activetab', self.tabIndex);}
		});

		self = null;
	};

	this.refresh = function (type) {
		dashboardWidgetIdx = 0;
		_.each(this.widgets, function (widget) {
			_.each(widget.options.items, function (item) {
				$('.iui-dashboard-chart', item.el).each(function (i, chart) {
					chart = $(chart);
					var name = 'chart' + item.type;
					if (name == type) {
						if (chart[name]) {
							(chart[name])('refresh');
						}
					}
					name = null;
				});
			});
		});
	};

	var self = this;

	var resize = function (ui) {
		$('.iui-dashboard-chart', ui).each(function (i, chart) {
			chart = $(chart);
			var name = 'chart' + chart.data('chart');
			if (chart[name]) {
				(chart[name])('resize');
			}
			chart = null;
			name = null;
		});
	};

	$('.grid-stack').on('resizestop', function (e, ui) {
		setTimeout(function () {
			resize(e.target);
		}, 600);
	});

	var resizeTimeId = 0;
	$(window).on('resize', function (e) {
		if (e.target !== window) {return;}
		clearTimeout(resizeTimeId);
		resizeTimeId = window.setTimeout(function () {
			resize($('.grid-stack'));
		}, 600);
	});
};

function makeSearchElement(item, groupObj, elementType){
	if(item.search){
		var searchForm = $("<form id='"+item.id+"_form'>");
		var searchDiv = $("<div class='widget-header-right'>");	
		searchForm.append(searchDiv);
		
		groupObj.find(".item-header").append(searchForm);	
		
		if(item.searchData){
			$.ajax({
				url : item.searchData,
				type : "post",
				dataType : "json",
				data : item.searchParam,
				success : function(ajaxData){
						
					$.each(item.search, function(){
						var searchItem;
						if(this.type == "select"){
							
							searchDiv.append("<label class='iw-label'>"+this.label+"</label>&nbsp;");
							var eventTemp = this.onchange ? "onchange="+this.onchange : "";

							searchItem = $("<select class='iw-select' name='"+this.name+"' style='width:"+this.width+"' "+eventTemp+">");
							
							searchItem.append("<option value='all'>전체</option>");
							$.each(ajaxData[this.name], function(){
								searchItem.append("<option value='"+this.codeValue+"'>"+this.codeName+"</option>");
							});

							searchDiv.append(searchItem);

						}else if(this.type =="datepicker"){
							var datepickerTemp = '<label class="iw-label">'+this.label+'</label>&nbsp;<input type="text" name="startDate" class="iw-input" style="width: 80px;" readonly> '
									+'<a href="#" class="dt1" style="color:black; outline:none;"><i class="icon icon-calendar"></i></a> ~ '
									+'<input type="text" name="endDate" class="iw-input" style="width: 80px;" readonly> '
									+'<a href="#" class="dt2" style="color:black; outline:none;"><i class="icon icon-calendar"></i></a> &nbsp;';

							searchDiv.prepend(datepickerTemp);
							
							var temp = new Date();
							var temp2 = temp.setDate(temp.getDate()-140);
							temp2 = new Date(temp2);
							
							searchForm.find("[name=startDate]").val($.datepicker.formatDate($.datepicker.ATOM, temp2));
							searchForm.find("[name=endDate]").val($.datepicker.formatDate($.datepicker.ATOM, new Date()));
							
							var monthNames = ['1월','2월','3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
							
							searchForm.find("[name=startDate]").datepicker({
								dateFormat : "yy-mm-dd",
								maxDate: 0,
								prevText: '이전 달',
								nextText: '다음 달',
								monthNames: monthNames,
								showMonthAfterYear: true,
								onClose : function(selectedDate){
									if(searchForm.find("[name=startDate]").datepicker('getDate').getTime() > searchForm.find("[name=endDate]").datepicker('getDate').getTime()){
										searchForm.find("[name=endDate]").val(selectedDate);
									}

									searchList(item.id);
								}
							});
							
							searchForm.find("[name=endDate]").datepicker({
								dateFormat : "yy-mm-dd",
								maxDate: 0,
								prevText: '이전 달',
								nextText: '다음 달',
								monthNames: monthNames,
								showMonthAfterYear: true,
								onClose : function(selectedDate){
									if(searchForm.find("[name=startDate]").datepicker('getDate').getTime() > searchForm.find("[name=endDate]").datepicker('getDate').getTime()){
										searchForm.find("[name=startDate]").val(selectedDate);
									}
									
									searchList(item.id);
								}
							});
							
							$(function() {
								searchForm.find(".dt1").click(function(){
									searchForm.find("[name=startDate]").datepicker("show");
								});
								searchForm.find(".dt2").click(function(){
									searchForm.find("[name=endDate]").datepicker("show");
								});
							});
						}
					});

					groupObj.find(".item-header").append(searchForm);	

					if(elementType == "line"){						
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart line"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'line').appendTo(item.el).chartline({'data': item.data, interval: item.interval, color: item.color, label : item.label, id: item.id}));
					}else if(elementType == "bar"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart bar"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'bar').appendTo(item.el).chartbar({data: item.data, max: item.max, min: item.min, interval: item.interval, color: item.color, id : item.id, graphType: item.graphType}));
					}else if(elementType == "column"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart column"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'column').appendTo(item.el).chartcolumn({item: item, id : item.id}));
					}else if(elementType == "timeseries"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart timeseries"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'timeseries').appendTo(item.el).charttimeseries({item: item, id : item.id}));
					}else if(elementType == "grid"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart grid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item, id : item.id}));
					}else if(elementType == "map"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart map"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item, id : item.id}));
					}else if(elementType == "parametermap"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart parametermap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'parametermap').appendTo(item.el).chartparametermap({title: item.label, data: item.data, template: item.template, id : item.id}));
					}else if(elementType == "pie"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart pie"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'pie').appendTo(item.el).chartpie({data: item.data, interval: item.interval, color: item.color, id : item.id}));
					}else if(elementType == "highmaps"){
						groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart highmaps"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'highmaps').appendTo(item.el).charthighmaps({title: item.label, data: item.data, template: item.template}));
					}
					
				},
				error : function(error, request, status){
					console.log(error);
				}
			});
		}else{
			$.each(item.search, function(){
				var searchItem;

				if(this.type =="datepicker"){
					var datepickerTemp = '<label class="iw-label">'+this.label+'</label>&nbsp;<input type="text" name="startDate" class="iw-input" style="width: 80px;" readonly> '
							+'<a href="#" class="dt1" style="color:black; outline:none;"><i class="icon icon-calendar"></i></a> ~ '
							+'<input type="text" name="endDate" class="iw-input" style="width: 80px;" readonly> '
							+'<a href="#" class="dt2" style="color:black; outline:none;"><i class="icon icon-calendar"></i></a> &nbsp;';

					searchDiv.prepend(datepickerTemp);
					
					var temp = new Date();
					var temp2 = temp.setDate(temp.getDate()-140);
					temp2 = new Date(temp2);
					
					searchForm.find("[name=startDate]").val($.datepicker.formatDate($.datepicker.ATOM, temp2));
					searchForm.find("[name=endDate]").val($.datepicker.formatDate($.datepicker.ATOM, new Date()));
					
					var monthNames = ['1월','2월','3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
					
					searchForm.find("[name=startDate]").datepicker({
						dateFormat : "yy-mm-dd",
						maxDate: 0,
						prevText: '이전 달',
						nextText: '다음 달',
						monthNames: monthNames,
						showMonthAfterYear: true,
						onClose : function(selectedDate){
							if(searchForm.find("[name=startDate]").datepicker('getDate').getTime() > searchForm.find("[name=endDate]").datepicker('getDate').getTime()){
								searchForm.find("[name=endDate]").val(selectedDate);
							}

							searchList(item.id);
						}
					});
					
					searchForm.find("[name=endDate]").datepicker({
						dateFormat : "yy-mm-dd",
						maxDate: 0,
						prevText: '이전 달',
						nextText: '다음 달',
						monthNames: monthNames,
						showMonthAfterYear: true,
						onClose : function(selectedDate){
							if(searchForm.find("[name=startDate]").datepicker('getDate').getTime() > searchForm.find("[name=endDate]").datepicker('getDate').getTime()){
								searchForm.find("[name=startDate]").val(selectedDate);
							}
							
							searchList(item.id);
						}
					});
					
					$(function() {
						searchForm.find(".dt1").click(function(){
							searchForm.find("[name=startDate]").datepicker("show");
						});
						searchForm.find(".dt2").click(function(){
							searchForm.find("[name=endDate]").datepicker("show");
						});
					});
				}
			});
			
			groupObj.find(".item-header").append(searchForm);	

			if(elementType == "line"){						
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart line"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'line').appendTo(item.el).chartline({'data': item.data, interval: item.interval, color: item.color, label : item.label, id: item.id}));
			}else if(elementType == "bar"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart bar"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'bar').appendTo(item.el).chartbar({data: item.data, max: item.max, min: item.min, interval: item.interval, color: item.color, id : item.id, graphType: item.graphType}));
			}else if(elementType == "column"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart column"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'column').appendTo(item.el).chartcolumn({item: item, id : item.id}));
			}else if(elementType == "timeseries"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart timeseries"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'timeseries').appendTo(item.el).charttimeseries({item: item, id : item.id}));
			}else if(elementType == "grid"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart grid"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item, id : item.id}));
			}else if(elementType == "map"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart map"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'grid').appendTo(item.el).chartgrid({item: item, id : item.id}));
			}else if(elementType == "parametermap"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart parametermap"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'parametermap').appendTo(item.el).chartparametermap({title: item.label, data: item.data, template: item.template, id : item.id}));
			}else if(elementType == "pie"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart pie"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'pie').appendTo(item.el).chartpie({data: item.data, interval: item.interval, color: item.color, id : item.id}));
			}else if(elementType == "highmaps"){
				groupObj.find(".item-body").append($('<div id="chart_' + window.iui.dashboard.chartId++ + '"></div>').addClass("widget-list list-style3 flowtype iui-dashboard-chart highmaps"+(item.itemtype == "group" ? " group-cell" : "")).attr('data-chart', 'highmaps').appendTo(item.el).charthighmaps({title: item.label, data: item.data, template: item.template}));
			}
		}

	}
}

//위겟 패딩 설정
function initWidgetPaddings(parent) {
	/*
	$('.position-top', parent).each(function (i, e) {
		var $this = $(e);
		var padding = $this.parent().attr('data-padding-top');
		if (padding === undefined) {
			padding = parseInt($this.parent().css("padding-top").replace("px", ""), 10);
			$this.parent().attr('data-padding-top', padding);
		}
		$this.parent().css("padding-top", padding + $this.outerHeight(true) + "px");
		$this.css("top", padding + "px");
	});

	$($('.position-right', parent).get().reverse()).each(function (i, e) {
		var $this = $(this);
		var padding = $this.parent().attr('data-padding-right');
		if (padding === undefined) {
			padding = parseInt($this.parent().css("padding-right").replace("px", ""), 10);
			$this.parent().attr('data-padding-right', padding);
		}
		$this.parent().css("padding-right", padding + $this.outerWidth(true) + "px");
		$this.css("right", padding + "px");
	});

	$($('.position-bottom', parent).get().reverse()).each(function (i, e) {
		var $this = $(this);
		var padding = $this.parent().attr('data-padding-bottom');
		if (padding === undefined) {
			padding = parseInt($this.parent().css("padding-bottom").replace("px", ""), 10);
			$this.parent().attr('data-padding-bottom', padding);
		}
		$this.parent().css("padding-bottom", padding + $this.outerHeight(true) + "px");
		$this.css("bottom", padding + "px");
	});
	
	$('.position-left', parent).each(function (i, e) {
		var $this = $(this);
		var padding = $this.parent().attr('data-padding-left');
		if (padding === undefined) {
			padding = parseInt($this.parent().css("padding-left").replace("px", ""), 10);
			$this.parent().attr('data-padding-left', padding);
		}
		$this.parent().css("padding-left", padding + $this.outerWidth(true) + "px");
		$this.css("left", padding + "px");
	});*/
}

$('.btn-expand').click(function (e) {
	$("#layout_setting").toggleClass("active");
	$("#layout_list").slideToggle(400);
	if ($("#widget_setting").hasClass("active")) {$("#widget_setting").toggleClass("active");
	$("#widget_setting_panel").slideToggle(200);}
});

/*
//initWidgetPaddings();

//레이아웃 선택 패널 열고 닫기
$('.btn_layout_setting').click(function (e) {
	$("#layout_setting").toggleClass("active");
	$("#layout_list").slideToggle(400);
	if ($("#widget_setting").hasClass("active")) {$("#widget_setting").toggleClass("active");
	$("#widget_setting_panel").slideToggle(200);}
});

var fullscreenFlag = false;
//위겟 설정 패널 열고 닫기
$('#btn_widget_setting, #btn_layout_confirm').click(function (e) {
	if(!fullscreenFlag){
		$("#widget_setting").toggleClass("active");
		$("#widget_setting_panel").slideToggle(400);
		if ($("#layout_setting").hasClass("active")) {
			$("#layout_setting").toggleClass("active");
			$("#layout_list").slideToggle(200);
		}
	}
});
*/
/**
 * 실시간 이벤트 목록
 * 테이블 형식 보기와 타임라인 보기 모드 토글
 */
function tableToggle() {
	$('.error-list').toggleClass('timeline')
}

function resizeFontSize() {
	/*
	var panel = $(this).parent().parent().parent().children('.panel-body');
	var current_size = parseInt(panel.css("font-size").replace("px", ""), 10);
	if ($(this).hasClass('up')) {
		if (current_size < 20) {
			current_size = (current_size + 1) + "px";
		}
	} else if ($(this).hasClass('down')) {
		if (current_size > 11) {
			current_size = (current_size - 1) + "px";
		}
	}
	panel.css({'font-size': current_size});
	*/
}

//레이아웃 불러오기
//설정되어 있는 아이템 로딩
/*
iui
 .dashboard
 .loadGrid('./data/unified_management.json');*/
//레이아웃 변경 테스트
//setTimeout(function (e) {
//iui.dashboard.loadGrid('./data/layout1.json');
//}, 5000);

function addLayoutToList(item) {
	var li = $('<a>')
	.attr('href', '#')
	.attr('onclick', "getLayout('" + item.label + "');")
	.text(item.label)
	.wrap('<li>')
	.parent();

	$('<i>')
	.addClass('fa fa-check')
	.attr('aria-hidden','true')
	.wrap('<button>')
	.parent()
	.addClass('confirm')
	.appendTo(li);
	// 삭제 버튼 추가.
	$('<i>')
	.addClass('fa fa-times')
	.attr('aria-hidden','true')
	.wrap('<button>')
	.parent()
	.addClass('remove')
	.appendTo(li);

	// 리스트의 마지막에 있는 레이아웃 저장 버튼 위로 추가
	$(parent.document).find('header > #dashboard_widget_div').find("#layout_list > li > a.current-save")
	.parent()
	.before(li);
}


function maticsConfirm(msg, funcName){
	$(".iw-alert .body").find("p").text(msg);
	$(alertModal.root).find(".iw-blue").show();
	$(alertModal.root).find(".iw-blue").attr("onclick",funcName);
	alertModal.show();
}

//저장된 레이아웃 목록 선택하여 레이아웃 로딩하기
$(parent.document).find('header > #dashboard_widget_div').find("#layout_list")
.click(function (e) {
	e.preventDefault();
	var item = $(e.target ? e.target : e.srcElement);
	if (e.target.tagName.toUpperCase() === 'I' || e.target.tagName.toUpperCase() === 'BUTTON') {
		// Delete layout
		// 상위의 버튼으로 변경
		if(e.target.tagName.toUpperCase() === 'I'){
			item = item.parent();
		}
		if (!item.hasClass('remove') && !item.hasClass('confirm')) {
			// it's not a delete layout button
			return;
		}
		var removeItemName = item.parent().text();//item.prev().text();
		$("#layoutForm [name='dashboardName']").val(removeItemName);
		if (item.hasClass('remove')){
			maticsConfirm(removeItemName+" layout을 삭제하시겠습니까?","deleteLayout('"+removeItemName+"');alertModal.hide();");
			
			/*
			if(maticsConfirm(removeItemName+" layout을 삭제하시겠습니까?")){
				$.ajax({
					url: '/dashboard/dashboardMgmt/removeDashboard.do',
					dataType: 'json',
					type: 'POST',
					data: $("#layoutForm").length > 0 ? $("#layoutForm").serialize() : "dashboardName="+removeItemName
				}).done(function (data, textStatus, jqXHR) {
					// Delete the user defined layout from list.
					//item.parent().remove();
					item.parent().remove();
				}).fail(function (jqXHR, textStatus, errorThrown) {
					// TODO Show user the error message. if needed, not this time !!!
				})
				// // XXX It's only for TEST. Need to Remove this listener after test.
				.always(function () {
					item.parent().remove();
				});
			}
			*/
		}else if(item.hasClass('confirm')){
			maticsConfirm(removeItemName+" layout을 변경하시겠습니까?","updateLayout('"+removeItemName+"');alertModal.hide();");
			
			/*
			if(confirm(removeItemName+" layout을 변경하시겠습니까?")){
				$("#input_new_layout_name").val(removeItemName);
				iui.dashboard.saveGrid({name : removeItemName, status : "update"});
			}
			*/
		}
	} else if (e.target.tagName.toUpperCase() === 'A') {
		// save layout
		if (item.hasClass('current-save')) {
			$("#input_new_layout_name").val("");
			dialog_save_current_layout.show();
		}else{
		}
	}
});

},{"./iui.chart.bar":2,"./iui.chart.column":3,"./iui.chart.grid":4,"./iui.chart.highmaps":5,"./iui.chart.line":6,"./iui.chart.messagegrid":7,"./iui.chart.messagetable":8,"./iui.chart.pie":9,"./iui.chart.table":10,"./iui.chart.tabtable":11,"./iui.chart.timeseries":12,"./iui.chart.treemap":13,"./iui.dashboard.items":14,"./iui.dashboard.map":15,"./iui.dashboard.modal":16,"./iui.dashboard.parametermap":17,"./iui.dashboard.widget":18,"./iui.topology":19}],2:[function(require,module,exports){
var BAR_CHART_IDX = 0;
$.widget('iui.chartbar', {
	
	_create: function () {
		var self = this;

		self.refresh();

		self._trigger('willmount', null, self);

		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}
			self.timer = setInterval(function () {
				self.refresh();
			}, self.options.interval);
		}
	  this._trigger('willmount', null, this);

	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		if(this.options.params == "refresh" || this.element.parent().find("."+this.options.params).length > 0){
			this.refresh();
		}	
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },

	refresh: function () {
		var params = this.options.params || {};
		var self = this;
		
		var w = self.element.parent().parent()
				.innerWidth() - 10; 
		var h = self.element.parent().parent()
				.innerHeight() - 50;

		var titleText = self.element.parent().parent().find("form").find("[name=generation] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=modelYear] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=platform] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=smsTestDomain] option:selected").text();
		
		if(self.options.graphType != null){
			self.element.parent().parent().find("form").find("[name=graphType]").remove();
			self.element.parent().parent().find("form").append("<input type='hidden' name='graphType' value='"+self.options.graphType+"Count'>");
		}

		self.element.addClass(self.options.id);

		$.ajax({
			url : self.options.data,
			type : "post",
			dataType : "json",
			data : self.element.parent().parent().find("form").serialize(),
			success : function(data){


				if(data.graphInfo == null || data.graphInfo == ""){
					if(self.element.find("h3").length > 0){
						self.element.find("h3").text("Data does not exist.");
					}else{
						
						if(self.chart){
							self.chart.destroy();
						}
						self.element.append("<h3 style='text-align:center;'>Data does not exist.</h3>");
					}
				}else{

					if(self.options.data.indexOf("getSmsSuccessPassFailCountForVersion") > -1 || self.options.data.indexOf("getTestDomainCountForVersion") > -1){
						
						var xAxisTemp = [];
						$.each(data.graphInfo, function(){
							xAxisTemp.push(this.swVersion);
						});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'column' 
							},
							title: {
									text: titleText
							},
							subtitle: {
									text: 'SMS Performance'
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: 'Count'
									},
									stackLabels: {
										enabled: true,
										style: {
											fontWeight: 'bold',
											color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
										}
									}
							},
							tooltip: {
									shared: true,
									footerFormat: 'Total: {point.total}'
							},
							plotOptions: {
									column: {
										stacking: 'normal',
										dataLabels: {
											enabled: true,
											color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
										}
									}
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							}
						});

						if(self.options.data.indexOf("getSmsSuccessPassFailCountForVersion") > -1){
							var failCnt = [];
							//var successCnt = [];
							var passCnt = [];

							$.each(data.graphInfo, function(){
								failCnt.push(this.failCount);
								//successCnt.push(this.successCnt);
								passCnt.push(this.passCount);
							});

							chart.addSeries({
								name: 'Fail',
								data: failCnt
							});
								
							chart.addSeries({
								name: 'Pass',
								data: passCnt
							});
								
							/*chart.addSeries({
								name: 'Success',
								data: successCnt
							});*/
						}else if(self.options.data.indexOf("getTestDomainCountForVersion") > -1 ){
							var opcCnt = [];
							var ipcCnt = [];

							$.each(data.graphInfo, function(){
								if(this.OPC){
									opcCnt.push(this.OPC);
								}else{
									opcCnt.push(null);
								}

								if(this.IPC){
									ipcCnt.push(this.IPC);
								}else{
									ipcCnt.push(null);
								}
							});

							chart.addSeries({
								name: 'OPC',
								data: opcCnt
							});
								
							chart.addSeries({
								name: 'IPC',
								data: ipcCnt
							});
						}
						
					}else if(self.options.data.indexOf("getSmsSuccessPassFailCountForRegion") > -1){

						var xAxisTemp = [];
						$.each(data.graphInfo, function(){
							xAxisTemp.push(this.name);
						});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'column'
							},
							title: {
									text: titleText
							},
							subtitle: {
									text: 'SMS Performance'
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: 'Count'
									}
							},
							tooltip: {
									shared: true,
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							}

						});
						
						var failCnt = [];
						var passCnt = [];
						//var successCnt = [];

						$.each(data.graphInfo, function(){
							failCnt.push(this.data[0]);
							//successCnt.push(this.data[1]);
							passCnt.push(this.data[2]);
						});

						chart.addSeries({
							name: 'Fail',
							data: failCnt
						});
							
						chart.addSeries({
							name: 'Pass',
							data: passCnt
						});

						/*chart.addSeries({
							name: 'Success',
							data: successCnt
						});*/

					}else if(self.options.data.indexOf("getNormalDrxForRetion") > -1){

						var xAxisTemp = [];
						$.each(data.graphInfo, function(){
							xAxisTemp.push(this.region);
						});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'column'
							},
							title: {
									text: titleText
							},
							subtitle: {
									text: 'SMS Performance'
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: 'RTD(sec)'
									}
							},
							tooltip: {
									shared: true,
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							}

						});

						$.each(data.legend, function(index){
							var seriesData = [];
							var legend = this.smsTestDomain2;

							$.each(data.graphInfo, function(){
								if(this[legend]){
									seriesData.push(this[legend]);
								}else{
									seriesData.push(null);
								}
							});

							chart.addSeries({
								name: legend,
								data: seriesData
							});
						});
						
					}else if(self.options.data.indexOf("getRegionPassFailForProject") > -1 || self.options.data.indexOf("getProjectPassFailForRegion") > -1){
						var xAxisTemp = [];

						if(self.options.data.indexOf("getRegionPassFailForProject") > -1){
							$.each(data.graphInfo, function(){
								xAxisTemp.push(this.region);
							});
						}else if(self.options.data.indexOf("getProjectPassFailForRegion") > -1){
							$.each(data.graphInfo, function(){
								xAxisTemp.push(this.model);
							});
						}

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'column'
							},
							title: {
									text: 'SMS Performance'
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: 'Count'
									}
							},
							tooltip: {
									shared: true,
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical", 
								align: "right",
								verticalAlign: "middle"
							}

						});
						
						if(self.options.data.indexOf("getRegionPassFailForProject") > -1){
							$.each(data.legend, function(){
								var seriesData = [];
								var model = this.model;

								$.each(data.graphInfo, function(){
									if(this[model]){
										seriesData.push(this[model]);
									}else{
										seriesData.push(null);
									}
								});

								chart.addSeries({
									name: model,
									data: seriesData
								});
							});
						}else if(self.options.data.indexOf("getProjectPassFailForRegion") > -1){
							$.each(data.legend, function(){
								var seriesData = [];
								var region = this.region;

								$.each(data.graphInfo, function(){
									if(this[region]){
										seriesData.push(this[region]);
									}else{
										seriesData.push(null);
									}
								});

								chart.addSeries({
									name: region,
									data: seriesData
								});
							});
						}

					}else if(self.options.data.indexOf("getProjectRtdForRegion") > -1){
						
						var xAxisTemp = [];
						$.each(data.graphInfo, function(){
							xAxisTemp.push(this.region);
						});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'bar'
							},
							title: {
									text: titleText
							},
							subtitle: {
									text: ''
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: 'RTD(sec)'
									}
							},
							tooltip: {
									shared: true,
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							}
						});

						$.each(data.legend, function(){
							var seriesData = [];
							var model = this.model;

							$.each(data.graphInfo, function(){
								if(this[model]){
									seriesData.push(this[model]);
								}else{
									seriesData.push(null);
								}
							});

							chart.addSeries({
								name: model,
								data: seriesData
							});
						});
					}else if(self.options.data.indexOf("getCaUpDownloadSpeedcomparisonForRegion") > -1){
						
						var xAxisTemp = [];
						$.each(data.graphInfo, function(){ 
							xAxisTemp.push(this.region);
						});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									type: 'column'
							},
							title: {
									text: titleText
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: {
									min: 0,
									title: {
										text: '(sec)'
									}
							},
							tooltip: {
									shared: true,
							},
							plotOptions: {
								column: {
										grouping: false,
										shadow: false,
										borderWidth: 0
									}
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							}
							/*series: [{
								name: '2CA Upload',
								color: 'rgba(165,170,217,1)',
								data: [150, 73, 20],
								pointPadding: 0.3,
								pointPlacement: -0.2
							}, {
								name: '2CA Download',
								color: 'rgba(126,86,134,.9)',
								data: [140, 90, 40],
								pointPadding: 0.4,
								pointPlacement: -0.2
							}, {
								name: '3CA Upload',
								color: 'rgba(248,161,63,1)',
								data: [183.6, 178.8, 198.5],
								pointPadding: 0.3,
								pointPlacement: 0.2
							}, {
								name: '3CA Download',
								color: 'rgba(186,60,61,.9)',
								data: [203.6, 198.8, 208.5],
								pointPadding: 0.4,
								pointPlacement: 0.2
							}]
							*/
						});

						$.each(data.legend, function(index){
							var seriesData = [];
							var lteCaType = this.lteCaType;

							$.each(data.graphInfo, function(){
								if(this[lteCaType]){
									seriesData.push(this[lteCaType]);
								}else{
									seriesData.push(null);
								}
							});

							var colorList = ["rgba(165,170,217,1)", "rgba(126,86,134,.9)", "rgba(248,161,63,1)", "rgba(186,60,61,.9)"];
							var pointPaddingList = [0.3, 0.4, 0.3, 0.4];
							var pointPlacementList = [-0.2, -0.2, 0.2, 0.2];
							
							if(lteCaType.indexOf("ulFreq") > -1 ){
								lteCaType = lteCaType.replace("ulFreq"," Upload");
							}else if(lteCaType.indexOf("dlFreq") > -1 ){
								lteCaType = lteCaType.replace("dlFreq"," Download");
							}

							chart.addSeries({
								name: lteCaType,
								color: colorList[index],
								data: seriesData,
								pointPadding: pointPaddingList[index],
								pointPlacement: pointPlacementList[index]
							});

						});

					}else if(self.options.data.indexOf("getSmsCntDrxTimeNormalTimeForVersion") > -1){
						
						var xAxisTemp = [];
						$.each(data.graphInfo, function(){
							xAxisTemp.push(this.swVersion);
						});

						var seriesTemp = [];
						var countDataList = [];
						var rtdDataList = [];

						$.each(data.legend, function(index){
							var legends = this.smsTestDomain2;

							$.each(data.graphInfo, function(){
								if(this[legends]){
									rtdDataList.push(this[legends]);
								}else{
									rtdDataList.push(null);
								}
							});

							if(data.graphInfo[index] != null){
								countDataList.push(data.graphInfo[index]['cnt']);
							}

							seriesTemp.push({name:legends, type:'column', yAxis:1, data:rtdDataList, tootip:{valueSuffix: 'sec'}});
							rtdDataList = [];
						});
						
						
						titleText = self.element.parent().parent().find("form").find("[name=generation] option:selected").text()
								+ " " + self.element.parent().parent().find("form").find("[name=modelYear] option:selected").text()
								+ " " + self.element.parent().parent().find("form").find("[name=platform] option:selected").text()
								+ " " + self.element.parent().parent().find("form").find("[name=region] option:selected").text();
		

						seriesTemp.push({name:'Count', type:'spline', data:countDataList, tootip:{valueSuffix: ''}});

						var chart = new Highcharts.Chart({
							credits:{ 
									enabled:false 
							},	
							chart: {
									renderTo: $(self.element).attr("id"),
									zoomType: 'xy'
							},
							title: {
									text: titleText
							},
							xAxis: {
								categories: xAxisTemp
							},
							yAxis: [{ // Primary yAxis
								labels: {
									format: '{value}',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								},
								title: {
									text: 'Count',
									style: {
										color: Highcharts.getOptions().colors[1]
									}
								}
							}, { // Secondary yAxis
								title: {
									text: 'RTD',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								labels: {
									format: '{value} sec',
									style: {
										color: Highcharts.getOptions().colors[0]
									}
								},
								opposite: true
							}],
							tooltip: {
									shared: true,
							},
							legend: {
								floating: false,
								enabled: true,
								layout: "vertical",
								align: "right",
								verticalAlign: "middle"
							},
							series: seriesTemp
						});

					}
					
					chart.setSize(w, h);	
					self.chart = chart;

				}

			},
			error : function(error, request, status){
				console.log(error);
			}
		});
		

		this._trigger('willupdate', null, self);
	},

	/**
	 * 데이터 추가
	 */
	load: function (ajaxData) {
		var self = this;
		

		self = null;
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		var self = this;
		this.chart.destroy();
		self = null;
		//this.chart.unload('value');
	},

	/**
	 * 크기 변경
	 */
	resize: function () {	 
		var w = this.element.parent().parent()
			.innerWidth()-10;
		var h = this.element.parent().parent()
				.innerHeight()-50;

		var agent = navigator.userAgent.toLowerCase();
	 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			h = this.element.parent().parent().parent().parent().parent().innerHeight() - 60;
		}
		
		if(this.chart){
			this.chart.setSize(w, h);
		}
	}
});

},{}],3:[function(require,module,exports){
var scope = window;
var BAR_CHART_IDX = 0;
$.widget('iui.chartcolumn', {
	_create: function () {
		var self = this;
		self.load();
	},


	_destroy: function(){
		clearInterval(this.timer);
	},

	_setOption: function (key, value) {
		this._super(key, value);
		if(value == this.options.item.data){
			this.refresh();
		}
	},


	refresh: function () {
		var params = this.options.item.params || {};
		var self = this;
		
		this._trigger('willupdate', null, this);
	},

	/**
	 * 데이터 추가
	 */
	load: function (ajaxData) {
		var self = this;
		
		var parent = this.element;
		$(parent).height(500);
		
		var chart_column = echarts.init(parent[0]);
		var chart_column_option = {
			title : {
				text : ''
			},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			grid : {
				left : '3%',
				right : '4%',
				bottom : '3%',
				containLabel : true
			},
			xAxis : {
				type : 'value',
				boundaryGap : [ 0, 0.01 ]
			},
			yAxis : {
				type : 'category',
				data : [ '정상인', '심질환', '천식', '전립선', '출산',
						'유방질환', '장질환', '신장이식', '사구체', '미숙아',
						'만성폐질환', '당뇨병', '뇌경색', '근골격', '간염',
						'간경화', '혈액암', '폐암', '전립선암', '유방암',
						'위암', '신장암', '두경부암', '대장암', '갑상선암',
						'간암' ]
			},
			series : [ {
				name : '',
				type : 'bar',
				data : [ 100, 0, 0, 0, 0, 0, 0, 0, 503, 0, 0,
						200, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0,
						0, 0, 400 ]
			} ]
		};

		chart_column.setOption(chart_column_option);
		
		self.chart = chart_column;
		self.resize();
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		if(this.chart){
			this.chart.destroy();
			this.chart = null;
		}
	},

	/**
	 * 크기 변경
	 */
	resize: function () {
		
		if(this.chart) {
			var h = this.element.parent().parent().innerHeight()-50;
		
			this.element.css({'height': h});
			this.chart.resize();
		}
	}
});
//});

},{}],4:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {
var scope = window;
var TABLE_CHART_IDX = 0;
$.widget('iui.chartgrid', {
	_create: function () {
		var self = this;

		self.element.empty().loadTemplate(self.options.item.template, {} , {
			success: function () {
				self.initGrid();
				self.refresh();
				
				self.element.parent().parent().parent().parent().parent().bind("click",function(){
					$("#tab1").click();
					//$("#map_tree").hide();
					//$("#grid_tree").show();
					treeType = "gridTree";
				});
			},
			complete: function () {			
			},
			error: function () {
			}
		});

		self._trigger('willmount', null, self);

		if (self.options.item.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				self.refresh();
			}, self.options.item.interval);
		}

	},
	_setOption: function (key, value) {
		this._super(key, value);
		if(value == this.options.item.data){
			this.refresh();
		}
	},
	refresh: function () {
		var params = this.options.params || {};
		var self = this;

		$("#search_form input[name='currentPage']").val(1);
		$("#search_form input[name='listCount']").val($("#opt_linelength").val());
		$("#page_input").val(1);

		$("#search_form [name=checkList]").remove();
		var checkList = opener.document.searchForm.checkList;
		if(checkList.length > 0){
			$.each(checkList, function(){
				$("#search_form").append("<input type='hidden' name='checkList' value='"+this.value+"'>");
			});
		}else{
			$("#search_form").append("<input type='hidden' name='checkList' value='"+checkList.value+"'>");
		}
		
		$.ajax({
			url: self.options.item.data,
			dataType: "json",
			type: "post",
			data: $("#search_form").serialize(),
			success: function (ajaxData) {
				self.load(ajaxData);
				dashboardWidgetIdx++;
				if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
					loadingEnd();
				}

				params = null;
				ajaxData = null;
			},
			error: function (request, status, error) {
				console.log(error);
				if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
					loadingEnd();
				}

				params = null;
			}
		});

		this._trigger('willupdate', null, this);
	},
	initGrid: function () {
		
		$($(".widget-body")[1]).children().height("100%");
		$("#iw_container").height($("#iw_container").parent().parent().parent().height() - 42);

		var self = this;
		var tableSize = 1500; //self.element.width();

		jui.ready(function(ui, uix, _) {
			var table_width = self.element.parent().outerWidth();	    
			self.xtable = uix.xtable(self.element.find("#xtable"), {
				fields: self.options.item.fields,
				sort: false,
				sortLoading: true,
				buffer : "scroll",
				bufferCount : 200,
				resize: true,
				colshow: [0, 1, 2, 3, 4, 9, 12, 13, 14, 15, 115, 116],
				width: tableSize,
				filterOption: filterOption,
				scrollHeight: self.element.height()-30,
				event: {
					colmenu: function(column, e) {
						this.toggleColumnMenu(e.pageX - 25);
					},
					select: function(row, e) {
						this.select(row.index);

						
						markerClickFlag = true;
						messageClickFlag = true;

						var tree = $.fn.zTree.getZTreeObj("tree");  // 맵
						var etree = $.fn.zTree.getZTreeObj("etree");   // 이벤트 맵
						var graphtree = $.fn.zTree.getZTreeObj("graphtree");   // 그래프 

						//eventmapMarkerLayerParameter

						////////////////메시지

						beforeGridRow = $($(xtable).find("tbody").find("tr")[row.index]);

						if(!messageGridFlag){

							if(beforeGridRow2 != ""){
								beforeGridRow2.removeClass("selected");
								$("#xtable_message > .body").scrollTop(0);
							}
							
							var rrcFlag = false;
							var message_row;
							$.each(copyMessageXtableData, function(index){
								if(row.data.sdmTextTime == this.sdmTextTime){

									xtableAttr.options.startPage = row.data.rownum > 200 ? row.data.rownum - 201 : 0;
									messageXtableAttr.options.startPage = index > 100 ? index - 101 : 0;
									if(messageXtableAttr.options.startPage < 1){
										messageXtableAttr.options.upFlag = false;
									}else{
										messageXtableAttr.options.upFlag = true;
									}
									
									changeData = copyMessageXtableData.slice(messageXtableAttr.options.startPage, messageXtableAttr.options.startPage+messageXtableAttr.options.bufferCount);
								
									//초기화
									xtableAttr.options.prevPageCnt = 1;
									xtableAttr.options.nextPageCnt = 1;
									messageXtableAttr.options.prevPageCnt = 1;
									messageXtableAttr.options.nextPageCnt = 1;
									
									messageXtableAttr.reset(); 
									messageXtableAttr.options.tempBody.append(changeData); 

									$.each(changeData, function(i){
										if(row.data.sdmTextTime == this.sdmTextTime){

											message_row = $(xtable_message).find("tbody").find("tr")[i];
											if(message_row){
												$(message_row).addClass("selected"); 
												message_row.scrollIntoView(false);
												beforeGridRow2 = $(message_row);
												parseData($(message_row).find("input:checkbox").val().split("|")[0], $(message_row).find("input:checkbox").val().split("|")[1], $($(message_row).find("td")[2]).text());
											}
											return false;
										}
									});

									rrcFlag = true;
								}
							});
							
							if(!rrcFlag){
								$.each(copyMessageXtableData, function(index){
									if(row.data.sdmTextTime < this.sdmTextTime){
										
										var i = index > 0 ? index-1 : index;

										var beforeTime = row.data.sdmTextTime - copyMessageXtableData[i].sdmTextTime;
										var afterTime = this.sdmTextTime - row.data.sdmTextTime;
										var selectTime = beforeTime > afterTime ? index : i;

										xtableAttr.options.startPage = row.data.rownum > 200 ? row.data.rownum - 201 : 0;
										messageXtableAttr.options.startPage = selectTime > 100 ? selectTime - 101 : 0;
										if(messageXtableAttr.options.startPage < 1){
											messageXtableAttr.options.upFlag = false;
										}else{
											messageXtableAttr.options.upFlag = true;
										}
										
										changeData = copyMessageXtableData.slice(messageXtableAttr.options.startPage, messageXtableAttr.options.startPage+messageXtableAttr.options.bufferCount);
									
										//초기화
										xtableAttr.options.prevPageCnt = 1;
										xtableAttr.options.nextPageCnt = 1;
										messageXtableAttr.options.prevPageCnt = 1;
										messageXtableAttr.options.nextPageCnt = 1;
										
										messageXtableAttr.reset(); 
										messageXtableAttr.options.tempBody.append(changeData); 

										$.each(changeData, function(i){
											if(row.data.sdmTextTime < this.sdmTextTime){

												message_row = $(xtable_message).find("tbody").find("tr")[i-1];
												if(message_row){
													$(message_row).addClass("selected"); 
													message_row.scrollIntoView(false);
													beforeGridRow2 = $(message_row);
													parseData($(message_row).find("input:checkbox").val().split("|")[0], $(message_row).find("input:checkbox").val().split("|")[1], $($(message_row).find("td")[2]).text());
												}
												
												return false;
											}
										});

										rrcFlag = true;
										return false;
									}
								});
							}
							

							if(!rrcFlag){

								xtableAttr.options.startPage = row.data.rownum > 200 ? row.data.rownum - 201 : 0;
								messageXtableAttr.options.startPage = $(xtable_message).find("tbody").find("tr").length-1 > 100 ? $(xtable_message).find("tbody").find("tr").length-1 - 101 : 0;
								if(messageXtableAttr.options.startPage < 1){
									messageXtableAttr.options.upFlag = false;
								}else{
									messageXtableAttr.options.upFlag = true;
								}
								
								changeData = copyMessageXtableData.slice(messageXtableAttr.options.startPage, messageXtableAttr.options.startPage+messageXtableAttr.options.bufferCount);
							
								//초기화
								
								xtableAttr.options.prevPageCnt = 1;
								xtableAttr.options.nextPageCnt = 1;
								messageXtableAttr.options.prevPageCnt = 1;
								messageXtableAttr.options.nextPageCnt = 1;
								
								messageXtableAttr.reset(); 
								messageXtableAttr.options.tempBody.append(changeData); 

								message_row = $(xtable_message).find("tbody").find("tr")[changeData.length-1];
								if(message_row){
									$(message_row).addClass("selected"); 
									message_row.scrollIntoView(false);
									beforeGridRow2 = $(message_row);
									
									parseData($(message_row).find("input:checkbox").val().split("|")[0], $(message_row).find("input:checkbox").val().split("|")[1], $($(message_row).find("td")[2]).text());
								}
								
							}


						}

						messageGridFlag = false;



						////////////////그래프

						if(graphtree.getCheckedNodes().length > 0){
							if(beforeSelectedPoint){
								graphAttr.xAxis[0].removePlotLine(beforeSelectedPoint);
							}

							$.each(graphAttr.series[0].data, function(index){
								if(row.data.fileNo == graphData.graphData['fileno'][index][1] &&  row.data.sdmTextTime == graphData.graphData['sdmTextTime'][index][1]){
									graphAttr.xAxis[0].addPlotLine({
										color: 'red', // Color value
										id: graphAttr.series[0].data[index].x,
										dashStyle: 'solid', // Style of the plot line. Default to solid
										value: graphAttr.series[0].data[index].x, // Value of where the line will appear
										width: 2 // Width of the line    
									});
									beforeSelectedPoint = graphAttr.series[0].data[index].x;
									showFlag = true; 
								}

								if(!showFlag){
									if(row.data.fileNo == graphData.graphData['fileno'][index][1] && parseInt(row.data.sdmTextTime) < parseInt(graphData.graphData['sdmTextTime'][index][1])){
										graphAttr.xAxis[0].addPlotLine({
										color: 'red', // Color value
										id: graphAttr.series[0].data[index].x,
										dashStyle: 'solid', // Style of the plot line. Default to solid
										value: graphAttr.series[0].data[index].x, // Value of where the line will appear
										width: 2 // Width of the line    
									});
									beforeSelectedPoint = graphAttr.series[0].data[index].x;
									showFlag = true;
									}

								}
							});
						}

						


						//////////////////맵 

						var getFormatedDateTime = function(millitime){
							var d = new Date(millitime);
							//return Globalize.format(d, 'a') + '.' + lpad(d.getMilliseconds(), 3, '0');
							var month = (d.getMonth()+1);
							month = getFormatedDateTime2(month);
							
							var day = getFormatedDateTime2(d.getDate());
							var hours = getFormatedDateTime2(d.getHours());
							var minutes = getFormatedDateTime2(d.getMinutes());
							var seconds = getFormatedDateTime2(d.getSeconds());
							
							return d.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
						};
						
						var getFormatedDateTime2 = function(str){
							if(str < 10) str = "0" + str;
							return str;
						}
						
						var content;
						
						if(tree.getCheckedNodes().length > 0){

							var showFlag = false;
							var lat;
							var lng;
							var sdmTime;

							$.each(markerLayer.parameters, function(){
								if(row.data.fileNo == this.fileNo &&  row.data.sdmTextTime == this.sdmTextTime){
									lat = this.lat;
									lng = this.lng;
									sdmTime = this.sdmTime;

									showFlag = true;
								}

								if(!showFlag){
									if(row.data.fileNo == this.fileNo && parseInt(row.data.sdmTextTime) < parseInt(this.sdmTextTime)){
										lat = this.lat;
										lng = this.lng;
										sdmTime = this.sdmTime;
										
										showFlag = true;
									}

								}
							});

							if(!showFlag){
								lat = markerLayer.parameters[markerLayer.parameters.length-1].lat;
								lng = markerLayer.parameters[markerLayer.parameters.length-1].lng;
								sdmTime = markerLayer.parameters[markerLayer.parameters.length-1].sdmTime;
								
								showFlag = true;
							}
							
							var codevalue = 0;
							var selectedMapParameterValue = '';

							$.each(tree.getCheckedNodes(), function(){
								if(this.eventcode2){
									if(row.data[this.eventcode2]){
										codevalue = row.data[this.eventcode2];
									}else{
										codevalue = 0;
									}

									selectedMapParameterValue += this.name + ' : ' + codevalue + '<br>';
								}
							});

							content = 'Date : ' + getFormatedDateTime(sdmTime) + '<br>' + selectedMapParameterValue;

							var info = {
									lat : lat,
									lng : lng,
									content : content,
									date : sdmTime
							};


							map2.showInfoOnly(info);

						}else if(etree.getCheckedNodes().length > 0){

							var showFlag = false;
							var lat;
							var lng;
							var sdmTime;

							$.each(eventmapMarkerLayerParameter, function(){
								if(row.data.fileNo == this.fileNo &&  row.data.sdmTextTime == this.sdmTextTime){
									lat = this.lat;
									lng = this.lng;
									sdmTime = this.sdmMilliTime;

									showFlag = true;
								}

								if(!showFlag){
									if(row.data.fileNo == this.fileNo && parseInt(row.data.sdmTextTime) < parseInt(this.sdmTextTime)){
										lat = this.lat;
										lng = this.lng;
										sdmTime = this.sdmMilliTime;
										
										showFlag = true;
									}
								}
							});

							if(!showFlag){
								lat = eventmapMarkerLayerParameter[eventmapMarkerLayerParameter.length-1].lat;
								lng = eventmapMarkerLayerParameter[eventmapMarkerLayerParameter.length-1].lng;
								sdmTime = eventmapMarkerLayerParameter[eventmapMarkerLayerParameter.length-1].sdmMilliTime;
								
								showFlag = true;
							}
							
							content = 'Date : ' + getFormatedDateTime(sdmTime);

							var info = {
									lat : lat,
									lng : lng,
									content : content,
									date : sdmTime
							};

							map3.showInfoOnly(info);
						}

					},
					colshow: function(column, e) {
					},
					colhide: function(column, e) {
					},
					colresize: function(column, e) {
					},
					dblclick: function(row, e) {
					},
					sort: function(column, e) {
						var className = {
							"desc": "icon-arrow1",
							"asc": "icon-arrow3"
						}[column.order];
						$(xtableAttr.listColumn()).each(function(){
							$(this.element).children("i").remove();
						});
						$(column.element).append("<i class='" + className + "'></i>");
					},
					filterChange: function(column,e){
						lastFilterData = column;		
						xtableAttr.options.page = $("#page_input").val();
						markerClickFlag = false;
						messageClickFlag = false;
						xtableAttr.filter(function(data){
							var flag = true;
							
							$.each(Object.keys(column),function(){
								if(column[this.toString()] != ""){
									if(data[this.toString()] == null || data[this.toString()].toString().indexOf(column[this.toString()]) == -1){
										flag = false;
										return;
									}
								}
							});
							
							return flag;
						});			
					}
				},
				tpl: {
					row: $("#"+self.options.item.tpl.row).html(),
					none : $("#"+self.options.item.tpl.none).html(),
					menu : $("#"+self.options.item.tpl.menu).html()
				}
			});

		});

		
		$("#iw_container > .body").height($("#iw_container").height() - 30);

	},
	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function (value) {
		$("#tot_page").text(Math.ceil(parseFloat(value.pageInfo.totalCount) / parseFloat(value.pageInfo.listCount)) == "" ? 1 : Math.ceil(parseFloat(value.pageInfo.totalCount) / parseFloat(value.pageInfo.listCount)));
		$("#tot_cnt").text(value.pageInfo.totalCount+"건 ");
				
		this.xtable.update(value.result);
		
		this.resize();
		this.xtable.resize();

		
		dashboardWidgetIdx++;
		if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
			loadingEnd();
		}

		xtableAttr = this.xtable;
		copyXtableData = xtableAttr.listData();
		this.xtable.options.data = copyXtableData;

		//$("#iw_container").height(window.innerHeight/1.36);
		//$("#xtable").height($("#iw_container").height());

	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		gridResizeFlag = true;
		beforeGridHeight = $("#xtable > .body").height();

		$(this.xtable.root).width("100%").height("95%");
		this.xtable.scrollWidth($(this.xtable.root).innerWidth());
		this.xtable.scrollHeight($(this.xtable.root).innerHeight());
		//$("#iw_container > .body").height($("#iw_container").height()-40);

		$("#iw_container").height($("#iw_container").parent().parent().parent().height() - 42);
		this.xtable.height($("#iw_container").height());
		$("#xtable > .body").height($("#iw_container").height()-34);
		
		this.xtable.resize();
		
		
		afterGridHeight = $("#xtable > .body").height();
	}

});

},{}],5:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {
var scope = window;
var TABLE_CHART_IDX = 0;

$.widget('iui.charthighmaps', {
	_create: function () {
		var self = this;

		self.refresh();

		self._trigger('willmount', null, self);
	
		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				clickFlag = true;
				intervalFlag = true;
				self.refresh();
			}, self.options.interval);
		}
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		if(this.options.params == "refresh" || this.element.parent().find("."+this.options.params).length > 0){
			this.refresh();
		}	

		this.refresh();
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },
	refresh: function () {
		var params = this.options.params || {};
		var self = this;
		
		var w = self.element.parent().parent()
				.innerWidth() - 10; 
		var h = self.element.parent().parent()
				.innerHeight() - 50;

		$.ajax({
			url : self.options.data,
			type : "post",
			dataType : "json",
			data : self.element.parent().parent().find("form").serialize(),
			success : function(data){
					
				var seriesTemp = [];
				$.each(data.graphInfo, function(){
					seriesTemp.push({code: this.code});
				});
				var chart = new Highcharts.mapChart({
					credits:{ 
						enabled:false 
					},
					chart: {
						renderTo: $(self.element).attr("id")
					},
					title: {
						text: null
					},
					mapNavigation: {
						enabled: true,
						enableDoubleClickZoomTo: true
					},
					colorAxis: {
						min: 1, // min, max 값 db 에서 받아서 넣어줌.
						max: 1000,
						type: 'logarithmic'
					},
					legend: {
					   enabled : false
					},
					tooltip: {
						  formatter: function(){
							 return "<b>Pass</b> : "+this.point.passCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							 +"<br><b>Fail</b> : "+this.point.failCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
						  }
					},
					series: [{
						data: seriesTemp, //data, //data로 하면 여러개 샘플로 볼 수 있음. 
						mapData: Highcharts.maps['custom/world'],
						joinBy: ['iso-a2', 'code'],
						name: 'tooltip title',
						states: {
							hover: {
								color: Highcharts.getOptions().colors[2]
							}
						},
						dataLabels: {
						  enabled: true,
						  formatter: function () {
							 if (this.point.code) {
								return this.point.code;
							 }
						  }
					   }
					}]
				});

				chart.setSize(w, h);					
				dashboardWidgetIdx++;							
				self.chart = chart;
			},
			error : function(error, request, status){
				console.log(error);
			}
		});
	

		this._trigger('willupdate', null, this);
	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function () {
		
	
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		var w = this.element.parent().parent()
			.innerWidth()-10;
		var h = this.element.parent().parent()
				.innerHeight()-50;

		var agent = navigator.userAgent.toLowerCase();
	 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			h = this.element.parent().parent().parent().parent().parent().innerHeight() - 60;
		}
		
		if(this.chart){
			this.chart.setSize(w, h);
		}
	}

});
//});

},{}],6:[function(require,module,exports){

var scope = window;
var LINE_CHART_IDX = 0;
$.widget('iui.chartline', {
 
 _setOption: function (key, value) {
  // if (key === "params") {
  // }
  this._super(key, value);

    if(this.options.params == "refresh" || this.element.parent().find("."+this.options.params).length > 0){
		this.refresh();
	}
 },
 _create: function () {
	var self = this;

	if(this.options.data.indexOf("getParamegerGraph") > -1){
		self.element.parent().parent().parent().parent().parent().bind("click",function(){
			$("#tab3").click();
			treeType = "graphtree";
		});
	}

	self.refresh();

	self._trigger('willmount', null, self);
	chart = null;
	ajaxData = null;

	if (self.options.interval) {
		if (self.timer != null) {
			clearInterval(self.timer);
		}
		self.timer = setInterval(function () {
			self.refresh();
		}, self.options.interval);
	}
  this._trigger('willmount', null, this);

 },
 
 refresh: function () {
	var params = this.options.params || {};
	var self = this;

	var titleText = "";
	
	
	if(this.options.data.indexOf("getRtdForVersionNRegion") > -1 ){
		titleText = self.element.parent().parent().find("form").find("[name=generation] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=modelYear] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=platform] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=smsTestDomain] option:selected").text();
	}else if(this.options.data.indexOf("getRtdForRegionVersionBlueButton") > -1 ){
		titleText = self.element.parent().parent().find("form").find("[name=slbDeviceGeneration] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=slbModelYear] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=slbDevicePlatform] option:selected").text()
				+ " " + self.element.parent().parent().find("form").find("[name=slbSmsTestDomain] option:selected").text();
	}
	

	self.element.addClass(self.options.id);

	var w = self.element.parent().parent()
		.innerWidth() - 10; 
	var h = self.element.parent().parent()
		.innerHeight() - 50;
	
	if(this.options.data.indexOf("getParamegerGraph") > -1){
		
		var tree = $.fn.zTree.getZTreeObj("graphtree");
		$.ajax({
			url : self.options.data,
			type : "post",
			dataType : "json",
			data : $("#search_form").serialize(),
			success : function(data){

				if(data.graphData == null || data.graphData == ""){
					if(self.element.find("h3").length > 0){
						self.element.find("h3").text("Data does not exist.");
					}else{
						
						if(self.chart){
							self.chart.destroy();
						}
						self.element.append("<h3 style='text-align:center;'>Data does not exist.</h3>");
					}
				} else {

					graphData = data;

					graphAttr = new Highcharts.Chart({
						credits:{ 
							enabled:false 
						},
						chart: {
								renderTo: $(self.element).attr("id"),
								zoomType: 'x'
						},
						title: {
								text: titleText
						},
						xAxis: {
							type: 'datetime',
							dateTimeLabelFormats: {
								day: '%d %H:%M'
							}
						},
						yAxis: {
							title: {
								text: ''
							}
						},
						plotOptions: {
							series: {
								pointStart: 0 ,
								allowPointSelect: true,
								point: {
									events:{
										select: function(e){
										
											if(beforeSelectedPoint){
												graphAttr.xAxis[0].removePlotLine(beforeSelectedPoint);
											}

											graphAttr.xAxis[0].addPlotLine({
												color: 'red', // Color value
												id: e.target.x,
												dashStyle: 'solid', // Style of the plot line. Default to solid
												value: e.target.x, // Value of where the line will appear
												width: 2 // Width of the line    
											});
											beforeSelectedPoint = e.target.x;

											markerClickFlag = true;

											$.each(copyXtableData, function(index){
												if(this.fileNo == graphData.graphData['fileno'][e.target.index][1] 
													&& this.sdmTextTime == graphData.graphData['sdmTextTime'][e.target.index][1]){
													
													xtable.jui.options.startPage = index > 100 ? index - 101 : 0;
													if(xtable.jui.options.startPage < 1){
														xtable.jui.options.upFlag = false;
													}else{
														xtable.jui.options.upFlag = true;
													}
													
													changeData = copyXtableData.slice(xtable.jui.options.startPage, xtable.jui.options.startPage+xtable.jui.options.bufferCount);
												
													//초기화
													xtable.jui.options.prevPageCnt = 1;
													xtable.jui.options.nextPageCnt = 1;

													markerFileno = this.fileNo;
													markerDate = this.sdmTime;
													
													xtableAttr.reset(); 
													xtable.jui.options.tempBody.append(changeData); 
													
													return false;
												}
											});

											$.each(changeData, function(index){
												if(this.fileNo == graphData.graphData['fileno'][e.target.index][1] 
													&& this.sdmTextTime == graphData.graphData['sdmTextTime'][e.target.index][1]){

													if(beforeGridRow != ""){
														beforeGridRow.removeClass("selected");
														$("#xtable > .body").scrollTop(0);
													}
													
													var xtableRow = $(xtable).find("tbody").find("tr")[index];
													$(xtableRow).click();
													xtableRow.scrollIntoView(false);
													beforeGridRow = $(xtableRow);

													var tree = $.fn.zTree.getZTreeObj("tree");
													if(tree.getSelectedNodes().length > 0) {
														var content = 'Date : ' + this.sdmTime + '<br/>'
																	+ e.target.series.data[e.target.index].series.name + " : " + e.target.y;

														var info = {
																lat : this.lat,
																lng : this.lng,
																content : content,
																date : this.sdmTime,
																fileNo : this.fileNo
														};
														map2.showInfoOnly(info);
													}
													
													return false;
												}
											});
									    }
									}
								 }
							}
						},
						tooltip: {
							shared: true,
							crosshairs: true,
							pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b> : {point.y:,.2f}<br>',
							xDateFormat : "%Y-%m-%d, %H:%M:%S",
							dateTimeLabelFormats : {
							  millisecond:"%Y-%m-%d, %H:%M:%S",
							  second:"%Y-%m-%d, %H:%M:%S",
							  minute:"%Y-%m-%d, %H:%M:%S",
							  hour:"%Y-%m-%d %H",
							  day:"%Y-%m-%d",
							  week:"%Y-%m-%d",
							  month:"%Y-%m",
							  year:"%Y"	 
							}
						},
						legend: {
							floating: false,
							enabled: true,
							layout: "vertical",
							align: "right",
							verticalAlign: "middle"
						}

					});


					graphAttr.setSize(w, h);					
					dashboardWidgetIdx++;							
					self.chart = graphAttr;

				}
				//loadingEnd();

				dashboardWidgetIdx++;	
			},
			error : function(error, request, status){
				console.log(error);
			}
		});

	} else {
		$.ajax({
			url : self.options.data,
			type : "post",
			dataType : "json",
			data : self.element.parent().parent().find("form").serialize(),
			success : function(data){

				if(data.legend == null || data.legend == ""){
					if(self.element.find("h3").length > 0){
						self.element.find("h3").text("Data does not exist.");
					}else{
						
						if(self.chart){
							self.chart.destroy();
						}
						self.element.append("<h3 style='text-align:center;'>Data does not exist.</h3>");
					}
					
				}else{
					var xAxisTemp = [];
					$.each(data.graphInfo, function(){
						xAxisTemp.push(this.swVersion);
					});


					var chart = new Highcharts.Chart({
						credits:{ 
							enabled:false 
						},
						chart: {
								renderTo: $(self.element).attr("id"),
								zoomType: 'x'
						},
						title: {
								text: titleText
						},
						subtitle: {
							text: 'SMS RTD Time'
						},
						xAxis: {
							categories: xAxisTemp
						},
						yAxis: {
							title: {
								text: 'RTD(sec)'
							}
						},
						plotOptions: {
							series: {
								pointStart: 0 
							}
						},
						tooltip: {
							shared: true,
							valueSuffix: ' sec'
						},
						legend: {
							floating: false,
							enabled: true,
							layout: "vertical",
							align: "right",
							verticalAlign: "middle"
						}
					});
					

					$.each(data.legend, function(){
						var seriesData = [];
						var region = this.region;

						$.each(data.graphInfo, function(){
							if(this[region]){
								seriesData.push(this[region]);
							}else{
								seriesData.push(null);
							}
						});

						chart.addSeries({
							name: region,
							data: seriesData
						});
					});
					
					chart.setSize(w, h);					
					dashboardWidgetIdx++;							
					self.chart = chart;

					
				}



			},
			error : function(error, request, status){
				console.log(error);
			}
		});
		
	}


  this._trigger('willupdate', null, this);
 },


 _destroy: function () {
  clearInterval(this.timer);
  this.chart.destroy();
 },


 /**
  * 데이터 추가
  */
 load: function () {
	var self = this;
	

 },

 /**
  * 데이터 삭제
  */
 unload: function (value) {
  this.chart.destroy();
 },

 /**
  * 크기 변경
  */
 resize: function () {
	var w = this.element.parent().parent()
			.innerWidth()-10;
	var h = this.element.parent().parent()
			.innerHeight()-50;

	var agent = navigator.userAgent.toLowerCase();
 
	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
		h = this.element.parent().parent().parent().parent().parent().innerHeight() - 60;
	}
	
	if(this.chart){
		this.chart.setSize(w, h);
	}
 }
});

},{}],7:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {
var scope = window;
var TABLE_CHART_IDX = 0;
$.widget('iui.chartmessagegrid', {
	_create: function () {
		var self = this;

		self.element.empty().loadTemplate(self.options.item.template, {} , {
			success: function () {

				self.initGrid();
				self.refresh();
				
				self.element.parent().parent().parent().parent().parent().bind("click",function(){
					$("#tab4").click();
					//$("#map_tree").hide();
					//$("#grid_tree").show();
					treeType = "gridTree";
				});
			},
			complete: function () {			
			},
			error: function () {
			}
		});

		self._trigger('willmount', null, self);

		if (self.options.item.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				self.refresh();
			}, self.options.item.interval);
		}

	},
	_setOption: function (key, value) {
		this._super(key, value);
		if(value == this.options.item.data){
			this.refresh();
		}
	},
	refresh: function () {
		var params = this.options.params || {};
		var self = this;

		var message_tree2 = $.fn.zTree.getZTreeObj("messagetree");
		if($("#search_form [name=checkedHeaderList]").length > 0){
			$("#search_form [name=checkedHeaderList]").remove();
		}
		for(var i = 0; i < message_tree2.getCheckedNodes().length; i++){
			$("#search_form").append("<input type='hidden' name='checkedHeaderList' value="+message_tree2.getCheckedNodes()[i].name+"|"+message_tree2.getCheckedNodes()[i].networkType+">");
		}

		$.ajax({
			url: self.options.item.data,
			dataType: "json",
			type: "post",
			data: $("#search_form").serialize(),
			success: function (ajaxData) {
				self.load(ajaxData);
				$("#message_tot_cnt").html(ajaxData.pageInfo.totalCount + "건");
				dashboardWidgetIdx++;
				if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
					loadingEnd();
				}

				params = null;
				ajaxData = null;
			},
			error: function (request, status, error) {
				console.log(error);
				if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
					loadingEnd();
				}

				params = null;
			}
		});

		this._trigger('willupdate', null, this);
	},
	initGrid: function () {
		
		$($(".widget-body")[1]).children().height("100%");
		$("#iw_container_message").height($("#iw_container_message").parent().parent().parent().height());

		var self = this;
		var tableSize = 500; //self.element.width();
		var beforeData;

		jui.ready(function(ui, uix, _) {
			var table_width = self.element.parent().outerWidth();	    
			self.xtable_message = uix.xtable(self.element.find("#xtable_message"), {
				fields: self.options.item.fields,
				sort: false,
				sortLoading: true,
				sortExclude : ["fileNo"],
				buffer : "scroll",
				bufferCount : 200,
				resize: true,
				width: tableSize,
				filterOption: filterOption2,
				scrollHeight: self.element.height()-30,
				event: {
					colmenu: function(column, e) {
						this.toggleColumnMenu(e.pageX - 25);
					},
					select: function(row, e) {
						this.select(row.index);

						beforeGridRow2 = $($(xtable_message).find("tbody").find("tr")[row.index]);

						messageGridFlag = true;

						
						if(beforeGridRow != ""){
							beforeGridRow.removeClass("selected");
							$("#xtable > .body").scrollTop(0);
						}
						//markerClickFlag = false;

						var xtable_row;

						var rrcFlag = false;
						$.each(copyXtableData, function(index){
							if(row.data.sdmTextTime == this.sdmTextTime){

								xtable.jui.options.startPage = index > 100 ? index - 101 : 0;
								if(xtable.jui.options.startPage < 1){
									xtable.jui.options.upFlag = false;
								}else{
									xtable.jui.options.upFlag = true;
								}
								
								changeData = copyXtableData.slice(xtable.jui.options.startPage, xtable.jui.options.startPage+xtable.jui.options.bufferCount);
							
								//초기화
								xtable.jui.options.prevPageCnt = 1;
								xtable.jui.options.nextPageCnt = 1;

								xtableAttr.reset(); 
								xtable.jui.options.tempBody.append(changeData); 

								$.each(changeData, function(i){
									if(row.data.sdmTextTime == this.sdmTextTime){

										xtable_row = $(xtable).find("tbody").find("tr")[i];
										$(xtable_row).click();
										xtable_row.scrollIntoView(false);
										beforeGridRow = $(xtable_row);
										
										return false;
									}
								});

								rrcFlag = true;

								
							}
						});
						
						if(!rrcFlag){
							$.each(copyXtableData, function(index){
								if(row.data.sdmTextTime < this.sdmTextTime){

									var i = index > 0 ? index-1 : index;

									var beforeTime = row.data.sdmTextTime - copyXtableData[i].sdmTextTime;
									var afterTime = this.sdmTextTime - row.data.sdmTextTime;
									var selectTime = beforeTime > afterTime ? index : i;

									xtable.jui.options.startPage = selectTime > 100 ? selectTime - 101 : 0;
									if(xtable.jui.options.startPage < 1){
										xtable.jui.options.upFlag = false;
									}else{
										xtable.jui.options.upFlag = true;
									}
																		
									changeData = copyXtableData.slice(xtable.jui.options.startPage, xtable.jui.options.startPage+xtable.jui.options.bufferCount);
								
									//초기화
									xtable.jui.options.prevPageCnt = 1;
									xtable.jui.options.nextPageCnt = 1;

									xtableAttr.reset(); 
									xtable.jui.options.tempBody.append(changeData); 

									
									$.each(changeData, function(i){
										if(row.data.sdmTextTime < this.sdmTextTime){

											xtable_row = $(xtable).find("tbody").find("tr")[i];
											$(xtable_row).click();
											xtable_row.scrollIntoView(false);
											beforeGridRow = $(xtable_row);
											
											return false;
										}
									});


									rrcFlag = true;
									return false;
								}
							});
						}
						
						if(!rrcFlag){

							xtable.jui.options.startPage = $(xtable).find("tbody").find("tr").length-1 > 100 ? $(xtable).find("tbody").find("tr").length-1 - 101 : 0;
							if(xtable.jui.options.startPage < 1){
								xtable.jui.options.upFlag = false;
							}else{
								xtable.jui.options.upFlag = true;
							}
							
							changeData = copyXtableData.slice(xtable.jui.options.startPage, xtable.jui.options.startPage+xtable.jui.options.bufferCount);
						
							//초기화
							xtable.jui.options.prevPageCnt = 1;
							xtable.jui.options.nextPageCnt = 1;

							xtableAttr.reset(); 
							xtable.jui.options.tempBody.append(changeData); 

							$.each(changeData, function(){
								if(row.data.sdmTextTime < this.sdmTextTime){

									xtable_row = $(xtable).find("tbody").find("tr")[changeData.length-1];
									$(xtable_row).click();
									xtable_row.scrollIntoView(false);
									beforeGridRow = $(xtable_row);
									
									return false;
								}
							});

						}

						markerClickFlag = true;
						messageClickFlag = true;

						parseData(row.data.fileNo, row.data.sdmTextTime, row.data.header);

					},
					colshow: function(column, e) {
					},
					colhide: function(column, e) {
					},
					colresize: function(column, e) {
					},
					dblclick: function(row, e) {
					},
					sort: function(column, e) {
						var className = {
							"desc": "icon-arrow1",
							"asc": "icon-arrow3"
						}[column.order];

						$(column.element).parent().children().children("i").remove();
						/*
						$(xtableAttr.listColumn()).each(function(){
							$(this.element).children("i").remove();
						});
						*/
						$(column.element).append("<i class='" + className + "'></i>");
					},
					filterChange: function(column,e){
						lastFilterData = column;		
						messageXtableAttr.options.page = 1;
						messageXtableAttr.filter(function(data){
							var flag = true;
							
							$.each(Object.keys(column),function(){
								if(column[this.toString()] != ""){
									if(data[this.toString()] == null || data[this.toString()].toString().indexOf(column[this.toString()]) == -1){
										flag = false;
										return;
									}
								}
							});
							
							return flag;
						});			
					}
				},
				tpl: {
					row: $("#"+self.options.item.tpl.row).html(),
					none : $("#"+self.options.item.tpl.none).html(),
					menu : $("#"+self.options.item.tpl.menu).html()
				}
			});

		});

		
		$("#iw_container_message > .body").height($("#iw_container_message").height() - 30);

	},
	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function (value) {
		this.xtable_message.update(value.listRrcMessage);
		
		this.resize();
		this.xtable_message.resize();

		messageXtableAttr = this.xtable_message;
		copyMessageXtableData = messageXtableAttr.listData();
		this.xtable_message.options.data = copyMessageXtableData;

		//$("#iw_container_message").height(window.innerHeight/1.36);
		//$("#xtable").height($("#iw_container_message").height());

	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		gridResizeFlag = true;
		beforeGridHeight = $("#xtable_message > .body").height();

		$(this.xtable_message.root).width("100%").height("95%");
		this.xtable_message.scrollWidth($(this.xtable_message.root).innerWidth());
		this.xtable_message.scrollHeight($(this.xtable_message.root).innerHeight());
		//$("#iw_container_message > .body").height($("#iw_container_message").height()-40);

		$("#iw_container_message").height($("#iw_container_message").parent().parent().parent().height() - 42);
		this.xtable_message.height($("#iw_container_message").height());
		$("#xtable_message > .body").height($("#iw_container_message").height()-34);
		
		this.xtable_message.resize();
		
		
		afterGridHeight = $("#xtable_message > .body").height();
	}

});

},{}],8:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {
var scope = window;
var TABLE_CHART_IDX = 0;

$.widget('iui.chartmessagetable', {
	_create: function () {
		$("#message_text_data").height($("#message_text_data").parent().parent().parent().height() - $("#message_hex_data").height() - 60)
		var self = this;

		self.load();

		self._trigger('willmount', null, self);
	
		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				clickFlag = true;
				intervalFlag = true;
				self.refresh();
			}, self.options.interval);
		}
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },
	refresh: function () {
		var params = this.options.params || {};
		
		var self = this;

	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function () {
		
		var params = this.options.params || {};
		var self = this;

		
		self.element.empty().loadTemplate(self.options.template, '', {});

	},


	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		$("#message_text_data").height($("#message_text_data").parent().parent().parent().height() - $("#message_hex_data").height() - 89)

		// var w = Math.max(parseInt(this.element.parent().innerWidth(), 10), this.options.minWidth);
		var agent = navigator.userAgent.toLowerCase();
 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			if(this.element.parent().parent().find(".item-header").length > 0){
				var h = this.element.parent().parent().parent().parent().parent().innerHeight() - 80;
				this.element.height(h);
			}
		}
	}

});
//});

},{}],9:[function(require,module,exports){
var PIE_CHART_IDX = 0;
$.widget('iui.chartpie', {
	options: {
		minWidth: 200,
		minHeight: 200
	},
	_setOption: function (key, value) {
		this._super(key, value);
		if(this.options.params == "refresh" || this.element.parent().find("."+this.options.params).length > 0){
			this.refresh();
		}
	},
	_create: function () {
		var self = this;
		
		self.load();

	},
	_destroy: function () {
		clearInterval(this.timer);
	},

	refresh: function () {
		var params = this.options.params || {};
		var self = this;
		this._trigger('willmount', null, this);
	},


	/**
	 * 데이터 추가
	 */
	load: function () {
	
		var self = this;
		var data = self.options.data || {};
		
		var parent = this.element;
		//$(parent).height(180);
		
		var chart_pie = echarts.init(parent[0]);
		var pie_option = null;
		
		if(data.indexOf("/kbn/dashboard/getSaguche") > -1) {
			pie_option = {
				title : {
					text : ''
				},
				tooltip : {
					trigger : 'item',
					formatter : '{b} : {c} ({d}%)'
				},
				legend : {
					left : 'center',
					data : [ '위암', '사구체', '정상인' ]
				},
				series : [ {
					name : '',
					type : 'pie',
					radius : '55%',
					center : [ '50%', '60%' ],
					data : [ {
						value : 335,
						name : '사구체',
						itemStyle : {
							color : '#FED772'
						}
					}, {
						value : 310,
						name : '위암',
						itemStyle : {
							color : '#67E0E3'
						}
					}, {
						value : 234,
						name : '정상인',
						itemStyle : {
							color : '#E062AE'
						}
					} ],
					emphasis : {
						itemStyle : {
							shadowBlur : 10,
							shadowOffsetX : 0,
							shadowColor : 'rgba(0, 0, 0, 0.5)'
						}
					}
				} ]
			};
		} else if(data.indexOf("/kbn/dashboard/getMw") > -1){
			pie_option = {
				title : {
					text : ''
				},
				tooltip : {
					trigger : 'item',
					formatter : '{b} : {c} ({d}%)'
				},
				legend : {
					left : 'center',
					data : [ '남성', '여성' ]
				},
				series : [ {
					name : '',
					type : 'pie',
					radius : '55%',
					center : [ '50%', '60%' ],
					label : {
						normal : {
							show : false
						},
					},
					data : [ {
						value : 100,
						name : '남성',
						itemStyle : {
							color : '#FED772'
						}
					}, {
						value : 100,
						name : '여성',
						itemStyle : {
							color : '#67E0E3'
						}
					} ],
					emphasis : {
						itemStyle : {
							shadowBlur : 10,
							shadowOffsetX : 0,
							shadowColor : 'rgba(0, 0, 0, 0.5)'
						}
					}
				} ]
			};
			
		} else if(data.indexOf("/kbn/dashboard/getAge") > -1){
			pie_option = {
				title : {
					text : ''
				},
				tooltip : {
					trigger : 'item',
					formatter : '{b} : {c} ({d}%)'
				},
				legend : {
					left : 'center',
					data : [ '10대', '20대', '30대', '40대', '50대',
							'60대', '70대', '80대', '90대' ]
				},
				series : [ {
					name : '',
					type : 'pie',
					radius : '55%',
					center : [ '50%', '60%' ],
					label : {
						normal : {
							show : false
						},
					},
					data : [ {
						value : 100,
						name : '10대'
					}, {
						value : 70,
						name : '20대'
					}, {
						value : 20,
						name : '30대'
					}, {
						value : 60,
						name : '40대'
					}, {
						value : 20,
						name : '50대'
					}, {
						value : 10,
						name : '60대'
					}, {
						value : 90,
						name : '70대'
					}, {
						value : 100,
						name : '80대'
					}, {
						value : 80,
						name : '90대'
					} ],
					emphasis : {
						itemStyle : {
							shadowBlur : 10,
							shadowOffsetX : 0,
							shadowColor : 'rgba(0, 0, 0, 0.5)'
						}
					}
				} ]
			};
		}
		
		chart_pie.setOption(pie_option);
		
		self.chart = chart_pie;
		self.resize();
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		this.chart.unload('value')
	},

	/**
	 * 크기 변경
	 */
	resize: function () {
		
		if(this.chart) {
			var h = this.element.parent().parent().innerHeight()-50;
		
			this.element.css({'height': h});
			this.chart.resize();
		}
	}
});
//});

},{}],10:[function(require,module,exports){
var TABLE_CHART_IDX = 0;

$.widget('iui.charttable', {
	_create: function () {
		var self = this;

		self.load();

		self._trigger('willmount', null, self);
	
		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				clickFlag = true;
				intervalFlag = true;
				self.refresh();
			}, self.options.interval);
		}
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();
	},

	refresh: function () {
		var params = this.options.params || {};
		var self = this;

		this._trigger('willupdate', null, this);
	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function () {
		var params = this.options.params || {};
		var self = this;
		
		var ajaxData = [{"cnt":8}];
		
		if(self.options.data) {
			$.ajax({
				url: self.options.data,
				dataType: "json",
				type: "post",
				data: params,
				success: function(data){
					self.element.empty().loadTemplate(self.options.template, data, {
						success: function () {
						},
						complete: function () {
						},
						error: function () {
						}
					});
				},
				error: function (request, status, error) {
					console.log(error);
					params = null;
				}
			});
		} else {
				
			self.element.empty().loadTemplate(self.options.template, ajaxData, {
				success: function () {
				},
				complete: function () {
				},
				error: function () {
				}
			});
			
		}
		
		
		
		
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		// var w = Math.max(parseInt(this.element.parent().innerWidth(), 10), this.options.minWidth);
		var agent = navigator.userAgent.toLowerCase();
 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			if(this.element.parent().parent().find(".item-header").length > 0){
				var h = this.element.parent().parent().parent().parent().parent().innerHeight() - 80;
				this.element.height(h);
			}
		}
	}

});
//});

},{}],11:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {
var scope = window;
var TABLE_CHART_IDX = 0;

$.widget('iui.charttabtable', {
	_create: function () {
		var self = this;

		self.load();

		self._trigger('willmount', null, self);
	/*
		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				clickFlag = true;
				intervalFlag = true;
				self.setInfo();
			}, self.options.interval);
		}
		*/
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },

	setInfo: function(){
		console.log('setInfo');

		$.ajax({
			url : "/remoteControl/realtimeMonitoring/getSlbList.do",
			type : "post",
			dataType : "json",
			success : function(data){

				$("#div_favorite").empty();
				
				$.each(data.slblist, function(){
					var self = this;

					$.each($("#div_slb .content-style"), function(){
						if (self.slbid == $(this).find("#device-slbid").text()) {
							
							if(self.slbid == 85){
								self.w16moduleIdStatus = 1;
								self.attconnectionstate = 1;
								self.dmconnectionstate = 1;
								self.autocallstate = 1;
								self.gpsConnect = 2;
							}

							if(self.w16moduleIdStatus == 0){
								$(this).find(".device-w16moduleIdStatus4").removeClass("button-state");
								$(this).find(".dmconnectionstateDiv").html("");
								$(this).find(".attconnectionstateDiv").html("");

							}else{
								$(this).find(".device-w16moduleIdStatus4").addClass("button-state");

								var btnState = "";
								var temp1 = "";
								var temp2 = "";

								if(self.attconnectionstate == 1) btnState = "button-state";
								temp1 += "<div class='vcpTcp button-div "+btnState+"'><input type='hidden' name='portNumber' value='"+self.portNumber+"'>"+self.devicePlatform+"</div>"
								$(this).find(".dmconnectionstateDiv").html(temp1);

								if(self.dmconnectionstate == 1) btnState = "button-state";
								
								temp2 += "<div class='button-div "+btnState+"'>DM</div>"
								$(this).find(".attconnectionstateDiv").html(temp2);
							}

							if(self.autocallstate == 0){
								$(this).find(".device-autocallstate4").removeClass("button-state");
								$(this).prev().find("#equipstatus_circle").attr('src', '/css/images/basic_circle.png');
							}else{
								$(this).find(".device-autocallstate4").addClass("button-state");
								$(this).prev().find("#equipstatus_circle").attr('src', '/css/images/red_circle.png');
							}

							if(self.gpsConnect == 2){
								$(this).prev().find("#realmonitoring_circle").attr('src', '/css/images/blue_circle.png');
							}else{
								$(this).prev().find("#realmonitoring_circle").attr('src', '/css/images/basic_circle.png');
							}

							if(self.favorite == "Y"){
								$("#div_favorite").append(this.outerHTML);
							}

							return;
						}

					});

				});
				
				$.each(data.mobilelist, function(){
					var self = this;

					$.each($("#div_mobile .content-style"), function(){
						if (self.slbid == $(this).find("#device-slbid").text()) {

							if(self.slbid == 115){
								self.w16moduleIdStatus = 1;
								self.attconnectionstate = 1;
								self.dmconnectionstate = 1;
								self.autocallstate = 1;
								self.gpsConnect = 2;
							}
							
							if(self.w16moduleIdStatus == 0){
								$(this).find(".device-w16moduleIdStatus4").removeClass("button-state");

							}else{
								$(this).find(".device-w16moduleIdStatus4").addClass("button-state");
							}

							if(self.autocallstate == 0){
								$(this).find(".device-autocallstate4").removeClass("button-state");
								$(this).prev().find("#equipstatus_circle").attr('src', '/css/images/basic_circle.png');
							}else{
								$(this).find(".device-autocallstate4").addClass("button-state");
								$(this).prev().find("#equipstatus_circle").attr('src', '/css/images/red_circle.png');
							}

							if(self.gpsConnect == 2){
								$(this).prev().find("#realmonitoring_circle").attr('src', '/css/images/blue_circle.png');
							}else{
								$(this).prev().find("#realmonitoring_circle").attr('src', '/css/images/basic_circle.png');
							}
							
							if(self.favorite == "Y"){
								$("#div_favorite").append(this.outerHTML);
							}

							return;
						}

					});
				});

				loadingEnd();

			},
			error : function(error, request, status){
				console.log(error);
				loadingEnd();
			}
		});

	},
	
	refresh: function () {
		var params = this.options.params || {};
		var self = this;
		
	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function () {
		var params = this.options.params || {};
		var self = this;


		self.element.empty().loadTemplate(self.options.template, {} , {
				success: function () {
					
				},
				complete: function () {
					$("#atab1").click(function(){
						$("#atab1").attr("class","active");
						$("#atab2").removeAttr("class");
						$("#atab3").removeAttr("class");
						$("#atab4").removeAttr("class");
						$("#div_favorite").show();
						$("#div_slb").hide();
						$("#div_mobile").hide();
						$("#div_etc").hide();
					});
					$("#atab2").click(function(){
						$("#atab1").removeAttr("class");
						$("#atab2").attr("class","active");
						$("#atab3").removeAttr("class");
						$("#atab4").removeAttr("class");
						$("#div_favorite").hide();
						$("#div_slb").show();
						$("#div_mobile").hide();
						$("#div_etc").hide();
					});
					$("#atab3").click(function(){
						$("#atab1").removeAttr("class");
						$("#atab2").removeAttr("class");
						$("#atab3").attr("class","active");
						$("#atab4").removeAttr("class");
						$("#div_favorite").hide();
						$("#div_slb").hide();
						$("#div_mobile").show();
						$("#div_etc").hide();
					});
					$("#atab4").click(function(){
						$("#atab1").removeAttr("class");
						$("#atab2").removeAttr("class");
						$("#atab3").removeAttr("class");
						$("#atab4").attr("class","active");
						$("#div_favorite").hide();
						$("#div_slb").hide();
						$("#div_mobile").hide();
						$("#div_etc").show();
					});

					$.ajax({
						url : "/remoteControl/realtimeMonitoring/getSlbList.do",
						type : "post",
						dataType : "json",
						success : function(data){
							var temp = '';
							var label = '';
							var favoriteimg = '';
							var equipimg = '';
							var gpsimg = '';
							var autocallClass = '';
							var w16Class = '';
							var moslb = '';

							var temp1 = "";
							var	temp2 = "";
							var btnState = "";

							
							$.each(data.slblist, function(){
								label = 'label';
								moslb = 'SLB';
								favoriteimg = '';
								equipimg = '';
								gpsimg = '';
								autocallClass = '';
								w16Class = '';
								
								temp1 = "";
								temp2 = "";
								btnState = "";

								if(this.favorite == 'Y'){
									favoriteimg = '/css/images/icon_favorite_full.png';
								}else{
									favoriteimg = '/css/images/icon_favorite.png';
								}

								if(this.w16moduleIdStatus == 1){
									equipimg = '/css/images/green_circle.png';
									w16Class = 'button-state';

									if(this.attconnectionstate == "1") btnState = "button-state";
									temp1 += "<div class='vcpTcp button-div "+btnState+"'><input type='hidden' name='portNumber' value='"+this.portNumber+"'>"+this.devicePlatform+"</div>"
									
									btnState = "";

									if(this.dmconnectionstate == "1") btnState = "button-state";
									temp2 += "<div class='button-div "+btnState+"'>DM</div>"
									
								}
								if(this.autocallstate == 1){
									equipimg = '/css/images/red_circle.png';
									autocallClass = 'button-state';
								}else{
									equipimg = '/css/images/basic_circle.png';
								}

								if(this.gpsConnect == "2"){
									gpsimg = '/css/images/blue_circle.png';
								}else{
									gpsimg = '/css/images/basic_circle.png';
								}

								temp = '<li class="accordiondevice"><div class="onelinediv1"><h4>'+this.mac+'</h4></div>'+
								'<div class="onelinediv2"><img id="equipstatus_circle" src="'+equipimg+'">'+
								'<img id="realmonitoring_circle" src="'+gpsimg+'">'+
								'<img id="favorite_btn" src="'+favoriteimg+'" name="'+this.slbid+'" onclick="favoriteClick(this);">'+
								'</div></li>'+
									'<li class="content-style">'+
										  '<div id="device-list" class="newdevice-list" onclick="getSlbInfo(this);">'+
											'<div class="device-label">'+
											'<h4 class="'+label+'">'+
											'</h4></div>'+
											'<div class="device-label"><h4>'+this.mac+'</h4></div>'+
										  '</div>'+
										  '<div id="device-slbid" class="'+this.equipType+'" style="display: none;">'+this.slbid+'</div>'+
										  '<div class="newdevice-status">'+
										   '<div class="device-w16moduleIdStatus3" style="display: none;">'+this.w16moduleIdStatus+'</div>'+
										   '<div class="device-w16moduleIdStatus4 '+w16Class+' button-div button-div-width70 button-div-left5">'+ moslb +'</div>'+
										   '<div class="dmconnectionstateDiv button-div-width40" style="float: left; margin: 0 3px 0 3px;"> ' + temp1 + ' </div>'+
										   '<div class="attconnectionstateDiv button-div-width40" style="float: left;"> ' + temp2 + ' </div>'+
										   '<div class="device-autocallstate3" style="display: none;">'+this.autocallstate+'</div>'+
										   '<div class="device-autocallstate4 '+autocallClass+' button-div button-div-width70 button-div-left5" style="clear: both;">TEST</div>'+
										  '</div>'+
										 '</li>'

								if(this.favorite == "Y"){
									$("#div_favorite").append(temp);
								}

								$("#div_slb").append(temp);
							});
							
							$.each(data.mobilelist, function(){
								label = 'mobilelabel';
								moslb = 'Mobile';
								favoriteimg = '';
								equipimg = '';
								gpsimg = '';
								autocallClass = '';
								w16Class = '';
								
								temp1 = "";
								temp2 = "";
								btnState = "";

								if(this.favorite == 'Y'){
									favoriteimg = '/css/images/icon_favorite_full.png';
								}else{
									favoriteimg = '/css/images/icon_favorite.png';
								}

								if(this.w16moduleIdStatus == 1){
									equipimg = '/css/images/green_circle.png';
									w16Class = 'button-state';							
								}

								if(this.autocallstate == 1){
									equipimg = '/css/images/red_circle.png';
									autocallClass = 'button-state';
								}else{
									equipimg = '/css/images/basic_circle.png';
								}

								if(this.gpsConnect == "2"){
									gpsimg = '/css/images/blue_circle.png';
								}else{
									gpsimg = '/css/images/basic_circle.png';
								}

								temp = '<li class="accordiondevice"><div class="onelinediv1"><h4>'+this.mac+'</h4></div>'+
								'<div class="onelinediv2"><img id="equipstatus_circle" src="'+equipimg+'">'+
								'<img id="realmonitoring_circle" src="'+gpsimg+'">'+
								'<img id="favorite_btn" src="'+favoriteimg+'" name="'+this.slbid+'" onclick="favoriteClick(this);">'+
								'</div></li>'+
									'<li class="content-style">'+
										  '<div id="device-list" class="newdevice-list" onclick="getSlbInfo(this);">'+
											'<div class="device-label">'+
											'<h4 class="'+label+'">'+
											'</h4></div>'+
											'<div class="device-label"><h4>'+this.mac+'</h4></div>'+
										  '</div>'+
										  '<div id="device-slbid" class="'+this.equipType+'" style="display: none;">'+this.slbid+'</div>'+
										  '<div class="newdevice-status">'+
										   '<div class="device-w16moduleIdStatus3" style="display: none;">'+this.w16moduleIdStatus+'</div>'+
										   '<div class="device-w16moduleIdStatus4 '+w16Class+' button-div button-div-width70 button-div-left5">'+ moslb +'</div>'+
										   '<div class="dmconnectionstateDiv button-div-width40" style="float: left; margin: 0 3px 0 3px;"> ' + temp1 + ' </div>'+
										   '<div class="attconnectionstateDiv button-div-width40" style="float: left;"> ' + temp2 + ' </div>'+
										   '<div class="device-autocallstate3" style="display: none;">'+this.autocallstate+'</div>'+
										   '<div class="device-autocallstate4 '+autocallClass+' button-div button-div-width70 button-div-left5" style="clear: both;">TEST</div>'+
										  '</div>'+
										 '</li>'

								if(this.favorite == "Y"){
									$("#div_favorite").append(temp);
								}

								$("#div_mobile").append(temp);

							});



							var acc = document.getElementsByClassName("accordiondevice");
							var i;

							for (i = 0; i < acc.length; i++) {
								acc[i].addEventListener("click",  function() {
									/* Toggle between adding and removing the "active" class,
									to highlight the button that controls the panel */
									this.classList.toggle("active");

									 /* Toggle between hiding and showing the active panel */
									 var panel = this.nextElementSibling;
									 if (panel.style.display === "block") {
										 panel.style.display = "none";
									}  else {
										 panel.style.display = "block";
									}
								});
							}
							
							$.each($("#div_favorite .accordiondevice"), function(i){
								this.style.display = 'none';
							});
							$.each($("#div_favorite .content-style"), function(i){
								this.style.display = 'block';
							});
							
							
							if(clickFlag){
								clickFlag = false;
								$("#div_favorite").find("#device-list").click();
							}
							

							loadingEnd();
							

							if (self.options.interval) {
								if (self.timer != null) {
									clearInterval(self.timer);
								}

								self.timer = setInterval(function () {
									clickFlag = true;
									intervalFlag = true;
									self.setInfo();
								}, self.options.interval);
							}
							

						},
						error : function(error, request, status){
							console.log(error);
							loadingEnd();
						}
					});


				},
				error: function () {
				}
		});



		this._trigger('willupdate', null, this);
	
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		// var w = Math.max(parseInt(this.element.parent().innerWidth(), 10), this.options.minWidth);
		var agent = navigator.userAgent.toLowerCase();
 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			if(this.element.parent().parent().find(".item-header").length > 0){
				var h = this.element.parent().parent().parent().parent().parent().innerHeight() - 80;
				this.element.height(h);
			}
		}
	}

});
//});

},{}],12:[function(require,module,exports){
var scope = window;
var LINE_CHART_IDX = 0;
$.widget('iui.charttimeseries', {
	_create: function () {
		var self = this;
		
		var w = $(this.element).parent().parent()
				.innerWidth()-10;
		var h = $(this.element).parent().parent()
				.innerHeight()-10;


		var chart;
		chart = new Highcharts.StockChart({
			credits:{ 
				enabled:false 
			},
			chart: {
					renderTo: self.element.attr("id"),
					zoomType: 'x'
			},
			rangeSelector : {
				inputEnabled:false,
				buttonTheme: {
					visibility: 'hidden'
				},
				labelStyle: {
					visibility: 'hidden'
				}
			},
			title: self.options.item.label,
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%d %H:%M'
				}
			},
			yAxis: [
				{ // Primary yAxis
					title: {
							text: 'RF Information'
					},
					opposite : false
				}
			],
			legend: {
				enabled: true
			},
			plotOptions: {
				series: {
					borderWidth: 0
				}
			},
			tooltip: {
				shared: true,
				crosshairs: true,
				pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b> : {point.y:,.2f}<br>',
				xDateFormat : "%Y-%m-%d, %H:%M:%S",
				dateTimeLabelFormats : {
				  millisecond:"%Y-%m-%d, %H:%M:%S",
				  second:"%Y-%m-%d, %H:%M:%S",
				  minute:"%Y-%m-%d, %H:%M:%S",
				  hour:"%Y-%m-%d %H",
				  day:"%Y-%m-%d",
				  week:"%Y-%m-%d",
				  month:"%Y-%m",
				  year:"%Y"	 
				}
			}
		});


		chart.setSize(w, h);
		self.chart = chart;
		self.element.append(chart.element);
		self._trigger('willmount', null, self);
		chart = null;
		ajaxData = null;

		if(self.options.item.interval){
			if(self.timer != null){
				clearInterval(self.timer);
			}
			self.timer = setInterval(function () {
				self.refresh();
			}, self.options.item.interval);
		}
	},

	_destroy: function () {
		clearInterval(this.timer);
	},
	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();

		/*
		if(value == this.options.item.data){
			this.refresh();
		}
		*/
	},
	refresh: function () {
		var params = this.options.params || {};
		var self = this;

		if(typeof(params) != "undefined"){
			if(params.substring(params.lastIndexOf("&"),params.length).replace(/&equipType=/gi,"") == "0"){ //slb

				var len = this.chart.series.length;

				for(var i = 0; i < len; i++){
					this.chart.series[0].remove(true);
				}

				this.chart.addSeries({
					name: 'Tx.Power'
				});
				this.chart.addSeries({
					name: 'RSSI'
				});
				this.chart.addSeries({
					name: 'RSRP'
				});
				this.chart.addSeries({
					name: 'RSRQ'
				});
				this.chart.addSeries({
					name: 'Ecio'
				});
				this.chart.addSeries({
					name: 'SINR'
				});
				
				if(params.substring(params.indexOf("portNumber="),params.lastIndexOf("&")).replace(/portNumber=/gi,"") == "0"){ //portNumber == 0
					var ajaxData = [{"graphInfo":[{"nadTxPower":"", "nadRssi":"", "nadRsrp":"", "nadRsrq":"", "nadEcIo":"", "nadSinr": ""}]}];
					self.load(ajaxData[0]);
				}else{
					$.ajax({
						url: self.options.item.data,
						dataType: "json",
						type: "post",
						data: params,
						success: function (ajaxData) {
							self.load(ajaxData);
						},
						error: function(error, request, status){
							console.log(error);
						}
					});
				}
			}else{ //else slb
			
				var len = this.chart.series.length;

				for(var i = 0; i < len; i++){
					this.chart.series[0].remove();
				}


				this.chart.addSeries({
					name: 'RSSI'
				});
				this.chart.addSeries({
					name: 'RSRP'
				});
				this.chart.addSeries({
					name: 'RSRQ'
				});
				this.chart.addSeries({
					name: 'SINR'
				});

				$.ajax({
						url: self.options.item.data,
						dataType: "json",
						type: "post",
						data: params,
						success: function (ajaxData) {
							self.load(ajaxData);
						},
						error: function(error, request, status){
							console.log(error);
						}
				});


			}
		}

		
		
		this._trigger('willupdate', null, self);
	},


	/**
	 * 데이터 추가
	 */
	load: function (ajaxData) {
		var self = this;
		if(ajaxData.equipType == "0"){
			this.chart.series[0].setData(ajaxData.graphInfo.nadTxPower);
			this.chart.series[1].setData(ajaxData.graphInfo.nadRssi);
			this.chart.series[2].setData(ajaxData.graphInfo.nadRsrp);
			this.chart.series[3].setData(ajaxData.graphInfo.nadRsrq);
			this.chart.series[4].setData(ajaxData.graphInfo.nadEcIo);
			this.chart.series[5].setData(ajaxData.graphInfo.nadSinr);
		}else if(ajaxData.equipType == "1"){
			this.chart.series[0].setData(ajaxData.MobilegraphInfo.nadPRssi);
			this.chart.series[1].setData(ajaxData.MobilegraphInfo.nadPRsrp);
			this.chart.series[2].setData(ajaxData.MobilegraphInfo.nadPRsrq);
			this.chart.series[3].setData(ajaxData.MobilegraphInfo.nadPSinr);
		}

		

	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		this.chart.destroy();
	},

	/**
	 * 크기 변경
	 */
	resize: function () {
		var agent = navigator.userAgent.toLowerCase();


		var w = $(this.element).parent().parent()
				.innerWidth()-10;
		var h = $(this.element).parent().parent()
				.innerHeight()-10;

		this.chart.setSize(w, h);
	}
});

},{}],13:[function(require,module,exports){
var PIE_CHART_IDX = 0;
$.widget('iui.charttreemap', {
	options: {
		minWidth: 200,
		minHeight: 200
	},
	_setOption: function (key, value) {
		this._super(key, value);
		if(this.options.params == "refresh" || this.element.parent().find("."+this.options.params).length > 0){
			this.refresh();
		}
	},
	_create: function () {
		var self = this;
		
		var parent = this.element;
		$(parent).height(500);
		
		var chart_treemap = echarts.init(parent[0]);
		var chart_treemap_option = {
			series : [ {
				type : 'treemap',
				data : [ {
					name : 'nodeA', // First tree
					value : 10,
					children : [ {
						name : 'nodeAa', // First leaf of first tree
						value : 4
					}, {
						name : 'nodeAb', // Second leaf of first tree
						value : 6
					} ]
				}, {
					name : 'nodeB', // Second tree
					value : 20,
					children : [ {
						name : 'nodeBa', // Son of first tree
						value : 20,
						children : [ {
							name : 'nodeBa1', // Granson of first tree
							value : 20
						} ]
					} ]
				} ]
			} ]
		};

		chart_treemap.setOption(chart_treemap_option);

		self.chart = chart_treemap;
	},
	_destroy: function () {
		clearInterval(this.timer);
	},

	refresh: function () {
		var params = this.options.params || {};
		var self = this;

		this._trigger('willmount', null, this);
	},


	/**
	 * 데이터 추가
	 */
	load: function (value) {
		this.chart.load({
			columns: value
		});
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		this.chart.unload('value')
	},

	/**
	 * 크기 변경
	 */
	resize: function () {
		if(this.chart) {
			this.chart.resize();
		}
	}
});
//});

},{}],14:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {

//var scope = window;

//지역 변수
var DASHBOARD_ITEM_GROUP_ID = 0;

$.widget('iui.dashboarditems', {
	// 클래스 멤버
	// default options
	options: {
		id: 'itemgroup0',
		label: '아이템 리스트',
		description: '사용하실 위젯을 선택하여 주세요.',
		items: [],
		rollover: $.noop,
		rollout: $.noop,
		change: $.noop
	},

	_create: function () {
		// 인스턴스 참조
		var self = this;
		// 인스턴스 멤버 변수
		self.idx = DASHBOARD_ITEM_GROUP_ID++;
		self.checkboxes = {};

		if (self.options.data) {
			$.ajax({
				url: self.options.data,
				data: {},
				type: "GET",
				dataType: "json"
			})
			.done(function (data, textStatus, jqXHR) {
				// 인스턴스 멤버 변수 세팅
				self.options = $.extend(self.options, data);
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				if (console && console.log) {
				}
			})
			.always(function () {
				// 클래스 멤버 메소드 호출
				self.render();
			});
		}

		// 클래스 멤버 메소드 호출
		self._trigger('willmount', null, this);
	},

	_onRollOver: function (e, data) {
		this._trigger('rollover', e, data);
	},

	_onRollOut: function (e, data) {
		this._trigger('rollout', e, data);
	},

	render: function () {
		var self = this;
		var header = $('<h3 class="green"></h3>')
		.text(self.options.label);
		$('<small></small>')
		.text(' - ' + self.options.description)
		.appendTo(header);
		var ctrl = $('<div></div>')
		.appendTo(header);
		self.ctrlToggleAll = $('<input type="checkbox" class="choose-widget" id="iui_db_wg_' + self.idx + '"/>')
		.on('change', function (e) {
			self._toggleWholeItem.call(self, e);
		})
		.appendTo(ctrl);
		$('<label for="iui_db_wg_' + self.idx + '">전체선택</label>')
		.appendTo(ctrl);
		var contents = $('<ul></ul>')
		.addClass('widget-group');
		var li, ch;
		$.each(self.options.items, function (i, item) {
			li = $('<li></li>')
			.on('mouseover', function(e){self._onRollOver.call(self, e, item);})
			.on('mouseout', function(e){self._onRollOut.call(self, e, item);})
			.appendTo(contents);
			ch = $('<input type="checkbox" class="choose-widget iui-db-wg-' + self.idx + '" name="iui_db_wg_' + self.idx + '" id="iui_db_wg_' + self.idx + '_' + i + '"/>')
			.attr('data-dashboard-item', item.id)
			.on('change', function (e) {
				self._changeState(e);
			})
			.data('data-iui-dashboard-widget-item', item)
			.appendTo(li);
			self.checkboxes[item.id] = ch;
			$('<label for="iui_db_wg_' + self.idx + '_' + i + '"></label>')
			.text(item.label)
			.appendTo(li);
		});
		self.element
		.addClass('iui-dashboard-items')
		.append(header)
		.append(contents);
		header = ctrl = contents = li = ch = null;
	},

	_destroy: function () {
		this.element
		.removeClass('iui-dashboard-items')
		.empty();
	},

	_isCheckedAll: function () {
		var length = 0;
		var chmap = $.map(this.checkboxes, function (c) {
			length++;
			return c.prop('checked') ? c : null;
		});
		try{
			return length === chmap.length;
		}finally{
			length = chmap = null;
		}
	},

	toggleItem: function (item, checked, trigger) {
		if (this.checkboxes[item]) {
			if (this.checkboxes[item].checked === checked) {
				return;
			}
			trigger = trigger === false ? false : true;
			this.changeItemState(this.checkboxes[item], checked, trigger);
		}
	},

	changeItemState: function (checkbox, checked, trigger) {
		checkbox = $(checkbox);
		checkbox.prop('checked', checked);
		var item = checkbox.data('data-iui-dashboard-widget-item');
		item.checked = checked;
		this.ctrlToggleAll.prop('checked', this._isCheckedAll());
		if (trigger !== false) {
			this._trigger('change', null, item);
		}
	},

	_changeState: function (e) {
		this.changeItemState(e.target, e.target.checked);
	},

	toggleAll: function (checked, trigger) {
		var self = this;
		trigger = trigger === false ? false : true;
		$.each(self.checkboxes, function () {
			// this == context
			if (checked && this.prop('checked')) {
				return;
			}
			self.changeItemState(this, checked, trigger);
		});
		self.ctrlToggleAll.prop('checked', checked);
		self = null;
	},

	_toggleWholeItem: function (e) {
		this.toggleAll(e.target.checked);
	}
});
//});

},{}],15:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {

var scope = window;
var TABLE_CHART_IDX = 0;
$.widget('iui.chartmap', {
	_create: function () {
		var self = this;
		
		self.element.empty().loadTemplate(self.options.template, {} , {
			success: function () {
				self.load();
			},
			complete: function () {
			},
			error: function () {
			}
		});

		//self.refresh();
		self._trigger('willmount', null, self);
		
		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () {
				self.refresh();
			}, self.options.interval);
		}
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },
	refresh: function () {
		loadingStart();

		var params = this.options.params || {};
		
		var self = this;

		var equipType = params.substring(params.lastIndexOf("&"),params.length).replace(/&equipType=/gi,"");
		
		params = "slbid="+selectSlbid+"&equipType="+equipType;

		requestAsyncParameterMapMarkers(params);
		
		this._trigger('willupdate', null, this);
	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function (value) {
		var params = this.options.params || {};

		var self = this;
		
		self.element.empty().loadTemplate(self.options.template, value, {
			success: function () {
				
				var temp = "<div id='mainContent' class='hidden' style='width: 100%; height: 100%;'></div>";
				self.element.append(temp);

				
				setGridColumns();
				_initialize();
				//getStartEndTime();


				// dashboard table 에 height 을 주기위해 지도만 따로 100% 넣어줌 
				$($(".widget-body")[1]).children().height("100%");
				map4.resize();
				
				dashboardWidgetIdx++;
				if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
					loadingEnd();
				}

			},
			complete: function () {
			},
			error: function () {
			}
		});

		self = null;
	},

	/**
	 * 데이터 삭제
	 */
	unload: function () {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		var self = this;
				
		map4.resize();
		// var w = Math.max(parseInt(this.element.parent().innerWidth(), 10), this.options.minWidth);
		var agent = navigator.userAgent.toLowerCase();
 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			if(this.element.parent().parent().find(".item-header").length > 0){
				var h = this.element.parent().parent().parent().parent().parent().innerHeight() - 80;
				this.element.height(h);
			}
		}

	}

});
//});

},{}],16:[function(require,module,exports){

var DASHBOARD_MODAL_IDX = 0;
$.widget('iui.modal', {

 options: {
  title: 'modal window title',
  description: 'modal window descriptions ',
  minWidth: 200,
  minHeight: 200,
  width: 300,
  height: 200,
  buttons: {
   close: '취소',
   save: '저장'
  },
  close: function (e) {
   console.log('modal close event default handler.');
  },
  confirm: function (e) {
   console.log('modal confirm default handler.');
  }
 },

 _create: function () {
  this.id = 'iuiModal_' + DASHBOARD_MODAL_IDX++;
  this.refresh();
  this._trigger('willmount', null, this);
 },

 _setOption: function (key, value) {
  this._super(key, value);
 },

 _setOptions: function (options) {
  this._super(options);
  this.refresh();
 },

 refresh: function () {
  var self = this;
  this._trigger('willupdate', null, this);

  this.element = $(this.element)
   .show()
   .detach();

  this.panel = this.panel || $('<div></div>')
   .addClass('panel');

  if (!this.header) {
   this.header = $('<div></div>')
    .addClass('panel-header')
    .appendTo(this.panel);

   $('<span></span>')
    .addClass('icon_remove')
    .wrap('<a></a>')
    .parent()
    .css('display', 'block')
    .wrap('<div></div>')
    .parent()
    .addClass('panel-btns')
    .appendTo(this.header);

   $('<h3></h3>')
    .text(this.options.title)
    .appendTo(this.header);

   $('<p></p>')
    .text(this.options.description)
    .appendTo(this.header);
  }

  if (this.footer) {
   this.footer.detach();
  }
  else {
   this.footer = $('<div></div>')
    .addClass('panel-footer')
    .css('text-align', 'right');

   this.btnConfirm = $('<button type="button"></button>')
    .addClass('rokaf-btn btn-blue')
    .text(this.options.buttons.save)
    .on('click', function (e) {
     var inputs = {
      name: $('#input_new_layout_name', self.element)
       .val()
     }
     self._trigger('confirm', e, inputs);
    })
    .appendTo(this.footer);

   this.btnClose = $('<button type="button"></button>')
    .addClass('rokaf-btn')
    .text(this.options.buttons.close)
    .on('click', function (e) {
     self.modal.hide();
     self._trigger('close');
    })
    .appendTo(this.footer);
  }

  this.bodies = this.bodies || $(this.element);
  this.bodies.each(function (i, el) {
   self.panel.append(this);
  });

  this.panel.append(this.footer);

  this.modal = this.model || this.panel.wrap('<div></div>')
   .parent()
   .addClass('modal-content')
   .wrap('<div></div>')
   .parent()
   .addClass('modal-dialog small')
   .wrap('<div></div>')
   .parent()
   .addClass('modal');

  $('body').append(this.modal);
  var marginTop =  (this.modal.innerHeight() - this.panel.outerHeight()) / 2;
  this.panel.css({'margin-top': marginTop + 'px'});
  if (this.options.autoShow) {
   this.modal.show();
  }
 },
 close: function(e){
  // console.log('modal closed manualy.... from outside');
  this.modal.hide();
  this._trigger('close');
 }
});
// });

},{}],17:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery', 'd3', 'c3'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {

var scope = window;
var TABLE_CHART_IDX = 0;
$.widget('iui.chartparametermap', {
	_create: function () {
		var self = this;
		
		self.element.empty().loadTemplate(self.options.template, {} , {
			success: function () {
				self.refresh();
				
				
				self.element.parent().parent().parent().parent().parent().bind("click",function(){
					$("#tab2").click();
					//$("#map_tree").show();
					//$("#grid_tree").hide();
					treeType = "mapTree";
				});
			},
			complete: function () {
			},
			error: function () {
			}
		});

		//self.refresh();
		self._trigger('willmount', null, self);

		if (self.options.interval) {
			if (self.timer != null) {
				clearInterval(self.timer);
			}

			self.timer = setInterval(function () { 
				self.refresh();
			}, self.options.interval);
		}
	},
	_parseColumns: function () {
		var columns = {};
		$.each(this.options.columns, function (i) {
			var key = this[0];
			columns[key] = [];
			for (var i = 1, l = this.length; i < l; i++) {
				columns[key].push(this[i]);
			}
		});
		try{
			return columns;
		}finally{
			columns = null;
		}
	},

	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		this.refresh();
	},

	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },
	refresh: function () {
		var params = this.options.params || {};
		
		$(this.element)
		.flowtype({
			minFont: 12,
			maxFont: 40,
			fontRatio: 40
		});

		var self = this;

		self.load();
		dashboardWidgetIdx++;
		if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
			loadingEnd();
		}
		params = null;
		ajaxData = null;

		this._trigger('willupdate', null, this);
	},

	_destroy: function () {
		clearInterval(this.timer);
	},

	/**
	 * 데이터 추가
	 */
	load: function () {
		var params = this.options.params || {};

		var self = this;
		
		self.element.empty().loadTemplate(self.options.template, {}, {
			success: function () {

				
				var temp = "<div id='mainContent' class='hidden' style='width: 100%; height: 100%;'></div>";
				self.element.append(temp);

				
				setGridColumns();
				_initialize();
				getStartEndTime();


				// dashboard table 에 height 을 주기위해 지도만 따로 100% 넣어줌 
				$("#mainContent").parent().parent().height("100%");
				map2.resize();


			},
			complete: function () {
			},
			error: function () {
			}
		});

		self = null;
	},

	/**
	 * 데이터 삭제
	 */
	unload: function () {},

	/**
	 * 크기 변경
	 */
	resize: function () {
		var self = this;


		map2.resize();
		//google.maps.event.trigger(self.map, "resize");


		
		// var w = Math.max(parseInt(this.element.parent().innerWidth(), 10), this.options.minWidth);
		var agent = navigator.userAgent.toLowerCase();
 
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			if(this.element.parent().parent().find(".item-header").length > 0){
				var h = this.element.parent().parent().parent().parent().parent().innerHeight() - 80;
				this.element.height(h);
			}
		}
/*
		var w = this.element.parent().parent()
				.innerWidth()-10;
		var h = this.element.parent().parent()
				.innerHeight()-40;

		this.chart.setSize(w, h);
*/
	}

});
//});

},{}],18:[function(require,module,exports){
//(function (factory) {
//if (typeof define === 'function' && define.amd) {
//define(['jquery'], factory);
//}
//else {
//factory(jQuery);
//}
//})(function ($) {

function isElement(o) {
	return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	);
}

var DASHBOARD_WIDGET_ID = 0;
var DASHBOARD_ITEM_ID = 0;

$.widget('iui.dashboardwidget', {
	options: {
		activetab: 0,
		id: 'iui_widget_',
		items: [{
			id: 'iui_dashboard_widget_item_',
			label: 'IUI DASHBOARD WIDGET LABEL',
			type: 'barchart',
			data: 'data/fake-data.json'
		}]
	},


	_create: function () {
		this.options.id = 'iui_widget_' + DASHBOARD_WIDGET_ID++;
		var container = $('<div></div>')
		.addClass('grid-stack-item-content gray-scroll');
		var widget = $('<div></div>')
		.addClass('widget-panel');
		container.append(widget)
		.appendTo(this.element) 
		.parent()
		.append(this._controls());
		// this.element.append(widget); 
		this.ui = widget;
		this.refresh();

		// options에 미리 등록되는 이벤트 핸들러
		this._trigger('willmount', null, this.element);
	},


	_setOption: function (key, value) {
		if (key === "activetab") {
			if (isElement(value)) {
				this._selectTap(value);
			}
			else {
				if (typeof value == 'number') {
					var lis = $('.rokaf-nav-tab > li', this.element);
					value = lis.get(value);
					this._selectTap(value);
				}
			}
		}
		this._super(key, value);
	},


	// _setOptions: function (options) {
	//  this._super(options);
	//  this.refresh();
	// },


	items: function (items) {
		if (items === undefined) {
			return this.options.items;
		}
		// TODO 필수 조건이 만족하는 것만 리스트에 추가
		this.options.items = items;
		this.refresh();
	},


	refresh: function () {
		var widget = this.ui;
		var header = widget.find('.widget-header');
		if (header.length === 0) {
			header = $('<div></div>')
			.addClass('widget-header ui-draggable-handle');
		}
		var body = widget.find('.widget-body');
		if (body.length === 0) {
			
			if(this.options.type === "group"){
				body = $('<div></div>')
				.addClass('widget-body group')
			/*
			}else if(this.options.items[0].template.indexOf('device_list') > -1){
				body = $('<div></div>')
				.addClass('widget-body device-list')
			*/
			}else{
				body = $('<div></div>')
				.addClass('widget-body')
			}
		}

		// TODO 변경이 필요한 탭만을 변경할 수 있는 방법을 찾아라.
		header.empty();
		body.empty();
		header.append(this._header());
		body.append(this._body());
		widget.append(header)
		.append(body);

		this._resizeChart(this.element);

		// 위겟 생성(_create) 이후에 bind되어 업데이트 시에만 동작한다.
		this._trigger('willupdate', null, this.element);
		body = header = widget = null;
	},

	_resizeChart: function (widget) {
		$('.iui-dashboard-chart', widget)
		.each(function (i, chart) {
			chart = $(chart);
			var name = 'chart' + chart.data('chart');
			// console.log(chart[name]);
			if (chart[name]) {
				try {
					(chart[name])('resize');
				}
				catch (e) {}
				finally{
					name = null;
				}
			}
		});
	},

	_selectTap: function (value) {
		if(this.options.type == null || this.options.type == "tab"){
			value = $(value);
			var item = value.data('_widget_item');
			value.parent()
			.children()
			.removeClass('active');
			value.addClass('active');
			$('.tab-panel.active', this.element)
			.removeClass('active');

			var c = $('#' + this.options.id + '_' + item.id, this.element)
			.addClass('active');
			this._resizeChart(c);
			item = c = null;
		}
	},


	_header: function () {
		var self = this;
		var tabs = $('<h3>'+this.options.label+'<small class="headerSmall"></small></h3>');

		try{
			return tabs;
		}finally{
			tabs = self = null;
		}
	},


	_body: function () {
		var self = this;
		var tabs = [];

		if(this.options.type != null && this.options.type == "group"){
			$.each(this.options.items, function () {
				var container = $(this.el);
				if(self.options.rotate == null || self.options.rotate === "horizon"){
					if (!container.hasClass('widget-list')) {
						this.el = container = $('<ul></ul>');
					}
				}else if(self.options.rotate === "vertical"){
					this.el = container = $('<ul height="'+this.height+'"></ul>');
				}
				tabs.push(container);

				if(self.options.rotate == null || self.options.rotate === "horizon"){
					return false;
				}
				
			});
		}else{
			$.each(this.options.items, function () {
				var container = $(this.el);
				if (!container.hasClass('widget-list')) {
					this.el = container = $('<div id="' + self.options.id + '_' + this.id + '"></div>')
					.addClass('widget-list list-style3');
					// .css('padding-top', 40+'px');
				}
				tabs.push(container);
			});
			$(tabs[this.options.activetab]);
		}
		try{
			return tabs;
		}finally{
			tabs = [];
			tabs = self = null;
		}
	},


	_controls: function () {
		var self = this;
		var controls = [];

		var btnClose = $('<div class="ui-resizable-handle widget-btn close iui-btn-close"><a href="#" class="fa fa-times"></a></div>');
		btnClose.click(function (e) {
			self._trigger('close', null, this)
		});

		var btnMinMax = $('<div class="ui-resizable-handle widget-btn widget-size iui-btn-toggle-minmax"><a href="#" class="fa fa-expand"></a></div>');
		btnMinMax.click(function (e) {
			self._trigger('togglesize', null, this)
		});

		var btnLock = $('<div class="ui-resizable-handle widget-btn lock iui-btn-toggle-lock"><a href="#" class="fa fa-lock"></a></div>');
		btnLock.click(function (e) {
			self._trigger('togglelock', null, this)
		});
		
		if($(location).attr('href').indexOf('dashboard/dashboard/openDashboard') > 0){
			controls.push(btnClose);
			//controls.push(btnLock);
		}

		controls.push(btnMinMax);

		try{
			return controls;
		}finally{
			controls = [];
			controls = null;
		}
	},


	_constrainItems: function (items) {
		var self = this;
		return $.map(items, function () {
			var idx = DASHBOARD_ITEM_ID++;
			this.id = this.id || 'item_' + idx;
			this.label = this.label || 'Item ' + idx;
			this.data = this.data || [];
			this.type = this.type || 'table';
			return this;
		});
	}
});
//});

},{}],19:[function(require,module,exports){
var scope = window;
var BAR_CHART_IDX = 0;
var topologyTimer;
var topologyBrushTimer;
var editNode;

$.widget('iui.charttopology', {
	options: {},
	_create: function () {
		// this.element.append('<div>Topology</div>');
		var charttopology;
		var bg = "";
		var iconList = [];
		var nodeData = [];
		var edgeData = [];
		this.chart = charttopology;
		var topologyId = this.element.attr("id");
		this.element.width(1771);
		this.element.height(1672);
		var _self = this;
		_self.activeNode = null;
		_self.nodeId = "ALL";
		_self.beforeNodeId = "";
		_self.first = true;
		_self.editMode = false;

		jui.ready([ "ui.dropdown" ], function(dropdown) {
			rmenu = dropdown("#dd_2", {
				event: {
					change: function(data) {
						if(data.value == "all"){
							_self.nodeId = "ALL";			
							_self.first = true;
							_self.refresh();
						}
					}
				}
			});
		});

		jui.ready(["chart.builder", "util.base"], function (builder, _) {
			topology_content = builder($(_self.element), {
				svgbg: bg, //백그라운드 이미지
				padding: 5,
				axis: {
					c: {
						type: "topologytable"
					},
					data: nodeData, //노드 data
					data2: edgeData //회선 data
				},
				brush: {
					type: "topologynode",
					isEdit: false,
					nodeImage: function (data) {
						var equipmentJsonData = null;
						if(data.typeId == null || data.typeId == ""){
							switch(data.farmType){
								case "HOUSE_TYPE1" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 72, imageHeight : 42};	
									break;
								case "HOUSE_TYPE2" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 68, imageHeight : 48};	
									break;
								case "HOUSE_TYPE3" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 172, imageHeight : 48};	
									break;
								case "HOUSE_TYPE4" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 68, imageHeight : 50};	
									break;
								case "HOUSE_TYPE5" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 68, imageHeight : 50};	
									break;
								case "HOUSE_TYPE6" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 68, imageHeight : 50};	
									break;
								case "HOUSE_TYPE7" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 70, imageHeight : 48};	
									break;
								case "HOUSE_TYPE8" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 172, imageHeight : 50};	
									break;
								case "HOUSE_TYPE9" :
									equipmentJsonData = {imagePath : "/images/icon/"+data.farmType+".png", imageWidth : 172, imageHeight : 50};	
									break;
								default :
									equipmentJsonData = {imagePath : "/images/icon/HOUSE_TYPE1.png", imageWidth : 72, imageHeight : 42};	
									break;
							}							
						}else{
							$.each(iconList,function(){
								if(this.typeId == data.typeId){
									equipmentJsonData = {imagePath : this.imageFilePath, imageWidth : this.imageWidth, imageHeight : this.imageHeight};
									return false;
								}
							});

							if(equipmentJsonData == null){
								equipmentJsonData = {imagePath : "/images/icon/default.png", imageWidth : 60, imageHeight : 54};
							}
						}
						try{
							return equipmentJsonData;
						}finally{
							equipmentJsonData = null;
						}
					},
					nodeData: nodeData,
					edgeData: edgeData,
					edgeText: function (data, align) {
						var text = data.id;

						return text;
					},
					tooltipTitle: function (data, align) {
						return data.name;
					},
					tooltipText: function (data) {
						var tooltip = "";
						tooltip = data.name;
						return tooltip;
					},
					nodeTitle: function (data) {
						return data.title;
					}
				},
				widget: [
				         {
				        	 type: "topologyctrl",
				        	 zoom: true,
				        	 move: true
				         }
				         ],
				         style: {
				        	 topologyNodeRadius: 20 //노드 반지름 크기
				         },
				         event: {
				        	 mouseover: function (obj, e) {
				        	 },
				        	 "topology.onmousemeveend": function (data, e) {
				        	 },
				        	 "topology.linedblclick": function (data, e) {
				        	 },
				        	 "topology.nodedblclick": function (data, e) {
				        		 if(userType == "ADMIN"){
				        			 //loadingStart();
				        			 _self.currentNode = data;
				        			 _self.activeNode = null;
				        			 if(data.typeId == ""){
				        				 _self.nodeId = data.id;
				        				 _self.first = true;
				        				 _self.refresh();
				        			 }
				        		 }
				        	 },
				        	 "topology.nodeclick": function (data, e) {
				        		 if(!_self.editMode){
				        			 _self.activeNode = data;
				        			 //loadingStart();
				        			 if(data.typeId == ""){
										 farmNo = data.id.replace("farm","");

										 farmChange();
				        			 }
				        		 }
				        	 },
				        	 "topology.edgeconnect": function (data, e) {
				        	 },
				        	 "topology.rclick": function (e) {
								 rmenu.move(e.pageX, e.pageY);
								 rmenu.show();
				        	 },
				        	 "topology.nodeclear": function (e) {
				        		 //_self.activeNode = null;
				        		 //iui.dashboard.setWidgetParams("");
				        	 }
				         }
			});

			topology_content.render();
		});

		$.ajax({
			url : "/topologyMgmt/topologyMgmt/getTopologyInit.do",
			dataType :"json",
			success:function(data){
				iconList = data.iconList;
				_self.refresh();
			},
			error:function(request,status,error){
				console.log(error);
			}
		});

		if(topologyTimer != null){
			clearInterval(topologyTimer);
			topologyTimer = null;
		}

		topologyTimer = setInterval(function () {
			_self.refresh();
		}, _self.options.interval); 

		this._trigger('willmount', null, this);
	},

	_destroy: function () {
		if(topologyTimer != null){
			clearInterval(topologyTimer);
			topologyTimer = null;
		}
	},

	refresh: function () {
		var _self = this;
		if(!_self.editMode){
			/*
			if(topologyBrushTimer != null){
				clearInterval(topologyBrushTimer);
				topologyBrushTimer = null;
			}*/

			$.ajax({
				type:"post",
				url :  _self.options.data,
				dataType :"json",
				data : "topologyId="+_self.nodeId,
				success:function(data){			
					_self.beforeNodeId = data.topologyInfo.parentTopologyId;
					_self.element.width(data.topologyInfo.imageWidth);
					_self.element.height(data.topologyInfo.imageHeight);
					if($(topology_content.svg.root.element).find("image").attr("xlink:href") != data.topologyInfo.imageFilePath){
						topology_content.svgBackground(data.topologyInfo.imageFilePath);
					}

					nodeData = [];
					$.each(data.topologyNodeList,function(){
						nodeData.push({ id: this.nodeId, color : "#aaabac", key: this.nodeId, x:this.nodeX, y:this.nodeY, moveX:this.nodeX, moveY:this.nodeY, name: this.nodeName, state : "", title : "", text : "", typeId: this.typeId, farmType : this.farmType});
					});

					edgeData = [];
					$.each(data.topologyLinkList,function(){
						edgeData.push({id : this.linkId, key : this.aNodeId,state : "",outgoing: [ this.zNodeId]});
					});


					dashboardCurrentState = ""; //현재 최고 장애 등급 변수

					$.each(nodeData,function(){
						var nodeSelf = this;

						$.each(data.eventNodeList,function(){
							if(nodeSelf.id == this.nodeId){
								var state = "";
								if(this.criticalCnt > 0){
									state = "critical";
									dashboardCurrentState = state;
								}else if(this.majorCnt > 0){
									state = "major";
									if(dashboardCurrentState != "critical"){
										dashboardCurrentState = state;
									}
								}else if(this.minorCnt > 0){
									state = "minor";
									if(dashboardCurrentState == ""){
										dashboardCurrentState = state;
									}
								}

								nodeSelf.state = state;
								nodeSelf.stateStat = {critical: this.criticalCnt ,major: this.majorCnt,minor: this.minorCnt};
								state = null;
								return;
							}
						});

						nodeSelf = null;
					});

					topology_content.axis(0).data = null;
					topology_content.axis(0).data2 = null;

					topology_content.axis(0).data = nodeData;
					topology_content.axis(0).data2 = edgeData;

					topology_content.axis(0).cacheXY = [];

					for(var i=0;i<nodeData.length;i++){
						topology_content.axis(0).cacheXY[i] = {
							x: nodeData[i].x,
							y: nodeData[i].y
						};
						topology_content.axis(0).data[i].moveX = nodeData[i].x;
						topology_content.axis(0).data[i].moveY = nodeData[i].y;
					}

					if(nodeData == null || nodeData.length == 0){
						topology_content.axis(0).cacheXY = [];
						topology_content.axis(0).cacheXY = null;
					}

					topology_content.render();
					if(_self.nodeId != "ALL"){
						_self.first = false;
						topology_content.scale(1);
						topology_content.view(0,0);
					}else{
						topology_content.scale(0.4);
						topology_content.view(0,0);
					}

					if(_self.activeNode != null){
						$("#"+_self.activeNode.id +" > circle").attr("stroke" , "blue");
						$("#"+_self.activeNode.id +" > circle").attr("stroke-width" , "4");		
					}

					dashboardWidgetIdx++;

					if(iui.dashboard.widgets.length <= dashboardWidgetIdx){
						loadingEnd();
					}				

					nodeData = null;
					edgeData = null;				
					data = null;				
				},
				error:function(request,status,error){
					console.log(error);
				}
			});
			this._trigger('willupdate', null, this);
			/*
	  setTimeout(function(){
		 _self.refresh();
	  }, _self.options.interval);*/
		}
	},

	/**
	 * 데이터 추가
	 */
	load: function (value) {
		//  this.chart.load({
		//   columns: value
		//  });
	},

	/**
	 * 데이터 삭제
	 */
	unload: function (value) {
		//  this.chart.unload('value')
		if(topologyTimer != null){
			clearInterval(topologyTimer);
		}
	},
	_setOption: function (key, value) {
		// if (key === "params") {
		// }
		this._super(key, value);

		//this.refresh();
	},

	/**
	 * 크기 변경
	 */
	resize: function (status) {
		if(status == "max"){
			this.beforeScale = topology_content.scale();
			topology_content.scale(1);
		}else if(status == "min"){
			topology_content.scale(this.beforeScale);
		}else{
			var h = $(topology_content.root).height() * $(topology_content.root).parent().width() / $(topology_content.root).width();
		}
	}
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2pzL2Rhc2hib2FyZDAuanMiLCJzcmMvanMvaXVpLmNoYXJ0LmJhci5qcyIsInNyYy9qcy9pdWkuY2hhcnQuY29sdW1uLmpzIiwic3JjL2pzL2l1aS5jaGFydC5ncmlkLmpzIiwic3JjL2pzL2l1aS5jaGFydC5oaWdobWFwcy5qcyIsInNyYy9qcy9pdWkuY2hhcnQubGluZS5qcyIsInNyYy9qcy9pdWkuY2hhcnQubWVzc2FnZWdyaWQuanMiLCJzcmMvanMvaXVpLmNoYXJ0Lm1lc3NhZ2V0YWJsZS5qcyIsInNyYy9qcy9pdWkuY2hhcnQucGllLmpzIiwic3JjL2pzL2l1aS5jaGFydC50YWJsZS5qcyIsInNyYy9qcy9pdWkuY2hhcnQudGFidGFibGUuanMiLCJzcmMvanMvaXVpLmNoYXJ0LnRpbWVzZXJpZXMuanMiLCJzcmMvanMvaXVpLmNoYXJ0LnRyZWVtYXAuanMiLCJzcmMvanMvaXVpLmRhc2hib2FyZC5pdGVtcy5qcyIsInNyYy9qcy9pdWkuZGFzaGJvYXJkLm1hcC5qcyIsInNyYy9qcy9pdWkuZGFzaGJvYXJkLm1vZGFsLmpzIiwic3JjL2pzL2l1aS5kYXNoYm9hcmQucGFyYW1ldGVybWFwLmpzIiwic3JjL2pzL2l1aS5kYXNoYm9hcmQud2lkZ2V0LmpzIiwic3JjL2pzL2l1aS50b3BvbG9neS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2o4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHdpZGdldCA9IHJlcXVpcmUoJy4vaXVpLmRhc2hib2FyZC53aWRnZXQnKTtcbnZhciBpdGVtcyA9IHJlcXVpcmUoJy4vaXVpLmRhc2hib2FyZC5pdGVtcycpO1xudmFyIG1vZGFsID0gcmVxdWlyZSgnLi9pdWkuZGFzaGJvYXJkLm1vZGFsJyk7XG52YXIgYmFyID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQuYmFyJyk7XG52YXIgY29sdW1uID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQuY29sdW1uJyk7XG52YXIgbGluZSA9IHJlcXVpcmUoJy4vaXVpLmNoYXJ0LmxpbmUnKTtcbnZhciB0aW1lc2VyaWVzID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQudGltZXNlcmllcycpO1xudmFyIHRhYmxlID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQudGFibGUnKTtcbnZhciBtZXNzYWdldGFibGUgPSByZXF1aXJlKCcuL2l1aS5jaGFydC5tZXNzYWdldGFibGUnKTtcbnZhciBncmlkID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQuZ3JpZCcpO1xudmFyIG1lc3NhZ2VncmlkID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQubWVzc2FnZWdyaWQnKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL2l1aS5kYXNoYm9hcmQubWFwJyk7XG52YXIgcGFyYW1ldGVybWFwID0gcmVxdWlyZSgnLi9pdWkuZGFzaGJvYXJkLnBhcmFtZXRlcm1hcCcpO1xudmFyIHBpZSA9IHJlcXVpcmUoJy4vaXVpLmNoYXJ0LnBpZScpO1xudmFyIGhpZ2htYXBzID0gcmVxdWlyZSgnLi9pdWkuY2hhcnQuaGlnaG1hcHMnKTtcbnZhciB0YWJ0YWJsZSA9IHJlcXVpcmUoJy4vaXVpLmNoYXJ0LnRhYnRhYmxlJyk7XG52YXIgdHJlZW1hcCA9IHJlcXVpcmUoJy4vaXVpLmNoYXJ0LnRyZWVtYXAnKTtcbnZhciB0b3BvbG9neSA9IHJlcXVpcmUoJy4vaXVpLnRvcG9sb2d5Jyk7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChvKSB7XG5cdHJldHVybiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiIFxuXHRcdD8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG5cdFx0XHRcdDogLy9ET00yXG5cdFx0XHRcdFx0byAmJiB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJiBvICE9PSBudWxsICYmIG8ubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCIpO1xufVxuXG53aW5kb3cuaXVpID0gd2luZG93Lml1aSB8fCB7fTtcblxuLy9zdGFydCBjcm9tZSB3aXRoIGZsYWcgXCItLWRpc2FibGUtd2ViLXNlY3VyaXR5XCIgdGhlbiB5b3UgdXNlIFhTUyBYU1IgXG4vL3dpbmRvdy5pdWkudXJscHJpZml4ID0gJ2h0dHA6Ly8yMTEuMTk2LjI1Mi4xMTE6OTA4MCc7XG5cbnZhciBvbkNoYW5nZURhc2hib2FyZEl0ZW0gPSBmdW5jdGlvbiAoZSwgaXRlbSkge1xuXHRpZiAoaXRlbS5jaGVja2VkKSB7XG5cdFx0aWYgKGl1aS5kYXNoYm9hcmQuZmluZFdpZGdldEJ5SWQoaXRlbS5pZCkpIHtyZXR1cm47fVxuXHRcdHZhciBfaXRlbSA9ICQuZXh0ZW5kKHt9LCBpdGVtKTtcblx0XHRfaXRlbS5lbCA9IGl1aS5kYXNoYm9hcmQuYWRkV2lkZ2V0KDAsIDAsIDMsIDQsIHRydWUsIHtcblx0XHRcdGlkOiBfaXRlbS5pZCxcblx0XHRcdHR5cGU6IF9pdGVtLnR5cGUsXG5cdFx0XHRsYWJlbDogX2l0ZW0ubGFiZWwsXG5cdFx0XHRyb3RhdGU6IF9pdGVtLnJvdGF0ZSxcblx0XHRcdGl0ZW1zOiBfaXRlbS5pdGVtc1x0XHRcdFxuXHRcdFx0PyBfaXRlbS5pdGVtc1xuXHRcdFx0XHRcdDogX2l0ZW0sXG5cdFx0XHRcdFx0c3RyaWN0OiAnTVVTVF9DUkVBVEUnXG5cdFx0fSk7IFxuXHR9IGVsc2Uge2l1aVxuXHRcdC5kYXNoYm9hcmRcblx0XHQucmVtb3ZlV2lkZ2V0QnlJZChpdGVtLmlkKTt9XG59O1xuXG4vKlxuICog7JyE6rKfIOyVhOydtO2FnFxuICog66eI7Jqw7IqkIOyYpOuyhFxuICovXG52YXIgb25JdGVtUm9sbE92ZXIgPSBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcblx0JChwYXJlbnQuZG9jdW1lbnQpLmZpbmQoJ2hlYWRlciA+ICN3aWRnZXRfc2V0dGluZ19wYW5lbCcpLmZpbmQoXCIud2lkZ2V0LWRlc2NyaXB0aW9uID4gaW1nXCIpLmF0dHIoXCJzcmNcIiwgXCIvaW1hZ2VzL2Rhc2hib2FyZC9cIiArIGRhdGEuaWQgKyBcIi5wbmdcIik7XG5cdCQocGFyZW50LmRvY3VtZW50KS5maW5kKCdoZWFkZXIgPiAjd2lkZ2V0X3NldHRpbmdfcGFuZWwnKS5maW5kKFwiLndpZGdldC1kZXNjcmlwdGlvbiA+IGg0XCIpLnRleHQoZGF0YS5sYWJlbCk7XG5cdCQocGFyZW50LmRvY3VtZW50KS5maW5kKCdoZWFkZXIgPiAjd2lkZ2V0X3NldHRpbmdfcGFuZWwnKS5maW5kKFwiLndpZGdldC1kZXNjcmlwdGlvbiA+IHBcIikudGV4dChkYXRhLmRlc2NyaXB0aW9uKTtcbn07XG5cbi8qXG4gKiDsnITqsp8g7JWE7J207YWcXG4gKiDrp4jsmrDsiqQg7JWE7JuDXG4gKi9cbnZhciBvbkl0ZW1Sb2xsT3V0ID0gZnVuY3Rpb24gKGV2ZW50ZGF0YSkge307XG5cbi8qXG4gKiBDT05URU5UU1xuICovXG4gXG52YXIgaXRlbUNvbnRhaW5lciA9ICQocGFyZW50LmRvY3VtZW50KS5maW5kKCdoZWFkZXIgPiAjd2lkZ2V0X3NldHRpbmdfcGFuZWwnKS5maW5kKFwiLndpZGdldC1saXN0XCIpO1xudmFyIGl0ZW1zRGF0YSA9IFwiL2tibi9kYXNoYm9hcmQvZGF0YS9pdGVtczEuanNvblwiO1xuLyogXG5pZih1c2VyVHlwZSA9PSBcIjMwMDJcIil7XG5cdGl0ZW1zRGF0YSA9IFwiL2Rhc2hib2FyZC9kYXRhL2l0ZW1zMi5qc29uXCI7XG59ZWxzZSBpZih1c2VyVHlwZSA9PSBcIjMwMDNcIil7XG5cdGl0ZW1zRGF0YSA9IFwiL2Rhc2hib2FyZC9kYXRhL2l0ZW1zNC5qc29uXCI7XG59ZWxzZSBpZih1c2VyVHlwZSA9PSBcIjMwMDRcIiB8fCB1c2VyVHlwZSA9PSBcIjMwMDVcIil7XG5cdGl0ZW1zRGF0YSA9IFwiL2Rhc2hib2FyZC9kYXRhL2l0ZW1zMy5qc29uXCI7XG59XG4qL1xuXG4kKCc8ZGl2PjwvZGl2PicpXG4uZGFzaGJvYXJkaXRlbXMoe2lkOiAnaXRlbWdyb3VwMScsIGxhYmVsOiAn64yA7Iuc67O065OcJywgZGVzY3JpcHRpb246ICfsgqzsmqntlZjsi6Qg7JyE7KCv7J2EIOyEoO2Dne2VmOyEuOyalC4nLCBkYXRhOiBpdGVtc0RhdGEsIGNoYW5nZTogb25DaGFuZ2VEYXNoYm9hcmRJdGVtLCByb2xsb3Zlcjogb25JdGVtUm9sbE92ZXIsIHJvbGxvdXQ6IG9uSXRlbVJvbGxPdXR9KVxuLmFwcGVuZFRvKGl0ZW1Db250YWluZXIpO1xuXG5cbi8qXG4gKiBHUklEIFNUQUNLXG4gKi9cbnZhciBvcHRpb25zID0ge1xuXHRcdGFuaW1hdGU6IHRydWUsXG5cdFx0aGFuZGxlOiAnLndpZGdldC1oZWFkZXInXG59O1xuXG4kKCcuZ3JpZC1zdGFjaycpXG4uYXR0cignZGF0YS1ncy1oZWlnaHQnLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKCdoZWFkZXInKS5vdXRlckhlaWdodCgpKVxuLmdyaWRzdGFjayhvcHRpb25zKTtcblxudmFyIExBWU9VVF9JRCA9IDA7XG5cbml1aS5kYXNoYm9hcmQgPSBuZXcgZnVuY3Rpb24gKCkge1xuXHR0aGlzLndpZGdldHMgPSBbXTtcblx0dGhpcy5sYXlvdXRJZCA9IExBWU9VVF9JRCsrO1xuXG5cdHRoaXMuZ3JpZCA9ICQoJy5ncmlkLXN0YWNrJykuZGF0YSgnZ3JpZHN0YWNrJyk7XG5cblx0dGhpcy5maW5kV2lkZ2V0QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdHJldHVybiBfLmZpbmQodGhpcy53aWRnZXRzLCBmdW5jdGlvbiAod2lkZ2V0KSB7XG5cdFx0XHRyZXR1cm4gaWQgPT09IHdpZGdldC5vcHRpb25zLmlkO1xuXHRcdH0pXG5cdH0uYmluZCh0aGlzKTtcblxuXHR0aGlzLnJlbW92ZVdpZGdldEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHR0aGlzLnJlbW92ZVdpZGdldCh0aGlzLmZpbmRXaWRnZXRCeUlkKGlkKSk7XG5cdH0uYmluZCh0aGlzKTtcblxuXHQvKipcblx0ICog7JyE6rKf65Ok7J2EIOq3uOumrOuTnOyXkCDroZzrlKntlZjsl6wg67Cw7LmYXG5cdCAqIOq4sOyhtOyXkCDqt7jrpqzrk5zsl5Ag7Jis65286rCAIOyeiOuKlCDrqqjrk6Ag7JyE6rKf65Ok7J2EIOyCreygnO2VnOuLpC5cblx0ICovXG5cdHRoaXMubG9hZEdyaWQgPSBmdW5jdGlvbiAodXJsKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBfd2lkZ2V0cyA9IFtdO1xuXHRcdCQuYWpheCh7dXJsOiB1cmwsIGRhdGFUeXBlOiAnanNvbicsIHR5cGU6ICdnZXQnfSkuZG9uZShmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcblx0XHRcdF93aWRnZXRzID0gR3JpZFN0YWNrVUkuVXRpbHMuc29ydChkYXRhKTsgICBcblx0XHR9KS5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblx0XHRcdGlmIChjb25zb2xlICYmIGNvbnNvbGUubG9nKSB7Y29uc29sZS5sb2codGV4dFN0YXR1cyk7fVxuXHRcdH0pLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxmLmNsZWFyR3JpZCgpO1xuXHRcdFx0Ly8gc2VsZi53aWRnZXRzID0gX3dpZGdldHM7XG5cdFx0XHRfLmVhY2goX3dpZGdldHMsIGZ1bmN0aW9uICh3aWRnZXQpIHtcblx0XHRcdFx0JChwYXJlbnQuZG9jdW1lbnQpLmZpbmQoJ2hlYWRlciA+ICN3aWRnZXRfc2V0dGluZ19wYW5lbCcpLmZpbmQoXCIuaXVpLWRhc2hib2FyZC1pdGVtc1wiKS5kYXNoYm9hcmRpdGVtcygndG9nZ2xlSXRlbScsIHdpZGdldC5pZCwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR3aWRnZXQuZWwgPSBzZWxmLmFkZFdpZGdldCh3aWRnZXQueCwgd2lkZ2V0LnksIHdpZGdldC53aWR0aCwgd2lkZ2V0LmhlaWdodCwgd2lkZ2V0LmF1dG9Qb3NpdGlvbiwgd2lkZ2V0Lm9wdGlvbnMpO1xuXHRcdFx0fSwgc2VsZik7XG5cdFx0fSk7XG5cdH0uYmluZCh0aGlzKTtcblxuXHR0aGlzLmdldEdyaWRKU09OID0gZnVuY3Rpb24gKGlzUmVtb3ZlRWxlbWVudCkge1xuXHRcdGlzUmVtb3ZlRWxlbWVudCA9IGlzUmVtb3ZlRWxlbWVudCA9PT0gZmFsc2Vcblx0XHQ/IGZhbHNlXG5cdFx0XHRcdDogdHJ1ZTtcblx0XHRyZXR1cm4gXy5tYXAoJCgnLmdyaWQtc3RhY2sgPiAuZ3JpZC1zdGFjay1pdGVtOnZpc2libGUnKSwgZnVuY3Rpb24gKHdpZGdldCkge1xuXG5cdFx0XHR3aWRnZXQgPSAkKHdpZGdldCk7XG5cdFx0XHR2YXIgbm9kZSA9IHdpZGdldC5kYXRhKCdfZ3JpZHN0YWNrX25vZGUnKTtcblx0XHRcdHZhciBvcHRpb25zID0gd2lkZ2V0LmRhdGEoJ193aWRnZXRfb3B0aW9ucycpO1xuXHRcdFx0dmFyIG5ld19ub2RlID0ge1xuXHRcdFx0XHRcdHg6IG5vZGUueCxcblx0XHRcdFx0XHR5OiBub2RlLnksXG5cdFx0XHRcdFx0d2lkdGg6IG5vZGUud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBub2RlLmhlaWdodCxcblx0XHRcdFx0XHRhdXRvUG9zaXRpb246IG5vZGUuYXV0b1Bvc2l0aW9uLFxuXHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdGlkOiBvcHRpb25zLmlkLFxuXHRcdFx0XHRcdFx0bGFiZWwgOiBvcHRpb25zLmxhYmVsLFxuXHRcdFx0XHRcdFx0dHlwZTogb3B0aW9ucy50eXBlLFxuXHRcdFx0XHRcdFx0cm90YXRlIDogb3B0aW9ucy5yb3RhdGUsXG5cdFx0XHRcdFx0XHRpdGVtczogb3B0aW9ucy5pdGVtcy8qXy5tYXAob3B0aW9ucy5pdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9pdGVtID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGl0ZW0uaWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogaXRlbS5sYWJlbCxcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0udHlwZSxcblx0XHRcdFx0XHRcdFx0XHRcdGludGVydmFsOiBpdGVtLmludGVydmFsLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6IGl0ZW0udGVtcGxhdGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBpdGVtLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogaXRlbS5jb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdHdpZHRoOiBpdGVtLndpZHRoLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiBpdGVtLmhlaWdodFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRpZiAoIWlzUmVtb3ZlRWxlbWVudCAmJiBpdGVtLmVsKSB7XG5cdFx0XHRcdFx0XHRcdFx0X2l0ZW0uZWwgPSBpdGVtLmVsO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtLm1pbiAhPT0gbnVsbCB8fCBpdGVtLm1pbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0X2l0ZW0ubWluID0gaXRlbS5taW47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0ubWF4ICE9PSBudWxsIHx8IGl0ZW0ubWF4ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRfaXRlbS5tYXggPSBpdGVtLm1heDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gX2l0ZW07XG5cdFx0XHRcdFx0XHR9KSovXG5cdFx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGlmICghaXNSZW1vdmVFbGVtZW50KSB7XG5cdFx0XHRcdG5ld19ub2RlLmVsID0gd2lkZ2V0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ld19ub2RlO1xuXHRcdH0sIHRoaXMpO1xuXHR9LmJpbmQodGhpcyk7XG5cdC8qKlxuXHQgKiDtmITsnqwg7ZmU66m07JeQIOuztOydtOuKlCDroIjsnbTslYTsm4Mg7KCA7J6lXG5cdCAqL1xuXHR0aGlzLnNhdmVHcmlkID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0R3JpZEpTT04oKTtcblx0XHRcblx0XHRpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuXHRcdFx0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob3B0aW9ucywgbnVsbCwgJyAnKSk7XG5cdFx0fVxuXHRcdFxuXHRcdCQoXCIjbGF5b3V0Rm9ybSBbbmFtZT0ndGVtcGxhdGUnXVwiKS52YWwoSlNPTi5zdHJpbmdpZnkob3B0aW9ucywgbnVsbCwgJyAnKSk7XG5cblx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdHVybDogJy9sb2dBbmFseXNpcy9sb2dBbmFseXNpcy9tYXB2aWV3RGFzaGJvYXJkU2F2ZS5kbycsXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0dHlwZTogJ1BPU1QnLFx0XHRcdFxuXHRcdFx0ZGF0YTogJChcIiNsYXlvdXRGb3JtXCIpLnNlcmlhbGl6ZSgpLFxuXHRcdFx0Y29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCJcblx0XHR9KVxuXHRcdC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRpZih0eXBlID09ICdkYXNoYm9hcmQnKXtcblx0XHRcdFx0dmFyIHB1dEZsYWcgPSB0cnVlO1xuXHRcdFx0XHQkKHBhcmVudC5kb2N1bWVudCkuZmluZCgnaGVhZGVyID4gI2Rhc2hib2FyZF93aWRnZXRfZGl2JykuZmluZChcIiNsYXlvdXRfbGlzdCA+IGxpID4gYVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoJCh0aGlzKS50ZXh0KCkgPT0gJChcIiNpbnB1dF9uZXdfbGF5b3V0X25hbWVcIikudmFsKCkpe1xuXHRcdFx0XHRcdFx0cHV0RmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChwdXRGbGFnKSB7XG5cdFx0XHRcdFx0YWRkTGF5b3V0VG9MaXN0KHtcblx0XHRcdFx0XHRcdCdpZCc6ICd1c2VyX2RlZmluZWRfbGF5b3V0Jyxcblx0XHRcdFx0XHRcdCdsYWJlbCc6ICQoXCIjaW5wdXRfbmV3X2xheW91dF9uYW1lXCIpLnZhbCgpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3NhdmUgbGF5b3V0IHN1Y2NlZWQuJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblx0XHRcdGlmIChjb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRleHRTdGF0dXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LmJpbmQodGhpcyk7XG5cblx0Lypcblx0ICog66CI7J207JWE7JuDIOyCreygnCDrqqjrk6Ag7JWE7J207YWc7J2EIOyngOyatOuLpC5cblx0ICovXG5cdHRoaXMuY2xlYXJHcmlkID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcblx0XHQkKHBhcmVudC5kb2N1bWVudCkuZmluZCgnaGVhZGVyID4gI3dpZGdldF9zZXR0aW5nX3BhbmVsJykuZmluZChcIi5pdWktZGFzaGJvYXJkLWl0ZW1zXCIpLmRhc2hib2FyZGl0ZW1zKCd0b2dnbGVBbGwnLCBmYWxzZSwgZmFsc2UpO1xuXHRcdF8uZWFjaChzZWxmLndpZGdldHMsIGZ1bmN0aW9uICh3aWRnZXQpIHtcblx0XHRcdHNlbGYucmVtb3ZlV2lkZ2V0KHdpZGdldCk7XG5cdFx0fSk7XG5cdFx0c2VsZi53aWRnZXRzID0gW107XG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBUT0RPIOyVhOydtO2FnCDrqqnroZ3sl5DshJwg7LK07YGsIO2VtOygnOyLnCDsgq3soJxcblx0Ly8g6rOg66Ck7ZWgIOyCrO2VreydtCDrp47rhKQgLi4uXG5cdHRoaXMucmVtb3ZlV2lkZ2V0ID0gZnVuY3Rpb24gKHdpZGdldCkge1xuXHRcdGlmICghd2lkZ2V0KSB7cmV0dXJuO31cblx0XHR2YXIgZWxlbWVudDtcblx0XHRpZiAoaXNFbGVtZW50KHdpZGdldCkpIHtcblx0XHRcdGVsZW1lbnQgPSAkKHdpZGdldCk7XG5cdFx0XHR3aWRnZXQgPSBlbGVtZW50LmRhdGEoJ193aWRnZXRfb3B0aW9ucycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50ID0gJCgnIycgKyB3aWRnZXQub3B0aW9ucy5pZCk7XG5cdFx0fVxuXHRcdCQocGFyZW50LmRvY3VtZW50KS5maW5kKCdoZWFkZXIgPiAjd2lkZ2V0X3NldHRpbmdfcGFuZWwnKS5maW5kKFwiLml1aS1kYXNoYm9hcmQtaXRlbXNcIikuZGFzaGJvYXJkaXRlbXMoJ3RvZ2dsZUl0ZW0nLCB3aWRnZXQuaWQsIGZhbHNlLCBmYWxzZSk7XG5cdFx0dGhpcy5ncmlkLnJlbW92ZV93aWRnZXQoZWxlbWVudCk7XG5cdFx0dGhpcy53aWRnZXRzID0gdGhpcy5nZXRHcmlkSlNPTihmYWxzZSk7XG5cdFx0ZWxlbWVudCA9IG51bGw7XG5cdH0uYmluZCh0aGlzKTtcblxuXHQvKipcblx0ICog7IOI66Gc7Jq0IOyVhOydtO2FnOydhCDroIjsnbTslYTsm4Psl5Ag65Ox66Gd7ZWc64ukLlxuXHQgKi9cblx0dGhpcy5hZGRXaWRnZXQgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgYXV0b1Bvc2l0aW9uLCBvcHRpb25zKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBpdGVtcyA9IG51bGw7XG5cdFx0aXRlbXMgPSAkLmlzQXJyYXkob3B0aW9ucy5pdGVtcylcblx0XHQ/IG9wdGlvbnMuaXRlbXNcblx0XHRcdFx0OiBbb3B0aW9ucy5pdGVtc107XG5cdFx0b3B0aW9ucy5pdGVtcyA9IGl0ZW1zO1xuXHRcdG9wdGlvbnMuaWQgPSBvcHRpb25zLmlkIHx8ICd3aWRnZXRfJyArIHNlbGYud2lkZ2V0cy5sZW5ndGg7XG5cblx0XHRvcHRpb25zLmNyZWF0ZSA9IGZ1bmN0aW9uIChlLCB1aSkge1xuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYob3B0aW9ucy50eXBlICE9IG51bGwgJiYgb3B0aW9ucy50eXBlID09IFwiZ3JvdXBcIiAmJiBvcHRpb25zLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHRcdFx0Xy5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFx0aXRlbS5pdGVtdHlwZSA9IG9wdGlvbnMudHlwZTtcblx0XHRcdFx0XHRcdGl0ZW0ucm90YXRlID0gb3B0aW9ucy5yb3RhdGU7XG5cdFx0XHRcdFx0XHRpdGVtLmVsID0gaXRlbXNbMF0uZWw7XG5cdFx0XHRcdFx0XHRzZWxmLnNldENvbnRlbnRzKGl0ZW0sIF9zZWxmLCBvcHRpb25zLnN0cmljdCA9PT0gJ01VU1RfQ1JFQVRFJ1xuXHRcdFx0XHRcdFx0XHQ/IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IHRydWUpO1xuXHRcdFx0XHRcdH0sIF9zZWxmKTtcblx0XHRcdFx0XHRpdGVtcyA9IG51bGw7XG5cdFx0XHRcdFx0X3NlbGYgPSBudWxsO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRfLmVhY2goaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0XHRpdGVtLml0ZW10eXBlID0gb3B0aW9ucy50eXBlO1xuXHRcdFx0XHRcdFx0aXRlbS5yb3RhdGUgPSBvcHRpb25zLnJvdGF0ZTtcblx0XHRcdFx0XHRcdHNlbGYuc2V0Q29udGVudHMoaXRlbSwgX3NlbGYsIG9wdGlvbnMuc3RyaWN0ID09PSAnTVVTVF9DUkVBVEUnXG5cdFx0XHRcdFx0XHRcdD8gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdDogdHJ1ZSk7XG5cdFx0XHRcdFx0fSwgX3NlbGYpO1xuXHRcdFx0XHRcdGl0ZW1zID0gbnVsbDtcblx0XHRcdFx0XHRfc2VsZiA9IG51bGw7XHQgIFxuXHRcdFx0XHR9XG5cdFx0XHR9LCAxMDApO1xuXHRcdH07XG5cblx0XHRvcHRpb25zLndpbGxtb3VudCA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge2NvbnNvbGUubG9nKCdXaWRnZXQgd2lsbCBiZSBtb3VudGVkLicpO31cblx0XHR9O1xuXG5cdFx0dmFyIHdpZGdldCA9ICQoJzxkaXYgaWQ9XCInICsgb3B0aW9ucy5pZCArICdcIj48L2Rpdj4nKS5hZGRDbGFzcygnZ3JpZC1zdGFjay1pdGVtJykuZGFzaGJvYXJkd2lkZ2V0KG9wdGlvbnMpLmJpbmQoJ2Rhc2hib2FyZHdpZGdldHdpbGx1cGRhdGUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtjb25zb2xlLmxvZygnd2lkZ2V0IHdpbGwgdXBkYXRlJyk7fVxuXHRcdH0pXG5cdFx0Ly8g7JyE6rKfIOuLq+q4sFxuXHRcdC5iaW5kKCdkYXNoYm9hcmR3aWRnZXRjbG9zZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0Ly8g7LWc64yA7ZmUIOyLnOyXkOuKlCDsnpHrj5ntlZjsp4Ag7JWK64qU64ukLlxuXHRcdFx0aWYgKCR0aGlzLmhhc0NsYXNzKCd3aWRnZXQtbWF4aW1pemVkJykpIHtyZXR1cm47fVxuXHRcdFx0c2VsZi5yZW1vdmVXaWRnZXQodGhpcyk7XG5cdFx0XHQvLyDrqqjrk6Ag7J2067Kk7Yq4IO2VuOuTpOufrCDsoJzqsbBcblx0XHRcdC8vIGNsb3NlLCB0b2dnbGVzaXplLCB0b2dnbGVsb2NrXG5cdFx0XHQvLyAkdGhpcy51bmJpbmQoKTtcblxuXHRcdFx0Ly8g66qo65OgIOywqO2KuCDtj5DquLBcblx0XHRcdC8vIF8uZWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdC8vICBzZWxmLnJlbW92ZUNvbnRlbnRzKGl0ZW0pO1xuXHRcdFx0Ly8gfSk7XG5cdFx0XHQvL1xuXHRcdFx0Ly8gJHRoaXMuZGFzaGJvYXJkd2lkZ2V0KCdkZXN0cm95Jyk7XG5cdFx0XHQvLyBzZWxmLmdyaWQucmVtb3ZlX3dpZGdldCh0aGlzLCB0cnVlKTtcblx0XHRcdCR0aGlzID0gbnVsbDtcblx0XHR9KVxuXHRcdC8vIFRvZ2dsZSB3aWRnZXQgZm9sbHNpemVcblx0XHQuYmluZCgnZGFzaGJvYXJkd2lkZ2V0dG9nZ2xlc2l6ZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGJ0biA9ICQoJCgnLml1aS1idG4tdG9nZ2xlLW1pbm1heCcsIHRoaXMpLmdldCgwKSk7XG5cdFx0XHR2YXIgc2l6ZVN0YXR1cyA9IFwiXCI7XG5cdFx0XHRpZiAoYnRuLmhhc0NsYXNzKCdtaW5pbWl6ZScpKSB7XG5cdFx0XHRcdC8vIE1pbmltaXplXG5cdFx0XHRcdHNpemVTdGF0dXMgPSBcIm1pblwiO1xuXHRcdFx0XHQvLyQoJyN3aWRnZXR3cmFwcGVyJykuY3NzKCdvdmVyZmxvdy15JywgJ2F1dG8nKTtcblx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ3dpZGdldC1tYXhpbWl6ZWQnKTtcblx0XHRcdFx0YnRuLnJlbW92ZUNsYXNzKCdtaW5pbWl6ZScpO1xuXHRcdFx0XHQkdGhpcy5jc3Moe2xlZnQ6ICcnLCB0b3A6ICcnLCB3aWR0aDogJycsIGhlaWdodDogJyd9KTtcblx0XHRcdFx0c2VsZi5ncmlkLmFkZF93aWRnZXQoJHRoaXMsIDAsIDAsICR0aGlzLmF0dHIoJ2RhdGEtZ3Mtd2lkdGgnKSwgJHRoaXMuYXR0cignZGF0YS1ncy1oZWlnaHQnKSwgdHJ1ZSk7XG5cdFx0XHRcdHNlbGYuZ3JpZC5tb3ZhYmxlKCR0aGlzLCB0cnVlKTtcblx0XHRcdFx0c2VsZi5ncmlkLnJlc2l6YWJsZSgkdGhpcywgdHJ1ZSk7XG5cdFx0XHRcdF8uZWFjaChzZWxmLmdyaWQuZ3JpZC5ub2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0XHQkKCQoJy5pdWktYnRuLXRvZ2dsZS1sb2NrJywgbm9kZS5lbCkuZ2V0KDApKS5yZW1vdmVDbGFzcygndW5sb2NrJyk7XG5cdFx0XHRcdFx0c2VsZi5ncmlkLmxvY2tlZChub2RlLmVsLCBmYWxzZSk7XG5cdFx0XHRcdH0sIHNlbGYpO1xuXHRcdFx0XHRmdWxsc2NyZWVuRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHQkKFwiI3dpZGdldF9zZXR0aW5nID4gYnV0dG9uXCIpLmF0dHIoXCJkaXNhYmxlZFwiLGZhbHNlKTtcblx0XHRcdFx0XG5cdFx0XHRcdCQoXCIuZ3JpZC1zdGFja1wiKS5oZWlnaHQoJChcIi5ncmlkLXN0YWNrXCIpLmhlaWdodCgpICsgMTUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBNYXhpbWl6ZVxuXHRcdFx0XHRzaXplU3RhdHVzID0gXCJtYXhcIjtcblx0XHRcdFx0Ly8kKCcjd2lkZ2V0d3JhcHBlcicpLmNzcygnb3ZlcmZsb3cteScsICdoaWRkZW4nKTtcblx0XHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ3dpZGdldC1tYXhpbWl6ZWQnKTtcblx0XHRcdFx0YnRuLmFkZENsYXNzKCdtaW5pbWl6ZScpO1xuXHRcdFx0XHRfLmVhY2goc2VsZi5ncmlkLmdyaWQubm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHRcdFx0JCgkKCcuaXVpLWJ0bi10b2dnbGUtbG9jaycsIG5vZGUuZWwpLmdldCgwKSkuYWRkQ2xhc3MoJ3VubG9jaycpO1xuXHRcdFx0XHRcdHNlbGYuZ3JpZC5sb2NrZWQobm9kZS5lbCwgdHJ1ZSk7XG5cdFx0XHRcdH0sIHNlbGYpO1xuXHRcdFx0XHRzZWxmXG5cdFx0XHRcdC5ncmlkXG5cdFx0XHRcdC5tb3ZhYmxlKCR0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdHNlbGZcblx0XHRcdFx0LmdyaWRcblx0XHRcdFx0LnJlc2l6YWJsZSgkdGhpcywgZmFsc2UpO1xuXHRcdFx0XHQvLyBCcmluZyB0aGUgd2lkZ2V0IHRvIGZyb250XG5cdFx0XHRcdC8vIGRldGFjaCB0aGUgd2lkZ2V0IGZyb20gZ3JpZHN0YWNrXG5cdFx0XHRcdHNlbGZcblx0XHRcdFx0LmdyaWRcblx0XHRcdFx0LnJlbW92ZV93aWRnZXQoJHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0Ly8gYW5kIGFkZCB0aGUgd2lkZ2V0IGF0IGxhc3Rcblx0XHRcdFx0JCgnLmdyaWQtc3RhY2snKS5hcHBlbmQoJHRoaXMpO1xuXHRcdFx0XHQvLyBhbmQgdGhlbiBzZXQgdGhlIHdpZGdldCBhcyBmdWxsIHNpemUgYXMgcG9zc2libGUuXG5cdFx0XHRcdCR0aGlzLmNzcyh7XG5cdFx0XHRcdFx0bGVmdDogJzBweCcsXG5cdFx0XHRcdFx0dG9wOiAkKCcuZGFzaGJvYXJkJykuc2Nyb2xsVG9wKCkgPiAwID8gJCgnLmRhc2hib2FyZCcpLnNjcm9sbFRvcCgpIC0gMTAgOiAyLFxuXHRcdFx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRcdFx0aGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKCdoZWFkZXInKS5vdXRlckhlaWdodCgpIC0gMTUgLSAkKCcucGFuZWwtaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtICQoJy5wYW5lbC1mb290ZXInKS5vdXRlckhlaWdodCgpXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRmdWxsc2NyZWVuRmxhZyA9IHRydWU7XG5cdFx0XHRcdCQoXCIjd2lkZ2V0X3NldHRpbmcgPiBidXR0b25cIikuYXR0cihcImRpc2FibGVkXCIsXCJkaXNhYmxlZFwiKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JCgnLml1aS1kYXNoYm9hcmQtY2hhcnQnLCBlLnRhcmdldCkuZWFjaChmdW5jdGlvbiAoaSwgY2hhcnQpIHsgXG5cdFx0XHRcdFx0Y2hhcnQgPSAkKGNoYXJ0KTtcblx0XHRcdFx0XHR2YXIgbmFtZSA9ICdjaGFydCcgKyBjaGFydC5kYXRhKCdjaGFydCcpO1xuXHRcdFx0XHRcdHNpemVTdGF0dXMgPSBmdWxsc2NyZWVuRmxhZyA/IFwibWF4XCIgOiBcIm1pblwiO1xuXHRcdFx0XHRcdGlmIChjaGFydFtuYW1lXSkge1xuXHRcdFx0XHRcdFx0KGNoYXJ0W25hbWVdKSgncmVzaXplJywgc2l6ZVN0YXR1cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5hbWUgPSBudWxsO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJlc2l6ZSgpO1xuXHRcdFx0fSwgNjAwKTtcblxuXHRcdFx0JHRoaXMgPSBidG4gPSBzaXplU3RhdHVzID0gbnVsbDs7XG5cdFx0fSlcblx0XHQvLyB0b2dnbGUgd2lkZ2V0cyBsb2NrYWJsZS5cblx0XHQuYmluZCgnZGFzaGJvYXJkd2lkZ2V0dG9nZ2xlbG9jaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgbWUgPSAkKHRoaXMpO1xuXHRcdFx0aWYgKG1lLmhhc0NsYXNzKCd3aWRnZXQtbWF4aW1pemVkJykpIHtyZXR1cm47fVxuXHRcdFx0dmFyIGJ0biA9ICQoJCgnLml1aS1idG4tdG9nZ2xlLWxvY2snLCB0aGlzKS5nZXQoMCkpO1xuXHRcdFx0aWYgKGJ0bi5oYXNDbGFzcygndW5sb2NrJykpIHtcblx0XHRcdFx0YnRuLnJlbW92ZUNsYXNzKCd1bmxvY2snKTtcblx0XHRcdFx0c2VsZi5ncmlkLmxvY2tlZChtZSwgZmFsc2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YnRuLmFkZENsYXNzKCd1bmxvY2snKTtcblx0XHRcdFx0c2VsZlxuXHRcdFx0XHQuZ3JpZFxuXHRcdFx0XHQubG9ja2VkKG1lLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdG1lID0gbnVsbDtcblx0XHR9KTtcblxuXHRcdHdpZGdldC5kYXRhKCdfd2lkZ2V0X29wdGlvbnMnLCBvcHRpb25zKTtcblx0XHRzZWxmLmdyaWQuYWRkX3dpZGdldCh3aWRnZXQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIGF1dG9Qb3NpdGlvbik7XG5cdFx0Ly8g7JyE6rKfIOyEoO2DnSDssrTtgazrsJXsiqQg7LK07YGsXG5cdFx0JChwYXJlbnQuZG9jdW1lbnQpLmZpbmQoJ2hlYWRlciA+ICN3aWRnZXRfc2V0dGluZ19wYW5lbCcpLmZpbmQoXCIuaXVpLWRhc2hib2FyZC1pdGVtc1wiKS5kYXNoYm9hcmRpdGVtcygndG9nZ2xlSXRlbScsIG9wdGlvbnMuaWQsIHRydWUsIGZhbHNlKTtcblx0XHRzZWxmLndpZGdldHMgPSBzZWxmLmdldEdyaWRKU09OKGZhbHNlKTtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQvL+ychOqynyDtg60g7ISg7YOdXG5cdFx0XHRzZWxmLnNldFdpZGdldExldmVsKCk7XG5cdFx0XHRpbml0V2lkZ2V0UGFkZGluZ3Mod2lkZ2V0KTtcblx0XHR9LCAxMDApO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiB3aWRnZXQ7XG5cdFx0fWZpbmFsbHl7XG5cdFx0XHR3aWRnZXQgPSBudWxsO1xuXHRcdH1cblx0fS5iaW5kKHRoaXMpO1xuXG5cdHRoaXMuY2hhcnRJZCA9IDA7XG5cblx0dGhpcy5zZXRUb3BvbG9neSA9IGZ1bmN0aW9uIChpdGVtLCB3aWRnZXQpIHtcblx0XHRpZiAoaXRlbSAmJiBpdGVtLmVsKSB7aXRlbS5lbC5lbXB0eSgpO31cblx0XHQkKGl0ZW0uZWwpLmFkZENsYXNzKCd0b3BvbG9neS1wYW5lbCcpO1xuXHRcdC8vIC5hdHRyKFwiY2xhc3NcIiwgJChpdGVtLmVsKVxuXHRcdC8vICAuYXR0cihcImNsYXNzXCIpICsgXCIgdG9wb2xvZ3ktcGFuZWxcIik7XG5cdFx0dmFyIHdpZHRoU3R5bGUgPSBcIlwiO1xuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiKXtcblx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSd3aWR0aDpcIitpdGVtLndpZHRoK1wiJ1wiO1xuXHRcdH1cblx0XHQkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKCd3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHRvcG9sb2d5JykuYXR0cignZGF0YS1jaGFydCcsICd0b3BvbG9neScpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0dG9wb2xvZ3koe2RhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWx9KTtcblx0fTtcblxuXHR0aGlzLnNldFRhYmxlQ2hhcnQgPSBmdW5jdGlvbiAoaXRlbSwgd2lkZ2V0KSB7XG5cdFx0aWYgKGl0ZW0gJiYgaXRlbS5lbCAmJiBpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgIT09IFwiZ3JvdXBcIikge2l0ZW0uZWwuZW1wdHkoKTt9XG5cdFx0XG5cdFx0dmFyIHdpZHRoU3R5bGUgPSBcIlwiO1xuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwiaG9yaXpvblwiKXtcblx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSd3aWR0aDpcIitpdGVtLndpZHRoK1wiJ1wiO1xuXHRcdH1lbHNlIGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwidmVydGljYWxcIil7XG5cdFx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0XHRpZiAoIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKCdUcmlkZW50JykgIT0gLTEpIHx8IChhZ2VudC5pbmRleE9mKFwibXNpZVwiKSAhPSAtMSkgKSB7XG5cdFx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSdoZWlnaHQ6MTAwJSdcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGdyb3VwT2JqID0gJChcIjxsaSBjbGFzcz0nYm9yZGVyLWJvdHRvbScgXCIrd2lkdGhTdHlsZStcIj5cIik7XG5cblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIil7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWJvZHknPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZFRvKGl0ZW0uZWwpO1xuXHRcdFx0XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcInRhYmxlXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCB0YWJsZVwiKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3RhYmxlJykuYXBwZW5kVG8oaXRlbS5lbCkuZmxvd3R5cGUoe21pbkZvbnQ6IDExLCBtYXhGb250OiA0MCwgZm9udFJhdGlvOiA0MH0pLmNoYXJ0dGFibGUoe1xuXHRcdFx0XHRcdGRhdGE6IGl0ZW0uZGF0YSxcblx0XHRcdFx0XHRpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogaXRlbS50ZW1wbGF0ZVxuXHRcdFx0XHR9KSk7XHRcblx0XHRcdH1cdFxuXHRcdH1lbHNle1x0XHRcblx0XHRcdCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHRhYmxlXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAndGFibGUnKS5hcHBlbmRUbyhpdGVtLmVsKS5mbG93dHlwZSh7bWluRm9udDogMTEsIG1heEZvbnQ6IDQwLCBmb250UmF0aW86IDQwfSkuY2hhcnR0YWJsZSh7XG5cdFx0XHRcdGRhdGE6IGl0ZW0uZGF0YSxcblx0XHRcdFx0aW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsXG5cdFx0XHRcdHRlbXBsYXRlOiBpdGVtLnRlbXBsYXRlLFxuXHRcdFx0XHRjcmVhdGU6IGZ1bmN0aW9uIChlLCB1aSkge1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5zZXRNZXNzYWdlVGFibGVDaGFydCA9IGZ1bmN0aW9uIChpdGVtLCB3aWRnZXQpIHtcblx0XHRpZiAoaXRlbSAmJiBpdGVtLmVsICYmIGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSAhPT0gXCJncm91cFwiKSB7aXRlbS5lbC5lbXB0eSgpO31cblx0XHRcblx0XHR2YXIgd2lkdGhTdHlsZSA9IFwiXCI7XG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJob3Jpem9uXCIpe1xuXHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J3dpZHRoOlwiK2l0ZW0ud2lkdGgrXCInXCI7XG5cdFx0fWVsc2UgaWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJ2ZXJ0aWNhbFwiKXtcblx0XHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiBcblx0XHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J2hlaWdodDoxMDAlJ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgZ3JvdXBPYmogPSAkKFwiPGxpIGNsYXNzPSdib3JkZXItYm90dG9tJyBcIit3aWR0aFN0eWxlK1wiPlwiKTtcblxuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiKXtcblx0XHRcdC8vZ3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdFxuXHRcdFx0aWYoaXRlbS5zZWFyY2gpe1xuXHRcdFx0XHRtYWtlU2VhcmNoRWxlbWVudChpdGVtLCBncm91cE9iaiwgXCJtZXNzYWdldGFibGVcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IG1lc3NhZ2V0YWJsZVwiKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ21lc3NhZ2V0YWJsZScpLmFwcGVuZFRvKGl0ZW0uZWwpLmZsb3d0eXBlKHttaW5Gb250OiAxMSwgbWF4Rm9udDogNDAsIGZvbnRSYXRpbzogNDB9KS5jaGFydG1lc3NhZ2V0YWJsZSh7XG5cdFx0XHRcdFx0ZGF0YTogaXRlbS5kYXRhLFxuXHRcdFx0XHRcdGludGVydmFsOiBpdGVtLmludGVydmFsLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiBpdGVtLnRlbXBsYXRlXG5cdFx0XHRcdH0pKTtcdFxuXHRcdFx0fVx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgbWVzc2FnZXRhYmxlXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnbWVzc2FnZXRhYmxlJykuYXBwZW5kVG8oaXRlbS5lbCkuZmxvd3R5cGUoe21pbkZvbnQ6IDExLCBtYXhGb250OiA0MCwgZm9udFJhdGlvOiA0MH0pLmNoYXJ0bWVzc2FnZXRhYmxlKHtcblx0XHRcdFx0ZGF0YTogaXRlbS5kYXRhLFxuXHRcdFx0XHRpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCxcblx0XHRcdFx0dGVtcGxhdGU6IGl0ZW0udGVtcGxhdGUsXG5cdFx0XHRcdGNyZWF0ZTogZnVuY3Rpb24gKGUsIHVpKSB7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLnNldEJhckNoYXJ0ID0gZnVuY3Rpb24gKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Ly9ncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48aDMgY2xhc3M9J2JvcmRlcic+XCIraXRlbS5sYWJlbCtcIjwvaDM+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGlmKGl0ZW0uc2VhcmNoKXtcblx0XHRcdFx0bWFrZVNlYXJjaEVsZW1lbnQoaXRlbSwgZ3JvdXBPYmosIFwiYmFyXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBiYXJcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdiYXInKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGJhcih7ZGF0YTogaXRlbS5kYXRhLCBtYXg6IGl0ZW0ubWF4LCBtaW46IGl0ZW0ubWluLCBpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCwgY29sb3I6IGl0ZW0uY29sb3IsIGdyYXBoVHlwZTogaXRlbS5ncmFwaFR5cGV9KSk7XG5cdFx0XHR9XHRcblx0XHR9ZWxzZXtcdFx0XG5cdFx0XHQkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBiYXJcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdiYXInKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGJhcih7ZGF0YTogaXRlbS5kYXRhLCBtYXg6IGl0ZW0ubWF4LCBtaW46IGl0ZW0ubWluLCBpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCwgY29sb3I6IGl0ZW0uY29sb3IsIGlkIDogaXRlbS5pZCwgZ3JhcGhUeXBlOiBpdGVtLmdyYXBoVHlwZX0pO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLnNldENvbHVtbkNoYXJ0ID0gZnVuY3Rpb24gKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGlmKGl0ZW0uc2VhcmNoKXtcblx0XHRcdFx0bWFrZVNlYXJjaEVsZW1lbnQoaXRlbSwgZ3JvdXBPYmosIFwiY29sdW1uXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBjb2x1bW5cIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdjb2x1bW4nKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGNvbHVtbih7aXRlbTogaXRlbX0pKTtcblx0XHRcdH1cdFxuXHRcdH1lbHNle1x0XHRcblx0XHRcdCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IGNvbHVtblwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2NvbHVtbicpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0Y29sdW1uKHtpdGVtOiBpdGVtfSk7XG5cdFx0fVx0XG5cdH07XG5cblx0dGhpcy5zZXRMaW5lQ2hhcnQgPSBmdW5jdGlvbiAoaXRlbSwgd2lkZ2V0KSB7XG5cdFx0aWYgKGl0ZW0gJiYgaXRlbS5lbCAmJiBpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgIT09IFwiZ3JvdXBcIikge2l0ZW0uZWwuZW1wdHkoKTt9XG5cdFx0dmFyIHdpZHRoU3R5bGUgPSBcIlwiO1xuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwiaG9yaXpvblwiKXtcblx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSd3aWR0aDpcIitpdGVtLndpZHRoK1wiJ1wiO1xuXHRcdH1lbHNlIGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwidmVydGljYWxcIil7XG5cdFx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0XHRpZiAoIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKCdUcmlkZW50JykgIT0gLTEpIHx8IChhZ2VudC5pbmRleE9mKFwibXNpZVwiKSAhPSAtMSkgKSB7XG5cdFx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSdoZWlnaHQ6MTAwJSdcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGdyb3VwT2JqID0gJChcIjxsaSBjbGFzcz0nYm9yZGVyLWJvdHRvbScgXCIrd2lkdGhTdHlsZStcIj5cIik7XG5cblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIil7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWJvZHknPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZFRvKGl0ZW0uZWwpO1xuXHRcdFx0XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcImxpbmVcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IGxpbmVcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdsaW5lJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRsaW5lKHsnZGF0YSc6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yLCBpZCA6IGl0ZW0uaWR9KSk7XG5cdFx0XHR9XHRcblx0XHR9ZWxzZXtcdFx0XG5cdFx0XHQkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBsaW5lXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnbGluZScpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0bGluZSh7J2RhdGEnOiBpdGVtLmRhdGEsIGludGVydmFsOiBpdGVtLmludGVydmFsLCBjb2xvcjogaXRlbS5jb2xvciAsIGlkIDogaXRlbS5pZH0pO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLnNldFRpbWVzZXJpZXNDaGFydCA9IGZ1bmN0aW9uIChpdGVtLCB3aWRnZXQpIHtcblx0XHRpZiAoaXRlbSAmJiBpdGVtLmVsICYmIGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSAhPT0gXCJncm91cFwiKSB7aXRlbS5lbC5lbXB0eSgpO31cblx0XHR2YXIgd2lkdGhTdHlsZSA9IFwiXCI7XG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJob3Jpem9uXCIpe1xuXHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J3dpZHRoOlwiK2l0ZW0ud2lkdGgrXCInXCI7XG5cdFx0fWVsc2UgaWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJ2ZXJ0aWNhbFwiKXtcblx0XHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiBcblx0XHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J2hlaWdodDoxMDAlJ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgZ3JvdXBPYmogPSAkKFwiPGxpIGNsYXNzPSdib3JkZXItYm90dG9tJyBcIit3aWR0aFN0eWxlK1wiPlwiKTtcblxuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiKXtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZChcIjxkaXYgY2xhc3M9J2l0ZW0taGVhZGVyIGJvcmRlci1ib3R0b20nPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZChcIjxkaXYgY2xhc3M9J2l0ZW0tYm9keSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kVG8oaXRlbS5lbCk7XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcInRpbWVzZXJpZXNcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHRpbWVzZXJpZXNcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICd0aW1lc2VyaWVzJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnR0aW1lc2VyaWVzKHtpdGVtOiBpdGVtfSkpO1xuXHRcdFx0fVx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgdGltZXNlcmllc1wiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3RpbWVzZXJpZXMnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydHRpbWVzZXJpZXMoe2l0ZW06IGl0ZW19KTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5zZXRQaWVDaGFydCA9IGZ1bmN0aW9uIChpdGVtLCB3aWRnZXQpIHtcblx0XHRpZiAoaXRlbSAmJiBpdGVtLmVsICYmIGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSAhPT0gXCJncm91cFwiKSB7aXRlbS5lbC5lbXB0eSgpO31cblx0XHR2YXIgd2lkdGhTdHlsZSA9IFwiXCI7XG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJob3Jpem9uXCIpe1xuXHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J3dpZHRoOlwiK2l0ZW0ud2lkdGgrXCInXCI7XG5cdFx0fWVsc2UgaWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJ2ZXJ0aWNhbFwiKXtcblx0XHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiBcblx0XHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J2hlaWdodDoxMDAlJ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgZ3JvdXBPYmogPSAkKFwiPGxpIGNsYXNzPSdib3JkZXItYm90dG9tJyBcIit3aWR0aFN0eWxlK1wiPlwiKTtcblxuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiKXtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZChcIjxkaXYgY2xhc3M9J2l0ZW0taGVhZGVyIGJvcmRlci1ib3R0b20nPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZChcIjxkaXYgY2xhc3M9J2l0ZW0tYm9keSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kVG8oaXRlbS5lbCk7XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcInBpZVwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgcGllXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAncGllJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRwaWUoe2RhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yfSkpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgcGllXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAncGllJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRwaWUoe2RhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yfSk7XG5cdFx0fVxuXHR9O1xuXG5cdHRoaXMuc2V0R3JpZENoYXJ0ID0gZnVuY3Rpb24gKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGlmKGl0ZW0uc2VhcmNoKXtcblx0XHRcdFx0bWFrZVNlYXJjaEVsZW1lbnQoaXRlbSwgZ3JvdXBPYmosIFwiZ3JpZFwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgZ3JpZFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2dyaWQnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGdyaWQoe2l0ZW06IGl0ZW19KSk7XG5cdFx0XHR9XHRcblx0XHR9ZWxzZXtcdFx0XG5cdFx0XHQkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBncmlkXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnZ3JpZCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0Z3JpZCh7aXRlbTogaXRlbX0pO1xuXHRcdH1cdFx0XG5cdH07XG5cblx0XG5cdHRoaXMuc2V0TWVzc2FnZWdyaWRDaGFydCA9IGZ1bmN0aW9uIChpdGVtLCB3aWRnZXQpIHtcblx0XHRpZiAoaXRlbSAmJiBpdGVtLmVsICYmIGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSAhPT0gXCJncm91cFwiKSB7aXRlbS5lbC5lbXB0eSgpO31cblx0XHR2YXIgd2lkdGhTdHlsZSA9IFwiXCI7XG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJob3Jpem9uXCIpe1xuXHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J3dpZHRoOlwiK2l0ZW0ud2lkdGgrXCInXCI7XG5cdFx0fWVsc2UgaWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIgJiYgaXRlbS5yb3RhdGUgPT0gXCJ2ZXJ0aWNhbFwiKXtcblx0XHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiBcblx0XHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdFx0d2lkdGhTdHlsZSA9IFwic3R5bGU9J2hlaWdodDoxMDAlJ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgZ3JvdXBPYmogPSAkKFwiPGxpIGNsYXNzPSdib3JkZXItYm90dG9tJyBcIit3aWR0aFN0eWxlK1wiPlwiKTtcblxuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiKXtcblx0XHRcdC8vZ3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGlmKGl0ZW0uc2VhcmNoKXtcblx0XHRcdFx0bWFrZVNlYXJjaEVsZW1lbnQoaXRlbSwgZ3JvdXBPYmosIFwibWVzc2FnZWdyaWRcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IG1lc3NhZ2VncmlkXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnbWVzc2FnZWdyaWQnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydG1lc3NhZ2VncmlkKHtpdGVtOiBpdGVtfSkpO1xuXHRcdFx0fVx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgbWVzc2FnZWdyaWRcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdtZXNzYWdlZ3JpZCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0bWVzc2FnZWdyaWQoe2l0ZW06IGl0ZW19KTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdHRoaXMuc2V0TWFwID0gZnVuY3Rpb24gKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBtYXBcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdtYXAnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydG1hcCh7dGl0bGU6IGl0ZW0ubGFiZWwsIGRhdGE6IGl0ZW0uZGF0YSwgdGVtcGxhdGU6IGl0ZW0udGVtcGxhdGV9KSk7XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcIm1hcFwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgZ3JpZFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2dyaWQnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGdyaWQoe2l0ZW06IGl0ZW19KSk7XG5cdFx0XHR9XHRcblx0XHR9ZWxzZXtcdFx0XG5cdFx0XHQkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBtYXBcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdtYXAnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydG1hcCh7dGl0bGU6IGl0ZW0ubGFiZWwsIGRhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIHRlbXBsYXRlOiBpdGVtLnRlbXBsYXRlfSk7XG5cdFx0fVx0XHRcblx0fTtcblxuXHRcblx0dGhpcy5zZXRQYXJhbWV0ZXJtYXAgPSBmdW5jdGlvbiAoaXRlbSwgd2lkZ2V0KSB7XG5cdFx0aWYgKGl0ZW0gJiYgaXRlbS5lbCAmJiBpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgIT09IFwiZ3JvdXBcIikge2l0ZW0uZWwuZW1wdHkoKTt9XG5cdFx0dmFyIHdpZHRoU3R5bGUgPSBcIlwiO1xuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwiaG9yaXpvblwiKXtcblx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSd3aWR0aDpcIitpdGVtLndpZHRoK1wiJ1wiO1xuXHRcdH1lbHNlIGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwidmVydGljYWxcIil7XG5cdFx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0XHRpZiAoIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKCdUcmlkZW50JykgIT0gLTEpIHx8IChhZ2VudC5pbmRleE9mKFwibXNpZVwiKSAhPSAtMSkgKSB7XG5cdFx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSdoZWlnaHQ6MTAwJSdcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGdyb3VwT2JqID0gJChcIjxsaSBjbGFzcz0nYm9yZGVyLWJvdHRvbScgXCIrd2lkdGhTdHlsZStcIj5cIik7XG5cblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIil7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWJvZHknPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZFRvKGl0ZW0uZWwpO1xuXHRcdFx0aWYoaXRlbS5zZWFyY2gpe1xuXHRcdFx0XHRtYWtlU2VhcmNoRWxlbWVudChpdGVtLCBncm91cE9iaiwgXCJwYXJhbWV0ZXJtYXBcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHBhcmFtZXRlcm1hcFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3BhcmFtZXRlcm1hcCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0cGFyYW1ldGVybWFwKHt0aXRsZTogaXRlbS5sYWJlbCwgZGF0YTogaXRlbS5kYXRhLCB0ZW1wbGF0ZTogaXRlbS50ZW1wbGF0ZX0pKTtcblx0XHRcdH1cdFxuXHRcdH1lbHNle1x0XHRcblx0XHRcdCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHBhcmFtZXRlcm1hcFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3BhcmFtZXRlcm1hcCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0cGFyYW1ldGVybWFwKHt0aXRsZTogaXRlbS5sYWJlbCwgZGF0YTogaXRlbS5kYXRhLCBpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCwgdGVtcGxhdGU6IGl0ZW0udGVtcGxhdGV9KTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdHRoaXMuc2V0SGlnaG1hcHMgPSBmdW5jdGlvbiAoaXRlbSwgd2lkZ2V0KSB7XG5cdFx0aWYgKGl0ZW0gJiYgaXRlbS5lbCAmJiBpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgIT09IFwiZ3JvdXBcIikge2l0ZW0uZWwuZW1wdHkoKTt9XG5cdFx0dmFyIHdpZHRoU3R5bGUgPSBcIlwiO1xuXHRcdGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwiaG9yaXpvblwiKXtcblx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSd3aWR0aDpcIitpdGVtLndpZHRoK1wiJ1wiO1xuXHRcdH1lbHNlIGlmKGl0ZW0uaXRlbXR5cGUgJiYgaXRlbS5pdGVtdHlwZSA9PT0gXCJncm91cFwiICYmIGl0ZW0ucm90YXRlID09IFwidmVydGljYWxcIil7XG5cdFx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0XHRpZiAoIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKCdUcmlkZW50JykgIT0gLTEpIHx8IChhZ2VudC5pbmRleE9mKFwibXNpZVwiKSAhPSAtMSkgKSB7XG5cdFx0XHRcdHdpZHRoU3R5bGUgPSBcInN0eWxlPSdoZWlnaHQ6MTAwJSdcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGdyb3VwT2JqID0gJChcIjxsaSBjbGFzcz0nYm9yZGVyLWJvdHRvbScgXCIrd2lkdGhTdHlsZStcIj5cIik7XG5cblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIil7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWJvZHknPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZFRvKGl0ZW0uZWwpO1xuXHRcdFx0aWYoaXRlbS5zZWFyY2gpe1xuXHRcdFx0XHRtYWtlU2VhcmNoRWxlbWVudChpdGVtLCBncm91cE9iaiwgXCJoaWdobWFwc1wiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgaGlnaG1hcHNcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdoaWdobWFwcycpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0aGlnaG1hcHMoe3RpdGxlOiBpdGVtLmxhYmVsLCBkYXRhOiBpdGVtLmRhdGEsIHRlbXBsYXRlOiBpdGVtLnRlbXBsYXRlfSkpO1xuXHRcdFx0fVx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgaGlnaG1hcHNcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdoaWdobWFwcycpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0aGlnaG1hcHMoe3RpdGxlOiBpdGVtLmxhYmVsLCBkYXRhOiBpdGVtLmRhdGEsIGludGVydmFsOiBpdGVtLmludGVydmFsLCB0ZW1wbGF0ZTogaXRlbS50ZW1wbGF0ZX0pO1xuXHRcdH1cdFx0XG5cdH07XG5cblx0dGhpcy5zZXRUYWJUYWJsZUNoYXJ0ID0gZnVuY3Rpb24gKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdFxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Ly9ncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWhlYWRlciBib3JkZXItYm90dG9tJz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdpdGVtLWJvZHknPjwvZGl2PlwiKTtcblx0XHRcdGdyb3VwT2JqLmFwcGVuZFRvKGl0ZW0uZWwpO1xuXHRcdFx0XG5cdFx0XHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0XHRcdG1ha2VTZWFyY2hFbGVtZW50KGl0ZW0sIGdyb3VwT2JqLCBcInRhYnRhYmxlXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHRoaXMuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCB0YWJ0YWJsZVwiKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3RhYnRhYmxlJykuYXBwZW5kVG8oaXRlbS5lbCkuZmxvd3R5cGUoe21pbkZvbnQ6IDExLCBtYXhGb250OiA0MCwgZm9udFJhdGlvOiA0MH0pLmNoYXJ0dGFidGFibGUoe1xuXHRcdFx0XHRcdGRhdGE6IGl0ZW0uZGF0YSxcblx0XHRcdFx0XHRpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogaXRlbS50ZW1wbGF0ZVxuXHRcdFx0XHR9KSk7XHRcblx0XHRcdH1cdFxuXHRcdH1lbHNle1x0XHRcblx0XHRcdCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgdGhpcy5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHRhYnRhYmxlXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAndGFidGFibGUnKS5hcHBlbmRUbyhpdGVtLmVsKS5mbG93dHlwZSh7bWluRm9udDogMTEsIG1heEZvbnQ6IDQwLCBmb250UmF0aW86IDQwfSkuY2hhcnR0YWJ0YWJsZSh7XG5cdFx0XHRcdGRhdGE6IGl0ZW0uZGF0YSxcblx0XHRcdFx0aW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsXG5cdFx0XHRcdHRlbXBsYXRlOiBpdGVtLnRlbXBsYXRlLFxuXHRcdFx0XHRjcmVhdGU6IGZ1bmN0aW9uIChlLCB1aSkge1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdFxuXHR0aGlzLnNldFRyZWVNYXBDaGFydCA9IGZ1bmN0aW9uKGl0ZW0sIHdpZGdldCkge1xuXHRcdGlmIChpdGVtICYmIGl0ZW0uZWwgJiYgaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlICE9PSBcImdyb3VwXCIpIHtpdGVtLmVsLmVtcHR5KCk7fVxuXHRcdHZhciB3aWR0aFN0eWxlID0gXCJcIjtcblx0XHRpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcImhvcml6b25cIil7XG5cdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0nd2lkdGg6XCIraXRlbS53aWR0aCtcIidcIjtcblx0XHR9ZWxzZSBpZihpdGVtLml0ZW10eXBlICYmIGl0ZW0uaXRlbXR5cGUgPT09IFwiZ3JvdXBcIiAmJiBpdGVtLnJvdGF0ZSA9PSBcInZlcnRpY2FsXCIpe1xuXHRcdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0XHR3aWR0aFN0eWxlID0gXCJzdHlsZT0naGVpZ2h0OjEwMCUnXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBncm91cE9iaiA9ICQoXCI8bGkgY2xhc3M9J2JvcmRlci1ib3R0b20nIFwiK3dpZHRoU3R5bGUrXCI+XCIpO1xuXG5cdFx0aWYoaXRlbS5pdGVtdHlwZSAmJiBpdGVtLml0ZW10eXBlID09PSBcImdyb3VwXCIpe1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1oZWFkZXIgYm9yZGVyLWJvdHRvbSc+PC9kaXY+XCIpO1xuXHRcdFx0Z3JvdXBPYmouYXBwZW5kKFwiPGRpdiBjbGFzcz0naXRlbS1ib2R5Jz48L2Rpdj5cIik7XG5cdFx0XHRncm91cE9iai5hcHBlbmRUbyhpdGVtLmVsKTtcblx0XHRcdGlmKGl0ZW0uc2VhcmNoKXtcblx0XHRcdFx0bWFrZVNlYXJjaEVsZW1lbnQoaXRlbSwgZ3JvdXBPYmosIFwidHJlZW1hcFwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgdHJlZW1hcFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3RyZWVtYXAnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydHRyZWVtYXAoe2RhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yfSkpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fWVsc2V7XHRcdFxuXHRcdFx0JCgnPGRpdiBpZD1cImNoYXJ0XycgKyB0aGlzLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgdHJlZW1hcFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3RyZWVtYXAnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydHRyZWVtYXAoe2RhdGE6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yfSk7XG5cdFx0fVxuXHR9XG5cblxuXHR0aGlzLmNoYXJ0Q3JlYXRvck1hcCA9IHtcblx0XHRcdCd0b3BvbG9neSc6IHRoaXMuc2V0VG9wb2xvZ3ksXG5cdFx0XHQnYmFyJzogdGhpcy5zZXRCYXJDaGFydCxcblx0XHRcdCdsaW5lJzogdGhpcy5zZXRMaW5lQ2hhcnQsXG5cdFx0XHQndGltZXNlcmllcyc6IHRoaXMuc2V0VGltZXNlcmllc0NoYXJ0LFxuXHRcdFx0J2NvbHVtbic6IHRoaXMuc2V0Q29sdW1uQ2hhcnQsIFxuXHRcdFx0J3RhYmxlJzogdGhpcy5zZXRUYWJsZUNoYXJ0LFxuXHRcdFx0J21lc3NhZ2V0YWJsZSc6IHRoaXMuc2V0TWVzc2FnZVRhYmxlQ2hhcnQsXG5cdFx0XHQnZ3JpZCc6IHRoaXMuc2V0R3JpZENoYXJ0LFxuXHRcdFx0J21lc3NhZ2VncmlkJzogdGhpcy5zZXRNZXNzYWdlZ3JpZENoYXJ0LFxuXHRcdFx0J21hcCc6IHRoaXMuc2V0TWFwLFxuXHRcdFx0J3BhcmFtZXRlcm1hcCc6IHRoaXMuc2V0UGFyYW1ldGVybWFwLFxuXHRcdFx0J3BpZSc6IHRoaXMuc2V0UGllQ2hhcnQsXG5cdFx0XHQnaGlnaG1hcHMnIDogdGhpcy5zZXRIaWdobWFwcyxcblx0XHRcdCd0YWJ0YWJsZScgOiB0aGlzLnNldFRhYlRhYmxlQ2hhcnQsXG5cdFx0XHQndHJlZW1hcCcgOiB0aGlzLnNldFRyZWVNYXBDaGFydFxuXHR9O1xuXG5cdHRoaXMuc2V0Q29udGVudHMgPSBmdW5jdGlvbiAoaXRlbSwgd2lkZ2V0LCBzdHJpY3RNb2RlKSB7XG5cdFx0aWYgKHN0cmljdE1vZGUgJiYgaXRlbS5jaGVja2VkID09PSB0cnVlKSB7cmV0dXJuO31cblx0XHQvLyB2YXIgY2hhcnRQaWNrZXIgPSAkKCdkaXYuaXVpLWRhc2hib2FyZC1pdGVtcycpO1xuXHRcdC8vIGNoYXJ0UGlja2VyLmRhc2hib2FyZGl0ZW1zKCd0b2dnbGVJdGVtJywgaXRlbS5pZCwgdHJ1ZSwgZmFsc2UpO1xuXHRcdHRoaXMuY2hhcnRDcmVhdG9yTWFwW2l0ZW0udHlwZSB8fCAndGFibGUnXS5jYWxsKHRoaXMsIGl0ZW0sIHdpZGdldCk7XG5cdH07XG5cblx0dGhpcy5yZW1vdmVDb250ZW50cyA9IGZ1bmN0aW9uIChpdGVtcykge1xuXHRcdC8vIHZhciBjaGFydFBpY2tlciA9ICQoJ2Rpdi5pdWktZGFzaGJvYXJkLWl0ZW1zJyk7XG5cdFx0aXRlbXMgPSAkLmlzQXJyYXkoaXRlbXMpXG5cdFx0PyBpdGVtc1xuXHRcdFx0XHQ6IFtpdGVtc107XG5cdFx0Xy5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0Ly8gaWYgKGl0ZW0uY2hlY2tlZCAhPT0gdHJ1ZSlcblx0XHRcdC8vICByZXR1cm47XG5cdFx0XHQvLyBjaGFydFBpY2tlci5kYXNoYm9hcmRpdGVtcygndG9nZ2xlSXRlbScsIGl0ZW0uaWQsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHQkKCcuaXVpLWRhc2hib2FyZC1jaGFydCcsIGl0ZW0uZWwpLmVhY2goZnVuY3Rpb24gKGksIGNoYXJ0KSB7XG5cdFx0XHRcdGNoYXJ0ID0gJChjaGFydCk7XG5cdFx0XHRcdHZhciBuYW1lID0gJ2NoYXJ0JyArIGl0ZW0udHlwZTtcblx0XHRcdFx0aWYgKGNoYXJ0W25hbWVdKSB7XG5cdFx0XHRcdFx0KGNoYXJ0W25hbWVdKSgnZGVzdHJveScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHRoaXMuc2V0V2lkZ2V0UGFyYW1zID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXHRcdGRhc2hib2FyZFdpZGdldElkeCA9IDA7XG5cdFx0Xy5lYWNoKHRoaXMud2lkZ2V0cywgZnVuY3Rpb24gKHdpZGdldCwgaW5kZXgpIHtcblx0XHRcdF8uZWFjaCh3aWRnZXQub3B0aW9ucy5pdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0aWYoaXRlbS5lbCl7XG5cdFx0XHRcdFx0JCgnLml1aS1kYXNoYm9hcmQtY2hhcnQnLCBpdGVtLmVsKS5lYWNoKGZ1bmN0aW9uIChpLCBjaGFydCkge1xuXHRcdFx0XHRcdFx0Y2hhcnQgPSAkKGNoYXJ0KTtcblx0XHRcdFx0XHRcdC8vdmFyIG5hbWUgPSAnY2hhcnQnICsgaXRlbS50eXBlO1xuXHRcdFx0XHRcdFx0dmFyIG5hbWUgPSAnY2hhcnQnICsgY2hhcnQuYXR0cihcImRhdGEtY2hhcnRcIilcblx0XHRcdFx0XHRcdGlmIChjaGFydFtuYW1lXSkge1xuXHRcdFx0XHRcdFx0XHQoY2hhcnRbbmFtZV0pKCdvcHRpb24nLCAncGFyYW1zJywgcGFyYW1zKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG5hbWUgPSBudWxsO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHR0aGlzLnNldFdpZGdldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdGxldmVsID0gbGV2ZWwgPT09IHVuZGVmaW5lZFxuXHRcdD8gc2VsZi50YWJJbmRleFxuXHRcdFx0XHQ/IHNlbGYudGFiSW5kZXhcblx0XHRcdFx0XHRcdDogMFxuXHRcdFx0XHRcdFx0OiBsZXZlbDtcblx0XHRpZiAobGV2ZWwgPT09IDApIHtcblx0XHRcdC8vIO2Gte2VqSDqtIDsoJxcblx0XHRcdHNlbGYudGFiSW5kZXggPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyDthrXtlakg7ZiE7ZmpXG5cdFx0XHRzZWxmLnRhYkluZGV4ID0gMTtcblx0XHR9XG5cdFx0Xy5lYWNoKHNlbGYud2lkZ2V0cywgZnVuY3Rpb24gKHdpZGdldCkge1xuXHRcdFx0aWYgKHdpZGdldC5vcHRpb25zLml0ZW1zLmxlbmd0aCA+IDEpIHskKHdpZGdldC5lbCkuZGFzaGJvYXJkd2lkZ2V0KCdvcHRpb24nLCAnYWN0aXZldGFiJywgc2VsZi50YWJJbmRleCk7fVxuXHRcdH0pO1xuXG5cdFx0c2VsZiA9IG51bGw7XG5cdH07XG5cblx0dGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRkYXNoYm9hcmRXaWRnZXRJZHggPSAwO1xuXHRcdF8uZWFjaCh0aGlzLndpZGdldHMsIGZ1bmN0aW9uICh3aWRnZXQpIHtcblx0XHRcdF8uZWFjaCh3aWRnZXQub3B0aW9ucy5pdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0JCgnLml1aS1kYXNoYm9hcmQtY2hhcnQnLCBpdGVtLmVsKS5lYWNoKGZ1bmN0aW9uIChpLCBjaGFydCkge1xuXHRcdFx0XHRcdGNoYXJ0ID0gJChjaGFydCk7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSAnY2hhcnQnICsgaXRlbS50eXBlO1xuXHRcdFx0XHRcdGlmIChuYW1lID09IHR5cGUpIHtcblx0XHRcdFx0XHRcdGlmIChjaGFydFtuYW1lXSkge1xuXHRcdFx0XHRcdFx0XHQoY2hhcnRbbmFtZV0pKCdyZWZyZXNoJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5hbWUgPSBudWxsO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBzZWxmID0gdGhpcztcblxuXHR2YXIgcmVzaXplID0gZnVuY3Rpb24gKHVpKSB7XG5cdFx0JCgnLml1aS1kYXNoYm9hcmQtY2hhcnQnLCB1aSkuZWFjaChmdW5jdGlvbiAoaSwgY2hhcnQpIHtcblx0XHRcdGNoYXJ0ID0gJChjaGFydCk7XG5cdFx0XHR2YXIgbmFtZSA9ICdjaGFydCcgKyBjaGFydC5kYXRhKCdjaGFydCcpO1xuXHRcdFx0aWYgKGNoYXJ0W25hbWVdKSB7XG5cdFx0XHRcdChjaGFydFtuYW1lXSkoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdFx0Y2hhcnQgPSBudWxsO1xuXHRcdFx0bmFtZSA9IG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0JCgnLmdyaWQtc3RhY2snKS5vbigncmVzaXplc3RvcCcsIGZ1bmN0aW9uIChlLCB1aSkge1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVzaXplKGUudGFyZ2V0KTtcblx0XHR9LCA2MDApO1xuXHR9KTtcblxuXHR2YXIgcmVzaXplVGltZUlkID0gMDtcblx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdGlmIChlLnRhcmdldCAhPT0gd2luZG93KSB7cmV0dXJuO31cblx0XHRjbGVhclRpbWVvdXQocmVzaXplVGltZUlkKTtcblx0XHRyZXNpemVUaW1lSWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXNpemUoJCgnLmdyaWQtc3RhY2snKSk7XG5cdFx0fSwgNjAwKTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBtYWtlU2VhcmNoRWxlbWVudChpdGVtLCBncm91cE9iaiwgZWxlbWVudFR5cGUpe1xuXHRpZihpdGVtLnNlYXJjaCl7XG5cdFx0dmFyIHNlYXJjaEZvcm0gPSAkKFwiPGZvcm0gaWQ9J1wiK2l0ZW0uaWQrXCJfZm9ybSc+XCIpO1xuXHRcdHZhciBzZWFyY2hEaXYgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWhlYWRlci1yaWdodCc+XCIpO1x0XG5cdFx0c2VhcmNoRm9ybS5hcHBlbmQoc2VhcmNoRGl2KTtcblx0XHRcblx0XHRncm91cE9iai5maW5kKFwiLml0ZW0taGVhZGVyXCIpLmFwcGVuZChzZWFyY2hGb3JtKTtcdFxuXHRcdFxuXHRcdGlmKGl0ZW0uc2VhcmNoRGF0YSl7XG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmwgOiBpdGVtLnNlYXJjaERhdGEsXG5cdFx0XHRcdHR5cGUgOiBcInBvc3RcIixcblx0XHRcdFx0ZGF0YVR5cGUgOiBcImpzb25cIixcblx0XHRcdFx0ZGF0YSA6IGl0ZW0uc2VhcmNoUGFyYW0sXG5cdFx0XHRcdHN1Y2Nlc3MgOiBmdW5jdGlvbihhamF4RGF0YSl7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQkLmVhY2goaXRlbS5zZWFyY2gsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR2YXIgc2VhcmNoSXRlbTtcblx0XHRcdFx0XHRcdGlmKHRoaXMudHlwZSA9PSBcInNlbGVjdFwiKXtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdHNlYXJjaERpdi5hcHBlbmQoXCI8bGFiZWwgY2xhc3M9J2l3LWxhYmVsJz5cIit0aGlzLmxhYmVsK1wiPC9sYWJlbD4mbmJzcDtcIik7XG5cdFx0XHRcdFx0XHRcdHZhciBldmVudFRlbXAgPSB0aGlzLm9uY2hhbmdlID8gXCJvbmNoYW5nZT1cIit0aGlzLm9uY2hhbmdlIDogXCJcIjtcblxuXHRcdFx0XHRcdFx0XHRzZWFyY2hJdGVtID0gJChcIjxzZWxlY3QgY2xhc3M9J2l3LXNlbGVjdCcgbmFtZT0nXCIrdGhpcy5uYW1lK1wiJyBzdHlsZT0nd2lkdGg6XCIrdGhpcy53aWR0aCtcIicgXCIrZXZlbnRUZW1wK1wiPlwiKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdHNlYXJjaEl0ZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nYWxsJz7soITssrQ8L29wdGlvbj5cIik7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChhamF4RGF0YVt0aGlzLm5hbWVdLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHNlYXJjaEl0ZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIrdGhpcy5jb2RlVmFsdWUrXCInPlwiK3RoaXMuY29kZU5hbWUrXCI8L29wdGlvbj5cIik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdHNlYXJjaERpdi5hcHBlbmQoc2VhcmNoSXRlbSk7XG5cblx0XHRcdFx0XHRcdH1lbHNlIGlmKHRoaXMudHlwZSA9PVwiZGF0ZXBpY2tlclwiKXtcblx0XHRcdFx0XHRcdFx0dmFyIGRhdGVwaWNrZXJUZW1wID0gJzxsYWJlbCBjbGFzcz1cIml3LWxhYmVsXCI+Jyt0aGlzLmxhYmVsKyc8L2xhYmVsPiZuYnNwOzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzdGFydERhdGVcIiBjbGFzcz1cIml3LWlucHV0XCIgc3R5bGU9XCJ3aWR0aDogODBweDtcIiByZWFkb25seT4gJ1xuXHRcdFx0XHRcdFx0XHRcdFx0Kyc8YSBocmVmPVwiI1wiIGNsYXNzPVwiZHQxXCIgc3R5bGU9XCJjb2xvcjpibGFjazsgb3V0bGluZTpub25lO1wiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNhbGVuZGFyXCI+PC9pPjwvYT4gfiAnXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbmREYXRlXCIgY2xhc3M9XCJpdy1pbnB1dFwiIHN0eWxlPVwid2lkdGg6IDgwcHg7XCIgcmVhZG9ubHk+ICdcblx0XHRcdFx0XHRcdFx0XHRcdCsnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImR0MlwiIHN0eWxlPVwiY29sb3I6YmxhY2s7IG91dGxpbmU6bm9uZTtcIj48aSBjbGFzcz1cImljb24gaWNvbi1jYWxlbmRhclwiPjwvaT48L2E+ICZuYnNwOyc7XG5cblx0XHRcdFx0XHRcdFx0c2VhcmNoRGl2LnByZXBlbmQoZGF0ZXBpY2tlclRlbXApO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0dmFyIHRlbXAgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdFx0XHR2YXIgdGVtcDIgPSB0ZW1wLnNldERhdGUodGVtcC5nZXREYXRlKCktMTQwKTtcblx0XHRcdFx0XHRcdFx0dGVtcDIgPSBuZXcgRGF0ZSh0ZW1wMik7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLnZhbCgkLmRhdGVwaWNrZXIuZm9ybWF0RGF0ZSgkLmRhdGVwaWNrZXIuQVRPTSwgdGVtcDIpKTtcblx0XHRcdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9ZW5kRGF0ZV1cIikudmFsKCQuZGF0ZXBpY2tlci5mb3JtYXREYXRlKCQuZGF0ZXBpY2tlci5BVE9NLCBuZXcgRGF0ZSgpKSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHR2YXIgbW9udGhOYW1lcyA9IFsnMeyblCcsJzLsm5QnLCcz7JuUJywgJzTsm5QnLCAnNeyblCcsICc27JuUJywgJzfsm5QnLCAnOOyblCcsICc57JuUJywgJzEw7JuUJywgJzEx7JuUJywgJzEy7JuUJ107XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoe1xuXHRcdFx0XHRcdFx0XHRcdGRhdGVGb3JtYXQgOiBcInl5LW1tLWRkXCIsXG5cdFx0XHRcdFx0XHRcdFx0bWF4RGF0ZTogMCxcblx0XHRcdFx0XHRcdFx0XHRwcmV2VGV4dDogJ+ydtOyghCDri6wnLFxuXHRcdFx0XHRcdFx0XHRcdG5leHRUZXh0OiAn64uk7J2MIOuLrCcsXG5cdFx0XHRcdFx0XHRcdFx0bW9udGhOYW1lczogbW9udGhOYW1lcyxcblx0XHRcdFx0XHRcdFx0XHRzaG93TW9udGhBZnRlclllYXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0b25DbG9zZSA6IGZ1bmN0aW9uKHNlbGVjdGVkRGF0ZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoJ2dldERhdGUnKS5nZXRUaW1lKCkgPiBzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1lbmREYXRlXVwiKS5kYXRlcGlja2VyKCdnZXREYXRlJykuZ2V0VGltZSgpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9ZW5kRGF0ZV1cIikudmFsKHNlbGVjdGVkRGF0ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdHNlYXJjaExpc3QoaXRlbS5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIltuYW1lPWVuZERhdGVdXCIpLmRhdGVwaWNrZXIoe1xuXHRcdFx0XHRcdFx0XHRcdGRhdGVGb3JtYXQgOiBcInl5LW1tLWRkXCIsXG5cdFx0XHRcdFx0XHRcdFx0bWF4RGF0ZTogMCxcblx0XHRcdFx0XHRcdFx0XHRwcmV2VGV4dDogJ+ydtOyghCDri6wnLFxuXHRcdFx0XHRcdFx0XHRcdG5leHRUZXh0OiAn64uk7J2MIOuLrCcsXG5cdFx0XHRcdFx0XHRcdFx0bW9udGhOYW1lczogbW9udGhOYW1lcyxcblx0XHRcdFx0XHRcdFx0XHRzaG93TW9udGhBZnRlclllYXI6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0b25DbG9zZSA6IGZ1bmN0aW9uKHNlbGVjdGVkRGF0ZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoJ2dldERhdGUnKS5nZXRUaW1lKCkgPiBzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1lbmREYXRlXVwiKS5kYXRlcGlja2VyKCdnZXREYXRlJykuZ2V0VGltZSgpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9c3RhcnREYXRlXVwiKS52YWwoc2VsZWN0ZWREYXRlKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0c2VhcmNoTGlzdChpdGVtLmlkKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCIuZHQxXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoXCJzaG93XCIpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIi5kdDJcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIltuYW1lPWVuZERhdGVdXCIpLmRhdGVwaWNrZXIoXCJzaG93XCIpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1oZWFkZXJcIikuYXBwZW5kKHNlYXJjaEZvcm0pO1x0XG5cblx0XHRcdFx0XHRpZihlbGVtZW50VHlwZSA9PSBcImxpbmVcIil7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IGxpbmVcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdsaW5lJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRsaW5lKHsnZGF0YSc6IGl0ZW0uZGF0YSwgaW50ZXJ2YWw6IGl0ZW0uaW50ZXJ2YWwsIGNvbG9yOiBpdGVtLmNvbG9yLCBsYWJlbCA6IGl0ZW0ubGFiZWwsIGlkOiBpdGVtLmlkfSkpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwiYmFyXCIpe1xuXHRcdFx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBiYXJcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdiYXInKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydGJhcih7ZGF0YTogaXRlbS5kYXRhLCBtYXg6IGl0ZW0ubWF4LCBtaW46IGl0ZW0ubWluLCBpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCwgY29sb3I6IGl0ZW0uY29sb3IsIGlkIDogaXRlbS5pZCwgZ3JhcGhUeXBlOiBpdGVtLmdyYXBoVHlwZX0pKTtcblx0XHRcdFx0XHR9ZWxzZSBpZihlbGVtZW50VHlwZSA9PSBcImNvbHVtblwiKXtcblx0XHRcdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHdpbmRvdy5pdWkuZGFzaGJvYXJkLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgY29sdW1uXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnY29sdW1uJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRjb2x1bW4oe2l0ZW06IGl0ZW0sIGlkIDogaXRlbS5pZH0pKTtcblx0XHRcdFx0XHR9ZWxzZSBpZihlbGVtZW50VHlwZSA9PSBcInRpbWVzZXJpZXNcIil7XG5cdFx0XHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHRpbWVzZXJpZXNcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICd0aW1lc2VyaWVzJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnR0aW1lc2VyaWVzKHtpdGVtOiBpdGVtLCBpZCA6IGl0ZW0uaWR9KSk7XG5cdFx0XHRcdFx0fWVsc2UgaWYoZWxlbWVudFR5cGUgPT0gXCJncmlkXCIpe1xuXHRcdFx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBncmlkXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnZ3JpZCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0Z3JpZCh7aXRlbTogaXRlbSwgaWQgOiBpdGVtLmlkfSkpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwibWFwXCIpe1xuXHRcdFx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBtYXBcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdncmlkJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRncmlkKHtpdGVtOiBpdGVtLCBpZCA6IGl0ZW0uaWR9KSk7XG5cdFx0XHRcdFx0fWVsc2UgaWYoZWxlbWVudFR5cGUgPT0gXCJwYXJhbWV0ZXJtYXBcIil7XG5cdFx0XHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHBhcmFtZXRlcm1hcFwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3BhcmFtZXRlcm1hcCcpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0cGFyYW1ldGVybWFwKHt0aXRsZTogaXRlbS5sYWJlbCwgZGF0YTogaXRlbS5kYXRhLCB0ZW1wbGF0ZTogaXRlbS50ZW1wbGF0ZSwgaWQgOiBpdGVtLmlkfSkpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwicGllXCIpe1xuXHRcdFx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBwaWVcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdwaWUnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydHBpZSh7ZGF0YTogaXRlbS5kYXRhLCBpbnRlcnZhbDogaXRlbS5pbnRlcnZhbCwgY29sb3I6IGl0ZW0uY29sb3IsIGlkIDogaXRlbS5pZH0pKTtcblx0XHRcdFx0XHR9ZWxzZSBpZihlbGVtZW50VHlwZSA9PSBcImhpZ2htYXBzXCIpe1xuXHRcdFx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBoaWdobWFwc1wiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2hpZ2htYXBzJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRoaWdobWFwcyh7dGl0bGU6IGl0ZW0ubGFiZWwsIGRhdGE6IGl0ZW0uZGF0YSwgdGVtcGxhdGU6IGl0ZW0udGVtcGxhdGV9KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvciA6IGZ1bmN0aW9uKGVycm9yLCByZXF1ZXN0LCBzdGF0dXMpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkLmVhY2goaXRlbS5zZWFyY2gsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBzZWFyY2hJdGVtO1xuXG5cdFx0XHRcdGlmKHRoaXMudHlwZSA9PVwiZGF0ZXBpY2tlclwiKXtcblx0XHRcdFx0XHR2YXIgZGF0ZXBpY2tlclRlbXAgPSAnPGxhYmVsIGNsYXNzPVwiaXctbGFiZWxcIj4nK3RoaXMubGFiZWwrJzwvbGFiZWw+Jm5ic3A7PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInN0YXJ0RGF0ZVwiIGNsYXNzPVwiaXctaW5wdXRcIiBzdHlsZT1cIndpZHRoOiA4MHB4O1wiIHJlYWRvbmx5PiAnXG5cdFx0XHRcdFx0XHRcdCsnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImR0MVwiIHN0eWxlPVwiY29sb3I6YmxhY2s7IG91dGxpbmU6bm9uZTtcIj48aSBjbGFzcz1cImljb24gaWNvbi1jYWxlbmRhclwiPjwvaT48L2E+IH4gJ1xuXHRcdFx0XHRcdFx0XHQrJzxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbmREYXRlXCIgY2xhc3M9XCJpdy1pbnB1dFwiIHN0eWxlPVwid2lkdGg6IDgwcHg7XCIgcmVhZG9ubHk+ICdcblx0XHRcdFx0XHRcdFx0Kyc8YSBocmVmPVwiI1wiIGNsYXNzPVwiZHQyXCIgc3R5bGU9XCJjb2xvcjpibGFjazsgb3V0bGluZTpub25lO1wiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNhbGVuZGFyXCI+PC9pPjwvYT4gJm5ic3A7JztcblxuXHRcdFx0XHRcdHNlYXJjaERpdi5wcmVwZW5kKGRhdGVwaWNrZXJUZW1wKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgdGVtcCA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0dmFyIHRlbXAyID0gdGVtcC5zZXREYXRlKHRlbXAuZ2V0RGF0ZSgpLTE0MCk7XG5cdFx0XHRcdFx0dGVtcDIgPSBuZXcgRGF0ZSh0ZW1wMik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9c3RhcnREYXRlXVwiKS52YWwoJC5kYXRlcGlja2VyLmZvcm1hdERhdGUoJC5kYXRlcGlja2VyLkFUT00sIHRlbXAyKSk7XG5cdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9ZW5kRGF0ZV1cIikudmFsKCQuZGF0ZXBpY2tlci5mb3JtYXREYXRlKCQuZGF0ZXBpY2tlci5BVE9NLCBuZXcgRGF0ZSgpKSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIG1vbnRoTmFtZXMgPSBbJzHsm5QnLCcy7JuUJywnM+yblCcsICc07JuUJywgJzXsm5QnLCAnNuyblCcsICc37JuUJywgJzjsm5QnLCAnOeyblCcsICcxMOyblCcsICcxMeyblCcsICcxMuyblCddO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIltuYW1lPXN0YXJ0RGF0ZV1cIikuZGF0ZXBpY2tlcih7XG5cdFx0XHRcdFx0XHRkYXRlRm9ybWF0IDogXCJ5eS1tbS1kZFwiLFxuXHRcdFx0XHRcdFx0bWF4RGF0ZTogMCxcblx0XHRcdFx0XHRcdHByZXZUZXh0OiAn7J207KCEIOuLrCcsXG5cdFx0XHRcdFx0XHRuZXh0VGV4dDogJ+uLpOydjCDri6wnLFxuXHRcdFx0XHRcdFx0bW9udGhOYW1lczogbW9udGhOYW1lcyxcblx0XHRcdFx0XHRcdHNob3dNb250aEFmdGVyWWVhcjogdHJ1ZSxcblx0XHRcdFx0XHRcdG9uQ2xvc2UgOiBmdW5jdGlvbihzZWxlY3RlZERhdGUpe1xuXHRcdFx0XHRcdFx0XHRpZihzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoJ2dldERhdGUnKS5nZXRUaW1lKCkgPiBzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1lbmREYXRlXVwiKS5kYXRlcGlja2VyKCdnZXREYXRlJykuZ2V0VGltZSgpKXtcblx0XHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1lbmREYXRlXVwiKS52YWwoc2VsZWN0ZWREYXRlKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHNlYXJjaExpc3QoaXRlbS5pZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9ZW5kRGF0ZV1cIikuZGF0ZXBpY2tlcih7XG5cdFx0XHRcdFx0XHRkYXRlRm9ybWF0IDogXCJ5eS1tbS1kZFwiLFxuXHRcdFx0XHRcdFx0bWF4RGF0ZTogMCxcblx0XHRcdFx0XHRcdHByZXZUZXh0OiAn7J207KCEIOuLrCcsXG5cdFx0XHRcdFx0XHRuZXh0VGV4dDogJ+uLpOydjCDri6wnLFxuXHRcdFx0XHRcdFx0bW9udGhOYW1lczogbW9udGhOYW1lcyxcblx0XHRcdFx0XHRcdHNob3dNb250aEFmdGVyWWVhcjogdHJ1ZSxcblx0XHRcdFx0XHRcdG9uQ2xvc2UgOiBmdW5jdGlvbihzZWxlY3RlZERhdGUpe1xuXHRcdFx0XHRcdFx0XHRpZihzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLmRhdGVwaWNrZXIoJ2dldERhdGUnKS5nZXRUaW1lKCkgPiBzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1lbmREYXRlXVwiKS5kYXRlcGlja2VyKCdnZXREYXRlJykuZ2V0VGltZSgpKXtcblx0XHRcdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCJbbmFtZT1zdGFydERhdGVdXCIpLnZhbChzZWxlY3RlZERhdGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRzZWFyY2hMaXN0KGl0ZW0uaWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzZWFyY2hGb3JtLmZpbmQoXCIuZHQxXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIltuYW1lPXN0YXJ0RGF0ZV1cIikuZGF0ZXBpY2tlcihcInNob3dcIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHNlYXJjaEZvcm0uZmluZChcIi5kdDJcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0c2VhcmNoRm9ybS5maW5kKFwiW25hbWU9ZW5kRGF0ZV1cIikuZGF0ZXBpY2tlcihcInNob3dcIik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1oZWFkZXJcIikuYXBwZW5kKHNlYXJjaEZvcm0pO1x0XG5cblx0XHRcdGlmKGVsZW1lbnRUeXBlID09IFwibGluZVwiKXtcdFx0XHRcdFx0XHRcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBsaW5lXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnbGluZScpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0bGluZSh7J2RhdGEnOiBpdGVtLmRhdGEsIGludGVydmFsOiBpdGVtLmludGVydmFsLCBjb2xvcjogaXRlbS5jb2xvciwgbGFiZWwgOiBpdGVtLmxhYmVsLCBpZDogaXRlbS5pZH0pKTtcblx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwiYmFyXCIpe1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IGJhclwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2JhcicpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0YmFyKHtkYXRhOiBpdGVtLmRhdGEsIG1heDogaXRlbS5tYXgsIG1pbjogaXRlbS5taW4sIGludGVydmFsOiBpdGVtLmludGVydmFsLCBjb2xvcjogaXRlbS5jb2xvciwgaWQgOiBpdGVtLmlkLCBncmFwaFR5cGU6IGl0ZW0uZ3JhcGhUeXBlfSkpO1xuXHRcdFx0fWVsc2UgaWYoZWxlbWVudFR5cGUgPT0gXCJjb2x1bW5cIil7XG5cdFx0XHRcdGdyb3VwT2JqLmZpbmQoXCIuaXRlbS1ib2R5XCIpLmFwcGVuZCgkKCc8ZGl2IGlkPVwiY2hhcnRfJyArIHdpbmRvdy5pdWkuZGFzaGJvYXJkLmNoYXJ0SWQrKyArICdcIj48L2Rpdj4nKS5hZGRDbGFzcyhcIndpZGdldC1saXN0IGxpc3Qtc3R5bGUzIGZsb3d0eXBlIGl1aS1kYXNoYm9hcmQtY2hhcnQgY29sdW1uXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAnY29sdW1uJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRjb2x1bW4oe2l0ZW06IGl0ZW0sIGlkIDogaXRlbS5pZH0pKTtcblx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwidGltZXNlcmllc1wiKXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCB0aW1lc2VyaWVzXCIrKGl0ZW0uaXRlbXR5cGUgPT0gXCJncm91cFwiID8gXCIgZ3JvdXAtY2VsbFwiIDogXCJcIikpLmF0dHIoJ2RhdGEtY2hhcnQnLCAndGltZXNlcmllcycpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0dGltZXNlcmllcyh7aXRlbTogaXRlbSwgaWQgOiBpdGVtLmlkfSkpO1xuXHRcdFx0fWVsc2UgaWYoZWxlbWVudFR5cGUgPT0gXCJncmlkXCIpe1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IGdyaWRcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdncmlkJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRncmlkKHtpdGVtOiBpdGVtLCBpZCA6IGl0ZW0uaWR9KSk7XG5cdFx0XHR9ZWxzZSBpZihlbGVtZW50VHlwZSA9PSBcIm1hcFwiKXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBtYXBcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdncmlkJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRncmlkKHtpdGVtOiBpdGVtLCBpZCA6IGl0ZW0uaWR9KSk7XG5cdFx0XHR9ZWxzZSBpZihlbGVtZW50VHlwZSA9PSBcInBhcmFtZXRlcm1hcFwiKXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBwYXJhbWV0ZXJtYXBcIisoaXRlbS5pdGVtdHlwZSA9PSBcImdyb3VwXCIgPyBcIiBncm91cC1jZWxsXCIgOiBcIlwiKSkuYXR0cignZGF0YS1jaGFydCcsICdwYXJhbWV0ZXJtYXAnKS5hcHBlbmRUbyhpdGVtLmVsKS5jaGFydHBhcmFtZXRlcm1hcCh7dGl0bGU6IGl0ZW0ubGFiZWwsIGRhdGE6IGl0ZW0uZGF0YSwgdGVtcGxhdGU6IGl0ZW0udGVtcGxhdGUsIGlkIDogaXRlbS5pZH0pKTtcblx0XHRcdH1lbHNlIGlmKGVsZW1lbnRUeXBlID09IFwicGllXCIpe1xuXHRcdFx0XHRncm91cE9iai5maW5kKFwiLml0ZW0tYm9keVwiKS5hcHBlbmQoJCgnPGRpdiBpZD1cImNoYXJ0XycgKyB3aW5kb3cuaXVpLmRhc2hib2FyZC5jaGFydElkKysgKyAnXCI+PC9kaXY+JykuYWRkQ2xhc3MoXCJ3aWRnZXQtbGlzdCBsaXN0LXN0eWxlMyBmbG93dHlwZSBpdWktZGFzaGJvYXJkLWNoYXJ0IHBpZVwiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ3BpZScpLmFwcGVuZFRvKGl0ZW0uZWwpLmNoYXJ0cGllKHtkYXRhOiBpdGVtLmRhdGEsIGludGVydmFsOiBpdGVtLmludGVydmFsLCBjb2xvcjogaXRlbS5jb2xvciwgaWQgOiBpdGVtLmlkfSkpO1xuXHRcdFx0fWVsc2UgaWYoZWxlbWVudFR5cGUgPT0gXCJoaWdobWFwc1wiKXtcblx0XHRcdFx0Z3JvdXBPYmouZmluZChcIi5pdGVtLWJvZHlcIikuYXBwZW5kKCQoJzxkaXYgaWQ9XCJjaGFydF8nICsgd2luZG93Lml1aS5kYXNoYm9hcmQuY2hhcnRJZCsrICsgJ1wiPjwvZGl2PicpLmFkZENsYXNzKFwid2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMgZmxvd3R5cGUgaXVpLWRhc2hib2FyZC1jaGFydCBoaWdobWFwc1wiKyhpdGVtLml0ZW10eXBlID09IFwiZ3JvdXBcIiA/IFwiIGdyb3VwLWNlbGxcIiA6IFwiXCIpKS5hdHRyKCdkYXRhLWNoYXJ0JywgJ2hpZ2htYXBzJykuYXBwZW5kVG8oaXRlbS5lbCkuY2hhcnRoaWdobWFwcyh7dGl0bGU6IGl0ZW0ubGFiZWwsIGRhdGE6IGl0ZW0uZGF0YSwgdGVtcGxhdGU6IGl0ZW0udGVtcGxhdGV9KSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cbn1cblxuLy/snITqsp8g7Yyo65SpIOyEpOyglVxuZnVuY3Rpb24gaW5pdFdpZGdldFBhZGRpbmdzKHBhcmVudCkge1xuXHQvKlxuXHQkKCcucG9zaXRpb24tdG9wJywgcGFyZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG5cdFx0dmFyICR0aGlzID0gJChlKTtcblx0XHR2YXIgcGFkZGluZyA9ICR0aGlzLnBhcmVudCgpLmF0dHIoJ2RhdGEtcGFkZGluZy10b3AnKTtcblx0XHRpZiAocGFkZGluZyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYWRkaW5nID0gcGFyc2VJbnQoJHRoaXMucGFyZW50KCkuY3NzKFwicGFkZGluZy10b3BcIikucmVwbGFjZShcInB4XCIsIFwiXCIpLCAxMCk7XG5cdFx0XHQkdGhpcy5wYXJlbnQoKS5hdHRyKCdkYXRhLXBhZGRpbmctdG9wJywgcGFkZGluZyk7XG5cdFx0fVxuXHRcdCR0aGlzLnBhcmVudCgpLmNzcyhcInBhZGRpbmctdG9wXCIsIHBhZGRpbmcgKyAkdGhpcy5vdXRlckhlaWdodCh0cnVlKSArIFwicHhcIik7XG5cdFx0JHRoaXMuY3NzKFwidG9wXCIsIHBhZGRpbmcgKyBcInB4XCIpO1xuXHR9KTtcblxuXHQkKCQoJy5wb3NpdGlvbi1yaWdodCcsIHBhcmVudCkuZ2V0KCkucmV2ZXJzZSgpKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHR2YXIgcGFkZGluZyA9ICR0aGlzLnBhcmVudCgpLmF0dHIoJ2RhdGEtcGFkZGluZy1yaWdodCcpO1xuXHRcdGlmIChwYWRkaW5nID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhZGRpbmcgPSBwYXJzZUludCgkdGhpcy5wYXJlbnQoKS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpLnJlcGxhY2UoXCJweFwiLCBcIlwiKSwgMTApO1xuXHRcdFx0JHRoaXMucGFyZW50KCkuYXR0cignZGF0YS1wYWRkaW5nLXJpZ2h0JywgcGFkZGluZyk7XG5cdFx0fVxuXHRcdCR0aGlzLnBhcmVudCgpLmNzcyhcInBhZGRpbmctcmlnaHRcIiwgcGFkZGluZyArICR0aGlzLm91dGVyV2lkdGgodHJ1ZSkgKyBcInB4XCIpO1xuXHRcdCR0aGlzLmNzcyhcInJpZ2h0XCIsIHBhZGRpbmcgKyBcInB4XCIpO1xuXHR9KTtcblxuXHQkKCQoJy5wb3NpdGlvbi1ib3R0b20nLCBwYXJlbnQpLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuXHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0dmFyIHBhZGRpbmcgPSAkdGhpcy5wYXJlbnQoKS5hdHRyKCdkYXRhLXBhZGRpbmctYm90dG9tJyk7XG5cdFx0aWYgKHBhZGRpbmcgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFkZGluZyA9IHBhcnNlSW50KCR0aGlzLnBhcmVudCgpLmNzcyhcInBhZGRpbmctYm90dG9tXCIpLnJlcGxhY2UoXCJweFwiLCBcIlwiKSwgMTApO1xuXHRcdFx0JHRoaXMucGFyZW50KCkuYXR0cignZGF0YS1wYWRkaW5nLWJvdHRvbScsIHBhZGRpbmcpO1xuXHRcdH1cblx0XHQkdGhpcy5wYXJlbnQoKS5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiLCBwYWRkaW5nICsgJHRoaXMub3V0ZXJIZWlnaHQodHJ1ZSkgKyBcInB4XCIpO1xuXHRcdCR0aGlzLmNzcyhcImJvdHRvbVwiLCBwYWRkaW5nICsgXCJweFwiKTtcblx0fSk7XG5cdFxuXHQkKCcucG9zaXRpb24tbGVmdCcsIHBhcmVudCkuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuXHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0dmFyIHBhZGRpbmcgPSAkdGhpcy5wYXJlbnQoKS5hdHRyKCdkYXRhLXBhZGRpbmctbGVmdCcpO1xuXHRcdGlmIChwYWRkaW5nID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhZGRpbmcgPSBwYXJzZUludCgkdGhpcy5wYXJlbnQoKS5jc3MoXCJwYWRkaW5nLWxlZnRcIikucmVwbGFjZShcInB4XCIsIFwiXCIpLCAxMCk7XG5cdFx0XHQkdGhpcy5wYXJlbnQoKS5hdHRyKCdkYXRhLXBhZGRpbmctbGVmdCcsIHBhZGRpbmcpO1xuXHRcdH1cblx0XHQkdGhpcy5wYXJlbnQoKS5jc3MoXCJwYWRkaW5nLWxlZnRcIiwgcGFkZGluZyArICR0aGlzLm91dGVyV2lkdGgodHJ1ZSkgKyBcInB4XCIpO1xuXHRcdCR0aGlzLmNzcyhcImxlZnRcIiwgcGFkZGluZyArIFwicHhcIik7XG5cdH0pOyovXG59XG5cbiQoJy5idG4tZXhwYW5kJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0JChcIiNsYXlvdXRfc2V0dGluZ1wiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcblx0JChcIiNsYXlvdXRfbGlzdFwiKS5zbGlkZVRvZ2dsZSg0MDApO1xuXHRpZiAoJChcIiN3aWRnZXRfc2V0dGluZ1wiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkgeyQoXCIjd2lkZ2V0X3NldHRpbmdcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdCQoXCIjd2lkZ2V0X3NldHRpbmdfcGFuZWxcIikuc2xpZGVUb2dnbGUoMjAwKTt9XG59KTtcblxuLypcbi8vaW5pdFdpZGdldFBhZGRpbmdzKCk7XG5cbi8v66CI7J207JWE7JuDIOyEoO2DnSDtjKjrhJAg7Je06rOgIOuLq+q4sFxuJCgnLmJ0bl9sYXlvdXRfc2V0dGluZycpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdCQoXCIjbGF5b3V0X3NldHRpbmdcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdCQoXCIjbGF5b3V0X2xpc3RcIikuc2xpZGVUb2dnbGUoNDAwKTtcblx0aWYgKCQoXCIjd2lkZ2V0X3NldHRpbmdcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHskKFwiI3dpZGdldF9zZXR0aW5nXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHQkKFwiI3dpZGdldF9zZXR0aW5nX3BhbmVsXCIpLnNsaWRlVG9nZ2xlKDIwMCk7fVxufSk7XG5cbnZhciBmdWxsc2NyZWVuRmxhZyA9IGZhbHNlO1xuLy/snITqsp8g7ISk7KCVIO2MqOuEkCDsl7Tqs6Ag64ur6riwXG4kKCcjYnRuX3dpZGdldF9zZXR0aW5nLCAjYnRuX2xheW91dF9jb25maXJtJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0aWYoIWZ1bGxzY3JlZW5GbGFnKXtcblx0XHQkKFwiI3dpZGdldF9zZXR0aW5nXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdCQoXCIjd2lkZ2V0X3NldHRpbmdfcGFuZWxcIikuc2xpZGVUb2dnbGUoNDAwKTtcblx0XHRpZiAoJChcIiNsYXlvdXRfc2V0dGluZ1wiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xuXHRcdFx0JChcIiNsYXlvdXRfc2V0dGluZ1wiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIjbGF5b3V0X2xpc3RcIikuc2xpZGVUb2dnbGUoMjAwKTtcblx0XHR9XG5cdH1cbn0pO1xuKi9cbi8qKlxuICog7Iuk7Iuc6rCEIOydtOuypO2KuCDrqqnroZ1cbiAqIO2FjOydtOu4lCDtmJXsi50g67O06riw7JmAIO2DgOyehOudvOyduCDrs7TquLAg66qo65OcIO2GoOq4gFxuICovXG5mdW5jdGlvbiB0YWJsZVRvZ2dsZSgpIHtcblx0JCgnLmVycm9yLWxpc3QnKS50b2dnbGVDbGFzcygndGltZWxpbmUnKVxufVxuXG5mdW5jdGlvbiByZXNpemVGb250U2l6ZSgpIHtcblx0Lypcblx0dmFyIHBhbmVsID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignLnBhbmVsLWJvZHknKTtcblx0dmFyIGN1cnJlbnRfc2l6ZSA9IHBhcnNlSW50KHBhbmVsLmNzcyhcImZvbnQtc2l6ZVwiKS5yZXBsYWNlKFwicHhcIiwgXCJcIiksIDEwKTtcblx0aWYgKCQodGhpcykuaGFzQ2xhc3MoJ3VwJykpIHtcblx0XHRpZiAoY3VycmVudF9zaXplIDwgMjApIHtcblx0XHRcdGN1cnJlbnRfc2l6ZSA9IChjdXJyZW50X3NpemUgKyAxKSArIFwicHhcIjtcblx0XHR9XG5cdH0gZWxzZSBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZG93bicpKSB7XG5cdFx0aWYgKGN1cnJlbnRfc2l6ZSA+IDExKSB7XG5cdFx0XHRjdXJyZW50X3NpemUgPSAoY3VycmVudF9zaXplIC0gMSkgKyBcInB4XCI7XG5cdFx0fVxuXHR9XG5cdHBhbmVsLmNzcyh7J2ZvbnQtc2l6ZSc6IGN1cnJlbnRfc2l6ZX0pO1xuXHQqL1xufVxuXG4vL+ugiOydtOyVhOybgyDrtojrn6zsmKTquLBcbi8v7ISk7KCV65CY7Ja0IOyeiOuKlCDslYTsnbTthZwg66Gc65SpXG4vKlxuaXVpXG4gLmRhc2hib2FyZFxuIC5sb2FkR3JpZCgnLi9kYXRhL3VuaWZpZWRfbWFuYWdlbWVudC5qc29uJyk7Ki9cbi8v66CI7J207JWE7JuDIOuzgOqyvSDthYzsiqTtirhcbi8vc2V0VGltZW91dChmdW5jdGlvbiAoZSkge1xuLy9pdWkuZGFzaGJvYXJkLmxvYWRHcmlkKCcuL2RhdGEvbGF5b3V0MS5qc29uJyk7XG4vL30sIDUwMDApO1xuXG5mdW5jdGlvbiBhZGRMYXlvdXRUb0xpc3QoaXRlbSkge1xuXHR2YXIgbGkgPSAkKCc8YT4nKVxuXHQuYXR0cignaHJlZicsICcjJylcblx0LmF0dHIoJ29uY2xpY2snLCBcImdldExheW91dCgnXCIgKyBpdGVtLmxhYmVsICsgXCInKTtcIilcblx0LnRleHQoaXRlbS5sYWJlbClcblx0LndyYXAoJzxsaT4nKVxuXHQucGFyZW50KCk7XG5cblx0JCgnPGk+Jylcblx0LmFkZENsYXNzKCdmYSBmYS1jaGVjaycpXG5cdC5hdHRyKCdhcmlhLWhpZGRlbicsJ3RydWUnKVxuXHQud3JhcCgnPGJ1dHRvbj4nKVxuXHQucGFyZW50KClcblx0LmFkZENsYXNzKCdjb25maXJtJylcblx0LmFwcGVuZFRvKGxpKTtcblx0Ly8g7IKt7KCcIOuyhO2KvCDstpTqsIAuXG5cdCQoJzxpPicpXG5cdC5hZGRDbGFzcygnZmEgZmEtdGltZXMnKVxuXHQuYXR0cignYXJpYS1oaWRkZW4nLCd0cnVlJylcblx0LndyYXAoJzxidXR0b24+Jylcblx0LnBhcmVudCgpXG5cdC5hZGRDbGFzcygncmVtb3ZlJylcblx0LmFwcGVuZFRvKGxpKTtcblxuXHQvLyDrpqzsiqTtirjsnZgg66eI7KeA66eJ7JeQIOyeiOuKlCDroIjsnbTslYTsm4Mg7KCA7J6lIOuyhO2KvCDsnITroZwg7LaU6rCAXG5cdCQocGFyZW50LmRvY3VtZW50KS5maW5kKCdoZWFkZXIgPiAjZGFzaGJvYXJkX3dpZGdldF9kaXYnKS5maW5kKFwiI2xheW91dF9saXN0ID4gbGkgPiBhLmN1cnJlbnQtc2F2ZVwiKVxuXHQucGFyZW50KClcblx0LmJlZm9yZShsaSk7XG59XG5cblxuZnVuY3Rpb24gbWF0aWNzQ29uZmlybShtc2csIGZ1bmNOYW1lKXtcblx0JChcIi5pdy1hbGVydCAuYm9keVwiKS5maW5kKFwicFwiKS50ZXh0KG1zZyk7XG5cdCQoYWxlcnRNb2RhbC5yb290KS5maW5kKFwiLml3LWJsdWVcIikuc2hvdygpO1xuXHQkKGFsZXJ0TW9kYWwucm9vdCkuZmluZChcIi5pdy1ibHVlXCIpLmF0dHIoXCJvbmNsaWNrXCIsZnVuY05hbWUpO1xuXHRhbGVydE1vZGFsLnNob3coKTtcbn1cblxuLy/soIDsnqXrkJwg66CI7J207JWE7JuDIOuqqeuhnSDshKDtg53tlZjsl6wg66CI7J207JWE7JuDIOuhnOuUqe2VmOq4sFxuJChwYXJlbnQuZG9jdW1lbnQpLmZpbmQoJ2hlYWRlciA+ICNkYXNoYm9hcmRfd2lkZ2V0X2RpdicpLmZpbmQoXCIjbGF5b3V0X2xpc3RcIilcbi5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRjb25zb2xlLmxvZyhlKTtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgaXRlbSA9ICQoZS50YXJnZXQgPyBlLnRhcmdldCA6IGUuc3JjRWxlbWVudCk7XG5cdGlmIChlLnRhcmdldC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdJJyB8fCBlLnRhcmdldC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdCVVRUT04nKSB7XG5cdFx0Ly8gRGVsZXRlIGxheW91dFxuXHRcdC8vIOyDgeychOydmCDrsoTtirzsnLzroZwg67OA6rK9XG5cdFx0aWYoZS50YXJnZXQudGFnTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnSScpe1xuXHRcdFx0aXRlbSA9IGl0ZW0ucGFyZW50KCk7XG5cdFx0fVxuXHRcdGlmICghaXRlbS5oYXNDbGFzcygncmVtb3ZlJykgJiYgIWl0ZW0uaGFzQ2xhc3MoJ2NvbmZpcm0nKSkge1xuXHRcdFx0Ly8gaXQncyBub3QgYSBkZWxldGUgbGF5b3V0IGJ1dHRvblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgcmVtb3ZlSXRlbU5hbWUgPSBpdGVtLnBhcmVudCgpLnRleHQoKTsvL2l0ZW0ucHJldigpLnRleHQoKTtcblx0XHQkKFwiI2xheW91dEZvcm0gW25hbWU9J2Rhc2hib2FyZE5hbWUnXVwiKS52YWwocmVtb3ZlSXRlbU5hbWUpO1xuXHRcdGlmIChpdGVtLmhhc0NsYXNzKCdyZW1vdmUnKSl7XG5cdFx0XHRtYXRpY3NDb25maXJtKHJlbW92ZUl0ZW1OYW1lK1wiIGxheW91dOydhCDsgq3soJztlZjsi5zqsqDsirXri4jquYw/XCIsXCJkZWxldGVMYXlvdXQoJ1wiK3JlbW92ZUl0ZW1OYW1lK1wiJyk7YWxlcnRNb2RhbC5oaWRlKCk7XCIpO1xuXHRcdFx0XG5cdFx0XHQvKlxuXHRcdFx0aWYobWF0aWNzQ29uZmlybShyZW1vdmVJdGVtTmFtZStcIiBsYXlvdXTsnYQg7IKt7KCc7ZWY7Iuc6rKg7Iq164uI6rmMP1wiKSl7XG5cdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0dXJsOiAnL2Rhc2hib2FyZC9kYXNoYm9hcmRNZ210L3JlbW92ZURhc2hib2FyZC5kbycsXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdFx0ZGF0YTogJChcIiNsYXlvdXRGb3JtXCIpLmxlbmd0aCA+IDAgPyAkKFwiI2xheW91dEZvcm1cIikuc2VyaWFsaXplKCkgOiBcImRhc2hib2FyZE5hbWU9XCIrcmVtb3ZlSXRlbU5hbWVcblx0XHRcdFx0fSkuZG9uZShmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcblx0XHRcdFx0XHQvLyBEZWxldGUgdGhlIHVzZXIgZGVmaW5lZCBsYXlvdXQgZnJvbSBsaXN0LlxuXHRcdFx0XHRcdC8vaXRlbS5wYXJlbnQoKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRpdGVtLnBhcmVudCgpLnJlbW92ZSgpO1xuXHRcdFx0XHR9KS5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblx0XHRcdFx0XHQvLyBUT0RPIFNob3cgdXNlciB0aGUgZXJyb3IgbWVzc2FnZS4gaWYgbmVlZGVkLCBub3QgdGhpcyB0aW1lICEhIVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQvLyAvLyBYWFggSXQncyBvbmx5IGZvciBURVNULiBOZWVkIHRvIFJlbW92ZSB0aGlzIGxpc3RlbmVyIGFmdGVyIHRlc3QuXG5cdFx0XHRcdC5hbHdheXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGl0ZW0ucGFyZW50KCkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ki9cblx0XHR9ZWxzZSBpZihpdGVtLmhhc0NsYXNzKCdjb25maXJtJykpe1xuXHRcdFx0bWF0aWNzQ29uZmlybShyZW1vdmVJdGVtTmFtZStcIiBsYXlvdXTsnYQg67OA6rK97ZWY7Iuc6rKg7Iq164uI6rmMP1wiLFwidXBkYXRlTGF5b3V0KCdcIityZW1vdmVJdGVtTmFtZStcIicpO2FsZXJ0TW9kYWwuaGlkZSgpO1wiKTtcblx0XHRcdFxuXHRcdFx0Lypcblx0XHRcdGlmKGNvbmZpcm0ocmVtb3ZlSXRlbU5hbWUrXCIgbGF5b3V07J2EIOuzgOqyve2VmOyLnOqyoOyKteuLiOq5jD9cIikpe1xuXHRcdFx0XHQkKFwiI2lucHV0X25ld19sYXlvdXRfbmFtZVwiKS52YWwocmVtb3ZlSXRlbU5hbWUpO1xuXHRcdFx0XHRpdWkuZGFzaGJvYXJkLnNhdmVHcmlkKHtuYW1lIDogcmVtb3ZlSXRlbU5hbWUsIHN0YXR1cyA6IFwidXBkYXRlXCJ9KTtcblx0XHRcdH1cblx0XHRcdCovXG5cdFx0fVxuXHR9IGVsc2UgaWYgKGUudGFyZ2V0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0EnKSB7XG5cdFx0Ly8gc2F2ZSBsYXlvdXRcblx0XHRpZiAoaXRlbS5oYXNDbGFzcygnY3VycmVudC1zYXZlJykpIHtcblx0XHRcdCQoXCIjaW5wdXRfbmV3X2xheW91dF9uYW1lXCIpLnZhbChcIlwiKTtcblx0XHRcdGRpYWxvZ19zYXZlX2N1cnJlbnRfbGF5b3V0LnNob3coKTtcblx0XHRcdC8qXG5cdFx0XHR2YXIgZGlhbG9nID0gJCgnI2RpYWxvZ19zYXZlX2N1cnJlbnRfbGF5b3V0JykubW9kYWwoe1xuXHRcdFx0XHQndGl0bGUnOiAn66CI7J207JWE7JuDIOyggOyepScsXG5cdFx0XHRcdCdkZXNjcmlwdGlvbic6IFwi7ZiE7J6sIOuztOydtOuKlCDroIjsnbTslYTsm4PsnYQg7KCA7J6l7ZWp64uI64ukLlwiLFxuXHRcdFx0XHQnYXV0b1Nob3cnOiB0cnVlLFxuXHRcdFx0XHQnd2lkdGgnOiAzMDAsXG5cdFx0XHRcdCdoZWlnaHQnOiAyMDAsXG5cdFx0XHRcdCdjbG9zZSc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ21vZGFsIGlzIGNsb3NlZC4nKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0J2NvbmZpcm0nOiBmdW5jdGlvbiAoZSwgdmFsdWUpIHtcblx0XHRcdFx0XHQvLyBUT0RPIFNlbmQgYSBjcmVhdGUgc2lnbmFsIHdpdGggdGhlIGxheW91dCBuYW1lIGFuZCB3aWRnZXRzIHRvIHRoZSBFTVMgc2VydmVyIHRvIGNyZWF0ZSBhIG5ldyBsYXlvdXQuXG5cdFx0XHRcdFx0aXVpLmRhc2hib2FyZC5zYXZlR3JpZCh2YWx1ZSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRkaWFsb2cubW9kYWwoJ2Nsb3NlJyk7XG5cdFx0XHRcdFx0fSkuZmFpbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZmFpbCB0byBzYXZlIGdyaWQuJyk7XG5cdFx0XHRcdFx0XHQvLyBUT0RPIHNob3cgdXNlciB0aGUgZXJyb3IgbWVzc2FnZXMuLi4uXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRyZXR1cm47Ki9cblx0XHR9ZWxzZXtcblx0XHR9XG5cdH1cbn0pO1xuLypcbmFkZExheW91dFRvTGlzdCh7J2lkJzogJ3VzZXJfZGVmaW5lZF9sYXlvdXRfMScsICdsYWJlbCc6ICfsgqzsmqnsnpAg7KCV7J2YIOugiOydtOyVhOybgyAxJ30pO1xuXG5hZGRMYXlvdXRUb0xpc3QoeydpZCc6ICd1c2VyX2RlZmluZWRfbGF5b3V0XzInLCAnbGFiZWwnOiAn7IKs7Jqp7J6QIOygleydmCDroIjsnbTslYTsm4MgMid9KTtcblxuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gYWRkTGF5b3V0VG9MaXN0KHsnaWQnOiAndXNlcl9kZWZpbmVkX2xheW91dF8zJywgJ2xhYmVsJzogJ+yCrOyaqeyekCDsoJXsnZgg66CI7J207JWE7JuDIDMnfSk7XG59LCAzMDAwKTtcbiAqLyIsInZhciBCQVJfQ0hBUlRfSURYID0gMDtcbiQud2lkZ2V0KCdpdWkuY2hhcnRiYXInLCB7XG5cdFxuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0c2VsZi5yZWZyZXNoKCk7XG5cblx0XHRzZWxmLl90cmlnZ2VyKCd3aWxsbW91bnQnLCBudWxsLCBzZWxmKTtcblxuXHRcdGlmIChzZWxmLm9wdGlvbnMuaW50ZXJ2YWwpIHtcblx0XHRcdGlmIChzZWxmLnRpbWVyICE9IG51bGwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChzZWxmLnRpbWVyKTtcblx0XHRcdH1cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0fSwgc2VsZi5vcHRpb25zLmludGVydmFsKTtcblx0XHR9XG5cdCAgdGhpcy5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgdGhpcyk7XG5cblx0fSxcblxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdH0sXG5cblx0X3NldE9wdGlvbjogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHQvLyBpZiAoa2V5ID09PSBcInBhcmFtc1wiKSB7XG5cdFx0Ly8gfVxuXHRcdHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuXG5cdFx0aWYodGhpcy5vcHRpb25zLnBhcmFtcyA9PSBcInJlZnJlc2hcIiB8fCB0aGlzLmVsZW1lbnQucGFyZW50KCkuZmluZChcIi5cIit0aGlzLm9wdGlvbnMucGFyYW1zKS5sZW5ndGggPiAwKXtcblx0XHRcdHRoaXMucmVmcmVzaCgpO1xuXHRcdH1cdFxuXHR9LFxuXG5cdC8vIF9zZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHQvLyAgdGhpcy5fc3VwZXIob3B0aW9ucyk7XG5cdC8vICB0aGlzLnJlZnJlc2goKTtcblx0Ly8gfSxcblxuXHRyZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXMgfHwge307XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHZhciB3ID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHRcdC5pbm5lcldpZHRoKCkgLSAxMDsgXG5cdFx0dmFyIGggPSBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KClcblx0XHRcdFx0LmlubmVySGVpZ2h0KCkgLSA1MDtcblxuXHRcdHZhciB0aXRsZVRleHQgPSBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPWdlbmVyYXRpb25dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KClcblx0XHRcdFx0KyBcIiBcIiArIHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5maW5kKFwiW25hbWU9bW9kZWxZZWFyXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdCsgXCIgXCIgKyBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPXBsYXRmb3JtXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdCsgXCIgXCIgKyBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPXNtc1Rlc3REb21haW5dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KCk7XG5cdFx0XG5cdFx0aWYoc2VsZi5vcHRpb25zLmdyYXBoVHlwZSAhPSBudWxsKXtcblx0XHRcdHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5maW5kKFwiW25hbWU9Z3JhcGhUeXBlXVwiKS5yZW1vdmUoKTtcblx0XHRcdHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5hcHBlbmQoXCI8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdncmFwaFR5cGUnIHZhbHVlPSdcIitzZWxmLm9wdGlvbnMuZ3JhcGhUeXBlK1wiQ291bnQnPlwiKTtcblx0XHR9XG5cblx0XHRzZWxmLmVsZW1lbnQuYWRkQ2xhc3Moc2VsZi5vcHRpb25zLmlkKTtcblxuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmwgOiBzZWxmLm9wdGlvbnMuZGF0YSxcblx0XHRcdHR5cGUgOiBcInBvc3RcIixcblx0XHRcdGRhdGFUeXBlIDogXCJqc29uXCIsXG5cdFx0XHRkYXRhIDogc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLnNlcmlhbGl6ZSgpLFxuXHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXG5cblx0XHRcdFx0aWYoZGF0YS5ncmFwaEluZm8gPT0gbnVsbCB8fCBkYXRhLmdyYXBoSW5mbyA9PSBcIlwiKXtcblx0XHRcdFx0XHRpZihzZWxmLmVsZW1lbnQuZmluZChcImgzXCIpLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0c2VsZi5lbGVtZW50LmZpbmQoXCJoM1wiKS50ZXh0KFwi642w7J207YSw6rCAIOyXhuyKteuLiOuLpC5cIik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKHNlbGYuY2hhcnQpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNoYXJ0LmRlc3Ryb3koKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC5hcHBlbmQoXCI8aDMgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyOyc+642w7J207YSw6rCAIOyXhuyKteuLiOuLpC48L2gzPlwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNle1xuXG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFNtc1N1Y2Nlc3NQYXNzRmFpbENvdW50Rm9yVmVyc2lvblwiKSA+IC0xIHx8IHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRUZXN0RG9tYWluQ291bnRGb3JWZXJzaW9uXCIpID4gLTEpe1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgeEF4aXNUZW1wID0gW107XG5cdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5ncmFwaEluZm8sIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHhBeGlzVGVtcC5wdXNoKHRoaXMuc3dWZXJzaW9uKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR2YXIgY2hhcnQgPSBuZXcgSGlnaGNoYXJ0cy5DaGFydCh7XG5cdFx0XHRcdFx0XHRcdGNyZWRpdHM6eyBcblx0XHRcdFx0XHRcdFx0XHRcdGVuYWJsZWQ6ZmFsc2UgXG5cdFx0XHRcdFx0XHRcdH0sXHRcblx0XHRcdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJlbmRlclRvOiAkKHNlbGYuZWxlbWVudCkuYXR0cihcImlkXCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ2NvbHVtbicgXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiB0aXRsZVRleHRcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0c3VidGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdTTVMgUGVyZm9ybWFuY2UnXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllczogeEF4aXNUZW1wXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnQ291bnQnXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0c3RhY2tMYWJlbHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IChIaWdoY2hhcnRzLnRoZW1lICYmIEhpZ2hjaGFydHMudGhlbWUudGV4dENvbG9yKSB8fCAnZ3JheSdcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0b29sdGlwOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaGFyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRmb290ZXJGb3JtYXQ6ICdUb3RhbDoge3BvaW50LnRvdGFsfSdcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0cGxvdE9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbHVtbjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFja2luZzogJ25vcm1hbCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFMYWJlbHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAoSGlnaGNoYXJ0cy50aGVtZSAmJiBIaWdoY2hhcnRzLnRoZW1lLmRhdGFMYWJlbHNDb2xvcikgfHwgJ3doaXRlJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGZsb2F0aW5nOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGxheW91dDogXCJ2ZXJ0aWNhbFwiLFxuXHRcdFx0XHRcdFx0XHRcdGFsaWduOiBcInJpZ2h0XCIsXG5cdFx0XHRcdFx0XHRcdFx0dmVydGljYWxBbGlnbjogXCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFNtc1N1Y2Nlc3NQYXNzRmFpbENvdW50Rm9yVmVyc2lvblwiKSA+IC0xKXtcblx0XHRcdFx0XHRcdFx0dmFyIGZhaWxDbnQgPSBbXTtcblx0XHRcdFx0XHRcdFx0Ly92YXIgc3VjY2Vzc0NudCA9IFtdO1xuXHRcdFx0XHRcdFx0XHR2YXIgcGFzc0NudCA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRmYWlsQ250LnB1c2godGhpcy5mYWlsQ291bnQpO1xuXHRcdFx0XHRcdFx0XHRcdC8vc3VjY2Vzc0NudC5wdXNoKHRoaXMuc3VjY2Vzc0NudCk7XG5cdFx0XHRcdFx0XHRcdFx0cGFzc0NudC5wdXNoKHRoaXMucGFzc0NvdW50KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiAnRmFpbCcsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogZmFpbENudFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiAnUGFzcycsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogcGFzc0NudFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0LypjaGFydC5hZGRTZXJpZXMoe1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICdTdWNjZXNzJyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBzdWNjZXNzQ250XG5cdFx0XHRcdFx0XHRcdH0pOyovXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihzZWxmLm9wdGlvbnMuZGF0YS5pbmRleE9mKFwiZ2V0VGVzdERvbWFpbkNvdW50Rm9yVmVyc2lvblwiKSA+IC0xICl7XG5cdFx0XHRcdFx0XHRcdHZhciBvcGNDbnQgPSBbXTtcblx0XHRcdFx0XHRcdFx0dmFyIGlwY0NudCA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLk9QQyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRvcGNDbnQucHVzaCh0aGlzLk9QQyk7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRvcGNDbnQucHVzaChudWxsKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLklQQyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpcGNDbnQucHVzaCh0aGlzLklQQyk7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRpcGNDbnQucHVzaChudWxsKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGNoYXJ0LmFkZFNlcmllcyh7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogJ09QQycsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogb3BjQ250XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRjaGFydC5hZGRTZXJpZXMoe1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICdJUEMnLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IGlwY0NudFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRTbXNTdWNjZXNzUGFzc0ZhaWxDb3VudEZvclJlZ2lvblwiKSA+IC0xKXtcblxuXHRcdFx0XHRcdFx0dmFyIHhBeGlzVGVtcCA9IFtdO1xuXHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHR4QXhpc1RlbXAucHVzaCh0aGlzLm5hbWUpO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBjaGFydCA9IG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcblx0XHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHRcdFx0fSxcdFxuXHRcdFx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnY29sdW1uJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogdGl0bGVUZXh0XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN1YnRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnU01TIFBlcmZvcm1hbmNlJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IHhBeGlzVGVtcFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bWluOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogJ0NvdW50J1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0b29sdGlwOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaGFyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGZsb2F0aW5nOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGxheW91dDogXCJ2ZXJ0aWNhbFwiLFxuXHRcdFx0XHRcdFx0XHRcdGFsaWduOiBcInJpZ2h0XCIsXG5cdFx0XHRcdFx0XHRcdFx0dmVydGljYWxBbGlnbjogXCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZmFpbENudCA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIHBhc3NDbnQgPSBbXTtcblx0XHRcdFx0XHRcdC8vdmFyIHN1Y2Nlc3NDbnQgPSBbXTtcblxuXHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRmYWlsQ250LnB1c2godGhpcy5kYXRhWzBdKTtcblx0XHRcdFx0XHRcdFx0Ly9zdWNjZXNzQ250LnB1c2godGhpcy5kYXRhWzFdKTtcblx0XHRcdFx0XHRcdFx0cGFzc0NudC5wdXNoKHRoaXMuZGF0YVsyXSk7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ0ZhaWwnLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBmYWlsQ250XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjaGFydC5hZGRTZXJpZXMoe1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAnUGFzcycsXG5cdFx0XHRcdFx0XHRcdGRhdGE6IHBhc3NDbnRcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHQvKmNoYXJ0LmFkZFNlcmllcyh7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdTdWNjZXNzJyxcblx0XHRcdFx0XHRcdFx0ZGF0YTogc3VjY2Vzc0NudFxuXHRcdFx0XHRcdFx0fSk7Ki9cblxuXHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXROb3JtYWxEcnhGb3JSZXRpb25cIikgPiAtMSl7XG5cblx0XHRcdFx0XHRcdHZhciB4QXhpc1RlbXAgPSBbXTtcblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5yZWdpb24pO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBjaGFydCA9IG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcblx0XHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHRcdFx0fSxcdFxuXHRcdFx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnY29sdW1uJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogdGl0bGVUZXh0XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN1YnRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnU01TIFBlcmZvcm1hbmNlJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IHhBeGlzVGVtcFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bWluOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1JURChzZWMpJ1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0b29sdGlwOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaGFyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGZsb2F0aW5nOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGxheW91dDogXCJ2ZXJ0aWNhbFwiLFxuXHRcdFx0XHRcdFx0XHRcdGFsaWduOiBcInJpZ2h0XCIsXG5cdFx0XHRcdFx0XHRcdFx0dmVydGljYWxBbGlnbjogXCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5sZWdlbmQsIGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0XHRcdFx0dmFyIHNlcmllc0RhdGEgPSBbXTtcblx0XHRcdFx0XHRcdFx0dmFyIGxlZ2VuZCA9IHRoaXMuc21zVGVzdERvbWFpbjI7XG5cblx0XHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXNbbGVnZW5kXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXJpZXNEYXRhLnB1c2godGhpc1tsZWdlbmRdKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHNlcmllc0RhdGEucHVzaChudWxsKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGNoYXJ0LmFkZFNlcmllcyh7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogbGVnZW5kLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IHNlcmllc0RhdGFcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRSZWdpb25QYXNzRmFpbEZvclByb2plY3RcIikgPiAtMSB8fCBzZWxmLm9wdGlvbnMuZGF0YS5pbmRleE9mKFwiZ2V0UHJvamVjdFBhc3NGYWlsRm9yUmVnaW9uXCIpID4gLTEpe1xuXHRcdFx0XHRcdFx0dmFyIHhBeGlzVGVtcCA9IFtdO1xuXG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuZGF0YS5pbmRleE9mKFwiZ2V0UmVnaW9uUGFzc0ZhaWxGb3JQcm9qZWN0XCIpID4gLTEpe1xuXHRcdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5ncmFwaEluZm8sIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5yZWdpb24pO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRQcm9qZWN0UGFzc0ZhaWxGb3JSZWdpb25cIikgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR4QXhpc1RlbXAucHVzaCh0aGlzLm1vZGVsKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBjaGFydCA9IG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcblx0XHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHRcdFx0fSxcdFxuXHRcdFx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnY29sdW1uJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1NNUyBQZXJmb3JtYW5jZSdcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0XHRjYXRlZ29yaWVzOiB4QXhpc1RlbXBcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0eUF4aXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdG1pbjogMCxcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdDb3VudCdcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0dG9vbHRpcDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2hhcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRmbG9hdGluZzogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRsYXlvdXQ6IFwidmVydGljYWxcIiwgXG5cdFx0XHRcdFx0XHRcdFx0YWxpZ246IFwicmlnaHRcIixcblx0XHRcdFx0XHRcdFx0XHR2ZXJ0aWNhbEFsaWduOiBcIm1pZGRsZVwiXG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRSZWdpb25QYXNzRmFpbEZvclByb2plY3RcIikgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmxlZ2VuZCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VyaWVzRGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXMubW9kZWw7XG5cblx0XHRcdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5ncmFwaEluZm8sIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzW21vZGVsXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlcmllc0RhdGEucHVzaCh0aGlzW21vZGVsXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VyaWVzRGF0YS5wdXNoKG51bGwpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IG1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogc2VyaWVzRGF0YVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRQcm9qZWN0UGFzc0ZhaWxGb3JSZWdpb25cIikgPiAtMSl7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmxlZ2VuZCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VyaWVzRGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdHZhciByZWdpb24gPSB0aGlzLnJlZ2lvbjtcblxuXHRcdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXNbcmVnaW9uXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlcmllc0RhdGEucHVzaCh0aGlzW3JlZ2lvbl0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlcmllc0RhdGEucHVzaChudWxsKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdGNoYXJ0LmFkZFNlcmllcyh7XG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiByZWdpb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBzZXJpZXNEYXRhXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fWVsc2UgaWYoc2VsZi5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFByb2plY3RSdGRGb3JSZWdpb25cIikgPiAtMSl7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZhciB4QXhpc1RlbXAgPSBbXTtcblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5yZWdpb24pO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBjaGFydCA9IG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcblx0XHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHRcdFx0fSxcdFxuXHRcdFx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnYmFyJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogdGl0bGVUZXh0XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN1YnRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IHhBeGlzVGVtcFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR5QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bWluOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1JURChzZWMpJ1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0b29sdGlwOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaGFyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGZsb2F0aW5nOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGxheW91dDogXCJ2ZXJ0aWNhbFwiLFxuXHRcdFx0XHRcdFx0XHRcdGFsaWduOiBcInJpZ2h0XCIsXG5cdFx0XHRcdFx0XHRcdFx0dmVydGljYWxBbGlnbjogXCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEubGVnZW5kLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VyaWVzRGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuXG5cdFx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzW21vZGVsXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXJpZXNEYXRhLnB1c2godGhpc1ttb2RlbF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VyaWVzRGF0YS5wdXNoKG51bGwpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBtb2RlbCxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBzZXJpZXNEYXRhXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fWVsc2UgaWYoc2VsZi5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldENhVXBEb3dubG9hZFNwZWVkY29tcGFyaXNvbkZvclJlZ2lvblwiKSA+IC0xKXtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIHhBeGlzVGVtcCA9IFtdO1xuXHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpeyBcblx0XHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5yZWdpb24pO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBjaGFydCA9IG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcblx0XHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHRcdFx0fSxcdFxuXHRcdFx0XHRcdFx0XHRjaGFydDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnY29sdW1uJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogdGl0bGVUZXh0XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0ZWdvcmllczogeEF4aXNUZW1wXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnKHNlYyknXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHRvb2x0aXA6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHNoYXJlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0cGxvdE9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2x1bW46IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JvdXBpbmc6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzaGFkb3c6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJXaWR0aDogMFxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRmbG9hdGluZzogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRsYXlvdXQ6IFwidmVydGljYWxcIixcblx0XHRcdFx0XHRcdFx0XHRhbGlnbjogXCJyaWdodFwiLFxuXHRcdFx0XHRcdFx0XHRcdHZlcnRpY2FsQWxpZ246IFwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvKnNlcmllczogW3tcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiAnMkNBIFVwbG9hZCcsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZ2JhKDE2NSwxNzAsMjE3LDEpJyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbMTUwLCA3MywgMjBdLFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50UGFkZGluZzogMC4zLFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50UGxhY2VtZW50OiAtMC4yXG5cdFx0XHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiAnMkNBIERvd25sb2FkJyxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMTI2LDg2LDEzNCwuOSknLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IFsxNDAsIDkwLCA0MF0sXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnRQYWRkaW5nOiAwLjQsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnRQbGFjZW1lbnQ6IC0wLjJcblx0XHRcdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICczQ0EgVXBsb2FkJyxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JnYmEoMjQ4LDE2MSw2MywxKScsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogWzE4My42LCAxNzguOCwgMTk4LjVdLFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50UGFkZGluZzogMC4zLFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50UGxhY2VtZW50OiAwLjJcblx0XHRcdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICczQ0EgRG93bmxvYWQnLFxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAncmdiYSgxODYsNjAsNjEsLjkpJyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbMjAzLjYsIDE5OC44LCAyMDguNV0sXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnRQYWRkaW5nOiAwLjQsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnRQbGFjZW1lbnQ6IDAuMlxuXHRcdFx0XHRcdFx0XHR9XVxuXHRcdFx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmxlZ2VuZCwgZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VyaWVzRGF0YSA9IFtdO1xuXHRcdFx0XHRcdFx0XHR2YXIgbHRlQ2FUeXBlID0gdGhpcy5sdGVDYVR5cGU7XG5cblx0XHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXNbbHRlQ2FUeXBlXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXJpZXNEYXRhLnB1c2godGhpc1tsdGVDYVR5cGVdKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHNlcmllc0RhdGEucHVzaChudWxsKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvckxpc3QgPSBbXCJyZ2JhKDE2NSwxNzAsMjE3LDEpXCIsIFwicmdiYSgxMjYsODYsMTM0LC45KVwiLCBcInJnYmEoMjQ4LDE2MSw2MywxKVwiLCBcInJnYmEoMTg2LDYwLDYxLC45KVwiXTtcblx0XHRcdFx0XHRcdFx0dmFyIHBvaW50UGFkZGluZ0xpc3QgPSBbMC4zLCAwLjQsIDAuMywgMC40XTtcblx0XHRcdFx0XHRcdFx0dmFyIHBvaW50UGxhY2VtZW50TGlzdCA9IFstMC4yLCAtMC4yLCAwLjIsIDAuMl07XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRpZihsdGVDYVR5cGUuaW5kZXhPZihcInVsRnJlcVwiKSA+IC0xICl7XG5cdFx0XHRcdFx0XHRcdFx0bHRlQ2FUeXBlID0gbHRlQ2FUeXBlLnJlcGxhY2UoXCJ1bEZyZXFcIixcIiBVcGxvYWRcIik7XG5cdFx0XHRcdFx0XHRcdH1lbHNlIGlmKGx0ZUNhVHlwZS5pbmRleE9mKFwiZGxGcmVxXCIpID4gLTEgKXtcblx0XHRcdFx0XHRcdFx0XHRsdGVDYVR5cGUgPSBsdGVDYVR5cGUucmVwbGFjZShcImRsRnJlcVwiLFwiIERvd25sb2FkXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBsdGVDYVR5cGUsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6IGNvbG9yTGlzdFtpbmRleF0sXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YTogc2VyaWVzRGF0YSxcblx0XHRcdFx0XHRcdFx0XHRwb2ludFBhZGRpbmc6IHBvaW50UGFkZGluZ0xpc3RbaW5kZXhdLFxuXHRcdFx0XHRcdFx0XHRcdHBvaW50UGxhY2VtZW50OiBwb2ludFBsYWNlbWVudExpc3RbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1lbHNlIGlmKHNlbGYub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRTbXNDbnREcnhUaW1lTm9ybWFsVGltZUZvclZlcnNpb25cIikgPiAtMSl7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZhciB4QXhpc1RlbXAgPSBbXTtcblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5zd1ZlcnNpb24pO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBzZXJpZXNUZW1wID0gW107XG5cdFx0XHRcdFx0XHR2YXIgY291bnREYXRhTGlzdCA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIHJ0ZERhdGFMaXN0ID0gW107XG5cblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmxlZ2VuZCwgZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHRcdFx0XHR2YXIgbGVnZW5kcyA9IHRoaXMuc21zVGVzdERvbWFpbjI7XG5cblx0XHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXNbbGVnZW5kc10pe1xuXHRcdFx0XHRcdFx0XHRcdFx0cnRkRGF0YUxpc3QucHVzaCh0aGlzW2xlZ2VuZHNdKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHJ0ZERhdGFMaXN0LnB1c2gobnVsbCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZihkYXRhLmdyYXBoSW5mb1tpbmRleF0gIT0gbnVsbCl7XG5cdFx0XHRcdFx0XHRcdFx0Y291bnREYXRhTGlzdC5wdXNoKGRhdGEuZ3JhcGhJbmZvW2luZGV4XVsnY250J10pO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0c2VyaWVzVGVtcC5wdXNoKHtuYW1lOmxlZ2VuZHMsIHR5cGU6J2NvbHVtbicsIHlBeGlzOjEsIGRhdGE6cnRkRGF0YUxpc3QsIHRvb3RpcDp7dmFsdWVTdWZmaXg6ICdzZWMnfX0pO1xuXHRcdFx0XHRcdFx0XHRydGREYXRhTGlzdCA9IFtdO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dGl0bGVUZXh0ID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLmZpbmQoXCJbbmFtZT1nZW5lcmF0aW9uXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdFx0XHRcdFx0KyBcIiBcIiArIHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5maW5kKFwiW25hbWU9bW9kZWxZZWFyXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdFx0XHRcdFx0KyBcIiBcIiArIHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5maW5kKFwiW25hbWU9cGxhdGZvcm1dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KClcblx0XHRcdFx0XHRcdFx0XHQrIFwiIFwiICsgc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLmZpbmQoXCJbbmFtZT1yZWdpb25dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KCk7XG5cdFx0XG5cblx0XHRcdFx0XHRcdHNlcmllc1RlbXAucHVzaCh7bmFtZTonQ291bnQnLCB0eXBlOidzcGxpbmUnLCBkYXRhOmNvdW50RGF0YUxpc3QsIHRvb3RpcDp7dmFsdWVTdWZmaXg6ICcnfX0pO1xuXG5cdFx0XHRcdFx0XHR2YXIgY2hhcnQgPSBuZXcgSGlnaGNoYXJ0cy5DaGFydCh7XG5cdFx0XHRcdFx0XHRcdGNyZWRpdHM6eyBcblx0XHRcdFx0XHRcdFx0XHRcdGVuYWJsZWQ6ZmFsc2UgXG5cdFx0XHRcdFx0XHRcdH0sXHRcblx0XHRcdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJlbmRlclRvOiAkKHNlbGYuZWxlbWVudCkuYXR0cihcImlkXCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0em9vbVR5cGU6ICd4eSdcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IHRpdGxlVGV4dFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR4QXhpczoge1xuXHRcdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IHhBeGlzVGVtcFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR5QXhpczogW3sgLy8gUHJpbWFyeSB5QXhpc1xuXHRcdFx0XHRcdFx0XHRcdGxhYmVsczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAne3ZhbHVlfScsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHlsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogSGlnaGNoYXJ0cy5nZXRPcHRpb25zKCkuY29sb3JzWzFdXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogJ0NvdW50Jyxcblx0XHRcdFx0XHRcdFx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yOiBIaWdoY2hhcnRzLmdldE9wdGlvbnMoKS5jb2xvcnNbMV1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHsgLy8gU2Vjb25kYXJ5IHlBeGlzXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdSVEQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3R5bGU6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IEhpZ2hjaGFydHMuZ2V0T3B0aW9ucygpLmNvbG9yc1swXVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWxzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICd7dmFsdWV9IHNlYycsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHlsZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogSGlnaGNoYXJ0cy5nZXRPcHRpb25zKCkuY29sb3JzWzBdXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRvcHBvc2l0ZTogdHJ1ZVxuXHRcdFx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRcdFx0dG9vbHRpcDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2hhcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRmbG9hdGluZzogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRsYXlvdXQ6IFwidmVydGljYWxcIixcblx0XHRcdFx0XHRcdFx0XHRhbGlnbjogXCJyaWdodFwiLFxuXHRcdFx0XHRcdFx0XHRcdHZlcnRpY2FsQWxpZ246IFwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0c2VyaWVzOiBzZXJpZXNUZW1wXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydC5zZXRTaXplKHcsIGgpO1x0XG5cdFx0XHRcdFx0c2VsZi5jaGFydCA9IGNoYXJ0O1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdGVycm9yIDogZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QsIHN0YXR1cyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblxuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGx1cGRhdGUnLCBudWxsLCBzZWxmKTtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKGFqYXhEYXRhKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXG5cdFx0c2VsZiA9IG51bGw7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDsgq3soJxcblx0ICovXG5cdHVubG9hZDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuXHRcdHNlbGYgPSBudWxsO1xuXHRcdC8vdGhpcy5jaGFydC51bmxvYWQoJ3ZhbHVlJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIO2BrOq4sCDrs4Dqsr1cblx0ICovXG5cdHJlc2l6ZTogZnVuY3Rpb24gKCkge1x0IFxuXHRcdHZhciB3ID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHQuaW5uZXJXaWR0aCgpLTEwO1xuXHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHRcdC5pbm5lckhlaWdodCgpLTUwO1xuXG5cdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXHQgXG5cdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0aCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5pbm5lckhlaWdodCgpIC0gNjA7XG5cdFx0fVxuXHRcdFxuXHRcdGlmKHRoaXMuY2hhcnQpe1xuXHRcdFx0dGhpcy5jaGFydC5zZXRTaXplKHcsIGgpO1xuXHRcdH1cblx0fVxufSk7XG4iLCJ2YXIgc2NvcGUgPSB3aW5kb3c7XG52YXIgQkFSX0NIQVJUX0lEWCA9IDA7XG4kLndpZGdldCgnaXVpLmNoYXJ0Y29sdW1uJywge1xuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYubG9hZCgpO1xuXHR9LFxuXG5cblx0X2Rlc3Ryb3k6IGZ1bmN0aW9uKCl7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0fSxcblxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuXHRcdGlmKHZhbHVlID09IHRoaXMub3B0aW9ucy5pdGVtLmRhdGEpe1xuXHRcdFx0dGhpcy5yZWZyZXNoKCk7XG5cdFx0fVxuXHR9LFxuXG5cblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMuaXRlbS5wYXJhbXMgfHwge307XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGx1cGRhdGUnLCBudWxsLCB0aGlzKTtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKGFqYXhEYXRhKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHZhciBwYXJlbnQgPSB0aGlzLmVsZW1lbnQ7XG5cdFx0JChwYXJlbnQpLmhlaWdodCg1MDApO1xuXHRcdFxuXHRcdHZhciBjaGFydF9jb2x1bW4gPSBlY2hhcnRzLmluaXQocGFyZW50WzBdKTtcblx0XHR2YXIgY2hhcnRfY29sdW1uX29wdGlvbiA9IHtcblx0XHRcdHRpdGxlIDoge1xuXHRcdFx0XHR0ZXh0IDogJydcblx0XHRcdH0sXG5cdFx0XHR0b29sdGlwIDoge1xuXHRcdFx0XHR0cmlnZ2VyIDogJ2F4aXMnLFxuXHRcdFx0XHRheGlzUG9pbnRlciA6IHtcblx0XHRcdFx0XHR0eXBlIDogJ3NoYWRvdydcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdyaWQgOiB7XG5cdFx0XHRcdGxlZnQgOiAnMyUnLFxuXHRcdFx0XHRyaWdodCA6ICc0JScsXG5cdFx0XHRcdGJvdHRvbSA6ICczJScsXG5cdFx0XHRcdGNvbnRhaW5MYWJlbCA6IHRydWVcblx0XHRcdH0sXG5cdFx0XHR4QXhpcyA6IHtcblx0XHRcdFx0dHlwZSA6ICd2YWx1ZScsXG5cdFx0XHRcdGJvdW5kYXJ5R2FwIDogWyAwLCAwLjAxIF1cblx0XHRcdH0sXG5cdFx0XHR5QXhpcyA6IHtcblx0XHRcdFx0dHlwZSA6ICdjYXRlZ29yeScsXG5cdFx0XHRcdGRhdGEgOiBbICfsoJXsg4HsnbgnLCAn7Ius7KeI7ZmYJywgJ+yynOyLnScsICfsoITrpr3shKAnLCAn7Lac7IKwJyxcblx0XHRcdFx0XHRcdCfsnKDrsKnsp4jtmZgnLCAn7J6l7KeI7ZmYJywgJ+yLoOyepeydtOyLnScsICfsgqzqtazssrQnLCAn66+47IiZ7JWEJyxcblx0XHRcdFx0XHRcdCfrp4zshLHtj5Dsp4jtmZgnLCAn64u564eo67ORJywgJ+uHjOqyveyDiScsICfqt7zqs6jqsqknLCAn6rCE7Je8Jyxcblx0XHRcdFx0XHRcdCfqsITqsr3tmZQnLCAn7ZiI7JWh7JWUJywgJ+2PkOyVlCcsICfsoITrpr3shKDslZQnLCAn7Jyg67Cp7JWUJyxcblx0XHRcdFx0XHRcdCfsnITslZQnLCAn7Iug7J6l7JWUJywgJ+uRkOqyveu2gOyVlCcsICfrjIDsnqXslZQnLCAn6rCR7IOB7ISg7JWUJyxcblx0XHRcdFx0XHRcdCfqsITslZQnIF1cblx0XHRcdH0sXG5cdFx0XHRzZXJpZXMgOiBbIHtcblx0XHRcdFx0bmFtZSA6ICcnLFxuXHRcdFx0XHR0eXBlIDogJ2JhcicsXG5cdFx0XHRcdGRhdGEgOiBbIDEwMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNTAzLCAwLCAwLFxuXHRcdFx0XHRcdFx0MjAwLCAwLCAwLCAwLCAwLCAwLCAwLCAzMDAsIDAsIDAsIDAsIDAsXG5cdFx0XHRcdFx0XHQwLCAwLCA0MDAgXVxuXHRcdFx0fSBdXG5cdFx0fTtcblxuXHRcdGNoYXJ0X2NvbHVtbi5zZXRPcHRpb24oY2hhcnRfY29sdW1uX29wdGlvbik7XG5cdFx0XG5cdFx0c2VsZi5jaGFydCA9IGNoYXJ0X2NvbHVtbjtcblx0XHRzZWxmLnJlc2l6ZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdGlmKHRoaXMuY2hhcnQpe1xuXHRcdFx0dGhpcy5jaGFydC5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLmNoYXJ0ID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIO2BrOq4sCDrs4Dqsr1cblx0ICovXG5cdHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdGlmKHRoaXMuY2hhcnQpIHtcblx0XHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCktNTA7XG5cdFx0XG5cdFx0XHR0aGlzLmVsZW1lbnQuY3NzKHsnaGVpZ2h0JzogaH0pO1xuXHRcdFx0dGhpcy5jaGFydC5yZXNpemUoKTtcblx0XHR9XG5cdH1cbn0pO1xuLy99KTtcbiIsIi8vKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4vL2lmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbi8vZGVmaW5lKFsnanF1ZXJ5JywgJ2QzJywgJ2MzJ10sIGZhY3RvcnkpO1xuLy99XG4vL2Vsc2Uge1xuLy9mYWN0b3J5KGpRdWVyeSk7XG4vL31cbi8vfSkoZnVuY3Rpb24gKCQpIHtcbnZhciBzY29wZSA9IHdpbmRvdztcbnZhciBUQUJMRV9DSEFSVF9JRFggPSAwO1xuJC53aWRnZXQoJ2l1aS5jaGFydGdyaWQnLCB7XG5cdF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLmVsZW1lbnQuZW1wdHkoKS5sb2FkVGVtcGxhdGUoc2VsZi5vcHRpb25zLml0ZW0udGVtcGxhdGUsIHt9ICwge1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLmluaXRHcmlkKCk7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0XHRcblx0XHRcdFx0c2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmJpbmQoXCJjbGlja1wiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JChcIiN0YWIxXCIpLmNsaWNrKCk7XG5cdFx0XHRcdFx0Ly8kKFwiI21hcF90cmVlXCIpLmhpZGUoKTtcblx0XHRcdFx0XHQvLyQoXCIjZ3JpZF90cmVlXCIpLnNob3coKTtcblx0XHRcdFx0XHR0cmVlVHlwZSA9IFwiZ3JpZFRyZWVcIjtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uICgpIHtcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0c2VsZi5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgc2VsZik7XG5cblx0XHRpZiAoc2VsZi5vcHRpb25zLml0ZW0uaW50ZXJ2YWwpIHtcblx0XHRcdGlmIChzZWxmLnRpbWVyICE9IG51bGwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChzZWxmLnRpbWVyKTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZi50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2VsZi5yZWZyZXNoKCk7XG5cdFx0XHR9LCBzZWxmLm9wdGlvbnMuaXRlbS5pbnRlcnZhbCk7XG5cdFx0fVxuXG5cdH0sXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cdFx0aWYodmFsdWUgPT0gdGhpcy5vcHRpb25zLml0ZW0uZGF0YSl7XG5cdFx0XHR0aGlzLnJlZnJlc2goKTtcblx0XHR9XG5cdH0sXG5cdHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyB8fCB7fTtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQkKFwiI3NlYXJjaF9mb3JtIGlucHV0W25hbWU9J2N1cnJlbnRQYWdlJ11cIikudmFsKDEpO1xuXHRcdCQoXCIjc2VhcmNoX2Zvcm0gaW5wdXRbbmFtZT0nbGlzdENvdW50J11cIikudmFsKCQoXCIjb3B0X2xpbmVsZW5ndGhcIikudmFsKCkpO1xuXHRcdCQoXCIjcGFnZV9pbnB1dFwiKS52YWwoMSk7XG5cblx0XHQkKFwiI3NlYXJjaF9mb3JtIFtuYW1lPWNoZWNrTGlzdF1cIikucmVtb3ZlKCk7XG5cdFx0dmFyIGNoZWNrTGlzdCA9IG9wZW5lci5kb2N1bWVudC5zZWFyY2hGb3JtLmNoZWNrTGlzdDtcblx0XHRpZihjaGVja0xpc3QubGVuZ3RoID4gMCl7XG5cdFx0XHQkLmVhY2goY2hlY2tMaXN0LCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkKFwiI3NlYXJjaF9mb3JtXCIpLmFwcGVuZChcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J2NoZWNrTGlzdCcgdmFsdWU9J1wiK3RoaXMudmFsdWUrXCInPlwiKTtcblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0JChcIiNzZWFyY2hfZm9ybVwiKS5hcHBlbmQoXCI8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdjaGVja0xpc3QnIHZhbHVlPSdcIitjaGVja0xpc3QudmFsdWUrXCInPlwiKTtcblx0XHR9XG5cdFx0XG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogc2VsZi5vcHRpb25zLml0ZW0uZGF0YSxcblx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdHR5cGU6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YTogJChcIiNzZWFyY2hfZm9ybVwiKS5zZXJpYWxpemUoKSxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChhamF4RGF0YSkge1xuXHRcdFx0XHRzZWxmLmxvYWQoYWpheERhdGEpO1xuXHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcblx0XHRcdFx0aWYoaXVpLmRhc2hib2FyZC53aWRnZXRzLmxlbmd0aCA8PSBkYXNoYm9hcmRXaWRnZXRJZHgpe1xuXHRcdFx0XHRcdGxvYWRpbmdFbmQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBhcmFtcyA9IG51bGw7XG5cdFx0XHRcdGFqYXhEYXRhID0gbnVsbDtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKHJlcXVlc3QsIHN0YXR1cywgZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRpZihpdWkuZGFzaGJvYXJkLndpZGdldHMubGVuZ3RoIDw9IGRhc2hib2FyZFdpZGdldElkeCl7XG5cdFx0XHRcdFx0bG9hZGluZ0VuZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyYW1zID0gbnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGx1cGRhdGUnLCBudWxsLCB0aGlzKTtcblx0fSxcblx0aW5pdEdyaWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHQkKCQoXCIud2lkZ2V0LWJvZHlcIilbMV0pLmNoaWxkcmVuKCkuaGVpZ2h0KFwiMTAwJVwiKTtcblx0XHQkKFwiI2l3X2NvbnRhaW5lclwiKS5oZWlnaHQoJChcIiNpd19jb250YWluZXJcIikucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGVpZ2h0KCkgLSA0Mik7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIHRhYmxlU2l6ZSA9IDE1MDA7IC8vc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cblx0XHRqdWkucmVhZHkoZnVuY3Rpb24odWksIHVpeCwgXykge1xuXHRcdFx0dmFyIHRhYmxlX3dpZHRoID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLm91dGVyV2lkdGgoKTtcdCAgICBcblx0XHRcdHNlbGYueHRhYmxlID0gdWl4Lnh0YWJsZShzZWxmLmVsZW1lbnQuZmluZChcIiN4dGFibGVcIiksIHtcblx0XHRcdFx0ZmllbGRzOiBzZWxmLm9wdGlvbnMuaXRlbS5maWVsZHMsXG5cdFx0XHRcdHNvcnQ6IGZhbHNlLFxuXHRcdFx0XHRzb3J0TG9hZGluZzogdHJ1ZSxcblx0XHRcdFx0YnVmZmVyIDogXCJzY3JvbGxcIixcblx0XHRcdFx0YnVmZmVyQ291bnQgOiAyMDAsXG5cdFx0XHRcdHJlc2l6ZTogdHJ1ZSxcblx0XHRcdFx0Y29sc2hvdzogWzAsIDEsIDIsIDMsIDQsIDksIDEyLCAxMywgMTQsIDE1LCAxMTUsIDExNl0sXG5cdFx0XHRcdHdpZHRoOiB0YWJsZVNpemUsXG5cdFx0XHRcdGZpbHRlck9wdGlvbjogZmlsdGVyT3B0aW9uLFxuXHRcdFx0XHRzY3JvbGxIZWlnaHQ6IHNlbGYuZWxlbWVudC5oZWlnaHQoKS0zMCxcblx0XHRcdFx0ZXZlbnQ6IHtcblx0XHRcdFx0XHRjb2xtZW51OiBmdW5jdGlvbihjb2x1bW4sIGUpIHtcblx0XHRcdFx0XHRcdHRoaXMudG9nZ2xlQ29sdW1uTWVudShlLnBhZ2VYIC0gMjUpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2VsZWN0OiBmdW5jdGlvbihyb3csIGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0KHJvdy5pbmRleCk7XG5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0bWFya2VyQ2xpY2tGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdG1lc3NhZ2VDbGlja0ZsYWcgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHR2YXIgdHJlZSA9ICQuZm4uelRyZWUuZ2V0WlRyZWVPYmooXCJ0cmVlXCIpOyAgLy8g66e1XG5cdFx0XHRcdFx0XHR2YXIgZXRyZWUgPSAkLmZuLnpUcmVlLmdldFpUcmVlT2JqKFwiZXRyZWVcIik7ICAgLy8g7J2067Kk7Yq4IOuntVxuXHRcdFx0XHRcdFx0dmFyIGdyYXBodHJlZSA9ICQuZm4uelRyZWUuZ2V0WlRyZWVPYmooXCJncmFwaHRyZWVcIik7ICAgLy8g6re4656Y7ZSEIFxuXG5cdFx0XHRcdFx0XHQvL2V2ZW50bWFwTWFya2VyTGF5ZXJQYXJhbWV0ZXJcblxuXHRcdFx0XHRcdFx0Ly8vLy8vLy8vLy8vLy8vL+uplOyLnOyngFxuXG5cdFx0XHRcdFx0XHRiZWZvcmVHcmlkUm93ID0gJCgkKHh0YWJsZSkuZmluZChcInRib2R5XCIpLmZpbmQoXCJ0clwiKVtyb3cuaW5kZXhdKTtcblxuXHRcdFx0XHRcdFx0aWYoIW1lc3NhZ2VHcmlkRmxhZyl7XG5cblx0XHRcdFx0XHRcdFx0aWYoYmVmb3JlR3JpZFJvdzIgIT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdzIucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcblx0XHRcdFx0XHRcdFx0XHQkKFwiI3h0YWJsZV9tZXNzYWdlID4gLmJvZHlcIikuc2Nyb2xsVG9wKDApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHR2YXIgcnJjRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgbWVzc2FnZV9yb3c7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChjb3B5TWVzc2FnZVh0YWJsZURhdGEsIGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZGF0YS5zZG1UZXh0VGltZSA9PSB0aGlzLnNkbVRleHRUaW1lKXtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA9IHJvdy5kYXRhLnJvd251bSA+IDIwMCA/IHJvdy5kYXRhLnJvd251bSAtIDIwMSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA9IGluZGV4ID4gMTAwID8gaW5kZXggLSAxMDEgOiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYobWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5zdGFydFBhZ2UgPCAxKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy51cEZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnVwRmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdGNoYW5nZURhdGEgPSBjb3B5TWVzc2FnZVh0YWJsZURhdGEuc2xpY2UobWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5zdGFydFBhZ2UsIG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMuc3RhcnRQYWdlK21lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMuYnVmZmVyQ291bnQpO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly/stIjquLDtmZRcblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZUF0dHIub3B0aW9ucy5wcmV2UGFnZUNudCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHR4dGFibGVBdHRyLm9wdGlvbnMubmV4dFBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5wcmV2UGFnZUNudCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLm5leHRQYWdlQ250ID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIucmVzZXQoKTsgXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnRlbXBCb2R5LmFwcGVuZChjaGFuZ2VEYXRhKTsgXG5cblx0XHRcdFx0XHRcdFx0XHRcdCQuZWFjaChjaGFuZ2VEYXRhLCBmdW5jdGlvbihpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuc2RtVGV4dFRpbWUgPT0gdGhpcy5zZG1UZXh0VGltZSl7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlX3JvdyA9ICQoeHRhYmxlX21lc3NhZ2UpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIilbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYobWVzc2FnZV9yb3cpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JChtZXNzYWdlX3JvdykuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTsgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlX3Jvdy5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVHcmlkUm93MiA9ICQobWVzc2FnZV9yb3cpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cGFyc2VEYXRhKCQobWVzc2FnZV9yb3cpLmZpbmQoXCJpbnB1dDpjaGVja2JveFwiKS52YWwoKS5zcGxpdChcInxcIilbMF0sICQobWVzc2FnZV9yb3cpLmZpbmQoXCJpbnB1dDpjaGVja2JveFwiKS52YWwoKS5zcGxpdChcInxcIilbMV0sICQoJChtZXNzYWdlX3JvdykuZmluZChcInRkXCIpWzJdKS50ZXh0KCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRycmNGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0aWYoIXJyY0ZsYWcpe1xuXHRcdFx0XHRcdFx0XHRcdCQuZWFjaChjb3B5TWVzc2FnZVh0YWJsZURhdGEsIGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5kYXRhLnNkbVRleHRUaW1lIDwgdGhpcy5zZG1UZXh0VGltZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaSA9IGluZGV4ID4gMCA/IGluZGV4LTEgOiBpbmRleDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgYmVmb3JlVGltZSA9IHJvdy5kYXRhLnNkbVRleHRUaW1lIC0gY29weU1lc3NhZ2VYdGFibGVEYXRhW2ldLnNkbVRleHRUaW1lO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgYWZ0ZXJUaW1lID0gdGhpcy5zZG1UZXh0VGltZSAtIHJvdy5kYXRhLnNkbVRleHRUaW1lO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0VGltZSA9IGJlZm9yZVRpbWUgPiBhZnRlclRpbWUgPyBpbmRleCA6IGk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA9IHJvdy5kYXRhLnJvd251bSA+IDIwMCA/IHJvdy5kYXRhLnJvd251bSAtIDIwMSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMuc3RhcnRQYWdlID0gc2VsZWN0VGltZSA+IDEwMCA/IHNlbGVjdFRpbWUgLSAxMDEgOiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA8IDEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMudXBGbGFnID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMudXBGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlRGF0YSA9IGNvcHlNZXNzYWdlWHRhYmxlRGF0YS5zbGljZShtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSwgbWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5zdGFydFBhZ2UrbWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5idWZmZXJDb3VudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly/stIjquLDtmZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5vcHRpb25zLnByZXZQYWdlQ250ID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5vcHRpb25zLm5leHRQYWdlQ250ID0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5wcmV2UGFnZUNudCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMubmV4dFBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIucmVzZXQoKTsgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMudGVtcEJvZHkuYXBwZW5kKGNoYW5nZURhdGEpOyBcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkLmVhY2goY2hhbmdlRGF0YSwgZnVuY3Rpb24oaSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuc2RtVGV4dFRpbWUgPCB0aGlzLnNkbVRleHRUaW1lKXtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZV9yb3cgPSAkKHh0YWJsZV9tZXNzYWdlKS5maW5kKFwidGJvZHlcIikuZmluZChcInRyXCIpW2ktMV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihtZXNzYWdlX3Jvdyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCQobWVzc2FnZV9yb3cpLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlX3Jvdy5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUdyaWRSb3cyID0gJChtZXNzYWdlX3Jvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlRGF0YSgkKG1lc3NhZ2Vfcm93KS5maW5kKFwiaW5wdXQ6Y2hlY2tib3hcIikudmFsKCkuc3BsaXQoXCJ8XCIpWzBdLCAkKG1lc3NhZ2Vfcm93KS5maW5kKFwiaW5wdXQ6Y2hlY2tib3hcIikudmFsKCkuc3BsaXQoXCJ8XCIpWzFdLCAkKCQobWVzc2FnZV9yb3cpLmZpbmQoXCJ0ZFwiKVsyXSkudGV4dCgpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cnJjRmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRpZighcnJjRmxhZyl7XG5cblx0XHRcdFx0XHRcdFx0XHR4dGFibGVBdHRyLm9wdGlvbnMuc3RhcnRQYWdlID0gcm93LmRhdGEucm93bnVtID4gMjAwID8gcm93LmRhdGEucm93bnVtIC0gMjAxIDogMDtcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA9ICQoeHRhYmxlX21lc3NhZ2UpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIikubGVuZ3RoLTEgPiAxMDAgPyAkKHh0YWJsZV9tZXNzYWdlKS5maW5kKFwidGJvZHlcIikuZmluZChcInRyXCIpLmxlbmd0aC0xIC0gMTAxIDogMDtcblx0XHRcdFx0XHRcdFx0XHRpZihtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSA8IDEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy51cEZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMudXBGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlRGF0YSA9IGNvcHlNZXNzYWdlWHRhYmxlRGF0YS5zbGljZShtZXNzYWdlWHRhYmxlQXR0ci5vcHRpb25zLnN0YXJ0UGFnZSwgbWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5zdGFydFBhZ2UrbWVzc2FnZVh0YWJsZUF0dHIub3B0aW9ucy5idWZmZXJDb3VudCk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdC8v7LSI6riw7ZmUXG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5vcHRpb25zLnByZXZQYWdlQ250ID0gMTtcblx0XHRcdFx0XHRcdFx0XHR4dGFibGVBdHRyLm9wdGlvbnMubmV4dFBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMucHJldlBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMubmV4dFBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLnJlc2V0KCk7IFxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMudGVtcEJvZHkuYXBwZW5kKGNoYW5nZURhdGEpOyBcblxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2Vfcm93ID0gJCh4dGFibGVfbWVzc2FnZSkuZmluZChcInRib2R5XCIpLmZpbmQoXCJ0clwiKVtjaGFuZ2VEYXRhLmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdFx0XHRpZihtZXNzYWdlX3Jvdyl7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKG1lc3NhZ2Vfcm93KS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpOyBcblx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2Vfcm93LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUdyaWRSb3cyID0gJChtZXNzYWdlX3Jvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlRGF0YSgkKG1lc3NhZ2Vfcm93KS5maW5kKFwiaW5wdXQ6Y2hlY2tib3hcIikudmFsKCkuc3BsaXQoXCJ8XCIpWzBdLCAkKG1lc3NhZ2Vfcm93KS5maW5kKFwiaW5wdXQ6Y2hlY2tib3hcIikudmFsKCkuc3BsaXQoXCJ8XCIpWzFdLCAkKCQobWVzc2FnZV9yb3cpLmZpbmQoXCJ0ZFwiKVsyXSkudGV4dCgpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdG1lc3NhZ2VHcmlkRmxhZyA9IGZhbHNlO1xuXG5cblxuXHRcdFx0XHRcdFx0Ly8vLy8vLy8vLy8vLy8vL+q3uOuemO2UhFxuXG5cdFx0XHRcdFx0XHRpZihncmFwaHRyZWUuZ2V0Q2hlY2tlZE5vZGVzKCkubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0XHRcdGlmKGJlZm9yZVNlbGVjdGVkUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRcdGdyYXBoQXR0ci54QXhpc1swXS5yZW1vdmVQbG90TGluZShiZWZvcmVTZWxlY3RlZFBvaW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdCQuZWFjaChncmFwaEF0dHIuc2VyaWVzWzBdLmRhdGEsIGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZGF0YS5maWxlTm8gPT0gZ3JhcGhEYXRhLmdyYXBoRGF0YVsnZmlsZW5vJ11baW5kZXhdWzFdICYmICByb3cuZGF0YS5zZG1UZXh0VGltZSA9PSBncmFwaERhdGEuZ3JhcGhEYXRhWydzZG1UZXh0VGltZSddW2luZGV4XVsxXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRncmFwaEF0dHIueEF4aXNbMF0uYWRkUGxvdExpbmUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JlZCcsIC8vIENvbG9yIHZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBncmFwaEF0dHIuc2VyaWVzWzBdLmRhdGFbaW5kZXhdLngsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhc2hTdHlsZTogJ3NvbGlkJywgLy8gU3R5bGUgb2YgdGhlIHBsb3QgbGluZS4gRGVmYXVsdCB0byBzb2xpZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogZ3JhcGhBdHRyLnNlcmllc1swXS5kYXRhW2luZGV4XS54LCAvLyBWYWx1ZSBvZiB3aGVyZSB0aGUgbGluZSB3aWxsIGFwcGVhclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMiAvLyBXaWR0aCBvZiB0aGUgbGluZSAgICBcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlU2VsZWN0ZWRQb2ludCA9IGdyYXBoQXR0ci5zZXJpZXNbMF0uZGF0YVtpbmRleF0ueDtcblx0XHRcdFx0XHRcdFx0XHRcdHNob3dGbGFnID0gdHJ1ZTsgXG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYoIXNob3dGbGFnKXtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5kYXRhLmZpbGVObyA9PSBncmFwaERhdGEuZ3JhcGhEYXRhWydmaWxlbm8nXVtpbmRleF1bMV0gJiYgcGFyc2VJbnQocm93LmRhdGEuc2RtVGV4dFRpbWUpIDwgcGFyc2VJbnQoZ3JhcGhEYXRhLmdyYXBoRGF0YVsnc2RtVGV4dFRpbWUnXVtpbmRleF1bMV0pKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JhcGhBdHRyLnhBeGlzWzBdLmFkZFBsb3RMaW5lKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICdyZWQnLCAvLyBDb2xvciB2YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogZ3JhcGhBdHRyLnNlcmllc1swXS5kYXRhW2luZGV4XS54LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXNoU3R5bGU6ICdzb2xpZCcsIC8vIFN0eWxlIG9mIHRoZSBwbG90IGxpbmUuIERlZmF1bHQgdG8gc29saWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGdyYXBoQXR0ci5zZXJpZXNbMF0uZGF0YVtpbmRleF0ueCwgLy8gVmFsdWUgb2Ygd2hlcmUgdGhlIGxpbmUgd2lsbCBhcHBlYXJcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDIgLy8gV2lkdGggb2YgdGhlIGxpbmUgICAgXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZVNlbGVjdGVkUG9pbnQgPSBncmFwaEF0dHIuc2VyaWVzWzBdLmRhdGFbaW5kZXhdLng7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaG93RmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcblxuXG5cdFx0XHRcdFx0XHQvLy8vLy8vLy8vLy8vLy8vLy/rp7UgXG5cblx0XHRcdFx0XHRcdHZhciBnZXRGb3JtYXRlZERhdGVUaW1lID0gZnVuY3Rpb24obWlsbGl0aW1lKXtcblx0XHRcdFx0XHRcdFx0dmFyIGQgPSBuZXcgRGF0ZShtaWxsaXRpbWUpO1xuXHRcdFx0XHRcdFx0XHQvL3JldHVybiBHbG9iYWxpemUuZm9ybWF0KGQsICdhJykgKyAnLicgKyBscGFkKGQuZ2V0TWlsbGlzZWNvbmRzKCksIDMsICcwJyk7XG5cdFx0XHRcdFx0XHRcdHZhciBtb250aCA9IChkLmdldE1vbnRoKCkrMSk7XG5cdFx0XHRcdFx0XHRcdG1vbnRoID0gZ2V0Rm9ybWF0ZWREYXRlVGltZTIobW9udGgpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0dmFyIGRheSA9IGdldEZvcm1hdGVkRGF0ZVRpbWUyKGQuZ2V0RGF0ZSgpKTtcblx0XHRcdFx0XHRcdFx0dmFyIGhvdXJzID0gZ2V0Rm9ybWF0ZWREYXRlVGltZTIoZC5nZXRIb3VycygpKTtcblx0XHRcdFx0XHRcdFx0dmFyIG1pbnV0ZXMgPSBnZXRGb3JtYXRlZERhdGVUaW1lMihkLmdldE1pbnV0ZXMoKSk7XG5cdFx0XHRcdFx0XHRcdHZhciBzZWNvbmRzID0gZ2V0Rm9ybWF0ZWREYXRlVGltZTIoZC5nZXRTZWNvbmRzKCkpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQuZ2V0RnVsbFllYXIoKSArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRheSArIFwiIFwiICsgaG91cnMgKyBcIjpcIiArIG1pbnV0ZXMgKyBcIjpcIiArIHNlY29uZHM7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZ2V0Rm9ybWF0ZWREYXRlVGltZTIgPSBmdW5jdGlvbihzdHIpe1xuXHRcdFx0XHRcdFx0XHRpZihzdHIgPCAxMCkgc3RyID0gXCIwXCIgKyBzdHI7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdHI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHZhciBjb250ZW50O1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZih0cmVlLmdldENoZWNrZWROb2RlcygpLmxlbmd0aCA+IDApe1xuXG5cdFx0XHRcdFx0XHRcdHZhciBzaG93RmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR2YXIgbGF0O1xuXHRcdFx0XHRcdFx0XHR2YXIgbG5nO1xuXHRcdFx0XHRcdFx0XHR2YXIgc2RtVGltZTtcblxuXHRcdFx0XHRcdFx0XHQkLmVhY2gobWFya2VyTGF5ZXIucGFyYW1ldGVycywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZGF0YS5maWxlTm8gPT0gdGhpcy5maWxlTm8gJiYgIHJvdy5kYXRhLnNkbVRleHRUaW1lID09IHRoaXMuc2RtVGV4dFRpbWUpe1xuXHRcdFx0XHRcdFx0XHRcdFx0bGF0ID0gdGhpcy5sYXQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRsbmcgPSB0aGlzLmxuZztcblx0XHRcdFx0XHRcdFx0XHRcdHNkbVRpbWUgPSB0aGlzLnNkbVRpbWU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHNob3dGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZighc2hvd0ZsYWcpe1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuZmlsZU5vID09IHRoaXMuZmlsZU5vICYmIHBhcnNlSW50KHJvdy5kYXRhLnNkbVRleHRUaW1lKSA8IHBhcnNlSW50KHRoaXMuc2RtVGV4dFRpbWUpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ID0gdGhpcy5sYXQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxuZyA9IHRoaXMubG5nO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZG1UaW1lID0gdGhpcy5zZG1UaW1lO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2hvd0ZsYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZighc2hvd0ZsYWcpe1xuXHRcdFx0XHRcdFx0XHRcdGxhdCA9IG1hcmtlckxheWVyLnBhcmFtZXRlcnNbbWFya2VyTGF5ZXIucGFyYW1ldGVycy5sZW5ndGgtMV0ubGF0O1xuXHRcdFx0XHRcdFx0XHRcdGxuZyA9IG1hcmtlckxheWVyLnBhcmFtZXRlcnNbbWFya2VyTGF5ZXIucGFyYW1ldGVycy5sZW5ndGgtMV0ubG5nO1xuXHRcdFx0XHRcdFx0XHRcdHNkbVRpbWUgPSBtYXJrZXJMYXllci5wYXJhbWV0ZXJzW21hcmtlckxheWVyLnBhcmFtZXRlcnMubGVuZ3RoLTFdLnNkbVRpbWU7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0c2hvd0ZsYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHR2YXIgY29kZXZhbHVlID0gMDtcblx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdGVkTWFwUGFyYW1ldGVyVmFsdWUgPSAnJztcblxuXHRcdFx0XHRcdFx0XHQkLmVhY2godHJlZS5nZXRDaGVja2VkTm9kZXMoKSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmV2ZW50Y29kZTIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGFbdGhpcy5ldmVudGNvZGUyXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvZGV2YWx1ZSA9IHJvdy5kYXRhW3RoaXMuZXZlbnRjb2RlMl07XG5cdFx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29kZXZhbHVlID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRNYXBQYXJhbWV0ZXJWYWx1ZSArPSB0aGlzLm5hbWUgKyAnIDogJyArIGNvZGV2YWx1ZSArICc8YnI+Jztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgPSAnRGF0ZSA6ICcgKyBnZXRGb3JtYXRlZERhdGVUaW1lKHNkbVRpbWUpICsgJzxicj4nICsgc2VsZWN0ZWRNYXBQYXJhbWV0ZXJWYWx1ZTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgaW5mbyA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxhdCA6IGxhdCxcblx0XHRcdFx0XHRcdFx0XHRcdGxuZyA6IGxuZyxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQgOiBjb250ZW50LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZSA6IHNkbVRpbWVcblx0XHRcdFx0XHRcdFx0fTtcblxuXG5cdFx0XHRcdFx0XHRcdG1hcDIuc2hvd0luZm9Pbmx5KGluZm8pO1xuXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihldHJlZS5nZXRDaGVja2VkTm9kZXMoKS5sZW5ndGggPiAwKXtcblxuXHRcdFx0XHRcdFx0XHR2YXIgc2hvd0ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dmFyIGxhdDtcblx0XHRcdFx0XHRcdFx0dmFyIGxuZztcblx0XHRcdFx0XHRcdFx0dmFyIHNkbVRpbWU7XG5cblx0XHRcdFx0XHRcdFx0JC5lYWNoKGV2ZW50bWFwTWFya2VyTGF5ZXJQYXJhbWV0ZXIsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuZmlsZU5vID09IHRoaXMuZmlsZU5vICYmICByb3cuZGF0YS5zZG1UZXh0VGltZSA9PSB0aGlzLnNkbVRleHRUaW1lKXtcblx0XHRcdFx0XHRcdFx0XHRcdGxhdCA9IHRoaXMubGF0O1xuXHRcdFx0XHRcdFx0XHRcdFx0bG5nID0gdGhpcy5sbmc7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZG1UaW1lID0gdGhpcy5zZG1NaWxsaVRpbWU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHNob3dGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZighc2hvd0ZsYWcpe1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuZmlsZU5vID09IHRoaXMuZmlsZU5vICYmIHBhcnNlSW50KHJvdy5kYXRhLnNkbVRleHRUaW1lKSA8IHBhcnNlSW50KHRoaXMuc2RtVGV4dFRpbWUpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ID0gdGhpcy5sYXQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxuZyA9IHRoaXMubG5nO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZG1UaW1lID0gdGhpcy5zZG1NaWxsaVRpbWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzaG93RmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZighc2hvd0ZsYWcpe1xuXHRcdFx0XHRcdFx0XHRcdGxhdCA9IGV2ZW50bWFwTWFya2VyTGF5ZXJQYXJhbWV0ZXJbZXZlbnRtYXBNYXJrZXJMYXllclBhcmFtZXRlci5sZW5ndGgtMV0ubGF0O1xuXHRcdFx0XHRcdFx0XHRcdGxuZyA9IGV2ZW50bWFwTWFya2VyTGF5ZXJQYXJhbWV0ZXJbZXZlbnRtYXBNYXJrZXJMYXllclBhcmFtZXRlci5sZW5ndGgtMV0ubG5nO1xuXHRcdFx0XHRcdFx0XHRcdHNkbVRpbWUgPSBldmVudG1hcE1hcmtlckxheWVyUGFyYW1ldGVyW2V2ZW50bWFwTWFya2VyTGF5ZXJQYXJhbWV0ZXIubGVuZ3RoLTFdLnNkbU1pbGxpVGltZTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRzaG93RmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgPSAnRGF0ZSA6ICcgKyBnZXRGb3JtYXRlZERhdGVUaW1lKHNkbVRpbWUpO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBpbmZvID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGF0IDogbGF0LFxuXHRcdFx0XHRcdFx0XHRcdFx0bG5nIDogbG5nLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGVudCA6IGNvbnRlbnQsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRlIDogc2RtVGltZVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdG1hcDMuc2hvd0luZm9Pbmx5KGluZm8pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb2xzaG93OiBmdW5jdGlvbihjb2x1bW4sIGUpIHtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbGhpZGU6IGZ1bmN0aW9uKGNvbHVtbiwgZSkge1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y29scmVzaXplOiBmdW5jdGlvbihjb2x1bW4sIGUpIHtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRibGNsaWNrOiBmdW5jdGlvbihyb3csIGUpIHtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNvcnQ6IGZ1bmN0aW9uKGNvbHVtbiwgZSkge1xuXHRcdFx0XHRcdFx0dmFyIGNsYXNzTmFtZSA9IHtcblx0XHRcdFx0XHRcdFx0XCJkZXNjXCI6IFwiaWNvbi1hcnJvdzFcIixcblx0XHRcdFx0XHRcdFx0XCJhc2NcIjogXCJpY29uLWFycm93M1wiXG5cdFx0XHRcdFx0XHR9W2NvbHVtbi5vcmRlcl07XG5cdFx0XHRcdFx0XHQkKHh0YWJsZUF0dHIubGlzdENvbHVtbigpKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdCQodGhpcy5lbGVtZW50KS5jaGlsZHJlbihcImlcIikucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdCQoY29sdW1uLmVsZW1lbnQpLmFwcGVuZChcIjxpIGNsYXNzPSdcIiArIGNsYXNzTmFtZSArIFwiJz48L2k+XCIpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZmlsdGVyQ2hhbmdlOiBmdW5jdGlvbihjb2x1bW4sZSl7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImNoYW5nZSA6IFwiICsgY29sdW1uICk7XG5cdFx0XHRcdFx0XHRsYXN0RmlsdGVyRGF0YSA9IGNvbHVtbjtcdFx0XG5cdFx0XHRcdFx0XHR4dGFibGVBdHRyLm9wdGlvbnMucGFnZSA9ICQoXCIjcGFnZV9pbnB1dFwiKS52YWwoKTtcblx0XHRcdFx0XHRcdG1hcmtlckNsaWNrRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bWVzc2FnZUNsaWNrRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5maWx0ZXIoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHZhciBmbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChPYmplY3Qua2V5cyhjb2x1bW4pLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoY29sdW1uW3RoaXMudG9TdHJpbmcoKV0gIT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhW3RoaXMudG9TdHJpbmcoKV0gPT0gbnVsbCB8fCBkYXRhW3RoaXMudG9TdHJpbmcoKV0udG9TdHJpbmcoKS5pbmRleE9mKGNvbHVtblt0aGlzLnRvU3RyaW5nKCldKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmxhZztcblx0XHRcdFx0XHRcdH0pO1x0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dHBsOiB7XG5cdFx0XHRcdFx0cm93OiAkKFwiI1wiK3NlbGYub3B0aW9ucy5pdGVtLnRwbC5yb3cpLmh0bWwoKSxcblx0XHRcdFx0XHRub25lIDogJChcIiNcIitzZWxmLm9wdGlvbnMuaXRlbS50cGwubm9uZSkuaHRtbCgpLFxuXHRcdFx0XHRcdG1lbnUgOiAkKFwiI1wiK3NlbGYub3B0aW9ucy5pdGVtLnRwbC5tZW51KS5odG1sKClcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHRcdFxuXHRcdCQoXCIjaXdfY29udGFpbmVyID4gLmJvZHlcIikuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyXCIpLmhlaWdodCgpIC0gMzApO1xuXG5cdH0sXG5cdF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0JChcIiN0b3RfcGFnZVwiKS50ZXh0KE1hdGguY2VpbChwYXJzZUZsb2F0KHZhbHVlLnBhZ2VJbmZvLnRvdGFsQ291bnQpIC8gcGFyc2VGbG9hdCh2YWx1ZS5wYWdlSW5mby5saXN0Q291bnQpKSA9PSBcIlwiID8gMSA6IE1hdGguY2VpbChwYXJzZUZsb2F0KHZhbHVlLnBhZ2VJbmZvLnRvdGFsQ291bnQpIC8gcGFyc2VGbG9hdCh2YWx1ZS5wYWdlSW5mby5saXN0Q291bnQpKSk7XG5cdFx0JChcIiN0b3RfY250XCIpLnRleHQodmFsdWUucGFnZUluZm8udG90YWxDb3VudCtcIuqxtCBcIik7XG5cdFx0XHRcdFxuXHRcdHRoaXMueHRhYmxlLnVwZGF0ZSh2YWx1ZS5yZXN1bHQpO1xuXHRcdFxuXHRcdHRoaXMucmVzaXplKCk7XG5cdFx0dGhpcy54dGFibGUucmVzaXplKCk7XG5cblx0XHRcblx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcblx0XHRpZihpdWkuZGFzaGJvYXJkLndpZGdldHMubGVuZ3RoIDw9IGRhc2hib2FyZFdpZGdldElkeCl7XG5cdFx0XHRsb2FkaW5nRW5kKCk7XG5cdFx0fVxuXG5cdFx0eHRhYmxlQXR0ciA9IHRoaXMueHRhYmxlO1xuXHRcdGNvcHlYdGFibGVEYXRhID0geHRhYmxlQXR0ci5saXN0RGF0YSgpO1xuXHRcdHRoaXMueHRhYmxlLm9wdGlvbnMuZGF0YSA9IGNvcHlYdGFibGVEYXRhO1xuXG5cdFx0Ly8kKFwiI2l3X2NvbnRhaW5lclwiKS5oZWlnaHQod2luZG93LmlubmVySGVpZ2h0LzEuMzYpO1xuXHRcdC8vJChcIiN4dGFibGVcIikuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyXCIpLmhlaWdodCgpKTtcblxuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge30sXG5cblx0LyoqXG5cdCAqIO2BrOq4sCDrs4Dqsr1cblx0ICovXG5cdHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXHRcdGdyaWRSZXNpemVGbGFnID0gdHJ1ZTtcblx0XHRiZWZvcmVHcmlkSGVpZ2h0ID0gJChcIiN4dGFibGUgPiAuYm9keVwiKS5oZWlnaHQoKTtcblxuXHRcdCQodGhpcy54dGFibGUucm9vdCkud2lkdGgoXCIxMDAlXCIpLmhlaWdodChcIjk1JVwiKTtcblx0XHR0aGlzLnh0YWJsZS5zY3JvbGxXaWR0aCgkKHRoaXMueHRhYmxlLnJvb3QpLmlubmVyV2lkdGgoKSk7XG5cdFx0dGhpcy54dGFibGUuc2Nyb2xsSGVpZ2h0KCQodGhpcy54dGFibGUucm9vdCkuaW5uZXJIZWlnaHQoKSk7XG5cdFx0Ly8kKFwiI2l3X2NvbnRhaW5lciA+IC5ib2R5XCIpLmhlaWdodCgkKFwiI2l3X2NvbnRhaW5lclwiKS5oZWlnaHQoKS00MCk7XG5cblx0XHQkKFwiI2l3X2NvbnRhaW5lclwiKS5oZWlnaHQoJChcIiNpd19jb250YWluZXJcIikucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGVpZ2h0KCkgLSA0Mik7XG5cdFx0dGhpcy54dGFibGUuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyXCIpLmhlaWdodCgpKTtcblx0XHQkKFwiI3h0YWJsZSA+IC5ib2R5XCIpLmhlaWdodCgkKFwiI2l3X2NvbnRhaW5lclwiKS5oZWlnaHQoKS0zNCk7XG5cdFx0XG5cdFx0dGhpcy54dGFibGUucmVzaXplKCk7XG5cdFx0XG5cdFx0XG5cdFx0YWZ0ZXJHcmlkSGVpZ2h0ID0gJChcIiN4dGFibGUgPiAuYm9keVwiKS5oZWlnaHQoKTtcblx0fVxuXG59KTtcbiIsIi8vKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4vL2lmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbi8vZGVmaW5lKFsnanF1ZXJ5JywgJ2QzJywgJ2MzJ10sIGZhY3RvcnkpO1xuLy99XG4vL2Vsc2Uge1xuLy9mYWN0b3J5KGpRdWVyeSk7XG4vL31cbi8vfSkoZnVuY3Rpb24gKCQpIHtcbnZhciBzY29wZSA9IHdpbmRvdztcbnZhciBUQUJMRV9DSEFSVF9JRFggPSAwO1xuXG4kLndpZGdldCgnaXVpLmNoYXJ0aGlnaG1hcHMnLCB7XG5cdF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLnJlZnJlc2goKTtcblxuXHRcdHNlbGYuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHNlbGYpO1xuXHRcblx0XHRpZiAoc2VsZi5vcHRpb25zLmludGVydmFsKSB7XG5cdFx0XHRpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNsaWNrRmxhZyA9IHRydWU7XG5cdFx0XHRcdGludGVydmFsRmxhZyA9IHRydWU7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0fSwgc2VsZi5vcHRpb25zLmludGVydmFsKTtcblx0XHR9XG5cdH0sXG5cdF9wYXJzZUNvbHVtbnM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29sdW1ucyA9IHt9O1xuXHRcdCQuZWFjaCh0aGlzLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24gKGkpIHtcblx0XHRcdHZhciBrZXkgPSB0aGlzWzBdO1xuXHRcdFx0Y29sdW1uc1trZXldID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMSwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGNvbHVtbnNba2V5XS5wdXNoKHRoaXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiBjb2x1bW5zO1xuXHRcdH1maW5hbGx5e1xuXHRcdFx0Y29sdW1ucyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0Ly8gaWYgKGtleSA9PT0gXCJwYXJhbXNcIikge1xuXHRcdC8vIH1cblx0XHR0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcblxuXHRcdGlmKHRoaXMub3B0aW9ucy5wYXJhbXMgPT0gXCJyZWZyZXNoXCIgfHwgdGhpcy5lbGVtZW50LnBhcmVudCgpLmZpbmQoXCIuXCIrdGhpcy5vcHRpb25zLnBhcmFtcykubGVuZ3RoID4gMCl7XG5cdFx0XHR0aGlzLnJlZnJlc2goKTtcblx0XHR9XHRcblxuXHRcdHRoaXMucmVmcmVzaCgpO1xuXHR9LFxuXG5cdC8vIF9zZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHQvLyAgdGhpcy5fc3VwZXIob3B0aW9ucyk7XG5cdC8vICB0aGlzLnJlZnJlc2goKTtcblx0Ly8gfSxcblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcblx0XHR2YXIgdyA9IHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKVxuXHRcdFx0XHQuaW5uZXJXaWR0aCgpIC0gMTA7IFxuXHRcdHZhciBoID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHRcdC5pbm5lckhlaWdodCgpIC0gNTA7XG5cblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsIDogc2VsZi5vcHRpb25zLmRhdGEsXG5cdFx0XHR0eXBlIDogXCJwb3N0XCIsXG5cdFx0XHRkYXRhVHlwZSA6IFwianNvblwiLFxuXHRcdFx0ZGF0YSA6IHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5zZXJpYWxpemUoKSxcblx0XHRcdHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0dmFyIHNlcmllc1RlbXAgPSBbXTtcblx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHNlcmllc1RlbXAucHVzaCh7Y29kZTogdGhpcy5jb2RlfSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR2YXIgY2hhcnQgPSBuZXcgSGlnaGNoYXJ0cy5tYXBDaGFydCh7XG5cdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0ZW5hYmxlZDpmYWxzZSBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHRyZW5kZXJUbzogJChzZWxmLmVsZW1lbnQpLmF0dHIoXCJpZFwiKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdHRleHQ6IG51bGxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1hcE5hdmlnYXRpb246IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRlbmFibGVEb3VibGVDbGlja1pvb21UbzogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y29sb3JBeGlzOiB7XG5cdFx0XHRcdFx0XHRtaW46IDEsIC8vIG1pbiwgbWF4IOqwkiBkYiDsl5DshJwg67Cb7JWE7IScIOuEo+yWtOykjC5cblx0XHRcdFx0XHRcdG1heDogMTAwMCxcblx0XHRcdFx0XHRcdHR5cGU6ICdsb2dhcml0aG1pYydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGxlZ2VuZDoge1xuXHRcdFx0XHRcdCAgIGVuYWJsZWQgOiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dG9vbHRpcDoge1xuXHRcdFx0XHRcdFx0ICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdCByZXR1cm4gXCI8Yj5QYXNzPC9iPiA6IFwiK3RoaXMucG9pbnQucGFzc0NvdW50LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIsXCIpXG5cdFx0XHRcdFx0XHRcdCArXCI8YnI+PGI+RmFpbDwvYj4gOiBcIit0aGlzLnBvaW50LmZhaWxDb3VudC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiLFwiKVxuXHRcdFx0XHRcdFx0ICB9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZXJpZXM6IFt7XG5cdFx0XHRcdFx0XHRkYXRhOiBzZXJpZXNUZW1wLCAvL2RhdGEsIC8vZGF0YeuhnCDtlZjrqbQg7Jes65+s6rCcIOyDmO2UjOuhnCDrs7wg7IiYIOyeiOydjC4gXG5cdFx0XHRcdFx0XHRtYXBEYXRhOiBIaWdoY2hhcnRzLm1hcHNbJ2N1c3RvbS93b3JsZCddLFxuXHRcdFx0XHRcdFx0am9pbkJ5OiBbJ2lzby1hMicsICdjb2RlJ10sXG5cdFx0XHRcdFx0XHRuYW1lOiAndG9vbHRpcCB0aXRsZScsXG5cdFx0XHRcdFx0XHRzdGF0ZXM6IHtcblx0XHRcdFx0XHRcdFx0aG92ZXI6IHtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogSGlnaGNoYXJ0cy5nZXRPcHRpb25zKCkuY29sb3JzWzJdXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRkYXRhTGFiZWxzOiB7XG5cdFx0XHRcdFx0XHQgIGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHQgIGZvcm1hdHRlcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQgaWYgKHRoaXMucG9pbnQuY29kZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnBvaW50LmNvZGU7XG5cdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHQgIH1cblx0XHRcdFx0XHQgICB9XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y2hhcnQuc2V0U2l6ZSh3LCBoKTtcdFx0XHRcdFx0XG5cdFx0XHRcdGRhc2hib2FyZFdpZGdldElkeCsrO1x0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdHNlbGYuY2hhcnQgPSBjaGFydDtcblx0XHRcdH0sXG5cdFx0XHRlcnJvciA6IGZ1bmN0aW9uKGVycm9yLCByZXF1ZXN0LCBzdGF0dXMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFxuXG5cdFx0dGhpcy5fdHJpZ2dlcignd2lsbHVwZGF0ZScsIG51bGwsIHRoaXMpO1xuXHR9LFxuXG5cdF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOyCreygnFxuXHQgKi9cblx0dW5sb2FkOiBmdW5jdGlvbiAodmFsdWUpIHt9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdyA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKVxuXHRcdFx0LmlubmVyV2lkdGgoKS0xMDtcblx0XHR2YXIgaCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKVxuXHRcdFx0XHQuaW5uZXJIZWlnaHQoKS01MDtcblxuXHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcblx0IFxuXHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdGggPSB0aGlzLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaW5uZXJIZWlnaHQoKSAtIDYwO1xuXHRcdH1cblx0XHRcblx0XHRpZih0aGlzLmNoYXJ0KXtcblx0XHRcdHRoaXMuY2hhcnQuc2V0U2l6ZSh3LCBoKTtcblx0XHR9XG5cdH1cblxufSk7XG4vL30pO1xuIiwiXG52YXIgc2NvcGUgPSB3aW5kb3c7XG52YXIgTElORV9DSEFSVF9JRFggPSAwO1xuJC53aWRnZXQoJ2l1aS5jaGFydGxpbmUnLCB7XG4gXG4gX3NldE9wdGlvbjogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgLy8gaWYgKGtleSA9PT0gXCJwYXJhbXNcIikge1xuICAvLyB9XG4gIHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuXG4gICAgaWYodGhpcy5vcHRpb25zLnBhcmFtcyA9PSBcInJlZnJlc2hcIiB8fCB0aGlzLmVsZW1lbnQucGFyZW50KCkuZmluZChcIi5cIit0aGlzLm9wdGlvbnMucGFyYW1zKS5sZW5ndGggPiAwKXtcblx0XHR0aGlzLnJlZnJlc2goKTtcblx0fVxuIH0sXG4gX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0aWYodGhpcy5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFBhcmFtZWdlckdyYXBoXCIpID4gLTEpe1xuXHRcdHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5iaW5kKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuXHRcdFx0JChcIiN0YWIzXCIpLmNsaWNrKCk7XG5cdFx0XHR0cmVlVHlwZSA9IFwiZ3JhcGh0cmVlXCI7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWxmLnJlZnJlc2goKTtcblxuXHRzZWxmLl90cmlnZ2VyKCd3aWxsbW91bnQnLCBudWxsLCBzZWxmKTtcblx0Y2hhcnQgPSBudWxsO1xuXHRhamF4RGF0YSA9IG51bGw7XG5cblx0aWYgKHNlbGYub3B0aW9ucy5pbnRlcnZhbCkge1xuXHRcdGlmIChzZWxmLnRpbWVyICE9IG51bGwpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0fVxuXHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHR9LCBzZWxmLm9wdGlvbnMuaW50ZXJ2YWwpO1xuXHR9XG4gIHRoaXMuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHRoaXMpO1xuXG4gfSxcbiBcbiByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG5cdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0dmFyIHRpdGxlVGV4dCA9IFwiXCI7XG5cdFxuXHRcblx0aWYodGhpcy5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFJ0ZEZvclZlcnNpb25OUmVnaW9uXCIpID4gLTEgKXtcblx0XHR0aXRsZVRleHQgPSBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPWdlbmVyYXRpb25dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KClcblx0XHRcdFx0KyBcIiBcIiArIHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiZm9ybVwiKS5maW5kKFwiW25hbWU9bW9kZWxZZWFyXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdCsgXCIgXCIgKyBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPXBsYXRmb3JtXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdCsgXCIgXCIgKyBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPXNtc1Rlc3REb21haW5dIG9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KCk7XG5cdH1lbHNlIGlmKHRoaXMub3B0aW9ucy5kYXRhLmluZGV4T2YoXCJnZXRSdGRGb3JSZWdpb25WZXJzaW9uQmx1ZUJ1dHRvblwiKSA+IC0xICl7XG5cdFx0dGl0bGVUZXh0ID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLmZpbmQoXCJbbmFtZT1zbGJEZXZpY2VHZW5lcmF0aW9uXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpXG5cdFx0XHRcdCsgXCIgXCIgKyBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcImZvcm1cIikuZmluZChcIltuYW1lPXNsYk1vZGVsWWVhcl0gb3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKVxuXHRcdFx0XHQrIFwiIFwiICsgc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLmZpbmQoXCJbbmFtZT1zbGJEZXZpY2VQbGF0Zm9ybV0gb3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKVxuXHRcdFx0XHQrIFwiIFwiICsgc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLmZpbmQoXCJbbmFtZT1zbGJTbXNUZXN0RG9tYWluXSBvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpO1xuXHR9XG5cdFxuXG5cdHNlbGYuZWxlbWVudC5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuaWQpO1xuXG5cdHZhciB3ID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0LmlubmVyV2lkdGgoKSAtIDEwOyBcblx0dmFyIGggPSBzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KClcblx0XHQuaW5uZXJIZWlnaHQoKSAtIDUwO1xuXHRcblx0aWYodGhpcy5vcHRpb25zLmRhdGEuaW5kZXhPZihcImdldFBhcmFtZWdlckdyYXBoXCIpID4gLTEpe1xuXHRcdFxuXHRcdHZhciB0cmVlID0gJC5mbi56VHJlZS5nZXRaVHJlZU9iaihcImdyYXBodHJlZVwiKTtcblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsIDogc2VsZi5vcHRpb25zLmRhdGEsXG5cdFx0XHR0eXBlIDogXCJwb3N0XCIsXG5cdFx0XHRkYXRhVHlwZSA6IFwianNvblwiLFxuXHRcdFx0ZGF0YSA6ICQoXCIjc2VhcmNoX2Zvcm1cIikuc2VyaWFsaXplKCksXG5cdFx0XHRzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cblx0XHRcdFx0aWYoZGF0YS5ncmFwaERhdGEgPT0gbnVsbCB8fCBkYXRhLmdyYXBoRGF0YSA9PSBcIlwiKXtcblx0XHRcdFx0XHRpZihzZWxmLmVsZW1lbnQuZmluZChcImgzXCIpLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0c2VsZi5lbGVtZW50LmZpbmQoXCJoM1wiKS50ZXh0KFwi642w7J207YSw6rCAIOyXhuyKteuLiOuLpC5cIik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKHNlbGYuY2hhcnQpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNoYXJ0LmRlc3Ryb3koKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC5hcHBlbmQoXCI8aDMgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyOyc+642w7J207YSw6rCAIOyXhuyKteuLiOuLpC48L2gzPlwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRncmFwaERhdGEgPSBkYXRhO1xuXG5cdFx0XHRcdFx0Z3JhcGhBdHRyID0gbmV3IEhpZ2hjaGFydHMuQ2hhcnQoe1xuXHRcdFx0XHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRcdFx0XHRlbmFibGVkOmZhbHNlIFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0XHRcdFx0cmVuZGVyVG86ICQoc2VsZi5lbGVtZW50KS5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0XHRcdFx0em9vbVR5cGU6ICd4J1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogdGl0bGVUZXh0XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0eEF4aXM6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ2RhdGV0aW1lJyxcblx0XHRcdFx0XHRcdFx0ZGF0ZVRpbWVMYWJlbEZvcm1hdHM6IHtcblx0XHRcdFx0XHRcdFx0XHRkYXk6ICclZCAlSDolTSdcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJydcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHBsb3RPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdHNlcmllczoge1xuXHRcdFx0XHRcdFx0XHRcdHBvaW50U3RhcnQ6IDAgLFxuXHRcdFx0XHRcdFx0XHRcdGFsbG93UG9pbnRTZWxlY3Q6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0cG9pbnQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGV2ZW50czp7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGVjdDogZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGJlZm9yZVNlbGVjdGVkUG9pbnQpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JhcGhBdHRyLnhBeGlzWzBdLnJlbW92ZVBsb3RMaW5lKGJlZm9yZVNlbGVjdGVkUG9pbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGdyYXBoQXR0ci54QXhpc1swXS5hZGRQbG90TGluZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogJ3JlZCcsIC8vIENvbG9yIHZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogZS50YXJnZXQueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhc2hTdHlsZTogJ3NvbGlkJywgLy8gU3R5bGUgb2YgdGhlIHBsb3QgbGluZS4gRGVmYXVsdCB0byBzb2xpZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGUudGFyZ2V0LngsIC8vIFZhbHVlIG9mIHdoZXJlIHRoZSBsaW5lIHdpbGwgYXBwZWFyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMiAvLyBXaWR0aCBvZiB0aGUgbGluZSAgICBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVTZWxlY3RlZFBvaW50ID0gZS50YXJnZXQueDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hcmtlckNsaWNrRmxhZyA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkLmVhY2goY29weVh0YWJsZURhdGEsIGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuZmlsZU5vID09IGdyYXBoRGF0YS5ncmFwaERhdGFbJ2ZpbGVubyddW2UudGFyZ2V0LmluZGV4XVsxXSBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JiYgdGhpcy5zZG1UZXh0VGltZSA9PSBncmFwaERhdGEuZ3JhcGhEYXRhWydzZG1UZXh0VGltZSddW2UudGFyZ2V0LmluZGV4XVsxXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMuc3RhcnRQYWdlID0gaW5kZXggPiAxMDAgPyBpbmRleCAtIDEwMSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UgPCAxKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMudXBGbGFnID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy51cEZsYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VEYXRhID0gY29weVh0YWJsZURhdGEuc2xpY2UoeHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSwgeHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSt4dGFibGUuanVpLm9wdGlvbnMuYnVmZmVyQ291bnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8v7LSI6riw7ZmUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy5wcmV2UGFnZUNudCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy5uZXh0UGFnZUNudCA9IDE7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFya2VyRmlsZW5vID0gdGhpcy5maWxlTm87XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hcmtlckRhdGUgPSB0aGlzLnNkbVRpbWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGVBdHRyLnJlc2V0KCk7IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMudGVtcEJvZHkuYXBwZW5kKGNoYW5nZURhdGEpOyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCQuZWFjaChjaGFuZ2VEYXRhLCBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmZpbGVObyA9PSBncmFwaERhdGEuZ3JhcGhEYXRhWydmaWxlbm8nXVtlLnRhcmdldC5pbmRleF1bMV0gXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCYmIHRoaXMuc2RtVGV4dFRpbWUgPT0gZ3JhcGhEYXRhLmdyYXBoRGF0YVsnc2RtVGV4dFRpbWUnXVtlLnRhcmdldC5pbmRleF1bMV0pe1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGJlZm9yZUdyaWRSb3cgIT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdy5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCQoXCIjeHRhYmxlID4gLmJvZHlcIikuc2Nyb2xsVG9wKDApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgeHRhYmxlUm93ID0gJCh4dGFibGUpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIilbaW5kZXhdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkKHh0YWJsZVJvdykuY2xpY2soKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlUm93LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdyA9ICQoeHRhYmxlUm93KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgdHJlZSA9ICQuZm4uelRyZWUuZ2V0WlRyZWVPYmooXCJ0cmVlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0cmVlLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSAnRGF0ZSA6ICcgKyB0aGlzLnNkbVRpbWUgKyAnPGJyLz4nXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KyBlLnRhcmdldC5zZXJpZXMuZGF0YVtlLnRhcmdldC5pbmRleF0uc2VyaWVzLm5hbWUgKyBcIiA6IFwiICsgZS50YXJnZXQueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBpbmZvID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXQgOiB0aGlzLmxhdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG5nIDogdGhpcy5sbmcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQgOiBjb250ZW50LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRlIDogdGhpcy5zZG1UaW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxlTm8gOiB0aGlzLmZpbGVOb1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFwMi5zaG93SW5mb09ubHkoaW5mbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHRvb2x0aXA6IHtcblx0XHRcdFx0XHRcdFx0c2hhcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRjcm9zc2hhaXJzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRwb2ludEZvcm1hdDogJzxzcGFuIHN0eWxlPVwiY29sb3I6e3BvaW50LmNvbG9yfVwiPlxcdTI1Q0Y8L3NwYW4+PGI+IHtzZXJpZXMubmFtZX08L2I+IDoge3BvaW50Lnk6LC4yZn08YnI+Jyxcblx0XHRcdFx0XHRcdFx0eERhdGVGb3JtYXQgOiBcIiVZLSVtLSVkLCAlSDolTTolU1wiLFxuXHRcdFx0XHRcdFx0XHRkYXRlVGltZUxhYmVsRm9ybWF0cyA6IHtcblx0XHRcdFx0XHRcdFx0ICBtaWxsaXNlY29uZDpcIiVZLSVtLSVkLCAlSDolTTolU1wiLFxuXHRcdFx0XHRcdFx0XHQgIHNlY29uZDpcIiVZLSVtLSVkLCAlSDolTTolU1wiLFxuXHRcdFx0XHRcdFx0XHQgIG1pbnV0ZTpcIiVZLSVtLSVkLCAlSDolTTolU1wiLFxuXHRcdFx0XHRcdFx0XHQgIGhvdXI6XCIlWS0lbS0lZCAlSFwiLFxuXHRcdFx0XHRcdFx0XHQgIGRheTpcIiVZLSVtLSVkXCIsXG5cdFx0XHRcdFx0XHRcdCAgd2VlazpcIiVZLSVtLSVkXCIsXG5cdFx0XHRcdFx0XHRcdCAgbW9udGg6XCIlWS0lbVwiLFxuXHRcdFx0XHRcdFx0XHQgIHllYXI6XCIlWVwiXHQgXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0ZmxvYXRpbmc6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRsYXlvdXQ6IFwidmVydGljYWxcIixcblx0XHRcdFx0XHRcdFx0YWxpZ246IFwicmlnaHRcIixcblx0XHRcdFx0XHRcdFx0dmVydGljYWxBbGlnbjogXCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRcdGdyYXBoQXR0ci5zZXRTaXplKHcsIGgpO1x0XHRcdFx0XHRcblx0XHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlbGYuY2hhcnQgPSBncmFwaEF0dHI7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHQvL2xvYWRpbmdFbmQoKTtcblxuXHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcdFxuXHRcdFx0fSxcblx0XHRcdGVycm9yIDogZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QsIHN0YXR1cyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9IGVsc2Uge1xuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmwgOiBzZWxmLm9wdGlvbnMuZGF0YSxcblx0XHRcdHR5cGUgOiBcInBvc3RcIixcblx0XHRcdGRhdGFUeXBlIDogXCJqc29uXCIsXG5cdFx0XHRkYXRhIDogc2VsZi5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCJmb3JtXCIpLnNlcmlhbGl6ZSgpLFxuXHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHRcdGlmKGRhdGEubGVnZW5kID09IG51bGwgfHwgZGF0YS5sZWdlbmQgPT0gXCJcIil7XG5cdFx0XHRcdFx0aWYoc2VsZi5lbGVtZW50LmZpbmQoXCJoM1wiKS5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC5maW5kKFwiaDNcIikudGV4dChcIuuNsOydtO2EsOqwgCDsl4bsirXri4jri6QuXCIpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZihzZWxmLmNoYXJ0KXtcblx0XHRcdFx0XHRcdFx0c2VsZi5jaGFydC5kZXN0cm95KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLmVsZW1lbnQuYXBwZW5kKFwiPGgzIHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcjsnPuuNsOydtO2EsOqwgCDsl4bsirXri4jri6QuPC9oMz5cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR2YXIgeEF4aXNUZW1wID0gW107XG5cdFx0XHRcdFx0JC5lYWNoKGRhdGEuZ3JhcGhJbmZvLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0eEF4aXNUZW1wLnB1c2godGhpcy5zd1ZlcnNpb24pO1xuXHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0XHR2YXIgY2hhcnQgPSBuZXcgSGlnaGNoYXJ0cy5DaGFydCh7XG5cdFx0XHRcdFx0XHRjcmVkaXRzOnsgXG5cdFx0XHRcdFx0XHRcdGVuYWJsZWQ6ZmFsc2UgXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Y2hhcnQ6IHtcblx0XHRcdFx0XHRcdFx0XHRyZW5kZXJUbzogJChzZWxmLmVsZW1lbnQpLmF0dHIoXCJpZFwiKSxcblx0XHRcdFx0XHRcdFx0XHR6b29tVHlwZTogJ3gnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0dGl0bGU6IHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiB0aXRsZVRleHRcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzdWJ0aXRsZToge1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiAnU01TIFJURCBUaW1lJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdGNhdGVnb3JpZXM6IHhBeGlzVGVtcFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHlBeGlzOiB7XG5cdFx0XHRcdFx0XHRcdHRpdGxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1JURChzZWMpJ1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0cGxvdE9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0c2VyaWVzOiB7XG5cdFx0XHRcdFx0XHRcdFx0cG9pbnRTdGFydDogMCBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHRvb2x0aXA6IHtcblx0XHRcdFx0XHRcdFx0c2hhcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZVN1ZmZpeDogJyBzZWMnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdGZsb2F0aW5nOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0bGF5b3V0OiBcInZlcnRpY2FsXCIsXG5cdFx0XHRcdFx0XHRcdGFsaWduOiBcInJpZ2h0XCIsXG5cdFx0XHRcdFx0XHRcdHZlcnRpY2FsQWxpZ246IFwibWlkZGxlXCJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCQuZWFjaChkYXRhLmxlZ2VuZCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciBzZXJpZXNEYXRhID0gW107XG5cdFx0XHRcdFx0XHR2YXIgcmVnaW9uID0gdGhpcy5yZWdpb247XG5cblx0XHRcdFx0XHRcdCQuZWFjaChkYXRhLmdyYXBoSW5mbywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0aWYodGhpc1tyZWdpb25dKXtcblx0XHRcdFx0XHRcdFx0XHRzZXJpZXNEYXRhLnB1c2godGhpc1tyZWdpb25dKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0c2VyaWVzRGF0YS5wdXNoKG51bGwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Y2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRcdFx0bmFtZTogcmVnaW9uLFxuXHRcdFx0XHRcdFx0XHRkYXRhOiBzZXJpZXNEYXRhXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydC5zZXRTaXplKHcsIGgpO1x0XHRcdFx0XHRcblx0XHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlbGYuY2hhcnQgPSBjaGFydDtcblxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cblxuXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3IgOiBmdW5jdGlvbihlcnJvciwgcmVxdWVzdCwgc3RhdHVzKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHR9XG5cblxuICB0aGlzLl90cmlnZ2VyKCd3aWxsdXBkYXRlJywgbnVsbCwgdGhpcyk7XG4gfSxcblxuXG4gX2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gfSxcblxuXG4gLyoqXG4gICog642w7J207YSwIOy2lOqwgFxuICAqL1xuIGxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblxuIH0sXG5cbiAvKipcbiAgKiDrjbDsnbTthLAg7IKt7KCcXG4gICovXG4gdW5sb2FkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gfSxcblxuIC8qKlxuICAqIO2BrOq4sCDrs4Dqsr1cbiAgKi9cbiByZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0dmFyIHcgPSB0aGlzLmVsZW1lbnQucGFyZW50KCkucGFyZW50KClcblx0XHRcdC5pbm5lcldpZHRoKCktMTA7XG5cdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHQuaW5uZXJIZWlnaHQoKS01MDtcblxuXHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCkgLSA2MDtcblx0fVxuXHRcblx0aWYodGhpcy5jaGFydCl7XG5cdFx0dGhpcy5jaGFydC5zZXRTaXplKHcsIGgpO1xuXHR9XG4gfVxufSk7XG4iLCIvLyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuLy9pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4vL2RlZmluZShbJ2pxdWVyeScsICdkMycsICdjMyddLCBmYWN0b3J5KTtcbi8vfVxuLy9lbHNlIHtcbi8vZmFjdG9yeShqUXVlcnkpO1xuLy99XG4vL30pKGZ1bmN0aW9uICgkKSB7XG52YXIgc2NvcGUgPSB3aW5kb3c7XG52YXIgVEFCTEVfQ0hBUlRfSURYID0gMDtcbiQud2lkZ2V0KCdpdWkuY2hhcnRtZXNzYWdlZ3JpZCcsIHtcblx0X2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYuZWxlbWVudC5lbXB0eSgpLmxvYWRUZW1wbGF0ZShzZWxmLm9wdGlvbnMuaXRlbS50ZW1wbGF0ZSwge30gLCB7XG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0c2VsZi5pbml0R3JpZCgpO1xuXHRcdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHRcdFx0XG5cdFx0XHRcdHNlbGYuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5iaW5kKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCQoXCIjdGFiNFwiKS5jbGljaygpO1xuXHRcdFx0XHRcdC8vJChcIiNtYXBfdHJlZVwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0Ly8kKFwiI2dyaWRfdHJlZVwiKS5zaG93KCk7XG5cdFx0XHRcdFx0dHJlZVR5cGUgPSBcImdyaWRUcmVlXCI7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHNlbGYuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHNlbGYpO1xuXG5cdFx0aWYgKHNlbGYub3B0aW9ucy5pdGVtLmludGVydmFsKSB7XG5cdFx0XHRpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0fSwgc2VsZi5vcHRpb25zLml0ZW0uaW50ZXJ2YWwpO1xuXHRcdH1cblxuXHR9LFxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuXHRcdGlmKHZhbHVlID09IHRoaXMub3B0aW9ucy5pdGVtLmRhdGEpe1xuXHRcdFx0dGhpcy5yZWZyZXNoKCk7XG5cdFx0fVxuXHR9LFxuXHRyZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXMgfHwge307XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0dmFyIG1lc3NhZ2VfdHJlZTIgPSAkLmZuLnpUcmVlLmdldFpUcmVlT2JqKFwibWVzc2FnZXRyZWVcIik7XG5cdFx0aWYoJChcIiNzZWFyY2hfZm9ybSBbbmFtZT1jaGVja2VkSGVhZGVyTGlzdF1cIikubGVuZ3RoID4gMCl7XG5cdFx0XHQkKFwiI3NlYXJjaF9mb3JtIFtuYW1lPWNoZWNrZWRIZWFkZXJMaXN0XVwiKS5yZW1vdmUoKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1lc3NhZ2VfdHJlZTIuZ2V0Q2hlY2tlZE5vZGVzKCkubGVuZ3RoOyBpKyspe1xuXHRcdFx0JChcIiNzZWFyY2hfZm9ybVwiKS5hcHBlbmQoXCI8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdjaGVja2VkSGVhZGVyTGlzdCcgdmFsdWU9XCIrbWVzc2FnZV90cmVlMi5nZXRDaGVja2VkTm9kZXMoKVtpXS5uYW1lK1wifFwiK21lc3NhZ2VfdHJlZTIuZ2V0Q2hlY2tlZE5vZGVzKClbaV0ubmV0d29ya1R5cGUrXCI+XCIpO1xuXHRcdH1cblxuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmw6IHNlbGYub3B0aW9ucy5pdGVtLmRhdGEsXG5cdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHR0eXBlOiBcInBvc3RcIixcblx0XHRcdGRhdGE6ICQoXCIjc2VhcmNoX2Zvcm1cIikuc2VyaWFsaXplKCksXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoYWpheERhdGEpIHtcblx0XHRcdFx0c2VsZi5sb2FkKGFqYXhEYXRhKTtcblx0XHRcdFx0JChcIiNtZXNzYWdlX3RvdF9jbnRcIikuaHRtbChhamF4RGF0YS5wYWdlSW5mby50b3RhbENvdW50ICsgXCLqsbRcIik7XG5cdFx0XHRcdGRhc2hib2FyZFdpZGdldElkeCsrO1xuXHRcdFx0XHRpZihpdWkuZGFzaGJvYXJkLndpZGdldHMubGVuZ3RoIDw9IGRhc2hib2FyZFdpZGdldElkeCl7XG5cdFx0XHRcdFx0bG9hZGluZ0VuZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyYW1zID0gbnVsbDtcblx0XHRcdFx0YWpheERhdGEgPSBudWxsO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAocmVxdWVzdCwgc3RhdHVzLCBlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdGlmKGl1aS5kYXNoYm9hcmQud2lkZ2V0cy5sZW5ndGggPD0gZGFzaGJvYXJkV2lkZ2V0SWR4KXtcblx0XHRcdFx0XHRsb2FkaW5nRW5kKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwYXJhbXMgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fdHJpZ2dlcignd2lsbHVwZGF0ZScsIG51bGwsIHRoaXMpO1xuXHR9LFxuXHRpbml0R3JpZDogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdCQoJChcIi53aWRnZXQtYm9keVwiKVsxXSkuY2hpbGRyZW4oKS5oZWlnaHQoXCIxMDAlXCIpO1xuXHRcdCQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2VcIikuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2VcIikucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGVpZ2h0KCkpO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciB0YWJsZVNpemUgPSA1MDA7IC8vc2VsZi5lbGVtZW50LndpZHRoKCk7XG5cdFx0dmFyIGJlZm9yZURhdGE7XG5cblx0XHRqdWkucmVhZHkoZnVuY3Rpb24odWksIHVpeCwgXykge1xuXHRcdFx0dmFyIHRhYmxlX3dpZHRoID0gc2VsZi5lbGVtZW50LnBhcmVudCgpLm91dGVyV2lkdGgoKTtcdCAgICBcblx0XHRcdHNlbGYueHRhYmxlX21lc3NhZ2UgPSB1aXgueHRhYmxlKHNlbGYuZWxlbWVudC5maW5kKFwiI3h0YWJsZV9tZXNzYWdlXCIpLCB7XG5cdFx0XHRcdGZpZWxkczogc2VsZi5vcHRpb25zLml0ZW0uZmllbGRzLFxuXHRcdFx0XHRzb3J0OiBmYWxzZSxcblx0XHRcdFx0c29ydExvYWRpbmc6IHRydWUsXG5cdFx0XHRcdHNvcnRFeGNsdWRlIDogW1wiZmlsZU5vXCJdLFxuXHRcdFx0XHRidWZmZXIgOiBcInNjcm9sbFwiLFxuXHRcdFx0XHRidWZmZXJDb3VudCA6IDIwMCxcblx0XHRcdFx0cmVzaXplOiB0cnVlLFxuXHRcdFx0XHR3aWR0aDogdGFibGVTaXplLFxuXHRcdFx0XHRmaWx0ZXJPcHRpb246IGZpbHRlck9wdGlvbjIsXG5cdFx0XHRcdHNjcm9sbEhlaWdodDogc2VsZi5lbGVtZW50LmhlaWdodCgpLTMwLFxuXHRcdFx0XHRldmVudDoge1xuXHRcdFx0XHRcdGNvbG1lbnU6IGZ1bmN0aW9uKGNvbHVtbiwgZSkge1xuXHRcdFx0XHRcdFx0dGhpcy50b2dnbGVDb2x1bW5NZW51KGUucGFnZVggLSAyNSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKHJvdywgZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3Qocm93LmluZGV4KTtcblxuXHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdzIgPSAkKCQoeHRhYmxlX21lc3NhZ2UpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIilbcm93LmluZGV4XSk7XG5cblx0XHRcdFx0XHRcdG1lc3NhZ2VHcmlkRmxhZyA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoYmVmb3JlR3JpZFJvdyAhPSBcIlwiKXtcblx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdy5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuXHRcdFx0XHRcdFx0XHQkKFwiI3h0YWJsZSA+IC5ib2R5XCIpLnNjcm9sbFRvcCgwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vbWFya2VyQ2xpY2tGbGFnID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdHZhciB4dGFibGVfcm93O1xuXG5cdFx0XHRcdFx0XHR2YXIgcnJjRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0JC5lYWNoKGNvcHlYdGFibGVEYXRhLCBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdFx0XHRcdGlmKHJvdy5kYXRhLnNkbVRleHRUaW1lID09IHRoaXMuc2RtVGV4dFRpbWUpe1xuXG5cdFx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSA9IGluZGV4ID4gMTAwID8gaW5kZXggLSAxMDEgOiAwO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UgPCAxKXtcblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy51cEZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy51cEZsYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VEYXRhID0gY29weVh0YWJsZURhdGEuc2xpY2UoeHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSwgeHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSt4dGFibGUuanVpLm9wdGlvbnMuYnVmZmVyQ291bnQpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHQvL+y0iOq4sO2ZlFxuXHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy5wcmV2UGFnZUNudCA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLm5leHRQYWdlQ250ID0gMTtcblxuXHRcdFx0XHRcdFx0XHRcdHh0YWJsZUF0dHIucmVzZXQoKTsgXG5cdFx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLnRlbXBCb2R5LmFwcGVuZChjaGFuZ2VEYXRhKTsgXG5cblx0XHRcdFx0XHRcdFx0XHQkLmVhY2goY2hhbmdlRGF0YSwgZnVuY3Rpb24oaSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihyb3cuZGF0YS5zZG1UZXh0VGltZSA9PSB0aGlzLnNkbVRleHRUaW1lKXtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGVfcm93ID0gJCh4dGFibGUpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIilbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoeHRhYmxlX3JvdykuY2xpY2soKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlX3Jvdy5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUdyaWRSb3cgPSAkKHh0YWJsZV9yb3cpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0cnJjRmxhZyA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKCFycmNGbGFnKXtcblx0XHRcdFx0XHRcdFx0JC5lYWNoKGNvcHlYdGFibGVEYXRhLCBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuc2RtVGV4dFRpbWUgPCB0aGlzLnNkbVRleHRUaW1lKXtcblxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGkgPSBpbmRleCA+IDAgPyBpbmRleC0xIDogaW5kZXg7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhciBiZWZvcmVUaW1lID0gcm93LmRhdGEuc2RtVGV4dFRpbWUgLSBjb3B5WHRhYmxlRGF0YVtpXS5zZG1UZXh0VGltZTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBhZnRlclRpbWUgPSB0aGlzLnNkbVRleHRUaW1lIC0gcm93LmRhdGEuc2RtVGV4dFRpbWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0VGltZSA9IGJlZm9yZVRpbWUgPiBhZnRlclRpbWUgPyBpbmRleCA6IGk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UgPSBzZWxlY3RUaW1lID4gMTAwID8gc2VsZWN0VGltZSAtIDEwMSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih4dGFibGUuanVpLm9wdGlvbnMuc3RhcnRQYWdlIDwgMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy51cEZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMudXBGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hhbmdlRGF0YSA9IGNvcHlYdGFibGVEYXRhLnNsaWNlKHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UsIHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UreHRhYmxlLmp1aS5vcHRpb25zLmJ1ZmZlckNvdW50KTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdC8v7LSI6riw7ZmUXG5cdFx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMucHJldlBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLm5leHRQYWdlQ250ID0gMTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlQXR0ci5yZXNldCgpOyBcblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy50ZW1wQm9keS5hcHBlbmQoY2hhbmdlRGF0YSk7IFxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdCQuZWFjaChjaGFuZ2VEYXRhLCBmdW5jdGlvbihpKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYocm93LmRhdGEuc2RtVGV4dFRpbWUgPCB0aGlzLnNkbVRleHRUaW1lKXtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZV9yb3cgPSAkKHh0YWJsZSkuZmluZChcInRib2R5XCIpLmZpbmQoXCJ0clwiKVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkKHh0YWJsZV9yb3cpLmNsaWNrKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0eHRhYmxlX3Jvdy5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdyA9ICQoeHRhYmxlX3Jvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFx0XHRcdFx0XHRycmNGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZighcnJjRmxhZyl7XG5cblx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLnN0YXJ0UGFnZSA9ICQoeHRhYmxlKS5maW5kKFwidGJvZHlcIikuZmluZChcInRyXCIpLmxlbmd0aC0xID4gMTAwID8gJCh4dGFibGUpLmZpbmQoXCJ0Ym9keVwiKS5maW5kKFwidHJcIikubGVuZ3RoLTEgLSAxMDEgOiAwO1xuXHRcdFx0XHRcdFx0XHRpZih4dGFibGUuanVpLm9wdGlvbnMuc3RhcnRQYWdlIDwgMSl7XG5cdFx0XHRcdFx0XHRcdFx0eHRhYmxlLmp1aS5vcHRpb25zLnVwRmxhZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMudXBGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Y2hhbmdlRGF0YSA9IGNvcHlYdGFibGVEYXRhLnNsaWNlKHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UsIHh0YWJsZS5qdWkub3B0aW9ucy5zdGFydFBhZ2UreHRhYmxlLmp1aS5vcHRpb25zLmJ1ZmZlckNvdW50KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQvL+y0iOq4sO2ZlFxuXHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMucHJldlBhZ2VDbnQgPSAxO1xuXHRcdFx0XHRcdFx0XHR4dGFibGUuanVpLm9wdGlvbnMubmV4dFBhZ2VDbnQgPSAxO1xuXG5cdFx0XHRcdFx0XHRcdHh0YWJsZUF0dHIucmVzZXQoKTsgXG5cdFx0XHRcdFx0XHRcdHh0YWJsZS5qdWkub3B0aW9ucy50ZW1wQm9keS5hcHBlbmQoY2hhbmdlRGF0YSk7IFxuXG5cdFx0XHRcdFx0XHRcdCQuZWFjaChjaGFuZ2VEYXRhLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKHJvdy5kYXRhLnNkbVRleHRUaW1lIDwgdGhpcy5zZG1UZXh0VGltZSl7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZV9yb3cgPSAkKHh0YWJsZSkuZmluZChcInRib2R5XCIpLmZpbmQoXCJ0clwiKVtjaGFuZ2VEYXRhLmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdFx0XHRcdCQoeHRhYmxlX3JvdykuY2xpY2soKTtcblx0XHRcdFx0XHRcdFx0XHRcdHh0YWJsZV9yb3cuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlR3JpZFJvdyA9ICQoeHRhYmxlX3Jvdyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdG1hcmtlckNsaWNrRmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRtZXNzYWdlQ2xpY2tGbGFnID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0cGFyc2VEYXRhKHJvdy5kYXRhLmZpbGVObywgcm93LmRhdGEuc2RtVGV4dFRpbWUsIHJvdy5kYXRhLmhlYWRlcik7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNvbHNob3c6IGZ1bmN0aW9uKGNvbHVtbiwgZSkge1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Y29saGlkZTogZnVuY3Rpb24oY29sdW1uLCBlKSB7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb2xyZXNpemU6IGZ1bmN0aW9uKGNvbHVtbiwgZSkge1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGJsY2xpY2s6IGZ1bmN0aW9uKHJvdywgZSkge1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c29ydDogZnVuY3Rpb24oY29sdW1uLCBlKSB7XG5cdFx0XHRcdFx0XHR2YXIgY2xhc3NOYW1lID0ge1xuXHRcdFx0XHRcdFx0XHRcImRlc2NcIjogXCJpY29uLWFycm93MVwiLFxuXHRcdFx0XHRcdFx0XHRcImFzY1wiOiBcImljb24tYXJyb3czXCJcblx0XHRcdFx0XHRcdH1bY29sdW1uLm9yZGVyXTtcblxuXHRcdFx0XHRcdFx0JChjb2x1bW4uZWxlbWVudCkucGFyZW50KCkuY2hpbGRyZW4oKS5jaGlsZHJlbihcImlcIikucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdFx0JCh4dGFibGVBdHRyLmxpc3RDb2x1bW4oKSkuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMuZWxlbWVudCkuY2hpbGRyZW4oXCJpXCIpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdFx0JChjb2x1bW4uZWxlbWVudCkuYXBwZW5kKFwiPGkgY2xhc3M9J1wiICsgY2xhc3NOYW1lICsgXCInPjwvaT5cIik7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKGNvbHVtbixlKXtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiY2hhbmdlIDogXCIgKyBjb2x1bW4gKTtcblx0XHRcdFx0XHRcdGxhc3RGaWx0ZXJEYXRhID0gY29sdW1uO1x0XHRcblx0XHRcdFx0XHRcdG1lc3NhZ2VYdGFibGVBdHRyLm9wdGlvbnMucGFnZSA9IDE7XG5cdFx0XHRcdFx0XHRtZXNzYWdlWHRhYmxlQXR0ci5maWx0ZXIoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdHZhciBmbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChPYmplY3Qua2V5cyhjb2x1bW4pLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoY29sdW1uW3RoaXMudG9TdHJpbmcoKV0gIT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhW3RoaXMudG9TdHJpbmcoKV0gPT0gbnVsbCB8fCBkYXRhW3RoaXMudG9TdHJpbmcoKV0udG9TdHJpbmcoKS5pbmRleE9mKGNvbHVtblt0aGlzLnRvU3RyaW5nKCldKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmxhZztcblx0XHRcdFx0XHRcdH0pO1x0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dHBsOiB7XG5cdFx0XHRcdFx0cm93OiAkKFwiI1wiK3NlbGYub3B0aW9ucy5pdGVtLnRwbC5yb3cpLmh0bWwoKSxcblx0XHRcdFx0XHRub25lIDogJChcIiNcIitzZWxmLm9wdGlvbnMuaXRlbS50cGwubm9uZSkuaHRtbCgpLFxuXHRcdFx0XHRcdG1lbnUgOiAkKFwiI1wiK3NlbGYub3B0aW9ucy5pdGVtLnRwbC5tZW51KS5odG1sKClcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHRcdFxuXHRcdCQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2UgPiAuYm9keVwiKS5oZWlnaHQoJChcIiNpd19jb250YWluZXJfbWVzc2FnZVwiKS5oZWlnaHQoKSAtIDMwKTtcblxuXHR9LFxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHRoaXMueHRhYmxlX21lc3NhZ2UudXBkYXRlKHZhbHVlLmxpc3RScmNNZXNzYWdlKTtcblx0XHRcblx0XHR0aGlzLnJlc2l6ZSgpO1xuXHRcdHRoaXMueHRhYmxlX21lc3NhZ2UucmVzaXplKCk7XG5cblx0XHRtZXNzYWdlWHRhYmxlQXR0ciA9IHRoaXMueHRhYmxlX21lc3NhZ2U7XG5cdFx0Y29weU1lc3NhZ2VYdGFibGVEYXRhID0gbWVzc2FnZVh0YWJsZUF0dHIubGlzdERhdGEoKTtcblx0XHR0aGlzLnh0YWJsZV9tZXNzYWdlLm9wdGlvbnMuZGF0YSA9IGNvcHlNZXNzYWdlWHRhYmxlRGF0YTtcblxuXHRcdC8vJChcIiNpd19jb250YWluZXJfbWVzc2FnZVwiKS5oZWlnaHQod2luZG93LmlubmVySGVpZ2h0LzEuMzYpO1xuXHRcdC8vJChcIiN4dGFibGVcIikuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2VcIikuaGVpZ2h0KCkpO1xuXG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDsgq3soJxcblx0ICovXG5cdHVubG9hZDogZnVuY3Rpb24gKHZhbHVlKSB7fSxcblxuXHQvKipcblx0ICog7YGs6riwIOuzgOqyvVxuXHQgKi9cblx0cmVzaXplOiBmdW5jdGlvbiAoKSB7XG5cdFx0Z3JpZFJlc2l6ZUZsYWcgPSB0cnVlO1xuXHRcdGJlZm9yZUdyaWRIZWlnaHQgPSAkKFwiI3h0YWJsZV9tZXNzYWdlID4gLmJvZHlcIikuaGVpZ2h0KCk7XG5cblx0XHQkKHRoaXMueHRhYmxlX21lc3NhZ2Uucm9vdCkud2lkdGgoXCIxMDAlXCIpLmhlaWdodChcIjk1JVwiKTtcblx0XHR0aGlzLnh0YWJsZV9tZXNzYWdlLnNjcm9sbFdpZHRoKCQodGhpcy54dGFibGVfbWVzc2FnZS5yb290KS5pbm5lcldpZHRoKCkpO1xuXHRcdHRoaXMueHRhYmxlX21lc3NhZ2Uuc2Nyb2xsSGVpZ2h0KCQodGhpcy54dGFibGVfbWVzc2FnZS5yb290KS5pbm5lckhlaWdodCgpKTtcblx0XHQvLyQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2UgPiAuYm9keVwiKS5oZWlnaHQoJChcIiNpd19jb250YWluZXJfbWVzc2FnZVwiKS5oZWlnaHQoKS00MCk7XG5cblx0XHQkKFwiI2l3X2NvbnRhaW5lcl9tZXNzYWdlXCIpLmhlaWdodCgkKFwiI2l3X2NvbnRhaW5lcl9tZXNzYWdlXCIpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmhlaWdodCgpIC0gNDIpO1xuXHRcdHRoaXMueHRhYmxlX21lc3NhZ2UuaGVpZ2h0KCQoXCIjaXdfY29udGFpbmVyX21lc3NhZ2VcIikuaGVpZ2h0KCkpO1xuXHRcdCQoXCIjeHRhYmxlX21lc3NhZ2UgPiAuYm9keVwiKS5oZWlnaHQoJChcIiNpd19jb250YWluZXJfbWVzc2FnZVwiKS5oZWlnaHQoKS0zNCk7XG5cdFx0XG5cdFx0dGhpcy54dGFibGVfbWVzc2FnZS5yZXNpemUoKTtcblx0XHRcblx0XHRcblx0XHRhZnRlckdyaWRIZWlnaHQgPSAkKFwiI3h0YWJsZV9tZXNzYWdlID4gLmJvZHlcIikuaGVpZ2h0KCk7XG5cdH1cblxufSk7XG4iLCIvLyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuLy9pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4vL2RlZmluZShbJ2pxdWVyeScsICdkMycsICdjMyddLCBmYWN0b3J5KTtcbi8vfVxuLy9lbHNlIHtcbi8vZmFjdG9yeShqUXVlcnkpO1xuLy99XG4vL30pKGZ1bmN0aW9uICgkKSB7XG52YXIgc2NvcGUgPSB3aW5kb3c7XG52YXIgVEFCTEVfQ0hBUlRfSURYID0gMDtcblxuJC53aWRnZXQoJ2l1aS5jaGFydG1lc3NhZ2V0YWJsZScsIHtcblx0X2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdCQoXCIjbWVzc2FnZV90ZXh0X2RhdGFcIikuaGVpZ2h0KCQoXCIjbWVzc2FnZV90ZXh0X2RhdGFcIikucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaGVpZ2h0KCkgLSAkKFwiI21lc3NhZ2VfaGV4X2RhdGFcIikuaGVpZ2h0KCkgLSA2MClcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLmxvYWQoKTtcblxuXHRcdHNlbGYuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHNlbGYpO1xuXHRcblx0XHRpZiAoc2VsZi5vcHRpb25zLmludGVydmFsKSB7XG5cdFx0XHRpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNsaWNrRmxhZyA9IHRydWU7XG5cdFx0XHRcdGludGVydmFsRmxhZyA9IHRydWU7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0fSwgc2VsZi5vcHRpb25zLmludGVydmFsKTtcblx0XHR9XG5cdH0sXG5cdF9wYXJzZUNvbHVtbnM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29sdW1ucyA9IHt9O1xuXHRcdCQuZWFjaCh0aGlzLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24gKGkpIHtcblx0XHRcdHZhciBrZXkgPSB0aGlzWzBdO1xuXHRcdFx0Y29sdW1uc1trZXldID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMSwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGNvbHVtbnNba2V5XS5wdXNoKHRoaXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiBjb2x1bW5zO1xuXHRcdH1maW5hbGx5e1xuXHRcdFx0Y29sdW1ucyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0Ly8gaWYgKGtleSA9PT0gXCJwYXJhbXNcIikge1xuXHRcdC8vIH1cblx0XHR0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcblxuXHRcdHRoaXMucmVmcmVzaCgpO1xuXHR9LFxuXG5cdC8vIF9zZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHQvLyAgdGhpcy5fc3VwZXIob3B0aW9ucyk7XG5cdC8vICB0aGlzLnJlZnJlc2goKTtcblx0Ly8gfSxcblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdFxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHR9LFxuXG5cdF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFxuXHRcdHNlbGYuZWxlbWVudC5lbXB0eSgpLmxvYWRUZW1wbGF0ZShzZWxmLm9wdGlvbnMudGVtcGxhdGUsICcnLCB7fSk7XG5cblx0XHQvKlxuXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogc2VsZi5vcHRpb25zLmRhdGEsXG5cdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHR0eXBlOiBcInBvc3RcIixcblx0XHRcdGRhdGE6IHBhcmFtcyxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChhamF4RGF0YSkge1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoYWpheERhdGEgIT0gbnVsbCAmJiBzZWxmLm9wdGlvbnMudGVtcGxhdGUuaW5kZXhPZigncGFyYW1ldGVyX21lc3NhZ2VfdGV4dCcpID4gMCl7XG5cdFx0XHRcdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwgYWpheERhdGEuc2VsZWN0T25lLCB7XG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuZmlsZU5vKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5zZG1NaWxsaVRpbWUpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0JC5lYWNoKCQoXCIuZGV2aWNlXCIpLCBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJChcIi5kZXZpY2UtYXV0b2NhbGxzdGF0ZVwiKVtpbmRleF0uaW5uZXJUZXh0ID09IFwiMVwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdCQoJChcIi5kZXZpY2UtYXV0b2NhbGxzdGF0ZTJcIilbaW5kZXhdKS5hZGRDbGFzcyhcImJ1dHRvbi1zdGF0ZVwiKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZigkKFwiLmRldmljZS13MTZtb2R1bGVJZFN0YXR1czJcIilbaW5kZXhdLmlubmVyVGV4dCA9PSBcIjFcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKCQoXCIuZGV2aWNlLXcxNm1vZHVsZUlkU3RhdHVzMlwiKVtpbmRleF0pLmFkZENsYXNzKFwiYnV0dG9uLXN0YXRlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdFx0XHRcdHZhciB0ZW1wID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIHRlbXAyID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGJ0blN0YXRlID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIHNsYklkID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0XHQvLyBzbGLri7kg65SU67CU7J207IqkIO2VnOqwnOunjCDqt7jroKTso7zquLAg7JyE7ZW0XG5cdFx0XHRcdFx0XHRcdHZhciBiZWZvcmVTbGJJZCA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdFx0JC5lYWNoKCQoXCIuZGV2aWNlXCIpLCBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdFx0XHRcdFx0dGVtcCA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdFx0dGVtcDIgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdHNsYklkID0gJChcIi5kZXZpY2VcIikuZmluZChcIiNkZXZpY2Utc2xiaWRcIilbaW5kZXhdLmlubmVyVGV4dDtcblxuXHRcdFx0XHRcdFx0XHRcdCQuZWFjaChhamF4RGF0YS52Y3BsaXN0LCBmdW5jdGlvbihqKXtcblx0XHRcdFx0XHRcdFx0XHRcdGJ0blN0YXRlID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGJlZm9yZVNsYklkICE9IHRoaXMuc2xiaWQgJiYgc2xiSWQgPT0gdGhpcy5zbGJpZCAmJiBqID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVTbGJJZCA9IHRoaXMuc2xiaWQ7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5hdHRjb25uZWN0aW9uc3RhdGUgPT0gXCIxXCIpIGJ0blN0YXRlID0gXCJidXR0b24tc3RhdGVcIjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGVtcCArPSBcIjxkaXYgY2xhc3M9J3ZjcFRjcCBidXR0b24tZGl2IFwiK2J0blN0YXRlK1wiJz48aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdwb3J0TnVtYmVyJyB2YWx1ZT0nXCIrdGhpcy5wb3J0TnVtYmVyK1wiJz5cIit0aGlzLmRldmljZVBsYXRmb3JtK1wiPC9kaXY+XCJcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRidG5TdGF0ZSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuZG1jb25uZWN0aW9uc3RhdGUgPT0gXCIxXCIpIGJ0blN0YXRlID0gXCJidXR0b24tc3RhdGVcIjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGVtcDIgKz0gXCI8ZGl2IGNsYXNzPScgYnV0dG9uLWRpdiBcIitidG5TdGF0ZStcIic+RE08L2Rpdj5cIlxuXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdFx0XHRcdCQoJChcIi5kbWNvbm5lY3Rpb25zdGF0ZURpdlwiKVtpbmRleF0pLmh0bWwodGVtcDIpO1xuXHRcdFx0XHRcdFx0XHRcdCQoJChcIi5hdHRjb25uZWN0aW9uc3RhdGVEaXZcIilbaW5kZXhdKS5odG1sKHRlbXApO1xuXHRcdFx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFx0XHRcdCQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHQkKFwiLnZjcFRjcFwiKS5iaW5kKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBzbGJpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChcIiNkZXZpY2Utc2xiaWRcIikudGV4dCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHBvcnROdW1iZXIgPSAkKHRoaXMpLmZpbmQoXCJbbmFtZT0ncG9ydE51bWJlciddXCIpLnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpdWkuZGFzaGJvYXJkLnNldFdpZGdldFBhcmFtcyhcInNsYmlkPVwiK3NsYmlkK1wiJnBvcnROdW1iZXI9XCIrcG9ydE51bWJlcik7XG5cblx0XHRcdFx0XHRcdFx0XHRcdCQoXCIuZGV2aWNlLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdCQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdCQuZWFjaCgkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIjZGV2aWNlLXNsYmlkXCIpLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RTbGJpZCA9IHRoaXMuaW5uZXJIVE1MO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGlmKGNsaWNrRmxhZyl7XG5cdFx0XHRcdFx0XHRcdFx0Y2xpY2tGbGFnID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZXZpY2UtbGlzdFwiKS5jbGljaygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRhamF4RGF0YSA9IFt7XCJkZXZpY2VHZW5lcmF0aW9uXCI6XCJcIiwgXCJkZXZpY2VNb2RlbFllYXJcIjpcIlwiLCBcImRldmljZVBsYXRmb3JtXCI6XCJcIiwgIFwidGVzdFJlZ2lvblwiOlwiXCIsIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiZGV2aWNlU3dWZXJzaW9uXCI6XCJcIiwgXCJuYWRtY2NcIjogXCJcIiwgXCJuYWRtbmNcIiA6IFwiXCIsIFwibmFkbmV0d29ya3R5cGVcIiA6IFwiXCIsIFwibmFkZWFyZmNuXCIgOiBcIlwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwidGVzdFNtc1Rlc3REb21haW5cIiA6IFwiXCIsIFwidGVzdFJhdFwiIDogXCJcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcImdwc3RpbWVcIjpcIlwiLCBcImdwc2xhdGl0dWRlXCI6XCJcIiwgXCJncHNsb25naXR1ZGVcIjpcIlwifV07XG5cdFx0XHRcdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwgYWpheERhdGEsIHtcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHNlbGYgPSBudWxsO1xuXHRcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKHJlcXVlc3QsIHN0YXR1cywgZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRwYXJhbXMgPSBudWxsO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0XHQqL1xuXG5cdH0sXG5cblxuXHQvKipcblx0ICog642w7J207YSwIOyCreygnFxuXHQgKi9cblx0dW5sb2FkOiBmdW5jdGlvbiAodmFsdWUpIHt9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHQkKFwiI21lc3NhZ2VfdGV4dF9kYXRhXCIpLmhlaWdodCgkKFwiI21lc3NhZ2VfdGV4dF9kYXRhXCIpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmhlaWdodCgpIC0gJChcIiNtZXNzYWdlX2hleF9kYXRhXCIpLmhlaWdodCgpIC0gODkpXG5cblx0XHQvLyB2YXIgdyA9IE1hdGgubWF4KHBhcnNlSW50KHRoaXMuZWxlbWVudC5wYXJlbnQoKS5pbm5lcldpZHRoKCksIDEwKSwgdGhpcy5vcHRpb25zLm1pbldpZHRoKTtcblx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0aWYodGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuaXRlbS1oZWFkZXJcIikubGVuZ3RoID4gMCl7XG5cdFx0XHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCkgLSA4MDtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmhlaWdodChoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxufSk7XG4vL30pO1xuIiwidmFyIFBJRV9DSEFSVF9JRFggPSAwO1xuJC53aWRnZXQoJ2l1aS5jaGFydHBpZScsIHtcblx0b3B0aW9uczoge1xuXHRcdG1pbldpZHRoOiAyMDAsXG5cdFx0bWluSGVpZ2h0OiAyMDBcblx0fSxcblx0X3NldE9wdGlvbjogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHR0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcblx0XHRpZih0aGlzLm9wdGlvbnMucGFyYW1zID09IFwicmVmcmVzaFwiIHx8IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5maW5kKFwiLlwiK3RoaXMub3B0aW9ucy5wYXJhbXMpLmxlbmd0aCA+IDApe1xuXHRcdFx0dGhpcy5yZWZyZXNoKCk7XG5cdFx0fVxuXHR9LFxuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHNlbGYubG9hZCgpO1xuXG5cdH0sXG5cdF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0fSxcblxuXHRyZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXMgfHwge307XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHRoaXMpO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBkYXRhID0gc2VsZi5vcHRpb25zLmRhdGEgfHwge307XG5cdFx0XG5cdFx0dmFyIHBhcmVudCA9IHRoaXMuZWxlbWVudDtcblx0XHQvLyQocGFyZW50KS5oZWlnaHQoMTgwKTtcblx0XHRcblx0XHR2YXIgY2hhcnRfcGllID0gZWNoYXJ0cy5pbml0KHBhcmVudFswXSk7XG5cdFx0dmFyIHBpZV9vcHRpb24gPSBudWxsO1xuXHRcdFxuXHRcdGlmKGRhdGEuaW5kZXhPZihcIi9rYm4vZGFzaGJvYXJkL2dldFNhZ3VjaGVcIikgPiAtMSkge1xuXHRcdFx0cGllX29wdGlvbiA9IHtcblx0XHRcdFx0dGl0bGUgOiB7XG5cdFx0XHRcdFx0dGV4dCA6ICcnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRvb2x0aXAgOiB7XG5cdFx0XHRcdFx0dHJpZ2dlciA6ICdpdGVtJyxcblx0XHRcdFx0XHRmb3JtYXR0ZXIgOiAne2J9IDoge2N9ICh7ZH0lKSdcblx0XHRcdFx0fSxcblx0XHRcdFx0bGVnZW5kIDoge1xuXHRcdFx0XHRcdGxlZnQgOiAnY2VudGVyJyxcblx0XHRcdFx0XHRkYXRhIDogWyAn7JyE7JWUJywgJ+yCrOq1rOyytCcsICfsoJXsg4HsnbgnIF1cblx0XHRcdFx0fSxcblx0XHRcdFx0c2VyaWVzIDogWyB7XG5cdFx0XHRcdFx0bmFtZSA6ICcnLFxuXHRcdFx0XHRcdHR5cGUgOiAncGllJyxcblx0XHRcdFx0XHRyYWRpdXMgOiAnNTUlJyxcblx0XHRcdFx0XHRjZW50ZXIgOiBbICc1MCUnLCAnNjAlJyBdLFxuXHRcdFx0XHRcdGRhdGEgOiBbIHtcblx0XHRcdFx0XHRcdHZhbHVlIDogMzM1LFxuXHRcdFx0XHRcdFx0bmFtZSA6ICfsgqzqtazssrQnLFxuXHRcdFx0XHRcdFx0aXRlbVN0eWxlIDoge1xuXHRcdFx0XHRcdFx0XHRjb2xvciA6ICcjRkVENzcyJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdHZhbHVlIDogMzEwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICfsnITslZQnLFxuXHRcdFx0XHRcdFx0aXRlbVN0eWxlIDoge1xuXHRcdFx0XHRcdFx0XHRjb2xvciA6ICcjNjdFMEUzJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdHZhbHVlIDogMjM0LFxuXHRcdFx0XHRcdFx0bmFtZSA6ICfsoJXsg4HsnbgnLFxuXHRcdFx0XHRcdFx0aXRlbVN0eWxlIDoge1xuXHRcdFx0XHRcdFx0XHRjb2xvciA6ICcjRTA2MkFFJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gXSxcblx0XHRcdFx0XHRlbXBoYXNpcyA6IHtcblx0XHRcdFx0XHRcdGl0ZW1TdHlsZSA6IHtcblx0XHRcdFx0XHRcdFx0c2hhZG93Qmx1ciA6IDEwLFxuXHRcdFx0XHRcdFx0XHRzaGFkb3dPZmZzZXRYIDogMCxcblx0XHRcdFx0XHRcdFx0c2hhZG93Q29sb3IgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBdXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZihkYXRhLmluZGV4T2YoXCIva2JuL2Rhc2hib2FyZC9nZXRNd1wiKSA+IC0xKXtcblx0XHRcdHBpZV9vcHRpb24gPSB7XG5cdFx0XHRcdHRpdGxlIDoge1xuXHRcdFx0XHRcdHRleHQgOiAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0b29sdGlwIDoge1xuXHRcdFx0XHRcdHRyaWdnZXIgOiAnaXRlbScsXG5cdFx0XHRcdFx0Zm9ybWF0dGVyIDogJ3tifSA6IHtjfSAoe2R9JSknXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxlZ2VuZCA6IHtcblx0XHRcdFx0XHRsZWZ0IDogJ2NlbnRlcicsXG5cdFx0XHRcdFx0ZGF0YSA6IFsgJ+uCqOyEsScsICfsl6zshLEnIF1cblx0XHRcdFx0fSxcblx0XHRcdFx0c2VyaWVzIDogWyB7XG5cdFx0XHRcdFx0bmFtZSA6ICcnLFxuXHRcdFx0XHRcdHR5cGUgOiAncGllJyxcblx0XHRcdFx0XHRyYWRpdXMgOiAnNTUlJyxcblx0XHRcdFx0XHRjZW50ZXIgOiBbICc1MCUnLCAnNjAlJyBdLFxuXHRcdFx0XHRcdGxhYmVsIDoge1xuXHRcdFx0XHRcdFx0bm9ybWFsIDoge1xuXHRcdFx0XHRcdFx0XHRzaG93IDogZmFsc2Vcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhIDogWyB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDEwMCxcblx0XHRcdFx0XHRcdG5hbWUgOiAn64Ko7ISxJyxcblx0XHRcdFx0XHRcdGl0ZW1TdHlsZSA6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3IgOiAnI0ZFRDc3Midcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDEwMCxcblx0XHRcdFx0XHRcdG5hbWUgOiAn7Jes7ISxJyxcblx0XHRcdFx0XHRcdGl0ZW1TdHlsZSA6IHtcblx0XHRcdFx0XHRcdFx0Y29sb3IgOiAnIzY3RTBFMydcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IF0sXG5cdFx0XHRcdFx0ZW1waGFzaXMgOiB7XG5cdFx0XHRcdFx0XHRpdGVtU3R5bGUgOiB7XG5cdFx0XHRcdFx0XHRcdHNoYWRvd0JsdXIgOiAxMCxcblx0XHRcdFx0XHRcdFx0c2hhZG93T2Zmc2V0WCA6IDAsXG5cdFx0XHRcdFx0XHRcdHNoYWRvd0NvbG9yIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gXVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdH0gZWxzZSBpZihkYXRhLmluZGV4T2YoXCIva2JuL2Rhc2hib2FyZC9nZXRBZ2VcIikgPiAtMSl7XG5cdFx0XHRwaWVfb3B0aW9uID0ge1xuXHRcdFx0XHR0aXRsZSA6IHtcblx0XHRcdFx0XHR0ZXh0IDogJydcblx0XHRcdFx0fSxcblx0XHRcdFx0dG9vbHRpcCA6IHtcblx0XHRcdFx0XHR0cmlnZ2VyIDogJ2l0ZW0nLFxuXHRcdFx0XHRcdGZvcm1hdHRlciA6ICd7Yn0gOiB7Y30gKHtkfSUpJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRsZWdlbmQgOiB7XG5cdFx0XHRcdFx0bGVmdCA6ICdjZW50ZXInLFxuXHRcdFx0XHRcdGRhdGEgOiBbICcxMOuMgCcsICcyMOuMgCcsICczMOuMgCcsICc0MOuMgCcsICc1MOuMgCcsXG5cdFx0XHRcdFx0XHRcdCc2MOuMgCcsICc3MOuMgCcsICc4MOuMgCcsICc5MOuMgCcgXVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXJpZXMgOiBbIHtcblx0XHRcdFx0XHRuYW1lIDogJycsXG5cdFx0XHRcdFx0dHlwZSA6ICdwaWUnLFxuXHRcdFx0XHRcdHJhZGl1cyA6ICc1NSUnLFxuXHRcdFx0XHRcdGNlbnRlciA6IFsgJzUwJScsICc2MCUnIF0sXG5cdFx0XHRcdFx0bGFiZWwgOiB7XG5cdFx0XHRcdFx0XHRub3JtYWwgOiB7XG5cdFx0XHRcdFx0XHRcdHNob3cgOiBmYWxzZVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRhdGEgOiBbIHtcblx0XHRcdFx0XHRcdHZhbHVlIDogMTAwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICcxMOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDcwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICcyMOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDIwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICczMOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDYwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICc0MOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDIwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICc1MOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDEwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICc2MOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDkwLFxuXHRcdFx0XHRcdFx0bmFtZSA6ICc3MOuMgCdcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDEwMCxcblx0XHRcdFx0XHRcdG5hbWUgOiAnODDrjIAnXG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0dmFsdWUgOiA4MCxcblx0XHRcdFx0XHRcdG5hbWUgOiAnOTDrjIAnXG5cdFx0XHRcdFx0fSBdLFxuXHRcdFx0XHRcdGVtcGhhc2lzIDoge1xuXHRcdFx0XHRcdFx0aXRlbVN0eWxlIDoge1xuXHRcdFx0XHRcdFx0XHRzaGFkb3dCbHVyIDogMTAsXG5cdFx0XHRcdFx0XHRcdHNoYWRvd09mZnNldFggOiAwLFxuXHRcdFx0XHRcdFx0XHRzaGFkb3dDb2xvciA6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IF1cblx0XHRcdH07XG5cdFx0fVxuXHRcdFxuXHRcdGNoYXJ0X3BpZS5zZXRPcHRpb24ocGllX29wdGlvbik7XG5cdFx0XG5cdFx0c2VsZi5jaGFydCA9IGNoYXJ0X3BpZTtcblx0XHRzZWxmLnJlc2l6ZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHRoaXMuY2hhcnQudW5sb2FkKCd2YWx1ZScpXG5cdH0sXG5cblx0LyoqXG5cdCAqIO2BrOq4sCDrs4Dqsr1cblx0ICovXG5cdHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdGlmKHRoaXMuY2hhcnQpIHtcblx0XHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCktNTA7XG5cdFx0XG5cdFx0XHR0aGlzLmVsZW1lbnQuY3NzKHsnaGVpZ2h0JzogaH0pO1xuXHRcdFx0dGhpcy5jaGFydC5yZXNpemUoKTtcblx0XHR9XG5cdH1cbn0pO1xuLy99KTtcbiIsInZhciBUQUJMRV9DSEFSVF9JRFggPSAwO1xuXG4kLndpZGdldCgnaXVpLmNoYXJ0dGFibGUnLCB7XG5cdF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLmxvYWQoKTtcblxuXHRcdHNlbGYuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHNlbGYpO1xuXHRcblx0XHRpZiAoc2VsZi5vcHRpb25zLmludGVydmFsKSB7XG5cdFx0XHRpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNsaWNrRmxhZyA9IHRydWU7XG5cdFx0XHRcdGludGVydmFsRmxhZyA9IHRydWU7XG5cdFx0XHRcdHNlbGYucmVmcmVzaCgpO1xuXHRcdFx0fSwgc2VsZi5vcHRpb25zLmludGVydmFsKTtcblx0XHR9XG5cdH0sXG5cdF9wYXJzZUNvbHVtbnM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29sdW1ucyA9IHt9O1xuXHRcdCQuZWFjaCh0aGlzLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24gKGkpIHtcblx0XHRcdHZhciBrZXkgPSB0aGlzWzBdO1xuXHRcdFx0Y29sdW1uc1trZXldID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMSwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGNvbHVtbnNba2V5XS5wdXNoKHRoaXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiBjb2x1bW5zO1xuXHRcdH1maW5hbGx5e1xuXHRcdFx0Y29sdW1ucyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0Ly8gaWYgKGtleSA9PT0gXCJwYXJhbXNcIikge1xuXHRcdC8vIH1cblx0XHR0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcblxuXHRcdHRoaXMucmVmcmVzaCgpO1xuXHR9LFxuXG5cdHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyB8fCB7fTtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsdXBkYXRlJywgbnVsbCwgdGhpcyk7XG5cdH0sXG5cblx0X2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7LaU6rCAXG5cdCAqL1xuXHRsb2FkOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXMgfHwge307XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHZhciBhamF4RGF0YSA9IFt7XCJjbnRcIjo4fV07XG5cdFx0XG5cdFx0aWYoc2VsZi5vcHRpb25zLmRhdGEpIHtcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogc2VsZi5vcHRpb25zLmRhdGEsXG5cdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0dHlwZTogXCJwb3N0XCIsXG5cdFx0XHRcdGRhdGE6IHBhcmFtcyxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwgZGF0YSwge1xuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChyZXF1ZXN0LCBzdGF0dXMsIGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdHBhcmFtcyA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRcdFxuXHRcdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwgYWpheERhdGEsIHtcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRcblx0XHRcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOyCreygnFxuXHQgKi9cblx0dW5sb2FkOiBmdW5jdGlvbiAodmFsdWUpIHt9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyB2YXIgdyA9IE1hdGgubWF4KHBhcnNlSW50KHRoaXMuZWxlbWVudC5wYXJlbnQoKS5pbm5lcldpZHRoKCksIDEwKSwgdGhpcy5vcHRpb25zLm1pbldpZHRoKTtcblx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0aWYodGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuaXRlbS1oZWFkZXJcIikubGVuZ3RoID4gMCl7XG5cdFx0XHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCkgLSA4MDtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmhlaWdodChoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxufSk7XG4vL30pO1xuIiwiLy8oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbi8vaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuLy9kZWZpbmUoWydqcXVlcnknLCAnZDMnLCAnYzMnXSwgZmFjdG9yeSk7XG4vL31cbi8vZWxzZSB7XG4vL2ZhY3RvcnkoalF1ZXJ5KTtcbi8vfVxuLy99KShmdW5jdGlvbiAoJCkge1xudmFyIHNjb3BlID0gd2luZG93O1xudmFyIFRBQkxFX0NIQVJUX0lEWCA9IDA7XG5cbiQud2lkZ2V0KCdpdWkuY2hhcnR0YWJ0YWJsZScsIHtcblx0X2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYubG9hZCgpO1xuXG5cdFx0c2VsZi5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgc2VsZik7XG5cdC8qXG5cdFx0aWYgKHNlbGYub3B0aW9ucy5pbnRlcnZhbCkge1xuXHRcdFx0aWYgKHNlbGYudGltZXIgIT0gbnVsbCkge1xuXHRcdFx0XHRjbGVhckludGVydmFsKHNlbGYudGltZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjbGlja0ZsYWcgPSB0cnVlO1xuXHRcdFx0XHRpbnRlcnZhbEZsYWcgPSB0cnVlO1xuXHRcdFx0XHRzZWxmLnNldEluZm8oKTtcblx0XHRcdH0sIHNlbGYub3B0aW9ucy5pbnRlcnZhbCk7XG5cdFx0fVxuXHRcdCovXG5cdH0sXG5cdF9wYXJzZUNvbHVtbnM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29sdW1ucyA9IHt9O1xuXHRcdCQuZWFjaCh0aGlzLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24gKGkpIHtcblx0XHRcdHZhciBrZXkgPSB0aGlzWzBdO1xuXHRcdFx0Y29sdW1uc1trZXldID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMSwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGNvbHVtbnNba2V5XS5wdXNoKHRoaXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiBjb2x1bW5zO1xuXHRcdH1maW5hbGx5e1xuXHRcdFx0Y29sdW1ucyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0Ly8gaWYgKGtleSA9PT0gXCJwYXJhbXNcIikge1xuXHRcdC8vIH1cblx0XHR0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcblxuXHRcdHRoaXMucmVmcmVzaCgpO1xuXHR9LFxuXG5cdC8vIF9zZXRPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHQvLyAgdGhpcy5fc3VwZXIob3B0aW9ucyk7XG5cdC8vICB0aGlzLnJlZnJlc2goKTtcblx0Ly8gfSxcblxuXHRzZXRJbmZvOiBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKCdzZXRJbmZvJyk7XG5cblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsIDogXCIvcmVtb3RlQ29udHJvbC9yZWFsdGltZU1vbml0b3JpbmcvZ2V0U2xiTGlzdC5kb1wiLFxuXHRcdFx0dHlwZSA6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YVR5cGUgOiBcImpzb25cIixcblx0XHRcdHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0XHQkKFwiI2Rpdl9mYXZvcml0ZVwiKS5lbXB0eSgpO1xuXHRcdFx0XHRcblx0XHRcdFx0JC5lYWNoKGRhdGEuc2xibGlzdCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdFx0XHQkLmVhY2goJChcIiNkaXZfc2xiIC5jb250ZW50LXN0eWxlXCIpLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0aWYgKHNlbGYuc2xiaWQgPT0gJCh0aGlzKS5maW5kKFwiI2RldmljZS1zbGJpZFwiKS50ZXh0KCkpIHtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYuc2xiaWQgPT0gODUpe1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYudzE2bW9kdWxlSWRTdGF0dXMgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuYXR0Y29ubmVjdGlvbnN0YXRlID0gMTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmRtY29ubmVjdGlvbnN0YXRlID0gMTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmF1dG9jYWxsc3RhdGUgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuZ3BzQ29ubmVjdCA9IDI7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZihzZWxmLncxNm1vZHVsZUlkU3RhdHVzID09IDApe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuZmluZChcIi5kZXZpY2UtdzE2bW9kdWxlSWRTdGF0dXM0XCIpLnJlbW92ZUNsYXNzKFwiYnV0dG9uLXN0YXRlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuZmluZChcIi5kbWNvbm5lY3Rpb25zdGF0ZURpdlwiKS5odG1sKFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuZmluZChcIi5hdHRjb25uZWN0aW9uc3RhdGVEaXZcIikuaHRtbChcIlwiKTtcblxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIuZGV2aWNlLXcxNm1vZHVsZUlkU3RhdHVzNFwiKS5hZGRDbGFzcyhcImJ1dHRvbi1zdGF0ZVwiKTtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBidG5TdGF0ZSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRlbXAxID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdGVtcDIgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5hdHRjb25uZWN0aW9uc3RhdGUgPT0gMSkgYnRuU3RhdGUgPSBcImJ1dHRvbi1zdGF0ZVwiO1xuXHRcdFx0XHRcdFx0XHRcdHRlbXAxICs9IFwiPGRpdiBjbGFzcz0ndmNwVGNwIGJ1dHRvbi1kaXYgXCIrYnRuU3RhdGUrXCInPjxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J3BvcnROdW1iZXInIHZhbHVlPSdcIitzZWxmLnBvcnROdW1iZXIrXCInPlwiK3NlbGYuZGV2aWNlUGxhdGZvcm0rXCI8L2Rpdj5cIlxuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuZmluZChcIi5kbWNvbm5lY3Rpb25zdGF0ZURpdlwiKS5odG1sKHRlbXAxKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYuZG1jb25uZWN0aW9uc3RhdGUgPT0gMSkgYnRuU3RhdGUgPSBcImJ1dHRvbi1zdGF0ZVwiO1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdHRlbXAyICs9IFwiPGRpdiBjbGFzcz0nYnV0dG9uLWRpdiBcIitidG5TdGF0ZStcIic+RE08L2Rpdj5cIlxuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuZmluZChcIi5hdHRjb25uZWN0aW9uc3RhdGVEaXZcIikuaHRtbCh0ZW1wMik7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZihzZWxmLmF1dG9jYWxsc3RhdGUgPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLmRldmljZS1hdXRvY2FsbHN0YXRlNFwiKS5yZW1vdmVDbGFzcyhcImJ1dHRvbi1zdGF0ZVwiKTtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLnByZXYoKS5maW5kKFwiI2VxdWlwc3RhdHVzX2NpcmNsZVwiKS5hdHRyKCdzcmMnLCAnL2Nzcy9pbWFnZXMvYmFzaWNfY2lyY2xlLnBuZycpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIuZGV2aWNlLWF1dG9jYWxsc3RhdGU0XCIpLmFkZENsYXNzKFwiYnV0dG9uLXN0YXRlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykucHJldigpLmZpbmQoXCIjZXF1aXBzdGF0dXNfY2lyY2xlXCIpLmF0dHIoJ3NyYycsICcvY3NzL2ltYWdlcy9yZWRfY2lyY2xlLnBuZycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5ncHNDb25uZWN0ID09IDIpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykucHJldigpLmZpbmQoXCIjcmVhbG1vbml0b3JpbmdfY2lyY2xlXCIpLmF0dHIoJ3NyYycsICcvY3NzL2ltYWdlcy9ibHVlX2NpcmNsZS5wbmcnKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wcmV2KCkuZmluZChcIiNyZWFsbW9uaXRvcmluZ19jaXJjbGVcIikuYXR0cignc3JjJywgJy9jc3MvaW1hZ2VzL2Jhc2ljX2NpcmNsZS5wbmcnKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYuZmF2b3JpdGUgPT0gXCJZXCIpe1xuXHRcdFx0XHRcdFx0XHRcdCQoXCIjZGl2X2Zhdm9yaXRlXCIpLmFwcGVuZCh0aGlzLm91dGVySFRNTCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdCQuZWFjaChkYXRhLm1vYmlsZWxpc3QsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCQoXCIjZGl2X21vYmlsZSAuY29udGVudC1zdHlsZVwiKSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdGlmIChzZWxmLnNsYmlkID09ICQodGhpcykuZmluZChcIiNkZXZpY2Utc2xiaWRcIikudGV4dCgpKSB7XG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5zbGJpZCA9PSAxMTUpe1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYudzE2bW9kdWxlSWRTdGF0dXMgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuYXR0Y29ubmVjdGlvbnN0YXRlID0gMTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmRtY29ubmVjdGlvbnN0YXRlID0gMTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmF1dG9jYWxsc3RhdGUgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuZ3BzQ29ubmVjdCA9IDI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYudzE2bW9kdWxlSWRTdGF0dXMgPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLmRldmljZS13MTZtb2R1bGVJZFN0YXR1czRcIikucmVtb3ZlQ2xhc3MoXCJidXR0b24tc3RhdGVcIik7XG5cblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLmRldmljZS13MTZtb2R1bGVJZFN0YXR1czRcIikuYWRkQ2xhc3MoXCJidXR0b24tc3RhdGVcIik7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZihzZWxmLmF1dG9jYWxsc3RhdGUgPT0gMCl7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLmRldmljZS1hdXRvY2FsbHN0YXRlNFwiKS5yZW1vdmVDbGFzcyhcImJ1dHRvbi1zdGF0ZVwiKTtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLnByZXYoKS5maW5kKFwiI2VxdWlwc3RhdHVzX2NpcmNsZVwiKS5hdHRyKCdzcmMnLCAnL2Nzcy9pbWFnZXMvYmFzaWNfY2lyY2xlLnBuZycpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIuZGV2aWNlLWF1dG9jYWxsc3RhdGU0XCIpLmFkZENsYXNzKFwiYnV0dG9uLXN0YXRlXCIpO1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykucHJldigpLmZpbmQoXCIjZXF1aXBzdGF0dXNfY2lyY2xlXCIpLmF0dHIoJ3NyYycsICcvY3NzL2ltYWdlcy9yZWRfY2lyY2xlLnBuZycpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5ncHNDb25uZWN0ID09IDIpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykucHJldigpLmZpbmQoXCIjcmVhbG1vbml0b3JpbmdfY2lyY2xlXCIpLmF0dHIoJ3NyYycsICcvY3NzL2ltYWdlcy9ibHVlX2NpcmNsZS5wbmcnKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wcmV2KCkuZmluZChcIiNyZWFsbW9uaXRvcmluZ19jaXJjbGVcIikuYXR0cignc3JjJywgJy9jc3MvaW1hZ2VzL2Jhc2ljX2NpcmNsZS5wbmcnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5mYXZvcml0ZSA9PSBcIllcIil7XG5cdFx0XHRcdFx0XHRcdFx0JChcIiNkaXZfZmF2b3JpdGVcIikuYXBwZW5kKHRoaXMub3V0ZXJIVE1MKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsb2FkaW5nRW5kKCk7XG5cblx0XHRcdH0sXG5cdFx0XHRlcnJvciA6IGZ1bmN0aW9uKGVycm9yLCByZXF1ZXN0LCBzdGF0dXMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdGxvYWRpbmdFbmQoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9LFxuXHRcblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcblx0fSxcblxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyB8fCB7fTtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblxuXHRcdHNlbGYuZWxlbWVudC5lbXB0eSgpLmxvYWRUZW1wbGF0ZShzZWxmLm9wdGlvbnMudGVtcGxhdGUsIHt9ICwge1xuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JChcIiNhdGFiMVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiMVwiKS5hdHRyKFwiY2xhc3NcIixcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdCQoXCIjYXRhYjJcIikucmVtb3ZlQXR0cihcImNsYXNzXCIpO1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiM1wiKS5yZW1vdmVBdHRyKFwiY2xhc3NcIik7XG5cdFx0XHRcdFx0XHQkKFwiI2F0YWI0XCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X2Zhdm9yaXRlXCIpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X3NsYlwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKFwiI2Rpdl9tb2JpbGVcIikuaGlkZSgpO1xuXHRcdFx0XHRcdFx0JChcIiNkaXZfZXRjXCIpLmhpZGUoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkKFwiI2F0YWIyXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkKFwiI2F0YWIxXCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcblx0XHRcdFx0XHRcdCQoXCIjYXRhYjJcIikuYXR0cihcImNsYXNzXCIsXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0XHQkKFwiI2F0YWIzXCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcblx0XHRcdFx0XHRcdCQoXCIjYXRhYjRcIikucmVtb3ZlQXR0cihcImNsYXNzXCIpO1xuXHRcdFx0XHRcdFx0JChcIiNkaXZfZmF2b3JpdGVcIikuaGlkZSgpO1xuXHRcdFx0XHRcdFx0JChcIiNkaXZfc2xiXCIpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X21vYmlsZVwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKFwiI2Rpdl9ldGNcIikuaGlkZSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCQoXCIjYXRhYjNcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCQoXCIjYXRhYjFcIikucmVtb3ZlQXR0cihcImNsYXNzXCIpO1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiMlwiKS5yZW1vdmVBdHRyKFwiY2xhc3NcIik7XG5cdFx0XHRcdFx0XHQkKFwiI2F0YWIzXCIpLmF0dHIoXCJjbGFzc1wiLFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiNFwiKS5yZW1vdmVBdHRyKFwiY2xhc3NcIik7XG5cdFx0XHRcdFx0XHQkKFwiI2Rpdl9mYXZvcml0ZVwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKFwiI2Rpdl9zbGJcIikuaGlkZSgpO1xuXHRcdFx0XHRcdFx0JChcIiNkaXZfbW9iaWxlXCIpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X2V0Y1wiKS5oaWRlKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JChcIiNhdGFiNFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiMVwiKS5yZW1vdmVBdHRyKFwiY2xhc3NcIik7XG5cdFx0XHRcdFx0XHQkKFwiI2F0YWIyXCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcblx0XHRcdFx0XHRcdCQoXCIjYXRhYjNcIikucmVtb3ZlQXR0cihcImNsYXNzXCIpO1xuXHRcdFx0XHRcdFx0JChcIiNhdGFiNFwiKS5hdHRyKFwiY2xhc3NcIixcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X2Zhdm9yaXRlXCIpLmhpZGUoKTtcblx0XHRcdFx0XHRcdCQoXCIjZGl2X3NsYlwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKFwiI2Rpdl9tb2JpbGVcIikuaGlkZSgpO1xuXHRcdFx0XHRcdFx0JChcIiNkaXZfZXRjXCIpLnNob3coKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0XHR1cmwgOiBcIi9yZW1vdGVDb250cm9sL3JlYWx0aW1lTW9uaXRvcmluZy9nZXRTbGJMaXN0LmRvXCIsXG5cdFx0XHRcdFx0XHR0eXBlIDogXCJwb3N0XCIsXG5cdFx0XHRcdFx0XHRkYXRhVHlwZSA6IFwianNvblwiLFxuXHRcdFx0XHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHR2YXIgdGVtcCA9ICcnO1xuXHRcdFx0XHRcdFx0XHR2YXIgbGFiZWwgPSAnJztcblx0XHRcdFx0XHRcdFx0dmFyIGZhdm9yaXRlaW1nID0gJyc7XG5cdFx0XHRcdFx0XHRcdHZhciBlcXVpcGltZyA9ICcnO1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3BzaW1nID0gJyc7XG5cdFx0XHRcdFx0XHRcdHZhciBhdXRvY2FsbENsYXNzID0gJyc7XG5cdFx0XHRcdFx0XHRcdHZhciB3MTZDbGFzcyA9ICcnO1xuXHRcdFx0XHRcdFx0XHR2YXIgbW9zbGIgPSAnJztcblxuXHRcdFx0XHRcdFx0XHR2YXIgdGVtcDEgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHR2YXJcdHRlbXAyID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGJ0blN0YXRlID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0JC5lYWNoKGRhdGEuc2xibGlzdCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRsYWJlbCA9ICdsYWJlbCc7XG5cdFx0XHRcdFx0XHRcdFx0bW9zbGIgPSAnU0xCJztcblx0XHRcdFx0XHRcdFx0XHRmYXZvcml0ZWltZyA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdGVxdWlwaW1nID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0Z3BzaW1nID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0YXV0b2NhbGxDbGFzcyA9ICcnO1xuXHRcdFx0XHRcdFx0XHRcdHcxNkNsYXNzID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0dGVtcDEgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdHRlbXAyID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0XHRidG5TdGF0ZSA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmZhdm9yaXRlID09ICdZJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRmYXZvcml0ZWltZyA9ICcvY3NzL2ltYWdlcy9pY29uX2Zhdm9yaXRlX2Z1bGwucG5nJztcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdGZhdm9yaXRlaW1nID0gJy9jc3MvaW1hZ2VzL2ljb25fZmF2b3JpdGUucG5nJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLncxNm1vZHVsZUlkU3RhdHVzID09IDEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1aXBpbWcgPSAnL2Nzcy9pbWFnZXMvZ3JlZW5fY2lyY2xlLnBuZyc7XG5cdFx0XHRcdFx0XHRcdFx0XHR3MTZDbGFzcyA9ICdidXR0b24tc3RhdGUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmF0dGNvbm5lY3Rpb25zdGF0ZSA9PSBcIjFcIikgYnRuU3RhdGUgPSBcImJ1dHRvbi1zdGF0ZVwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGVtcDEgKz0gXCI8ZGl2IGNsYXNzPSd2Y3BUY3AgYnV0dG9uLWRpdiBcIitidG5TdGF0ZStcIic+PGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0ncG9ydE51bWJlcicgdmFsdWU9J1wiK3RoaXMucG9ydE51bWJlcitcIic+XCIrdGhpcy5kZXZpY2VQbGF0Zm9ybStcIjwvZGl2PlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJ0blN0YXRlID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5kbWNvbm5lY3Rpb25zdGF0ZSA9PSBcIjFcIikgYnRuU3RhdGUgPSBcImJ1dHRvbi1zdGF0ZVwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGVtcDIgKz0gXCI8ZGl2IGNsYXNzPSdidXR0b24tZGl2IFwiK2J0blN0YXRlK1wiJz5ETTwvZGl2PlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5hdXRvY2FsbHN0YXRlID09IDEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1aXBpbWcgPSAnL2Nzcy9pbWFnZXMvcmVkX2NpcmNsZS5wbmcnO1xuXHRcdFx0XHRcdFx0XHRcdFx0YXV0b2NhbGxDbGFzcyA9ICdidXR0b24tc3RhdGUnO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1aXBpbWcgPSAnL2Nzcy9pbWFnZXMvYmFzaWNfY2lyY2xlLnBuZyc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5ncHNDb25uZWN0ID09IFwiMlwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdGdwc2ltZyA9ICcvY3NzL2ltYWdlcy9ibHVlX2NpcmNsZS5wbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0Z3BzaW1nID0gJy9jc3MvaW1hZ2VzL2Jhc2ljX2NpcmNsZS5wbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHRlbXAgPSAnPGxpIGNsYXNzPVwiYWNjb3JkaW9uZGV2aWNlXCI+PGRpdiBjbGFzcz1cIm9uZWxpbmVkaXYxXCI+PGg0PicrdGhpcy5tYWMrJzwvaDQ+PC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIm9uZWxpbmVkaXYyXCI+PGltZyBpZD1cImVxdWlwc3RhdHVzX2NpcmNsZVwiIHNyYz1cIicrZXF1aXBpbWcrJ1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0JzxpbWcgaWQ9XCJyZWFsbW9uaXRvcmluZ19jaXJjbGVcIiBzcmM9XCInK2dwc2ltZysnXCI+Jytcblx0XHRcdFx0XHRcdFx0XHQnPGltZyBpZD1cImZhdm9yaXRlX2J0blwiIHNyYz1cIicrZmF2b3JpdGVpbWcrJ1wiIG5hbWU9XCInK3RoaXMuc2xiaWQrJ1wiIG9uY2xpY2s9XCJmYXZvcml0ZUNsaWNrKHRoaXMpO1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0JzwvZGl2PjwvbGk+Jytcblx0XHRcdFx0XHRcdFx0XHRcdCc8bGkgY2xhc3M9XCJjb250ZW50LXN0eWxlXCI+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAnPGRpdiBpZD1cImRldmljZS1saXN0XCIgY2xhc3M9XCJuZXdkZXZpY2UtbGlzdFwiIG9uY2xpY2s9XCJnZXRTbGJJbmZvKHRoaXMpO1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJkZXZpY2UtbGFiZWxcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8aDQgY2xhc3M9XCInK2xhYmVsKydcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8L2g0PjwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJkZXZpY2UtbGFiZWxcIj48aDQ+Jyt0aGlzLm1hYysnPC9oND48L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8ZGl2IGlkPVwiZGV2aWNlLXNsYmlkXCIgY2xhc3M9XCInK3RoaXMuZXF1aXBUeXBlKydcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+Jyt0aGlzLnNsYmlkKyc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8ZGl2IGNsYXNzPVwibmV3ZGV2aWNlLXN0YXR1c1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICc8ZGl2IGNsYXNzPVwiZGV2aWNlLXcxNm1vZHVsZUlkU3RhdHVzM1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nK3RoaXMudzE2bW9kdWxlSWRTdGF0dXMrJzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICc8ZGl2IGNsYXNzPVwiZGV2aWNlLXcxNm1vZHVsZUlkU3RhdHVzNCAnK3cxNkNsYXNzKycgYnV0dG9uLWRpdiBidXR0b24tZGl2LXdpZHRoNzAgYnV0dG9uLWRpdi1sZWZ0NVwiPicrIG1vc2xiICsnPC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJkbWNvbm5lY3Rpb25zdGF0ZURpdiBidXR0b24tZGl2LXdpZHRoNDBcIiBzdHlsZT1cImZsb2F0OiBsZWZ0OyBtYXJnaW46IDAgM3B4IDAgM3B4O1wiPiAnICsgdGVtcDEgKyAnIDwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICc8ZGl2IGNsYXNzPVwiYXR0Y29ubmVjdGlvbnN0YXRlRGl2IGJ1dHRvbi1kaXYtd2lkdGg0MFwiIHN0eWxlPVwiZmxvYXQ6IGxlZnQ7XCI+ICcgKyB0ZW1wMiArICcgPC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJkZXZpY2UtYXV0b2NhbGxzdGF0ZTNcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+Jyt0aGlzLmF1dG9jYWxsc3RhdGUrJzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICc8ZGl2IGNsYXNzPVwiZGV2aWNlLWF1dG9jYWxsc3RhdGU0ICcrYXV0b2NhbGxDbGFzcysnIGJ1dHRvbi1kaXYgYnV0dG9uLWRpdi13aWR0aDcwIGJ1dHRvbi1kaXYtbGVmdDVcIiBzdHlsZT1cImNsZWFyOiBib3RoO1wiPlRFU1Q8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgJzwvbGk+J1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5mYXZvcml0ZSA9PSBcIllcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKFwiI2Rpdl9mYXZvcml0ZVwiKS5hcHBlbmQodGVtcCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0JChcIiNkaXZfc2xiXCIpLmFwcGVuZCh0ZW1wKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5tb2JpbGVsaXN0LCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGxhYmVsID0gJ21vYmlsZWxhYmVsJztcblx0XHRcdFx0XHRcdFx0XHRtb3NsYiA9ICdNb2JpbGUnO1xuXHRcdFx0XHRcdFx0XHRcdGZhdm9yaXRlaW1nID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0ZXF1aXBpbWcgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRncHNpbWcgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRhdXRvY2FsbENsYXNzID0gJyc7XG5cdFx0XHRcdFx0XHRcdFx0dzE2Q2xhc3MgPSAnJztcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHR0ZW1wMSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdFx0dGVtcDIgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdGJ0blN0YXRlID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuZmF2b3JpdGUgPT0gJ1knKXtcblx0XHRcdFx0XHRcdFx0XHRcdGZhdm9yaXRlaW1nID0gJy9jc3MvaW1hZ2VzL2ljb25fZmF2b3JpdGVfZnVsbC5wbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmF2b3JpdGVpbWcgPSAnL2Nzcy9pbWFnZXMvaWNvbl9mYXZvcml0ZS5wbmcnO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMudzE2bW9kdWxlSWRTdGF0dXMgPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcGltZyA9ICcvY3NzL2ltYWdlcy9ncmVlbl9jaXJjbGUucG5nJztcblx0XHRcdFx0XHRcdFx0XHRcdHcxNkNsYXNzID0gJ2J1dHRvbi1zdGF0ZSc7XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmF1dG9jYWxsc3RhdGUgPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcGltZyA9ICcvY3NzL2ltYWdlcy9yZWRfY2lyY2xlLnBuZyc7XG5cdFx0XHRcdFx0XHRcdFx0XHRhdXRvY2FsbENsYXNzID0gJ2J1dHRvbi1zdGF0ZSc7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcGltZyA9ICcvY3NzL2ltYWdlcy9iYXNpY19jaXJjbGUucG5nJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmdwc0Nvbm5lY3QgPT0gXCIyXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0Z3BzaW1nID0gJy9jc3MvaW1hZ2VzL2JsdWVfY2lyY2xlLnBuZyc7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRncHNpbWcgPSAnL2Nzcy9pbWFnZXMvYmFzaWNfY2lyY2xlLnBuZyc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0dGVtcCA9ICc8bGkgY2xhc3M9XCJhY2NvcmRpb25kZXZpY2VcIj48ZGl2IGNsYXNzPVwib25lbGluZWRpdjFcIj48aDQ+Jyt0aGlzLm1hYysnPC9oND48L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwib25lbGluZWRpdjJcIj48aW1nIGlkPVwiZXF1aXBzdGF0dXNfY2lyY2xlXCIgc3JjPVwiJytlcXVpcGltZysnXCI+Jytcblx0XHRcdFx0XHRcdFx0XHQnPGltZyBpZD1cInJlYWxtb25pdG9yaW5nX2NpcmNsZVwiIHNyYz1cIicrZ3BzaW1nKydcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8aW1nIGlkPVwiZmF2b3JpdGVfYnRuXCIgc3JjPVwiJytmYXZvcml0ZWltZysnXCIgbmFtZT1cIicrdGhpcy5zbGJpZCsnXCIgb25jbGljaz1cImZhdm9yaXRlQ2xpY2sodGhpcyk7XCI+Jytcblx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+PC9saT4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxsaSBjbGFzcz1cImNvbnRlbnQtc3R5bGVcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICc8ZGl2IGlkPVwiZGV2aWNlLWxpc3RcIiBjbGFzcz1cIm5ld2RldmljZS1saXN0XCIgb25jbGljaz1cImdldFNsYkluZm8odGhpcyk7XCI+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImRldmljZS1sYWJlbFwiPicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxoNCBjbGFzcz1cIicrbGFiZWwrJ1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvaDQ+PC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImRldmljZS1sYWJlbFwiPjxoND4nK3RoaXMubWFjKyc8L2g0PjwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzxkaXYgaWQ9XCJkZXZpY2Utc2xiaWRcIiBjbGFzcz1cIicrdGhpcy5lcXVpcFR5cGUrJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nK3RoaXMuc2xiaWQrJzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzxkaXYgY2xhc3M9XCJuZXdkZXZpY2Utc3RhdHVzXCI+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJkZXZpY2UtdzE2bW9kdWxlSWRTdGF0dXMzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPicrdGhpcy53MTZtb2R1bGVJZFN0YXR1cysnPC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJkZXZpY2UtdzE2bW9kdWxlSWRTdGF0dXM0ICcrdzE2Q2xhc3MrJyBidXR0b24tZGl2IGJ1dHRvbi1kaXYtd2lkdGg3MCBidXR0b24tZGl2LWxlZnQ1XCI+JysgbW9zbGIgKyc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICAnPGRpdiBjbGFzcz1cImRtY29ubmVjdGlvbnN0YXRlRGl2IGJ1dHRvbi1kaXYtd2lkdGg0MFwiIHN0eWxlPVwiZmxvYXQ6IGxlZnQ7IG1hcmdpbjogMCAzcHggMCAzcHg7XCI+ICcgKyB0ZW1wMSArICcgPC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJhdHRjb25uZWN0aW9uc3RhdGVEaXYgYnV0dG9uLWRpdi13aWR0aDQwXCIgc3R5bGU9XCJmbG9hdDogbGVmdDtcIj4gJyArIHRlbXAyICsgJyA8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICAnPGRpdiBjbGFzcz1cImRldmljZS1hdXRvY2FsbHN0YXRlM1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nK3RoaXMuYXV0b2NhbGxzdGF0ZSsnPC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgJzxkaXYgY2xhc3M9XCJkZXZpY2UtYXV0b2NhbGxzdGF0ZTQgJythdXRvY2FsbENsYXNzKycgYnV0dG9uLWRpdiBidXR0b24tZGl2LXdpZHRoNzAgYnV0dG9uLWRpdi1sZWZ0NVwiIHN0eWxlPVwiY2xlYXI6IGJvdGg7XCI+VEVTVDwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgJzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAnPC9saT4nXG5cblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmZhdm9yaXRlID09IFwiWVwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdCQoXCIjZGl2X2Zhdm9yaXRlXCIpLmFwcGVuZCh0ZW1wKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQkKFwiI2Rpdl9tb2JpbGVcIikuYXBwZW5kKHRlbXApO1xuXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cblxuXHRcdFx0XHRcdFx0XHR2YXIgYWNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFjY29yZGlvbmRldmljZVwiKTtcblx0XHRcdFx0XHRcdFx0dmFyIGk7XG5cblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0LyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcblx0XHRcdFx0XHRcdFx0XHRcdHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0XHRcdFx0XHRcdCAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuXHRcdFx0XHRcdFx0XHRcdFx0IHZhciBwYW5lbCA9IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0XHRcdFx0IGlmIChwYW5lbC5zdHlsZS5kaXNwbGF5ID09PSBcImJsb2NrXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0IHBhbmVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRcdFx0XHRcdH0gIGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgcGFuZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0JC5lYWNoKCQoXCIjZGl2X2Zhdm9yaXRlIC5hY2NvcmRpb25kZXZpY2VcIiksIGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaCgkKFwiI2Rpdl9mYXZvcml0ZSAuY29udGVudC1zdHlsZVwiKSwgZnVuY3Rpb24oaSl7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0aWYoY2xpY2tGbGFnKXtcblx0XHRcdFx0XHRcdFx0XHRjbGlja0ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHQkKFwiI2Rpdl9mYXZvcml0ZVwiKS5maW5kKFwiI2RldmljZS1saXN0XCIpLmNsaWNrKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cblx0XHRcdFx0XHRcdFx0bG9hZGluZ0VuZCgpO1xuXHRcdFx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmludGVydmFsKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNlbGYudGltZXIgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChzZWxmLnRpbWVyKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRzZWxmLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xpY2tGbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGludGVydmFsRmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnNldEluZm8oKTtcblx0XHRcdFx0XHRcdFx0XHR9LCBzZWxmLm9wdGlvbnMuaW50ZXJ2YWwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3IgOiBmdW5jdGlvbihlcnJvciwgcmVxdWVzdCwgc3RhdHVzKXtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRsb2FkaW5nRW5kKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR9XG5cdFx0fSk7XG5cblxuXG5cdFx0dGhpcy5fdHJpZ2dlcignd2lsbHVwZGF0ZScsIG51bGwsIHRoaXMpO1xuXHRcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOyCreygnFxuXHQgKi9cblx0dW5sb2FkOiBmdW5jdGlvbiAodmFsdWUpIHt9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyB2YXIgdyA9IE1hdGgubWF4KHBhcnNlSW50KHRoaXMuZWxlbWVudC5wYXJlbnQoKS5pbm5lcldpZHRoKCksIDEwKSwgdGhpcy5vcHRpb25zLm1pbldpZHRoKTtcblx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gXG5cdFx0aWYgKCAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgnVHJpZGVudCcpICE9IC0xKSB8fCAoYWdlbnQuaW5kZXhPZihcIm1zaWVcIikgIT0gLTEpICkge1xuXHRcdFx0aWYodGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuaXRlbS1oZWFkZXJcIikubGVuZ3RoID4gMCl7XG5cdFx0XHRcdHZhciBoID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmlubmVySGVpZ2h0KCkgLSA4MDtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmhlaWdodChoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxufSk7XG4vL30pO1xuIiwidmFyIHNjb3BlID0gd2luZG93O1xudmFyIExJTkVfQ0hBUlRfSURYID0gMDtcbiQud2lkZ2V0KCdpdWkuY2hhcnR0aW1lc2VyaWVzJywge1xuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHZhciB3ID0gJCh0aGlzLmVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHRcdC5pbm5lcldpZHRoKCktMTA7XG5cdFx0dmFyIGggPSAkKHRoaXMuZWxlbWVudCkucGFyZW50KCkucGFyZW50KClcblx0XHRcdFx0LmlubmVySGVpZ2h0KCktMTA7XG5cblxuXHRcdHZhciBjaGFydDtcblx0XHRjaGFydCA9IG5ldyBIaWdoY2hhcnRzLlN0b2NrQ2hhcnQoe1xuXHRcdFx0Y3JlZGl0czp7IFxuXHRcdFx0XHRlbmFibGVkOmZhbHNlIFxuXHRcdFx0fSxcblx0XHRcdGNoYXJ0OiB7XG5cdFx0XHRcdFx0cmVuZGVyVG86IHNlbGYuZWxlbWVudC5hdHRyKFwiaWRcIiksXG5cdFx0XHRcdFx0em9vbVR5cGU6ICd4J1xuXHRcdFx0fSxcblx0XHRcdHJhbmdlU2VsZWN0b3IgOiB7XG5cdFx0XHRcdGlucHV0RW5hYmxlZDpmYWxzZSxcblx0XHRcdFx0YnV0dG9uVGhlbWU6IHtcblx0XHRcdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbFN0eWxlOiB7XG5cdFx0XHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRpdGxlOiBzZWxmLm9wdGlvbnMuaXRlbS5sYWJlbCxcblx0XHRcdHhBeGlzOiB7XG5cdFx0XHRcdHR5cGU6ICdkYXRldGltZScsXG5cdFx0XHRcdGRhdGVUaW1lTGFiZWxGb3JtYXRzOiB7XG5cdFx0XHRcdFx0ZGF5OiAnJWQgJUg6JU0nXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR5QXhpczogW1xuXHRcdFx0XHR7IC8vIFByaW1hcnkgeUF4aXNcblx0XHRcdFx0XHR0aXRsZToge1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiAnUkYgSW5mb3JtYXRpb24nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvcHBvc2l0ZSA6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdF0sXG5cdFx0XHRsZWdlbmQ6IHtcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdHBsb3RPcHRpb25zOiB7XG5cdFx0XHRcdHNlcmllczoge1xuXHRcdFx0XHRcdGJvcmRlcldpZHRoOiAwXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0b29sdGlwOiB7XG5cdFx0XHRcdHNoYXJlZDogdHJ1ZSxcblx0XHRcdFx0Y3Jvc3NoYWlyczogdHJ1ZSxcblx0XHRcdFx0cG9pbnRGb3JtYXQ6ICc8c3BhbiBzdHlsZT1cImNvbG9yOntwb2ludC5jb2xvcn1cIj5cXHUyNUNGPC9zcGFuPjxiPiB7c2VyaWVzLm5hbWV9PC9iPiA6IHtwb2ludC55OiwuMmZ9PGJyPicsXG5cdFx0XHRcdHhEYXRlRm9ybWF0IDogXCIlWS0lbS0lZCwgJUg6JU06JVNcIixcblx0XHRcdFx0ZGF0ZVRpbWVMYWJlbEZvcm1hdHMgOiB7XG5cdFx0XHRcdCAgbWlsbGlzZWNvbmQ6XCIlWS0lbS0lZCwgJUg6JU06JVNcIixcblx0XHRcdFx0ICBzZWNvbmQ6XCIlWS0lbS0lZCwgJUg6JU06JVNcIixcblx0XHRcdFx0ICBtaW51dGU6XCIlWS0lbS0lZCwgJUg6JU06JVNcIixcblx0XHRcdFx0ICBob3VyOlwiJVktJW0tJWQgJUhcIixcblx0XHRcdFx0ICBkYXk6XCIlWS0lbS0lZFwiLFxuXHRcdFx0XHQgIHdlZWs6XCIlWS0lbS0lZFwiLFxuXHRcdFx0XHQgIG1vbnRoOlwiJVktJW1cIixcblx0XHRcdFx0ICB5ZWFyOlwiJVlcIlx0IFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXHRcdGNoYXJ0LnNldFNpemUodywgaCk7XG5cdFx0c2VsZi5jaGFydCA9IGNoYXJ0O1xuXHRcdHNlbGYuZWxlbWVudC5hcHBlbmQoY2hhcnQuZWxlbWVudCk7XG5cdFx0c2VsZi5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgc2VsZik7XG5cdFx0Y2hhcnQgPSBudWxsO1xuXHRcdGFqYXhEYXRhID0gbnVsbDtcblxuXHRcdGlmKHNlbGYub3B0aW9ucy5pdGVtLmludGVydmFsKXtcblx0XHRcdGlmKHNlbGYudGltZXIgIT0gbnVsbCl7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cdFx0XHRzZWxmLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHRcdH0sIHNlbGYub3B0aW9ucy5pdGVtLmludGVydmFsKTtcblx0XHR9XG5cdH0sXG5cblx0X2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuXHR9LFxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdC8vIGlmIChrZXkgPT09IFwicGFyYW1zXCIpIHtcblx0XHQvLyB9XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cblx0XHR0aGlzLnJlZnJlc2goKTtcblxuXHRcdC8qXG5cdFx0aWYodmFsdWUgPT0gdGhpcy5vcHRpb25zLml0ZW0uZGF0YSl7XG5cdFx0XHR0aGlzLnJlZnJlc2goKTtcblx0XHR9XG5cdFx0Ki9cblx0fSxcblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmKHR5cGVvZihwYXJhbXMpICE9IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0aWYocGFyYW1zLnN1YnN0cmluZyhwYXJhbXMubGFzdEluZGV4T2YoXCImXCIpLHBhcmFtcy5sZW5ndGgpLnJlcGxhY2UoLyZlcXVpcFR5cGU9L2dpLFwiXCIpID09IFwiMFwiKXsgLy9zbGJcblxuXHRcdFx0XHR2YXIgbGVuID0gdGhpcy5jaGFydC5zZXJpZXMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKyl7XG5cdFx0XHRcdFx0dGhpcy5jaGFydC5zZXJpZXNbMF0ucmVtb3ZlKHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5jaGFydC5hZGRTZXJpZXMoe1xuXHRcdFx0XHRcdG5hbWU6ICdUeC5Qb3dlcidcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNTSSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNSUCdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNSUSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnRWNpbydcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnU0lOUidcblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZihwYXJhbXMuc3Vic3RyaW5nKHBhcmFtcy5pbmRleE9mKFwicG9ydE51bWJlcj1cIikscGFyYW1zLmxhc3RJbmRleE9mKFwiJlwiKSkucmVwbGFjZSgvcG9ydE51bWJlcj0vZ2ksXCJcIikgPT0gXCIwXCIpeyAvL3BvcnROdW1iZXIgPT0gMFxuXHRcdFx0XHRcdHZhciBhamF4RGF0YSA9IFt7XCJncmFwaEluZm9cIjpbe1wibmFkVHhQb3dlclwiOlwiXCIsIFwibmFkUnNzaVwiOlwiXCIsIFwibmFkUnNycFwiOlwiXCIsIFwibmFkUnNycVwiOlwiXCIsIFwibmFkRWNJb1wiOlwiXCIsIFwibmFkU2luclwiOiBcIlwifV19XTtcblx0XHRcdFx0XHRzZWxmLmxvYWQoYWpheERhdGFbMF0pO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHRcdFx0dXJsOiBzZWxmLm9wdGlvbnMuaXRlbS5kYXRhLFxuXHRcdFx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0XHRcdFx0dHlwZTogXCJwb3N0XCIsXG5cdFx0XHRcdFx0XHRkYXRhOiBwYXJhbXMsXG5cdFx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoYWpheERhdGEpIHtcblx0XHRcdFx0XHRcdFx0c2VsZi5sb2FkKGFqYXhEYXRhKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QsIHN0YXR1cyl7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7IC8vZWxzZSBzbGJcblx0XHRcdFxuXHRcdFx0XHR2YXIgbGVuID0gdGhpcy5jaGFydC5zZXJpZXMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKyl7XG5cdFx0XHRcdFx0dGhpcy5jaGFydC5zZXJpZXNbMF0ucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNTSSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNSUCdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnUlNSUSdcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtcblx0XHRcdFx0XHRuYW1lOiAnU0lOUidcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHRcdHVybDogc2VsZi5vcHRpb25zLml0ZW0uZGF0YSxcblx0XHRcdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0XHRcdHR5cGU6IFwicG9zdFwiLFxuXHRcdFx0XHRcdFx0ZGF0YTogcGFyYW1zLFxuXHRcdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGFqYXhEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYubG9hZChhamF4RGF0YSk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGVycm9yLCByZXF1ZXN0LCBzdGF0dXMpe1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRcblx0XHRcblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsdXBkYXRlJywgbnVsbCwgc2VsZik7XG5cdH0sXG5cblxuXHQvKipcblx0ICog642w7J207YSwIOy2lOqwgFxuXHQgKi9cblx0bG9hZDogZnVuY3Rpb24gKGFqYXhEYXRhKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdGlmKGFqYXhEYXRhLmVxdWlwVHlwZSA9PSBcIjBcIil7XG5cdFx0XHR0aGlzLmNoYXJ0LnNlcmllc1swXS5zZXREYXRhKGFqYXhEYXRhLmdyYXBoSW5mby5uYWRUeFBvd2VyKTtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzFdLnNldERhdGEoYWpheERhdGEuZ3JhcGhJbmZvLm5hZFJzc2kpO1xuXHRcdFx0dGhpcy5jaGFydC5zZXJpZXNbMl0uc2V0RGF0YShhamF4RGF0YS5ncmFwaEluZm8ubmFkUnNycCk7XG5cdFx0XHR0aGlzLmNoYXJ0LnNlcmllc1szXS5zZXREYXRhKGFqYXhEYXRhLmdyYXBoSW5mby5uYWRSc3JxKTtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzRdLnNldERhdGEoYWpheERhdGEuZ3JhcGhJbmZvLm5hZEVjSW8pO1xuXHRcdFx0dGhpcy5jaGFydC5zZXJpZXNbNV0uc2V0RGF0YShhamF4RGF0YS5ncmFwaEluZm8ubmFkU2lucik7XG5cdFx0fWVsc2UgaWYoYWpheERhdGEuZXF1aXBUeXBlID09IFwiMVwiKXtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzBdLnNldERhdGEoYWpheERhdGEuTW9iaWxlZ3JhcGhJbmZvLm5hZFBSc3NpKTtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzFdLnNldERhdGEoYWpheERhdGEuTW9iaWxlZ3JhcGhJbmZvLm5hZFBSc3JwKTtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzJdLnNldERhdGEoYWpheERhdGEuTW9iaWxlZ3JhcGhJbmZvLm5hZFBSc3JxKTtcblx0XHRcdHRoaXMuY2hhcnQuc2VyaWVzWzNdLnNldERhdGEoYWpheERhdGEuTW9iaWxlZ3JhcGhJbmZvLm5hZFBTaW5yKTtcblx0XHR9XG5cblx0XHRcblxuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHRoaXMuY2hhcnQuZGVzdHJveSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cblxuXHRcdHZhciB3ID0gJCh0aGlzLmVsZW1lbnQpLnBhcmVudCgpLnBhcmVudCgpXG5cdFx0XHRcdC5pbm5lcldpZHRoKCktMTA7XG5cdFx0dmFyIGggPSAkKHRoaXMuZWxlbWVudCkucGFyZW50KCkucGFyZW50KClcblx0XHRcdFx0LmlubmVySGVpZ2h0KCktMTA7XG5cblx0XHR0aGlzLmNoYXJ0LnNldFNpemUodywgaCk7XG5cdH1cbn0pO1xuIiwidmFyIFBJRV9DSEFSVF9JRFggPSAwO1xuJC53aWRnZXQoJ2l1aS5jaGFydHRyZWVtYXAnLCB7XG5cdG9wdGlvbnM6IHtcblx0XHRtaW5XaWR0aDogMjAwLFxuXHRcdG1pbkhlaWdodDogMjAwXG5cdH0sXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cdFx0aWYodGhpcy5vcHRpb25zLnBhcmFtcyA9PSBcInJlZnJlc2hcIiB8fCB0aGlzLmVsZW1lbnQucGFyZW50KCkuZmluZChcIi5cIit0aGlzLm9wdGlvbnMucGFyYW1zKS5sZW5ndGggPiAwKXtcblx0XHRcdHRoaXMucmVmcmVzaCgpO1xuXHRcdH1cblx0fSxcblx0X2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcblx0XHR2YXIgcGFyZW50ID0gdGhpcy5lbGVtZW50O1xuXHRcdCQocGFyZW50KS5oZWlnaHQoNTAwKTtcblx0XHRcblx0XHR2YXIgY2hhcnRfdHJlZW1hcCA9IGVjaGFydHMuaW5pdChwYXJlbnRbMF0pO1xuXHRcdHZhciBjaGFydF90cmVlbWFwX29wdGlvbiA9IHtcblx0XHRcdHNlcmllcyA6IFsge1xuXHRcdFx0XHR0eXBlIDogJ3RyZWVtYXAnLFxuXHRcdFx0XHRkYXRhIDogWyB7XG5cdFx0XHRcdFx0bmFtZSA6ICdub2RlQScsIC8vIEZpcnN0IHRyZWVcblx0XHRcdFx0XHR2YWx1ZSA6IDEwLFxuXHRcdFx0XHRcdGNoaWxkcmVuIDogWyB7XG5cdFx0XHRcdFx0XHRuYW1lIDogJ25vZGVBYScsIC8vIEZpcnN0IGxlYWYgb2YgZmlyc3QgdHJlZVxuXHRcdFx0XHRcdFx0dmFsdWUgOiA0XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0bmFtZSA6ICdub2RlQWInLCAvLyBTZWNvbmQgbGVhZiBvZiBmaXJzdCB0cmVlXG5cdFx0XHRcdFx0XHR2YWx1ZSA6IDZcblx0XHRcdFx0XHR9IF1cblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdG5hbWUgOiAnbm9kZUInLCAvLyBTZWNvbmQgdHJlZVxuXHRcdFx0XHRcdHZhbHVlIDogMjAsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gOiBbIHtcblx0XHRcdFx0XHRcdG5hbWUgOiAnbm9kZUJhJywgLy8gU29uIG9mIGZpcnN0IHRyZWVcblx0XHRcdFx0XHRcdHZhbHVlIDogMjAsXG5cdFx0XHRcdFx0XHRjaGlsZHJlbiA6IFsge1xuXHRcdFx0XHRcdFx0XHRuYW1lIDogJ25vZGVCYTEnLCAvLyBHcmFuc29uIG9mIGZpcnN0IHRyZWVcblx0XHRcdFx0XHRcdFx0dmFsdWUgOiAyMFxuXHRcdFx0XHRcdFx0fSBdXG5cdFx0XHRcdFx0fSBdXG5cdFx0XHRcdH0gXVxuXHRcdFx0fSBdXG5cdFx0fTtcblxuXHRcdGNoYXJ0X3RyZWVtYXAuc2V0T3B0aW9uKGNoYXJ0X3RyZWVtYXBfb3B0aW9uKTtcblxuXHRcdHNlbGYuY2hhcnQgPSBjaGFydF90cmVlbWFwO1xuXHR9LFxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdH0sXG5cblx0cmVmcmVzaDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGxtb3VudCcsIG51bGwsIHRoaXMpO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHRoaXMuY2hhcnQubG9hZCh7XG5cdFx0XHRjb2x1bW5zOiB2YWx1ZVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHRoaXMuY2hhcnQudW5sb2FkKCd2YWx1ZScpXG5cdH0sXG5cblx0LyoqXG5cdCAqIO2BrOq4sCDrs4Dqsr1cblx0ICovXG5cdHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmKHRoaXMuY2hhcnQpIHtcblx0XHRcdHRoaXMuY2hhcnQucmVzaXplKCk7XG5cdFx0fVxuXHR9XG59KTtcbi8vfSk7XG4iLCIvLyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuLy9pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4vL2RlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbi8vfVxuLy9lbHNlIHtcbi8vZmFjdG9yeShqUXVlcnkpO1xuLy99XG4vL30pKGZ1bmN0aW9uICgkKSB7XG5cbi8vdmFyIHNjb3BlID0gd2luZG93O1xuXG4vL+yngOyXrSDrs4DsiJhcbnZhciBEQVNIQk9BUkRfSVRFTV9HUk9VUF9JRCA9IDA7XG5cbiQud2lkZ2V0KCdpdWkuZGFzaGJvYXJkaXRlbXMnLCB7XG5cdC8vIO2BtOuemOyKpCDrqaTrsoRcblx0Ly8gZGVmYXVsdCBvcHRpb25zXG5cdG9wdGlvbnM6IHtcblx0XHRpZDogJ2l0ZW1ncm91cDAnLFxuXHRcdGxhYmVsOiAn7JWE7J207YWcIOumrOyKpO2KuCcsXG5cdFx0ZGVzY3JpcHRpb246ICfsgqzsmqntlZjsi6Qg7JyE7KCv7J2EIOyEoO2Dne2VmOyXrCDso7zshLjsmpQuJyxcblx0XHRpdGVtczogW10sXG5cdFx0cm9sbG92ZXI6ICQubm9vcCxcblx0XHRyb2xsb3V0OiAkLm5vb3AsXG5cdFx0Y2hhbmdlOiAkLm5vb3Bcblx0fSxcblxuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8g7J247Iqk7YS07IqkIOywuOyhsFxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHQvLyDsnbjsiqTthLTsiqQg66mk67KEIOuzgOyImFxuXHRcdHNlbGYuaWR4ID0gREFTSEJPQVJEX0lURU1fR1JPVVBfSUQrKztcblx0XHRzZWxmLmNoZWNrYm94ZXMgPSB7fTtcblxuXHRcdGlmIChzZWxmLm9wdGlvbnMuZGF0YSkge1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBzZWxmLm9wdGlvbnMuZGF0YSxcblx0XHRcdFx0ZGF0YToge30sXG5cdFx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIlxuXHRcdFx0fSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuXHRcdFx0XHQvLyDsnbjsiqTthLTsiqQg66mk67KEIOuzgOyImCDshLjtjIVcblx0XHRcdFx0c2VsZi5vcHRpb25zID0gJC5leHRlbmQoc2VsZi5vcHRpb25zLCBkYXRhKTtcblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG5cdFx0XHRcdGlmIChjb25zb2xlICYmIGNvbnNvbGUubG9nKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codGV4dFN0YXR1cyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8g7YG0656Y7IqkIOuppOuyhCDrqZTshozrk5wg7Zi47LacXG5cdFx0XHRcdHNlbGYucmVuZGVyKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyDtgbTrnpjsiqQg66mk67KEIOuplOyGjOuTnCDtmLjstpxcblx0XHRzZWxmLl90cmlnZ2VyKCd3aWxsbW91bnQnLCBudWxsLCB0aGlzKTtcblx0fSxcblxuXHRfb25Sb2xsT3ZlcjogZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHR0aGlzLl90cmlnZ2VyKCdyb2xsb3ZlcicsIGUsIGRhdGEpO1xuXHR9LFxuXG5cdF9vblJvbGxPdXQ6IGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0dGhpcy5fdHJpZ2dlcigncm9sbG91dCcsIGUsIGRhdGEpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgaGVhZGVyID0gJCgnPGgzIGNsYXNzPVwiZ3JlZW5cIj48L2gzPicpXG5cdFx0LnRleHQoc2VsZi5vcHRpb25zLmxhYmVsKTtcblx0XHQkKCc8c21hbGw+PC9zbWFsbD4nKVxuXHRcdC50ZXh0KCcgLSAnICsgc2VsZi5vcHRpb25zLmRlc2NyaXB0aW9uKVxuXHRcdC5hcHBlbmRUbyhoZWFkZXIpO1xuXHRcdHZhciBjdHJsID0gJCgnPGRpdj48L2Rpdj4nKVxuXHRcdC5hcHBlbmRUbyhoZWFkZXIpO1xuXHRcdHNlbGYuY3RybFRvZ2dsZUFsbCA9ICQoJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNob29zZS13aWRnZXRcIiBpZD1cIml1aV9kYl93Z18nICsgc2VsZi5pZHggKyAnXCIvPicpXG5cdFx0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0c2VsZi5fdG9nZ2xlV2hvbGVJdGVtLmNhbGwoc2VsZiwgZSk7XG5cdFx0fSlcblx0XHQuYXBwZW5kVG8oY3RybCk7XG5cdFx0JCgnPGxhYmVsIGZvcj1cIml1aV9kYl93Z18nICsgc2VsZi5pZHggKyAnXCI+7KCE7LK07ISg7YOdPC9sYWJlbD4nKVxuXHRcdC5hcHBlbmRUbyhjdHJsKTtcblx0XHR2YXIgY29udGVudHMgPSAkKCc8dWw+PC91bD4nKVxuXHRcdC5hZGRDbGFzcygnd2lkZ2V0LWdyb3VwJyk7XG5cdFx0dmFyIGxpLCBjaDtcblx0XHQkLmVhY2goc2VsZi5vcHRpb25zLml0ZW1zLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuXHRcdFx0bGkgPSAkKCc8bGk+PC9saT4nKVxuXHRcdFx0Lm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihlKXtzZWxmLl9vblJvbGxPdmVyLmNhbGwoc2VsZiwgZSwgaXRlbSk7fSlcblx0XHRcdC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihlKXtzZWxmLl9vblJvbGxPdXQuY2FsbChzZWxmLCBlLCBpdGVtKTt9KVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRlbnRzKTtcblx0XHRcdGNoID0gJCgnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hvb3NlLXdpZGdldCBpdWktZGItd2ctJyArIHNlbGYuaWR4ICsgJ1wiIG5hbWU9XCJpdWlfZGJfd2dfJyArIHNlbGYuaWR4ICsgJ1wiIGlkPVwiaXVpX2RiX3dnXycgKyBzZWxmLmlkeCArICdfJyArIGkgKyAnXCIvPicpXG5cdFx0XHQuYXR0cignZGF0YS1kYXNoYm9hcmQtaXRlbScsIGl0ZW0uaWQpXG5cdFx0XHQub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHNlbGYuX2NoYW5nZVN0YXRlKGUpO1xuXHRcdFx0fSlcblx0XHRcdC5kYXRhKCdkYXRhLWl1aS1kYXNoYm9hcmQtd2lkZ2V0LWl0ZW0nLCBpdGVtKVxuXHRcdFx0LmFwcGVuZFRvKGxpKTtcblx0XHRcdHNlbGYuY2hlY2tib3hlc1tpdGVtLmlkXSA9IGNoO1xuXHRcdFx0JCgnPGxhYmVsIGZvcj1cIml1aV9kYl93Z18nICsgc2VsZi5pZHggKyAnXycgKyBpICsgJ1wiPjwvbGFiZWw+Jylcblx0XHRcdC50ZXh0KGl0ZW0ubGFiZWwpXG5cdFx0XHQuYXBwZW5kVG8obGkpO1xuXHRcdH0pO1xuXHRcdHNlbGYuZWxlbWVudFxuXHRcdC5hZGRDbGFzcygnaXVpLWRhc2hib2FyZC1pdGVtcycpXG5cdFx0LmFwcGVuZChoZWFkZXIpXG5cdFx0LmFwcGVuZChjb250ZW50cyk7XG5cdFx0aGVhZGVyID0gY3RybCA9IGNvbnRlbnRzID0gbGkgPSBjaCA9IG51bGw7XG5cdH0sXG5cblx0X2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmVsZW1lbnRcblx0XHQucmVtb3ZlQ2xhc3MoJ2l1aS1kYXNoYm9hcmQtaXRlbXMnKVxuXHRcdC5lbXB0eSgpO1xuXHR9LFxuXG5cdF9pc0NoZWNrZWRBbGw6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbGVuZ3RoID0gMDtcblx0XHR2YXIgY2htYXAgPSAkLm1hcCh0aGlzLmNoZWNrYm94ZXMsIGZ1bmN0aW9uIChjKSB7XG5cdFx0XHRsZW5ndGgrKztcblx0XHRcdHJldHVybiBjLnByb3AoJ2NoZWNrZWQnKSA/IGMgOiBudWxsO1xuXHRcdH0pO1xuXHRcdHRyeXtcblx0XHRcdHJldHVybiBsZW5ndGggPT09IGNobWFwLmxlbmd0aDtcblx0XHR9ZmluYWxseXtcblx0XHRcdGxlbmd0aCA9IGNobWFwID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0dG9nZ2xlSXRlbTogZnVuY3Rpb24gKGl0ZW0sIGNoZWNrZWQsIHRyaWdnZXIpIHtcblx0XHRpZiAodGhpcy5jaGVja2JveGVzW2l0ZW1dKSB7XG5cdFx0XHRpZiAodGhpcy5jaGVja2JveGVzW2l0ZW1dLmNoZWNrZWQgPT09IGNoZWNrZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dHJpZ2dlciA9IHRyaWdnZXIgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0dGhpcy5jaGFuZ2VJdGVtU3RhdGUodGhpcy5jaGVja2JveGVzW2l0ZW1dLCBjaGVja2VkLCB0cmlnZ2VyKTtcblx0XHR9XG5cdH0sXG5cblx0Y2hhbmdlSXRlbVN0YXRlOiBmdW5jdGlvbiAoY2hlY2tib3gsIGNoZWNrZWQsIHRyaWdnZXIpIHtcblx0XHRjaGVja2JveCA9ICQoY2hlY2tib3gpO1xuXHRcdGNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcblx0XHR2YXIgaXRlbSA9IGNoZWNrYm94LmRhdGEoJ2RhdGEtaXVpLWRhc2hib2FyZC13aWRnZXQtaXRlbScpO1xuXHRcdGl0ZW0uY2hlY2tlZCA9IGNoZWNrZWQ7XG5cdFx0dGhpcy5jdHJsVG9nZ2xlQWxsLnByb3AoJ2NoZWNrZWQnLCB0aGlzLl9pc0NoZWNrZWRBbGwoKSk7XG5cdFx0aWYgKHRyaWdnZXIgIT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLl90cmlnZ2VyKCdjaGFuZ2UnLCBudWxsLCBpdGVtKTtcblx0XHR9XG5cdH0sXG5cblx0X2NoYW5nZVN0YXRlOiBmdW5jdGlvbiAoZSkge1xuXHRcdHRoaXMuY2hhbmdlSXRlbVN0YXRlKGUudGFyZ2V0LCBlLnRhcmdldC5jaGVja2VkKTtcblx0fSxcblxuXHR0b2dnbGVBbGw6IGZ1bmN0aW9uIChjaGVja2VkLCB0cmlnZ2VyKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRyaWdnZXIgPSB0cmlnZ2VyID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcblx0XHQkLmVhY2goc2VsZi5jaGVja2JveGVzLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyB0aGlzID09IGNvbnRleHRcblx0XHRcdGlmIChjaGVja2VkICYmIHRoaXMucHJvcCgnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHNlbGYuY2hhbmdlSXRlbVN0YXRlKHRoaXMsIGNoZWNrZWQsIHRyaWdnZXIpO1xuXHRcdH0pO1xuXHRcdHNlbGYuY3RybFRvZ2dsZUFsbC5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG5cdFx0c2VsZiA9IG51bGw7XG5cdH0sXG5cblx0X3RvZ2dsZVdob2xlSXRlbTogZnVuY3Rpb24gKGUpIHtcblx0XHR0aGlzLnRvZ2dsZUFsbChlLnRhcmdldC5jaGVja2VkKTtcblx0fVxufSk7XG4vL30pO1xuIiwiLy8oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbi8vaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuLy9kZWZpbmUoWydqcXVlcnknLCAnZDMnLCAnYzMnXSwgZmFjdG9yeSk7XG4vL31cbi8vZWxzZSB7XG4vL2ZhY3RvcnkoalF1ZXJ5KTtcbi8vfVxuLy99KShmdW5jdGlvbiAoJCkge1xuXG52YXIgc2NvcGUgPSB3aW5kb3c7XG52YXIgVEFCTEVfQ0hBUlRfSURYID0gMDtcbiQud2lkZ2V0KCdpdWkuY2hhcnRtYXAnLCB7XG5cdF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XG5cdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwge30gLCB7XG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNlbGYubG9hZCgpO1xuXHRcdFx0fSxcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vc2VsZi5yZWZyZXNoKCk7XG5cdFx0c2VsZi5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgc2VsZik7XG5cdFx0XG5cdFx0aWYgKHNlbGYub3B0aW9ucy5pbnRlcnZhbCkge1xuXHRcdFx0aWYgKHNlbGYudGltZXIgIT0gbnVsbCkge1xuXHRcdFx0XHRjbGVhckludGVydmFsKHNlbGYudGltZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHRcdH0sIHNlbGYub3B0aW9ucy5pbnRlcnZhbCk7XG5cdFx0fVxuXHR9LFxuXHRfcGFyc2VDb2x1bW5zOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNvbHVtbnMgPSB7fTtcblx0XHQkLmVhY2godGhpcy5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChpKSB7XG5cdFx0XHR2YXIga2V5ID0gdGhpc1swXTtcblx0XHRcdGNvbHVtbnNba2V5XSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDEsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRjb2x1bW5zW2tleV0ucHVzaCh0aGlzW2ldKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR0cnl7XG5cdFx0XHRyZXR1cm4gY29sdW1ucztcblx0XHR9ZmluYWxseXtcblx0XHRcdGNvbHVtbnMgPSBudWxsO1xuXHRcdH1cblx0fSxcblxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdC8vIGlmIChrZXkgPT09IFwicGFyYW1zXCIpIHtcblx0XHQvLyB9XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cblx0XHR0aGlzLnJlZnJlc2goKTtcblx0fSxcblxuXHQvLyBfc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0Ly8gIHRoaXMuX3N1cGVyKG9wdGlvbnMpO1xuXHQvLyAgdGhpcy5yZWZyZXNoKCk7XG5cdC8vIH0sXG5cdHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcblx0XHRsb2FkaW5nU3RhcnQoKTtcblxuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXHRcdFxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHZhciBlcXVpcFR5cGUgPSBwYXJhbXMuc3Vic3RyaW5nKHBhcmFtcy5sYXN0SW5kZXhPZihcIiZcIikscGFyYW1zLmxlbmd0aCkucmVwbGFjZSgvJmVxdWlwVHlwZT0vZ2ksXCJcIik7XG5cdFx0XG5cdFx0cGFyYW1zID0gXCJzbGJpZD1cIitzZWxlY3RTbGJpZCtcIiZlcXVpcFR5cGU9XCIrZXF1aXBUeXBlO1xuXG5cdFx0cmVxdWVzdEFzeW5jUGFyYW1ldGVyTWFwTWFya2VycyhwYXJhbXMpO1xuXHRcdFxuXHRcdC8qXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybCA6IHRoaXMub3B0aW9ucy5kYXRhLFxuXHRcdFx0dHlwZSA6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YVR5cGUgOiBcImpzb25cIixcblx0XHRcdGRhdGEgOiBwYXJhbXMsXG5cdFx0XHRzdWNjZXNzIDogZnVuY3Rpb24oYWpheERhdGEpe1xuXHRcdFx0XHRzZWxmLmxvYWQoYWpheERhdGEpO1xuXHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcblx0XHRcdFx0aWYoaXVpLmRhc2hib2FyZC53aWRnZXRzLmxlbmd0aCA8PSBkYXNoYm9hcmRXaWRnZXRJZHgpe1xuXHRcdFx0XHRcdGxvYWRpbmdFbmQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwYXJhbXMgPSBudWxsO1xuXHRcdFx0XHRhamF4RGF0YSA9IG51bGw7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3IgOiBmdW5jdGlvbiAoZXJyb3IsIHJlcXVlc3QsIHN0YXR1cyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcdFxuXHRcdFx0XHRpZihpdWkuZGFzaGJvYXJkLndpZGdldHMubGVuZ3RoIDw9IGRhc2hib2FyZFdpZGdldElkeCl7XG5cdFx0XHRcdFx0bG9hZGluZ0VuZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ki9cblxuXHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGx1cGRhdGUnLCBudWxsLCB0aGlzKTtcblx0fSxcblxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zIHx8IHt9O1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHNlbGYuZWxlbWVudC5lbXB0eSgpLmxvYWRUZW1wbGF0ZShzZWxmLm9wdGlvbnMudGVtcGxhdGUsIHZhbHVlLCB7XG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdGVtcCA9IFwiPGRpdiBpZD0nbWFpbkNvbnRlbnQnIGNsYXNzPSdoaWRkZW4nIHN0eWxlPSd3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyc+PC9kaXY+XCI7XG5cdFx0XHRcdHNlbGYuZWxlbWVudC5hcHBlbmQodGVtcCk7XG5cblx0XHRcdFx0XG5cdFx0XHRcdHNldEdyaWRDb2x1bW5zKCk7XG5cdFx0XHRcdF9pbml0aWFsaXplKCk7XG5cdFx0XHRcdC8vZ2V0U3RhcnRFbmRUaW1lKCk7XG5cblxuXHRcdFx0XHQvLyBkYXNoYm9hcmQgdGFibGUg7JeQIGhlaWdodCDsnYQg7KO86riw7JyE7ZW0IOyngOuPhOunjCDrlLDroZwgMTAwJSDrhKPslrTspIwgXG5cdFx0XHRcdCQoJChcIi53aWRnZXQtYm9keVwiKVsxXSkuY2hpbGRyZW4oKS5oZWlnaHQoXCIxMDAlXCIpO1xuXHRcdFx0XHRtYXA0LnJlc2l6ZSgpO1xuXHRcdFx0XHRcblx0XHRcdFx0ZGFzaGJvYXJkV2lkZ2V0SWR4Kys7XG5cdFx0XHRcdGlmKGl1aS5kYXNoYm9hcmQud2lkZ2V0cy5sZW5ndGggPD0gZGFzaGJvYXJkV2lkZ2V0SWR4KXtcblx0XHRcdFx0XHRsb2FkaW5nRW5kKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSxcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHNlbGYgPSBudWxsO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7IKt7KCcXG5cdCAqL1xuXHR1bmxvYWQ6IGZ1bmN0aW9uICgpIHt9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdFxuXHRcdG1hcDQucmVzaXplKCk7XG5cdFx0Ly8gdmFyIHcgPSBNYXRoLm1heChwYXJzZUludCh0aGlzLmVsZW1lbnQucGFyZW50KCkuaW5uZXJXaWR0aCgpLCAxMCksIHRoaXMub3B0aW9ucy5taW5XaWR0aCk7XG5cdFx0dmFyIGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuIFxuXHRcdGlmICggKG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goJ1RyaWRlbnQnKSAhPSAtMSkgfHwgKGFnZW50LmluZGV4T2YoXCJtc2llXCIpICE9IC0xKSApIHtcblx0XHRcdGlmKHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKFwiLml0ZW0taGVhZGVyXCIpLmxlbmd0aCA+IDApe1xuXHRcdFx0XHR2YXIgaCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5pbm5lckhlaWdodCgpIC0gODA7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5oZWlnaHQoaCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxufSk7XG4vL30pO1xuIiwiLy8gKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4vLyAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuLy8gICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4vLyAgfVxuLy8gIGVsc2Uge1xuLy8gICBmYWN0b3J5KGpRdWVyeSk7XG4vLyAgfVxuLy8gfSkoZnVuY3Rpb24gKCQpIHtcbnZhciBEQVNIQk9BUkRfTU9EQUxfSURYID0gMDtcbiQud2lkZ2V0KCdpdWkubW9kYWwnLCB7XG5cbiBvcHRpb25zOiB7XG4gIHRpdGxlOiAnbW9kYWwgd2luZG93IHRpdGxlJyxcbiAgZGVzY3JpcHRpb246ICdtb2RhbCB3aW5kb3cgZGVzY3JpcHRpb25zICcsXG4gIG1pbldpZHRoOiAyMDAsXG4gIG1pbkhlaWdodDogMjAwLFxuICB3aWR0aDogMzAwLFxuICBoZWlnaHQ6IDIwMCxcbiAgYnV0dG9uczoge1xuICAgY2xvc2U6ICfst6jshownLFxuICAgc2F2ZTogJ+yggOyepSdcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uIChlKSB7XG4gICBjb25zb2xlLmxvZygnbW9kYWwgY2xvc2UgZXZlbnQgZGVmYXVsdCBoYW5kbGVyLicpO1xuICB9LFxuICBjb25maXJtOiBmdW5jdGlvbiAoZSkge1xuICAgY29uc29sZS5sb2coJ21vZGFsIGNvbmZpcm0gZGVmYXVsdCBoYW5kbGVyLicpO1xuICB9XG4gfSxcblxuIF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pZCA9ICdpdWlNb2RhbF8nICsgREFTSEJPQVJEX01PREFMX0lEWCsrO1xuICB0aGlzLnJlZnJlc2goKTtcbiAgdGhpcy5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgdGhpcyk7XG4gfSxcblxuIF9zZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuIH0sXG5cbiBfc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdGhpcy5fc3VwZXIob3B0aW9ucyk7XG4gIHRoaXMucmVmcmVzaCgpO1xuIH0sXG5cbiByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fdHJpZ2dlcignd2lsbHVwZGF0ZScsIG51bGwsIHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudCA9ICQodGhpcy5lbGVtZW50KVxuICAgLnNob3coKVxuICAgLmRldGFjaCgpO1xuXG4gIHRoaXMucGFuZWwgPSB0aGlzLnBhbmVsIHx8ICQoJzxkaXY+PC9kaXY+JylcbiAgIC5hZGRDbGFzcygncGFuZWwnKTtcblxuICBpZiAoIXRoaXMuaGVhZGVyKSB7XG4gICB0aGlzLmhlYWRlciA9ICQoJzxkaXY+PC9kaXY+JylcbiAgICAuYWRkQ2xhc3MoJ3BhbmVsLWhlYWRlcicpXG4gICAgLmFwcGVuZFRvKHRoaXMucGFuZWwpO1xuXG4gICAkKCc8c3Bhbj48L3NwYW4+JylcbiAgICAuYWRkQ2xhc3MoJ2ljb25fcmVtb3ZlJylcbiAgICAud3JhcCgnPGE+PC9hPicpXG4gICAgLnBhcmVudCgpXG4gICAgLmNzcygnZGlzcGxheScsICdibG9jaycpXG4gICAgLndyYXAoJzxkaXY+PC9kaXY+JylcbiAgICAucGFyZW50KClcbiAgICAuYWRkQ2xhc3MoJ3BhbmVsLWJ0bnMnKVxuICAgIC5hcHBlbmRUbyh0aGlzLmhlYWRlcik7XG5cbiAgICQoJzxoMz48L2gzPicpXG4gICAgLnRleHQodGhpcy5vcHRpb25zLnRpdGxlKVxuICAgIC5hcHBlbmRUbyh0aGlzLmhlYWRlcik7XG5cbiAgICQoJzxwPjwvcD4nKVxuICAgIC50ZXh0KHRoaXMub3B0aW9ucy5kZXNjcmlwdGlvbilcbiAgICAuYXBwZW5kVG8odGhpcy5oZWFkZXIpO1xuICB9XG5cbiAgaWYgKHRoaXMuZm9vdGVyKSB7XG4gICB0aGlzLmZvb3Rlci5kZXRhY2goKTtcbiAgfVxuICBlbHNlIHtcbiAgIHRoaXMuZm9vdGVyID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgIC5hZGRDbGFzcygncGFuZWwtZm9vdGVyJylcbiAgICAuY3NzKCd0ZXh0LWFsaWduJywgJ3JpZ2h0Jyk7XG5cbiAgIHRoaXMuYnRuQ29uZmlybSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPicpXG4gICAgLmFkZENsYXNzKCdyb2thZi1idG4gYnRuLWJsdWUnKVxuICAgIC50ZXh0KHRoaXMub3B0aW9ucy5idXR0b25zLnNhdmUpXG4gICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgIHZhciBpbnB1dHMgPSB7XG4gICAgICBuYW1lOiAkKCcjaW5wdXRfbmV3X2xheW91dF9uYW1lJywgc2VsZi5lbGVtZW50KVxuICAgICAgIC52YWwoKVxuICAgICB9XG4gICAgIHNlbGYuX3RyaWdnZXIoJ2NvbmZpcm0nLCBlLCBpbnB1dHMpO1xuICAgIH0pXG4gICAgLmFwcGVuZFRvKHRoaXMuZm9vdGVyKTtcblxuICAgdGhpcy5idG5DbG9zZSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPicpXG4gICAgLmFkZENsYXNzKCdyb2thZi1idG4nKVxuICAgIC50ZXh0KHRoaXMub3B0aW9ucy5idXR0b25zLmNsb3NlKVxuICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICBzZWxmLm1vZGFsLmhpZGUoKTtcbiAgICAgc2VsZi5fdHJpZ2dlcignY2xvc2UnKTtcbiAgICB9KVxuICAgIC5hcHBlbmRUbyh0aGlzLmZvb3Rlcik7XG4gIH1cblxuICB0aGlzLmJvZGllcyA9IHRoaXMuYm9kaWVzIHx8ICQodGhpcy5lbGVtZW50KTtcbiAgdGhpcy5ib2RpZXMuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgIHNlbGYucGFuZWwuYXBwZW5kKHRoaXMpO1xuICB9KTtcblxuICB0aGlzLnBhbmVsLmFwcGVuZCh0aGlzLmZvb3Rlcik7XG5cbiAgdGhpcy5tb2RhbCA9IHRoaXMubW9kZWwgfHwgdGhpcy5wYW5lbC53cmFwKCc8ZGl2PjwvZGl2PicpXG4gICAucGFyZW50KClcbiAgIC5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpXG4gICAud3JhcCgnPGRpdj48L2Rpdj4nKVxuICAgLnBhcmVudCgpXG4gICAuYWRkQ2xhc3MoJ21vZGFsLWRpYWxvZyBzbWFsbCcpXG4gICAud3JhcCgnPGRpdj48L2Rpdj4nKVxuICAgLnBhcmVudCgpXG4gICAuYWRkQ2xhc3MoJ21vZGFsJyk7XG5cbiAgJCgnYm9keScpLmFwcGVuZCh0aGlzLm1vZGFsKTtcbiAgdmFyIG1hcmdpblRvcCA9ICAodGhpcy5tb2RhbC5pbm5lckhlaWdodCgpIC0gdGhpcy5wYW5lbC5vdXRlckhlaWdodCgpKSAvIDI7XG4gIHRoaXMucGFuZWwuY3NzKHsnbWFyZ2luLXRvcCc6IG1hcmdpblRvcCArICdweCd9KTtcbiAgaWYgKHRoaXMub3B0aW9ucy5hdXRvU2hvdykge1xuICAgdGhpcy5tb2RhbC5zaG93KCk7XG4gIH1cbiB9LFxuIGNsb3NlOiBmdW5jdGlvbihlKXtcbiAgLy8gY29uc29sZS5sb2coJ21vZGFsIGNsb3NlZCBtYW51YWx5Li4uLiBmcm9tIG91dHNpZGUnKTtcbiAgdGhpcy5tb2RhbC5oaWRlKCk7XG4gIHRoaXMuX3RyaWdnZXIoJ2Nsb3NlJyk7XG4gfVxufSk7XG4vLyB9KTtcbiIsIi8vKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4vL2lmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbi8vZGVmaW5lKFsnanF1ZXJ5JywgJ2QzJywgJ2MzJ10sIGZhY3RvcnkpO1xuLy99XG4vL2Vsc2Uge1xuLy9mYWN0b3J5KGpRdWVyeSk7XG4vL31cbi8vfSkoZnVuY3Rpb24gKCQpIHtcblxudmFyIHNjb3BlID0gd2luZG93O1xudmFyIFRBQkxFX0NIQVJUX0lEWCA9IDA7XG4kLndpZGdldCgnaXVpLmNoYXJ0cGFyYW1ldGVybWFwJywge1xuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHNlbGYuZWxlbWVudC5lbXB0eSgpLmxvYWRUZW1wbGF0ZShzZWxmLm9wdGlvbnMudGVtcGxhdGUsIHt9ICwge1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRzZWxmLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuYmluZChcImNsaWNrXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkKFwiI3RhYjJcIikuY2xpY2soKTtcblx0XHRcdFx0XHQvLyQoXCIjbWFwX3RyZWVcIikuc2hvdygpO1xuXHRcdFx0XHRcdC8vJChcIiNncmlkX3RyZWVcIikuaGlkZSgpO1xuXHRcdFx0XHRcdHRyZWVUeXBlID0gXCJtYXBUcmVlXCI7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vc2VsZi5yZWZyZXNoKCk7XG5cdFx0c2VsZi5fdHJpZ2dlcignd2lsbG1vdW50JywgbnVsbCwgc2VsZik7XG5cblx0XHRpZiAoc2VsZi5vcHRpb25zLmludGVydmFsKSB7XG5cdFx0XHRpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lcik7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IFxuXHRcdFx0XHRzZWxmLnJlZnJlc2goKTtcblx0XHRcdH0sIHNlbGYub3B0aW9ucy5pbnRlcnZhbCk7XG5cdFx0fVxuXHR9LFxuXHRfcGFyc2VDb2x1bW5zOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGNvbHVtbnMgPSB7fTtcblx0XHQkLmVhY2godGhpcy5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChpKSB7XG5cdFx0XHR2YXIga2V5ID0gdGhpc1swXTtcblx0XHRcdGNvbHVtbnNba2V5XSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDEsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRjb2x1bW5zW2tleV0ucHVzaCh0aGlzW2ldKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR0cnl7XG5cdFx0XHRyZXR1cm4gY29sdW1ucztcblx0XHR9ZmluYWxseXtcblx0XHRcdGNvbHVtbnMgPSBudWxsO1xuXHRcdH1cblx0fSxcblxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdC8vIGlmIChrZXkgPT09IFwicGFyYW1zXCIpIHtcblx0XHQvLyB9XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cblx0XHR0aGlzLnJlZnJlc2goKTtcblx0fSxcblxuXHQvLyBfc2V0T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0Ly8gIHRoaXMuX3N1cGVyKG9wdGlvbnMpO1xuXHQvLyAgdGhpcy5yZWZyZXNoKCk7XG5cdC8vIH0sXG5cdHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyB8fCB7fTtcblx0XHRcblx0XHQkKHRoaXMuZWxlbWVudClcblx0XHQuZmxvd3R5cGUoe1xuXHRcdFx0bWluRm9udDogMTIsXG5cdFx0XHRtYXhGb250OiA0MCxcblx0XHRcdGZvbnRSYXRpbzogNDBcblx0XHR9KTtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYubG9hZCgpO1xuXHRcdGRhc2hib2FyZFdpZGdldElkeCsrO1xuXHRcdGlmKGl1aS5kYXNoYm9hcmQud2lkZ2V0cy5sZW5ndGggPD0gZGFzaGJvYXJkV2lkZ2V0SWR4KXtcblx0XHRcdGxvYWRpbmdFbmQoKTtcblx0XHR9XG5cdFx0cGFyYW1zID0gbnVsbDtcblx0XHRhamF4RGF0YSA9IG51bGw7XG5cblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsdXBkYXRlJywgbnVsbCwgdGhpcyk7XG5cdH0sXG5cblx0X2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDrjbDsnbTthLAg7LaU6rCAXG5cdCAqL1xuXHRsb2FkOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXMgfHwge307XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XG5cdFx0c2VsZi5lbGVtZW50LmVtcHR5KCkubG9hZFRlbXBsYXRlKHNlbGYub3B0aW9ucy50ZW1wbGF0ZSwge30sIHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHRlbXAgPSBcIjxkaXYgaWQ9J21haW5Db250ZW50JyBjbGFzcz0naGlkZGVuJyBzdHlsZT0nd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsnPjwvZGl2PlwiO1xuXHRcdFx0XHRzZWxmLmVsZW1lbnQuYXBwZW5kKHRlbXApO1xuXG5cdFx0XHRcdFxuXHRcdFx0XHRzZXRHcmlkQ29sdW1ucygpO1xuXHRcdFx0XHRfaW5pdGlhbGl6ZSgpO1xuXHRcdFx0XHRnZXRTdGFydEVuZFRpbWUoKTtcblxuXG5cdFx0XHRcdC8vIGRhc2hib2FyZCB0YWJsZSDsl5AgaGVpZ2h0IOydhCDso7zquLDsnITtlbQg7KeA64+E66eMIOuUsOuhnCAxMDAlIOuEo+yWtOykjCBcblx0XHRcdFx0JChcIiNtYWluQ29udGVudFwiKS5wYXJlbnQoKS5wYXJlbnQoKS5oZWlnaHQoXCIxMDAlXCIpO1xuXHRcdFx0XHRtYXAyLnJlc2l6ZSgpO1xuXG5cblx0XHRcdH0sXG5cdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRzZWxmID0gbnVsbDtcblx0fSxcblxuXHQvKipcblx0ICog642w7J207YSwIOyCreygnFxuXHQgKi9cblx0dW5sb2FkOiBmdW5jdGlvbiAoKSB7fSxcblxuXHQvKipcblx0ICog7YGs6riwIOuzgOqyvVxuXHQgKi9cblx0cmVzaXplOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cblx0XHRtYXAyLnJlc2l6ZSgpO1xuXHRcdC8vZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihzZWxmLm1hcCwgXCJyZXNpemVcIik7XG5cblxuXHRcdFxuXHRcdC8vIHZhciB3ID0gTWF0aC5tYXgocGFyc2VJbnQodGhpcy5lbGVtZW50LnBhcmVudCgpLmlubmVyV2lkdGgoKSwgMTApLCB0aGlzLm9wdGlvbnMubWluV2lkdGgpO1xuXHRcdHZhciBhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiBcblx0XHRpZiAoIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmIG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKCdUcmlkZW50JykgIT0gLTEpIHx8IChhZ2VudC5pbmRleE9mKFwibXNpZVwiKSAhPSAtMSkgKSB7XG5cdFx0XHRpZih0aGlzLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5pdGVtLWhlYWRlclwiKS5sZW5ndGggPiAwKXtcblx0XHRcdFx0dmFyIGggPSB0aGlzLmVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuaW5uZXJIZWlnaHQoKSAtIDgwO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuaGVpZ2h0KGgpO1xuXHRcdFx0fVxuXHRcdH1cbi8qXG5cdFx0dmFyIHcgPSB0aGlzLmVsZW1lbnQucGFyZW50KCkucGFyZW50KClcblx0XHRcdFx0LmlubmVyV2lkdGgoKS0xMDtcblx0XHR2YXIgaCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKVxuXHRcdFx0XHQuaW5uZXJIZWlnaHQoKS00MDtcblxuXHRcdHRoaXMuY2hhcnQuc2V0U2l6ZSh3LCBoKTtcbiovXG5cdH1cblxufSk7XG4vL30pO1xuIiwiLy8oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbi8vaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuLy9kZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4vL31cbi8vZWxzZSB7XG4vL2ZhY3RvcnkoalF1ZXJ5KTtcbi8vfVxuLy99KShmdW5jdGlvbiAoJCkge1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQobykge1xuXHRyZXR1cm4gKFxuXHRcdFx0dHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogLy9ET00yXG5cdFx0XHRcdG8gJiYgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiYgbyAhPT0gbnVsbCAmJiBvLm5vZGVUeXBlID09PSAxICYmIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiXG5cdCk7XG59XG5cbnZhciBEQVNIQk9BUkRfV0lER0VUX0lEID0gMDtcbnZhciBEQVNIQk9BUkRfSVRFTV9JRCA9IDA7XG5cbiQud2lkZ2V0KCdpdWkuZGFzaGJvYXJkd2lkZ2V0Jywge1xuXHRvcHRpb25zOiB7XG5cdFx0YWN0aXZldGFiOiAwLFxuXHRcdGlkOiAnaXVpX3dpZGdldF8nLFxuXHRcdGl0ZW1zOiBbe1xuXHRcdFx0aWQ6ICdpdWlfZGFzaGJvYXJkX3dpZGdldF9pdGVtXycsXG5cdFx0XHRsYWJlbDogJ0lVSSBEQVNIQk9BUkQgV0lER0VUIExBQkVMJyxcblx0XHRcdHR5cGU6ICdiYXJjaGFydCcsXG5cdFx0XHRkYXRhOiAnZGF0YS9mYWtlLWRhdGEuanNvbidcblx0XHR9XVxuXHR9LFxuXG5cblx0X2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMub3B0aW9ucy5pZCA9ICdpdWlfd2lkZ2V0XycgKyBEQVNIQk9BUkRfV0lER0VUX0lEKys7XG5cdFx0dmFyIGNvbnRhaW5lciA9ICQoJzxkaXY+PC9kaXY+Jylcblx0XHQuYWRkQ2xhc3MoJ2dyaWQtc3RhY2staXRlbS1jb250ZW50IGdyYXktc2Nyb2xsJyk7XG5cdFx0dmFyIHdpZGdldCA9ICQoJzxkaXY+PC9kaXY+Jylcblx0XHQuYWRkQ2xhc3MoJ3dpZGdldC1wYW5lbCcpO1xuXHRcdGNvbnRhaW5lci5hcHBlbmQod2lkZ2V0KVxuXHRcdC5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpIFxuXHRcdC5wYXJlbnQoKVxuXHRcdC5hcHBlbmQodGhpcy5fY29udHJvbHMoKSk7XG5cdFx0Ly8gdGhpcy5lbGVtZW50LmFwcGVuZCh3aWRnZXQpOyBcblx0XHR0aGlzLnVpID0gd2lkZ2V0O1xuXHRcdHRoaXMucmVmcmVzaCgpO1xuXG5cdFx0Ly8gb3B0aW9uc+yXkCDrr7jrpqwg65Ox66Gd65CY64qUIOydtOuypO2KuCDtlbjrk6Trn6xcblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsbW91bnQnLCBudWxsLCB0aGlzLmVsZW1lbnQpO1xuXHR9LFxuXG5cblx0X3NldE9wdGlvbjogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRpZiAoa2V5ID09PSBcImFjdGl2ZXRhYlwiKSB7XG5cdFx0XHRpZiAoaXNFbGVtZW50KHZhbHVlKSkge1xuXHRcdFx0XHR0aGlzLl9zZWxlY3RUYXAodmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgbGlzID0gJCgnLnJva2FmLW5hdi10YWIgPiBsaScsIHRoaXMuZWxlbWVudCk7XG5cdFx0XHRcdFx0dmFsdWUgPSBsaXMuZ2V0KHZhbHVlKTtcblx0XHRcdFx0XHR0aGlzLl9zZWxlY3RUYXAodmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuX3N1cGVyKGtleSwgdmFsdWUpO1xuXHR9LFxuXG5cblx0Ly8gX3NldE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdC8vICB0aGlzLl9zdXBlcihvcHRpb25zKTtcblx0Ly8gIHRoaXMucmVmcmVzaCgpO1xuXHQvLyB9LFxuXG5cblx0aXRlbXM6IGZ1bmN0aW9uIChpdGVtcykge1xuXHRcdGlmIChpdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLml0ZW1zO1xuXHRcdH1cblx0XHQvLyBUT0RPIO2VhOyImCDsobDqsbTsnbQg66eM7KGx7ZWY64qUIOqyg+unjCDrpqzsiqTtirjsl5Ag7LaU6rCAXG5cdFx0dGhpcy5vcHRpb25zLml0ZW1zID0gaXRlbXM7XG5cdFx0dGhpcy5yZWZyZXNoKCk7XG5cdH0sXG5cblxuXHRyZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHdpZGdldCA9IHRoaXMudWk7XG5cdFx0dmFyIGhlYWRlciA9IHdpZGdldC5maW5kKCcud2lkZ2V0LWhlYWRlcicpO1xuXHRcdGlmIChoZWFkZXIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRoZWFkZXIgPSAkKCc8ZGl2PjwvZGl2PicpXG5cdFx0XHQuYWRkQ2xhc3MoJ3dpZGdldC1oZWFkZXIgdWktZHJhZ2dhYmxlLWhhbmRsZScpO1xuXHRcdH1cblx0XHR2YXIgYm9keSA9IHdpZGdldC5maW5kKCcud2lkZ2V0LWJvZHknKTtcblx0XHRpZiAoYm9keS5sZW5ndGggPT09IDApIHtcblx0XHRcdFxuXHRcdFx0aWYodGhpcy5vcHRpb25zLnR5cGUgPT09IFwiZ3JvdXBcIil7XG5cdFx0XHRcdGJvZHkgPSAkKCc8ZGl2PjwvZGl2PicpXG5cdFx0XHRcdC5hZGRDbGFzcygnd2lkZ2V0LWJvZHkgZ3JvdXAnKVxuXHRcdFx0Lypcblx0XHRcdH1lbHNlIGlmKHRoaXMub3B0aW9ucy5pdGVtc1swXS50ZW1wbGF0ZS5pbmRleE9mKCdkZXZpY2VfbGlzdCcpID4gLTEpe1xuXHRcdFx0XHRib2R5ID0gJCgnPGRpdj48L2Rpdj4nKVxuXHRcdFx0XHQuYWRkQ2xhc3MoJ3dpZGdldC1ib2R5IGRldmljZS1saXN0Jylcblx0XHRcdCovXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ym9keSA9ICQoJzxkaXY+PC9kaXY+Jylcblx0XHRcdFx0LmFkZENsYXNzKCd3aWRnZXQtYm9keScpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETyDrs4Dqsr3snbQg7ZWE7JqU7ZWcIO2DreunjOydhCDrs4Dqsr3tlaAg7IiYIOyeiOuKlCDrsKnrspXsnYQg7LC+7JWE6528LlxuXHRcdGhlYWRlci5lbXB0eSgpO1xuXHRcdGJvZHkuZW1wdHkoKTtcblx0XHRoZWFkZXIuYXBwZW5kKHRoaXMuX2hlYWRlcigpKTtcblx0XHRib2R5LmFwcGVuZCh0aGlzLl9ib2R5KCkpO1xuXHRcdHdpZGdldC5hcHBlbmQoaGVhZGVyKVxuXHRcdC5hcHBlbmQoYm9keSk7XG5cblx0XHR0aGlzLl9yZXNpemVDaGFydCh0aGlzLmVsZW1lbnQpO1xuXG5cdFx0Ly8g7JyE6rKfIOyDneyEsShfY3JlYXRlKSDsnbTtm4Tsl5AgYmluZOuQmOyWtCDsl4XrjbDsnbTtirgg7Iuc7JeQ66eMIOuPmeyeke2VnOuLpC5cblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsdXBkYXRlJywgbnVsbCwgdGhpcy5lbGVtZW50KTtcblx0XHRib2R5ID0gaGVhZGVyID0gd2lkZ2V0ID0gbnVsbDtcblx0fSxcblxuXHRfcmVzaXplQ2hhcnQ6IGZ1bmN0aW9uICh3aWRnZXQpIHtcblx0XHQkKCcuaXVpLWRhc2hib2FyZC1jaGFydCcsIHdpZGdldClcblx0XHQuZWFjaChmdW5jdGlvbiAoaSwgY2hhcnQpIHtcblx0XHRcdGNoYXJ0ID0gJChjaGFydCk7XG5cdFx0XHR2YXIgbmFtZSA9ICdjaGFydCcgKyBjaGFydC5kYXRhKCdjaGFydCcpO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coY2hhcnRbbmFtZV0pO1xuXHRcdFx0aWYgKGNoYXJ0W25hbWVdKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0KGNoYXJ0W25hbWVdKSgncmVzaXplJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGUpIHt9XG5cdFx0XHRcdGZpbmFsbHl7XG5cdFx0XHRcdFx0bmFtZSA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRfc2VsZWN0VGFwOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRpZih0aGlzLm9wdGlvbnMudHlwZSA9PSBudWxsIHx8IHRoaXMub3B0aW9ucy50eXBlID09IFwidGFiXCIpe1xuXHRcdFx0dmFsdWUgPSAkKHZhbHVlKTtcblx0XHRcdHZhciBpdGVtID0gdmFsdWUuZGF0YSgnX3dpZGdldF9pdGVtJyk7XG5cdFx0XHR2YWx1ZS5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKClcblx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHR2YWx1ZS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKCcudGFiLXBhbmVsLmFjdGl2ZScsIHRoaXMuZWxlbWVudClcblx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRcdHZhciBjID0gJCgnIycgKyB0aGlzLm9wdGlvbnMuaWQgKyAnXycgKyBpdGVtLmlkLCB0aGlzLmVsZW1lbnQpXG5cdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0dGhpcy5fcmVzaXplQ2hhcnQoYyk7XG5cdFx0XHRpdGVtID0gYyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cblx0X2hlYWRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgdGFicyA9ICQoJzxoMz4nK3RoaXMub3B0aW9ucy5sYWJlbCsnPHNtYWxsIGNsYXNzPVwiaGVhZGVyU21hbGxcIj48L3NtYWxsPjwvaDM+Jyk7XG5cblx0XHR0cnl7XG5cdFx0XHRyZXR1cm4gdGFicztcblx0XHR9ZmluYWxseXtcblx0XHRcdHRhYnMgPSBzZWxmID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblxuXHRfYm9keTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgdGFicyA9IFtdO1xuXG5cdFx0aWYodGhpcy5vcHRpb25zLnR5cGUgIT0gbnVsbCAmJiB0aGlzLm9wdGlvbnMudHlwZSA9PSBcImdyb3VwXCIpe1xuXHRcdFx0JC5lYWNoKHRoaXMub3B0aW9ucy5pdGVtcywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgY29udGFpbmVyID0gJCh0aGlzLmVsKTtcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnJvdGF0ZSA9PSBudWxsIHx8IHNlbGYub3B0aW9ucy5yb3RhdGUgPT09IFwiaG9yaXpvblwiKXtcblx0XHRcdFx0XHRpZiAoIWNvbnRhaW5lci5oYXNDbGFzcygnd2lkZ2V0LWxpc3QnKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbCA9IGNvbnRhaW5lciA9ICQoJzx1bD48L3VsPicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoc2VsZi5vcHRpb25zLnJvdGF0ZSA9PT0gXCJ2ZXJ0aWNhbFwiKXtcblx0XHRcdFx0XHR0aGlzLmVsID0gY29udGFpbmVyID0gJCgnPHVsIGhlaWdodD1cIicrdGhpcy5oZWlnaHQrJ1wiPjwvdWw+Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGFicy5wdXNoKGNvbnRhaW5lcik7XG5cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnJvdGF0ZSA9PSBudWxsIHx8IHNlbGYub3B0aW9ucy5yb3RhdGUgPT09IFwiaG9yaXpvblwiKXtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZWFjaCh0aGlzLm9wdGlvbnMuaXRlbXMsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGNvbnRhaW5lciA9ICQodGhpcy5lbCk7XG5cdFx0XHRcdGlmICghY29udGFpbmVyLmhhc0NsYXNzKCd3aWRnZXQtbGlzdCcpKSB7XG5cdFx0XHRcdFx0dGhpcy5lbCA9IGNvbnRhaW5lciA9ICQoJzxkaXYgaWQ9XCInICsgc2VsZi5vcHRpb25zLmlkICsgJ18nICsgdGhpcy5pZCArICdcIj48L2Rpdj4nKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnd2lkZ2V0LWxpc3QgbGlzdC1zdHlsZTMnKTtcblx0XHRcdFx0XHQvLyAuY3NzKCdwYWRkaW5nLXRvcCcsIDQwKydweCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRhYnMucHVzaChjb250YWluZXIpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKHRhYnNbdGhpcy5vcHRpb25zLmFjdGl2ZXRhYl0pO1xuXHRcdH1cblx0XHR0cnl7XG5cdFx0XHRyZXR1cm4gdGFicztcblx0XHR9ZmluYWxseXtcblx0XHRcdHRhYnMgPSBbXTtcblx0XHRcdHRhYnMgPSBzZWxmID0gbnVsbDtcblx0XHR9XG5cdH0sXG5cblxuXHRfY29udHJvbHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIGNvbnRyb2xzID0gW107XG5cblx0XHR2YXIgYnRuQ2xvc2UgPSAkKCc8ZGl2IGNsYXNzPVwidWktcmVzaXphYmxlLWhhbmRsZSB3aWRnZXQtYnRuIGNsb3NlIGl1aS1idG4tY2xvc2VcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2E+PC9kaXY+Jyk7XG5cdFx0YnRuQ2xvc2UuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRcdHNlbGYuX3RyaWdnZXIoJ2Nsb3NlJywgbnVsbCwgdGhpcylcblx0XHR9KTtcblxuXHRcdHZhciBidG5NaW5NYXggPSAkKCc8ZGl2IGNsYXNzPVwidWktcmVzaXphYmxlLWhhbmRsZSB3aWRnZXQtYnRuIHdpZGdldC1zaXplIGl1aS1idG4tdG9nZ2xlLW1pbm1heFwiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJmYSBmYS1leHBhbmRcIj48L2E+PC9kaXY+Jyk7XG5cdFx0YnRuTWluTWF4LmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRzZWxmLl90cmlnZ2VyKCd0b2dnbGVzaXplJywgbnVsbCwgdGhpcylcblx0XHR9KTtcblxuXHRcdHZhciBidG5Mb2NrID0gJCgnPGRpdiBjbGFzcz1cInVpLXJlc2l6YWJsZS1oYW5kbGUgd2lkZ2V0LWJ0biBsb2NrIGl1aS1idG4tdG9nZ2xlLWxvY2tcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiZmEgZmEtbG9ja1wiPjwvYT48L2Rpdj4nKTtcblx0XHRidG5Mb2NrLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRzZWxmLl90cmlnZ2VyKCd0b2dnbGVsb2NrJywgbnVsbCwgdGhpcylcblx0XHR9KTtcblx0XHRcblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5kZXhPZignZGFzaGJvYXJkL2Rhc2hib2FyZC9vcGVuRGFzaGJvYXJkJykgPiAwKXtcblx0XHRcdGNvbnRyb2xzLnB1c2goYnRuQ2xvc2UpO1xuXHRcdFx0Ly9jb250cm9scy5wdXNoKGJ0bkxvY2spO1xuXHRcdH1cblxuXHRcdGNvbnRyb2xzLnB1c2goYnRuTWluTWF4KTtcblxuXHRcdHRyeXtcblx0XHRcdHJldHVybiBjb250cm9scztcblx0XHR9ZmluYWxseXtcblx0XHRcdGNvbnRyb2xzID0gW107XG5cdFx0XHRjb250cm9scyA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cblx0X2NvbnN0cmFpbkl0ZW1zOiBmdW5jdGlvbiAoaXRlbXMpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0cmV0dXJuICQubWFwKGl0ZW1zLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgaWR4ID0gREFTSEJPQVJEX0lURU1fSUQrKztcblx0XHRcdHRoaXMuaWQgPSB0aGlzLmlkIHx8ICdpdGVtXycgKyBpZHg7XG5cdFx0XHR0aGlzLmxhYmVsID0gdGhpcy5sYWJlbCB8fCAnSXRlbSAnICsgaWR4O1xuXHRcdFx0dGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IFtdO1xuXHRcdFx0dGhpcy50eXBlID0gdGhpcy50eXBlIHx8ICd0YWJsZSc7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9KTtcblx0fVxufSk7XG4vL30pO1xuIiwidmFyIHNjb3BlID0gd2luZG93O1xudmFyIEJBUl9DSEFSVF9JRFggPSAwO1xudmFyIHRvcG9sb2d5VGltZXI7XG52YXIgdG9wb2xvZ3lCcnVzaFRpbWVyO1xudmFyIGVkaXROb2RlO1xuXG4kLndpZGdldCgnaXVpLmNoYXJ0dG9wb2xvZ3knLCB7XG5cdG9wdGlvbnM6IHt9LFxuXHRfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gdGhpcy5lbGVtZW50LmFwcGVuZCgnPGRpdj5Ub3BvbG9neTwvZGl2PicpO1xuXHRcdHZhciBjaGFydHRvcG9sb2d5O1xuXHRcdHZhciBiZyA9IFwiXCI7XG5cdFx0dmFyIGljb25MaXN0ID0gW107XG5cdFx0dmFyIG5vZGVEYXRhID0gW107XG5cdFx0dmFyIGVkZ2VEYXRhID0gW107XG5cdFx0dGhpcy5jaGFydCA9IGNoYXJ0dG9wb2xvZ3k7XG5cdFx0dmFyIHRvcG9sb2d5SWQgPSB0aGlzLmVsZW1lbnQuYXR0cihcImlkXCIpO1xuXHRcdHRoaXMuZWxlbWVudC53aWR0aCgxNzcxKTtcblx0XHR0aGlzLmVsZW1lbnQuaGVpZ2h0KDE2NzIpO1xuXHRcdHZhciBfc2VsZiA9IHRoaXM7XG5cdFx0X3NlbGYuYWN0aXZlTm9kZSA9IG51bGw7XG5cdFx0X3NlbGYubm9kZUlkID0gXCJBTExcIjtcblx0XHRfc2VsZi5iZWZvcmVOb2RlSWQgPSBcIlwiO1xuXHRcdF9zZWxmLmZpcnN0ID0gdHJ1ZTtcblx0XHRfc2VsZi5lZGl0TW9kZSA9IGZhbHNlO1xuXG5cdFx0anVpLnJlYWR5KFsgXCJ1aS5kcm9wZG93blwiIF0sIGZ1bmN0aW9uKGRyb3Bkb3duKSB7XG5cdFx0XHRybWVudSA9IGRyb3Bkb3duKFwiI2RkXzJcIiwge1xuXHRcdFx0XHRldmVudDoge1xuXHRcdFx0XHRcdGNoYW5nZTogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YS52YWx1ZSArIFwiLCBcIiArIGRhdGEudGV4dCk7XG5cdFx0XHRcdFx0XHRpZihkYXRhLnZhbHVlID09IFwiYWxsXCIpe1xuXHRcdFx0XHRcdFx0XHRfc2VsZi5ub2RlSWQgPSBcIkFMTFwiO1x0XHRcdFxuXHRcdFx0XHRcdFx0XHRfc2VsZi5maXJzdCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdF9zZWxmLnJlZnJlc2goKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0anVpLnJlYWR5KFtcImNoYXJ0LmJ1aWxkZXJcIiwgXCJ1dGlsLmJhc2VcIl0sIGZ1bmN0aW9uIChidWlsZGVyLCBfKSB7XG5cdFx0XHR0b3BvbG9neV9jb250ZW50ID0gYnVpbGRlcigkKF9zZWxmLmVsZW1lbnQpLCB7XG5cdFx0XHRcdHN2Z2JnOiBiZywgLy/rsLHqt7jrnbzsmrTrk5wg7J2066+47KeAXG5cdFx0XHRcdHBhZGRpbmc6IDUsXG5cdFx0XHRcdGF4aXM6IHtcblx0XHRcdFx0XHRjOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInRvcG9sb2d5dGFibGVcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGF0YTogbm9kZURhdGEsIC8v64W465OcIGRhdGFcblx0XHRcdFx0XHRkYXRhMjogZWRnZURhdGEgLy/tmozshKAgZGF0YVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRicnVzaDoge1xuXHRcdFx0XHRcdHR5cGU6IFwidG9wb2xvZ3lub2RlXCIsXG5cdFx0XHRcdFx0aXNFZGl0OiBmYWxzZSxcblx0XHRcdFx0XHRub2RlSW1hZ2U6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgZXF1aXBtZW50SnNvbkRhdGEgPSBudWxsO1xuXHRcdFx0XHRcdFx0aWYoZGF0YS50eXBlSWQgPT0gbnVsbCB8fCBkYXRhLnR5cGVJZCA9PSBcIlwiKXtcblx0XHRcdFx0XHRcdFx0c3dpdGNoKGRhdGEuZmFybVR5cGUpe1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJIT1VTRV9UWVBFMVwiIDpcblx0XHRcdFx0XHRcdFx0XHRcdGVxdWlwbWVudEpzb25EYXRhID0ge2ltYWdlUGF0aCA6IFwiL2ltYWdlcy9pY29uL1wiK2RhdGEuZmFybVR5cGUrXCIucG5nXCIsIGltYWdlV2lkdGggOiA3MiwgaW1hZ2VIZWlnaHQgOiA0Mn07XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJIT1VTRV9UWVBFMlwiIDpcblx0XHRcdFx0XHRcdFx0XHRcdGVxdWlwbWVudEpzb25EYXRhID0ge2ltYWdlUGF0aCA6IFwiL2ltYWdlcy9pY29uL1wiK2RhdGEuZmFybVR5cGUrXCIucG5nXCIsIGltYWdlV2lkdGggOiA2OCwgaW1hZ2VIZWlnaHQgOiA0OH07XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJIT1VTRV9UWVBFM1wiIDpcblx0XHRcdFx0XHRcdFx0XHRcdGVxdWlwbWVudEpzb25EYXRhID0ge2ltYWdlUGF0aCA6IFwiL2ltYWdlcy9pY29uL1wiK2RhdGEuZmFybVR5cGUrXCIucG5nXCIsIGltYWdlV2lkdGggOiAxNzIsIGltYWdlSGVpZ2h0IDogNDh9O1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSE9VU0VfVFlQRTRcIiA6XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9cIitkYXRhLmZhcm1UeXBlK1wiLnBuZ1wiLCBpbWFnZVdpZHRoIDogNjgsIGltYWdlSGVpZ2h0IDogNTB9O1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSE9VU0VfVFlQRTVcIiA6XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9cIitkYXRhLmZhcm1UeXBlK1wiLnBuZ1wiLCBpbWFnZVdpZHRoIDogNjgsIGltYWdlSGVpZ2h0IDogNTB9O1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSE9VU0VfVFlQRTZcIiA6XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9cIitkYXRhLmZhcm1UeXBlK1wiLnBuZ1wiLCBpbWFnZVdpZHRoIDogNjgsIGltYWdlSGVpZ2h0IDogNTB9O1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSE9VU0VfVFlQRTdcIiA6XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9cIitkYXRhLmZhcm1UeXBlK1wiLnBuZ1wiLCBpbWFnZVdpZHRoIDogNzAsIGltYWdlSGVpZ2h0IDogNDh9O1x0XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSE9VU0VfVFlQRThcIiA6XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9cIitkYXRhLmZhcm1UeXBlK1wiLnBuZ1wiLCBpbWFnZVdpZHRoIDogMTcyLCBpbWFnZUhlaWdodCA6IDUwfTtcdFxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIkhPVVNFX1RZUEU5XCIgOlxuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1aXBtZW50SnNvbkRhdGEgPSB7aW1hZ2VQYXRoIDogXCIvaW1hZ2VzL2ljb24vXCIrZGF0YS5mYXJtVHlwZStcIi5wbmdcIiwgaW1hZ2VXaWR0aCA6IDE3MiwgaW1hZ2VIZWlnaHQgOiA1MH07XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGRlZmF1bHQgOlxuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1aXBtZW50SnNvbkRhdGEgPSB7aW1hZ2VQYXRoIDogXCIvaW1hZ2VzL2ljb24vSE9VU0VfVFlQRTEucG5nXCIsIGltYWdlV2lkdGggOiA3MiwgaW1hZ2VIZWlnaHQgOiA0Mn07XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHQkLmVhY2goaWNvbkxpc3QsZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLnR5cGVJZCA9PSBkYXRhLnR5cGVJZCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiB0aGlzLmltYWdlRmlsZVBhdGgsIGltYWdlV2lkdGggOiB0aGlzLmltYWdlV2lkdGgsIGltYWdlSGVpZ2h0IDogdGhpcy5pbWFnZUhlaWdodH07XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRpZihlcXVpcG1lbnRKc29uRGF0YSA9PSBudWxsKXtcblx0XHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IHtpbWFnZVBhdGggOiBcIi9pbWFnZXMvaWNvbi9kZWZhdWx0LnBuZ1wiLCBpbWFnZVdpZHRoIDogNjAsIGltYWdlSGVpZ2h0IDogNTR9O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0cnl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBlcXVpcG1lbnRKc29uRGF0YTtcblx0XHRcdFx0XHRcdH1maW5hbGx5e1xuXHRcdFx0XHRcdFx0XHRlcXVpcG1lbnRKc29uRGF0YSA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRub2RlRGF0YTogbm9kZURhdGEsXG5cdFx0XHRcdFx0ZWRnZURhdGE6IGVkZ2VEYXRhLFxuXHRcdFx0XHRcdGVkZ2VUZXh0OiBmdW5jdGlvbiAoZGF0YSwgYWxpZ24pIHtcblx0XHRcdFx0XHRcdHZhciB0ZXh0ID0gZGF0YS5pZDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRleHQ7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0b29sdGlwVGl0bGU6IGZ1bmN0aW9uIChkYXRhLCBhbGlnbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEubmFtZTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRvb2x0aXBUZXh0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIHRvb2x0aXAgPSBcIlwiO1xuXHRcdFx0XHRcdFx0dG9vbHRpcCA9IGRhdGEubmFtZTtcblx0XHRcdFx0XHRcdHJldHVybiB0b29sdGlwO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bm9kZVRpdGxlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEudGl0bGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR3aWRnZXQ6IFtcblx0XHRcdFx0ICAgICAgICAge1xuXHRcdFx0XHQgICAgICAgIFx0IHR5cGU6IFwidG9wb2xvZ3ljdHJsXCIsXG5cdFx0XHRcdCAgICAgICAgXHQgem9vbTogdHJ1ZSxcblx0XHRcdFx0ICAgICAgICBcdCBtb3ZlOiB0cnVlXG5cdFx0XHRcdCAgICAgICAgIH1cblx0XHRcdFx0ICAgICAgICAgXSxcblx0XHRcdFx0ICAgICAgICAgc3R5bGU6IHtcblx0XHRcdFx0ICAgICAgICBcdCB0b3BvbG9neU5vZGVSYWRpdXM6IDIwIC8v64W465OcIOuwmOyngOumhCDtgazquLBcblx0XHRcdFx0ICAgICAgICAgfSxcblx0XHRcdFx0ICAgICAgICAgZXZlbnQ6IHtcblx0XHRcdFx0ICAgICAgICBcdCBtb3VzZW92ZXI6IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKFwib3ZlclwiKTtcblx0XHRcdFx0ICAgICAgICBcdCB9LFxuXHRcdFx0XHQgICAgICAgIFx0IFwidG9wb2xvZ3kub25tb3VzZW1ldmVlbmRcIjogZnVuY3Rpb24gKGRhdGEsIGUpIHtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKFwibGluZWRibGNsaWNrIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICAgXCIgKyBkYXRhKTtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0XHQgICAgICAgIFx0IH0sXG5cdFx0XHRcdCAgICAgICAgXHQgXCJ0b3BvbG9neS5saW5lZGJsY2xpY2tcIjogZnVuY3Rpb24gKGRhdGEsIGUpIHtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKFwibGluZWRibGNsaWNrIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0XHQgICAgICAgIFx0IH0sXG5cdFx0XHRcdCAgICAgICAgXHQgXCJ0b3BvbG9neS5ub2RlZGJsY2xpY2tcIjogZnVuY3Rpb24gKGRhdGEsIGUpIHtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKFwibm9kZWRibGNsaWNrIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0XHQgICAgICAgIFx0XHQgaWYodXNlclR5cGUgPT0gXCJBRE1JTlwiKXtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgLy9sb2FkaW5nU3RhcnQoKTtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgX3NlbGYuY3VycmVudE5vZGUgPSBkYXRhO1xuXHRcdFx0XHQgICAgICAgIFx0XHRcdCBfc2VsZi5hY3RpdmVOb2RlID0gbnVsbDtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgaWYoZGF0YS50eXBlSWQgPT0gXCJcIil7XG5cdFx0XHRcdCAgICAgICAgXHRcdFx0XHQgX3NlbGYubm9kZUlkID0gZGF0YS5pZDtcblx0XHRcdFx0ICAgICAgICBcdFx0XHRcdCBfc2VsZi5maXJzdCA9IHRydWU7XG5cdFx0XHRcdCAgICAgICAgXHRcdFx0XHQgX3NlbGYucmVmcmVzaCgpO1xuXHRcdFx0XHQgICAgICAgIFx0XHRcdCB9XG5cdFx0XHRcdCAgICAgICAgXHRcdCB9XG5cdFx0XHRcdCAgICAgICAgXHQgfSxcblx0XHRcdFx0ICAgICAgICBcdCBcInRvcG9sb2d5Lm5vZGVjbGlja1wiOiBmdW5jdGlvbiAoZGF0YSwgZSkge1xuXHRcdFx0XHQgICAgICAgIFx0XHQgY29uc29sZS5sb2coXCJub2RlY2xpY2sgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXHRcdFx0XHQgICAgICAgIFx0XHQgY29uc29sZS5sb2coZGF0YSk7XG5cdFx0XHRcdCAgICAgICAgXHRcdCBpZighX3NlbGYuZWRpdE1vZGUpe1xuXHRcdFx0XHQgICAgICAgIFx0XHRcdCBfc2VsZi5hY3RpdmVOb2RlID0gZGF0YTtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgLy9sb2FkaW5nU3RhcnQoKTtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgaWYoZGF0YS50eXBlSWQgPT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCBmYXJtTm8gPSBkYXRhLmlkLnJlcGxhY2UoXCJmYXJtXCIsXCJcIik7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0IGZhcm1DaGFuZ2UoKTtcblx0XHRcdFx0ICAgICAgICBcdFx0XHQgfVxuXHRcdFx0XHQgICAgICAgIFx0XHQgfVxuXHRcdFx0XHQgICAgICAgIFx0IH0sXG5cdFx0XHRcdCAgICAgICAgXHQgXCJ0b3BvbG9neS5lZGdlY29ubmVjdFwiOiBmdW5jdGlvbiAoZGF0YSwgZSkge1xuXHRcdFx0XHQgICAgICAgIFx0IH0sXG5cdFx0XHRcdCAgICAgICAgXHQgXCJ0b3BvbG9neS5yY2xpY2tcIjogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0ICAgICAgICBcdFx0IGNvbnNvbGUubG9nKFwicmNsaWNrIFwiICsgZS5wYWdlWCArIFwiIFwiICsgZS5wYWdlWSk7XG5cdFx0XHRcdFx0XHRcdFx0IHJtZW51Lm1vdmUoZS5wYWdlWCwgZS5wYWdlWSk7XG5cdFx0XHRcdFx0XHRcdFx0IHJtZW51LnNob3coKTtcblx0XHRcdFx0ICAgICAgICBcdCB9LFxuXHRcdFx0XHQgICAgICAgIFx0IFwidG9wb2xvZ3kubm9kZWNsZWFyXCI6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdCAgICAgICAgXHRcdCAvL19zZWxmLmFjdGl2ZU5vZGUgPSBudWxsO1xuXHRcdFx0XHQgICAgICAgIFx0XHQgLy9pdWkuZGFzaGJvYXJkLnNldFdpZGdldFBhcmFtcyhcIlwiKTtcblx0XHRcdFx0ICAgICAgICBcdCB9XG5cdFx0XHRcdCAgICAgICAgIH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0b3BvbG9neV9jb250ZW50LnJlbmRlcigpO1xuXHRcdH0pO1xuXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybCA6IFwiL3RvcG9sb2d5TWdtdC90b3BvbG9neU1nbXQvZ2V0VG9wb2xvZ3lJbml0LmRvXCIsXG5cdFx0XHRkYXRhVHlwZSA6XCJqc29uXCIsXG5cdFx0XHRzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRpY29uTGlzdCA9IGRhdGEuaWNvbkxpc3Q7XG5cdFx0XHRcdF9zZWxmLnJlZnJlc2goKTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjpmdW5jdGlvbihyZXF1ZXN0LHN0YXR1cyxlcnJvcil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmKHRvcG9sb2d5VGltZXIgIT0gbnVsbCl7XG5cdFx0XHRjbGVhckludGVydmFsKHRvcG9sb2d5VGltZXIpO1xuXHRcdFx0dG9wb2xvZ3lUaW1lciA9IG51bGw7XG5cdFx0fVxuXG5cdFx0dG9wb2xvZ3lUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdF9zZWxmLnJlZnJlc2goKTtcblx0XHR9LCBfc2VsZi5vcHRpb25zLmludGVydmFsKTsgXG5cblx0XHR0aGlzLl90cmlnZ2VyKCd3aWxsbW91bnQnLCBudWxsLCB0aGlzKTtcblx0fSxcblxuXHRfZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdGlmKHRvcG9sb2d5VGltZXIgIT0gbnVsbCl7XG5cdFx0XHRjbGVhckludGVydmFsKHRvcG9sb2d5VGltZXIpO1xuXHRcdFx0dG9wb2xvZ3lUaW1lciA9IG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgX3NlbGYgPSB0aGlzO1xuXHRcdGlmKCFfc2VsZi5lZGl0TW9kZSl7XG5cdFx0XHQvKlxuXHRcdFx0aWYodG9wb2xvZ3lCcnVzaFRpbWVyICE9IG51bGwpe1xuXHRcdFx0XHRjbGVhckludGVydmFsKHRvcG9sb2d5QnJ1c2hUaW1lcik7XG5cdFx0XHRcdHRvcG9sb2d5QnJ1c2hUaW1lciA9IG51bGw7XG5cdFx0XHR9Ki9cblxuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dHlwZTpcInBvc3RcIixcblx0XHRcdFx0dXJsIDogIF9zZWxmLm9wdGlvbnMuZGF0YSxcblx0XHRcdFx0ZGF0YVR5cGUgOlwianNvblwiLFxuXHRcdFx0XHRkYXRhIDogXCJ0b3BvbG9neUlkPVwiK19zZWxmLm5vZGVJZCxcblx0XHRcdFx0c3VjY2VzczpmdW5jdGlvbihkYXRhKXtcdFx0XHRcblx0XHRcdFx0XHRfc2VsZi5iZWZvcmVOb2RlSWQgPSBkYXRhLnRvcG9sb2d5SW5mby5wYXJlbnRUb3BvbG9neUlkO1xuXHRcdFx0XHRcdF9zZWxmLmVsZW1lbnQud2lkdGgoZGF0YS50b3BvbG9neUluZm8uaW1hZ2VXaWR0aCk7XG5cdFx0XHRcdFx0X3NlbGYuZWxlbWVudC5oZWlnaHQoZGF0YS50b3BvbG9neUluZm8uaW1hZ2VIZWlnaHQpO1xuXHRcdFx0XHRcdGlmKCQodG9wb2xvZ3lfY29udGVudC5zdmcucm9vdC5lbGVtZW50KS5maW5kKFwiaW1hZ2VcIikuYXR0cihcInhsaW5rOmhyZWZcIikgIT0gZGF0YS50b3BvbG9neUluZm8uaW1hZ2VGaWxlUGF0aCl7XG5cdFx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LnN2Z0JhY2tncm91bmQoZGF0YS50b3BvbG9neUluZm8uaW1hZ2VGaWxlUGF0aCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9kZURhdGEgPSBbXTtcblx0XHRcdFx0XHQkLmVhY2goZGF0YS50b3BvbG9neU5vZGVMaXN0LGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRub2RlRGF0YS5wdXNoKHsgaWQ6IHRoaXMubm9kZUlkLCBjb2xvciA6IFwiI2FhYWJhY1wiLCBrZXk6IHRoaXMubm9kZUlkLCB4OnRoaXMubm9kZVgsIHk6dGhpcy5ub2RlWSwgbW92ZVg6dGhpcy5ub2RlWCwgbW92ZVk6dGhpcy5ub2RlWSwgbmFtZTogdGhpcy5ub2RlTmFtZSwgc3RhdGUgOiBcIlwiLCB0aXRsZSA6IFwiXCIsIHRleHQgOiBcIlwiLCB0eXBlSWQ6IHRoaXMudHlwZUlkLCBmYXJtVHlwZSA6IHRoaXMuZmFybVR5cGV9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGVkZ2VEYXRhID0gW107XG5cdFx0XHRcdFx0JC5lYWNoKGRhdGEudG9wb2xvZ3lMaW5rTGlzdCxmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0ZWRnZURhdGEucHVzaCh7aWQgOiB0aGlzLmxpbmtJZCwga2V5IDogdGhpcy5hTm9kZUlkLHN0YXRlIDogXCJcIixvdXRnb2luZzogWyB0aGlzLnpOb2RlSWRdfSk7XG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRcdGRhc2hib2FyZEN1cnJlbnRTdGF0ZSA9IFwiXCI7IC8v7ZiE7J6sIOy1nOqzoCDsnqXslaAg65Ox6riJIOuzgOyImFxuXG5cdFx0XHRcdFx0JC5lYWNoKG5vZGVEYXRhLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR2YXIgbm9kZVNlbGYgPSB0aGlzO1xuXG5cdFx0XHRcdFx0XHQkLmVhY2goZGF0YS5ldmVudE5vZGVMaXN0LGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGlmKG5vZGVTZWxmLmlkID09IHRoaXMubm9kZUlkKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc3RhdGUgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuY3JpdGljYWxDbnQgPiAwKXtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlID0gXCJjcml0aWNhbFwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGFzaGJvYXJkQ3VycmVudFN0YXRlID0gc3RhdGU7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2UgaWYodGhpcy5tYWpvckNudCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSBcIm1ham9yXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXNoYm9hcmRDdXJyZW50U3RhdGUgIT0gXCJjcml0aWNhbFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGFzaGJvYXJkQ3VycmVudFN0YXRlID0gc3RhdGU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2UgaWYodGhpcy5taW5vckNudCA+IDApe1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSBcIm1pbm9yXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXNoYm9hcmRDdXJyZW50U3RhdGUgPT0gXCJcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhc2hib2FyZEN1cnJlbnRTdGF0ZSA9IHN0YXRlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdG5vZGVTZWxmLnN0YXRlID0gc3RhdGU7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZVNlbGYuc3RhdGVTdGF0ID0ge2NyaXRpY2FsOiB0aGlzLmNyaXRpY2FsQ250ICxtYWpvcjogdGhpcy5tYWpvckNudCxtaW5vcjogdGhpcy5taW5vckNudH07XG5cdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdG5vZGVTZWxmID0gbnVsbDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQuYXhpcygwKS5kYXRhID0gbnVsbDtcblx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LmF4aXMoMCkuZGF0YTIgPSBudWxsO1xuXG5cdFx0XHRcdFx0dG9wb2xvZ3lfY29udGVudC5heGlzKDApLmRhdGEgPSBub2RlRGF0YTtcblx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LmF4aXMoMCkuZGF0YTIgPSBlZGdlRGF0YTtcblxuXHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQuYXhpcygwKS5jYWNoZVhZID0gW107XG5cblx0XHRcdFx0XHRmb3IodmFyIGk9MDtpPG5vZGVEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0XHRcdFx0dG9wb2xvZ3lfY29udGVudC5heGlzKDApLmNhY2hlWFlbaV0gPSB7XG5cdFx0XHRcdFx0XHRcdHg6IG5vZGVEYXRhW2ldLngsXG5cdFx0XHRcdFx0XHRcdHk6IG5vZGVEYXRhW2ldLnlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LmF4aXMoMCkuZGF0YVtpXS5tb3ZlWCA9IG5vZGVEYXRhW2ldLng7XG5cdFx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LmF4aXMoMCkuZGF0YVtpXS5tb3ZlWSA9IG5vZGVEYXRhW2ldLnk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYobm9kZURhdGEgPT0gbnVsbCB8fCBub2RlRGF0YS5sZW5ndGggPT0gMCl7XG5cdFx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LmF4aXMoMCkuY2FjaGVYWSA9IFtdO1xuXHRcdFx0XHRcdFx0dG9wb2xvZ3lfY29udGVudC5heGlzKDApLmNhY2hlWFkgPSBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQucmVuZGVyKCk7XG5cdFx0XHRcdFx0aWYoX3NlbGYubm9kZUlkICE9IFwiQUxMXCIpe1xuXHRcdFx0XHRcdFx0X3NlbGYuZmlyc3QgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQuc2NhbGUoMSk7XG5cdFx0XHRcdFx0XHR0b3BvbG9neV9jb250ZW50LnZpZXcoMCwwKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQuc2NhbGUoMC40KTtcblx0XHRcdFx0XHRcdHRvcG9sb2d5X2NvbnRlbnQudmlldygwLDApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKF9zZWxmLmFjdGl2ZU5vZGUgIT0gbnVsbCl7XG5cdFx0XHRcdFx0XHQkKFwiI1wiK19zZWxmLmFjdGl2ZU5vZGUuaWQgK1wiID4gY2lyY2xlXCIpLmF0dHIoXCJzdHJva2VcIiAsIFwiYmx1ZVwiKTtcblx0XHRcdFx0XHRcdCQoXCIjXCIrX3NlbGYuYWN0aXZlTm9kZS5pZCArXCIgPiBjaXJjbGVcIikuYXR0cihcInN0cm9rZS13aWR0aFwiICwgXCI0XCIpO1x0XHRcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkYXNoYm9hcmRXaWRnZXRJZHgrKztcblxuXHRcdFx0XHRcdGlmKGl1aS5kYXNoYm9hcmQud2lkZ2V0cy5sZW5ndGggPD0gZGFzaGJvYXJkV2lkZ2V0SWR4KXtcblx0XHRcdFx0XHRcdGxvYWRpbmdFbmQoKTtcblx0XHRcdFx0XHR9XHRcdFx0XHRcblxuXHRcdFx0XHRcdG5vZGVEYXRhID0gbnVsbDtcblx0XHRcdFx0XHRlZGdlRGF0YSA9IG51bGw7XHRcdFx0XHRcblx0XHRcdFx0XHRkYXRhID0gbnVsbDtcdFx0XHRcdFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjpmdW5jdGlvbihyZXF1ZXN0LHN0YXR1cyxlcnJvcil7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3RyaWdnZXIoJ3dpbGx1cGRhdGUnLCBudWxsLCB0aGlzKTtcblx0XHRcdC8qXG5cdCAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdCBfc2VsZi5yZWZyZXNoKCk7XG5cdCAgfSwgX3NlbGYub3B0aW9ucy5pbnRlcnZhbCk7Ki9cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDstpTqsIBcblx0ICovXG5cdGxvYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdC8vICB0aGlzLmNoYXJ0LmxvYWQoe1xuXHRcdC8vICAgY29sdW1uczogdmFsdWVcblx0XHQvLyAgfSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIOuNsOydtO2EsCDsgq3soJxcblx0ICovXG5cdHVubG9hZDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0Ly8gIHRoaXMuY2hhcnQudW5sb2FkKCd2YWx1ZScpXG5cdFx0aWYodG9wb2xvZ3lUaW1lciAhPSBudWxsKXtcblx0XHRcdGNsZWFySW50ZXJ2YWwodG9wb2xvZ3lUaW1lcik7XG5cdFx0fVxuXHR9LFxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdC8vIGlmIChrZXkgPT09IFwicGFyYW1zXCIpIHtcblx0XHQvLyB9XG5cdFx0dGhpcy5fc3VwZXIoa2V5LCB2YWx1ZSk7XG5cblx0XHQvL3RoaXMucmVmcmVzaCgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiDtgazquLAg67OA6rK9XG5cdCAqL1xuXHRyZXNpemU6IGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRpZihzdGF0dXMgPT0gXCJtYXhcIil7XG5cdFx0XHR0aGlzLmJlZm9yZVNjYWxlID0gdG9wb2xvZ3lfY29udGVudC5zY2FsZSgpO1xuXHRcdFx0dG9wb2xvZ3lfY29udGVudC5zY2FsZSgxKTtcblx0XHR9ZWxzZSBpZihzdGF0dXMgPT0gXCJtaW5cIil7XG5cdFx0XHR0b3BvbG9neV9jb250ZW50LnNjYWxlKHRoaXMuYmVmb3JlU2NhbGUpO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIGggPSAkKHRvcG9sb2d5X2NvbnRlbnQucm9vdCkuaGVpZ2h0KCkgKiAkKHRvcG9sb2d5X2NvbnRlbnQucm9vdCkucGFyZW50KCkud2lkdGgoKSAvICQodG9wb2xvZ3lfY29udGVudC5yb290KS53aWR0aCgpO1xuXHRcdH1cblx0fVxufSk7XG4iXX0=
