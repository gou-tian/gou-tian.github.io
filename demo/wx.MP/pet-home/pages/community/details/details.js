var util = require('../../../utils/util.js');

function update() {
	var self = this;
	util.dataList.call(this, {
		url: 'https://api.zg5v.com/index.php/index/show/pllist',
		data: {
			uid: self.data.uid,
			showid: self.data.showid,
			num: self.data.page
		},
		cb: util.petAge
	});
}

function loading() {
	wx.showToast({
		title: '加载中',
		icon: 'loading',
		duration: 1000
	});
}

Page({
	data: {
		page: 0
	},
	onLoad: function(option) {
		var self = this;
		this.setData({
			uid: option.uid,
			showid: option.showid
		});
		wx.hideToast();
		loading();
		(function() {
			util.dataList.call(self, {
				url: 'https://api.zg5v.com/index.php/index/show/pllist',
				data: {
					uid: self.data.uid,
					showid: self.data.showid,
					num: 0
				},
				cb: util.petAge
			});
		}());
	},
	onPullDownRefresh: function(){
		this.setData({
			page: 0
		});
		console.log(this.data.page);
	},
	onReachBottom: function() {
		var self = this;
		loading();
		this.setData({
			page: self.data.page + 1
		});
		(function() {
			util.dataList.call(self, {
				url: 'https://api.zg5v.com/index.php/index/show/pllist',
				data: {
					uid: self.data.uid,
					showid: self.data.showid,
					num: self.data.page
				},
				update: true,
				cb: util.petAge
			});
		}());
	},
	navigateTo: function(ev) {
		return false;
	}
});