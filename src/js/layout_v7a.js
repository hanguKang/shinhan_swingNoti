$(document).ready(function() {
	// 페이지 최상위 이동
	$('body').on('click','.btn_page_top',function(){
		$('html, body').animate({scrollTop:0}, 'fast');
	});

	// 화면분할 레이아웃 페이지네이션 클릭시 목록 및 페이지 최상위 이동
	$('.list_container').on('click','.pagination a',function(){
		$('#list_resizable, .scroll, html, body').animate({scrollTop:0}, 'fast');
	});

	// 별표 아이콘 토글
	$('a.star_chk').click(function(){
		if ($(this).hasClass('chk_on')) {
			$(this).removeClass('chk_on').attr('title','별표하기');
			$(this).children('span').html('별표하기');
		} else {
			$(this).addClass('chk_on').attr('title','별표해제');
			$(this).children('span').html('별표해제');
		}; return false;
	});

	// 별표 기능 변경 .star_chk 사용으로 통일. 기존 작업물도 교체 예정
	$('a.scrap_chk').click(function(){
		if ($(this).hasClass('chk_on')) {
			$(this).removeClass('chk_on').attr('title','별표하기');
			$(this).children('span').html('별표하기');
		} else {
			$(this).addClass('chk_on').attr('title','별표해제');
			$(this).children('span').html('별표해제');
		}; return false;
	});

	$('a.fav_chk').click(function(){
		if ($(this).hasClass('chk_on')) {
			$(this).removeClass('chk_on');
		} else {
			$(this).addClass('chk_on');
		}; return false;
	});

	// 사이드메뉴 트리 검색목록 펼침
	$('.snb .srch_result .arr').click(function(){
		$(this).closest('.srch_result').toggleClass('open');
		return false;
	});
});

// Side Navigation 설정
function hideSnb(){
	$('#layout_wrap').addClass('hide_snb');
}

function showSnb(){
	$('#layout_wrap').removeClass('hide_snb');
}

function toggleSnb(){
	if ($('#layout_wrap').hasClass('hide_snb')) {
		$('#layout_wrap').removeClass('hide_snb');
	} else  {
		$('#layout_wrap').addClass('hide_snb');
	}
}

function snbWidthDef(){
	$('#layout_wrap').addClass('snb_w_def');
	$('#layout_wrap').removeClass('snb_w_med');
	$('#layout_wrap').removeClass('snb_w_lar');
}

function snbWidthMed(){
	$('#layout_wrap').removeClass('snb_w_def');
	$('#layout_wrap').addClass('snb_w_med');
	$('#layout_wrap').removeClass('snb_w_lar');
}

function snbWidthLar(){
	$('#layout_wrap').removeClass('snb_w_def');
	$('#layout_wrap').removeClass('snb_w_med');
	$('#layout_wrap').addClass('snb_w_lar');
}

// 목록만 보기
function screenList(){
	$('.quick_menu .set_btns .scr_cm').addClass('scr_cm_on');
	$('.quick_menu .set_btns .scr_vr').removeClass('scr_vr_on');
	$('.quick_menu .set_btns .scr_hr').removeClass('scr_hr_on');
	$('.quick_menu .set_btns .scr_rs').removeClass('scr_rs_on');

	$('#body').removeClass('layout_min_width');
	$('#body').removeClass('layout_auto');
	$('#body').addClass('layout_manual');

	$('#layout_header').removeClass('scr_view');
	$('#layout_container').removeClass('scr_view');
	$('#layout_header').removeClass('scr_write');
	$('#layout_container').removeClass('scr_write');
	$('#layout_header').addClass('scr_list');
	$('#layout_container').addClass('scr_list');
	$('#layout_wrap').addClass('min_w994');
	$('#content_area').addClass('content_area_vr');
	$('#list_container').addClass('list_container_vr');

	$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
	$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
	$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
	$('#split_vr').css('display','none'); // 세로분할 리사이즈
}

// 조회만 보기
function screenView(){
	if ($('#layout_container').hasClass('scr_list')) {
		$('#layout_header').removeClass('scr_list');
		$('#layout_container').removeClass('scr_list');
		$('#layout_header').addClass('scr_view');
		$('#layout_container').addClass('scr_view');
	} else {
		alert('View Data Loading...');
	}
}

