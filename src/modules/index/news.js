
const news={
	
	init(){
	
		$(function(){

			// tab toggle
			$(".news-banner-toggle ._item").click(function(e){
		
				var p=$(this).parents(".news-banner-toggle");
				$("._item",p).removeClass("active");
				$(this).addClass("active");
				var id=$(this).attr("data-target");
				console.log(this)
				$(".news-list-item").removeClass("active");
				$(id).addClass("active");

			})
		});
	}

}

export{
	news
}