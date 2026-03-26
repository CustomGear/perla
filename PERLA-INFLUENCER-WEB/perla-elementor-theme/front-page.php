<?php
/**
 * Front page template (when Settings → Reading uses a static page)
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
