

// controller
document.addEventListener('DOMContentLoaded', () => {

    //스와이퍼
    const swiperAlarm = document.querySelector('.alarm_swiper');
    if(swiperAlarm){
        swiperDo();
    }

    //사이징에 따른 snb메뉴 및 컨텐츠 자동 높이 조정
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


    //모바일 이벤트 
    if(window.innerWidth < 721){
        init_Swiper_mobile_tab();
        init_mobile_board_list('.alarm_board_list_ul_m');
        init_mobile_board_list('.alarm_board_list_card_ul_m');
    }

    //모달 이벤트
    initializeModalHandlers();

    //dropdown 이벤트
    alarmDopdownHandler();

    //알림모달의 필터세팅싱크 이벤트
    initializeFilterHandlers();


    initializeAlarmSettings();

    removeAlarm();

    doNotDistrub();

    chk_all_ctrl();
});

let tab_swiper; 

const schedule_data = new Map([]);

function chk_all_ctrl() {
    const selectAllCheckbox = document.getElementById('alrm_chk_emergency_all');
    const selectAllButton = document.querySelector('.btn_cancel_slct_all');
    const selectDeleteButton = document.querySelector('.btn_cancel_slct_del');
    const totalCountSpan = document.querySelector('.alarm_cancel_noti span');
    const listContainer = document.querySelector('.alarm_tbl_box');
    const individualCheckboxes = listContainer.querySelectorAll('.alarm_cancel_board_body .input_emergency');

    if (!selectAllCheckbox || !selectAllButton || !selectDeleteButton || !totalCountSpan || !listContainer) {
        console.error('필요한 HTML 요소를 찾을 수 없습니다.');
        return;
    }

    // 개별 체크박스 상태에 따라 전체 체크박스 상태를 업데이트하는 함수
    function updateSelectAllStatus() {
        const checkedCount = Array.from(individualCheckboxes).filter(cb => cb.checked).length;
        const totalCount = individualCheckboxes.length;
        const allChecked = checkedCount === totalCount;
        
        selectAllCheckbox.checked = allChecked;
        selectAllButton.textContent = allChecked ? '전체 해제' : '전체 선택';
    }

    // '전체 선택' 체크박스 이벤트
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        individualCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateSelectAllStatus();
    });

    // '전체 선택' 버튼 클릭 이벤트
    selectAllButton.addEventListener('click', function() {
        // 전체선택 체크박스의 현재 상태를 반전시킴
        selectAllCheckbox.checked = !selectAllCheckbox.checked;
        // 체크박스의 변경 이벤트를 강제로 발생시켜 동기화
        selectAllCheckbox.dispatchEvent(new Event('change'));
    });

    // '전체 삭제' 버튼 클릭 이벤트
    selectDeleteButton.addEventListener('click', function() {
        // 선택된 항목들을 필터링
        const checkedBoxes = Array.from(individualCheckboxes).filter(cb => cb.checked);
        
        if (checkedBoxes.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        checkedBoxes.forEach(checkbox => {
            const row = checkbox.closest('.alarm_cancel_board_body');
            if (row) {
                row.remove();
            }
        });
        
        // 삭제 후 전체 항목 수 업데이트
        const newCount = document.querySelectorAll('.alarm_cancel_board_body').length;
        totalCountSpan.textContent = newCount;
        
        // 전체 체크박스 상태 업데이트
        updateSelectAllStatus();
    });

    // 개별 체크박스 변경 이벤트
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectAllStatus);
    });

    // 초기 상태 설정
    updateSelectAllStatus();
}




// 여러 시점에서 실행 시도
// document.addEventListener('DOMContentLoaded', chk_all_ctrl);
// window.addEventListener('load', chk_all_ctrl);
// setTimeout(chk_all_ctrl, 500);
// setTimeout(chk_all_ctrl, 1000);

