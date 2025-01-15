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