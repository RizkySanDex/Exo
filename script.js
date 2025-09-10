const mainVideo = document.getElementById('mainVideo');
const videoSource = mainVideo.querySelector('source');
const videoTitle = document.getElementById('videoTitle');
const playlistEl = document.getElementById('playlist');

fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    videos.forEach(video => {
      const li = document.createElement('li');
      li.textContent = video.title;
      li.addEventListener('click', () => {
        videoSource.src = video.file;
        mainVideo.poster = video.thumbnail || "";
        mainVideo.load();
        mainVideo.play().catch(() => {});
        videoTitle.textContent = video.title;
      });
      playlistEl.appendChild(li);
    });

    // Load video pertama otomatis
    if(videos.length > 0){
      videoSource.src = videos[0].file;
      mainVideo.poster = videos[0].thumbnail || "";
      mainVideo.load();
      videoTitle.textContent = videos[0].title;
    }
  })
  .catch(err => console.error('Failed to load videos.json', err));

mainVideo.addEventListener('ended', () => {
  mainVideo.currentTime = 0;
  mainVideo.play().catch(() => {});
});
