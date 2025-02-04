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
                url: "http://3.36.64.39:7860/sdapi/v1/interrogate",
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

            // 로딩 모달 숨기기
            $("#loadingModal").modal("hide");

            // 설명 영역 보이기
            $(".content").css("overflow-y", "auto");
            $(".description-area").css('display', 'flex');
            $('.description-area').addClass('visible');

            // 화면 스크롤
            $('.content').animate({
                scrollTop: $('.description-area').offset().top
            }, 800);

            // API 결과를 positive-prompts에 표시
            if (response.caption) {
                $("#positive-prompts").text(response.caption);
            } else {
                alert("분석 결과가 없습니다.");
            }
        })
        .catch(function(error) {
            // FileReader 에러 또는 AJAX 에러
            console.error("API 요청 실패:", error);

            // 로딩 모달 숨기기
            $("#loadingModal").modal("hide");

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

        // 바로 API 호출 (3초 지연 X)
        generate_prompt();
    });

    // next 클릭
    // Next 버튼 클릭 이벤트 (개선된 img2img 호출)
    // Next 버튼 클릭 이벤트 (img2img 호출, 구성 보존 옵션 추가)
    // Next 버튼 클릭 이벤트 (구성은 유지, 스타일은 테마 프롬프트 적용)
    $("#next").click(function() {
        // 타겟 이미지 선택 여부 확인 (첫 번째 파일 인풋)
        const targetFile = $(".image-upload-area input")[0].files[0];
        if (!targetFile) {
            alert("타겟 이미지를 업로드해주세요.");
            return;
        }
        
        // 사용자가 선택한 스타일 변경 강도 (denoising_strength)
        // 이 값이 높을수록 프롬프트에 따른 스타일 및 세부 요소의 변화가 강해집니다.
        const styleStrength = 0.6;
        
        // 사용자가 입력한 프롬프트와 함께, 반드시 구도와 배치는 유지한다는 보강 문구 추가
        const userPrompt = $("#positive-prompts").val() || "";
        const preservationInstruction = " 반드시 사진 속 구도와 배치는 그대로 유지하면서, 나머지 분위기, 인테리어, 질감, 벽지 등의 스타일과 세부 요소는 아래 프롬프트 내용에 따라 변경.";
        const finalPrompt = userPrompt + preservationInstruction;
        
        // 로딩 모달 표시
        $("#loadingModal").modal("show");
        
        // 타겟 이미지 Base64 변환
        readFileAsBase64(targetFile)
            .then(function(base64TargetImage) {
                // img2img API에 전달할 payload 구성
                const payload = {
                    init_images: [base64TargetImage],
                    prompt: finalPrompt,
                    negative_prompt: $("#negative-prompts").val() || "",
                    steps: 20,
                    width: 512,
                    height: 512,
                    sampler_index: "Euler",
                    // 스타일 변경 강도(denoising_strength)를 사용 (예: 0.6이면 스타일만 크게 변경)
                    denoising_strength: styleStrength,
                    // 프롬프트(특히 구성 보존)를 더 강하게 반영하고 싶다면 cfg_scale 값을 높일 수 있습니다.
                    cfg_scale: 8,
                    override_settings: {
                        sd_model_checkpoint: "myModel.safetensors"
                    },
                    override_settings_restore_afterwards: true
                };

                // img2img API 호출
                $.ajax({
                    url: "http://3.36.64.39:7860/sdapi/v1/img2img",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    success: function(response) {
                        console.log("Generation success:", response);
                        $("#loadingModal").modal("hide");

                        if (response.images && response.images.length > 0) {
                            const base64Image = response.images[0];
                            // 생성된 이미지 Base64를 LocalStorage에 저장
                            localStorage.setItem("generatedImage", base64Image);
                            // 결과 페이지로 이동
                            location.href = "./result.html";
                        } else {
                            alert("이미지를 생성하지 못했습니다.");
                        }
                    },
                    error: function(err) {
                        $("#loadingModal").modal("hide");
                        console.error("Generation error:", err);
                        alert("이미지 생성 중 오류가 발생했습니다.");
                    }
                });
            })
            .catch(function(error) {
                $("#loadingModal").modal("hide");
                console.error("타겟 이미지 Base64 변환 실패:", error);
                alert("타겟 이미지 변환에 실패했습니다.");
            });
    });

});