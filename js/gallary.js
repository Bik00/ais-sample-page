$(document).ready(function () {
    // Listen for file input changes
    $('input[type="file"]').on('change', function (event) {
        // Get the uploaded file
        const file = event.target.files[0];

        if (file) {
            // Create a FileReader to read the file
            const reader = new FileReader();

            reader.onload = function (e) {
                // Update the sibling img src attribute with the file's data URL
                const imgTag = $(event.target).siblings('img');
                imgTag.attr('src', e.target.result);

                // Adjust the image size to 350px
                imgTag.css({
                    width: '200px',
                    height: '200px',
                });
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
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

    // "분석하기" 버튼 클릭 시 로딩 모달 표시 예시
    $('#generate').on('click', function () {
        showLoading();
        // 모의 API 호출 후 로딩 모달 숨기기
        setTimeout(function () {
            hideLoading();
            $(".content").css("overflow-y", "auto");
            $(".description-area").css('display', 'flex');
            $('.description-area').addClass('visible');

            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800); // 800ms 동안 애니메이션
        }, 3000); // 3초 후 숨김
    });
});
