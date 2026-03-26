<?php
/**
 * Main template: blog / posts index
 */
get_header();
?>
  <div class="container">
    <?php
    if ( have_posts() ) :
      while ( have_posts() ) :
        the_post();
        the_content();
      endwhile;
    else :
      echo '<p>' . esc_html__( 'No posts yet.', 'perla-elementor' ) . '</p>';
    endif;
    ?>
  </div>
<?php
get_footer();
