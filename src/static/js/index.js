!function(o,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(o.umd={})}(this,function(o){!function(){function l(o,t){var e=t.split("."),n="",i="";0<=e.length&&(n=(n=e[0]||"").trim()),1===e.length?i="init":2===e.length&&(i=e[1].trim());var r=window[o];if(r&&r[n]){var l=r[n][i];"function"==typeof l&&l()}}window.onload=function(){for(var o=document.querySelectorAll("script[data-umd]"),t=0;t<o.length;t++){var e="umd",n=o[t];if(n){e=n.getAttribute("data-parent")||e;var i=(n.getAttribute("data-umd")||"").split(/,|;|&/);for(t=0;t<i.length;t++){var r=i[t]||"";""!==r.trim()&&l(e,r.trim())}}}}}();var t={init:function(){!function(){function o(){767<$(window).width()?($(" .carousel.slide ").mouseenter(function(){$(this).find(".left.carousel-control,.right.carousel-control").stop().show()}),$(" .carousel.slide").mouseleave(function(){$(this).find(".left.carousel-control,.right.carousel-control").stop().hide()})):$(".carousel.slide").find(".left.carousel-control,.right.carousel-control").hide()}o(),$(window).resize(function(){o()}),$(window).scroll(function(){500<$(window).scrollTop()?$(".scroll-top").show():$(".scroll-top").hide()}),$(".scroll-top").click(function(){$("body,html").animate({scrollTop:0},500)})}()}};o.index=t,Object.defineProperty(o,"__esModule",{value:!0})});
