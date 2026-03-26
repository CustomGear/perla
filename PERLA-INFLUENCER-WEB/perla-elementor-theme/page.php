<?php
/**
 * Default page template — Elementor content
 */
get_header();
?>
  <div class="container page-content">
    <?php
    while ( have_posts() ) :
      the_post();
      the_content();
    endwhile;
    ?>
  </div>
<?php
get_footer();
