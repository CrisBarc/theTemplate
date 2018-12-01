

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
/////////////////////////// NAVEGACIÓN ///////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// Para que funcione la navegación sin recarga:
// - Tener creada la función loadJS(), para que se llame y se reinicie el JS cada vez que se navega
// - Tener las funciones de enableScroll() y disableScroll(), junto con aquellas que usen
// - Añadir la llamada a la función nav_getPagesFromLinks() cada vez que se navegue de página (en menu_docReady, por ejemplo)
// - Añadir los siguientes bindeos cada vez que se navegue de página (en menu_bindEvents, por ejemplo) 
//		- $("a").click(nav_innerLinkClicked); 
//		- $(window).off("popstate", nav_manageBackNavigation);
//		- $(window).on("popstate", nav_manageBackNavigation);
// - Al terminar todas las animaciones iniciales, ejecutar nav_animatingLink = false para permitir la navegación


// Recorre los links internos de la página actual, y realiza la petición de cada uno
var nav_linksPages = {};
// Para saber si se está navegando o no.
// Empieza siendo true para que no se pueda navegar justo al entrar en la página (se modificará al terminar las animaciones iniciales)
var nav_animatingLink = false;


$(document).ready(function(){
	// Guardamos la pagina actual en la que estamos
	nav_linksPages[location.href] = document.documentElement.outerHTML;
	// Hacemos el replaceState inicial
	nav_pushFirstState();
	// Recorremos todos los enlaces para guardarlos
	nav_getPagesFromLinks($(document).find("a[href]"));
});

function nav_getPagesFromLinks( allLinks){
	var $links = $("a[href]");
	if( allLinks != undefined ){
		$links = allLinks;
	}

	for( var i=0; i<$links.length; i++ ){
		var $link = $($links[i]);
		var href = $link.attr("href");
		
		// Si es un link interno, y si no está ya añadido al objeto
		if( $link.attr("target") == null  &&
			$link.attr("target") != false &&
			href != null &&
			href.indexOf('tel:') !== 0 &&
			href.indexOf('mailto:') !== 0 &&
			href.indexOf('whatsapp:') !== 0 &&
			!$(this).hasClass('popup-youtube') &&
			nav_linksPages[href] == undefined )
		{
			// Creamos la clave
			nav_linksPages[href] = i;

			// Hacemos la petición de esa página
			nav_getPageFromLink( href );
		}
	}
}



function nav_getPageFromLink( href ){
	// Pedimos la página y la guardamos en su url
	$.get(href, function(response){
		nav_linksPages[href] = response;
		// A su vez pedimos los links de la página descargada
		var doc = new DOMParser;
		var htmlParsed = doc.parseFromString(response, 'text/html');
		nav_getPagesFromLinks( $(htmlParsed).find("a[href]") );
	});
}





//Click a links
function nav_innerLinkClicked(event){
	var targetClicked = $(event.currentTarget);
	// Si es un enlace que aún no ha cargado, cancelamos el evento
	if( targetClicked.hasClass("not-loaded-yet") ){
		if( event.originalEvent != undefined ){
			event.preventDefault();
			event.stopPropagation();
		}
		return;
	}

	var href = targetClicked.attr("href");
	// Si el contenido es de tipo number, es que aún no se ha descargado.
	// Si es string, es el documento ya descargado
	if( typeof(nav_linksPages[href]) != "string" ){
		if(nav_linksPages[href] != undefined && event.originalEvent != undefined ){
			event.preventDefault();
			event.stopPropagation();
		}
		return;
	}
	// Si es un link interno
	if( targetClicked.attr("target") == null  &&  targetClicked.attr("target") != false && href != null && href.indexOf('tel:') !== 0 && href.indexOf('mailto:') !== 0 && !targetClicked.hasClass('no-link')){
		//Si navega a una pagina que no está en "linkPages" hace la navegación normal de un link.
		if( event.originalEvent != undefined || nav_linksPages[href] != undefined){
			event.preventDefault();
		}

		//Si no ha llegado el contenido de "href" ignora la navegación (hace preventDefault arriba y sale de la función).
		if(typeof nav_linksPages[href] == "number" ){
			return 0;
		}

		if( !nav_animatingLink){
			nav_animatingLink = true;

			// Inyectamos el nuevo contenido
			var doc = new DOMParser;
			var htmlParsed = doc.parseFromString(nav_linksPages[href], 'text/html');
			
			// Cambiamos la url
			window.history.pushState({url:href, html:nav_linksPages[href], title:htmlParsed.title}, "", href);

			// Indicamos a google que se ha navegado
			// gtag('config', ANALYTICS_ID, {
			// 	'page_title': htmlParsed.title,
			// 	'page_location': href,
			// 	'page_path': location.pathname
			// });

			// Realizamos la animación para mostrar la siguiente página.
			// Ocultamos la página (poniendo una cortina, ocultando con opacidad...)
			animateChangeBody(htmlParsed, targetClicked);
		}
	}
}



