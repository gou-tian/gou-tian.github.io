# 幻灯片
> * 使用微信小程序原生组件swiper实现。
```
    <swiper 
        indicator-dots="{{indicatorDots}}" 
        autoplay="{{autoplay}}" 
        interval="{{interval}}" 
        duration="{{duration}}">
        <block wx:for="{{imgUrls}}" wx:key="index">
            <swiper-item>
                <image src="{{item}}" class="slide-image" 
                mode="scaleToFill"/>
            </swiper-item>
        </block>
    </swiper>
```
配合在逻辑页面配置数据实现幻灯片
```
    Page({
        data: {
            imgUrls: [],
            indicatorDots: true,
            autoplay: true,
            interval: 2000,
            duration: 1000,
        },
        onLoad: function(){
            util.ajax({
                url: 'https://api.zg5v.com/index.php/index/show/banner',
                data: {
                    uid: 194
                },
                cb: function(res) {
                    setSilde.call(self, res.data.data);
                }
            });
        }
    })
```
# tab导航切换
> * 由于微信小程序不能直接操作DOM，所以这里设置一个data-id值。(data-id="{{index}}" )用来模拟DOM操作，来实现导航内容的切换
```
    <view class="nav-warp">
        <view class="tab">
            <block wx:for="{{navItem}}" wx:key="index">
                <text bindtap="navToggle" 
                    data-id="{{index}}" 
                    class="tab-txt 
                            {{showItem == index ? 'active' : '' }}">
                    {{item}}
                </text>
            </block>
        </view>
    </view>
```
用于模拟DOM操作
```
    Page({
        data: {
            showItem: 0
        },
        navToggle: function(e){
            this.setData({
                showItem: e.target.dataset.id    
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
        }   
    });
```
# show内容展示
> * 尝试用微信小程序的template组件实现。同时，尝试页面间转跳时传参，在目标页面引入模板文件实现 **写的更少，做的更多**  *篇幅有限详细代码此处省略*
```
    <view class="show-warp">
        <block wx:for="{{discuss}}" wx:key="index">
            <template is="discuss" data="{{item}}"></template>
            <template is="discuss-reply" data="{{item}}"></template>
            <template is="discuss-more" data="{{item}}"></template>
        </block>
    </view>
```
```javascript
    Page({
        data: {
            discuss: [],
            petAge: 0,
            reply: false,
            height: 20
        },
        onLoad: function(){
            util.dataList.call(this, {
                cb: util.petAge
            });
        }    
    });
    /*
     * 部分公共逻辑页代码
     */
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
```
# 上传文件编码问题(*)
> * header 里的数据在真机预览的时候是无效的。那就尝试改变编码进行传输，在uploadFile 的参数中加入
```
    header: {“chartset”:”utf-8”}
    或是
    header: {"content-type":'application/x-www-form-urlencoded'}
```
> * 需要改到 formData 中，尝试将编码数据加入formData，但仅仅传输了数据，并没有改变编码．header有问题暂时找不到解决方案,所以编码操作暂时只能手动进行.在 javascript 中，字符串编码函数是 encodeURI, 在小程序中尝试可以使用。所以，将代码改为如下:
```javascript
    wx.uploadFile({
        url: 'Upload image server path (Must be secure https)',
        // 待上传的图片，由 chooseImage获得
        filePath: tempFilePaths[0],
        name: 'file',
        // HTTP 请求中其他额外的 form data
        formData: {
            // city: '太原',
            city: encodeURI('太原'),
            // name: 'taiyan',
            name: encodeURI('taiyan') // 名称
        }, 
        success: function(res) {
            console.log("success", res);
        },
        fail: function(res) {
            console.log("fail", res);
        }
    });
```