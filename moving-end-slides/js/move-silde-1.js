(function($) {
	var y = 0;
	// .move-silde-warp .page
	function moveSilde(warp, child) {
		var view = (function() {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			};
		}());
		var now = 0,
			vH = view.h,
			timer = null,
			setartTouchY = 0,
			starY = 0;

		warp[0].addEventListener("touchstart", start, false);
		warp[0].addEventListener("touchmove", move, false);
		warp[0].addEventListener("touchend", end, false);

		function start(ev) {
			child.css('transition', 'none');
			ev = ev.changedTouches[0];
			setartTouchY = ev.pageY;
			starY = y;
			clearInterval(timer);
		}

		function move(ev) {
			ev = ev.changedTouches[0];
			var iDis = ev.pageY - setartTouchY;
			y = starY + iDis;
			child.css('WebkitTransform', "translateY(" + y + "px)");
			child.css('transform', "translateY(" + y + "px)");
		}

		function end(ev) {
			now = y / vH;
			now = -Math.round(now);
			if (now < 0) {
				now = 0;
			}
			if (now > child.length - 1) {
				now = child.length - 1;
				child.css('WebkitTransform', "translateY(0)");
				child.css('transform', "translateY(0)");
			}
			page();
			console.log(ev);
			return false;
		}

		function page() {
			y = -now * vH;
			child.css('transition', '0.5s');
			child.css('WebkitTransform', "translateY(" + y + "px)");
			child.css('transform', "translateY(" + y + "px)");
		}
	}
	$(document).ready(function() {
		moveSilde($('.move-silde-warp'), $('.page-warp').children());

		$('.box').on('touchend', function(event) {
			event.preventDefault();
			var self = $(this);
			$(this).siblings().animate({
				opacity: 0
			}, 1000, function() {
				// self.on('touchend', function(event) {
				// 	event.preventDefault();
				// 	y = $(this).height();
				// });
				self.parents('.move-silde-warp').trigger('touchend');
			});
		});

		/*$('.box').on('touchend', function(event) {
			event.preventDefault();
			if ($(this).next()[0].tagName.toLowerCase() === 'canvas') {
				$(this).next()[0].className = 'active';
				$(this).animate({
					bottom: $(document).height() / 2.3 - $(this).height(),
					left: $(document).width() / 2 - $(this).width() / 2,
				}, 1500);
				$(this).next().animate({
					opacity: 1
				}, 1000, function() {
					$(this).parent().animate({
						opacity: 0
					}, function() {
						$(this).css('WebkitTransform', "translateY(" + -$(this).parent().height() + "px)");
						$(this).css('transform', "translateY(" + -$(this).parent().height() + "px)");
					});
				});
			}
		});*/
	});

}(jQuery));