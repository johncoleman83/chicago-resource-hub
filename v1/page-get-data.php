<?php
/**
 * Template Name: Get Data
 */
?>

<!-- BEGIN HEADER -->

<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package fortunato
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="page" class="hfeed site <?php echo esc_attr(fortunato_headeropt()); ?>">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'fortunato' ); ?></a>
	<?php 
		$hideSearch = get_theme_mod('fortunato_theme_options_hidesearch', '1');
	?>
		<?php $src = wp_get_attachment_image_src( get_post_thumbnail_id(), 'fortunato-the-post'); ?>
		<header id="masthead" class="crh-site-header">
		<div class="site-social">
			<div class="socialLine">
				<?php fortunato_social_buttons(); ?>
				<?php if ($hideSearch == 1 ) : ?>
					<div class="openSearch"><i class="fa fa-search"></i></div>
				<?php endif; ?>
			</div>
		</div>
		
		<?php if ($hideSearch == 1 ) : ?>
		<!-- Start: Search Form -->
		<div id="search-full">
			<div class="search-container">
			<!-- EDITED THIS SEARCH FORM STATEMENT <p> section -->
				<p>Use this tool to search the website.  To search organizations by <em>service type and neighborhood</em>, try using the <a href="http://www.chicagoresourcehub.com/" style="color: #3aaed4;"><strong>Map Tool</strong></a> and searching the Database on page "<a href="http://www.chicagoresourcehub.com/" style="color: #3aaed4;"><strong>Get Data</strong></a>"</p>
				<form method="get" id="search-form" action="<?php echo esc_url(home_url( '/' )); ?>">
					<label>
						<span class="screen-reader-text"><?php esc_html_e( 'Search for:', 'fortunato' ); ?></span>
						<input type="search" name="s" id="search-field" placeholder="<?php esc_attr_e('Type here and hit enter...', 'fortunato'); ?>">
					</label>
				</form>
				<span class="closeSearch"><i class="fa fa-times spaceRight"></i><?php esc_html_e('Close', 'fortunato'); ?></span>
			</div>
		</div>
		<!-- End: Search Form -->
		<?php endif; ?>
		<div class="theNavigationBar">
			<nav id="site-navigation" class="main-navigation" role="navigation">
                <img src="http://www.chicagoresourcehub.com/wp-content/uploads/2016/10/peacehub-logo-flat-transparent-back.png" class="header-image" /> <!-- EDIT ADD IMAGE -->
<!-- Removed this line: <?php esc_html_e( 'Main Menu', 'fortunato' ); ?> -->
				<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><i class="fa fa-bars" aria-hidden="true"></i></button>
				<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
			</nav><!-- #site-navigation -->
		</div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
<!-- END HEADER -->
<!-- BEGIN PAGE -->

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'single' ) ) : ?>
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>

					<?php
						// If comments are open or we have at least one comment, load up the comment template
						if ( comments_open() || get_comments_number() ) :
							comments_template();
						endif;
					?>

				<?php endwhile; // end of the loop. ?>
			<?php endif; ?>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>

<!-- END PAGE -->
<!-- BEGIN FOOTER -->

<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package fortunato
 * 
 */
?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">
		 <!-- BEGIN ADD FOOTER WIDGETS -->
        <div id="footer-widget-area" class="secondary" style="display:flex;">
  <div id="footer-widget1">
    <?php
if(is_active_sidebar('footer-widget-1')){
dynamic_sidebar('footer-widget-1');
}
?>
  </div>
  <div id="footer-widget2">
    <?php
if(is_active_sidebar('footer-widget-2')) {
    dynamic_sidebar('footer-widget-2');
}
?>
  </div>
  <div id="footer-widget3">
    <?php
if(is_active_sidebar('footer-widget-3')){
dynamic_sidebar('footer-widget-3');
}
?>
  </div>
</div>
        <!-- END ADD FOOTER WIDGETS -->
        <!-- BEGIN EDIT ADD FOOTER Copyright -->
<p id="custom-footer-copyright" style="text-align: center;">
	<a href="http://www.chicagoresourcehub.com/terms-of-use">Terms of Use & Policies</a>
	· developed by: <a href="http://www.davidjohncoleman.com" target="_blank">davidjohncoleman.com</a>
</p>
        <!-- END EDIT ADD FOOTER Copyright -->
	</footer><!-- #colophon -->
</div><!-- #page -->
<a href="#top" id="toTop"><i class="fa fa-angle-up fa-lg"></i></a>
<?php if (is_active_sidebar( 'sidebar-1' ) ) : ?>
	<div class="openSidebar">
	  <div id="hamburger">
		<span></span>
		<span></span>
		<span></span>
	  </div>
	  <div id="cross">
		<span></span>
		<span></span>
	  </div>
	</div>
<?php endif; ?>
<?php wp_footer(); ?>

<!-- EDIT ADD CUSTOM JS FOR MAP -->

<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/materialize.min.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/main.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/jquery.address.js"></script>
<script type="text/javascript" src="<?php echo get_stylesheet_directory_uri(); ?>/js/bootstrap.min.js"></script>
<script>
	$(document).ready(function() {
		$('select').formSelect();
	});
</script>
<script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places&v=3.37&key=AIzaSyBZfTkzhHWLLprCrF2du0CnrQgaYtsNHL4"></script>
<script type="text/javascript" src="https://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/js/maps_lib.js"></script>
<script type='text/javascript'>
    $(window).resize(function () {
      var h = $(window).height();  
      $('#map_canvas').css('height', (h + 250));
    }).resize();
    
    $(function() {
      var myMap = new MapsLib({
        fusionTableId:    "1wfQcU0EAtXrnAq0-Ru-PRBPBuz1ojhHZJpcxQNo2",
        googleApiKey:     "AIzaSyAhvPDGNS4-Ro3SwnF9zIW-Sq57BvrT6oY",
        locationColumn:   "latitude",
        map_center:       [41.8781136, -87.66677856445312],
        locationScope:    "illinois",
        defaultZoom:      11,
        searchRadius:     4830
      });

      var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_address'));

      $('#select_type').change(function(){
        myMap.doSearch();
      });
      $('#select_type2').change(function(){
        myMap.doSearch();
      });
      $('#select_type3').change(function(){
        myMap.doSearch();
      });
      $('#search_address').change(function(){
        myMap.doSearch();
      });
      $('#search_radius').change(function(){
        myMap.doSearch();
      });
      $('#text_search').change(function(){
        myMap.doSearch();
      });
      $('#search').click(function(){
        myMap.doSearch();
      });
      $('#reset').click(function(){
        myMap.reset(); 
        return false;
      });
      
      $('#viewmode').click(function(){
        if ($('#map_canvas').is(":visible")){
          $('#viewmode').html("<i class='fa fa-map-marker'></i> Map view");
          $('#listview').show();
          $('#map_canvas').hide();
        } else {
          $('#viewmode').html("<i class='fa fa-list'></i> List view");
          $('#map_canvas').show();
          $('#listview').hide();
        } 
      });
  
      $(":text").keydown(function(e){
        var key =  e.keyCode ? e.keyCode : e.which;
        if(key === 13) {
          $('#search').click();
          return false;
        }
      });
    });
</script>
<!-- END EDIT CUSTOM JS FOR MAP -->
</body>
</html>
<!-- EDIT FOOTER -->
