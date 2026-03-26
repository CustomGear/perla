<?php
/**
 * Perla Desjardins — Elementor theme functions
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

define( 'PERLA_THEME_VERSION', '1.0' );
define( 'PERLA_THEME_DIR', get_template_directory() );
define( 'PERLA_THEME_URI', get_template_directory_uri() );

/**
 * Enqueue styles and scripts
 */
function perla_scripts() {
  $ver = PERLA_THEME_VERSION;
  wp_enqueue_style(
    'perla-google-fonts',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500&display=swap',
    array(),
    null
  );
  wp_enqueue_style(
    'perla-base',
    PERLA_THEME_URI . '/assets/css/style.css',
    array(),
    $ver
  );
  wp_enqueue_style(
    'perla-pages',
    PERLA_THEME_URI . '/assets/css/pages.css',
    array( 'perla-base' ),
    $ver
  );
  wp_enqueue_script(
    'perla-main',
    PERLA_THEME_URI . '/assets/js/main.js',
    array(),
    $ver,
    true
  );

  // Expose reels configuration endpoint to the frontend JS.
  if ( is_front_page() ) {
    wp_localize_script(
      'perla-main',
      'PERLA_REELS',
      array(
        'endpoint' => esc_url_raw( rest_url( 'perla/v1/reels-grid' ) ),
      )
    );
  }

  // Expose gallery configuration endpoint to the frontend JS.
  if ( is_page( 'gallery' ) ) {
    wp_localize_script(
      'perla-main',
      'PERLA_GALLERY',
      array(
        'endpoint' => esc_url_raw( rest_url( 'perla/v1/gallery-embeds' ) ),
        'perPage' => 6,
      )
    );
  }
}
add_action( 'wp_enqueue_scripts', 'perla_scripts' );

/**
 * Instagram embed on front page
 */
function perla_instagram_embed() {
  if ( is_front_page() || is_page( 'gallery' ) ) {
    wp_enqueue_script(
      'instagram-embed',
      '//www.instagram.com/embed.js',
      array(),
      null,
      true
    );
    wp_script_add_data( 'instagram-embed', 'async', true );
  }
}
add_action( 'wp_enqueue_scripts', 'perla_instagram_embed', 20 );

/**
 * Contact page script (Formspree fallback + contact config).
 */
function perla_contact_page_assets() {
  if ( ! is_page( 'work-with-me' ) ) {
    return;
  }

  $ver = PERLA_THEME_VERSION;

  wp_enqueue_script(
    'perla-contact-config',
    PERLA_THEME_URI . '/assets/js/contact-config.js',
    array(),
    $ver,
    true
  );

  // If the Formspree ID is still a placeholder, open an email draft instead.
  $inline = <<<JS
(function() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    var action = this.getAttribute('action') || '';
    if (action.indexOf('YOUR_FORMSPREE_ID') !== -1) {
      e.preventDefault();
      var emailEl = document.querySelector('#contact-email [data-contact-value]');
      var email = emailEl ? emailEl.textContent : 'collabs@perladesjardins.com';
      window.location.href = 'mailto:' + email + '?subject=Collaboration%20inquiry';
    }
  });
})();
JS;

  wp_add_inline_script( 'perla-contact-config', $inline );
}
add_action( 'wp_enqueue_scripts', 'perla_contact_page_assets', 25 );

/**
 * Fetch configured reels for the Home page.
 */
function perla_reels_get_tiles() {
  $tiles = get_option( 'perla_reels_tiles', array() );
  $out = array();

  for ( $i = 0; $i < 4; $i++ ) {
    $tile = isset( $tiles[ $i ] ) ? (array) $tiles[ $i ] : array();
    $type = isset( $tile['type'] ) ? sanitize_text_field( $tile['type'] ) : 'none';
    if ( ! in_array( $type, array( 'instagram', 'video', 'none' ), true ) ) {
      $type = 'none';
    }

    $out[ $i ] = array(
      'type' => $type,
      'instagram_url' => isset( $tile['instagram_url'] ) ? esc_url_raw( $tile['instagram_url'] ) : '',
      'video_id' => isset( $tile['video_id'] ) ? absint( $tile['video_id'] ) : 0,
      'cover_id' => isset( $tile['cover_id'] ) ? absint( $tile['cover_id'] ) : 0,
    );
  }

  return $out;
}

