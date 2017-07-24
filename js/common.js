/**
 * Created by xuezhucao on 16/7/14.
 */
//switch
var isConsole = true;

var redirect = function(page) {
	top.location.href = page;
}

var iframeRedirect = function(page) {
	window.location.href = page;
}

var iframeHistoryBack = function() {
	//parent.frames["iframe"].history.go(-1);
	window.history.go(-1);
	//window.history.back(-1);
}

var myAlert = function(msg) {
	alert(msg);
};

var myConfirm = function(msg) {
	return confirm(msg);
};

var myConsole = function(msg) {
	if (isConsole) {
		console.log(msg);
	}
};

var isEmpty = function(val) {
	if (val == undefined || val == null ||
		(Object.prototype.toString.call(val) === "[object String]" &&
			(val.trim() == "" || val == "undefined" || val == "null"))) {
		return true;
	}
	return false;
};

var isNotEmpty = function(val) {
	return !isEmpty(val);
};

var isEmptyOrZero = function(val) {
	if (val == undefined || val == null ||
		(Object.prototype.toString.call(val) === "[object String]" &&
			(val.trim() == "" || val == "undefined" || val == "null" || val == "0")) || Number(val) == 0) {
		return true;
	}
	return false;
};

var isDebug = function() {
	if (env == "debug") {
		return true;
	}
	return false;
};

var isOnline = function() {
	if (env == "online") {
		return true;
	}
	return false;
};

