//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onLoad: function() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function(log) {
        return util.formatTime(new Date(log));
      })
    });
  },
  // 修改头像
  touxiangedit: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          touxiang: res.tempFilePaths,
        });
        console.log("你是猪", tempFilePaths[0]);
        // 上传头像
        wx.uploadFile({
          url: 'https://api.zg5v.com/xiao.php/chong/index/xiaotouxiangedit',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'chongid': '85'
          },
          success: function(res) {
            console.log(res, 21);
          },
          fail: function(res) {
            console.log(res, 2);
          }
        });
        console.log("你是猪  no");

      }
    });
  },
  uploadImage: function() {
    var self = this;
    // http://127.0.0.1/upload-images/upload-image.php
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.uploadFile({
          url: 'http://localhost/upload-images/meng2.php', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          formData: {
            'user': '发送'
          },
          success: function(res) {
            var data = res.data;
            console.log(res);
            //do something
          },
          fail: function(err) {
            console.log(err);
          }
        });
      }
    });
  }
});