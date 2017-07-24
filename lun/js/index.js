$(function() {
	//轮播图的touch事件
	function banner() {
		var carousel = document.querySelector('.carousel');
		var startX = 0;
		var moveX = 0;
		var distance = 0;
		//绑定触屏事件
		carousel.addEventListener('touchstart', function(e) {
			//记录触屏开始的数据
			startX = e.targetTouches[0].clientX;
		})
		carousel.addEventListener('touchmove', function(e) {
				//记录触屏开始的数据
				moveX = e.targetTouches[0].clientX;
				distance = moveX - startX;
			})
			//绑定触屏结束事件
		carousel.addEventListener('touchend', function(e) {
			if (distance > 0) {
				$(this).carousel('prev');
			}
			if (distance < 0) {
				$(this).carousel('next');
			}
			//数据重置
			startX = 0;
			moveX = 0;
			distance = 0;
		})
	}
	banner();
	//轮播图禁止自动滚动
	$('#carousel-example-generic').carousel({
		pause: true,
		interval: false,
		wrap: false
	});

});