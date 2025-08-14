(function($) {
	var UI = function() {};
		UI = {
			init:function() {
			UI.initValue();
			UI.initRdo();
			UI.initChk();
			UI.bind();
		},
		initValue : function() {
			$('.combo_value').each(function(){
				var default_value = $(this).next('.drop_tgl').next('.drop_menu').find('input:checked').next('label').text();
				$(this).text(default_value);
			});

			$('.combo_code').each(function(){
				var default_value = $(this).next('.drop_tgl').next('.drop_menu').find('input:checked').next('label').html();
				$(this).html(default_value);
			});

			$('.select_value').each(function(){
				var default_value = $(this).next('.drop_menu').find('input:checked').next('label').text();
				$(this).text(default_value);
			});

			$('.select_code').each(function(){
				var default_value = $(this).next('.drop_menu').find('input:checked').next('label').html();
				$(this).html(default_value);
			});
		},
		bind : function()  {
			$('div.combobox>ul>li>a').unbind('click.designMode');
			$('div.combobox>ul>li>input[type=radio]').unbind('change.designMode');
			//$('div.combobox>ul>li>label').unbind('hover.designMode'); 2015/07/21 콤보박스 드롭메뉴 마우스 오버효과 오류로 제거
			$('div.combobox>ul>li>label').unbind('click.designMode');
			$('div.combobox>ul>li>label').unbind('click.desiggMode');
			$('div.combobox>ul>li>label').unbind('click.designMode');
			$('div.combobox>ul>li>a').bind('click.designMode', UI.set_anchor);
			$('div.combobox>ul>li>input[type=radio]').bind('change.designMode', UI.set_label);
			//$('div.combobox>ul>li>label').bind('hover.designMode', UI.i_hover);
			$('div.combobox>ul>li>label').bind('click.designMode', UI.set_rdo);
			$('div.combobox>ul>li>label').bind('click.desiggMode', UI.hide_option);
			$('div.combobox>ul>li>label').bind('click.designMode', UI.set_code);

		},
		i_hover: function (){
			$(this).parents('ul:first').children('li').removeClass('hover');
			$(this).parents('li:first').toggleClass('hover');
		},
		hide_option : function (){
			var t = $(this);
				if(!t.is('.unhidden')){
					setTimeout(function(){
					t.parents('div.combobox:first').removeClass('open');
				}, 1);
			}
		},
		// IE radio checked
		set_rdo : function (){
			var v = $(this).text();
			$(this).prev('.input_rdo').attr('checked','checked');
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').text('').append(v);
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').addClass('selected');
			$(this).parents('ul:first').prev('.select_value').text('').append(v);
			$(this).parents('ul:first').prev('.select_value').addClass('selected');
		},
		// Set Input
		set_label  : function (){
			var v = $(this).next('label').text();
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').text('').append(v);
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').addClass('selected');
			$(this).parents('ul:first').prev('.select_value').text('').append(v);
			$(this).parents('ul:first').prev('.select_value').addClass('selected');
		},
		// Set Anchor
		set_anchor : function (){
			var v = $(this).text();
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').text('').append(v);
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_value').addClass('selected');
			$(this).parents('ul:first').prev('.select_value').text('').append(v);
			$(this).parents('ul:first').prev('.select_value').addClass('selected');
		},
		// Set Code
		set_code : function (){
			var v = $(this).html();
			$(this).prev('.input_rdo').attr('checked','checked');
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_code').html('').append(v);
			$(this).parents('ul:first').prev('.drop_tgl').prev('div.combo_code').addClass('selected');
			$(this).parents('ul:first').prev('.select_code').html('').append(v);
			$(this).parents('ul:first').prev('.select_code').addClass('selected');
		},

		initRdo : function() {
			// 라디오버튼 아이콘
			$('.input_rdo').closest('label').addClass('rdobtn').each(function(){
				var $input = $(this).removeClass('rdobtn_on').removeClass('disabled').find('.input_rdo');

				if($input.is(':checked') || $input.prop('checked') || $input.attr("checked") == 'checked'){
					$(this).addClass('rdobtn_on')
				}
				
				if($input.is(':disabled')|| $input.prop('disabled') || $input.attr("disabled") == 'disabled'){
					$(this).addClass('disabled')
				}
			});
		},

		initChk: function() {
		  	// 체크박스 아이콘
			$('.input_chk').closest('label').addClass('chkbox').each(function(){
				var $input = $(this).removeClass('chkbox_on').removeClass('disabled').find('.input_chk');

				if($input.is(':checked') || $input.prop('checked') || $input.attr("checked") == 'checked'){
					$(this).addClass('chkbox_on')
				}
				
				if($input.is(':disabled')|| $input.prop('disabled') || $input.attr("disabled") == 'disabled'){
					$(this).addClass('disabled')
				}
			});
		}
	};
	window.UI = UI;
})( jQuery );