// 작성
function screenWrite(){
	$('#layout_wrap').addClass('scr_write');
	$('#set_bar .btn_scr_div').attr("disabled", "disabled");
	$('#set_bar .btn_scr_list').attr("disabled", "disabled");
}

function screenWriteHide(){
	$('#layout_wrap').removeClass('scr_write');
	$('#set_bar .btn_scr_div').removeAttr("disabled");
	$('#set_bar .btn_scr_list').removeAttr("disabled");
}

// 분할로 보기
function screenDiv(){
	$('#layout_wrap').removeClass('min_w994');
	$('#layout_header').removeClass('scr_list');
	$('#layout_container').removeClass('scr_list');
	$('#layout_header').removeClass('scr_view');
	$('#layout_container').removeClass('scr_view');
}

// 가로 분할
function screenHorizontal(){
	$('.quick_menu .set_btns .scr_cm').removeClass('scr_cm_on');
	$('.quick_menu .set_btns .scr_vr').removeClass('scr_vr_on');
	$('.quick_menu .set_btns .scr_hr').addClass('scr_hr_on');
	$('.quick_menu .set_btns .scr_rs').removeClass('scr_rs_on');

	$('#layout_wrap').addClass('below_w1514');
	$('#content_area').removeClass('content_area_vr');
	$('#list_container').removeClass('list_container_vr');
	$('#listbox').removeClass('listbox_vr');
	$('#listbox').addClass('listbox_hr');
	$('#set_bar .btn_scr_div').removeClass('div_vr');
	$('#body').removeClass('layout_min_width');
	$('#body').removeClass('layout_auto');
	$('#body').addClass('layout_manual');

	$('#layout_wrap').removeClass('min_w994');
	$('#layout_header').removeClass('scr_list');
	$('#layout_container').removeClass('scr_list');
	$('#layout_header').removeClass('scr_view');
	$('#layout_container').removeClass('scr_view');

	$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
	$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
	$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
	$('#split_vr').css('display','none'); // 세로분할 리사이즈
}

// 세로 분할
function screenVertical(){
	$('.quick_menu .set_btns .scr_cm').removeClass('scr_cm_on');
	$('.quick_menu .set_btns .scr_vr').addClass('scr_vr_on');
	$('.quick_menu .set_btns .scr_hr').removeClass('scr_hr_on');
	$('.quick_menu .set_btns .scr_rs').removeClass('scr_rs_on');

	$('#layout_wrap').removeClass('min_w994');
	$('#layout_header').removeClass('scr_list');
	$('#layout_container').removeClass('scr_list');
	$('#layout_header').removeClass('scr_view');
	$('#layout_container').removeClass('scr_view');
	$('#body').removeClass('layout_auto');
	$('#body').addClass('layout_manual');

	$('#body').addClass('layout_min_width');
	$('#layout_wrap').removeClass('below_w1514');
	$('#content_area').addClass('content_area_vr');
	$('#list_container').addClass('list_container_vr');
	$('#listbox').addClass('listbox_vr');
	$('#listbox').removeClass('listbox_hr');
	$('#set_bar .btn_scr_div').addClass('div_vr');

	$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
	$('#split_vr').css('display','block'); // 세로분할 리사이즈
}

// 전체화면 보기
function fullViewOn(){
	$('#body').addClass('full_screen');
	if ($('#layout_wrap').hasClass('svc_open')) {
		$('#layout_content').css('paddingTop', 469);
	} else {
		$('#layout_content').css('paddingTop', 35);
	}
}

function fullViewOff(){
	$('#body').removeClass('full_screen');
	if ($('#layout_wrap').hasClass('svc_open')) {
		$('#layout_content').css('paddingTop', 503);
	} else {
		$('#layout_content').css('paddingTop', 69);
	}
}