function perla_reels_rest_grid_cb() {
  $tiles = perla_reels_get_tiles();
  $hasConfig = false;
  $tilesOut = array();

  for ( $i = 0; $i < 4; $i++ ) {
    $t = $tiles[ $i ];

    // Replace static markup whenever the admin set a tile type (even if the URL/ID isn't filled yet).
    if ( $t['type'] !== 'none' ) {
      $hasConfig = true;
    }

    if ( $t['type'] === 'instagram' && ! empty( $t['instagram_url'] ) ) {
      $tilesOut[] = array(
        'type' => 'instagram',
        'instagram_url' => $t['instagram_url'],
        'video_url' => '',
        'poster_url' => '',
      );
      continue;
    }

    if ( $t['type'] === 'video' && ! empty( $t['video_id'] ) ) {
      $video_url = wp_get_attachment_url( $t['video_id'] );
      $cover_url = ! empty( $t['cover_id'] ) ? wp_get_attachment_url( $t['cover_id'] ) : '';
      $tilesOut[] = array(
        'type' => 'video',
        'instagram_url' => '',
        'video_url' => $video_url ? esc_url_raw( $video_url ) : '',
        'poster_url' => $cover_url ? esc_url_raw( $cover_url ) : '',
      );
      continue;
    }

    $tilesOut[] = array(
      'type' => 'none',
      'instagram_url' => '',
      'video_url' => '',
      'poster_url' => '',
    );
  }

  return rest_ensure_response(
    array(
      'hasConfig' => $hasConfig,
      'tiles' => $tilesOut,
    )
  );
}

add_action(
  'rest_api_init',
  function() {
    register_rest_route(
      'perla/v1',
      '/reels-grid',
      array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'perla_reels_rest_grid_cb',
      )
    );
  }
);

/**
 * Get configured Instagram URLs for the Gallery page.
 */
function perla_gallery_get_links() {
  $links = get_option( 'perla_gallery_links', array() );

  // Back-compat: if saved as a string, split into lines.
  if ( is_string( $links ) ) {
    $links = preg_split( "/\r\n|\n|\r/", $links );
  }

  if ( ! is_array( $links ) ) {
    return array();
  }

  $out = array();
  foreach ( $links as $u ) {
    $u = trim( (string) $u );
    if ( $u === '' ) continue;
    if ( strpos( $u, 'instagram.com/' ) === false ) continue;
    if ( strpos( $u, '/p/' ) === false && strpos( $u, '/reel/' ) === false && strpos( $u, '/tv/' ) === false ) continue;
    $out[] = esc_url_raw( $u );
  }

  return array_values( array_unique( $out ) );
}

/**
 * REST: return gallery embed URLs with pagination.
 */
function perla_gallery_rest_embeds_cb( $request ) {
  $offset = isset( $request['offset'] ) ? absint( $request['offset'] ) : 0;
  $limit  = isset( $request['limit'] ) ? absint( $request['limit'] ) : 6;

  if ( $limit < 1 ) $limit = 6;
  if ( $limit > 24 ) $limit = 24;

  $links = perla_gallery_get_links();
  $total = count( $links );

  $hasConfig = $total > 0;
  if ( ! $hasConfig ) {
    return rest_ensure_response(
      array(
        'hasConfig' => false,
        'hasMore' => false,
        'items' => array(),
      )
    );
  }

  $offset = min( $offset, $total );
  $slice = array_slice( $links, $offset, $limit );
  $nextOffset = $offset + count( $slice );
  $hasMore = $nextOffset < $total;

  return rest_ensure_response(
    array(
      'hasConfig' => true,
      'hasMore' => $hasMore,
      'items' => $slice,
      'total' => $total,
    )
  );
}

add_action(
  'rest_api_init',
  function() {
    register_rest_route(
      'perla/v1',
      '/gallery-embeds',
      array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'perla_gallery_rest_embeds_cb',
      )
    );
  }
);

/**
 * Admin UI to configure the Home reels tiles.
 */
function perla_reels_admin_menu() {
  add_menu_page(
    'Perla Reels Manager',
    'Perla Reels',
    'manage_options',
    'perla-reels-manager',
    'perla_reels_admin_page',
    'dashicons-format-video',
    65
  );
}
add_action( 'admin_menu', 'perla_reels_admin_menu' );