// common function
var old = '';
function exchLayer(id){
    layer = eval("this.document.getElementById('"+id + "').style");
    if(old != layer){
        if(old != ''){
            old.display = 'none';
        }
        layer.display = 'block';
        old = layer;
    } else {
        layer.display = 'none';
        old = '';
    }
}

function exchToggle(obj) {
	if (obj.style.display == 'none') obj.style.display = 'block';
	else if (obj.style.display == 'block') obj.style.display = 'none';
}

function toggleLayer(id){
    layer = eval("this.document.getElementById('"+id + "').style");
    if (layer.display == 'block'){
        layer.display = 'none';
    }else{
        layer.display = 'block';
    }
}

function showLayer(id){
    document.getElementById(id).style.display='block';
}

function hideLayer(id){
    document.getElementById(id).style.display='none';
}

function newDialog(divObjId, option, closeFlag){
	if (closeFlag == 2){
		$.extend(option, {
			close : function( event, ui ) {
	    		destroyDialog($(this).attr('id'));
	    	}
		});
    }
    $('#'+ divObjId).dialog(option);
}

function openDialog(id) {
	$('#'+id).dialog('open');
	return false;
}

function closeDialog(id) {
	$('#'+id).dialog('close');
	return false;
}

function destroyDialog(id) {
	// dialog option 을 백업 받는다.
	var options = $('#'+id).dialog( "option" );

	// dialog 를 destroy 한다.
	$('#'+id).dialog('destroy');

	// 백업 받은 option 으로 dialog를 생성한다.
	$('#'+id).dialog(options);
	return false;
}

function fadeIn(id){
	$('#'+id).fadeIn('normal');
	return false;
}

function fadeOut(id){
	$('#'+id).fadeOut('normal');
	return false;
}

function fadeToggle(id){
	$('#'+id).fadeToggle('normal');
	return false;
}

function slideUp(id){
	$('#'+id).slideUp('normal');
	return false;
}

function slideDown(id){
	$('#'+id).slideDown('normal');
	return false;
}

function toggleFold(id) {
	$('#'+id).toggleClass('unfold');
	return false;
}

$(function() {
	$(".ctrl_btn").tooltip({
		selector: "button",
		delay: { show: 500, hide: 0 }
	});
});

function trToggle(id){
	if($('#'+id).hasClass('tr_off')) {
		$('#tgl_'+id).removeClass('plus');
		$('#tgl_'+id).addClass('minus');
		$('#'+id).removeClass('tr_off');
		$('#'+id).addClass('tr_on');

	} else {
		$('#tgl_'+id).removeClass('minus');
		$('#tgl_'+id).addClass('plus');
		$('#'+id).removeClass('tr_on');
		$('#'+id).addClass('tr_off');
	}
}

$(document).ready(function () {
    UI.initRdo();
	UI.initChk();

	// 기간선택 레이어 효과
	$('.period_slt > ul > li > label').each(function () {
		$(this).click(function () {
			$(this).closest('li').addClass('active');
			$(this).closest('li').siblings().removeClass('active');
			$('.period_slt > ul > li select').attr('disabled', 'disabled');
			$('.period_slt > ul > li input[type=text]').attr('disabled', 'disabled');
			$('.period_slt > ul > li.active select').removeAttr('disabled', 'disabled');
			$('.period_slt > ul > li.active input[type=text]').removeAttr('disabled', 'disabled');
		});
	});

	// 상세검색 열기
	$(".srch_detail button.btn_srch_detail").each(function () {
		$(this).click(function () {
			$(this).parent('.srch_bar').next('.srch_detail_lyr').fadeIn();
		});
	});

	// 상세검색 열기 (버전 7.05)
	$(".srch_detail button.btn_srch_detail").each(function () {
		$(this).click(function () {
			$(this).parent('.srch_detail').find('.srch_detail_lyr').fadeIn();
		});
	});

	// 상세검색 닫기
	$(".srch_detail_lyr button.btn_close").each(function () {
		$(this).click(function () {
			$(this).closest('.srch_detail_lyr').fadeOut();
		});
	});

	// select 선택 옵션
	$(".tgl_selector .btn_tgl").each(function () {
		$(this).click(function () {
			$(this).parent('.tgl_selector').toggleClass('multi');
		});
	});
});

