
/***********公共js代码************ */

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

// 一键分享
$(function(){

    _positon();
   $(window).resize(function(){
    _positon();
   })

   function _positon(){
       
    var w= $(window).width();
    if(w>1280){
         $(".one-share").css("left",(w-1280)/2);
    }else{
     $(".one-share").css("left",10);  
    }
   }

});
