#!/bin/bash
# Run this script to finish Perla site setup on Local by Flywheel
# Usage: ./setup-local-site.sh

THEME_SRC="/Users/JTRIZZY/perla-desjardins-wordpress-theme"
THEME_DST="/Users/JTRIZZY/Local Sites/perla/app/public/wp-content/themes/perla-desjardins-wordpress-theme"
IMAGES_SRC="/Users/JTRIZZY/perla-desjardins-website/images"

echo "Copying images to theme..."
mkdir -p "$THEME_DST/images"
cp -R "$IMAGES_SRC"/* "$THEME_DST/images/" 2>/dev/null || cp "$IMAGES_SRC/hero-portrait.png" "$THEME_DST/images/"

echo "Syncing theme files..."
cp "$THEME_SRC/front-page.php" "$THEME_DST/"
cp "$THEME_SRC/page-services.php" "$THEME_DST/"
cp "$THEME_SRC/page-gallery.php" "$THEME_DST/"

echo "Done! Now:"
echo "1. Open Local → Start the 'perla' site"
echo "2. Go to WordPress admin → Appearance → Themes → Activate 'Perla Desjardins'"
echo "3. Go to Plugins → Activate 'Perla Portfolio Setup' (creates pages + sets homepage)"
echo "4. Deactivate 'Perla Portfolio Setup' after"
echo "5. Edit pages in Pages → All Pages"
