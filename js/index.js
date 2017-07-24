$(function() {
	var countAjaxUrl = 'http://factory.aimingtai.com/buyer!addRecord?';
	//获取数据
	$.ajax({
		type: 'post',
		url: 'http://factory.aimingtai.com/client!findAdvertByPosition.action?',
		dataType: 'json',
		data: {
			"posid": 2
		},
		success: function(data) {
			//banner轮播图
			var bannerImgBox = '';
			var bannerDianBox = '';
			var bannerImg = $(".carousel-inner");
			var bannerDian = $(".carousel-indicators");
			$.each(data, function(index, item) {
				var imgSrc = item.picurl;
				var imgHref = item.adurl;
				var imgHref2 = item.productid;
				var imgTitle = item.title;
				var ind = Number(index) + Number(1);
				if (index == 0) {
					bannerImgBox += '<div class="item active"><a href="' + imgHref + '"><img index="' + index + '" src="' + imgSrc + '"  title="' + imgTitle + '" onclick="lbtotext(1)"/></a></div>';
					bannerDianBox += '<li data-target="#carousel-example-generic" data-slide-to="' + index + '" class="active"></li>'
				} else if (index == 4) {
					bannerImgBox += '<div class="item"><a href="./lun/index.html"><img index="' + index + '" src="' + imgSrc + '"  title="' + imgTitle + '" onclick="lbtotext(5)"/></a></div>';
					bannerDianBox += '<li data-target="#carousel-example-generic" data-slide-to="' + index + '"></li>'
				} else {
					bannerImgBox += '<div class="item"><a href="./html/product.html?&locationid=' + ind + '&productid=' + imgHref2 + '"><img src="' + imgSrc + '"   title="' + imgTitle + '"/></a></div>'
					bannerDianBox += '<li data-target="#carousel-example-generic" data-slide-to="' + index + '"></li>'
				}
			});
			bannerImg.html(bannerImgBox);
			bannerDian.html(bannerDianBox);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	})
	$(".pop").hide();
	//分类点击事件
	$(".classification").children("ul").children("li").on("click touch", function() {
		$(".pop").show();
	});
	//搜索按钮点击事件
	$(".search_btn").on("click touch",inputSearch);
	document.getElementById('search_from').onsubmit = function(e){
		inputSearch();
		document.activeElement.blur();
	}

	//公司分类按钮
	var classCompany = $(".classification").find('li');
	var pop = $(".pop>ul");
	$.each(classCompany, function(index, item) {
			$(item).on('click touch', function() {
				var locationid = Number(index) + Number(6);
				countAjax(countAjaxUrl, locationid);
				var popHtml = '';
				$.each(classCompanyData[index], function(i, j) {
					var jName = j.name;
					var jId = j.companyid;
					popHtml += '<li><a href="./html/product.html?companyid=' + jId + '">' + jName + '</a></li>';
				})
				pop.html(popHtml);
				$(".pop").show();

			})
		})
		//展会点击跳转统计
	$(".exhibition").children("a").on("click", function() {
		countAjax("http://factory.aimingtai.com/buyer!addRecord?", 18);
		console.log("111");
	});

	//遮罩点击消失
	$(".pop").on("click touch", function() {
		$(this).hide();
		//		document.documentElement.style.overflow = 'auto';
	});
});
//搜索框搜索
function inputSearch (){
		var inputValue = $(".search_in").val();
		if (!inputValue) {
			return;
		}
		var baseurl = urlAddBuyerid("http://factory.aimingtai.com/client!searchAll");
		$.ajax({
			type: 'post',
			url: baseurl,
			dataType: 'json',
			data: {
				"searchKey": inputValue,
				"pagenum": 1,
				"groupid": 1,
				"companytype": 1
			},
			success: function(data) {
				var pop = $(".pop>ul");
				var popHtml = '';
				//搜索框按钮事件
				if (data) {
					$.each(data, function(index, item) {
						if (item.title) {
							var itemTi = item.title;
							var itemId = item.productid;
							popHtml += '<li><a href="./html/product.html?locationid=11&productid=' + itemId + '">' + itemTi + '</a></li>';
						} else {
							$.each(item, function(i, j) {
								var jName = j.tdSellerCompany.name;
								var jId = j.tdSellerCompany.companyid;
								popHtml += '<li><a href="./html/product.html?locationid=10&companyid=' + jId + '">' + jName + '</a></li>';
							});
						}
					});
					pop.html(popHtml);
				} else {
					popHtml = '<li><a>您搜索的结果暂时没有哦</a></li>';
					pop.html(popHtml);
				}
			}
		})
		$(".pop").show();
}
//轮播图后台统计
function lbtotext(index) {
	var locationid = Number(index);
	countAjax("http://factory.aimingtai.com/buyer!addRecord?", locationid);
}