function doNotDistrub(){
    // 모든 이벤트의 기준이 될 가장 상위 컨테이너
    const mainContainer = document.querySelector('.alarm__setting_conts_box.alarm_setting_schedule_on_off_box');
    // 추가 버튼
    const addButton = document.querySelector('.add_alarm_not_disturb');

    if (mainContainer && addButton) {
        
        // 이벤트 위임으로 삭제 버튼 및 체크박스 변경 이벤트 처리
        mainContainer.addEventListener('click', (event) => {
            const clickedElement = event.target;

            // '삭제' 버튼 클릭 시
            if (clickedElement.closest('.remove_alarm_not_disturb')) {
                const scheduleItem = clickedElement.closest('.dp_flx');
                if (scheduleItem) {
                    scheduleItem.remove();
                }
            }
        });

        mainContainer.addEventListener('change', (event) => {
            const checkbox = event.target;
            // 변경된 체크박스가 속한 `.dp_flx` 요소를 찾음
            const scheduleItem = checkbox.closest('.dp_flx');

            if (!scheduleItem) return;

            // '평일' 체크박스 클릭 시
            if (checkbox.id.includes('filter_setting_day')) {
                const weekdayCheckboxes = scheduleItem.querySelectorAll(`
                    input[id*="filter_setting_mon"],
                    input[id*="filter_setting_tue"],
                    input[id*="filter_setting_wed"],
                    input[id*="filter_setting_thu"],
                    input[id*="filter_setting_fri"]
                `);

                weekdayCheckboxes.forEach(weekdayCheckbox => {
                    weekdayCheckbox.checked = checkbox.checked;
                });
            } 
            // '월, 화, 수, 목, 금' 체크박스 클릭 시
            else if (checkbox.id.includes('filter_setting_')) {
                const weekdayCheckbox = scheduleItem.querySelector('input[id*="filter_setting_day"]');
                const allDaysChecked = ['mon', 'tue', 'wed', 'thu', 'fri'].every(day => 
                    scheduleItem.querySelector(`input[id*="filter_setting_${day}"]`).checked
                );
                
                if (allDaysChecked) {
                    weekdayCheckbox.checked = true;
                } else {
                    weekdayCheckbox.checked = false;
                }
            }
        });

        // 추가 기능
        addButton.addEventListener('click', () => {
            const newElement = document.createElement('div');
            newElement.className = 'dp_flx';

            const uniqueId = Date.now();
            newElement.setAttribute('data-disturb-id', uniqueId);

            newElement.innerHTML = `
                <ul class="alarm_srch_filter_list_ul alarm_setting_schedule_on_off_ul">
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_day_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_day" id="filter_setting_day_${uniqueId}">
                            <span class="alarm_srch_filter_txt">평일</span>
                        </label>
                    </li>
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_mon_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_mon" id="filter_setting_mon_${uniqueId}">
                            <span class="alarm_srch_filter_txt">월</span>
                        </label>
                    </li>
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_tue_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_tue" id="filter_setting_tue_${uniqueId}">
                            <span class="alarm_srch_filter_txt">화</span>
                        </label>
                    </li>
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_wed_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_wed" id="filter_setting_wed_${uniqueId}">
                            <span class="alarm_srch_filter_txt">수</span>
                        </label>
                    </li>
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_thu_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_thu" id="filter_setting_thu_${uniqueId}">
                            <span class="alarm_srch_filter_txt">목</span>
                        </label>
                    </li>
                    <li class="alarm_srch_filter_list_li alarm_setting_schedule_on_off_li">
                        <label class="alarm_srch_filter_label" for="filter_setting_fri_${uniqueId}">
                            <input class="alarm_srch_filter_input" type="checkbox" name="filter_setting_fri" id="filter_setting_fri_${uniqueId}">
                            <span class="alarm_srch_filter_txt">금</span>
                        </label>
                    </li>
                </ul>
                <div class="alarm_setting_schedule_time">
                    <input type="time" id="no-disturb-time1_${uniqueId}" name="no-disturb-time1"> -
                    <input type="time" id="no-disturb-time2_${uniqueId}" name="no-disturb-time2">
                </div>
                <div class="alarm_btn_ico_box">
                    <button class="remove_alarm_not_disturb" type="button">
                        <i class="icon_alarm icon_alarm_close_bk"></i>
                        <span class="hidden">방해금지 스케쥴 삭제</span>
                    </button>
                </div>
            `;
            const addButtonParent = addButton.closest('.dp_block');
            if(addButtonParent) {
                addButtonParent.parentNode.insertBefore(newElement, addButtonParent);
            }
        });
    }
}

function removeAlarm(){
    const removeButtons = document.querySelectorAll('.remove_alarm');

    if(removeButtons){
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                if (row) {
                    row.remove();
                }
            });
        });
    }
}

