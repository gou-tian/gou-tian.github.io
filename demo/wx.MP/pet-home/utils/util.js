// 时间格式化
function formatTime(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();


	return [year, month, day].map(formatNumber).join('/') + ' ' +
		[hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}
// show列表展示
function list(option) {
	var opt = {
		url: option.url || 'https://api.zg5v.com/index.php/index/show/showindex',
		data: option.data || {
			uid: 148,
			num: option.pageNum || 0
		},
		update: option.update || false,
		cb: option.cb || false,
		func: option.func || false
	};
	// 数据列表
	var showList = [];
	var objDa = [];
	this.data.replyListArr = [];
	// 保存/修改 this指向
	var self = this;
	ajax({
		url: opt.url,
		data: opt.data,
		cb: function(res) {
			showList = res.data.data;
			// 统一格式
			if (!Array.isArray(showList) &&
				typeof showList === 'object') {
				// 计算评论发布时间
				showList.pl.forEach(function(e, i) {
					e.cp_chongbirth = e.cp_addtime * 1000;
					e.replyTime = opt.cb(e.cp_chongbirth, true);
				}, showList.pl);
				objDa.push(showList);
			} else {
				objDa = showList;
			}
			// 更新评论列表
			if (opt.update) {
				let da = res.data.data.pl,
					plDa = self.data.discuss,
					i = 0,
					j = 0,
					len = da.length,
					jLen = plDa.length;
				for (; j < jLen; j++) {
					for (; i < len; i++) {
						if (plDa[j].pl.length > 0) {
							plDa[j].pl.push(da[i]);
						}
					}
				}
				objDa = plDa;
				opt.update = !opt.update;
			}
			if (res.data.status === 1) {
				for (var i = 0, len = objDa.length; i < len; i++) {
					if (opt.cb && typeof opt.cb === 'function') {
						// 计算宠物年龄
						objDa[i].petAge = opt.cb(objDa[i].cp_chongbir ||
							objDa[i].cp_chongbirth);
					}
				}
				self.setData({
					discuss: objDa
				});
			} else if (res.data.status === 2 || res.data.status === 0) {
				self.onLoad();
			}
			objDa = [];
		}
	});
}

function petAge(age, years) {
	// 获取发布时间
	var year = formatTime(new Date(+age));
	// 获取当前时间
	var now = formatTime(new Date(new Date().getTime()));
	// 拆分数据年月日时分秒转换为数组并合并
	var date = year.slice(0, year.indexOf(' ')).split('/').
	concat(year.slice(year.indexOf(' ')).split(':'));
	var nowDate = now.slice(0, now.indexOf(' ')).split('/').
	concat(now.slice(now.indexOf(' ')).split(':'));
	// 返回单位
	var rtu = [];
	// 判断需求是发布时间或是年龄
	if (years) {
		rtu = ['年前', '个月前', '天前', '小时前', '分钟前', '秒钟前'];
	} else {
		rtu = ['岁', '个月', '天', '小时前', '分钟前', '秒钟前'];
	}
	return (function() {
		var i = 0,
			len = date.length;

		for (; i < len; i++) {
			if (date[i] < nowDate[i]) {
				return nowDate[i] - date[i] + rtu[i];
			}
		}
	}());
}
// wx.request
function ajax(option) {
	var opt = {
		url: option.url,
		data: option.data,
		cb: option.cb || false
	};
	wx.request({
		url: opt.url,
		data: opt.data,
		success: function(res) {
			if (res.statusCode !== 200) {
				console.log(res);
				return console.error(res.statusCode + ' :错误 -_-!');
			}
			if (opt.cb && typeof opt.cb === 'function') {
				opt.cb.apply(this, arguments);
			}
		},
		fail: function(err) {
			console.error('发生错误:',err.errMsg);
		}
	});
}
module.exports = {
	formatTime: formatTime,
	dataList: list,
	petAge: petAge,
	ajax: ajax
};