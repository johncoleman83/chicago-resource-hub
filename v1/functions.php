<?php
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
function theme_enqueue_styles() {
    if ( is_page( '1292' ) || is_page( '51' ) || is_page( '115' ) ) {
		wp_enqueue_style( 'google-materialize', 'https://fonts.googleapis.com/icon?family=Material+Icons' );
		wp_enqueue_style( 'materialize', get_stylesheet_directory_uri() . '/css/materialize.css' );
    }
	if ( is_page( '1292' ) ) {
		wp_enqueue_style( 'custom-map', get_stylesheet_directory_uri() . '/css/custom-map.css' );
	}
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}

add_action( 'widgets_init', 'child_register_sidebar' );

function child_register_sidebar(){
    register_sidebar(array(
        'name' => 'Footer Widget 1',
        'id' => 'footer-widget-1',
	'description' => 'Appears First in the footer area',
        'before_widget' => '<aside id="%1$s" class="widget %2$s">',
        'after_widget' => '</aside>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => 'Footer Widget 2',
        'id' => 'footer-widget-2',
	'description' => 'Appears Second in the footer area',
        'before_widget' => '<aside id="%1$s" class="widget %2$s">',
        'after_widget' => '</aside>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => 'Footer Widget 3',
        'id' => 'footer-widget-3',
	'description' => 'Appears Third in the footer area',
        'before_widget' => '<aside id="%1$s" class="widget %2$s">',
        'after_widget' => '</aside>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}

?>