function ScrollAnimations($selector,_options){
	var options = {};
	var defaultOptions = {
		animables : $(".js-animate"),
		timeAnimation : 0.8,
		delayAnimation: 0.2,
	}
	options = Object.assign(defaultOptions, _options);

	constructor();

	function constructor(){
		initVariables();
		bindEvents();
		prepareGeneralAnimations();
		animateGeneralElements();
	};

	function initVariables(){

	}
	
	function bindEvents(){
		// console.log(options["animables"]);	
		$(window).scroll(animateGeneralElements);
	}

	function prepareGeneralAnimations(){
		// console.log("prepareGeneralAnimations");
		var elements = options["animables"];
		// console.log(elements);
		for (var i = 0; i < elements.length; i++){
			var $elem = $(elements[i]);
			$elem.removeClass("js-animated");

			if($elem.data("animation-type") == "top-opacity"){
				TweenLite.set($elem, {opacity: 0, y: 40});
			}else if($elem.data("animation-type") == "bottom-opacity"){
				TweenLite.set($elem, {opacity: 0, y: -40});
			}else if($elem.data("animation-type") == "right-opacity"){
				TweenLite.set($elem, {opacity: 0, x: -40});
			}else if($elem.data("animation-type") == "left-opacity"){
				TweenLite.set($elem, {opacity: 0, x: 40});
			}else if($elem.data("animation-type") == "opacity-image"){
				TweenLite.set($elem, {opacity: 0});
			}else{
				TweenLite.set($elem, {opacity: 0});
			}
		};
		//All elements prepared
		$("body").addClass("js-animations-loaded");
	}

		
	function animateGeneralElements(){
		// var screenBottom = $(window).scrollTop() + $(window).innerHeight() * 0.8;
		var screenBottom = $(window).scrollTop() + $(window).innerHeight() * 1; 
		var screenTop = $(window).scrollTop() + $(window).innerHeight() * 0;

		var elements = $(".js-animate:not(.js-animated)");
		var myDelay = options["delayAnimation"];
		var myTime = options["timeAnimation"];

		var j =0;

		// console.error("-");
		for (var i = 0; i < elements.length; i++){
			var $elem = $(elements[i]);
			// console.log($elem);
			if( !$elem.hasClass("js-animated") &&
				(($elem.offset().top < screenBottom && $elem.offset().top > screenTop) ||
				(($elem.offset().top+$elem.innerHeight()) < screenBottom && ($elem.offset().top+$elem.innerHeight()) > screenTop) ||
				$(window).scrollTop() + $(window).innerHeight() >= $("body").innerHeight() - 65)) {
				// console.log(j);
				j = j+0.2;
				// myDelay = i*0.2;
				myDelay = j;
				$elem.addClass("js-animated");
				if($elem.data("animation-type") == "top-opacity" || $elem.data("animation-type") == "bottom-opacity"){
					TweenLite.to($elem, myTime, {opacity: 1, y: 0,  ease: Power2.easeOut, delay: myDelay});
				}else if($elem.data("animation-type") == "left-opacity" || $elem.data("animation-type") == "right-opacity"){
					TweenLite.to($elem, myTime, {opacity: 1, x: 0,  ease: Power2.easeOut, delay: myDelay});
				}else if($elem.data("animation-type") == "opacity-image"){
					if($elem[0].complete){
						TweenLite.to($elem, myTime, {opacity: 1, ease: Power2.easeInOut, delay: myDelay});
					}else{
						$elem.removeClass('js-animated');
					}
				}else{
					TweenLite.to($elem, myTime, {opacity: 1, ease: Power3.easeInOut, delay: myDelay});
				}
			}
		};



	}

	function animateGeneral(){
		var screenBottom = $(window).scrollTop() + $(window).innerHeight() * 1;
		for(i = 0; i < options["animables"].length ; i++){
			if($($(options["animables"][i])).attr("data-animate") == "animable" && $($(options["animables"][i])).offset().top < screenBottom ){
				if($(options["animables"][i]).attr("data-animation-type")=="opacity"){
					opacity($(options["animables"][i]));	
				}
				$($(options["animables"][i])).attr("data-animate","animated");
			}
		}
	}

	function opacity($animable){
		TweenMax.to($animable,options["timeAnimation"],{opacity:0,ease: Power2.easeOut});
	}

	// Header hidden on scroll

	var lastPositionScrollTop = 0;
 
	$(window).scroll(function () {
		var position = $(this).scrollTop();
		if (position < lastPositionScrollTop){
			TweenMax.to('header',.3,{top:0,ease:Power2.easeOut});
		} else {
			TweenMax.to('header',.3,{top:-200,ease:Power2.easeOut});
		}

		lastPositionScrollTop = position;
	});

}