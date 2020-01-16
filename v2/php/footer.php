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
	<a href="https://www.chicagoresourcehub.com/terms-of-use">Terms of Use & Policies</a>
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

</body>
</html>
