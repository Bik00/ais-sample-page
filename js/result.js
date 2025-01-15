$(document).ready(function() {
    $(document).on("click", "input[type='button']", function () {
        const value = $(this).val();
        $("#productModalLabel").text("선택된 항목");
        $(".modal-body").text(`현재 선택된 항목은 "${value}"입니다.`);
    });
});