function animateChangeBody(htmlParsed, targetClicked){
	nav_notifyStart();
	console.log("animateChangeBody");
	var time = 1;	
	var myDelay = 0;
	
	disableScroll();
	// hideHeader();
	$("body").addClass("overflow-hidden");
	TweenLite.to('.body-content',time,{opacity:0, y:40, ease:Power2.easeInOut});
	
	setTimeout(function(){
		nav_changeBody(htmlParsed);
		$(window).scrollTop(0);
	
		TweenLite.to('.body-content',time,{opacity:1, y:0, ease:Power2.easeInOut});
	
		setTimeout(function(){
			$("body").removeClass("overflow-hidden");
			enableScroll();
			nav_animatingLink = false;
			nav_notifyEnd();
		}, (myDelay+time)*1000);


	}, (myDelay+time)*1000);
	
	// myDelay = myDelay+time;
}



// Reemplaza el código del body de una página por el body del documento pasado por parámetro.
// El otro parámetro es el atributo que tiene el enlace cliqueado, que indica el tipo de animación de salida que se ha hecho y la de entrada que debe hacerse ahora
function nav_changeBody( documentToLoad ){
	nav_notifyChangeBody();
	// Desbindeamos todas las funciones que se hayan bindeado a esta vista
	$("*").unbind();
	$(window).unbind();

	// // Eliminamos three (si existe)
	// if( $("#three-container").length > 0 )
	// 	nav_destroyThree();

	//Eliminamos todas las animaciones que estén ejecutándose
	// TweenMax.killAll();
	
	// Eliminamos la cortina de preload antes de introducir el contenido
	// $(documentToLoad).find(".preload-container").remove();

	// Reemplazamos las metas (menos los css)
	$("head *:not( [rel=stylesheet] )").remove();
	$("head").append($( documentToLoad ).find("head *:not( [rel=stylesheet] )"));

	// Reemplazamos el contenido: 
	//ocultamos el body antiguo (lo eliminaremos cuando termine la animación, para optimizar la animación)
	// $("html > body").addClass("body-to-delete");
	// $("html > body.body-to-delete").remove();

	$("html > body .body-content").empty();

	// Colocamos el nuevo body en su sitio
	// $(documentToLoad).find("body").unwrap();
	

	$("html > body .body-content").html($(documentToLoad).find("body .body-content").html());
	for (var i = 0; i < $("html > body")[0].attributes.length; i++) {
		$("html > body").removeAttr($("html > body")[0].attributes[i].name);
	}
	for (var i = 0; i < $(documentToLoad).find("body")[0].attributes.length; i++) {
		$("html > body").attr($(documentToLoad).find("body")[0].attributes[i].name, $(documentToLoad).find("body").attr($(documentToLoad).find("body")[0].attributes[i].name));
	}

	//Ponemos de nuevo la cortina encima y el texto
	// $(".page-navigation-curtain").css("top","0%");
	// $(".preload-container .preload-background-container.background-purple .preload-background-line").css("left","0%");
	// $(".preload-container .preload-background-container.background-green .preload-background-line").css("left","-100%");



	// Tras reemplazarlo, reseteamos documentToLoad para que se vuelva a pedir en la siguiente página
	documentToLoad = undefined;
	// scrollFlicker.pause();
	// TweenMax.to($(".scroll-cover"), 0, {opacity: 0});
	// prepareFirstScreen();
	//Dependiendo de a donde navegamos, se hara una navegacion u otra
	if($("body section").hasClass("section-home")){
		
	}else{
		
	}
	loadJS();
}



// Hacemos el primer pushState (que será replaceState) para añadir al historial la página que acaba de abrirse
function nav_pushFirstState(){
	var href = window.location.href;
	window.history.replaceState( {url:href, html:nav_linksPages[href], title:document.title}, "", href );
}

// Gestiona la navegación con flechas del navegador
var nav_manageBackNavigation_event = false;
function nav_manageBackNavigation(event){
	if(event.originalEvent.state != null){
		nav_manageBackNavigation_event = false;
		if( !nav_animatingLink){
			nav_animatingLink = true;
			var pageUrl = event.originalEvent.state.url;
			var pageTitle = event.originalEvent.state.title;
			var pageHTML = event.originalEvent.state.html;

			var doc = new DOMParser;
			var documentToLoad;
			documentToLoad = doc.parseFromString(pageHTML, 'text/html');
			// gtag('config', ANALYTICS_ID, {
			// 	'page_title': pageTitle,
			// 	'page_location': pageUrl,
			// 	'page_path': location.pathname
			// });

			animateChangeBody(documentToLoad);
		}else{
			nav_manageBackNavigation_event = event;
		}
	}
}

function nav_manageBackNavigationRecursive(){
	if(nav_manageBackNavigation_event){
		nav_manageBackNavigation(nav_manageBackNavigation_event);
	}
}

function nav_notifyStart(){
	$('body').trigger('startChangeBody');
}
function nav_notifyChangeBody(){
	$('body').trigger('changeBody');
}
function nav_notifyEnd(){
	$('body').trigger('endChangeBody');
}



// function nav_destroyThree(){
// 	// animationFrameID es la variable que guarda la salida de la llamada requestAnimationFrame
// 	cancelAnimationFrame(animationFrameID);
// 	// scene es el objeto THREE.Scene
//     scene = null;
//     // camera es el objeto THREE.PerspectiveCamera
//     camera = null;
//     $("#three-container").empty();
// }