String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof(args) == "object") {
			for (var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
};

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.contains = function(needle) {
	for (i in this) {
		if (this[i] == needle) return true;
	}
	return false;
}

/** 
 * 时间对象的格式化; (new Date(PublishDate)).format("yyyy年MM月")
 */
Date.prototype.format = function(format) {
	/* 
	 * eg:format="yyyy-MM-dd hh:mm:ss"; 
	 */
	var o = {
		"M+": this.getMonth() + 1, // month  
		"d+": this.getDate(), // day  
		"h+": this.getHours(), // hour  
		"m+": this.getMinutes(), // minute  
		"s+": this.getSeconds(), // second  
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
		"S": this.getMilliseconds()
			// millisecond  
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 -
			RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
				o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

/*null、undefined转空*/
var nullToEmpty = function(value) {
	if (isEmpty(value)) {
		return "";
	} else {
		return value;
	}
};

/*米转厘米;1.丢弃小数部分,保留整数部分 
js:parseInt(7/2) 
2.向上取整,有小数就整数部分加1 
js: Math.ceil(7/2) 
3,四舍五入. 
js: Math.round(7/2) 
4,向下取整 
js: Math.floor(7/2)*/
var mToCm = function(value) {
	if (isEmpty(value)) {
		return null;
	} else {
		return Math.round(Number(value) * 100);
	}
};

/*厘米转米*/
var cmToM = function(value) {
	if (isEmpty(value)) {
		return "";
	} else {
		return Number(value) / 100;
	}
};

/*吨转千克*/
var tToKg = function(value) {
	if (isEmpty(value)) {
		return null;
	} else {
		return Math.round(Number(value) * 1000);
	}
};

/*千克转吨*/
var kgToT = function(value) {
	if (isEmpty(value)) {
		return "";
	} else {
		return Number(value) / 1000;
	}
};

/*立方米转立方分米*/
var mToDmCube = function(value) {
	if (isEmpty(value)) {
		return null;
	} else {
		return Math.round(Number(value) * 1000);
	}
};

/*立方分米转立方米*/
var dmToMCube = function(value) {
	if (isEmpty(value)) {
		return "";
	} else {
		return Number(value) / 1000;
	}
};

//获取url中的某个参数
var getUrlParam = function(paramName) {
	var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}

//拼接请求数据
var jointRequestDataOld = function(keyArr, valueArr) {
	var requestDataJsonStr = "{";

	$.each(valueArr, function(index, value) {
		if (!isEmpty(String(value))) {
			var key = keyArr[index];
			if (!isNaN(value) || value == true || value == false) {
				requestDataJsonStr += "\"" + key + "\": " + value + ",";
			} else {
				requestDataJsonStr += "\"" + key + "\": \"" + value + "\",";
			}
		}
	});

	if (requestDataJsonStr.length > 0) {
		//移除最后一个逗号
		requestDataJsonStr = requestDataJsonStr.substring(0, requestDataJsonStr.length - 1);
	}
	requestDataJsonStr += "}";

	myConsole("requestDataJson: " + requestDataJsonStr);
	var requestDataJson = JSON.parse(requestDataJsonStr);

	return requestDataJson;
};

//拼接请求数据
var jointRequestData = function(keyArr, valueArr) {
	var requestDataJson = {};

	$.each(valueArr, function(index, value) {
		//if(!isEmpty(value)) {
		var key = keyArr[index];
		requestDataJson[key] = value;
		//}
	});

	myConsole("requestDataJson: " + JSON.stringify(requestDataJson));
	return requestDataJson;
};

/*解析服务返回的包含缩略图和原图信息的数据
"{\"O1050X1050\":\"1-287adacd206d4be5adc689a455310fbd.jpg\",\"C210X210\":\"1-287adacd206d4be5adc689a455310fbd.jpg@210w_210h\"}",
*/
var parseResponseImageInfo = function(imgInfo) {
	if (isEmpty(imgInfo)) {
		return null;
	}

	var imgInfoJson = {};
	$.each(JSON.parse(imgInfo), function(key, imgName) {
		if (!isEmpty(key)) {
			var imgInfoItemJson = {};
			var newKey = key.substring(0, 1);
			var widthHeightInfo = key.substring(1);
			var widthHeightArr = widthHeightInfo.split("X");
			var width = widthHeightArr[0];
			var height = widthHeightArr[1];

			imgInfoItemJson["width"] = width;
			imgInfoItemJson["height"] = height;
			imgInfoItemJson["name"] = imgName;

			imgInfoJson[newKey] = imgInfoItemJson;
		}
	});

	myConsole("imgInfoJson: " + JSON.stringify(imgInfoJson));
	return imgInfoJson;
};

/*显示加载中背景弹窗*/
var showLoadingPop = function() {
	$(window.parent.document).find("div[id=pop_loading]").show();
};

/*隐藏加载中背景弹窗*/
var hideLoadingPop = function() {
	$(window.parent.document).find("div[id=pop_loading]").hide();
};

/*jquery 页面滚动到指定DIV,参数id为页面元素id */
function scrollTo(id) {
	$("html,body").stop(true);
	$("html,body").animate({
		scrollTop: $("#" + id).offset().top
	}, 400);
}

/*监听浏览器后退事件*/
var windowHistoryPushState = function(e) {
	if (window.history && window.history.pushState) {
		$(window).on('popstate', function() {
			window.history.pushState('forward', null, '#');
			window.history.forward(1);

			//myAlert("不可回退");
			switchToIframeOne();
		});
	}

	//在IE中必须得有这两行
	window.history.pushState('forward', null, '#');
	window.history.forward(1);
};

/*切换显示Iframe one*/
var switchToIframeOne = function(toUrl) {
	$(window.parent.document).find("iframe[id=iframe]").show();
	$(window.parent.document).find("iframe[id=iframe_two]").hide();
};

/*切换显示Iframe Two*/
var switchToIframeTwo = function(toUrl) {
	$(window.parent.document).find("iframe[id=iframe_two]").attr('src', toUrl);
	$(window.parent.document).find("iframe[id=iframe]").hide();
	$(window.parent.document).find("iframe[id=iframe_two]").show();
};

//将token保存到sessionStorage
var setTokenSession = function(token) {
	var currentTimeStamp = new Date().getTime();
	sessionStorage.token = token;
	sessionStorage.tokenTimeStamp = currentTimeStamp;
};

//从sessionStorage中获取token
var getTokenSession = function() {
	var currentTimeStamp = new Date().getTime();
	var tokenTimeStamp = sessionStorage.tokenTimeStamp;
	if (isEmpty(tokenTimeStamp)) {
		tokenTimeStamp = currentTimeStamp;
	};
	if (currentTimeStamp - tokenTimeStamp < TOKEN_VALIDITY_PERIOD) {
		return String(sessionStorage.token);
	} else {
		sessionStorage.token = "";
		sessionStorage.tokenTimeStamp = currentTimeStamp;
		return "";
	}
};

//将token保存到localStorage
var setTokenLocal = function(token) {
	var currentTimeStamp = new Date().getTime();
	localStorage.token = token;
	localStorage.tokenTimeStamp = currentTimeStamp;
};

//从localStorage中获取token
var getTokenLocal = function() {
	var currentTimeStamp = new Date().getTime();
	var tokenTimeStamp = localStorage.tokenTimeStamp;
	if (isEmpty(tokenTimeStamp)) {
		tokenTimeStamp = currentTimeStamp;
	};
	if (currentTimeStamp - tokenTimeStamp < TOKEN_VALIDITY_PERIOD) {
		return String(localStorage.token);
	} else {
		localStorage.token = "";
		localStorage.tokenTimeStamp = currentTimeStamp;
		return "";
	}
};

//获取token
var getToken = function() {
	var tokenLocal = getTokenLocal();
	var tokenSession = getTokenSession();
	if (isEmpty(tokenSession)) {
		return tokenLocal;
	} else {
		return tokenSession;
	}
};

//检查token是否为空
var getTokenOK = function() {
	var token = getToken();
	if (isEmpty(token)) {
		return false;
	} else {
		return true;
	}
};

//检查当前用户是否有admin角色
var checkIsAdminRole = function() {
	var result = false;

	if (Number(localStorage.isAdminRole) == 1) {
		result = true;
	}

	return result;
};

//检查当前用户是否有此功能权限，参数为：功能权限id
var checkPermission = function(funcId) {
	var result = false;

	//myConsole("checkPermission localStorage.isAdminRole：" + localStorage.isAdminRole + "；funcId：" + funcId);

	if (Number(localStorage.isAdminRole) == 1) {
		result = true;
	} else {
		//用户具有的所有功能
		var userAllFunc = localStorage.userAllFunc;

		if (!isEmpty(userAllFunc)) {
			var userAllFuncJson = JSON.parse(userAllFunc);
			if (!isEmpty(userAllFuncJson)) {
				var funcIdStr = funcId.toString();
				if (!isEmpty(userAllFuncJson[funcIdStr])) {
					result = true;

					return result;
				}
			}
		}
	}

	return result;
};

//检查当前用户是否admin用户或者创建者
var checkIsAdminOrCreator = function(creatorId) {
	var result = false;

	if (Number(localStorage.isAdminRole) == 1) {
		result = true;
	} else {
		//当前登录用户id
		var userId = localStorage.userId;

		if (!isEmpty(userId) && !isEmpty(creatorId)) {
			if (Number(userId) == Number(creatorId)) {
				result = true;
			}
		}
	}

	//myConsole("checkIsAdminOrCreator localStorage.isAdminRole：" + localStorage.isAdminRole + "；localStorage.userId：" + localStorage.userId + "；creatorId：" + creatorId);

	return result;
};

//parent slide up
var parentSlideUp = function(obj) {
	$(obj).parent().slideUp();
};
//展会相关公共部分
//轮播图的touch事件
function banner() {
	var carousel = document.querySelector('.carousel');
	var startX = 0;
	var moveX = 0;
	var distance = 0;
	//绑定触屏事件
	carousel.addEventListener('touchstart', function(e) {
		//记录触屏开始的数据
		startX = e.targetTouches[0].clientX;
	})
	carousel.addEventListener('touchmove', function(e) {
			//记录触屏开始的数据
			moveX = e.targetTouches[0].clientX;
			distance = moveX - startX;
		})
		//绑定触屏结束事件
	carousel.addEventListener('touchend', function(e) {
		if (distance > 0) {
			$(this).carousel('prev');
		}
		if (distance < 0) {
			$(this).carousel('next');
		}
		//数据重置
		startX = 0;
		moveX = 0;
		distance = 0;
	})
}
banner();
//轮播图禁止自动滚动
	$('#carousel-example-generic').carousel({
		interval: 3000
	});
	
//统计数据
/*
 * 两个参数时：
 * par1是ajax请求的url
 * par2是locationid
 * par3是表示公司或者产品
 * par4是对应的par3的id
 * 四个参数时
 * par1是ajax请求的url
 * par2是locationid
 */
function countAjax(par1, par2, par3, par4) {
	dataJson = {
			'activityid': 1,
			'locationid': par2,
//			'buyerid':buyerid
		}
	if (arguments.length == 4) {
		dataJson[par3] = par4;
	}
	$.ajax({
		type: 'post',
		url: par1,
		dataType: 'json',
		data: dataJson,
		success: function(data) {
			console.log(data[0].code);
		}
	})
}
//buyerid封装
function urlAddBuyerid(url){
	var buyerid;
	if(window.localStorage.getItem("buyerid")){
		buyerid = window.localStorage.getItem("buyerid");
	}else{
		buyerid = Math.floor(Math.random()*10000000000);
		window.localStorage.setItem("buyerid",buyerid);
	}
	return url + "?buyerid="+buyerid;
}


