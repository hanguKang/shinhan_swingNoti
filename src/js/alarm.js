$(function(){
    const toggleSwitch = document.getElementById('toggle-switch');
    let isToggled = false;
    toggleSwitch.addEventListener('click', () => {
        isToggled = !isToggled;
        toggleSwitch.classList.toggle('on', isToggled);
    });
});

function sizingFrmPrv (winH, sizeElm){
        // .prevAll() 대신 이전 형제 요소들을 순회합니다.
    let prevSibling = sizeElm.previousElementSibling;
    while (prevSibling) {
        winH -= prevSibling.offsetHeight;
        prevSibling = prevSibling.previousElementSibling;
    }
    sizeElm.style.height = `${winH}px`;
}

function sizeHeight(elem) {
    const sizeElm = document.getElementById(elem);
    const header = document.getElementById('layout_header');                     

    if (!sizeElm) return; // 요소가 없으면 함수를 종료합니다.
    const headerHeight = header? header.offsetHeight : 0;
    let winH = window.innerHeight - headerHeight;
    sizingFrmPrv(winH, sizeElm);
}
// GW7 사이드 메뉴
document.addEventListener('DOMContentLoaded', () => {
    function sizing(){
        sizeHeight('snb_scroll');
        sizeHeight('content_area');
    }
    sizing();
    window.addEventListener('resize', sizing);

    swiperDo();
});

function swiperDo(){
    const swiper = new Swiper('.alarm_swiper', {
      spaceBetween: 8,
      loop: false,
      breakpoints:{
        320:{
            allowTouchMove: true,
            slidesPerView: 1.5,
            spaceBetween: 8,
        },
        768:{
            slidesPerView: 3.5,
            allowTouchMove: true,
            spaceBetween: 8,
            navigation: false,
        },
        // PC 설정 (1024px 이상)
        1024: {
            slidesPerView: 3.5, // 4개와 5번째 슬라이드가 반만 보이도록 설정
            spaceBetween: 8,
            allowTouchMove: false, // PC에서는 스와이프 비활성화
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        }
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
}