//세팅 페이지 핸들러
function initializeAlarmSettings() {
    // '초기화' 버튼 요소를 가져옵니다.
    const resetButton = document.querySelector('.alarm_setting_on_off_refresh');

    // 초기화 버튼 클릭 시 이벤트를 처리합니다.
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // 'alarm_setting_on_off' 클래스를 가진 ul의 모든 input[type="checkbox"] 요소를 가져옵니다.
            const checkboxes = document.querySelectorAll('.alarm_setting_on_off input[type="checkbox"]');
            
            // 각 체크박스를 순회하며 'checked' 상태를 false로 설정합니다.
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            console.log("알림 종류 설정이 초기화되었습니다.");

        });
    }

    const mobileToggle = document.querySelector('#alarm-concentration-toggle-switch-m');
    if (mobileToggle) {
        mobileToggle.addEventListener('change', (event) => {
            const isMobileAlarmOn = event.target.checked;
            console.log('모바일 알림 상태:', isMobileAlarmOn ? '켜짐' : '꺼짐');
            // 여기에 모바일 알림 상태를 저장하는 로직을 추가할 수 있습니다.
        });
    }

    // 집중근무 알림 토글 스위치 이벤트 핸들러
    // 동기화할 토글 스위치들을 선택합니다.
    const syncedToggles = document.querySelectorAll('.alarm_concentration_toggle_switch');

    if (syncedToggles.length > 0) {
        // 각 토글에 'change' 이벤트 리스너를 추가합니다.
        syncedToggles.forEach(toggle => {
            toggle.addEventListener('change', (event) => {
                const isChecked = event.target.checked;
                
                // 다른 모든 동기화 토글의 상태를 변경된 상태로 업데이트합니다.
                syncedToggles.forEach(otherToggle => {
                    if (otherToggle !== event.target) {
                        otherToggle.checked = isChecked;
                    }
                });

                // 변경 상태를 콘솔에 기록합니다.
                const logMessage = isChecked ? '집중 관련 알림이 모두 켜짐' : '집중 관련 알림이 모두 꺼짐';
                console.log(logMessage);

                // 여기에 상태를 서버에 저장하는 로직을 추가할 수 있습니다.
            });
        });
    }


}

//알람 세팅 함수2
function handleFilterCategoryButtonClick(category) {
    // 모든 모달을 닫습니다.
    document.querySelectorAll('.modal_conts_alarm').forEach(modal => {
        modal.style.display = 'none';
    });

    // 필터 모달을 엽니다.
    const modalOuter = document.querySelector('.modal_outer_alarm');
    const modalFilter = document.querySelector('.modal_filter_alarm');
    if (modalOuter && modalFilter) {
        modalOuter.style.display = 'block';
        modalFilter.style.display = 'block';
    }

    // '알림 종류' 카테고리 내의 모든 체크박스를 가져옵니다.
    const categoryInputs = document.querySelectorAll('.alarm_srch_filter_list_cate .alarm_srch_filter_input');

    // 모든 체크박스의 상태를 초기화하고, 선택된 카테고리만 활성화합니다.
    categoryInputs.forEach(input => {
        const inputCategory = input.name.replace('filter_alarm_', '');

        if (inputCategory === category) {
            // 해당 카테고리와 일치하면 체크하고 비활성화합니다.
            input.checked = true;
            input.disabled = true;
        } else {
            // 일치하지 않으면 체크를 해제하고 비활성화합니다.
            input.checked = false;
            input.disabled = true;
        }
    });

    // 다른 모든 체크박스(알림 확인, 제목/내용, 조회기간)의 비활성화를 해제합니다.
    const otherInputs = document.querySelectorAll(
        '.alarm_srch_filter_list_confirm .alarm_srch_filter_input, ' +
        '.alarm_srch_filter_list_title .alarm_srch_filter_input, ' +
        '.alarm_srch_filter_list_period .alarm_srch_filter_input, ' +
        '#filter_alarm_direct_text'
    );
    otherInputs.forEach(input => {
        input.disabled = false;
    });

    console.log(`필터 모달이 열렸습니다. '${category}' 필터가 활성화되었습니다.`);
}
//알람 세팅 함수1
// 특정 카테고리를 고정하는 새로운 핸들러 함수입니다.
// 이 함수는 '알림 종류' 카테고리 버튼이 클릭되었을 때 호출됩니다.
function setCategoryFilter(category) {
    // Get all checkboxes within the 'alarm type' category.
    const categoryInputs = document.querySelectorAll('.alarm_srch_filter_list_cate .alarm_srch_filter_input');

    // Loop through each checkbox and disable all of them in this category group.
    categoryInputs.forEach(input => {
        const inputCategory = input.id.replace('filter_alarm_', '');

        // Disable all checkboxes in this specific category group.
        input.disabled = true;

        // Only check the one that matches the page's category.
        if (inputCategory === category) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });

    console.log(`The modal is open. The '${category}' filter is fixed and the entire category is disabled. Other filters can be used freely.`);
}

