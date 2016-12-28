(function(win) {
	var doc, docElem, isAndroid, isIphone,
		devicePixelRatio, docFirst, timer,
		metaElem,
		rem = 0,
		dpr = 0,
		scale = 0;

	doc = win.document;
	docElem = doc.documentElement;
	metaElem = doc.querySelector('meta[name="viewport"]');
	docFirst = docElem.firstElementChild;

	if (!dpr && !scale) {
		// 判断设备类型
		isAndroid = win.navigator.appVersion.match(/android/ig);
		isIphone = win.navigator.appVersion.match(/iphone/ig);
		// 获取当前设备的dpr
		devicePixelRatio = win.devicePixelRatio;
		// 对于IOS下dpr为2和3的用2倍方案，其他用1倍方案
		if (isIphone) {
			if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
				dpr = 3;
			} else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
				dpr = 2;
			} else {
				dpr = 1;
			}
		} else {
			dpr = 1;
		}
		scale = 1 / dpr;
	}


	// 设置html的dpr属性
	docElem.setAttribute('data-dpr', dpr);

	// 设置缩放比例
	if (!metaElem) {
		metaElem = doc.createElement('meta');
		metaElem.setAttribute('name', 'viewport');
		metaElem.setAttribute(
			'content', 'initial-scale=' + scale +
			', maximum-scale=' + scale +
			', minimum-scale=' + scale +
			', user-scalable=no'
		);
		// 动态生成缩放比例设置
		if (docFirst) {
			docFirst.appendChild(metaElem);
		} else {
			warp = doc.createElement('div');
			warp.appendChild(metaElem);
			doc.write(warp.innerHTML);
		}
	}

	// 字号设置
	function delayed() {
		var width = docElem.getBoundingClientRect().width;

		if (width / dpr > 540) {
			width = 540 * dpr;
		}
		rem = width / 10;
		docElem.style.fontSize = rem + 'px';
	}

	function extDelayed(time) {
		time = time || 300;
		clearTimeout(timer);
		timer = setTimeout(function() {
			delayed();
		}, time);
	}

	win.addEventListener('resize', function() {
		extDelayed();
	}, false);
	win.addEventListener('pageshow', function(ev) {
		if (ev.persisted) {
			extDelayed();
		}
	}, false);

	if (doc.readyState === 'complete') {
		doc.body.style.fontSize = 12 * dpr + 'px';
	} else {
		win.addEventListener('DOMContentLoaded', function(ev) {
			doc.body.style.fontSize = 12 * dpr + 'px';
		}, false);
	}

	delayed();

}(window));
