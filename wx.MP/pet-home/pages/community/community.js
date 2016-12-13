var util = require('../../utils/util.js');
// 获取当前目标的ID
function getParameterID(ev) {
	var self = this;
	var replyData = this.data.discuss;
	var plid = function(event, da) {
		if (event.currentTarget.dataset.typediscuss) {
			return da.plid;
		} else {
			return false;
		}
	};
	for (var i = 0, len = replyData.length; i < len; i++) {
		(function(da, showID) {
			var i = 0,
				len = da.length;
			for (; i < len; i++) {
				self.setData({
					plID: plid(ev, da[i]),
					showID: showID,
					uID: da[i].pluserid
				});
			}
		}(replyData[i].pl, replyData[i].cp_showid));
	}
}

function success(text, timeout) {
	wx.showToast({
		title: text || '成功',
		icon: 'success',
		duration: timeout || 1000
	});
}
Page({
	data: {
		imgUrls: [],
		indicatorDots: true,
		autoplay: true,
		interval: 2000,
		duration: 1000,
		toView: 'red',
		scrollTop: 100,
		navItem: ['全部', '关注', '萌犬', '萌猫', '其他'],
		showItem: 0,
		hideItem: 0,
		discuss: [],
		petAge: 0,
		reply: false,
		replytxt: false,
		focus: false
	},
	// 模拟DOM操作切换导航
	navToggle: function(e) {
		this.setData({
			showItem: e.target.dataset.id,
		});
		util.dataList.call(this, {
			url: 'https://api.zg5v.com/index.php/index/show/qtshow',
			data: {
				uid: 148,
				fenid: e.target.dataset.id - 1,
				num: 0
			},
			cb: util.petAge
		});
	},
	onLoad: function() {

		util.dataList.call(this, {
			cb: util.petAge
		});

		var self = this;

		function setSilde(data) {
			var navItemArr = [],
				i = 0,
				len = data.length;
			for (; i < len; i++) {
				navItemArr.push(data[i].cp_banner);
			}
			this.setData({
				imgUrls: navItemArr
			});
		}
		util.ajax({
			url: 'https://api.zg5v.com/index.php/index/show/banner',
			data: {
				uid: 194
			},
			cb: function(res) {
				setSilde.call(self, res.data.data);
			}
		});
	},
	// 打开评论界面
	addReplyUser: function(event) {
		if (this.data.reply) {
			this.setData({
				focus: false,
				reply: false,
				replytxt: false,
			});
		} else {
			this.setData({
				focus: true,
				reply: true,
				replytxt: true,
				top: event.currentTarget.offsetTop + 30
			});
		}
		getParameterID.call(this, event);
	},
	// 发送评论内容
	replyIssue: function(ev) {
		var self = this;
		var delayed = 0;
		var timer = setInterval(function() {
			delayed += 100;
			if (self.data.replyTxt) {
				clearInterval(timer);
				delayed = 0;
				util.ajax({
					url: 'https://api.zg5v.com/index.php/index/show/logpl',
					data: {
						id: self.data.plID === false ? 0 : self.data.plID,
						showid: self.data.showID,
						uid: self.data.uID,
						comment: self.data.replyTxt
					},
					cb: function(res) {
						self.setData({
							focus: false,
							reply: false
						});
						util.dataList.call(self, util.petAge);
					}
				});
			} else if (delayed === 500 && !self.data.replyTxt) {
				clearInterval(timer);
				self.setData({
					focus: false,
					reply: false
				});
				delayed = 0;
			}

		}, 100);
	},
	getTextareaVal: function(ev) {
		this.setData({
			replyTxt: ev.detail.value
		});
	},
	elegant: function(event) {
		var self = this;
		getParameterID.call(this, event);
		util.ajax({
			url: 'https://api.zg5v.com/index.php/index/show/logzan',
			data: {
				uid: self.data.uID,
				showid: self.data.showID
			},
			cb: function(res) {
				if (res.data.status === 1) {
					success("点赞成功！", 2000);
				} else if (res.data.status === 0) {
					success("点赞失败！", 2000);
				} else if (res.data.status === 2) {
					success("取消点赞！", 2000);
				}
			}
		});
	},
	follow: function(ev) {
		var self = this;
		util.ajax({
			url: 'https://api.zg5v.com/index.php/index/show/dloguan',
			data: {
				uid: ev.currentTarget.dataset.uid,
				qtuid: ev.currentTarget.dataset.showid
			},
			cb: function(res) {
				if (res.data.status === 1) {
					success("关注成功！", 2000);
				} else if (res.data.status === 0) {
					success("关注失败！", 2000);
				}
			}
		});
	},
	navigateTo: function(ev) {
		wx.navigateTo({
			url: 'details/details?uid=' + ev.currentTarget.dataset.uid + '&showid=' + ev.currentTarget.dataset.showid
		});
	}
});