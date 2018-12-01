function Slider($selector, _options){
	var $slider;
	var $currentSlide;
	var $slides;
	var startXPosition;
	var currentX;
	var startYPosition;
	var MINIMUM_DISPLACEMENT = 30;
	var $touchTarget = "";
	var inTransition=false;
	var options = {};
	var defaultOptions = {
		cover : true,
		automatic : false,
		hover : false,
		clickElementNext : $selector.find("*[data-navigation=next]"),
		clickElementPrev : $selector.find("*[data-navigation=prev]"),
		stepElement : $selector.find("*[data-index]"),
		timeAnimation : 1,
		delayAnimation : 0.2
	}

	options = Object.assign(defaultOptions, _options);

	constructor();

	function constructor(){
		initVariables();
		bindEvents();
	};
	function initVariables(){
		$slider = $selector.find(".slider");
		$currentSlide = $slider.find(".slide.active");
		$slides = $slider.find(".slide");
	}
	function bindEvents(){
		$(options["clickElementNext"]).click(nextSlide);	
		$(options["clickElementPrev"]).click(prevSlide);
		$(options["stepElement"]).click(function(event){
			goToSlide(event,$(event.currentTarget).attr("data-index"));
		});
		$slider.bind('touchstart', startTouchDetectionHorizontalInSlider);
		$slider.bind('touchmove', detectHorizontalTouchDirectionInSlider);
		$slider.bind('touchend', endTouchDetectionHorizontalInSlider);
		// Pasar a anterior/siguiente slider arrastrando el raton
		$slider.bind('mousedown', startTouchDetectionHorizontalInSlider);
		$slider.bind('mousemove', detectHorizontalTouchDirectionInSlider);
		$slider.bind('mouseup', endTouchDetectionHorizontalInSlider);
	}
	function goToSlide(event,x, left){
		$currentSlide = $slider.find(".slide.active");
		if(left==false && ($currentSlide.attr("data-index") > $($slides[x]).attr("data-index"))){
			left=true;
		};
		if (!inTransition) {
			inTransition=true;
			if($selector.attr("data-animate-slider-type") == "opacity"){
				opacity(event,x, left);
			}else if ($selector.attr("data-animate-slider-type") == "horizontal-opacity") {
				horizontalOpacity(event,x, left);
			}else if ($selector.attr("data-animate-slider-type") == "opacity-shape") {
				opacityShape(event,x, left);
			};
			if(options["stepElement"].length > 0){
				options["stepElement"].removeClass('active');
				$selector.find('*[data-index='+x+']').addClass('active');
			}		
		};
	}
	function nextSlide(event){
		$currentSlide = $slider.find(".slide.active");
		//Si llegamos al último slide volvemos al 0 ;

		if(Number(($currentSlide.index())+1) == Number($slider.find(".slide").length)){
			goToSlide(event, 0);
		}else{
			goToSlide(event, Number($currentSlide.index())+1);
		}
	}
	function prevSlide(event){
		$currentSlide = $slider.find(".slide.active");
		//Si llegamos al último slide volvemos al 0 ;
		if(($currentSlide.index()) == 0){
			goToSlide(event, $slider.find(".slide").length-1, true);
		}else{
			goToSlide(event, $currentSlide.index()-1, true);
		}
	}
	function startTouchDetectionHorizontalInSlider(event){
		$touchTarget = event.currentTarget;
		if(event.touches != undefined){
			startXPosition = event.touches[0].clientX;
		}else{
			startXPosition = event.pageX;
			$(event.currentTarget).parent().addClass("grabbing"); // Cambiamos el cursor 
		}
		currentX = startXPosition; //Restablecemos la posición del touch
	}
	//move horizontal
	var initialScroll = 0;
	function detectHorizontalTouchDirectionInSlider(event){
		var pos = 0;
		if(event.touches != undefined){
			pos = event.touches[0].clientX;
		}else{
			pos = event.pageX;
		}
		currentX = pos;
	}
	function endTouchDetectionHorizontalInSlider(event){
		//Si no es el mismo elemento no movemos slider;
		if( event.currentTarget===$touchTarget){

			if(currentX > startXPosition && currentX - startXPosition > MINIMUM_DISPLACEMENT  ){
		        prevSlide(event);
		    }else if(currentX < startXPosition && startXPosition - currentX > MINIMUM_DISPLACEMENT){
		        nextSlide(event);
		    }
		}
		$(event.currentTarget).parent().removeClass("grabbing"); // Cambiamos el cursor
	}


	function opacity(event,x,left){
		TweenMax.fromTo($currentSlide,options["timeAnimation"],{opacity:1},{opacity:0,ease: Power2.easeOut});
		$slides.removeClass("active");
		$($slides[x]).addClass("active");
		TweenMax.fromTo($($slides[x]),options["timeAnimation"],{opacity:0},{opacity:1,ease: Power2.easeInOut, delay:0.2,
			onComplete:function(){
				inTransition=false;
			}});
	}

	function opacityShape(event,x,left){
		setShapesOut($($slides[x]));
		animateShapesOut($currentSlide);
		var delay = 400;
		if($(window).innerWidth() < 760){
			delay = 0;
		}
		setTimeout(function(){
			TweenMax.fromTo($currentSlide,options["timeAnimation"],{opacity:1},{opacity:0,ease: Power2.easeOut,onComplete:function(){

			}});
			$slides.removeClass("active");
			$($slides[x]).addClass("active");
			TweenMax.fromTo($($slides[x]),options["timeAnimation"],{opacity:0},{opacity:1,ease: Power2.easeInOut, delay:0.2,
				onComplete:function(){
					inTransition=false;
				}});
			setTimeout(function(){
				animateShapesIn($($slides[x]));
			}, (options["timeAnimation"]-.2)*1000);

		},delay);
	}

	function horizontalOpacity(event,x,left){
		var factor = 1;
		if(left){
			factor = -1;
		}
		TweenMax.fromTo($currentSlide,1,{opacity:1, x:0},{opacity:0, x:(-180*factor),ease: Power2.easeOut});
		$slides.removeClass("active");
		$($slides[x]).addClass("active");
		TweenMax.fromTo($($slides[x]),1,{opacity:0, x:(90*factor)},{opacity:1, x:0,ease: Power2.easeInOut, delay:0.2,
			onComplete:function(){
				inTransition=false;
			}});
	}



}