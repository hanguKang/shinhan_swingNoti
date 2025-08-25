

// controller
document.addEventListener('DOMContentLoaded', () => {

    const swiperAlarm = document.querySelector('.alarm_swiper');
    
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 1280) {
            sizing();
        }
    }, 250)); // 0.25초 뒤에 실행
    // 페이지 로드 시 초기 가로 사이즈 확인
    if (window.innerWidth > 1280) {
        sizing();
    }
    window.addEventListener('resize', sizing);  

    toggleSwitch();
    if(swiperAlarm){
        swiperDo();
    }
    if(window.innerWidth < 721){
        init_Swiper_mobile_tab();
        init_mobile_board_list('.alarm_board_list_ul_m');
        init_mobile_board_list('.alarm_board_list_card_ul_m');
    }

    initializeModalHandlers();

    
});

let tab_swiper; 

const schedule_data = new Map([]);

// 디바운스 함수 정의
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Swiper를 초기화하고 파괴하는 함수
function init_Swiper_mobile_tab() {
    if (!tab_swiper) {
      // Swiper가 존재하지 않을 때만 초기화
      tab_swiper = new Swiper('.tab_swiper_alarm', {
        // 한 번에 3개씩 이동
        slidesPerView: 4.5,
        // 드래그 가능한 마우스 커서
        grabCursor: true,
        allowTouchMove:true,
        breakpoints:{
            320:{
                spaceBetween: 4.5,
                navigation: false,
            },
            768:{
                slidesPerView: 8.5,
                spaceBetween: 8,
                navigation: false,
            },
        },
      });

    }
  
}

function initializeModalHandlers() {
    // ----------------- 요소 선택 -----------------
    const modalOuter = document.querySelector('.modal_outer_alarm');
    const dimmedBackground = document.querySelector('.modal_dimmed_alarm');
    const filterModal = document.querySelector('.modal_srch_alarm_filter');
    const scheduleModal = document.querySelector('.modal_alarm_srch_schedule');

    const openFilterBtn = document.querySelector('.srch_alarm_filter_setting');
    const openScheduleBtn = document.querySelector('.srch_alarm_modal_opener');

    const closeFilterBtns = document.querySelectorAll('.btn_close_alarm_modal');
    const closeScheduleBtns = document.querySelectorAll('.btn_close_alarm_schedule_modal');

    const refreshDateBtn = document.querySelector('.alarm_srch_refresh');
    const refreshAllBtn = document.querySelector('.alarm_srch_refreshAll');
    const datePickers = document.querySelectorAll('.alarm_date_picker');
    

    // ----------------- 헬퍼 함수 -----------------
    const showModal = (modalElement) => {
        if (modalOuter && modalElement) {
            modalOuter.style.display = 'block';
            modalElement.style.display = 'block';
            modalElement.classList.add('open');
        }
    };

    const hideAllModals = () => {
        if (modalOuter) {
            modalOuter.style.display = 'none';
        }
        if (filterModal) {
            filterModal.style.display = 'none';
            filterModal.classList.remove('open');
        }
        if (scheduleModal) {
            scheduleModal.style.display = 'none';
            scheduleModal.classList.remove('open');
        }
    };

    const hideScheduleModal = () => {
        if (scheduleModal) {
            scheduleModal.style.display = 'none';
            scheduleModal.classList.remove('open');
        }
    };

    const handleDateFormat = (event) => {
        let value = event.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue += value.substring(0, 4);
            if (value.length > 4) {
                formattedValue += '-' + value.substring(4, 6);
                if (value.length > 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
            }
        }
        event.target.value = formattedValue;
    };

    // ----------------- 이벤트 리스너 등록 -----------------
    // 딤드 배경 클릭 시 모달 닫기
    if (dimmedBackground) {
        dimmedBackground.addEventListener('click', (event) => {
            // 클릭된 요소가 딤드 배경 자체인지 확인
            if (event.target === dimmedBackground) {
                // 스케줄 모달이 열려있으면 스케줄 모달만 닫기
                if (scheduleModal && scheduleModal.classList.contains('open')) {
                    hideScheduleModal();
                } else {
                    // 그렇지 않으면 모든 모달 닫기
                    hideAllModals();
                }
            }
        });
    }

    // 필터 모달 열기
    if (openFilterBtn) {
        openFilterBtn.addEventListener('click', () => showModal(filterModal));
    }

    // 스케줄 모달 열기 (필터 모달 내에서)
    if (openScheduleBtn) {
        openScheduleBtn.addEventListener('click', () => {
            // 필터 모달은 그대로 두고 스케줄 모달만 띄웁니다.
            showModal(scheduleModal);
        });
    }

    // 필터 모달 닫기 버튼
    closeFilterBtns.forEach(button => {
        button.addEventListener('click', () => hideAllModals());
    });

    // 스케줄 모달 닫기 버튼
    closeScheduleBtns.forEach(button => {
        button.addEventListener('click', () => hideScheduleModal());
    });

    // 날짜 입력 필드 포맷팅
    datePickers.forEach(datePicker => {
        datePicker.addEventListener('input', handleDateFormat);
    });

    // 날짜 입력 필드 초기화
    if (refreshDateBtn) {
        refreshDateBtn.addEventListener('click', () => {
            datePickers.forEach(input => input.value = '');
        });
    }

    // 전체 필터 초기화
    if (refreshAllBtn) {
        refreshAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.alarm_srch_filter_input').forEach(input => input.checked = false);
            datePickers.forEach(input => input.value = '');
        });
    }
}


