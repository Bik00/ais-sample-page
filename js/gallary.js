
function generate_prompt() {
    var formData = new FormData();

    // Target Image (굳이 필요 없다면 주석 처리 가능)
    var targetImage = $(".image-upload-area input")[0].files[0];
    // Theme Image (분석할 이미지)
    var themeImage = $(".image-upload-area input")[1].files[0];

    // 파일이 제대로 선택되었는지 확인
    if (!themeImage) {
        alert("분석할 이미지(Theme Image)를 업로드해주세요.");
        return;
    }

    // FormData에 key/value로 업로드 파일을 담음
    // FastAPI 함수에서 `image: UploadFile = File(...)`로 받을 것이므로, key 이름을 "image"로 맞춤
    formData.append("image", themeImage);

    // 로딩 모달 표시 (선택 사항)
    $("#loadingModal").modal("show");

    $.ajax({
        url: "http://15.164.103.16:8000/image-to-text", // http:// 중복 제거
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#loadingModal").modal("hide");
            console.log("API 응답:", response);

            // 서버 응답은 { "caption": "...분석결과..." } 형태라고 가정
            if (response.caption) {
                // 예: 캡션 결과를 alert 또는 페이지 내 특정 영역에 표시
                alert("이미지 분석 결과: " + response.caption);
                // $(".content").append("<p>" + response.caption + "</p>");
            } else {
                alert("분석 결과가 없습니다.");
            }
        },
        error: function (xhr, status, error) {
            $("#loadingModal").modal("hide");
            console.error("API 요청 실패:", error);
            alert("API 요청 중 오류가 발생했습니다.");
        }
    });
}

$(document).ready(function () {
    // Listen for file input changes
    $('input[type="file"]').on('change', function (event) {
        // Get the uploaded file
        const file = event.target.files[0];
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Allowed image file extensions
        const $input = $(event.target);
        const imgTag = $input.siblings('img');

        // Check if a file is selected
        if (file) {
            // Get the file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Check if the file is a valid image
            if (!allowedExtensions.includes(fileExtension)) {
                alert("그림 파일만 선택 가능합니다.");
                // Reset the input file value to prevent invalid file selection
                $input.val('');
                imgTag.attr('src', '../assets/icons/image-upload.png');
                imgTag.css({
                    width: '50px',
                    height: '50px',
                });
                return; // Stop further execution
            }

            // Create a FileReader to read the file
            const reader = new FileReader();

            reader.onload = function (e) {
                // Update the sibling img src attribute with the file's data URL
                imgTag.attr('src', e.target.result);

                // Adjust the image size to 200px x 200px
                imgTag.css({
                    width: '200px',
                    height: '200px',
                });
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        } else {
            // No file selected, keep the previous image
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

    $('#generate').on('click', function () {
        const fileInputs = $('.image-upload-area input[type="file"]');
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        let allFilesValid = true;

        fileInputs.each(function () {
            const file = this.files[0];
            // 파일이 선택되지 않은 경우
            if (!file) {
                alert("파일을 선택해주세요.");
                allFilesValid = false;
                return false; // 루프 종료
            }

            // 파일 확장자 확인
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                alert("그림 파일을 선택해주세요.");
                allFilesValid = false;
                return false; // 루프 종료
            }
        });

        // 하나라도 유효하지 않으면 실행 중단
        if (!allFilesValid) {
            return;
        }

        // 모든 파일이 유효한 경우 로딩 모달 표시 및 후속 작업
        showLoading();
        setTimeout(function () {
            hideLoading();
            $(".content").css("overflow-y", "auto");
            $(".description-area").css('display', 'flex');
            $('.description-area').addClass('visible');

            generate_prompt();

            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800); // 800ms 동안 애니메이션
        }, 3000); // 3초 후 숨김
    });
});
