! function($) {
	var Tab = function(tab,setConfig) {
		var _this_ = this;
		this.tab = tab;
		this.config = {
			"triggerType": "click",
			"effect": "default",
			"invoke": 1,
			"auto": false
		};
		if(setConfig && setConfig != "") {
			$.extend(this.config, setConfig);
		};

		var config = this.config;

		this.tabItems = this.tab.find("ul.tab-nav li");
		this.contentItems = this.tab.find("div.tab-content div.content-item");

		if(config.triggerType == "click") {
			this.tabItems.on(config.triggerType, function() {
				_this_.invoke($(this));
			});
		} else if(config.triggerType == "mouseover" || config.triggerType != "click") {
			this.tabItems.mouseover(function() {
				_this_.invoke($(this));
			});
		};

		if(config.auto) {
			this.timer = null;
			this.loop = 0;
			this.autoPlay();

			this.tab.hover(function() {
				window.clearInterval(_this_.timer);
			}, function() {
				_this_.autoPlay();
			});

		};

		if (config.invoke > 1) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};

	Tab.prototype = {
//		getConfig: function() {
//			var config = this.tab.attr("data-config");
//			if(config && config != "") {
//				return $.parseJSON(config);
//			} else {
//				return null;
//			};
//		},
		invoke: function(currentTab) {
			var _this_ = this;
			var index = currentTab.index();
			var effect = this.config.effect;
			currentTab.addClass("active").siblings().removeClass("active");

			if(effect == "default" || effect != "fade") {
				this.contentItems.eq(index).addClass("current").siblings().removeClass("current");
			} else if(effect == "fade") {
				this.contentItems.eq(index).stop().fadeIn().siblings().stop().fadeOut();
			};

			if(this.config.auto) {
				this.loop = index;
			}
		},
		autoPlay: function() {
			var _this_ = this,
				tabItems = this.tabItems,
				tabLength = tabItems.length,
				config = this.config;

			this.timer = window.setInterval(function() {
				_this_.loop++;
				if(_this_.loop >= tabLength) {
					_this_.loop = 0;
				};

				tabItems.eq(_this_.loop).trigger(config.triggerType);
			}, config.auto);

		}
	};

	//tab初始化函数
	Tab.init = function (tabs) {
		var _this_ = this;

		tabs.each(function () {
			new _this_($(this));
		});
	};

	//注册成jquery方法
	$.fn.extend({
		tab:function(config){
			console.log(config);
			this.each(function () {
				new Tab($(this),config || null);
			});
			//返回对象,可以继续链式调用
			return this;
		}
	});

	window.Tab = Tab;
}(jQuery);