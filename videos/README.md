# /videos — Reel MP4 Files

Drop your reel video files here. Each file should be an MP4 encoded for web.

## How to add a reel

1. Export your reel as an MP4 (H.264, AAC audio, portrait orientation — 9:16).
2. Name it something descriptive, e.g. `reel-hm-2024.mp4`.
3. Place it in this `/videos/` folder.
4. Open `content/reels.json` and update the `"video"` path to match:
   ```json
   {
     "video": "videos/reel-hm-2024.mp4",
     "brand": "H&M",
     "caption": "Effortless summer styling"
   }
   ```
5. Save. The site will load the new video automatically.

## Recommended export settings

| Setting      | Value                       |
|--------------|-----------------------------|
| Format       | MP4 (H.264)                 |
| Aspect ratio | 9:16 (1080 × 1920 px)       |
| Frame rate   | 30 fps                      |
| Target size  | Under 20 MB per reel        |
| Audio        | AAC, muted autoplay is fine |

## Tip: compress before uploading

Large videos slow down the page. Use [Handbrake](https://handbrake.fr/) or [Squoosh](https://squoosh.app/)
to compress to under 15 MB without visible quality loss.