// 반응형 레이아웃 켜기
function layoutControlAuto(){
	$('.quick_menu .set_btns .scr_cm').removeClass('scr_cm_on');
	$('.quick_menu .set_btns .scr_vr').removeClass('scr_vr_on');
	$('.quick_menu .set_btns .scr_hr').removeClass('scr_hr_on');
	$('.quick_menu .set_btns .scr_rs').addClass('scr_rs_on');

	$('#body').removeClass('layout_min_width');
	$('#body').removeClass('layout_manual');
	$('#body').addClass('layout_auto');

	// 반응형 켜기시 분할로 보기
	$('#layout_wrap').removeClass('min_w994');
	$('#layout_header').removeClass('scr_list');
	$('#layout_container').removeClass('scr_list');
	$('#layout_header').removeClass('scr_view');
	$('#layout_container').removeClass('scr_view');

	if ($('#body').hasClass('layout_auto')) {
		if ($('#layout_wrap').hasClass('hide_snb')) {
			if ( $(window).width() < 1314 ) {
				$('#layout_wrap').addClass('below_w1514');
				$('#content_area').removeClass('content_area_vr');
				$('#list_container').removeClass('list_container_vr');
				$('#listbox').removeClass('listbox_vr');
				$('#listbox').addClass('listbox_hr');
				$('#set_bar .btn_scr_div').removeClass('div_vr');

				$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
				$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
				$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
				$('#split_vr').css('display','none'); // 세로분할 리사이즈
			} else {
				$('#body').removeClass('layout_min_width');
				$('#layout_wrap').removeClass('below_w1514');
				$('#content_area').addClass('content_area_vr');
				$('#list_container').addClass('list_container_vr');
				$('#listbox').addClass('listbox_vr');
				$('#listbox').removeClass('listbox_hr');
				$('#set_bar .btn_scr_div').addClass('div_vr');

				$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
				$('#split_vr').css('display','block'); // 세로분할 리사이즈
			}
		} else {
			if ( $(window).width() < 1514 ) {
				$('#layout_wrap').addClass('below_w1514');
				$('#content_area').removeClass('content_area_vr');
				$('#list_container').removeClass('list_container_vr');
				$('#listbox').removeClass('listbox_vr');
				$('#listbox').addClass('listbox_hr');
				$('#set_bar .btn_scr_div').removeClass('div_vr');

				$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
				$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
				$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
				$('#split_vr').css('display','none'); // 세로분할 리사이즈
			} else {
				$('#body').removeClass('layout_min_width');
				$('#layout_wrap').removeClass('below_w1514');
				$('#content_area').addClass('content_area_vr');
				$('#list_container').addClass('list_container_vr');
				$('#listbox').addClass('listbox_vr');
				$('#listbox').removeClass('listbox_hr');
				$('#set_bar .btn_scr_div').addClass('div_vr');

				$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
				$('#split_vr').css('display','block'); // 세로분할 리사이즈
			}
		}
	}
}

// 반응형 레이아웃 끄기
function layoutControlManual(){
	$('#body').removeClass('layout_auto');
	$('#body').addClass('layout_manual');
}

// 목록 폴더형 보기
function viewTypeFolder(){
	$('#list_container').addClass('type_folder');
}

function viewTypeDefault(){
	$('#list_container').removeClass('type_folder');
}