// The main function to initialize all filter handlers.
function initializeFilterHandlers() {
    const filterModal = document.querySelector('.modal_srch_alarm_filter');
    const filterListContainer = document.querySelector('.srch_alarm_filter_list');
    const directInputCheckbox = document.getElementById('filter_alarm_direct_text');
    const dateRadios = document.querySelectorAll('input[name="filter_alarm_date"]');
    const dateInputs = document.querySelectorAll('.alarm_date_picker, .alarm_date_picker2');
    const resetButton = document.querySelector('.alarm_srch_refreshAll');
    const openFilterBtn = document.querySelector('.srch_alarm_filter_setting');

    // ----------------------------------------------------
    // 1. Event Listeners
    // ----------------------------------------------------

    if (filterModal) {
        filterModal.addEventListener('change', (event) => {
            const target = event.target;
            // The logic for date radio buttons and direct input remains unchanged.
            if (target.matches('input[name="filter_alarm_date"]')) {
                if (directInputCheckbox) directInputCheckbox.checked = false;
                dateInputs.forEach(input => input.value = '');
            } else if (target.matches('#filter_alarm_direct_text')) {
                dateRadios.forEach(radio => radio.checked = false);
            }
            syncFiltersWithButtons();
        });
    }

    dateInputs.forEach(input => {
        input.addEventListener('input', () => {
            formatDateInput(input);
            if (directInputCheckbox) directInputCheckbox.checked = true;
            dateRadios.forEach(radio => radio.checked = false);
            syncFiltersWithButtons();
        });
    });

    if (resetButton) resetButton.addEventListener('click', () => {
        resetAllFilters();
        syncFiltersWithButtons();
    });

    if (openFilterBtn) {
        openFilterBtn.addEventListener('click', () => {
            // Modal opening logic
            const modalOuter = document.querySelector('.modal_outer_alarm');
            const modalFilter = document.querySelector('.modal_filter_alarm');
            if (modalOuter && modalFilter) {
                modalOuter.style.display = 'block';
                modalFilter.style.display = 'block';
            }
            // Example: Call the function to fix the 'mail' category when the button is clicked.
            // This needs to be called based on the specific page.
            // For this example, we'll assume a 'data-category' attribute exists on the button.
            const category = openFilterBtn.dataset.category;
            if(category) {
                setCategoryFilter(category);
            }
            // If no specific category, do nothing and allow all checkboxes to be active by default.
        });
    }

    if (filterListContainer) {
        filterListContainer.addEventListener('click', (event) => {
            const closeBtn = event.target.closest('.btn_alarm_srch_filter .icon_alarm_close_gry');
            const showMoreBtn = event.target.closest('.btn_checked_list_show');

            if (closeBtn) {
                const parentButton = closeBtn.closest('.btn_alarm_srch_filter');
                const checkboxId = parentButton.getAttribute('data-checkbox-id');
                const checkboxToUncheck = document.getElementById(checkboxId);
                if (checkboxToUncheck) {
                    checkboxToUncheck.checked = false;
                    if (checkboxToUncheck.id === 'filter_alarm_direct_text') {
                        dateInputs.forEach(input => input.value = '');
                    }
                }
                syncFiltersWithButtons();
            } else if (showMoreBtn) {
                // Toggle the expanded state and re-render the buttons.
                filterListContainer.classList.toggle('show_all_checked_btns');
                syncFiltersWithButtons();
            }
        });
    }

    // ----------------------------------------------------
    // 2. Helper Functions
    // ----------------------------------------------------

    function resetAllFilters() {
        // Reset all checkboxes and radios to unchecked and enabled.
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
            input.disabled = false;
        });
        
        // Reset date inputs.
        dateInputs.forEach(input => input.value = '');

        // Re-apply disabled state for fixed categories if they exist.
        const openFilterBtn = document.querySelector('.srch_alarm_filter_setting');
        const category = openFilterBtn.dataset.category;

        if (category) {
            const categoryInputs = document.querySelectorAll('.alarm_srch_filter_list_cate .alarm_srch_filter_input');
            categoryInputs.forEach(input => {
                const inputCategory = input.id.replace('filter_alarm_', '');
                input.disabled = true;
                if (inputCategory === category) {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });
        }
    }

    function formatDateInput(input) {
        let value = input.value.replace(/\D/g, '').substring(0, 8);
        let formattedValue = '';
        if (value.length > 4) { formattedValue += value.substring(0, 4) + '-'; value = value.substring(4); }
        if (value.length > 2) { formattedValue += value.substring(0, 2) + '-'; value = value.substring(2); }
        formattedValue += value;
        input.value = formattedValue;
    }

    function syncFiltersWithButtons() {
        const isExpanded = filterListContainer.classList.contains('show_all_checked_btns');
        
        filterListContainer.innerHTML = '';
        const checkedItems = [];
        const allDateInputs = document.querySelectorAll('.alarm_date_picker, .alarm_date_picker2');
        const dateStartInput = allDateInputs[0];
        const dateEndInput = allDateInputs[1];

        if (directInputCheckbox && directInputCheckbox.checked) {
            const startDate = (dateStartInput && dateStartInput.value) || '';
            const endDate = (dateEndInput && dateEndInput.value) || '';
            let buttonText = '직접입력';
            if (startDate || endDate) {
                buttonText += ` : ${startDate || ''} - ${endDate || ''}`;
            }
            checkedItems.push({ text: buttonText, id: directInputCheckbox.id });
        } else {
            const checkedDateRadio = document.querySelector('input[name="filter_alarm_date"]:checked');
            if (checkedDateRadio) {
                const label = checkedDateRadio.closest('label');
                const text = label.querySelector('.alarm_srch_filter_txt').textContent.trim();
                checkedItems.push({ text: text, id: checkedDateRadio.id });
            }
        }

        document.querySelectorAll(
            '.alarm_srch_filter_list_cate .alarm_srch_filter_input:checked, ' +
            '.alarm_srch_filter_list_confirm .alarm_srch_filter_input:checked, ' +
            '.alarm_srch_filter_list_title .alarm_srch_filter_input:checked'
        ).forEach(input => {
            const label = input.closest('label');
            const text = label.querySelector('.alarm_srch_filter_txt').textContent.trim();
            if (text) {
                checkedItems.push({ text: text, id: input.id });
            }
        });

        let buttonCount = 0;
        checkedItems.forEach(item => {
            const newButton = document.createElement('button');
            newButton.classList.add('btn', 'btn_alarm_srch_filter');
            newButton.setAttribute('type', 'button');
            newButton.setAttribute('data-checkbox-id', item.id);
            newButton.innerHTML = `<span class="btn_alarm_txt">${item.text}</span><i class="icon_alarm icon_alarm_close_gry"></i>`;
            
            if (!isExpanded && buttonCount >= 3) {
                newButton.classList.add('hidden');
            }
            filterListContainer.appendChild(newButton);
            buttonCount++;
        });

        const showMoreBtn = document.querySelector('.btn_checked_list_show');
        if (buttonCount > 3) {
            if (!showMoreBtn) {
                const newShowMoreBtn = document.createElement('button');
                newShowMoreBtn.classList.add('btn', 'btn_checked_list_show');
                newShowMoreBtn.setAttribute('type', 'button');
                newShowMoreBtn.setAttribute('title', '확장/축소');
                newShowMoreBtn.innerHTML = isExpanded ? '-' : '+';
                filterListContainer.appendChild(newShowMoreBtn);
            } else {
                showMoreBtn.innerHTML = isExpanded ? '-' : '+';
            }
        } else if (showMoreBtn) {
            showMoreBtn.remove();
        }
    }
}



