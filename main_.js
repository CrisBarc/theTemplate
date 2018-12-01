
//Se pone por separado, porque el loadJS se va a llamar desde otras páginas
$(window).on('load', function(){
	loadJS();
	slider_home = new Slider($('.slider-container'));
});

$(document).ready( function(){
		firstDocumentReady();
})


// Primer document ready: sólo se ejecuta en el document.ready de la primera página (no se ejecuta durante la navegación interna)
function firstDocumentReady(){
	// Hacemos el replaceState inicial
	// nav_pushFirstState();
	// Animamos el progreso y retiramos la cortina de preload
	// animateShowPreload();

}

function loadJS(){
	if( $("section").hasClass("section-home") ){
		home_docReady();
		home_docLoad();
	}

	bindEvents();
	initializeGlobalVariables();
}

function animateFirstScreen(){ // Nota: la llamada a esta función está comentada, no se quieren animaciones iniciales
	if( $("section").hasClass("section-home") ){
		home_animateFirstScreen();
	}else{
		general_animateFirstScreen();
	}
}


function bindEvents(){
	$(window).on("beforeunload", function(){
			$(window).scrollTop(0);
	});
	 // Navegación sin recarga
	// $("a").click(nav_innerLinkClicked);
	// $(window).off("popstate", nav_manageBackNavigation);
	// $(window).on("popstate", nav_manageBackNavigation);


	//// Bindeamos el suavizado de scroll  
	// $(window).mousewheel(softScrollWheel);
	// $(window).scroll( updateSoftScrollPosition );
	// updateSoftScrollPosition();

	// Pasar a anterior/siguiente slider con el dedo
	// $(".slider-container .slider").bind('touchstart', startTouchDetectionHorizontalInSlider);
	// $(".slider-container .slider").bind('touchmove', detectHorizontalTouchDirectionInSlider);
	// $(".slider-container .slider").bind('touchend', endTouchDetectionHorizontalInSlider);
	// // Pasar a anterior/siguiente slider arrastrando el raton
	// $(".slider-container .slider").bind('mousedown', startTouchDetectionHorizontalInSlider);
	// $(".slider-container .slider").bind('mousemove', detectHorizontalTouchDirectionInSlider);
	// $(".slider-container .slider").bind('mouseup', endTouchDetectionHorizontalInSlider);

}






function initializeGlobalVariables(){
	
}

//Funciones para dispositivos tactiles.
function isTouchDevice() {  
	try {  
		document.createEvent("TouchEvent");  
		return true;  
	} catch (e) {  
		return false;  
	}  
}

function addTouchClass(){
	if( !$("html").hasClass("touch-device") )
		$("html").addClass("touch-device");
}

function removeTouchClass(){
	if( $("html").hasClass("touch-device") )
		$("html").removeClass("touch-device");  
}



/////////////////////////////////////////////////////////////////////////////////
// SUAVIZAR SCROLL
/////////////////////////////////////////////////////////////////////////////////
function softScrollWheel (event, delta, deltaX, deltaY){
		var isTrackPad = false;
		if(event["deltaFactor"]!=100&&event["deltaFactor"]!=147.750&&parseInt(event["deltaFactor"])!=92){
			isTrackPad = true;
		}
		if(!isTrackPad && !$("body").hasClass("overflow-hidden") && !firstScrollDone){
			// if(!isMobile){
				// console.log("scroll");
				event.preventDefault();
				smoothScrolling = true;
				if (deltaY < 0){ 
					goingToScrollTop+=SCROLLINC;         
					wheelAnim = TweenLite.to("html, body",0.7,{ scrollTop:  goingToScrollTop, ease: Power1.easeOut, onComplete:function(){setTimeout(function(){if(!wheelAnim.isActive()) smoothScrolling=false;},50); }});
				}else if (deltaY > 0){
					goingToScrollTop-=SCROLLINC;
					wheelAnim = TweenLite.to("html, body",0.7,{ scrollTop: goingToScrollTop, ease: Power1.easeOut, onComplete:function(){setTimeout(function(){if(!wheelAnim.isActive()) smoothScrolling=false;},50); }});
				}
				if(goingToScrollTop<0)goingToScrollTop=0;
				if(goingToScrollTop>($(document).height()-$(window).innerHeight())) goingToScrollTop = $(document).height()-$(window).innerHeight();
				return false;
			// }
			// else return true;
		}
}