// 창크기가 1514px 이하일 경우 class 제어
$(function(){
	if ($('#body').hasClass('layout_auto')) {
		if ($('#layout_wrap').hasClass('hide_snb')) {
			if ( $(window).width() < 1314 ) {
				$('#layout_wrap').addClass('below_w1514');
				$('#content_area').removeClass('content_area_vr');
				$('#list_container').removeClass('list_container_vr');
				$('#listbox').removeClass('listbox_vr');
				$('#listbox').addClass('listbox_hr');
				$('#set_bar .btn_scr_div').removeClass('div_vr');

				$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
				$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
				$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
				$('#split_vr').css('display','none'); // 세로분할 리사이즈
			} else {
				$('#body').removeClass('layout_min_width');
				$('#layout_wrap').removeClass('below_w1514');
				$('#content_area').addClass('content_area_vr');
				$('#list_container').addClass('list_container_vr');
				$('#listbox').addClass('listbox_vr');
				$('#listbox').removeClass('listbox_hr');
				$('#set_bar .btn_scr_div').addClass('div_vr');

				$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
				$('#split_vr').css('display','block'); // 세로분할 리사이즈
			}
		} else {
			if ($('#layout_wrap').hasClass('aside_open')) {
				// 일반적인 노트북 해상도 1600에서 사이드메뉴, 세로목록, 조회, 위젯툴바가 세로 분할로 보일 수 있도록 기준값 설정
				if ( $(window).width() < 1583 ) {
					$('#layout_wrap').addClass('below_w1514');
					$('#content_area').removeClass('content_area_vr');
					$('#list_container').removeClass('list_container_vr');
					$('#listbox').removeClass('listbox_vr');
					$('#listbox').addClass('listbox_hr');
					$('#set_bar .btn_scr_div').removeClass('div_vr');

					$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
					$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
					$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
					$('#split_vr').css('display','none'); // 세로분할 리사이즈
				} else {
					$('#body').removeClass('layout_min_width');
					$('#layout_wrap').removeClass('below_w1514');
					$('#content_area').addClass('content_area_vr');
					$('#list_container').addClass('list_container_vr');
					$('#listbox').addClass('listbox_vr');
					$('#listbox').removeClass('listbox_hr');
					$('#set_bar .btn_scr_div').addClass('div_vr');

					$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
					$('#split_vr').css('display','block'); // 세로분할 리사이즈
				}
			} else {
				if ( $(window).width() < 1514 ) {
					$('#layout_wrap').addClass('below_w1514');
					$('#content_area').removeClass('content_area_vr');
					$('#list_container').removeClass('list_container_vr');
					$('#listbox').removeClass('listbox_vr');
					$('#listbox').addClass('listbox_hr');
					$('#set_bar .btn_scr_div').removeClass('div_vr');

					$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
					$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
					$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
					$('#split_vr').css('display','none'); // 세로분할 리사이즈
				} else {
					$('#body').removeClass('layout_min_width');
					$('#layout_wrap').removeClass('below_w1514');
					$('#content_area').addClass('content_area_vr');
					$('#list_container').addClass('list_container_vr');
					$('#listbox').addClass('listbox_vr');
					$('#listbox').removeClass('listbox_hr');
					$('#set_bar .btn_scr_div').addClass('div_vr');

					$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
					$('#split_vr').css('display','block'); // 세로분할 리사이즈
				}
			}
		}
		function checkWindowSize() {
			if ($('#body').hasClass('layout_auto')) {
				if ($('#layout_wrap').hasClass('hide_snb')) {
					if ( $(window).width() < 1314 ) {
						if (!$('#listbox').hasClass('listbox_hr')) {
							$('#listbox').trigger('horizontal');
						}
						$('#body').removeClass('layout_min_width');
						$('#layout_wrap').addClass('below_w1514');
						$('#content_area').removeClass('content_area_vr');
						$('#list_container').removeClass('list_container_vr');
						$('#listbox').removeClass('listbox_vr');
						$('#listbox').addClass('listbox_hr');
						$('#set_bar .btn_scr_div').removeClass('div_vr');

						$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
						$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
						$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
						$('#split_vr').css('display','none'); // 세로분할 리사이즈
					} else {
						if (!$('#listbox').hasClass('listbox_vr')) {
							$('#listbox').trigger('vertical');
						}
						$('#layout_wrap').removeClass('below_w1514');
						$('#content_area').addClass('content_area_vr');
						$('#list_container').addClass('list_container_vr');
						$('#listbox').addClass('listbox_vr');
						$('#listbox').removeClass('listbox_hr');
						$('#set_bar .btn_scr_div').addClass('div_vr');

						$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
						$('#split_vr').css('display','block'); // 세로분할 리사이즈
					}
				} else {
					if ($('#layout_wrap').hasClass('aside_open')) {
						if ( $(window).width() < 1583 ) {
							if (!$('#listbox').hasClass('listbox_hr')) {
								$('#listbox').trigger('horizontal');
							}
							$('#layout_wrap').addClass('below_w1514');
							$('#content_area').removeClass('content_area_vr');
							$('#list_container').removeClass('list_container_vr');
							$('#listbox').removeClass('listbox_vr');
							$('#listbox').addClass('listbox_hr');
							$('#set_bar .btn_scr_div').removeClass('div_vr');

							$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
							$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
							$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
							$('#split_vr').css('display','none'); // 세로분할 리사이즈
						} else {
							if (!$('#listbox').hasClass('listbox_vr')) {
								$('#listbox').trigger('vertical');
							}
							$('#body').removeClass('layout_min_width');
							$('#layout_wrap').removeClass('below_w1514');
							$('#content_area').addClass('content_area_vr');
							$('#list_container').addClass('list_container_vr');
							$('#listbox').addClass('listbox_vr');
							$('#listbox').removeClass('listbox_hr');
							$('#set_bar .btn_scr_div').addClass('div_vr');

							$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
							$('#split_vr').css('display','block'); // 세로분할 리사이즈
						}
					} else {
						if ( $(window).width() < 1514 ) {
							if (!$('#listbox').hasClass('listbox_hr')) {
								$('#listbox').trigger('horizontal');
							}
							$('#layout_wrap').addClass('below_w1514');
							$('#content_area').removeClass('content_area_vr');
							$('#list_container').removeClass('list_container_vr');
							$('#listbox').removeClass('listbox_vr');
							$('#listbox').addClass('listbox_hr');
							$('#set_bar .btn_scr_div').removeClass('div_vr');

							$('#layout_content .division_list').css('width', ''); // 세로분할 리사이즈
							$('#layout_content .division_list').css('padding-right', ''); // 세로분할 리사이즈
							$('#layout_content .content_area').css('padding-left', ''); // 세로분할 리사이즈
							$('#split_vr').css('display','none'); // 세로분할 리사이즈
						} else {
							if (!$('#listbox').hasClass('listbox_vr')) {
								$('#listbox').trigger('vertical');
							}
							$('#body').removeClass('layout_min_width');
							$('#layout_wrap').removeClass('below_w1514');
							$('#content_area').addClass('content_area_vr');
							$('#list_container').addClass('list_container_vr');
							$('#listbox').addClass('listbox_vr');
							$('#listbox').removeClass('listbox_hr');
							$('#set_bar .btn_scr_div').addClass('div_vr');

							$('#layout_content .division_list').css('padding-right', '4px'); // 세로분할 리사이즈
							$('#split_vr').css('display','block'); // 세로분할 리사이즈
						}
					}
				}
			}
		}
		$(window).resize(checkWindowSize);
	} else {
		//alert('layout_manual');
	}
});

