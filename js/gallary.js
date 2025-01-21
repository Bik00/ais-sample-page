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
    formData.append("image", themeImage);

    // 로딩 모달 표시 (선택 사항)
    $("#loadingModal").modal("show");

    $.ajax({
        url: "http://15.164.103.16:8000/image-to-text",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        /**
         * 여기에 CORS 관련 요청 헤더를 추가
         * (실제 문제 해결은 서버에서 응답 헤더를 올바르게 보내야 가능)
         */
        headers: {
            // 임의로 작성한 예시
            "Access-Control-Request-Method": "POST, OPTIONS",
            "Access-Control-Request-Headers": "Content-Type",
            // 필요 시 Authorization 같은 헤더도 추가 가능
            // "Authorization": "Bearer <token>"
        },
        success: function (response) {
            $("#loadingModal").modal("hide");
            console.log("API 응답:", response);

            if (response.caption) {
                alert("이미지 분석 결과: " + response.caption);
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

    $('#generate').on('click', function () {
        const fileInputs = $('.image-upload-area input[type="file"]');
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        let allFilesValid = true;

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

        showLoading();
        setTimeout(function () {
            hideLoading();
            $(".content").css("overflow-y", "auto");
            $(".description-area").css('display', 'flex');
            $('.description-area').addClass('visible');

            generate_prompt();

            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800);
        }, 3000);
    });
});