const index={
	
	init(){
	
		lbt();
		function lbt(){
		
			// 轮播图		
			setCarouselLfBtn();
	
			$(window).resize(function() {
				setCarouselLfBtn();
			});
	
			function setCarouselLfBtn() {
				if($(window).width() > 767) {
					$(' .carousel.slide ').mouseenter(function() {
	
						$(this).find('.left.carousel-control,.right.carousel-control').stop().show();
	
					});
	
					$(' .carousel.slide').mouseleave(function() {
	
						$(this).find('.left.carousel-control,.right.carousel-control').stop().hide();
					});
				}else{
					
					$('.carousel.slide').find('.left.carousel-control,.right.carousel-control').hide();
				}
			}
			
			// 置顶
			$(window).scroll(function(){
				
				if($(window).scrollTop()>500){
					$(".scroll-top").show();
				}else{
					$(".scroll-top").hide();
				}
			});
			
			
			//
			$(".scroll-top").click(function(){
				$("body,html").animate({
					scrollTop:0
				},500);
			});
			
		}
	}

	
}

export{
	index
}