// 바탕화면 설정
function skin_bg(num){
	for (var i=1;i<=30;i++){
		$('#body').removeClass('skin_bg'+i);
	}
	$('#body').addClass('skin_bg'+ num);
}

// 스킨 컬러 설정
function skin_color(num){
	for (var i=1;i<=30;i++){
		$('#body').removeClass('skin_color'+i);
	}
	$('#body').addClass('skin_color'+ num);
}

// 레이아웃 스킨 설정
function skin_grid(num){
	for (var i=1;i<=20;i++){
		$('#body').removeClass('skin_grid'+i);
	}
	$('#body').addClass('skin_grid'+ num);
}

// 본문 스킨 설정
function skin_doc(num){
	for (var i=1;i<=20;i++){
		$('#body').removeClass('skin_doc'+i);
	}
	$('#body').addClass('skin_doc'+ num);
}

// 포탈 디자이너 : 테마 설정
function gw_theme(num){
	for (var i=1;i<=30;i++){
		$('#body').removeClass('gw_theme'+i);
	}
	$('#body').addClass('gw_theme'+ num);
}

// 포탈 디자이너 : 서브 테마 설정
function gw_subtheme(num){
	for (var i=1;i<=30;i++){
		$('#body').removeClass('gw_subtheme'+i);
	}
	$('#body').addClass('gw_subtheme'+ num);
}

// 포탈 디자이너 : 컬러 설정
function gw_color(num){
	for (var i=1;i<=30;i++){
		$('#body').removeClass('gw_color'+i);
	}
	$('#body').addClass('gw_color'+ num);
}

// 포탈 디자이너 : 바탕화면 설정
function gw_bg(num){
	for (var i=1;i<=50;i++){
		$('#body').removeClass('gw_bg'+i);
	}
	$('#body').addClass('gw_bg'+ num);
}

// 목록 height 리사이즈
$(function() {
    $("#list_resizable").resizable();
});

// 조회 영역 투명도 설정
$(function() {
	$('#opacity_slider').slider({
	    value: $('#content_area').css('opacity'),
	    min: 0,
	    max: 1,
	    step: 0.05,
	    slide: function(event, ui) {
	        $('.opacity_bg').css({
	            'opacity': ui.value
	        });
			$('.btn_fold').css({
	            'opacity': ui.value
	        });
			$('.list_full').css({
	            'opacity': ui.value
	        });
	    }
	});
});