$(function() {
	// 목록 체크박스 선택
	$('.tbl_lst_set input.lst_chk[type=checkbox]').change(function() {
		$(this).closest('tr').toggleClass('selected');
	});

	$('.tbl_lst_set input.lst_rdo[type=radio]').change(function() {
		$(this).closest('tr').toggleClass('selected');
		$(this).closest('tr').siblings().removeClass('selected');
	});

	$('.lst_tbl input.lst_chk[type=checkbox]').change(function() {
		$(this).closest('tr').toggleClass('selected');
	});

	$('.lst_tbl input.lst_rdo[type=radio]').change(function() {
		$(this).closest('tr').toggleClass('selected');
		$(this).closest('tr').siblings().removeClass('selected');
	});

	$('.lst_box input.lst_chk[type=checkbox]').change(function() {
		$(this).closest('li').toggleClass('selected');
	});

	$('.lst_box input.lst_rdo[type=radio]').change(function() {
		$(this).closest('li').toggleClass('selected');
		$(this).closest('li').siblings().removeClass('selected');
	});

	$('.lst_file input.lst_chk[type=checkbox]').change(function() {
		$(this).closest('li').toggleClass('selected');
	});

	// 트리 메뉴 접기/펴기
	$('.tree_menu_box .fd').click(function () {
		if($(this).closest('.mn').hasClass('unfd')) {
			$(this).closest('.mn').removeClass('unfd');
			$(this).closest('.mn').next('.mn_lst').removeClass('unfd');
			return false;
		} else {
			$(this).closest('.mn').addClass('unfd');
			$(this).closest('.mn').next('.mn_lst').addClass('unfd');
			return false;
		}
	});

	// 사이드 메뉴 접기/펴기
	$('.snb_menu_box .mn_ul .mn').click(function () {
		if($(this).closest('li').hasClass('smn_fold')) {
			$(this).closest('li').removeClass('smn_fold');
			return false;
		} else {
			$(this).closest('li').addClass('smn_fold');
			return false;
		}
	});

	// 사이드 메뉴 모두 접기
	$(".snb_admin .all_fold").click(function () {
		$('.snb_admin .mn_ul li').addClass('smn_fold');
	});

	// 사이드 메뉴 모두 펴기
	$(".snb_admin .all_unfold").click(function () {
		$('.snb_admin .mn_ul li').removeClass('smn_fold');
	});

	// 사이즈, 용량 수정
	$('.size_frm .size_info .size_set').click(function () {
		$(this).closest('.size_frm').addClass('size_frm_edit');
	});

	$('.size_frm .size_edit .set_cncl').click(function () {
		$(this).closest('.size_frm').removeClass('size_frm_edit');
	});

	// 다국어 입력 더보기
	$('.lang_dl .btn_lang').click(function () {
		if($(this).closest('.lang').hasClass('lang_open')) {
			$(this).closest('.lang').removeClass('lang_open');
		} else {
			$(this).closest('.lang').addClass('lang_open');
		}
	});

	// 툴팁
	$(".tip_t").tooltip({
		placement: 'top',
		delay: { show: 500, hide: 0 }
	});

	$(".tip_b").tooltip({
		placement: 'bottom',
		delay: { show: 500, hide: 0 }
	});

	$(".tip_l").tooltip({
		placement: 'left',
		delay: { show: 500, hide: 0 }
	});

	$(".tip_r").tooltip({
		placement: 'right',
		delay: { show: 500, hide: 0 }
	});
});

$(document)
.on('click', 'input.input_chk[type=checkbox]' , function(){
	var $chkbox = $(this).closest('.chkbox');
	if( $(this).is(':checked') ||  $(this).prop('checked') ||  $(this).attr("checked") == 'checked'){
		$chkbox.addClass('chkbox_on');
	} else {
		$chkbox.removeClass('chkbox_on');
	}
}).on('click', 'input.input_rdo[type=radio]' , function(){
	$('[name="' + this.name + '"]').closest('.rdobtn').removeClass("rdobtn_on");
	$(this).closest('.rdobtn').addClass("rdobtn_on");
});