const mainVideo = document.getElementById('mainVideo');
const videoSource = mainVideo.querySelector('source');
const videoTitle = document.getElementById('videoTitle');
const playlistEl = document.getElementById('playlist');

// Generate thumbnail otomatis dari frame video ke-2
function generateThumbnail(videoFile, callback, seekTime = 2) {
    const tempVideo = document.createElement('video');
    tempVideo.src = videoFile;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.muted = true;

    tempVideo.addEventListener('loadeddata', () => { tempVideo.currentTime = seekTime; });
    tempVideo.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        canvas.getContext('2d').drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/png'));
    });
}

fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    videos.forEach(video => {
      const li = document.createElement('li');
      li.textContent = video.title;
      li.addEventListener('click', () => {
        videoSource.src = video.file;
        generateThumbnail(video.file, thumb => mainVideo.poster = thumb);
        mainVideo.load();
        mainVideo.play().catch(() => {});
        videoTitle.textContent = video.title;
      });
      playlistEl.appendChild(li);
    });

    // Load video pertama otomatis
    if(videos.length > 0){
      videoSource.src = videos[0].file;
      generateThumbnail(videos[0].file, thumb => mainVideo.poster = thumb);
      mainVideo.load();
      videoTitle.textContent = videos[0].title;
    }
  })
  .catch(err => console.error('Failed to load videos.json', err));

mainVideo.addEventListener('ended', () => {
  mainVideo.currentTime = 0;
  mainVideo.play().catch(() => {});
});