function updateSoftScrollPosition(){
	// Si no se está scrolleando con mousewheel, actualizamos la variable goingToScrollTop
	if( !smoothScrolling ){
		goingToScrollTop = $(window).scrollTop();
	}
}


/////////////////////////////////////////////////////////////////////////////////
// Disable / Enable Scroll
/////////////////////////////////////////////////////////////////////////////////
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefaultForScroll(e) {
	e = e || window.event;
	if (e.preventDefault)
			e.preventDefault();
	e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
		if (keys[e.keyCode]) {
				preventDefaultForScroll(e);
				return false;
		}
}

function disableScroll() {
	scrollEnabled = false;
	if (window.addEventListener) // older FF
			window.addEventListener('DOMMouseScroll', preventDefaultForScroll, false);
	window.onwheel = preventDefaultForScroll; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefaultForScroll; // older browsers, IE
	window.ontouchmove  = preventDefaultForScroll; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
	scrollEnabled = true;
		if (window.removeEventListener)
				window.removeEventListener('DOMMouseScroll', preventDefaultForScroll, false);
		window.onmousewheel = document.onmousewheel = null; 
		window.onwheel = null; 
		window.ontouchmove = null;  
		document.onkeydown = null;  
}



//////////////////////////////////////////////////////////////////
// ANIMACIÓN PRIMER SCROLL
//////////////////////////////////////////////////////////////////

var startYPosition;
var currentY;
var MINIMUM_DISPLACEMENT = 10;

var scrollEnabled = true;
var firstScrollDone = false;

function animateFirstScroll(event, delta, deltaX, deltaY){
	if( scrollEnabled && !firstScrollDone && $(window).scrollTop() <= 10 && deltaY < 0 ){
		var isTrackPad = false;
		if(event["deltaFactor"]!=100&&event["deltaFactor"]!=147.750&&parseInt(event["deltaFactor"])!=92 && !(typeof InstallTrigger !== 'undefined')  ){
			isTrackPad = true;
		}
		if( isTrackPad ){
			event.preventDefault();
			if( deltaY < -10 && Math.abs(deltaY) > Math.abs(deltaX) )
				executeFirstScroll(event);
		}else{
			executeFirstScroll(event);
		}
	}
}



function executeFirstScroll(event){
	firstScrollDone = true;
	var scrollTo = window.innerHeight ;
	TweenMax.to( $("html, body"), 1, {scrollTop: scrollTo, ease:Power2.easeInOut, onComplete:function(){
		firstScrollDone = false;
	}});
}


function animateFirstScrollToTop(event, delta, deltaX, deltaY){
	if( scrollEnabled && !firstScrollDone && $(window).scrollTop() <= window.innerHeight + 100 && $(window).scrollTop() >= window.innerHeight*0.5 && deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) ){

		var isTrackPad = false;
		if(event["deltaFactor"]!=100&&event["deltaFactor"]!=147.750&&parseInt(event["deltaFactor"])!=92 && !(typeof InstallTrigger !== 'undefined')){
			isTrackPad = true;
		}
		if( isTrackPad ){
			event.preventDefault();
			if( deltaY > 10 && Math.abs(deltaY) > Math.abs(deltaX) )
				executeFirstScrollToTop(event);
		}
		else{
			executeFirstScrollToTop(event);
		}
	}
}

function executeFirstScrollToTop(event){
	firstScrollDone = true;
	TweenMax.to( $("html, body"), 1, {scrollTop: 0, ease:Power2.easeInOut, onComplete:function(){
		firstScrollDone = false;
	}});
}


//////////////////////////////////////////////////////////////////
//////////////////////////////////// FIN ANIMACIÓN PRIMER SCROLL
//////////////////////////////////////////////////////////////////




