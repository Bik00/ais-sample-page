let slideIndex = 1;

$(document).ready(function() {
    $(document).on("click", "input[type='button']", function () {
        const value = $(this).val();
        $("#productModalLabel").text("선택된 항목");
        $("#modal-explain-area").text(`현재 선택된 항목은 "${value}"입니다.`);

        // data-category 속성 값 읽기
        const category = $(this).data("category");

        // 슬라이드쇼 이미지 업데이트
        $(".mySlides img").each(function (index) {
            const newSrc = `../assets/images/${category}_${index + 1}.webp`;
            $(this).attr("src", newSrc);
            $(this).css({
                "object-fit": "cover",
                "object-position": category === "stand" ? "top" : "center"
            });
        });

        // 썸네일 이미지 업데이트
        $(".slideshow-row .slideshow-column img").each(function (index) {
            let caption_text = `${value} ${index + 1}번 사진`;
            const newSrc = `../assets/images/${category}_${index + 1}.webp`;
            $(this).attr("src", newSrc).attr("alt", caption_text);
        });

        showSlides(1);
    });

    $(document).on("click", "#modify", function () {
        // 현재 버튼 숨기기
        $(this).parent().text("");

        // "취소"와 "적용하기" 버튼 추가
        $(".action-buttons").append(`
                <button class="btn btn-secondary cancel-btn me-2" id="cancel">취소</button>
                <button class="btn btn-success apply-btn" id="apply">적용하기</button>
        `);
    });

    // 취소 버튼 클릭 이벤트
    $(document).on("click", "#cancel", function () {
        $(this).parent().text("");

        // "취소"와 "적용하기" 버튼 추가
        $(".action-buttons").append(`
                <button class="btn btn-primary mt-3 d-block mx-auto" id="modify">수정하기</button>
        `);
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

            // 이미지 태그의 src 속성 업데이트
            $(".generated-image img").attr("src", newSrc);

            // 로딩 모달 숨기기
            $("#loadingModal").modal("hide");

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