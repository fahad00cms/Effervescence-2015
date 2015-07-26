(function($) {
  var section = $('<div class="cd-main-content cd-index"></div>');
    //var section = $('<div id="'+url.replace('#','')+'"></div>');
    //console.log(section);
section.load('index.html .cd-index > *', function(event){
    // load new content and replace <main> content with the new one
    //console.log(section);
    $('#main').html(section);
});
}(jQuery));
(function($){
jQuery(document).ready(function(event){
  var isAnimating = false,
    firstLoad = false;
  
  $('')
  //trigger smooth transition from the actual page to the new one 
  $('main').on('click', '[data-type="page-transition"]', function(event){
    event.preventDefault();
    //detect which page has been selected
    var newPage = $(this).attr('href');
    //if the page is not already being animated - trigger animation
    if( !isAnimating ) changePage(newPage, true);
    firstLoad = true;
  });

  //detect the 'popstate' event - e.g. user clicking the back button
  $(window).on('popstate', function() {
  	if( firstLoad ) {
      /*
      Safari emits a popstate event on page load - check if firstLoad is true before animating
      if it's false - the page has just been loaded 
      */
      var newPageArray = location.pathname.split('/'),
        //this is the url of the page to be loaded 
        newPage = newPageArray[newPageArray.length - 1];
      if( !isAnimating ) changePage(newPage, false);
    }
    firstLoad = true;
	});

	function changePage(url, bool) {
    isAnimating = true;
    // trigger page animation
    $('body').addClass('page-is-changing');
    $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
    	loadNewContent(url, bool);
      $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    });
    //if browser doesn't support CSS transitions
    if( !transitionsSupported() ) loadNewContent(url, bool);
	}

	function loadNewContent(url, bool) {
		//url = ('' == url) ? 'index.html' : url;
  	var newSection = 'cd-'+url.replace('#', '');
    //console.log(url);
  	var section = $('<div class="cd-main-content '+newSection+'"></div>');
    //var section = $('<div id="'+url.replace('#','')+'"></div>');
  	//console.log(section);
  	section.load('index.html .'+newSection+'> *', function(event){
      // load new content and replace <main> content with the new one
      //console.log(section);
      $('#main').html(section);
      //if browser doesn't support CSS transitions - dont wait for the end of transitions
      var delay = ( transitionsSupported() ) ? 1200 : 0;
      setTimeout(function(){
        //wait for the end of the transition on the loading bar before revealing the new content
        ( section.hasClass(newSection) ) ? $('body').addClass(newSection) : $('body').removeClass(newSection);
        $('body').removeClass('page-is-changing');
        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
          isAnimating = false;
          $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        });

        if( !transitionsSupported() ) isAnimating = false;
      }, delay);
      
      if(url!=window.location && bool){
        //add the new page to the window.history
        //if the new page was triggered by a 'popstate' event, don't add it
        window.history.pushState({path: url},'',url);
      }
		});
  }

  function transitionsSupported() {
    return $('html').hasClass('csstransitions');
  }
  /*--- Contact Buttons ---*/
  
  $(".contactlink").hide();
  
  $(".notcontact").click(function() {
	  $(".contactlink").hide("fast");
  });
  
  $("#contactbutton").click(function() {
	  $(".contactlink").show("fast");
  });
  
	$(".contactlink img").hover(function() {
		$(this).attr("src","image/clink1.png");
	},function() {
		$(this).attr("src","image/clink.png");
	});
  /*-----------------------*/
});
}(jQuery));
