$(document).ready(function() {
	var toggleCat = "#toggle_menu_category";
	var menuCat = "#menu_category";
	
	var toggle2 = "#toggle_menu_2"
	var menu2 = "#menu_2";
	
	var toggleMain = "#toggle_menu_main";
	var menuMain = "#menu_main";
	
	var overlay = ".site-overlay";
	
	$(toggleCat).click(function() {
		$(menuCat).addClass("open");
		$(overlay).css("display", "block")
	});
	
	$(toggle2).click(function() {
		$(menu2).addClass("open");
		$(overlay).css("display", "block")
	});
	
	$(toggleMain).click(function() {
		$(menuMain).addClass("open");
		$(overlay).css("display", "block");
	});
	
	$(overlay).click(function() {
		$(menuCat).removeClass("open");
		$(menu2).removeClass("open");
		$(menuMain).removeClass("open");
		$(this).css("display", "none");
	})
});
