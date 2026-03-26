<?php
/**
 * Template Name: Elementor Full Width
 * Template for Elementor: only header, content, footer. Use if "content area not found" appears.
 */
get_header();
?>
  <?php
  while ( have_posts() ) :
    the_post();
    the_content();
  endwhile;
  ?>
<?php
get_footer();
