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

            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800); // 800ms 동안 애니메이션
        }, 3000); // 3초 후 숨김
    });
});