//드롭다운
// 드롭다운 선택 처리 함수
function handleDropdownSelection(value) {
    console.log(`선택된 값: ${value}에 대한 작업을 수행합니다.`);
    // 여기에 선택된 값에 따른 추가 로직 구현
}
//드롭다운 핸들러
function alarmDopdownHandler(){
    // 문서 전체에 클릭 이벤트를 위임하여 모든 드롭다운을 관리합니다.
    document.addEventListener('click', (event) => {
                // 클릭된 요소가 드롭다운인지 확인
        const clickedDropDown = event.target.closest('.alarm_drop_down');
        
        // 1. 드롭다운이 열려있는 상태에서 외부를 클릭하면 모두 닫습니다.
        document.querySelectorAll('.alarm_drop_down.alarm_active_down').forEach(openDropDown => {
            if (openDropDown !== clickedDropDown) {
                openDropDown.classList.remove('alarm_active_down');
            }
        });

        // 2. 클릭된 요소가 드롭다운이거나 그 내부에 있을 때 처리합니다.
        if (clickedDropDown) {
            // 클릭된 요소가 드롭다운 아이템(버튼)인지 확인합니다.
            const isItemButton = event.target.closest('.alarm_drop_down_item button');
            
            if (isItemButton) {
                // 아이템(버튼) 클릭 핸들러
                const selectedValue = isItemButton.textContent.trim();
                console.log('아이템이 클릭되었습니다:', selectedValue);
                
                // 선택된 아이템의 텍스트를 드롭다운 박스에 표시
                const selectedValueElement = clickedDropDown.querySelector('.alarm_dropdown_selected_value');
                if (selectedValueElement) {
                    selectedValueElement.textContent = selectedValue;
                }
                
                // 아이템을 선택했으니 드롭다운을 닫습니다.
                clickedDropDown.classList.remove('alarm_active_down');
                
                // 여기에 선택된 값으로 추가 작업을 수행하는 함수 호출
                handleDropdownSelection(selectedValue);
            } else {
                // 아이템이 아닌 드롭다운 본체를 클릭했을 때 열거나 닫습니다.
                clickedDropDown.classList.toggle('alarm_active_down');
            }
        }
    });
}

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