$(document).ready(function(){
	// TOP 검색바
	$("#btn_srch").click(function(){
		if ($("#srch_bar").css('width') == '1px'){
			$("#srch_bar").animate({width:'200px'}, 200);
			$('#srch_bar > .input_txt').focus();
		} else {
			$("#srch_bar").animate({width:'1px'}, 200);
		}
	});

	// TOP 설정바
	$("#btn_set").click(function(){
		if ($("#set_bar").css('width') == '1px'){
			var width = '';
			if (parseInt($("#set_bar > .set_btns").css('width')) > 160){
				width = '174px';
			} else {
				width = '65px';
			}
			$("#set_bar").animate({width:width}, 200); // 93px → 146px → 174px
		} else {
			$("#set_bar").animate({width:'1px'}, 200);
		}
	});
});

// 게시판 목록 체크시 선택 효과
$(function() {
	$(".lst_hr_tbl input.lst_chk[type=checkbox]").change(function() {
		$(this).closest("tr").toggleClass("selected");
	});

	$(".lst_vr_ul input.lst_chk[type=checkbox]").change(function() {
		$(this).closest("li").toggleClass("selected");
	});

	$(".lst_news input.lst_chk[type=checkbox]").change(function() {
		$(this).closest("li").toggleClass("selected");
	});

	$(".lst_album input.lst_chk[type=checkbox]").change(function() {
		$(this).closest("li").toggleClass("selected");
	});

	$(".lst_pds input.lst_chk[type=checkbox]").change(function() {
		$(this).closest("li").toggleClass("selected");
	});
});

// 이미지 뷰어
function imgViewerOpen(){
	$('#layout_wrap').fadeOut();
	$('#rg_img_gallery').fadeIn();
	return false;
}

function imgViewerClose(){
	$('#layout_wrap').fadeIn();
	$('#rg_img_gallery').fadeOut();
	return false;
}

$(function() {
	// 게시판 의견 작성시 원본 글 접기/펴기
	// 본문 영역의 btn_drop 과 class 충돌을 피하기 위해 open 을 cont_open으로 수정함 (2013-10-23)
	$(".orig_box button.btn_cont_tgl").click(function () {
		if ($(this).closest('.orig_box').hasClass('cont_open')) {
			$(this).closest('.orig_box').removeClass('cont_open');
		} else {
			$(this).closest('.orig_box').addClass('cont_open');
		}
	});

	// 질문,답변 게시판 댓글 보기
	$(".qna_cmt .cmt_count .btn_cmt_view").click(function () {
		if ($(this).closest('.qna_cmt').hasClass('cmt_open')) {
			$(this).closest('.qna_cmt').removeClass('cmt_open');
		} else {
			$(this).closest('.qna_cmt').addClass('cmt_open');
		}; return false;
	});

	// 태그 편집 기능
	$(".tag .btn_edit").click(function () {
		$(this).closest('.tag').addClass('edit');
	});

	$(".tag .btn_cncl").click(function () {
		$(this).closest('.tag').removeClass('edit');
	});

	// 조회 상세정보 접기/펴기
	$(".info_dl .tgl_info").click(function () {
		if ($(this).hasClass('plus')) {
			$(this).removeClass('plus');
			$(this).addClass('minus');
			$(this).closest('dl').next('.info_more').show();
		} else {
			$(this).removeClass('minus');
			$(this).addClass('plus');
			$(this).closest('dl').next('.info_more').hide();
		}
	});
});