function openModalWithApiCall(alarmId) {
    console.log(`모달을 엽니다. 전달된 알림 ID: ${alarmId}`);

    // 여기에 API 호출 로직을 구현


}

function removeCard(checkbox){
    const cardToRemove = checkbox.closest('.alarm_board_list_card_li_m');
    if(!cardToRemove) return;

    // transitionend 이벤트 리스너 추가
    const onTransitionEnd = function() {
        // 이벤트 리스너 제거
        cardToRemove.removeEventListener('transitionend', onTransitionEnd);
        cardToRemove.remove();
    };

    // 이벤트 리스너 등록
    cardToRemove.addEventListener('transitionend', onTransitionEnd);
    
    // 애니메이션 트리거
    cardToRemove.classList.add('remove_card');

}

function init_mobile_board_list(selector){
    const mobile_board_list = document.querySelector(selector);
    // 라벨 클릭만 처리 (중복 이벤트 방지)

    if(mobile_board_list){
        mobile_board_list.addEventListener('click', (event) => {
            //console.log(1111111111)
            const btnMore = event.target.closest('.alarm_more');
            const $label = event.target.closest('.chkbox');
            
            

            if (btnMore) {
                event.stopImmediatePropagation();
                event.preventDefault();
                const btnBox = btnMore.closest('.alarm_btn_box');
                if (btnBox) {
                    btnBox.classList.toggle('alarm_on');
                    
                }
            }


            if ($label){
                event.stopImmediatePropagation();
                event.preventDefault();
                const checkbox = $label.querySelector('.input_chk'); //이게 왜 오류가 나지?
                if(checkbox){
                    checkbox.checked = true;
                    $label.classList.add('chkbox_on');
                    const changeEvent = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);
    
                    //console.log('삭제되라')
                    removeCard(checkbox);
                    setTimeout(() => {
                        checkbox.checked = false;
                        $label.classList.remove('chkbox_on');
                    }, 300);
                    
                    return false;
                }
            }

        });
    }
}


function controlAlarmSwiperBtn() {
    const swiperWrapper = document.querySelector('.alrm_swiper_wrapper');
    if (swiperWrapper) {
        swiperWrapper.addEventListener('click', (event) => {
            // more 버튼이나 그 자식 요소를 클릭한 경우
            console.log(event.target)
            const btnMore = event.target.closest('.alarm_more');
            const btnCalender = event.target.closest('.alarm_btn_calender');
            const btnCopy = event.target.closest('.alarm_btn_copy');
            const btnRecall = event.target.closest('.alarm_btn_recall');
            if (btnMore) {
                const btnBox = btnMore.closest('.alarm_btn_box');
                if (btnBox) {
                    btnBox.classList.toggle('alarm_on');
                    
                    // 또는 특정 자식 요소에 적용하려면
                    // const icoBox = btnBox.querySelector('.alarm_btn_ico_box');
                    // if (icoBox) icoBox.classList.toggle('on');
                }
            }

            if(btnCalender) {
                // 다른 모든 모달 먼저 닫기
                const allModals = document.querySelectorAll('.modal_conts_alarm');
                allModals.forEach(modal => {
                    modal.style.display = 'none';
                });
                
                //아이디 전달
                const alarmCard = event.target.closest('.alarm_card');
                if (alarmCard) {
                    // data-alarmslide-id 속성에서 ID 값을 가져옵니다.
                    const alarmId = alarmCard.dataset.alarmSlideId;
                    
                    // 모달을 열기 위한 함수에 ID를 전달
                    openModalWithApiCall(alarmId);
                }

                // 캘린더 모달만 열기
                const modalOuter = document.querySelector('.modal_outer_alarm');
                const modalCalender = document.querySelector('.modal_calender_alarm');
                if (modalOuter && modalCalender) {
                    modalOuter.style.display = 'block';
                    modalCalender.style.display = 'block';
                    
                    console.log('캘린더 모달이 열렸습니다'); // 디버깅용
                }

            }

            if (btnCopy) {
                // 복사 기능 구현
                const slide = btnCopy.closest('.swiper-slide');
                if (slide) {
                    const title = slide.querySelector('.alarm_h3').textContent;
                    const content = slide.querySelector('.txt').textContent;
                    navigator.clipboard.writeText(`${title}\n${content}`).then(() => {
                        alert('복사되었습니다.');
                    }).catch(err => {
                        console.error('복사 실패:', err);
                    });
                }
            }

            if (btnRecall) {
                // 상기 기능 구현
                const slide = btnRecall.closest('.swiper-slide');
                if (slide) {
                    const title = slide.querySelector('.alarm_h3').textContent;
                    const content = slide.querySelector('.txt').textContent;
                    alert(`상기: ${title}\n내용: ${content}`);
                }
            }
        });
    }

}


