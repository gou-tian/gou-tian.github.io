(function(win, $) {
	var askData = {
		female: [{
			ask: '凌晨2点，你老公（男朋友）收到一条短信，问：睡了吗？你认为可能是下面哪种情况？',
			answer: [{
				optionName: 'A:楼上邻居漏水',
				score: 0
			}, {
				optionName: 'B:有人发错了',
				score: 20
			}, {
				optionName: 'C:10086发的',
				score: 10
			}, {
				optionName: 'D: 外面有人了',
				score: -10
			}]
		}, {
			ask: '偶然看见你男朋友(老公)的和你闺蜜的亲密照片,你当时的想法符合以下哪个？',
			answer: [{
				optionName: 'A:找个时间问一下男票',
				score: 20
			}, {
				optionName: 'B:先忍着，回家质问男票',
				score: 10
			}, {
				optionName: 'C:质问闺蜜，然后绝交',
				score: 0
			}, {
				optionName: 'D: 打电话大吵一架，直接分手',
				score: -10
			}]
		}, {
			ask: '男同事讲黄段子，非常污，你会？',
			answer: [{
				optionName: 'A:我很纯洁，听不懂',
				score: 10
			}, {
				optionName: 'B:假装听不懂',
				score: 5
			}, {
				optionName: 'C:认为同事是个大流氓',
				score: 0
			}, {
				optionName: 'D: 讲一个更污的给他',
				score: 20
			}]
		}, {
			ask: '异地恋，老公（男朋友）在外地，有需要了怎么办？。',
			answer: [{
				optionName: 'A:电话诉说真情',
				score: 10
			}, {
				optionName: 'B:约闺蜜一起散心',
				score: 10
			}, {
				optionName: 'C:找帅哥一夜情',
				score: -20
			}, {
				optionName: 'D: 自己解决',
				score: 20
			}]
		}, {
			ask: '你发现和你在一起后，你老公（男朋友）自慰，你的想法是？',
			answer: [{
				optionName: 'A:太恶心了分手',
				score: -10
			}, {
				optionName: 'B:正常需求可以理解',
				score: 10
			}, {
				optionName: 'C: 自己没有魅力',
				score: 20
			}, {
				optionName: 'D: 他是弯的',
				score: 0
			}]
		}],
		male: [{
			ask: '如果今天是情人节,你有一千块钱,你打算怎么花？',
			answer: [{
				optionName: 'A:花，巧克力，七天',
				score: 10
			}, {
				optionName: 'B:花，巧克力，家',
				score: 20
			}, {
				optionName: 'C:家 七天 家',
				score: 0
			}, {
				optionName: 'D: 家',
				score: -10
			}]
		}, {
			ask: '如果你的老婆(女朋友)说"生气啦，不理你啦"，她是想说什么？',
			answer: [{
				optionName: 'A:你没有哄我',
				score: -10
			}, {
				optionName: 'B:想要包包',
				score: 0
			}, {
				optionName: 'C:来例假了',
				score: 20
			}, {
				optionName: 'D: 就是生气了',
				score: 10
			}]
		}, {
			ask: '你老婆(女朋友)的前男友要约她见面,怎么办？',
			answer: [{
				optionName: 'A:100%信任，去吧。',
				score: -10
			}, {
				optionName: 'B:坚决不可以去,去了就分手',
				score: 20
			}, {
				optionName: 'C:我和你一起去',
				score: 0
			}, {
				optionName: 'D: 让他去，我偷偷跟踪',
				score: 10
			}]
		}, {
			ask: '看见你老婆(女朋友)跟你兄弟上床,怎么办？',
			answer: [{
				optionName: 'A: 打你老婆',
				score: -10
			}, {
				optionName: 'B: 打你兄弟',
				score: 0
			}, {
				optionName: 'C:拍照发微博',
				score: 20
			}, {
				optionName: 'D: 去厨房找刀',
				score: 10
			}]
		}, {
			ask: '如果你可以选一个明星做老婆，你选哪个？',
			answer: [{
				optionName: 'A:马蓉',
				score: -20
			}, {
				optionName: 'B:韩红',
				score: 20
			}, {
				optionName: 'C:金星',
				score: 0
			}, {
				optionName: 'D: 凤姐',
				score: 10
			}]
		}]
	};

	var initPage = (function() {
		var count = 0,
			ask,
			len = 0;
		return function(data, appendElem) {
			var i = 0;
			ask = $('<div>').addClass('ask-warp');
			len = data.length;
			if (count < len) {
				appendElem.html('');
				ask.append($('<p>').html(data[count].ask));
				for (; i < len; i++) {
					if (data[count].answer[i]) {
						ask.append('<input type="radio" name="answer" data-score="' + data[count].answer[i].score + '">' + data[count].answer[i].optionName + '<br>');
					}
				}
				appendElem.append(ask);
				count++;
			}
		};
	}());

	function total(num) {
		if (!Array.isArray(num)) {
			return 'Of type not Array';
		}
		var i = 0,
			len = num.length,
			res = 0;
		for (; i < len; i++) {
			res += num[i];
		}
		return res;
	}

	$(function() {
		var pageBody = $('.page-content'),
			res = [],
			resAskData = askData[sessionStorage.lastname];
		initPage(resAskData, pageBody);
		$('.page-foot').on('click', 'a', function(event) {
			event.preventDefault();
			var index = $('.ask-warp').children('input').eq($(this).index());
			res.push(index.data('score'));
			if (res.length > resAskData.length - 1 && Array.isArray(res)) {
				win.location.href = sessionStorage.lastname + '-result.php?res=' + total(res);
				return false;
			}
			initPage(resAskData, pageBody);
		});
	});
}(window, jQuery));