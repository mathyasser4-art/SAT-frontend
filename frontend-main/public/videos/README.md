# Tutorial Videos

This folder contains tutorial videos for Abacus Heroes users.

## Required Videos

Please add the following video files to this directory:

1. **student-tutorial.mp4** - Student tutorial video
   - Shows how to open homework
   - Shows how to practice questions
   - Duration: Less than 1 minute

2. **teacher-tutorial.mp4** - Teacher tutorial video
   - Shows how to create homework
   - Shows how to use all teacher features
   - Duration: Less than 1 minute

## Video Requirements

- **Format:** MP4 (H.264 codec)
- **Resolution:** 720p (1280x720) recommended
- **Quality:** Keep file size under 10MB if possible
- **Compression:** Use standard web compression settings

## Adding Videos

1. Export your videos from your video editor
2. Name them exactly as shown above:
   - `student-tutorial.mp4`
   - `teacher-tutorial.mp4`
3. Copy/paste the video files into this folder
4. Commit and push to your repository
5. Videos will automatically be served when deployed to Vercel

## Testing Locally

After adding the videos, you can test them by:
1. Running your development server: `npm start`
2. Logging in as a Student or Teacher
3. Clicking the floating help button (bottom-right corner with "?" icon)
4. The video should play in the modal

## Need Help?

If videos don't play:
- Check that filenames match exactly (case-sensitive)
- Verify the video format is MP4
- Make sure videos are in this exact folder: `public/videos/`
- Clear your browser cache and try again
