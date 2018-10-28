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
if(is_active_sidebar('footer-widget-2')){
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
          <a href="http://www.chicagoresourcehub.com/terms-of-use">Terms of Use & Policies</a> · developed by: <a href="http://www.davidjohncoleman.com" target="_blank">davidjohncoleman.com</a>
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
<?php if (is_page( '1292' ) ) : ?>
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
  <script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places&key=<MYKEY>"></script>
  <script type="text/javascript" src="http://www.chicagoresourcehub.com/wp-content/themes/fortunato-child/js/maps_lib.js"></script>
  <script type='text/javascript'>
    $(window).resize(function () {
      var h = $(window).height();
      $('#map_canvas').css('height', h);
    }).resize();

    $(function() {
      var myMap = new MapsLib({
        fusionTableId:    "1wfQcU0EAtXrnAq0-Ru-PRBPBuz1ojhHZJpcxQNo2",
        googleApiKey:     "MYKEY",
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
<?php endif; ?>
<!-- END EDIT CUSTOM JS FOR MAP -->
</body>
</html>
