const mainVideo = document.getElementById('mainVideo');
const videoSource = mainVideo.querySelector('source');
const videoTitle = document.getElementById('videoTitle');
const playlistEl = document.getElementById('playlist');

// Load videos.json
fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    // Buat playlist
    videos.forEach((video, index) => {
      const li = document.createElement('li');
      li.textContent = video.title;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        videoSource.src = video.file;
        mainVideo.load();
        mainVideo.play().catch(() => {});
        videoTitle.textContent = video.title;
      });
      playlistEl.appendChild(li);
    });

    // Main video default
    if(videos.length > 0){
      videoSource.src = videos[0].file;
      mainVideo.load();
      videoTitle.textContent = videos[0].title;
    }
  })
  .catch(err => console.error('Failed to load videos.json', err));

// Loop video
mainVideo.addEventListener('ended', () => {
  mainVideo.currentTime = 0;
  mainVideo.play().catch(() => {});
});