//////////////////////////////////////////
// SLIDER 
//////////////////////////////////////////
//Función que va a un slider X
/*
function goToSlide(event,x){
	if(!inTransition){
		inTransition = true;
		var $currentTarget = $(event.currentTarget);
		var $slider = $($currentTarget.closest(".slider-container")).find(".slider");

		var $slides = $slider.find(".slide");
		var $slides2 = $slider.find(".slide2");
		var $currentSlide = $slider.find(".slide.active");
		
		var $steps = $($currentTarget.closest(".slider-container")).find(".step");
		var $currentStep = $($currentTarget.closest(".slider-container")).find(".step.active");

		var $numbersContainer = $($currentTarget.closest(".slider-container")).find(".numbers");
			
		var $buttonNext = $($currentTarget.closest(".slider-container")).find(".right-container .arrow-container");
		var $buttonPrev = $($currentTarget.closest(".slider-container")).find(".left-container .arrow-container");


		TweenMax.to($currentSlide, 0, {"left":"50%"});
		$currentSlide.find(".text").css("opacity","0");
		TweenMax.to($slides[x], 0, {"left":"200%"});

		//Cambiamos de slide
		var time = 2;
		var myDelay = 1;
		
		TweenMax.to($currentSlide, time, {"left":"-100%", ease: Power3.easeInOut});

		TweenMax.to($slides[x], time,{opacity:1, "left":"50%", ease: Power3.easeInOut, delay: 0.5, onComplete: function(){
			$slides.removeClass("active");
			$($slides[x]).addClass("active");
			$($slides[x]).find(".text").css("opacity","1");
			inTransition = false;
		}});	
		

		// animateSlider=true;
		// setTimeout(function(){
		//   animateSlider=false;
		// },0.6);

		//Actualizamos steps
		$steps.removeClass("active");
		$($steps[x]).addClass("active");
		//Actualizamos number
		$numbersContainer.find(".current-number").text(x+1);

		//Si el slider es automatico, al cambiar slide reiniciamos progress bar.
		if($slider.parent().hasClass("automatic-slider")){
			tweenSlideProgress.play(0);
		}
	}
}

//Función que pasa al siguiente slide
function nextSlide(event){
	var $currentTarget = $(event.currentTarget);
	var $slider = $($currentTarget.closest(".slider-container")).find(".slider");
	var $currentSlide = $slider.find(".slide.active");

	//Si llegamos al último slide volvemos al 0 ;
	if(($currentSlide.index()+1) == $slider.find(".slide").length)
		goToSlide(event, 0);
	else  
		goToSlide(event, $currentSlide.index()+1);
}


//Función que pasa al slide anterior
function prevSlide(event){
	var $currentTarget = $(event.currentTarget);
	var $slider = $($currentTarget.closest(".slider-container")).find(".slider");
	var $currentSlide = $slider.find(".slide.active");
	
	//Si llegamos al primer slide volvemos al último;
	if(($currentSlide.index()) == 0)
		goToSlide(event, $slider.find(".slide").length-1);
	else  
		goToSlide(event, $currentSlide.index()-1);
}


//////////////////////////////////////////////////////////////////
//////////// NAVEGAR POR EL SLIDER DESPLAZANDO EL DEDO ////////////
//////////////////////////////////////////////////////////////////
//start horizontal
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
function detectHorizontalTouchDirectionInSlider(event){
	var pos = 0;
	if(event.touches != undefined){
		pos = event.touches[0].clientX;
	}else{
		pos = event.pageX;
	}
	currentX = pos;
}
//end horizontal
function endTouchDetectionHorizontalInSlider(event){
	//Si no es el mismo elemento no movemos slider;
	if( event.currentTarget===$touchTarget){
		if(currentX > startXPosition && currentX - startXPosition > MINIMUM_DISPLACEMENT  ){
					// $(".slider-container.automatic-slider .controls-container .left-container .arrow-container").click();
					prevSlide(event);
			}else if(currentX < startXPosition && startXPosition - currentX > MINIMUM_DISPLACEMENT){
					// $(".slider-container.automatic-slider .controls-container .right-container .arrow-container").click();
					nextSlide(event);
			}
	}
	$(event.currentTarget).parent().removeClass("grabbing"); // Cambiamos el cursor
}


function manageTrackpadNavigation(event, delta, deltaX, deltaY){ 
	var isTrackPad = false;
	console.log(event);
	if(event["deltaFactor"]!=100&&event["deltaFactor"]!=147.750&&parseInt(event["deltaFactor"])!=92){
		isTrackPad = true;
	}
	if(isTrackPad && animateSlider==false){
		// event.preventDefault();
		if( deltaX > 10 ){
			nextSlide(event);
		}
		else if( deltaX < -10 ){
			prevSlide(event);
		}
	}
}
*/