// 모달을 열고 닫는 단일 함수
const toggleModal = (modalSelector, action) => {
    const modalOuter = document.querySelector('.modal_outer_alarm');
    const targetModal = document.querySelector(modalSelector);

    if (!modalOuter || !targetModal) {
        console.error(`Modal element not found for selector: ${modalSelector}`);
        return;
    }

    if (action === 'open') {
        modalOuter.style.display = 'block';
        targetModal.style.display = 'block';
    } else if (action === 'close') {
        targetModal.style.display = 'none';

        // 열려있는 다른 모달이 있는지 확인
        const activeModals = modalOuter.querySelectorAll('.modal_conts_alarm[style*="block"], .modal_alarm_srch_schedule[style*="block"]');
        if (activeModals.length === 0) {
            modalOuter.style.display = 'none';
        }
    }
};

function initializeModalHandlers (){

    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // 필터 모달 열기
        if (target.closest('.srch_alarm_filter_setting')) {
            e.preventDefault();
            show('.modal_outer_alarm');
            show('.modal_srch_alarm_filter');
        }
        
        else if(target.closest('.alarm_setting_on_off_edit')){
            e.preventDefault();
            show('.modal_outer_alarm');
            show('.modal_cancel_alarm');
        }
        
        // 스케줄 종속 모달 열기
        else if (target.closest('.srch_alarm_modal_opener')) {
            e.preventDefault();
            show('.modal_alarm_srch_schedule');
        }
        
        // 모든 닫기 버튼
        else if (target.closest('.btn_close_alarm_modal')) {
            e.preventDefault();
            closeModal(target);
        }
        
        
        // 딤드 클릭
        else if (target.classList.contains('modal_dimmed_alarm')) {
            closeDimmed();
        }
    });
    
    // ESC 키
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDimmed();
        }
    });
    
    // 헬퍼 함수들
    function show(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'block';
    }
    
    function hide(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    }
    
    function isVisible(selector) {
        const el = document.querySelector(selector);
        return el && el.style.display === 'block';
    }
    
    function closeModal(button) {
        // 어떤 모달의 버튼인지 확인
        if (button.closest('.modal_alarm_srch_schedule')) {
            hide('.modal_alarm_srch_schedule');
        } else if (button.closest('.modal_srch_alarm_filter')) {
            hide('.modal_srch_alarm_filter');
            hide('.modal_alarm_srch_schedule');
            hide('.modal_outer_alarm');
        } else if (button.closest('.modal_calender_alarm')) {
            hide('.modal_calender_alarm');
            hide('.modal_outer_alarm');
        } else if (button.closest('.modal_cancel_alarm')) {  // ← 새 모달 추가
            hide('.modal_cancel_alarm');
            hide('.modal_outer_alarm');
        }
    }
    
    function closeDimmed() {
        if (isVisible('.modal_alarm_srch_schedule')) {
            hide('.modal_alarm_srch_schedule');
        } else if (isVisible('.modal_srch_alarm_filter')) {
            hide('.modal_srch_alarm_filter');
            hide('.modal_outer_alarm');
        } else if (isVisible('.modal_calender_alarm')) {
            hide('.modal_calender_alarm');
            hide('.modal_outer_alarm');
        } else if (isVisible('.modal_cancel_alarm')) {  // ← 새 모달 추가
            hide('.modal_cancel_alarm');
            hide('.modal_outer_alarm');
        }
    }


}
class ModalManager {
    constructor() {
        this.modalOuter = document.querySelector('.modal_outer_alarm');
        this.dimmed = document.querySelector('.modal_dimmed_alarm');
        this.activeModals = [];
        
        // 모달 셀렉터 매핑
        this.modalSelectors = {
            'calender': '.modal_calender_alarm',
            'filter': '.modal_srch_alarm_filter', 
            'schedule': '.modal_alarm_srch_schedule',
            'cancel': '.modal_cancel_alarm'
        };
        
        // 종속 관계: schedule은 filter의 자식
        this.dependencies = {
            'schedule': 'filter'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 모달 열기 버튼들
        document.addEventListener('click', (e) => {
            const target = e.target;

            // 각 모달별 열기 버튼
            if (target.matches('.srch_alarm_filter_setting')) {
                e.preventDefault();
                this.openModal('filter');
            } else if (target.matches('.srch_alarm_modal_opener')) {
                e.preventDefault();
                this.openModal('schedule');
            } else if (target.matches('[data-modal-open]')) {
                e.preventDefault();
                this.openModal(target.dataset.modalOpen);
            }

            // 모달 닫기 버튼들
            if (target.matches('.btn_close_alarm_modal, .btn_close_alarm_schedule_modal, .btn_close_alarm_calender')) {
                e.preventDefault();
                e.stopPropagation();
                this.closeTopModal();
            }
        });

        // 딤드 클릭으로 닫기
        this.dimmed?.addEventListener('click', (e) => {
            if (e.target === this.dimmed) {
                this.closeTopModal();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }

    openModal(modalName) {
        const selector = this.modalSelectors[modalName];
        const modal = document.querySelector(selector);
        
        if (!modal) {
            console.warn(`모달을 찾을 수 없습니다: ${modalName}`);
            return;
        }

        // 종속 모달 체크
        const parentModal = this.dependencies[modalName];
        if (parentModal && !this.activeModals.includes(parentModal)) {
            console.warn(`${modalName} 모달은 ${parentModal} 모달이 열려있을 때만 열 수 있습니다.`);
            return;
        }

        // 첫 번째 모달이면 outer 표시
        if (this.activeModals.length === 0) {
            this.modalOuter.style.display = 'block';
        }

        // 모달 표시
        modal.style.display = 'block';
        this.activeModals.push(modalName);

        // z-index 조정 (나중에 열린 모달이 위에)
        modal.style.zIndex = 10001 + this.activeModals.length;
    }

    closeModal(modalName) {
        const selector = this.modalSelectors[modalName];
        const modal = document.querySelector(selector);
        
        if (!modal) return;

        // 이 모달을 부모로 하는 종속 모달들 먼저 닫기
        Object.entries(this.dependencies).forEach(([childModal, parentModal]) => {
            if (parentModal === modalName && this.activeModals.includes(childModal)) {
                this.closeModal(childModal);
            }
        });

        // 모달 숨기기
        modal.style.display = 'none';
        modal.style.zIndex = ''; // z-index 초기화
        this.activeModals = this.activeModals.filter(name => name !== modalName);

        // 모든 모달이 닫혔으면 outer 숨기기
        if (this.activeModals.length === 0) {
            this.modalOuter.style.display = 'none';
        }
    }

    closeTopModal() {
        if (this.activeModals.length > 0) {
            const topModal = this.activeModals[this.activeModals.length - 1];
            this.closeModal(topModal);
        }
    }

    closeAllModals() {
        [...this.activeModals].forEach(modalName => {
            this.closeModal(modalName);
        });
    }

    // 특정 모달이 열려있는지 확인
    isModalOpen(modalName) {
        return this.activeModals.includes(modalName);
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
                const checkbox = $label.querySelector('.input_chk'); 
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
                    <strong class="alrm_cate_tit alarm_tit_${data.category_id}">${data.category_title}</strong><span class="icon_alarm icon_alarm_siren_wt"></span>
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


