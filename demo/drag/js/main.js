(function(window, $) {
	var fileReader = (function() {
		function getImgURL(url,cb){
			var resule;
			var img = new Image();
			img.src = url;
			img.onload = function(){
				cb && cb(getBase64ImageSrc(img));
			};
		}
		function fileReader(inputs, box) {
			if (typeof FileReader === 'undefined') {
				getImgURL(this.value,function(base64){
					box.html('<img src="' + base64 + '" />');
				});
			} else {
				inputs.on('change', function() {
					readFile.call(this, box[0]);
				});
			}
		}
		// 获取file对象
		function readFile(img) {
			if (this.files.length > 1) {
				for (var i = 0, len = this.files.length; i < len; i++) {
					ifFile(this.files[i], img);
				}
			} else {
				ifFile(this.files[0], img);
			}
		}
		// 判断file的类型
		function ifFile(elem, img) {
			// 判断file的类型是不是图片类型。
			if (!/image\/\w+/.test(elem.type)) {
				alert("文件必须为图片！");
				return false;
			}
			// 声明一个FileReader实例
			var reader = new FileReader();
			//调用readAsDataURL方法来读取选中的图像文件
			reader.readAsDataURL(elem);
			//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
			img.innerHTML = '';
			$(reader).load(function(event) {
				img.innerHTML += '<img src="' + this.result + '" title="' + elem.name + '"/>';
			});
		}
		// URL base64转换
		function getBase64ImageSrc(img) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
			var dataURL = canvas.toDataURL("image/" + ext);
			return dataURL;
		}
		return fileReader;
	}());

	var create = {
		// 创建新建标签提示框
		popup: function() {
			var popup,
				popupHead,
				popupBody, popupTips, popupTipsUpImage, popupTipsUpTxt,
				popupEdit, popupEditInp, popupBodyUpImage, popupBodyTxt,
				popupFoot;
			popup = $('<div class="popup box-shadow"></div>');
			popupHead = $(
				'<div class="popup-head">' +
				'<div class="popup-title">新建标签</div>' +
				'<div class="popup-close">&times;</div>' +
				'</div>');
			popupBody = $('<div class="popup-body"></div>');
			popupTips = $('<div class="popup-tips"></div>');
			popupHeadUpImage = $('<span class="popup-but up-image">上传图片</span>');
			popupTipsUpTxt = $('<span class="popup-but add-text">输入文本</span>');
			popupEdit = $('<div class="popup-edit"></div>');
			popupEditInp = $('<input type="file" name="update-image">');
			popupTipsUpImage = $('<div class="popup-image up-image" id="update-image"></div>');
			popupBodyTxt = $('<div class="popup-text add-text" contenteditable="true"></div>');
			popupFoot = $(
				'<div class="popup-foot">' +
				'<a href="javascript:;" class="popup-but confirm">确定</a>' +
				'<a href="javascript:;" class="popup-but close">取消</a>' +
				'</div>');
			popupTips.append(popupHeadUpImage).append(popupTipsUpTxt);
			popupEdit.append(popupEditInp).append(popupTipsUpImage).append(popupBodyTxt);
			popupBody.append(popupTips).append(popupEdit);
			popup.append(popupHead).append(popupBody).append(popupFoot);
			var that = this;
			this.addEvent(popupHeadUpImage, 'click', function() {
				popupEditInp.trigger('click');
				fileReader.call(popupEditInp[0], popupEditInp, popupTipsUpImage);
			});
			$('body').append(popup);
		},
		//  添加事件监听
		addEvent: function(elem, events, func) {
			return elem.on(events, function(event) {
				event.preventDefault();
				func && func.call(this, event);
			});
		}
	};
	create.popup();
}(window, jQuery));