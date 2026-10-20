# Video Trajectory Showcase Directory

Place your exported camera orbit MP4 videos here to display them automatically on the project page:

- `bicycle.mp4` - Trajectory video for Mip-NeRF 360 Bicycle
- `garden.mp4` - Trajectory video for Mip-NeRF 360 Garden
- `bonsai.mp4` - Trajectory video for Mip-NeRF 360 Bonsai
- `treehill.mp4` - Trajectory video for Mip-NeRF 360 Treehill
- `truck.mp4` - Trajectory video for Tanks & Temples Truck

You can generate these camera trajectory videos in Unity using the provided helper script:

```bash
# Example for Mip-NeRF 360 Bicycle
bash single_unity_video.sh triangle-splatting mipnerf360/bicycle 0 \
  --unity "/Path/To/Unity" \
  --unity-project unity

# Example for Garden with MeshSplatting
bash single_unity_video.sh mesh-splatting mipnerf360/garden 0 \
  --unity "/Path/To/Unity" \
  --unity-project unity
```

Once exported, copy or symlink the resulting `.mp4` into this directory:
```bash
cp /path/to/rendered_video.mp4 docs/static/videos/bicycle.mp4
```
The project page's video selector will automatically detect and play it!
