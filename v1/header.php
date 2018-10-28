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
		$headerOverlay = get_theme_mod('fortunato_theme_options_headeroverlay', '1');
		$hideSearch = get_theme_mod('fortunato_theme_options_hidesearch', '1');
		$pageforposts = get_option('page_for_posts');
	?>
	<?php if (is_singular() && '' != get_the_post_thumbnail() ) : ?>
		<?php $src = wp_get_attachment_image_src( get_post_thumbnail_id(), 'fortunato-the-post'); ?>
		<header id="masthead" class="crh-site-header"> <!-- EDIT ADD NEW HEADER STYLE -->
	<?php elseif (function_exists( 'is_shop' ) && is_shop() && function_exists( 'is_woocommerce' ) ) : ?>
		<?php $shopImageID = get_option( 'woocommerce_shop_page_id' ); ?>
		<?php if( '' != get_the_post_thumbnail($shopImageID) ) : ?>
			<?php $srcShop = wp_get_attachment_image_src( get_post_thumbnail_id($shopImageID), 'fortunato-the-post'); ?>
			<header id="masthead" class="crh-site-header" style="background: url(<?php echo esc_url($srcShop[0]); ?>) 50% 50% / cover no-repeat;">
		<?php else: ?>
			<header id="masthead" class="crh-site-header" style="background: url(<?php header_image(); ?>) 50% 50% / cover no-repeat;">
		<?php endif; ?>
	<?php elseif (is_home() && !is_front_page() && '' != get_the_post_thumbnail($pageforposts) ) : ?>
		<?php $src = wp_get_attachment_image_src( get_post_thumbnail_id( $pageforposts ), 'fortunato-the-post' ); ?>
		<header id="masthead" class="crh-site-header" style="background: url(<?php echo esc_url($src[0]); ?>) 50% 50% / cover no-repeat;">
	<?php else: ?>
		<header id="masthead" class="crh-site-header"> <!-- ADD NEW HEADER STYLE for Else statement -->
	<?php endif; ?>	
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
		<?php if (!is_page( '1292' ) ) : ?><!-- EDIT REMOVE CUSTOM CSS FOR MAP -->
			<?php if ($headerOverlay == 1 ) : ?>
				<div class="site-brand-main" style=" background-image: url(<?php echo esc_url(get_template_directory_uri()) . '/images/overlay.png'; ?>);">
			<?php else: ?>
				<div class="site-brand-main">
			<?php endif; ?>
				<div class="site-branding">
					<?php
					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) : ?>
						<div class="site-description">
								<div class="breadcrumbs" typeof="BreadcrumbList" vocab="https://schema.org/">
									<?php
									if(function_exists('bcn_display'))
									{
											bcn_display();
									}?>
								</div>
							<div class="site-description-text">
								<?php echo $description; /* WPCS: xss ok. */ ?>
							</div>
						</div>
					<?php
					endif; ?>
				</div><!-- .site-branding -->
			</div>
		<?php endif; ?> <!-- END REMOVE CUSTOM CSS FOR MAP -->
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
