(function(win, $) {
    // 创建遮罩层
    var loading = (function() {
        var pageMask = document.createElement('div');
        var span = document.createElement('span');
        pageMask.setAttribute('class', 'page-mask');
        span.innerText = 'loading...';
        pageMask.appendChild(span);
        return pageMask;
    }());

    var lanternWarp = document.querySelectorAll('.lantern');
    var pageBody = document.querySelector('.page-warp');
    var lantern = document.querySelector('.page-card');
    var countWarp = document.querySelector('.page-count span');
    var pageResult = document.querySelector('.bottom-button');
    var blessing = document.querySelector('.page-blessing-warp');
    var botBut = document.querySelector('.bottom-button');
    // 初始化计数器
    var count = 20;
    // 初始化执行结果变量
    var result = [];
    var fn, resBless, now = 0;
    // 工具函数
    var tools = {
        // 获取css属性值
        css: function(obj, attr) {
            // 标准浏览器与IE非标准浏览器兼容处理
            if (obj.currentStyle) {
                // IE非标准浏览器
                return obj.currentStyle[attr];
            } else {
                // 标准浏览器
                // 兼容老版本火狐下getComputedStyle的一个Bug。需要多传入一个参数
                return getComputedStyle(obj, false)[attr];
            }
        },
        // 缓动动画
        bufferMove: function(obj, valName, func) {
            clearInterval(obj.iTime);
            //速度值计算变量
            var iSpeed = 0;
            var num = 0;
            //开启定时器
            obj.iTime = setInterval(function() {
                //设置多属性判断条件
                var iSwitch = true;
                //循环json获取属性及属性值
                for (var nature in valName) {
                    //获取属性值
                    var iTarget = valName[nature];
                    //判断属性
                    if (nature == 'opacity') {
                        num = Math.round(tools.css(obj, 'opacity') * 100);
                    } else {
                        num = parseInt(tools.css(obj, nature));
                    }
                    //速度值计算
                    iSpeed = (iTarget - num) / 8;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                    //属性赋值
                    if (num != iTarget) {
                        //每次进来时说明有条件未执行完成iSwitch设置为false
                        iSwitch = false;
                        if (nature == 'opacity') {
                            obj.style.opacity = (iSpeed + num) / 100;
                            obj.style.filter = 'alpha(opacity' + (iSpeed + num) + ')';
                        } else {
                            obj.style[nature] = iSpeed + num + 'px';
                        }
                    }
                }
                //全部for循环执行完毕后检查所有条件是否执行完，判断条件为iSwitch,iSwitch为true为所有条件满足
                if (iSwitch) {
                    //关闭定时器
                    clearInterval(obj.iTime);
                    //关闭定时器后判断是否有回调函数，如果有则执行同时把this指向调用对象
                    func && func.call(obj);
                }
            }, 14);
        },
    };
    // 计数器页面展示初始化
    countWarp.textContent = count;

    // 取消document默认事件
    document.addEventListener('touchdown', function(ev) {
        ev.preventDefault();
    }, false);

    function addEvent(lantern, blessing, botBut, nodes, parentElem, showElem, func) {
        if (result.length > 0) {
            $(lantern).removeClass('active');
            $(blessing).addClass('active');
            $(botBut).addClass('active');
            $.each(nodes, function(i) {
                $(this).append('<div class="page-card active"><img src="' + result[i] + '" alt=""></div>');
            });
        }
        $(lantern).on('touchend', function(ev) {
            count--;
            if (count < 1) {
                count = 0;
                // 转跳条件删除点击事件并转跳结果页面
                // 并结束程序执行
                resultPage(this, parentElem, pageResult, ev.type, showElem);
                return false;
            }
            parentElem.appendChild(showElem);
            func(ev, parentElem, nodes, showElem);
            return false;
        });
    }

    function contextSwitch(elem, nodes, lanternWarp, parentElem, evType, showElem) {
        // 平安、健康、快乐、好运、幸福
        var res = [
                'images/text-pingan.png',
                'images/text-jiankang.png',
                'images/text-kuaile.png',
                'images/text-haoyun.png',
                'images/text-xingfu.png',
                'images/text-jixiang.png',
                'images/text-caifu.png',
                'images/text-meili.png',
                'images/text-ankang.png',
                'images/text-wuyou.png'
            ],
            num = 0,
            random = parseInt(Math.random() * 10),
            // 深度拷贝节点
            clone = elem.cloneNode(true);
        // 控制随机数范围
        if (random < 9) {
            // 没有子节点时添加内容
            // random结果>=5时自身减去5，寻找对应元素插入
            if (random >= 5) {
                num = random - 5;
            } else {
                num = random;
            }
            if (lanternWarp[num].childNodes.length === 0) {
                // 删除动画样式
                clone = $(clone).removeClass('ext-but').get(0);
                clone.innerHTML = '<img src="' + res[random] + '" alt="">';

                lanternWarp[num].appendChild(clone);
                elem.innerHTML = '<p><img src="' + res[random] + '" alt=""></p>';

                result.push(res[random]);
                countWarp.textContent = count;
                if (result.length >= 5) {
                    resultPage(elem, parentElem, pageResult, evType, showElem);
                    return false;
                }
            } else {
                countWarp.textContent = count;
                $('.page-tips').addClass('active');
                setTimeout(function() {
                    $('.page-tips').removeClass('active');
                }, 1000);
            }
        } else {
            // 结果大于5重新迭代随机数
            contextSwitch(elem, nodes, lanternWarp, parentElem, evType, showElem);
        }
        now = random;
    }

    function resultPage(self, parentElem, pageResult, evType, showElem) {
        var blessing = [
                ['平平安安心心顺', '安安平平事事净', '元宵佳节开心绕', '生活平安多美妙', '祝节日欢笑'],
                ['健壮体魄拓新天', '康乐家园展笑颜', '元宵佳节到了', '送你一盘健康汤圆', '愿你的人生甜蜜又健康'],
                ['快意上云霄 乐音寄纸鹞', '元宵佳节乐无边', '相识相知皆是缘', '吉祥喜庆常拥有', '快乐伴随整一年'],
                ['好好努力创大业', '运气隆达路路通', '每逢佳节想起你', '元宵祝福最真挚', '祝你工作顺心，鸿途大展'],
                ['幸事财势久长存', '福星月寿青春在', '汤圆包裹生活的香甜', '喜度元宵美好夜晚', '愿你幸福快乐到永远'],
                ['财气铄飞花', '富贵如朝华', '祝元宵行大运', '仕途步步高升', '麻将得心应手、财源广进，恭喜发财'],
                ['美轮美奂颜如玉', '丽质天生绝凡尘', '亲情友情爱无限', '甜蜜和美喜乐天', '美女朋友把你伴'],
                ['吉气紫光飞天来', '祥日明月遁地开', '月圆节圆人有缘', '汤圆甜蜜幸福耀', '吉祥好运把你照'],
                ['安心度日享富贵', '康庄大道奔向前', '火树银花不夜天', '猜猜灯谜笑开颜', '元宵节祝你的生活步步高升，事业飞黄腾达'],
                ['无际祥云一线开', '忧思荡开春意来', '祝您家庭幸福团圆', '事业红得溜圆', '一世幸福美圆']
            ],
            res;
        parentElem.appendChild(showElem);
        tools.bufferMove(showElem, {
            'opacity': 100
        }, function() {
            // 延时500毫秒执行过度动画并执行回调函数
            setTimeout(function() {
                tools.bufferMove(showElem, {
                    'opacity': 0
                }, function() {
                    $(self).removeClass('active');
                    setTimeout(function() {
                        // $(self).off(evType);
                        $(self).next().addClass('active');
                        countWarp.textContent = count;
                        count = 0;
                        countWarp.parentNode.className = countWarp.parentNode.className + ' disable';
                        pageResult.className = pageResult.className + ' active';
                        parentElem.removeChild(showElem);
                        if ($('.lantern:empty').length > 0) {
                            $('.lantern:empty').remove();
                        }
                    }, 500);
                });
            }, 500);
        });
        res = (function() {
            var res = document.createDocumentFragment();
            for (var i = 0, len = blessing[now].length; i < len; i++) {
                $(res).append('<p>' + blessing[now][i] + '</p>');
            }
            return res;
        }());
        $('.page-blessing-bd').html('').append(res);
        
    }
    $.get('da.php', function(data) {
        // result = eval(data);
        result = (function(da) {
            return da.replace(/([\[])|([\"])|([\]])/g, '').replace(/\\\//gi, '/').split(',');
        }(data));
        addEvent(lantern, blessing, botBut, lanternWarp, pageBody, loading, function(ev, parentElem, nodes, showElem) {
            // 执行过度动画及回调函数
            tools.bufferMove(showElem, {
                'opacity': 100
            }, function() {
                // 延时500毫秒执行过度动画并执行回调函数
                setTimeout(function() {
                    tools.bufferMove(showElem, {
                        'opacity': 0
                    }, function() {
                        // 删除遮罩元素
                        // debugger;
                        parentElem.removeChild(showElem);
                        // 执行切换结果
                        contextSwitch(lantern, nodes, lanternWarp, parentElem, ev.type, this);
                    });
                }, 500);
            });
        });
    });

    // 我要制作按钮
    $('.bottom-button').on('touchend', function() {
        result = [];
        var pageFooter = lanternWarp[0].parentNode,
            i = 0,
            len = 5;

        $(pageFooter).empty();
        countWarp.textContent = count = 20;
        for (; i < len; i++) {
            $(pageFooter).append('<div class="lantern"></div>');
        }
        lanternWarp = document.querySelectorAll('.lantern');
        $('.disable').removeClass('disable');
        $(lantern).addClass('active').find('> p > img').attr('src', 'images/text-top.png');
        $(blessing).removeClass('active');
        $(botBut).removeClass('active');
    });
}(window, jQuery));