(function($) {
	function moveSilde(warp, child) {
		$.each(child, function() {
			if ($(this).css('position') === 'absolute') {
				child.length--;
			}
		});
		var view = (function() {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			};
		}());
		var now = 0,
			vH = view.h,
			setartTouchY = 0,
			starY = 0,
			y = 0;

		warp[0].addEventListener("touchstart", start, false);
		// warp[0].addEventListener("touchmove", move, false);
		warp[0].addEventListener("touchend", end, false);

		function start(ev) {
			child.css('transition', 'none');
			ev = ev.changedTouches[0];
			setartTouchY = ev.pageY;
			starY = y;
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
			if (now > child.length - 2) {
				now = child.length - 2;
				child.css('WebkitTransform', "translateY(0)");
				child.css('transform', "translateY(0)");
			}
			return false;
		}

		function page() {
			y = -now * vH;
			child.css('transition', '0.5s');
			child.css('WebkitTransform', "translateY(" + y + "px)");
			child.css('transform', "translateY(" + y + "px)");
		}
	}

	function pageTurning(elem) {
		elem.animate({
			opacity: 0
		}, 1000, function() {
			$(this).css('WebkitTransform', "translateY(" + -$(this).parent().height() + "px)");
			$(this).css('transform', "translateY(" + -$(this).parent().height() + "px)");
			// $(this).remove();
		});
	}
	var draw = [
		'images/page-2-top-text-caiyun.png',
		'images/page-2-top-text-yinyuan.png',
		'images/page-2-top-text-jiankang.png',
		'images/page-2-top-text-pingan.png'
	];
	window.onload = function() {
		$('.loading').animate({
			opacity: 0
		}, 800, function() {
			$(this).css('display', 'none');
			setTimeout(function() {
				$(document).trigger('touchstart');
			}, 1000);
		});

	};
	$(document).ready(function() {



		var sketch = Sketch.create(),
			center = {
				x: sketch.width / 2,
				y: sketch.height / 2
			},
			orbs = [],
			dt = 1,
			opt = {
				total: 0,
				count: 100,
				spacing: 2,
				speed: -150,
				scale: 5,
				jitterRadius: 0,
				jitterHue: 0,
				clearAlpha: 10,
				toggleOrbitals: false,
				orbitalAlpha: 100,
				toggleLight: true,
				lightAlpha: 5,
				clear: function() {
					sketch.clearRect(0, 0, sketch.width, sketch.height),
						orbs.length = 0;
				}
			};
		var Orb = function(x, y) {
			var dx = x / opt.scale - center.x / opt.scale,
				dy = y / opt.scale - center.y / opt.scale;
			this.angle = atan2(dy, dx);
			this.lastAngle = this.angle;
			this.radius = sqrt(dx * dx + dy * dy);
			this.size = this.radius / 300 + 1;
			this.speed = random(1, 10) / 300000 * this.radius + 0.015;
		};
		Orb.prototype.update = function() {
			this.lastAngle = this.angle;
			this.angle += this.speed * (opt.speed / 50) * dt;
			this.x = this.radius * cos(this.angle);
			this.y = this.radius * sin(this.angle);
		};
		Orb.prototype.render = function() {
			if (opt.toggleOrbitals) {
				var radius = opt.jitterRadius === 0 ? this.radius : this.radius + random(-opt.jitterRadius, opt.jitterRadius);
				radius = opt.jitterRadius !== 0 && radius < 0 ? 0.001 : radius;
				sketch.strokeStyle = 'hsla( ' + ((this.angle + 90) / (PI / 180) + random(-opt.jitterHue, opt.jitterHue)) + ', 100%, 50%, ' + opt.orbitalAlpha / 100 + ' )';
				sketch.lineWidth = this.size;
				sketch.beginPath();
				if (opt.speed >= 0) {
					sketch.arc(0, 0, radius, this.lastAngle, this.angle + 0.001, false);
				} else {
					sketch.arc(0, 0, radius, this.angle, this.lastAngle + 0.001, false);
				}
				sketch.stroke();
				sketch.closePath();
			}
			if (opt.toggleLight) {
				sketch.lineWidth = 0.5;
				sketch.strokeStyle = 'hsla( ' + ((this.angle + 90) / (PI / 180) + random(-opt.jitterHue, opt.jitterHue)) + ', 100%, 70%, ' + opt.lightAlpha / 100 + ' )';
				sketch.beginPath();
				sketch.moveTo(0, 0);
				sketch.lineTo(this.x, this.y);
				sketch.stroke();
			}
		};
		var createOrb = function(config) {
			var x = config && config.x ? config.x : sketch.mouse.x,
				y = config && config.y ? config.y : sketch.mouse.y;
			orbs.push(new Orb(x, y));
		};
		var turnOnMove = function() {
			sketch.mousemove = createOrb;
		};
		var turnOffMove = function() {
			sketch.mousemove = null;
		};
		sketch.mousedown = function() {
			createOrb();
			turnOnMove();
		};
		sketch.mouseup = turnOffMove;
		sketch.resize = function() {
			center.x = sketch.width / 2;
			center.y = sketch.height / 2;
			sketch.lineCap = 'round';
		};
		sketch.setup = function() {
			while (opt.count--) {
				if (window.CP.shouldStopExecution(1)) {
					break;
				}
				createOrb({
					x: random(sketch.width / 2 - 300, sketch.width / 2 + 300),
					y: random(sketch.height / 2 - 300, sketch.height / 2 + 300)
				});
			}
			window.CP.exitedLoop(1);
		};
		sketch.clear = function() {
			sketch.globalCompositeOperation = 'destination-out';
			sketch.fillStyle = 'rgba( 0, 0, 0 , ' + opt.clearAlpha / 100 + ' )';
			sketch.fillRect(0, 0, sketch.width, sketch.height);
			sketch.globalCompositeOperation = 'lighter';
		};
		sketch.update = function() {
			dt = sketch.dt < 0.1 ? 0.1 : sketch.dt / 16;
			dt = dt > 5 ? 5 : dt;
			var i = orbs.length;
			opt.total = i;
			while (i--) {
				if (window.CP.shouldStopExecution(2)) {
					break;
				}
				orbs[i].update();
			}
			window.CP.exitedLoop(2);
		};
		sketch.draw = function() {
			sketch.save();
			sketch.translate(center.x, center.y);
			sketch.scale(opt.scale, opt.scale);
			var i = orbs.length;
			while (i--) {
				if (window.CP.shouldStopExecution(3)) {
					break;
				}
				orbs[i].render();
			}
			window.CP.exitedLoop(3);
			sketch.restore();
		};
		document.onselectstart = function() {
			return false;
		};


		$('.box').on('touchend', function(event) {
			event.preventDefault();
			var self = $(this);
			moveSilde($('.page-warp'), $('.page-warp').children());
			if ($(this).parent().next()[0].tagName.toLowerCase() === 'canvas') {
				$(this).parent().next()[0].className = 'active';
				$(this).siblings().animate({
					opacity: 0
				}, 1000);
				$(this).parent().next().animate({
					opacity: 1
				}, 1500, function() {
					setTimeout(function() {
						pageTurning(self.parent().parent());
						$('.page-2 > img').attr('src', draw[self.index()]);
						setTimeout(function() {
							self.parent().parent().css('display', 'none');
						}, 1000);
					}, 1500);
				});
			}
			return false;
		});
		$('.box-lamp-warp').on('touchend', function(event) {
			event.preventDefault();
			pageTurning($(this).parent());
		});

		$('.page-but').on('touchend', function(event) {
			event.preventDefault();
			var self = $(this);
			var tel = $("[data-tel]").val(),
				name = $("[data-name]").val(),
				city = $("[data-city]").val();
			$.post('zhuce.php', {
				tel: tel,
				name: name,
				city: city
			}, function(da) {
				var d = JSON.parse(da);
				if (d.status === 1) {
					$.post('index.php', {
						id: d.msg
					}, function(da) {
						var d = JSON.parse(da);
						$('.page-sort').text('恭喜你成為第' + d.num + '位點燃佛');
						$('.name').text('姓名:' + d.name);
						$('.city').text('来自:' + d.city);
					});
					pageTurning(self.parent().parent());
				} else if (d.status === 2) {
					alert('手机号已注册！');
				} else if (d.status === 0) {
					alert('注册出错，请重新注册！');
				}
			});
		});
		var aud = document.getElementById('audio');


		$(document).one('touchstart', function() {
			aud.play();
		});

		$('.aud').on('touchend', function() {
			$(this).toggleClass('rotate');
			if ($(this).hasClass('rotate')) {
				aud.play();
			} else {
				aud.pause();
			}
		});
		// 微信分享
		// if (wx) {
		// 	(function() {
		// 		var imgUrl = '../images/lamp.png';
		// 		var lineLink = window.location.href;
		// 		var descContent = '与有缘人同沾法喜，共沐佛光';
		// 		var shareTitle = document.title;

		// 		wx.onMenuShareTimeline({
		// 			title: shareTitle, // 分享标题
		// 			link: lineLink, // 分享链接
		// 			imgUrl: imgUrl, // 分享图标
		// 			success: function() {
		// 				// 用户确认分享后执行的回调函数
		// 			},
		// 			cancel: function() {
		// 				// 用户取消分享后执行的回调函数
		// 			}
		// 		});

		// 		wx.onMenuShareAppMessage({
		// 			title: shareTitle, // 分享标题
		// 			desc: descContent, // 分享描述
		// 			link: lineLink, // 分享链接
		// 			imgUrl: imgUrl, // 分享图标
		// 			type: '', // 分享类型,music、video或link，不填默认为link
		// 			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		// 			success: function() {
		// 				// 用户确认分享后执行的回调函数
		// 			},
		// 			cancel: function() {
		// 				// 用户取消分享后执行的回调函数
		// 			}
		// 		});
		// 	}());
		// }

	});

}(jQuery));