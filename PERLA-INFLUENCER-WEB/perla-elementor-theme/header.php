<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <div class="container">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo"><?php bloginfo( 'name' ); ?></a>
    <button class="nav-toggle" aria-label="<?php esc_attr_e( 'Open menu', 'perla-elementor' ); ?>"><span></span><span></span><span></span></button>
    <nav>
      <?php
      if ( has_nav_menu( 'primary' ) ) {
        wp_nav_menu( array(
          'theme_location' => 'primary',
          'container'      => false,
          'menu_class'     => 'nav-list',
          'fallback_cb'    => false,
        ) );
      } else {
        perla_primary_menu_fallback();
      }
      ?>
    </nav>
  </div>
</header>
<main class="site-main">
