function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.bottom >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) 
    );
}

function onVisibilityChange (el, callback) {
    return function () {
        /*your code here*/ console.log('visibility: ' + isElementInViewport(el));
        //for(var i = 1; i < 3; i++) {
	  //       if (isElementInViewport($("div.main-tutorial.part" + i))) {
			// 	$("ul#toc > li:nth-child("+i+")").show();
			// } else {
			// 	$("ul#toc > li:nth-child("+i+")").hide();
			// }        	
        //}

    	if (isElementInViewport($("div.main-tutorial.part1"))) {
			$("ul#toc > li:nth-child(1) ul").show(400);
		} else {
			$("ul#toc > li:nth-child(1) ul").hide(400);
		} 

    	if (isElementInViewport($("div.main-tutorial.part2"))) {
			$("ul#toc > li:nth-child(2) ul").show(400);
		} else {
			$("ul#toc > li:nth-child(2) ul").hide(400);
		} 

    	if (isElementInViewport($("div.main-tutorial.part3"))) {
			$("ul#toc > li:nth-child(3) ul").show(400);
		} else {
			$("ul#toc > li:nth-child(3) ul").hide(400);
		}  

    }
}

