$(window).on("load",function(){
	loadJS();
	
})


function bindEvents(){
	// Antes de recargar, scrolltop(0)
	$(window).on("beforeunload", function(){
		$(window).scrollTop(0);
	});
	// scroll top for ios
	$(window).on("unload", function(){
		$(window).scrollTop(0);
	});
	//bindeos
	// $("a").click(nav_innerLinkClicked);
	// $(window).off("popstate", nav_manageBackNavigation);
	// $(window).on("popstate", nav_manageBackNavigation);
	// $('body').on('endChangeBody', nav_manageBackNavigationRecursive);

	
	$('.header .burger').click(openMenu);
	$('.hidden-menu .close').click(closeMenu);
	console.log($('.slider-container'));
	$('.slider-container').each(function(i, item){
		console.log(item);
		new Slider($(item));
	})
}

function openMenu(){
	$('body').addClass('overflow-hidden');
	$('.hidden-body').addClass('active');
	$('.burger').addClass('hidden');
	$('.menu').addClass('hidden');
	
	TweenMax.to('.hidden-menu-container',.2, {autoAlpha:1, ease:Power2.easeIn});
	TweenMax.to('.hidden-body',.2, {autoAlpha:.8, ease:Power2.easeIn});

	$('.hidden-body').removeClass('hidden');
	$('.hidden-menu-container').removeClass('hidden');
}

function closeMenu(){
	$('body').removeClass('overflow-hidden');
	$('.hidden-body').addClass('hidden');
	$('.hidden-menu-container').addClass('hidden');
	$('.menu').removeClass('hidden');
	$('.burger').removeClass('hidden');

	TweenMax.to('.hidden-menu-container',.2, {autoAlpha:0, ease:Power2.easeIn});
	TweenMax.to('.hidden-body',.2, {autoAlpha:0, ease:Power2.easeIn});
}

function pageTransition(){

}



/////////////////////////////////////////////////////////////////////////////////
//// - Manage Tactil & Mobile
/////////////////////////////////////////////////////////////////////////////////
//Funciones para dispositivos táctiles.
function isTouchDevice() {
	return $("body").hasClass("touch-device");
}
function canCreateTouchEvent() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}
function vhIosMobile(){
	$(".js-vh").each(function(i, item){
		$(item).css("height", "" );
		$(item).css("height", $(item).innerHeight() );
		// strStyle = strStyle.split(";");		
	});
}



/////////////////////////////////////////////////////////////////////////////////
//// - Manage Scroll - Disable / Enable Scroll
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
  $("body").addClass("overflow-hidden");
}

function enableScroll() {
  scrollEnabled = true;
	if (window.removeEventListener)
		window.removeEventListener('DOMMouseScroll', preventDefaultForScroll, false);
	window.onmousewheel = document.onmousewheel = null; 
	window.onwheel = null; 
	window.ontouchmove = null;  
	document.onkeydown = null;  
	$("body").removeClass("overflow-hidden");
}




function loadJS(){
	


	oldWidth = $(window).innerWidth();
	// $(".js-vh").css("height", $(window).innerHeight());
	vhIosMobile();

	// if( $("section").hasClass("section-home") ){
	// 	home_docReady();
	// 	home_docLoad();
	// }else if( $("section").hasClass("section-projects") ||  $("section").hasClass("section-single-project") ){
	// 	project_docReady();
	// 	project_docLoad();
	// }else if( $("section").hasClass("section-contact") ){
	// 	contact_docReady();
	// 	contact_docLoad();
	// }

	if(canCreateTouchEvent){
		isTouchDevice();	
	}

	new ScrollAnimations();
	bindEvents();
	
	// animateShapesOut();
	setShapesOut($('.wings-slide'));
	animateShapesIn($('.wings-slide'));

}

function animateFirstScreen(){ 
	enableScroll();
}




function setShapesOut($container){
	var $shapes = $container.find(".shape polygon");
	TweenMax.set($shapes, {x:"-100%"});
	$(".shape-container").css("opacity","1");
}

function animateShapesOut($container){
	console.warn("animateShapesOut");
	var $shapes = $container.find(".shape");
	var myDelay = 0;
	var myTime = .6;
	
	for (var i = 0; i < $shapes.length; i++) {
		var elem = $($shapes[i]).find("polygon");
		// console.log(elem);
		TweenMax.to(elem, myTime, {x:"-100%", delay: myDelay, ease:Power2.easeIn});
		// myDelay = myDelay + 0.4;
	}
	setTimeout(function(){
		$(".shape-container").css("opacity","0");
	},(myTime+myDelay)*1000);
}

function animateShapesIn($container){
	console.log($container);
	var $shapes = $container.find(".shape");
	var myDelay = 0;

	$(".shape-container").css("opacity","1");
	for (var i = 0; i < $shapes.length; i++) {
		var elem = $($shapes[i]).find("polygon");
		TweenMax.to(elem, 1, {x:"0%", delay: myDelay, ease:Power2.easeOut});
		// myDelay = myDelay + 0.4;
	}

}