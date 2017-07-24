$(function() {
	var countAjaxUrl = 'http://factory.aimingtai.com/buyer!addRecord?';
	var locationid;
	var who;
	var whoseid;
	var once = 1;
	var companyid;
	var productid;
	if (getUrlParam('companyid')) {
		getUrlParam('locationid') ? locationid = getUrlParam('locationid') : locationid = 10;
		who = 'companyid';
		companyid = getUrlParam('companyid');
		whoseid = companyid;
		getCompany(companyid, once);
	} else {
		getUrlParam('locationid') ? locationid = getUrlParam('locationid') : locationid = 11;
		who = 'productid';
		productid = getUrlParam('productid');
		whoseid = productid;
		getProduct(productid, once);
	}
	countAjax(countAjaxUrl, locationid, who, whoseid);
	//banner图和产品介绍获取数据
	var pop = $(".pop");
	var height = $(window).height();
	$(".pop").css("height", height);
	pop.hide();
	pop.on("click", function() {
		pop.hide();
		document.documentElement.style.overflow = 'auto';
	});
	//点击跳转到下载页提示
	downloadJump($("body"), countAjaxUrl);
});

function getProduct(productid, once) {
	var baseurl=urlAddBuyerid("http://factory.aimingtai.com/client!getproduct.action");
	$.ajax({
		type: 'post',
		url: baseurl,
		dataType: 'json',
		async: false,
		data: {
			"productid": productid
		},
		success: function(data) {
			//产品信息
			//banner
			var bannerImgBox = '';
			var bannerImg = $(".carousel-inner");
			//产品信息
			var productMessHtml = '';
			var productMess = $(".product_mess");
			$.each(data, function(index, item) {
				//banner
				var imgSrc = item.allPics[0];
				bannerImgBox += '<div class="item active"><a><img src="' + nullToEmpty(imgSrc) + '"/></a></div>';
				//产品信息
				var productMe = item.description;
				if (productMe && productMe.length > 66) {
					productMessHtml += '<h4>产品介绍</h4><p class="lett2">' + nullToEmpty(productMe) + '</p>';
				} else {
					productMessHtml += '<h4>产品介绍</h4><p>' + nullToEmpty(productMe) + '</p>';
				}
				//根据产品id获取公司id
				companyid = item.tdSellerCompanyClientDTO.tdSellerCompany.companyid;
			});
			//banner
			bannerImg.html(bannerImgBox);
			//产品信息
			productMess.html(productMessHtml);
			if (once) {
				once = 0;
				getCompany(companyid, once);
				once = 1;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	})
}
//公司信息和产品列表获取数据
function getCompany(companyid, once) {
	var dataurl = urlAddBuyerid("http://factory.aimingtai.com/client!findCompanyById.action");
	$.ajax({
		type: 'post',
		url:dataurl,
		dataType: 'json',
		data: {
			"companyid": companyid
		},
		success: function(data) {
			//公司信息
			var companyMessHtml = '';
			var companyMess = $(".company_mess");
			//产品列表
			var productListHtml = '';
			var productList = $(".pro_list>ul");
			$.each(data, function(index, item) {
				//公司信息
				var comName = item.tdSellerCompany.name;
				var comNet = item.tdSellerCompany.logourl;
				var comMess = item.descriptionStr;
				if (!comMess || comMess.length < 72) {
					companyMessHtml += '<h4>' + nullToEmpty(comName) + '</h4><span>' + nullToEmpty(comNet) + '</span><p>' + nullToEmpty(comMess) + '</p>';
				} else {
					companyMessHtml += '<h4>' + nullToEmpty(comName) + '</h4><span>' + nullToEmpty(comNet) + '</span><p class="lett3">' + nullToEmpty(comMess) + '</p>';
				}

				//产品列表
				var productLi = item.prodlist;
				$.each(productLi, function(i, j) {
					var productImg = j.picUrl;
					var productTitle = j.title;
					var productKeywords = j.keywords;
					if (productTitle.length > 22) {
						productListHtml += '<li><a><div class="pro_person bbEc"><div class="pro_img fl_l"><img src="' + nullToEmpty(productImg) + '" /></div><div class="pro_mess fl_l"><h4 class="lett1">' + nullToEmpty(productTitle) + '</h4><span>' + nullToEmpty(productKeywords) + '</span></div></div></a></li>';
					} else if (productKeywords.leng > 22) {
						productListHtml += '<li><a><div class="pro_person bbEc"><div class="pro_img fl_l"><img src="' + nullToEmpty(productImg) + '" /></div><div class="pro_mess fl_l"><h4>' + nullToEmpty(productTitle) + '</h4><span class="lett1">' + nullToEmpty(productKeywords) + '</span></div></div></a></li>';
					} else if (productTitle.length > 22 && productKeywords.leng > 22) {
						productListHtml += '<li><a><div class="pro_person bbEc"><div class="pro_img fl_l"><img src="' + nullToEmpty(productImg) + '" /></div><div class="pro_mess fl_l"><h4 class="lett1">' + nullToEmpty(productTitle) + '</h4><span class="lett1">' + nullToEmpty(productKeywords) + '</span></div></div></a></li>';
					} else
						productListHtml += '<li><a><div class="pro_person bbEc"><div class="pro_img fl_l"><img src="' + nullToEmpty(productImg) + '" /></div><div class="pro_mess fl_l"><h4>' + nullToEmpty(productTitle) + '</h4><span>' + nullToEmpty(productKeywords) + '</span></div></div></a></li>';
				});
				//根据公司id获取产品id
				item.prodlist ? productid = item.prodlist[0].productid : productid = null;
			});
			//公司信息
			companyMess.html(companyMessHtml);
			//产品列表
			productList.html(productListHtml);
			if (once) {
				once = 0;
				if (productid) {
					getProduct(productid, once);
				}
				once = 1;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	})

}

function downloadJump(btnObj, countAjaxUrl) {
	//点击跳转下载页面
	btnObj.click(function myFunction() {
		setTimeout(function() {
			var r = confirm("下载找啊APP获取更多信息");
			var loactionid;
			r ? loactionid = 12 : loactionid = 13;
			countAjax(countAjaxUrl, loactionid);
			if (r == true) {
				window.location.href = 'http://www.aimingtai.com/appdownl.html?from=singlemessage&isappinstalled=1';
			}
		}, 300);
	});
}

//获取url中的某个参数
var getUrlParam = function(paramName) {
	var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}
window.confirm = function(message) {
	var iframe = document.createElement("IFRAME");
	iframe.style.display = "none";
	iframe.setAttribute("src", 'data:text/plain,');
	document.documentElement.appendChild(iframe);
	var alertFrame = window.frames[0];
	var result = alertFrame.window.confirm(message);
	iframe.parentNode.removeChild(iframe);
	return result;
};