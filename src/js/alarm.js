

// controller
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', sizing);  
    toggleSwitch();
    sizing();
    swiperDo();
});



function toggleSwitch(){
    const toggleSwitch = document.getElementById('toggle-switch');
    let isToggled = false;
    toggleSwitch.addEventListener('click', () => {
        isToggled = !isToggled;
        toggleSwitch.classList.toggle('on', isToggled);
    });
}


//컨텐츠 높이
function sizingFrmPrv (winH, sizeElm){
        // .prevAll() 대신 이전 형제 요소들을 순회합니다.
    let prevSibling = sizeElm.previousElementSibling;
    while (prevSibling) {
        winH -= prevSibling.offsetHeight;
        prevSibling = prevSibling.previousElementSibling;
    }
    sizeElm.style.height = `${winH}px`;
}
//GW7 와 컨텐츠 등 높이 계산
function sizing(){
        sizeHeight('snb_scroll');
        sizeHeight('content_area');
}
function sizeHeight(elem) {
    const sizeElm = document.getElementById(elem);
    const header = document.getElementById('layout_header');                     

    if (!sizeElm) return; // 요소가 없으면 함수를 종료합니다.
    const headerHeight = header? header.offsetHeight : 0;
    let winH = window.innerHeight - headerHeight;
    sizingFrmPrv(winH, sizeElm);
}