// 창크기가 1294px 이상일 경우 aside 영역 position:fixed로 고정
// 창크기가 1294px 보다 작을 경우 aside 영역 position:absolute에 top값 가변적
$(function(){
	// 공통 위젯 영역 열기
	$(".title_bar .tgl_aside").click(function () {
		if ($('#layout_wrap').hasClass('aside_open')) {
			$('#layout_wrap').removeClass('aside_open');
		} else {
			$('#layout_wrap').addClass('aside_open');
			if ($('#content_area').hasClass('content_area_vr')) {
				if ( $(window).width() < 1600 ) {
					$('#aside').addClass('aside_absolute');
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0 + $win.scrollTop());
					});
				} else {
					$('#aside').removeClass('aside_absolute');
					$('#aside').css('top', 0);
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0);
					});
				}
			} else {
				if ( $(window).width() < 1294 ) {
					$('#aside').addClass('aside_absolute');
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0 + $win.scrollTop());
					});
				} else {
					$('#aside').removeClass('aside_absolute');
					$('#aside').css('top', 0);
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0);
					});
				}
			}
		}
	});

	// 공통 위젯 영역 닫기
	$(".aside_top .fold_aside").click(function () {
		$('#layout_wrap').removeClass('aside_open');
	});

	// 공통 위젯 영역
	if($('#layout_wrap').hasClass('aside_open')) {
		if ($('#content_area').hasClass('content_area_vr')) {
			if ( $(window).width() < 1600 ) {
				$('#aside').addClass('aside_absolute');
				$(window).scroll(function(){
					var $win = $(window);
					$('#aside').css('top', 0 + $win.scrollTop());
				});
			} else {
				$('#aside').removeClass('aside_absolute');
				$('#aside').css('top', 0);
				$(window).scroll(function(){
					var $win = $(window);
					$('#aside').css('top', 0);
				});
			}
		} else {
			if ( $(window).width() < 1294 ) {
				$('#aside').addClass('aside_absolute');
				$(window).scroll(function(){
					var $win = $(window);
					$('#aside').css('top', 0 + $win.scrollTop());
				});
			} else {
				$('#aside').removeClass('aside_absolute');
				$('#aside').css('top', 0);
				$(window).scroll(function(){
					var $win = $(window);
					$('#aside').css('top', 0);
				});
			}
		}
	}

	function checkWindowSize1() {
		if ($('#layout_wrap').hasClass('aside_open')) {
			if ($('#content_area').hasClass('content_area_vr')) {
				if ( $(window).width() < 1600 ) {
					$('#aside').addClass('aside_absolute');
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0 + $win.scrollTop());
					});
				} else {
					$('#aside').removeClass('aside_absolute');
					$('#aside').css('top', 0);
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0);
					});
				}
			} else {
				if ( $(window).width() < 1294 ) {
					$('#aside').addClass('aside_absolute');
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0 + $win.scrollTop());
					});
				} else {
					$('#aside').removeClass('aside_absolute');
					$('#aside').css('top', 0);
					$(window).scroll(function(){
						var $win = $(window);
						$('#aside').css('top', 0);
					});
				}
			}
		}
	}
	$(window).resize(checkWindowSize1);
});

$(function() {
	// 공통 위젯 설정
	$(document).on('click', ".widget_top .optn .btn_setup", function () {
		if ($(this).closest('.widget_top').hasClass('setup_on')) {
			$('.widget_top').removeClass('setup_on');
		} else {
			$('.widget_top').removeClass('setup_on');
			$(this).closest('.widget_top').addClass('setup_on');
		}
	});

	// 설정 숨김
	$('html')
	.on('mousedown.drop_setup', function(e){
		var evtTarget = $(e.target);
		if (!evtTarget.is('.drop_setup *') && !evtTarget.is('.btn_setup') && !evtTarget.is('.btn_setup *')){
			$('.widget_top').removeClass('setup_on');
		}
	})
	.on('click.drop_setup', function(e){
		var evtTarget = $(e.target);
		if (!evtTarget.is('.drop_setup *') && !evtTarget.is('.btn_setup') && !evtTarget.is('.btn_setup *')){
			$('.drop_setup').removeClass('setup_on');
		}
	});

	$(".gw_widget_tab .wgt_org").click(function () {
		$('#wgt_org').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_mail").click(function () {
		$('#wgt_mail').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_msg").click(function () {
		$('#wgt_msg').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_memo").click(function () {
		$('#wgt_memo').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_cal").click(function () {
		$('#wgt_cal').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_bod").click(function () {
		$('#wgt_bod').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_doc").click(function () {
		$('#wgt_doc').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_file").click(function () {
		$('#wgt_file').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_app").click(function () {
		$('#wgt_app').removeClass('wgt_fold');
	});

	$(".gw_widget_tab .wgt_todo").click(function () {
		$('#wgt_todo').removeClass('wgt_fold');
	});
});