function toggleSwitch(){
    const toggleSwitch = document.getElementById('alarm-concentration-toggle-switch');
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


// CSS 클래스 관리 유틸리티 함수
const ClassManager = {
    // 에러 상태 클래스
    addErrorStyles: (element) => {
        element.classList.add('error-slide', 'slide-error-state');
    },
    
    removeErrorStyles: (element) => {
        element.classList.remove('error-slide', 'slide-error-state');
    },
    
    // 로딩 상태 클래스
    addLoadingStyles: (element) => {
        element.classList.add('loading-slide', 'slide-loading-state');
    },
    
    removeLoadingStyles: (element) => {
        element.classList.remove('loading-slide', 'slide-loading-state');
    },
    
    // 비활성화 상태 클래스
    addDisabledStyles: (element) => {
        element.classList.add('disabled-btn', 'btn-disabled-state');
    },
    
    removeDisabledStyles: (element) => {
        element.classList.remove('disabled-btn', 'btn-disabled-state');
    }
};



////1. 우선 ajax를 사용한다는 보장이 없다. 2. 데이터는 전날부터 이미 쌓여 있을 가능성이 있고 출근 전에도 있을 수 있고 또는 아예 없을 수도 있어. 3. 그래서, ajax보다는 setTimeout을 사용해서 데이터가 온다는 것만 임의로 사용하고 싶어서 다음과 같이 사용하고 싶은데 안될까? 
//스와이퍼
function swiperDo(){

    const MAX_DISPLAY_SLIDES = 200; // 전체 화면에 뿌려지는 데이터 최대 개수
    const MAX_LOAD_PER_REQUEST = 30; // 데이터 요구할 때마다 로딩되는 개수 제한
    const LOAD_THRESHOLD = 3;
    const PRELOAD_THRESHOLD = 5; // 이 줄 추가
    const MIN_DATA_REQUIRED = 1; 

    let isLoading = false;
    let hasMoreData = true;
    let nextLoadIndex = 0; // 다음에 로드할 새로운 데이터 인덱스 (0~26  = 40 - 13)
    let loadedSlidesCount = 0; // 현재 로드된 슬라이드 수
    
    let preloadedData = [];
    let eventHandlers = null;
    let checkboxHandler = null;
    let originalEventHandlers = new Map();
    

    const categoryCounters = new Map();
    const categories = new Map([
                        ['board', '게시판'],
                        ['mail', '메일'],
                        ['drawer', '내서랍'],
                        ['SAQ', 'SAQ'],
                        ['memo', '쪽지'],
                        ['tag', '태그'],
                        ['subscribe', '구독'],
                        ['resource', '자원예약'],
                        ['system', '시스템'],
                        ['approve', '결재'],
                        ['schedule', '일정'],
                        ['survey', '설문'],
                        ['todo', '할일']
                    ]);
    // 카테고리별 카운터 초기화
    categories.forEach((value, key) => {
        categoryCounters.set(key, 0);
    })

    const mySwiper = new Swiper('.alarm_swiper', {
        spaceBetween: 8,
        loop: false,
        // touch 
        allowTouchMove: true, // PC에서는 스와이프 비활성화
        speed: 300,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
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
        on: {
            // 터치 슬라이드로 이동할 때도 데이터 로딩 체크
            slideChange: function() {
                checkPreload(); // 미리 로딩 체크
                updateButtonState();
            },
            reachEnd: function() {
                checkPreload(); // 미리 로딩 체크
                updateButtonState();
            }
        }
    });

    // 초기화
    initialize();

    function initialize() {
        // 기존 정리
        if (eventHandlers) {
            cleanup(eventHandlers);
        }
        
        checkInitialData();
        eventHandlers = setupEventListeners(); // 새로운 핸들러 등록
        updateUIState();
        
        return {
            cleanup: () => cleanup(eventHandlers),
            reload: () => {
                cleanup(eventHandlers);
                initialize();
            }
        };
    }

    controlAlarmSwiperBtn();

    // 최초 로딩 빌드된 초기 슬라이드가 있는지 확인
    function checkInitialData() {
        const initialSlides = document.querySelectorAll('.alarm_swiper .swiper-slide');
        const slides = Array.from(mySwiper.slides); // Swiper 슬라이드들을 배열로 변환
        const uniqueSlides = slides.filter((slide, index, self) =>
            index === self.findIndex((s) => s.isEqualNode(slide))
        );

        // 중복 제거된 슬라이드 개수 확인
        nextLoadIndex = uniqueSlides.length;
        loadedSlidesCount = uniqueSlides.length;
        
        if (initialSlides.length < MIN_DATA_REQUIRED) {
            // 초기 데이터가 없으면 빈 상태 표시
            renderNoData();
        } else {
            // 초기 데이터가 있으면 정상 상태 유지
            hasMoreData = true;
            updateButtonState();
            updateStatus();
        }
    }

    //****************   데이터 시뮬레이션 실제 구현시 삭제하고 대체하면 됨 */
    async function fetchData(){
        return new Promise( resolve => {

                //#삭제할 내용 *******************************************  setTimeout 데이터 들어오는 시간 임의로 산정
                setTimeout(()=>{
                    //가상의 데이터로 데이터를 원활 때 15% 확률로 데이터 없을 것이라 가정함
                    const noData = Math.random() < 0.15;
                    if(noData) {
                        resolve([]);
                        return;
                    }

                    const random = Math.random();
                    let loadCount; 
                    if (random < 0.2) {
                        loadCount = Math.floor(Math.random() * 5) + 1; // 1-5개
                    } else if (random < 0.4) {
                        loadCount = Math.floor(Math.random() * 10) + 6; // 6-15개
                    } else if (random < 0.5) {
                        loadCount = Math.floor(Math.random() * 5) + 16; // 16-20개
                    } else if (random < 0.6) {
                        loadCount = Math.floor(Math.random() * 5) + 21; // 21-25개                        
                    } else if (random < 0.7) {
                        loadCount = Math.floor(Math.random() * 5) + 21; // 21-25개                        
                    } else if (random < 0.8) {
                        loadCount = Math.floor(Math.random() * 5) + 21; // 21-25개                        
                    } else if (random < 0.9) {
                        loadCount = Math.floor(Math.random() * 5) + 21; // 21-25개                        
                    }else if (random <1) {
                        loadCount = Math.floor(Math.random() * 15) + 26; // 26-40개                        
                    }

                    // MAX_LOAD_PER_REQUEST로 제한
                    loadCount = Math.min(loadCount, MAX_LOAD_PER_REQUEST);
                    
                    // MAX_DISPLAY_SLIDES를 초과하지 않도록 조정
                    const remainingCapacity = MAX_DISPLAY_SLIDES - loadedSlidesCount;
                    if (remainingCapacity <= 0) {
                        resolve([]);
                        return;
                    }
                    loadCount = Math.min(loadCount, remainingCapacity);
                    

                    // 실제 데이터 생성
                    const data = Array.from({length: loadCount}, (_, i) =>{
                        
                        const categoryArray = Array.from(categories.keys());
                        // 1. Map의 size 속성으로 길이를 가져와 무작위 인덱스
                        const randomIndex = Math.floor(Math.random() * categories.size);
                        // 2. Map의 모든 키 get
                        const categoryId = categoryArray[randomIndex];
                        const categoryTitle = categories.get(categoryId);
                        
                       // 현재 카운트 가져오기 (없으면 0으로 초기화)
                        const currentCount = categoryCounters.get(categoryId) || 0;
                        
                        // 카운트 증가
                        categoryCounters.set(categoryId, currentCount + 1);
                        
                        return {
                            category_id: categoryId,
                            category_title: categoryTitle,
                            category_number: currentCount, // 카테고리별 고유 번호
                            id: `alarm_${nextLoadIndex + i}`,
                            title: `알림 ${nextLoadIndex + i + 1}`,
                            content: `이것은 ${nextLoadIndex + i + 1}번째 알림입니다.`,
                            time: new Date().toLocaleTimeString(),
                            writer:`${categoryTitle} 작성자 ${nextLoadIndex + i + 1}`,
                        };
                    });
                    
                    resolve(data);
                }, Math.random()*1000 + 500) //데이터 지연 시간은 최대 1.5초 미만으로 가정
            }

        );
    }

    // 데이터 미리 로딩 (버벅임 방지)
    async function preloadData() {
        if (isLoading || !hasMoreData || loadedSlidesCount >= MAX_DISPLAY_SLIDES) return;
        
        try {
            const newData = await fetchData();
            preloadedData = newData; // 데이터 캐싱
        } catch (error) {
            console.error('프리로딩 실패:', error);
        }
    }

    // 미리 로딩 체크 (버벅임 방지용)
    function checkPreload() {
        if (isLoading || !hasMoreData) return;
        
        // 정확한 프리로딩 시점 계산
        const visibleSlides = Math.ceil(mySwiper.params.slidesPerView);
        const remainingSlides = mySwiper.slides.length - (mySwiper.activeIndex + visibleSlides);
        
        const shouldPreload = remainingSlides <= PRELOAD_THRESHOLD && preloadedData.length === 0;
        
        if (shouldPreload) {
            preloadData();
        }
    }

    async function loadMoreData() {
        if (isLoading || !hasMoreData || loadedSlidesCount >= MAX_DISPLAY_SLIDES) return;
        
        isLoading = true;
        //로딩시잘할 때 버튼 상태 업데이트 
        updateButtonState();
        
        try {

            let dataToRender = [];

            // 프리로딩된 데이터가 있으면 사용
            if (preloadedData.length > 0) {
                dataToRender = preloadedData;
                preloadedData = []; // 캐시 비우기
                // 다음 데이터 미리 로딩
                setTimeout(preloadData, 100);
            } else {
                // 없으면 직접 로딩
                dataToRender = await fetchData();
            }


            if (dataToRender.length > 0) {
                renderSlides(dataToRender);
                nextLoadIndex += dataToRender.length;
                loadedSlidesCount += dataToRender.length;
                
                // MAX_DISPLAY_SLIDES 체크
                hasMoreData = loadedSlidesCount < MAX_DISPLAY_SLIDES;
            } else {
                hasMoreData = false;
                if (mySwiper.slides.length === 0) {
                    renderNoData();
                }
            }

        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            showErrorSlide('데이터를 불러오지 못했습니다');
        }finally{
            isLoading = false;
            updateStatus();
        }


        // 슬라이드 업데이트 후 Swiper 갱신
        // setTimeout(() => { //왜 이렇게 해야하는지 모르겠어. 다른 방법은 없어? 이게 없으면 작동을 안하더라고
        //     mySwiper.update();
        //     updateButtonState(); // 최종 버튼 상태 업데이트
        // }, 100);
    }

    //슬라이드 html 생성
    function createSlideHTML(data, options={}) {
        const {isError = false, isLoading= false} = options;

        let slideClasses = 'swiper-slide alarm_card';
        if (isError) slideClasses += ' error-slide slide-error-state';
        if (isLoading) slideClasses += ' loading-slide slide-loading-state';

        // 카테고리별 고유 ID 생성
        const categoryUniqueId = `${data.category_id}_${data.category_number}`;
        return `
            <div class="swiper-slide alarm_card ${slideClasses}" data-alarm-slide-id="${data.id}">
                <div class="alarm_card_header">
                    <strong class="alrm_cate_tit alrm_tit_${data.category_id}">${data.category_title}</strong><span class="icon_alarm icon_alarm_siren_wt"></span>
                    <div class="alarm_btn_box">
                        <div class="alarm_btn_wrap">
                            <div class="alarm_btn_ico_box"> 
                            <button type="button" class="alarm_btn_calender" ><i class="icon_alarm icon_alarm_calendar_gry"></i><span class="hidden">일정</span></button>
                            <button type="button" class="alarm_btn_copy" ><i class="icon_alarm icon_alarm_copy_gry"></i><span class="hidden">복사</span></button>
                            <button type="button" class="alarm_btn_recall" ><i class="icon_alarm icon_alarm_recall_gry"></i><span class="hidden">상기</span></button>
                            </div>
                        </div>
                        <button class="alarm_more" type="button"> <i class="icon_alarm icon_alarm_more_bk"></i></button>
                        </div>
                        <div class="alarm_input"> 
                        <label class="chkbox" for="alrm_chk_subscribe_0">
                            <input class="input_chk" type="checkbox" name="" id="alrm_chk_subscribe_0"><span class="alrm_chk_on">읽음</span>
                        </label>
                    </div>
                </div>
                <div class="alarm_content">
                    <div class="alarm_h3">${data.title}</div>
                    <div class="txt">${data.content}</div>
                </div>
                <div class="alarm_bottom">
                    <div class="alarm_writer">${data.writer}</div>
                    <div class="alarm_time">${data.time}</div>
                </div>
            </div>
        `;
    }


    // 슬라이드 렌더링
    function renderSlides(data) {
        // 빈 상태 제거
        const noAlarmSlide = document.querySelector('.no_alarm');
        if (noAlarmSlide) {
            const slideToRemove = noAlarmSlide.closest('.swiper-slide');
            if (slideToRemove) {
                mySwiper.removeSlide([...slideToRemove.parentNode.children].indexOf(slideToRemove));
            }
        }
        
        // 새 데이터 추가
        const slidesHTML = data.map(item => createSlideHTML(item));
        mySwiper.appendSlide(slidesHTML);

        // 슬라이드 업데이트 후 Swiper에 변경사항 알림
        // 새로 추가된 슬라이드의 체크박스에 직접 이벤트 리스너 등록
        requestAnimationFrame(() => {
            const newSlides = mySwiper.slides.slice(-data.length);
            newSlides.forEach(slide => {
                const $checkboxLabels = $(slide).find('.input_chk').closest('label');
                $checkboxLabels.addClass('chkbox').each(function(){
                    const $input = $(this).find('.input_chk');
                    if($input.is(':checked')) {
                        $(this).addClass('chkbox_on');
                    }
                    if($input.is(':disabled')) {
                        $(this).addClass('disabled');
                    }
                });
            });
            
            // 슬라이드 업데이트 후 Swiper에 변경사항 알림 (이 부분이 빠져있었음!)
            mySwiper.update();
            updateUIState();
        });

    }


    function renderNoData(){
        mySwiper.removeAllSlides();
        mySwiper.appendSlide(`
            <div class="swiper-slide">
                <div class="no_alarm">표시할 알림이 없습니다</div>
            </div>
        `);
        hasMoreData = false;
        updateButtonState();
        updateStatus();

        // 슬라이드 업데이트 후 Swiper에 변경사항 알림
        //mySwiper.update();
    }

    //html의 '읽음' 체크상자 -> 스와이퍼 삭제
    function removeSlide(checkbox){
        const slideToRemove = checkbox.closest('.swiper-slide');
        if(!slideToRemove) return;

        // transitionend 이벤트 리스너 추가
        const onTransitionEnd = function() {
            const slideIndex = Array.from(slideToRemove.parentNode.children).indexOf(slideToRemove);
            
            mySwiper.removeSlide(slideIndex);
            loadedSlidesCount--;
            
            if (mySwiper.slides.length === 0) {
                renderNoData();
            } else {
                updateStatus();
            }
            
            // 이벤트 리스너 제거
            slideToRemove.removeEventListener('transitionend', onTransitionEnd);
        };

        // 이벤트 리스너 등록
        slideToRemove.addEventListener('transitionend', onTransitionEnd);
        
        // 애니메이션 트리거
        slideToRemove.classList.add('removing');
    }



    // 버튼 상태 업데이트
    function updateButtonState() {
        const nextBtn = document.querySelector('.swiper-button-next');
        const prevBtn = document.querySelector('.swiper-button-prev');
        
        if (nextBtn) {
            const shouldDisable = isLoading || 
                                !hasMoreData ||
                                loadedSlidesCount >= MAX_DISPLAY_SLIDES ||
                                document.querySelector('.no_alarm');
            
            // Swiper의 기본 disabled 클래스만 사용
            nextBtn.classList.toggle('swiper-button-disabled', shouldDisable);
            
            // 비활성화 시 툴팁 표시
            if (shouldDisable) {
                ClassManager.addDisabledStyles(nextBtn);
                nextBtn.setAttribute('aria-disabled', 'true');
            } else {
                ClassManager.removeDisabledStyles(nextBtn);
                nextBtn.setAttribute('aria-disabled', 'false');
            }
        }
        
        if (prevBtn) {
            const shouldDisable = mySwiper.activeIndex === 0;
            prevBtn.classList.toggle('swiper-button-disabled', shouldDisable);
            prevBtn.style.pointerEvents = shouldDisable ? 'none' : 'auto';
        }
    }
    // 상태 업데이트
    function updateStatus() {
        const slideCountElement = document.getElementById('slideCount');
        const nextLoadNumElement  = document.getElementById('nextLoadNum');
        if (slideCountElement) {
            slideCountElement.textContent = mySwiper.slides.length;
        }
        
        if (nextLoadNumElement) {
            nextLoadNumElement.textContent = nextLoadIndex + 1; // 1-based numbering
        }
    }

    // 데이터 로딩 체크 
    function checkLoadMore() {
        if (isLoading || !hasMoreData || document.querySelector('.no_alarm')) return;
    
        // 현재 보이는 슬라이드 수 계산
        const visibleSlides = Math.ceil(mySwiper.params.slidesPerView);
        const remainingSlides = mySwiper.slides.length - (mySwiper.activeIndex + visibleSlides);
        
        // 정확히 마지막 visible 슬라이드가 보일 때 로딩
        if (remainingSlides <= LOAD_THRESHOLD) {
            loadMoreData();
        }
    }


    function setupEventListeners() {

        // 1. 필요한 요소 한 번에 선택
        const nextBtn = document.querySelector('.swiper-button-next');
        const prevBtn = document.querySelector('.swiper-button-prev');
        
        
        // 2. 모든 이벤트 핸들러 명시적 정의      
        const handleNextClick = (e) => {
            e.preventDefault();
            if (!e.currentTarget.classList.contains('swiper-button-disabled')) {
                checkLoadMore();
            }
        };
        
        const handlePrevClick = (e) => {
            e.preventDefault();
            // Swiper가 기본 처리하도록 함
        };
        
        const handleTouchEnd = () => {
            checkLoadMore();
        };
        
        // 3. 기존 이벤트 리스너 먼저 제거 (안전장치)
        
        if (nextBtn) {
            nextBtn.removeEventListener('click', handleNextClick);
            nextBtn.addEventListener('click', handleNextClick);
        }
        
        if (prevBtn) {
            prevBtn.removeEventListener('click', handlePrevClick);
            prevBtn.addEventListener('click', handlePrevClick);
        }
        
        // 4. Swiper 이벤트
        mySwiper.off('touchEnd', handleTouchEnd);
        mySwiper.on('touchEnd', handleTouchEnd);
        

        // 체크박스 이벤트 핸들러 등록 (jQuery 방식으로 통일)
        setupSwiperCheckboxHandler();

        // 5. 초기 상태 설정
        updateButtonState();
        updateStatus();
        
        // 6. 프리로딩 시작
        preloadData();
        
        // 7. 정리를 위해 핸들러 참조 반환
        return {
            handleNextClick,
            handlePrevClick,
            handleTouchEnd
        };
    }

    function setupSwiperCheckboxHandler() {
        $(document).off('click.swiperAlarm change.swiperAlarm');
        
        // 라벨 클릭만 처리 (중복 이벤트 방지)
        $(document).on('click.swiperAlarm', '.alarm_swiper .chkbox', function(e) {
            console.log('라벨 클릭됨:', this);
            
            e.stopImmediatePropagation();
            e.preventDefault();
            
            const $label = $(this);
            const checkbox = $label.find('.input_chk')[0];
            
            if (!checkbox) return false;
            
            console.log('체크박스 찾음:', checkbox);
            
            // 체크박스 상태 설정
            checkbox.checked = true;
            $label.addClass('chkbox_on');
            
            // DOM에 변경사항 강제 적용
            $label.trigger('change');
            
            console.log('체크 설정 완료, 삭제 시작');
            removeSlide(checkbox);
            
            // 삭제 후 정리
            setTimeout(() => {
                checkbox.checked = false;
                $label.removeClass('chkbox_on');
            }, 100);
            
            return false;
        });
    }

    function updateUIState() {
        updateButtonState();
        updateSlideStates();
        updateStatusDisplay();
        updateStatus();
    }

    // 에러 슬라이드 생성 함수
    function createErrorSlide(message = '데이터를 불러오지 못했습니다') {
        return `
            <div class="swiper-slide error-slide slide-error-state">
                <div class="error-message">
                    <i class="icon-alert">⚠️</i>
                    <h3>오류 발생</h3>
                    <p>${message}</p>
                    <button class="retry-btn btn-primary" onclick="loadMoreData()">다시 시도</button>
                </div>
            </div>
        `;
    }

    // 슬라이드 상태 업데이트
    function updateSlideStates() {
        const slides = document.querySelectorAll('.swiper-slide');
        
        slides.forEach(slide => {
            // 에러 상태 확인 및 클래스 적용
            if (slide.querySelector('.error-message')) {
                ClassManager.addErrorStyles(slide);
            } else {
                ClassManager.removeErrorStyles(slide);
            }
            
            // 로딩 상태 확인 및 클래스 적용
            if (slide.querySelector('.loading-message')) {
                ClassManager.addLoadingStyles(slide);
            } else {
                ClassManager.removeLoadingStyles(slide);
            }
        });
    }

    function updateStatusDisplay() {
        const statusElement = document.getElementById('statusDisplay');
        if (!statusElement) return;
        
        let statusText = '';
        
        if (isLoading) {
            statusText = '<span class="status-loading">🔄 데이터 로딩 중...</span>';
        } else if (!hasMoreData) {
            statusText = '<span class="status-complete">✅ 모든 데이터 로드 완료</span>';
        } else if (loadedSlidesCount >= MAX_DISPLAY_SLIDES) {
            statusText = '<span class="status-warning">⚠️ 최대 표시 개수 도달</span>';
        } else {
            statusText = `<span class="status-normal">📊 ${loadedSlidesCount}개 로드됨</span>`;
        }
        
        statusElement.innerHTML = statusText;
    }

    // 에러 슬라이드 생성 및 추가 함수
    function showErrorSlide(message = '데이터를 불러오지 못했습니다') {
        const errorSlideHTML = createErrorSlide(message);
        mySwiper.appendSlide(errorSlideHTML);
        
        // 5초 후 에러 슬라이드 자동 제거
        setTimeout(() => {
            removeErrorSlides();
        }, 5000);
    }

    // 에러 슬라이드 제거 함수
    function removeErrorSlides() {
        const errorSlides = document.querySelectorAll('.error-slide');
        errorSlides.forEach(slide => {
            const index = Array.from(slide.parentNode.children).indexOf(slide);
            if (index !== -1) {
                mySwiper.removeSlide(index);
            }
        });
    }
    function cleanup(eventHandlers) {
        if (!eventHandlers) return;

        // jQuery 이벤트 정리 추가
        $(document).off('click.swiperAlarm');

        originalEventHandlers.forEach((handlers, checkbox) => {
            const jqueryEvents = $._data(checkbox, 'events');
            if (jqueryEvents && jqueryEvents.change) {
                handlers.forEach((originalHandler, index) => {
                    if (jqueryEvents.change[index]) {
                        jqueryEvents.change[index].handler = originalHandler.handler;
                    }
                });
            }
        });
        
        originalEventHandlers.clear();

        // 우리의 이벤트 핸들러 제거
        document.removeEventListener('change', handleCheckboxChange, true);
        
        // Swiper container 찾기
        const swiperContainer = document.querySelector('.alarm_swiper');
        const nextBtn = document.querySelector('.swiper-button-next');
        const prevBtn = document.querySelector('.swiper-button-prev');
        
        // 이벤트 리스너 제거
        if (swiperContainer && swiperContainer._checkboxHandler) {
            swiperContainer.removeEventListener('change', swiperContainer._checkboxHandler, true);
            delete swiperContainer._checkboxHandler;
        }
        
        if (nextBtn && eventHandlers.handleNextClick) {
            nextBtn.removeEventListener('click', eventHandlers.handleNextClick);
        }
        
        if (prevBtn && eventHandlers.handlePrevClick) {
            prevBtn.removeEventListener('click', eventHandlers.handlePrevClick);
        }
        
        // Swiper 이벤트 제거
        if (eventHandlers.handleTouchEnd) {
            mySwiper.off('touchEnd', eventHandlers.handleTouchEnd);
        }
        
        // Swiper 인스턴스 정리 (필요시)
        if (mySwiper && typeof mySwiper.destroy === 'function') {
            mySwiper.destroy(true, true);
        }
    }

    // 정리 함수 반환
    return {
        cleanup: cleanup,
        reload: function() {
            cleanup();
            initialize();
        }
    };

}


