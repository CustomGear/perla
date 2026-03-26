<?php
/**
 * Single post template
 */
get_header();
?>
  <article class="container page-content single-post">
    <?php
    while ( have_posts() ) :
      the_post();
      the_content();
    endwhile;
    ?>
  </article>
<?php
get_footer();
