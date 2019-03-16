

// 置顶
$(window).scroll(function () {

    if ($(window).scrollTop() > 500) {
        $(".scroll-top").show();
    } else {
        $(".scroll-top").hide();
    }
});


//
$(".scroll-top").click(function () {
    $("body,html").animate({
        scrollTop: 0
    }, 500);
});