function perla_reels_admin_page() {
  if ( ! current_user_can( 'manage_options' ) ) {
    return;
  }

  wp_enqueue_media();

  $tiles = get_option( 'perla_reels_tiles', array() );
  $galleryLinks = get_option( 'perla_gallery_links', array() );
  if ( ! is_array( $galleryLinks ) ) {
    $galleryLinks = array();
  }
  $galleryLinksRaw = implode( "\n", array_slice( $galleryLinks, 0, 200 ) );
  for ( $i = 0; $i < 4; $i++ ) {
    if ( empty( $tiles[ $i ] ) ) {
      $tiles[ $i ] = array(
        'type' => 'instagram',
        'instagram_url' => '',
        'video_id' => 0,
        'cover_id' => 0,
      );
    }
  }

  ?>
  <div class="wrap">
    <h1>Perla Reels Manager</h1>
    <p>Choose <strong>Instagram</strong> (reel permalink embed) or <strong>Upload</strong> (native video + cover) for each of the 4 reel tiles.</p>

    <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
      <input type="hidden" name="action" value="perla_reels_save" />
      <?php wp_nonce_field( 'perla_reels_save_nonce', 'perla_reels_nonce' ); ?>

      <table class="form-table" role="presentation">
        <tbody>
        <?php for ( $i = 0; $i < 4; $i++ ) : ?>
          <tr>
            <th scope="row">Tile <?php echo esc_html( $i + 1 ); ?></th>
            <td>
              <div style="display:flex; gap:16px; flex-wrap:wrap;">
                <label>
                  <div style="font-weight:600;margin-bottom:6px;">Type</div>
                  <select name="perla_reels_tiles[<?php echo esc_attr( $i ); ?>][type]" style="min-width:180px;">
                    <option value="instagram" <?php selected( $tiles[ $i ]['type'], 'instagram' ); ?>>Instagram reel</option>
                    <option value="video" <?php selected( $tiles[ $i ]['type'], 'video' ); ?>>Upload video</option>
                    <option value="none" <?php selected( $tiles[ $i ]['type'], 'none' ); ?>>Blank</option>
                  </select>
                </label>

                <label style="flex:1; min-width:240px;">
                  <div style="font-weight:600;margin-bottom:6px;">Instagram URL (reel permalink)</div>
                  <input
                    type="url"
                    name="perla_reels_tiles[<?php echo esc_attr( $i ); ?>][instagram_url]"
                    value="<?php echo esc_attr( $tiles[ $i ]['instagram_url'] ); ?>"
                    placeholder="https://www.instagram.com/reel/REEL_ID_HERE/"
                    style="width:100%;"
                  />
                </label>

                <div style="min-width:260px; flex:1;">
                  <div style="font-weight:600;margin-bottom:6px;">Video upload</div>
                  <input type="hidden" class="perla-reels-video-id" name="perla_reels_tiles[<?php echo esc_attr( $i ); ?>][video_id]" value="<?php echo esc_attr( (int) $tiles[ $i ]['video_id'] ); ?>" />
                  <button type="button" class="button perla-reels-upload-video" data-index="<?php echo esc_attr( $i ); ?>">Upload video</button>
                </div>

                <div style="min-width:260px; flex:1;">
                  <div style="font-weight:600;margin-bottom:6px;">Cover image</div>
                  <input type="hidden" class="perla-reels-cover-id" name="perla_reels_tiles[<?php echo esc_attr( $i ); ?>][cover_id]" value="<?php echo esc_attr( (int) $tiles[ $i ]['cover_id'] ); ?>" />
                  <button type="button" class="button perla-reels-upload-cover" data-index="<?php echo esc_attr( $i ); ?>">Upload cover</button>
                </div>
              </div>
            </td>
          </tr>
        <?php endfor; ?>
        </tbody>
      </table>

      <hr style="margin: 26px 0;">
      <h2 style="margin-top:0;">Gallery (Instagram URLs)</h2>
      <p style="max-width:760px;">
        Paste Instagram post/reel URLs (one per line). The Gallery page shows 6 tiles at a time and the
        <strong>Load more</strong> button reveals the next set.
      </p>

      <div style="margin-top:12px;">
        <textarea
          name="perla_gallery_links"
          rows="8"
          style="width:100%;"
          placeholder="https://www.instagram.com/p/.../
https://www.instagram.com/reel/.../"
        ><?php echo esc_textarea( $galleryLinksRaw ); ?></textarea>
      </div>

      <p>
        <button type="submit" class="button button-primary">Save reels settings</button>
      </p>
    </form>
  </div>

  <script>
    (function() {
      var frames = {};
      function openMedia(kind, index) {
        var key = kind + ':' + index;
        if (frames[key]) {
          frames[key].open();
          return;
        }

        var options = {
          title: 'Select ' + kind,
          button: { text: 'Use this ' + kind },
          multiple: false
        };

        if (kind === 'cover') {
          options.library = { type: 'image' };
        }

        var frame = wp.media(options);
        frame.on('select', function() {
          var attachment = frame.state().get('selection').first().toJSON();
          var id = attachment.id;
          var cls = kind === 'video' ? '.perla-reels-video-id' : '.perla-reels-cover-id';
          var targets = document.querySelectorAll(cls);
          if (targets && targets[index]) targets[index].value = id;
        });
        frames[key] = frame;
        frame.open();
      }

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.perla-reels-upload-video');
        if (btn) {
          openMedia('video', btn.getAttribute('data-index'));
          e.preventDefault();
          return;
        }

        btn = e.target.closest('.perla-reels-upload-cover');
        if (btn) {
          openMedia('cover', btn.getAttribute('data-index'));
          e.preventDefault();
          return;
        }
      });
    })();
  </script>
  <?php
}

