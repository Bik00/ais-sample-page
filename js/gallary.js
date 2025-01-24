// -- 1) 이미지 파일을 Base64로 변환하는 헬퍼 함수
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);  // data:image/png;base64,.... 형태
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

// -- 2) Stable Diffusion WebUI Interrogate API 호출
function generate_prompt() {
    // Target Image (굳이 필요 없다면 주석 가능)
    var targetImage = $(".image-upload-area input")[0].files[0];
    // Theme Image (분석할 이미지)
    var themeImage = $(".image-upload-area input")[1].files[0];

    // 파일이 제대로 선택되었는지 확인
    if (!themeImage) {
        alert("분석할 이미지(Theme Image)를 업로드해주세요.");
        return;
    }

    // 로딩 모달 표시
    $("#loadingModal").modal("show");

    // Theme Image -> Base64 변환 후 API 호출
    readFileAsBase64(themeImage)
        .then(function(base64Data) {
            // interrogate API로 POST
            return $.ajax({
                url: "http://15.164.213.86:7860/sdapi/v1/interrogate",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    // base64Data 자체가 "data:image/png;base64,..." 형식일 것입니다.
                    image: base64Data,
                    // "blip" 또는 "clip" 등 사용 가능
                    model: "clip"
                }),
            });
        })
        .then(function(response) {
            // API 호출 성공
            console.log("Interrogate Response:", response);
            $("#loadingModal").modal("hide");

            if (response.caption) {
                // alert("이미지 분석 결과: " + response.caption);
                $("#positive-prompts").text(response.caption);
            } else {
                alert("분석 결과가 없습니다.");
            }
        })
        .catch(function(error) {
            // FileReader 에러 또는 AJAX 에러
            $("#loadingModal").modal("hide");
            console.error("API 요청 실패:", error);
            alert("API 요청 중 오류가 발생했습니다.");
        });
}

// -- 3) 페이지 로드 후 이벤트 바인딩
$(document).ready(function () {
    // 3.1. 파일 선택 시 미리보기 처리
    $('input[type="file"]').on('change', function (event) {
        const file = event.target.files[0];
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Allowed image file extensions
        const $input = $(event.target);
        const imgTag = $input.siblings('img');

        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                alert("그림 파일만 선택 가능합니다.");
                $input.val('');
                imgTag.attr('src', '../assets/icons/image-upload.png');
                imgTag.css({
                    width: '50px',
                    height: '50px',
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                imgTag.attr('src', e.target.result);
                imgTag.css({
                    width: '200px',
                    height: '200px',
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("파일 선택이 취소되었습니다. 이전 파일을 유지합니다.");
        }
    });

    // 로딩 모달 표시
    function showLoading() {
        $('#loadingModal').modal('show');
    }
    // 로딩 모달 숨기기
    function hideLoading() {
        $('#loadingModal').modal('hide');
    }

    // 3.2. '분석하기' 버튼 클릭 시
    $('#generate').on('click', function () {
        const fileInputs = $('.image-upload-area input[type="file"]');
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        let allFilesValid = true;

        // 두 개의 파일 Input에 대해 유효성 검사
        fileInputs.each(function () {
            const file = this.files[0];
            if (!file) {
                alert("파일을 선택해주세요.");
                allFilesValid = false;
                return false;
            }
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                alert("그림 파일을 선택해주세요.");
                allFilesValid = false;
                return false;
            }
        });

        if (!allFilesValid) {
            return;
        }

        // 3초간 로딩 -> 이후 설명 영역 표시
        showLoading();
        setTimeout(function () {
            hideLoading();
            $(".content").css("overflow-y", "auto");
            $(".description-area").css('display', 'flex');
            $('.description-area').addClass('visible');

            // 실제 API 호출
            generate_prompt();

            // 화면 스크롤
            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800);
        }, 3000);
    });
});
