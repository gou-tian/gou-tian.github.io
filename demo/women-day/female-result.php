<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta content="yes" name="apple-mobile-web-app-capable">
	<meta content="yes" name="apple-touch-fullscreen">
	<meta content="telephone=no,email=no" name="format-detection">
	<script src="src/set-dpr.js"></script>
	<title>看谁更懂他？</title>
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/women-day.css">
</head>
<?php 
header("Content-type:text/html;charset=utf-8");

$arr[1]['name'] = '资深污后';
$arr[1]['zj'] = ' 女性里的纯爷们，铁骨铮铮的汉子，能有老公或者男朋友就是一个奇迹，负分没毛病';

$arr[2]['name'] = '骨灰级腐女';
$arr[2]['zj'] = '女汉子这顶帽子是再合适不过了，肯定不了解男人，你就是个男人，需要深刻反省';

$arr[3]['name'] = '资深腐女';
$arr[3]['zj'] = '交往过的对象，都分了吧，现在这个也不咋满意吧，坚持一下，慢慢就习惯了';

$arr[4]['name'] = '柴火妞';
$arr[4]['zj'] = '对男人还算了解，居家搭伙过日子还是不错的，也算是个贤妻良母';

$arr[5]['name'] = '优质配偶';
$arr[5]['zj'] = '你阅男人无数，非常了解男人，懂得怎么和男人相处，是前男友们怀念的对象';

$arr[6]['name'] = '绝世好女人';
$arr[6]['zj'] = '男人心中最完美的伴侣，对男人理解到骨子里，毫无争议的满分';



 
if($_GET['res'] > 80 ){
	$array = $arr[6]; 
	}else if($_GET['res'] > 60 ){
		$array = $arr[5];
	}else if($_GET['res'] > 40 ){
		$array = $arr[4]; 
	}else if($_GET['res'] > 20 ){
		$array = $arr[3]; 
	}else if($_GET['res'] > 0 ){
		$array = $arr[2];
	}else{
		$array = $arr[1]; 
}

?>

<body>
	<!-- 女 -->
	<div class="page-female page-result active">	<!-- 状态切换 -->
		<img src="images/index-female-bg.jpg" alt="">
		<div class="public-fixed page-head">
			<div class="page-title"></div>
		</div>
		<div class="public-absolute page-body">
			<div class="page-content">
				<div class="ask-warp ask-result">
					<p>总得分: <span><?php echo $_GET['res'] ?></span> 分</p>
					<p>光荣获得: <span><?php echo $array['name'] ?></span> 称号</p>
					<p>性格总结: <span><?php echo $array['zj'] ?></span></p>
				</div>
			</div>
		</div>
		<div class="public-absolute page-foot">
			<button>
				<a href="index.html">我也要玩</a>
			</button>

			<button onclick="fenxiang(this)">
				<a href="javascript:">我要分享</a>
			</button>
			<button onclick="fenxiang(this)">
				<a href="http://mp.weixin.qq.com/s?__biz=MzA5NTI4NTAyOA==&mid=505489296&idx=1&sn=eada5056ea259af47801aef2058291b2&chksm=0b943ddb3ce3b4cd295b6db4a7d03d07ad481140e1c2b54effccdf55723f108f01649d09ae54&mpshare=1&scene=1&srcid=0210LSKu4PCxQadggInPKCQb#rd">关注我们</a>
			</button>
		</div>
		<div id="fenxiang" onclick="quxiao(this)"></div>
		<img src="images/guide.png" alt="" id="fenxiangimg" onclick="quxiao(this)">

	</div>
	<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.1/jquery.min.js"></script>
	<script>
		console.log(window.location.search);

		function fenxiang(obj){
			$('#fenxiang').show();
			$('#fenxiangimg').show();

		}
		
		function quxiao(obj){
			$('#fenxiang').hide();
			$('#fenxiangimg').hide();
		}

	</script>
	<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<?php
		include_once 'db.php';
		include "config.php";
		$jssdk = new JSSDK(APPIDS, APPSECRETS);
		$signPackage = $jssdk->GetSignPackage();
	?>

	<script>
	    wx.config({
	        debug: false,
	        appId: '<?php echo $signPackage["appId"];?>',
	        timestamp: <?php echo $signPackage["timestamp"];?>,
	        nonceStr: '<?php echo $signPackage["nonceStr"];?>',
	        signature: '<?php echo $signPackage["signature"];?>',
	        jsApiList: [
	            // 所有要调用的 API 都要加到这个列表中
	            'checkJsApi',
	            'openLocation',
	            'getLocation',
	            'onMenuShareTimeline',
	            'onMenuShareAppMessage'
	          ]
	    });
	</script>
	<?php 
		$news = array(
			"Title" =>"你了解你的TA么？",
			"Description"=>"我竟然得了".$_GET['res']."分，获得了".$array['name'] ."称号,你也来试试吧",
			 "PicUrl" =>URL."/images/tutu.jpg",
			 "Url" =>URL."/female-result.php?res=".$_GET['res']
			 );    
	?>
	<script>
	wx.ready(function () {
		wx.checkJsApi({
		jsApiList: [
		    'getLocation',
		    'onMenuShareTimeline',
		    'onMenuShareAppMessage'
		],
		success: function (res) {
		    // alert(JSON.stringify(res));
		}
	});	
		wx.onMenuShareAppMessage({
	          title: '<?php echo $news['Title'];?>',
	          desc: '<?php echo $news['Description'];?>',
	          link: '<?php echo $news['Url'];?>',
	          imgUrl: '<?php echo $news['PicUrl'];?>',
	          trigger: function (res) {
	            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
	            // alert('用户点击发送给朋友');
	          },
	          success: function (res) {
	            // alert('已分享');
				location.href='http://mp.weixin.qq.com/s?__biz=MzA5NTI4NTAyOA==&mid=505489296&idx=1&sn=eada5056ea259af47801aef2058291b2&chksm=0b943ddb3ce3b4cd295b6db4a7d03d07ad481140e1c2b54effccdf55723f108f01649d09ae54&mpshare=1&scene=1&srcid=0210LSKu4PCxQadggInPKCQb#rd';
	          },
	          cancel: function (res) {
	            // alert('已取消');
	          },
	          fail: function (res) {
	            // alert(JSON.stringify(res));
	          }
	        });

	    wx.onMenuShareTimeline({
	      title: '<?php echo $news['Title'];?>',
	      link: '<?php echo $news['Url'];?>',
	      imgUrl: '<?php echo $news['PicUrl'];?>',
	      trigger: function (res) {
	        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
	        // alert('用户点击分享到朋友圈');
	      },
	      success: function (res) {
	        // alert('已分享');
			location.href='http://mp.weixin.qq.com/s?__biz=MzA5NTI4NTAyOA==&mid=505489296&idx=1&sn=eada5056ea259af47801aef2058291b2&chksm=0b943ddb3ce3b4cd295b6db4a7d03d07ad481140e1c2b54effccdf55723f108f01649d09ae54&mpshare=1&scene=1&srcid=0210LSKu4PCxQadggInPKCQb#rd';
	      },
	      cancel: function (res) {
	        // alert('已取消');
	      },
	      fail: function (res) {
	        // alert(JSON.stringify(res));
	      }
	    });
	});

	</script>


</body>
</html>