//스와이퍼
function swiperDo(){

    const allSlidesData = async ()=> setTimeout( ()=> Array.from({length: 30}, (_, i) => `Slide ${i+13}`), Math.random() );  // ************  데이터 등 가져오는 전체 슬라이드 ---> ajax나 백단 data통신으로 데이터를 계속 실시간으로 가져올 거라서 우선은 현재 슬라이드 개수 + 30개 정도로 함, 개수만 지정하고 데이터의 포맷팅은 하지 않음. 데이터를 어떻게 가져올지 몰라서 내가 굳이 title, id , content_text(본문), 시간 등을 설정할 필요 없어 보임. 
    const MAX_SLIDES = 40; // 전체 화면에 뿌려지는 데이터 최대 개수
    const LOAD_THRESHOLD = 3;
    let isLoading = false;
    let nextLoadIndex = 0; // 다음에 로드할 새로운 데이터 인덱스 (0~26  = 40 - 13)
    let loadedSlidesCount = 13; // 현재 로드된 슬라이드 수

    const mySwiper = new Swiper('.alarm_swiper', {
        spaceBetween: 8,
        loop: false,
        breakpoints:{
            320:{
                slidesPerView: 1.5,
                spaceBetween: 8,
                navigation: false,
            },
            768:{
                slidesPerView: 3.5,
                spaceBetween: 8,
                navigation: false,
            },
            // PC 설정 (1024px 이상)
            1024: {
                slidesPerView: 3.5, // 4개와 5번째 슬라이드가 반만 보이도록 설정
                spaceBetween: 8,
            }
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // touch 
        allowTouchMove: true, // PC에서는 스와이프 비활성화
        speed: 300,
        loop: false,
        on: {
            // 터치 슬라이드로 이동할 때도 데이터 로딩 체크
            slideChange: function() {
                checkLoadMore();
                updateNextButtonState();
            },
            reachEnd: function() {
                checkLoadMore();
                updateNextButtonState();
            }
        }
    });

    //'읽음' 체크상자 -> 스와이퍼 삭제
    function removeSlide(checkbox){
        const slideToRemove = checkbox.closest('.swiper-slide');
        if(!slideToRemove) return;

        const slideIndex = Array.from(slideToRemove.parentNode.children).indexOf(slideToRemove);
        
        mySwiper.removeSlide(slideIndex);
        loadedSlidesCount--;
        updateStatus();
        
        if (mySwiper.slides.length === 0) {
            const emptySlide = document.createElement('div');
            emptySlide.className = 'swiper-slide alarm_card';
            emptySlide.innerHTML = '<div class="none_data">표시할 데이터가 없습니다</div>';
            mySwiper.appendSlide(emptySlide);
            updateStatus();
        }
    }
    function chk_do(){
        const checkboxContainer = document.querySelector('.alrm_swiper_wrapper');
        if (!checkboxContainer) return;
        checkboxContainer.addEventListener('change', (event) => {
            // 이벤트가 발생한 대상(event.target)이 input[type="checkbox"]인지 확인
            if (event.target.classList.contains('input_chk')) {
                const checkbox = event.target;

                // ***************** 체크박스의 부모 요소에 클래스를 토글은 기존의 라온의 uiv7a.js에서 적용하고 있음.
                if (checkbox.checked) {
                    // 체크박스가 체크된 경우 (데이터 수집 또는 상태 변경)
                    console.log(`체크박스 ID ${checkbox.id}가 체크.`)
                    // 예: 데이터 배열에 ID 추가 또는 API 호출
                    // addSelectedData(chkElm.value); 

                    // ******************  swiper-slide 삭제 
                    removeSlide(checkbox);
                    
                }

                
            }
        });
    }
    // 데이터 로드 함수
    function loadMoreSlides() {
        if (isLoading || nextLoadIndex >= allSlidesData.length) return; //로딩 중이거나, 전체 슬라이드 개수보다 다음 데이터의index가 같거나 크다면 데이터를 더 불러올 필요가 없다. 
        
        isLoading = true;
        
        // 4~6개 랜덤으로 로드, 남은 데이터 숫자가 작으면 작은 숫자 기준으로 로딩 슬라이드 개수적용
        const loadCount = Math.min(
            Math.floor(Math.random() * 3) + 4, // 4~6개
            allSlidesData.length - nextLoadIndex // 남은 데이터 수
        );
        
        const slidesToAdd = allSlidesData
            .slice(nextLoadIndex, nextLoadIndex + loadCount) //로딩된 데이터 개수만큼 swiper-slide 만들기
            .map(content => `<div class="swiper-slide alarm_card">
                      <div class="alarm_card_header"><strong class="title ${클래스명}">${카테고}</strong><span class="icon_alarm icon_alarm_siren_wt"></span>
                        <div class="alarm_btn_box">
                          <div class="alarm_btn_ico_box"> 
                            <button type="button"><i class="icon_alarm icon_alarm_calendar_gry"></i></button>
                            <button type="button"><i class="icon_alarm icon_alarm_copy_gry"></i></button>
                            <button type="button"><i class="icon_alarm icon_alarm_recall_gry"></i></button>
                          </div>
                          <button type="button"> <i class="icon_alarm icon_alarm_more_bk"></i></button>
                        </div>
                        <div class="alarm_input"> 
                          <label class="chkbox" for="${iput아이디}">
                            <input class="input_chk" type="checkbox" name="" id="${iput아이디}"><span class="alrm_chk_on">읽음</span>
                          </label>
                        </div>
                      </div>
                      <div class="alarm_content"> 
                        <div class="alarm_h3">${제목}</div>
                        <div class="txt">${내용}</div>
                      </div>
                      <div class="alarm_bottom"> 
                        <div class="alarm_writer">홍길동</div>
                        <div class="alarm_time">
                           오늘 
                          <time datetime="2019-04-19T20:00:00">20:00</time>
                        </div>
                      </div>
                    </div>`);
        
        nextLoadIndex += loadCount;
        loadedSlidesCount += loadCount;
        
        requestAnimationFrame(() => {
            mySwiper.appendSlide(slidesToAdd);
            isLoading = false;
            updateStatus();
            updateNextButtonState();
        });
    }

    // 다음 버튼 클릭할 때 상태 업데이트
    function updateNextButtonState() {
        const nextBtn = document.getElementById('nextSwiperBtn');
        if (nextLoadIndex >= allSlidesData.length && mySwiper.isEnd) {
            nextBtn.classList.add('swiper-button-disabled');
        } else {
            nextBtn.classList.remove('swiper-button-disabled');
        }
    }
    // 상태 업데이트
    function updateStatus() {
        document.getElementById('slideCount').textContent = mySwiper.slides.length;
        document.getElementById('nextLoadNum').textContent = nextLoadIndex + 14;
    }
    // 데이터 로딩 체크 (터치 슬라이드 대응)
    function checkLoadMore() {
        const activeIndex = mySwiper.activeIndex;
        const visibleSlides = Math.round(mySwiper.params.slidesPerView);
        const totalSlides = mySwiper.slides.length;
        
        if (totalSlides - activeIndex <= visibleSlides + LOAD_THRESHOLD) {
            loadMoreSlides();
        }
    }
    
     // 다음 버튼 클릭 이벤트
     function init(){
         document.getElementById('nextSwiperBtn').addEventListener('click', function(e) {
             e.preventDefault();
             if (!isLoading) {
                 loadMoreSlides();
             }
         });
     
         // 초기 설정
         updateStatus();
         updateNextButtonState();
         chk_do();
     }
     init();
}