function perla_reels_save_handler() {
  if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( 'Unauthorized' );
  }

  if ( ! isset( $_POST['perla_reels_nonce'] ) || ! wp_verify_nonce( $_POST['perla_reels_nonce'], 'perla_reels_save_nonce' ) ) {
    wp_die( 'Invalid nonce' );
  }

  $tiles = isset( $_POST['perla_reels_tiles'] ) ? (array) $_POST['perla_reels_tiles'] : array();
  $out = array();

  for ( $i = 0; $i < 4; $i++ ) {
    $tile = isset( $tiles[ $i ] ) ? (array) $tiles[ $i ] : array();
    $type = isset( $tile['type'] ) ? sanitize_text_field( $tile['type'] ) : 'instagram';
    if ( ! in_array( $type, array( 'instagram', 'video', 'none' ), true ) ) {
      $type = 'instagram';
    }

    $instagram_url = isset( $tile['instagram_url'] ) ? esc_url_raw( $tile['instagram_url'] ) : '';
    $video_id = isset( $tile['video_id'] ) ? absint( $tile['video_id'] ) : 0;
    $cover_id = isset( $tile['cover_id'] ) ? absint( $tile['cover_id'] ) : 0;

    $out[ $i ] = array(
      'type' => $type,
      'instagram_url' => $instagram_url,
      'video_id' => $video_id,
      'cover_id' => $cover_id,
    );
  }

  update_option( 'perla_reels_tiles', $out );

  // Gallery: one Instagram URL per line.
  $gallery_raw = isset( $_POST['perla_gallery_links'] ) ? sanitize_textarea_field( wp_unslash( $_POST['perla_gallery_links'] ) ) : '';
  $lines = preg_split( "/\r\n|\n|\r/", $gallery_raw );
  $clean = array();
  if ( is_array( $lines ) ) {
    foreach ( $lines as $line ) {
      $u = trim( (string) $line );
      if ( $u === '' ) continue;
      // Keep only Instagram links (client can paste embed permalinks).
      if ( strpos( $u, 'instagram.com/' ) === false ) continue;
      if ( strpos( $u, '/p/' ) === false && strpos( $u, '/reel/' ) === false && strpos( $u, '/tv/' ) === false ) continue;
      $clean[] = esc_url_raw( $u );
    }
  }
  $clean = array_values( array_unique( $clean ) );
  update_option( 'perla_gallery_links', $clean );

  wp_safe_redirect( admin_url( 'admin.php?page=perla-reels-manager&updated=1' ) );
  exit;
}
add_action( 'admin_post_perla_reels_save', 'perla_reels_save_handler' );

/**
 * Theme setup
 */
function perla_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
  add_theme_support( 'custom-logo', array(
    'height'      => 80,
    'width'       => 240,
    'flex-height' => true,
    'flex-width'  => true,
  ) );
  add_theme_support( 'elementor' );
  add_theme_support( 'elementor-header-footer' );
  add_theme_support( 'responsive-embeds' );

  register_nav_menus( array(
    'primary' => __( 'Primary (header)', 'perla-elementor' ),
    'footer'  => __( 'Footer', 'perla-elementor' ),
  ) );
}
add_action( 'after_setup_theme', 'perla_setup' );

/**
 * Fallback if no menu assigned: show pages
 */
function perla_primary_menu_fallback() {
  echo '<ul class="nav-list">';
  echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li>';
  wp_list_pages( array(
    'title_li' => '',
    'depth'    => 1,
    'exclude'  => get_option( 'page_on_front' ),
  ) );
  echo '<li><a href="https://linktr.ee/perladesjardins#collection-47b9d1f6-8636-4691-8537-333f3510b69c" target="_blank" rel="noopener noreferrer">Shop</a></li>';
  echo '</ul>';
}

/**
 * Body class for current page (active nav)
 */
function perla_body_class( $classes ) {
  if ( is_front_page() ) {
    $classes[] = 'page-home';
  }
  return $classes;
}
add_filter( 'body_class', 'perla_body_class' );
