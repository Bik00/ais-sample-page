let slideIndex = 1;
let originalInputs = [];

$(document).ready(function() {

    const base64Data = localStorage.getItem("generatedImage");
    if (base64Data) {
      // 2. <img> 태그에 설정
      $("#result-image").attr("src", base64Data);
    } else {
      // 저장된 이미지가 없다면?
      alert("생성된 이미지가 없습니다.");
    }

    $(document).on("click", "input[type='button']", function () {
        const value = $(this).val();
        $("#productModalLabel").text("선택된 항목");
        var output_body_text;
        var output_body_link;
        
        if (value == '벽지') {
            output_body_text = "제품 명 : 룸스토어 만능풀바른벽지 RS525055-3 실크벽지";
            output_body_link = "https://smartstore.naver.com/roomstore/products/3804207079?NaPm=ct%3Dm885dlqw%7Cci%3D6c3695c053245469dbcccd3cbb0dca15c618329a%7Ctr%3Dslsl%7Csn%3D402955%7Chk%3D1a727c8a78acfeff769911716eb3a0e4a930e4ed&nl-au=9acf9bba06b94368888cc72958ad26c7&nl-query=네이버+스토어+벽지";
        } else if (value == '책상') {
            output_body_text = "제품 명 : 조립식 노트북 공부 컴퓨터 긴 원룸 전면 나무 좁은 방 원목 긴 거실 우드 책상 테이블";
            output_body_link = "https://smartstore.naver.com/gowoostore/products/8233142118?NaPm=ct%3Dm888g6gg%7Cci%3D85ceeb91392a9ea93038fbcb8b0706b46b4d22be%7Ctr%3Dslsl%7Csn%3D1073441%7Chk%3D32dbf75b0573a44ee72a862b15c3339783d14191&nl-au=2f0e3cbe5a6d469c903bd73b692abf04&nl-query=네이버+스토어+책상";
        } else if (value == '스탠드') {
            output_body_text = "제품 명 : LED 달리아 집게형 클립형 무선 단 스탠드 조명 5W USB충전형 디밍 침대 독서등";
            output_body_link = "https://smartstore.naver.com/busanled/products/9248723136?NaPm=ct%3Dm888qeig%7Cci%3Ddbca4e98a19eadbc1aa07bf03e06098ed0387c1c%7Ctr%3Dslsl%7Csn%3D457130%7Chk%3Df4399f5fd6bc2394942f41c58c3a44f742d6302b&nl-au=2d322ede47304ebb9b1d923a79790197&nl-query=네이버+스토어+스탠드";
        } else if (value == '오브제') {
            output_body_text = "제품 명 : 유럽식 벽난로 카페 펜션 인테리어 모형장식 장식장";
            output_body_link = "https://smartstore.naver.com/seongseo/products/8982899251?NaPm=ct%3Dm8891ecg%7Cci%3Dc6592fe2b74fdc0147631a59ae1222341a1ff118%7Ctr%3Dslsl%7Csn%3D8378484%7Chk%3De93b896cb55464e70ad33bd05a0e2c9a0a67f5fa&nl-query=네이버+스토어+인테리어+장식";
        }
        
        $("#modal-explain-area").text(output_body_text);
        $("#modal-link-area").html('<a href="' + output_body_link + '">바로 가기</a>');

        // data-category 속성 값 읽기
        const category = $(this).data("category");

        // 슬라이드쇼 이미지 업데이트
        $(".mySlides img").each(function (index) {
            const newSrc = `../assets/images/${category}_${index + 1}.png`;
            $(this).attr("src", newSrc);
            $(this).css({
                "object-fit": "cover",
                "object-position": category === "stand" ? "top" : "center"
            });
        });

        // 썸네일 이미지 업데이트
        $(".slideshow-row .slideshow-column img").each(function (index) {
            let caption_text = `${value} ${index + 1}번 사진`;
            const newSrc = `../assets/images/${category}_${index + 1}.png`;
            $(this).attr("src", newSrc).attr("alt", caption_text);
        });

        showSlides(1);
    });

    $(document).on("click", "#modify", function () {

        originalInputs = [];

        // 현재 버튼 숨기기
        $(this).parent().text("");

        // "취소"와 "적용하기" 버튼 추가
        $(".action-buttons").append(`
                <button class="btn btn-secondary cancel-btn me-2" id="cancel">취소</button>
                <button class="btn btn-success apply-btn" id="apply">적용하기</button>
        `);


        $(".product-info input").each(function () {
            originalInputs.push({
                type: $(this).attr("type"),
                value: $(this).val(),
                category: $(this).data("category"),
                datatoggle: $(this).data("bs-toggle")
            });
        });

        // input 태그를 text로 변경
        $(".product-info input").each(function () {
            $(this).attr("type", "text").removeClass("btn btn-outline-secondary");
            $(this).attr("data-bs-toggle", "none");
        });

    });

    // 취소 버튼 클릭 이벤트
    $(document).on("click", "#cancel", function () {
        $(this).parent().text("");

        // "취소"와 "적용하기" 버튼 추가
        $(".action-buttons").append(`
                <button class="btn btn-primary mt-3 d-block mx-auto" id="modify">수정하기</button>
        `);

        $(".product-info input").each(function (index) {
            // 원래 상태 복원
            $(this).attr("type", originalInputs[index].type)
                .val(originalInputs[index].value)
                .addClass("btn btn-outline-secondary")
                .data("category", originalInputs[index].category)
                .attr("data-bs-toggle", "modal");
        });
    });

    // 적용하기 버튼 클릭 이벤트
    $(document).on("click", "#apply", function () {
        showLoading();
        setTimeout(function () {

            let newSrc;
            const currentSrc = $(".generated-image img").attr("src");

            $(".action-buttons").text("");

            // "취소"와 "적용하기" 버튼 추가
            $(".action-buttons").append(`
                    <button class="btn btn-primary mt-3 d-block mx-auto" id="modify">수정하기</button>
            `);

            // 랜덤 숫자 생성 (1부터 9 사이)
            const randomNumber = Math.floor(Math.random() * 9) + 1;

            // 새로운 src 경로 생성
            do {
                const randomNumber = Math.floor(Math.random() * 9) + 1;
                newSrc = `../assets/images/${randomNumber}.webp`;
            } while (newSrc === currentSrc);

            $(".product-info input").each(function (index) {
                $(this).attr("type", originalInputs[index].type)
                    .addClass("btn btn-outline-secondary")
                    .data("category", originalInputs[index].category)
                    .attr("data-bs-toggle", "modal");
            });

            // 이미지 태그의 src 속성 업데이트
            $(".generated-image img").attr("src", newSrc);

            hideLoading();
        }, 3000); // 3초 후 숨김
    });

});

function plusSlides(n) {
    showSlides(slideIndex += n);
  }
  
  function currentSlide(n) {
    showSlides(slideIndex = n);
  }
  
  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
  }

// 로딩 모달 표시
function showLoading() {
    $('#loadingModal').modal('show');
}

// 로딩 모달 숨기기
function hideLoading() {
    $('#loadingModal').modal('hide');
}