(function(window) {
	/**
	 * [base64Convert Base64编码转换]
	 * @param  {[type]} elem [图片文件]
	 * @param  {[type]} box  [图片容器]
	 * @param  {[type]} info [展示信息容器]
	 * @param  {[type]} mask [图片加载提示]
	 */
	function base64Convert(elem, func) {
		// 判断file的类型是不是图片类型。
		if (/image\/\w+/.test(elem.type)) {
			if (typeof FileReader === 'undefined') {
				alert('抱歉，你的浏览器不支持 FileReader');
				return false;
			}
			// 声明一个FileReader实例
			var reader = new FileReader();
			//调用readAsDataURL方法来读取选中的图像文件
			reader.readAsDataURL(elem);
			//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
			reader.onload = function() {
				if (callbackIsFunction(func)) func(this.result);
			};
		} else if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(elem)) {
			if (callbackIsFunction(func)) func(elem);
		} else {
			alert("文件必须为图片！");
			return false;
		}
	}
	// 判断回调是否为函数
	function callbackIsFunction(func) {
		return func && typeof func === 'function';
	}
	/**
	 * [FacDetect 人脸检测]
	 * @param {[type]} data [图片数据]
	 * @param {[type]} box  [图片容器]
	 * @param {[type]} info [展示信息容器]
	 * @param {[type]} mask [图片加载提示]
	 */
	function faceDetect(data, box, info, image) {
		if (data.faces.length < 1) {
			alert('抱歉！照片无法识别!');
			return false;
		}
		var gender = ['Male', 'Female'];
		var da, i = 0,
			len;
		da = data.faces;
		len = da.length;
		base64Convert(image, function(src) {
			getImageSize(src, function(data) {
				box.html('');
				box.html('<img src="' + src + '" alt=""/>');
				box.children('img').data('width', data.w);
				box.children('img').data('height', data.h);
				info.html('');
				for (; i < len; i++) {
					setData(da[i], gender, box.children('img'));
				}
			});
		});
		// 获取照片原始尺寸
		function getImageSize(src, func) {
			var img = new Image(),
				res = {};
			img.onload = function() {
				res.w = img.width;
				res.h = img.height;
				func(res);
			};
			img.src = src;
		}
		// 照片识别区域属性设置
		function setData(data, gender, img) {
			var da = data.attributes,
				width = img.width(),
				offsetWidth = img.data('width'),
				ratio = width / offsetWidth,
				value = data.face_rectangle,
				sex, age;

			// 判断照片男女
			var time = new Date().getTime();
			for (var val in da) {
				if (typeof da[val].value === 'string') {
					sex = gender[gender.indexOf(da[val].value)] === 'Female' ? 'female' : 'male';
				}
				if (typeof da[val].value === 'number' && val === 'age') {
					age = da[val].value;
				}
			}
			
			img.parent().append('<div class="img-tips ' + sex + time +
				'"style="width:' + value.width * ratio +
				'px; height:' + value.height * ratio +
				'px; left:' + value.left * ratio +
				'px; top:' + value.top * ratio + 'px; ' +
				'border: .02666667rem solid #ffd409;">' +
				'</div>');
			if (sex && age) {
				$('#afterVal').append('.' + sex + time + ':after {content:"' + age + '";background-image: url(images/'+ sex +'.png);}');
			}
		}
	}
	// 滑动
	function slide(photoDefault) {
		var child, view, now, vW, setartTouchX, starX, x, count;
		child = $(photoDefault).children();
		view = (function() {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			};
		}());
		now = 0;
		vW = child.width();
		setartTouchX = 0;
		starX = 0;
		x = 0;

		photoDefault.addEventListener("touchstart", start, false);
		photoDefault.addEventListener("touchmove", move, false);
		photoDefault.addEventListener("touchend", end, false);

		function start(ev) {
			$(this).css('transition', 'none');
			$(this).children().removeAttr('class');
			ev = ev.changedTouches[0];
			setartTouchX = ev.pageX;
			starX = x;
		}

		function move(ev) {
			var iDis;
			ev = ev.changedTouches[0];
			iDis = ev.pageX - setartTouchX;
			x = starX + iDis;
			$(this).css('WebkitTransform', "translateX(" + x + "px)");
			$(this).css('transform', "translateX(" + x + "px)");
		}

		function end(ev) {
			now = x / vW;
			now = -Math.round(now);
			x = -now * vW;
			if (x > child.width()) {
				x = child.width();
			}
			if (x < -(child.length - 2) * child.width()) {
				x = -(child.length - 2) * child.width();
				now = child.length - 2;
			}
			if (now < -1) {
				now = -1;
			}
			$(this).css('transition', '0.5s');
			$(this).css('WebkitTransform', "translateX(" + x + "px)");
			$(this).css('transform', "translateX(" + x + "px)");
			child.eq(now + 1).addClass('photo-active');
		}
	}
	// 人脸识别
	function detectFace(img, type) {
		if (typeof img === 'string') {
			img = document.querySelector(img);
		}
		var apiKey = {
			url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
			test: {
				api_key: 'ICDcw5Bxp2xG1twHmoeWRVU2r0nlG2fo',
				api_secret: '8YdV3PhZLmxTGZkfMek8cjSYwC_wA91Z'
			}
		};
		var formData = new FormData(this),
			ajaxConfig = {
				url: apiKey.url + '?api_key=' + apiKey.test.api_key + '&api_secret=' + apiKey.test.api_secret,
				type: 'POST',
				cache: false
			};
		img = !img.files ? img.src : img.files[0];
		if (type && type === 'image_file') {
			formData = new FormData();
			formData.append('return_landmark', 1);
			formData.append('return_attributes', 'gender,age,smiling,glass,headpose,facequality,blur');
			formData.append('image_file', img);
			ajaxConfig.processData = false;
			ajaxConfig.contentType = false;
		} else {
			formData = {};
			formData.return_landmark = 1;
			formData.return_attributes = 'gender,age,smiling,glass,headpose,facequality,blur';
			formData.image_url = img;
		}
		ajaxConfig.data = formData;
		$.ajax(ajaxConfig)
			.done(function(data) {
				faceDetect(data, $('.photo-update'), $('.face-footer'), img);
				setPage();
			})
			.fail(function() {
				console.log("无法识别照片，请重试！");
			});
	}
	// 设置页面元素切换
	function setPage() {
		$('.photo-frame').hide();
		$('body > .page-title').hide();
		$('.page-tips').hide();

		$('.page-head').addClass('page-edit-head');
		$('.photo-update').addClass('page-edit-update');
		$('.photo-open').addClass('page-edit-open');
		$('.photo-share').addClass('page-edit-share');
	}

	window.onload = function() {
		var doc = window.document;
		var input = doc.querySelector('input[type="file"]');
		var but = doc.querySelector('.photo-open');
		var photoDefault = doc.querySelector('.photo-default');
		var photoTag = doc.querySelector('.photo-tag');
		var photoActive = doc.querySelector('.photo-active');
		// 上传照片
		but.addEventListener('click', function(ev) {
			ev.preventDefault();
			$('#afterVal').html();
			input[ev.type]();
		}, false);
		// 识别照片
		input.addEventListener('change', function() {
			detectFace(this, 'image_file');
		}, false);
		// 默认图片左右滑动
		slide(photoDefault);
		// 默认图片识别
		photoTag.addEventListener('click', function(ev) {
			ev.preventDefault();
			$('#afterVal').html();
			detectFace('.photo-active');
			return false;
		}, false);
	};
}(window));