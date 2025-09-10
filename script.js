const videoElement = document.getElementById("mainVideo");
const videoTitle = document.getElementById("videoTitle");
const playlistEl = document.getElementById("playlist");
const relatedGrid = document.getElementById("relatedVideos");

let videos = [];
let currentPage = 1;
const itemsPerPage = 10; // 2 baris x 5 kolom
let player; // Fluid Player instance

// Ambil data dari videos.json
fetch("videos.json")
  .then(res => res.json())
  .then(data => {
    videos = data;
    loadVideo(videos[0]); // tampilkan pertama
    buildPlaylist();
    renderRelated();
  });

// Fungsi load video utama
function loadVideo(video) {
  videoElement.querySelector("source").src = video.src;
  videoElement.load();
  videoTitle.textContent = video.title;

  // Hapus player lama kalau ada
  if (player) {
    player.destroy();
  }

  // Inisialisasi Fluid Player
  player = fluidPlayer("mainVideo", {
    layoutControls: {
      controlBar: {
        autoHide: true,
        autoHideTimeout: 3,
        animated: true
      }
    },
    vastOptions: {
      adList: [
        {
          roll: "preRoll",
          vastTag: "https://s.magsrv.com/v1/vast.php?idzone=5720072",
          adText: "Your ad will end in",
          skipButtonCaption: "Skip ad in [seconds]s",
          skipButtonClickCaption: "Skip Ad",
          skipTime: 15
        }
      ]
    }
  });

  // Highlight playlist item aktif
  document.querySelectorAll("#playlist li").forEach(li => li.classList.remove("active"));
  const active = [...document.querySelectorAll("#playlist li")].find(li => li.dataset.src === video.src);
  if (active) active.classList.add("active");
}

// Generate thumbnail dari frame ke 2 detik
function generateThumbnail(src, callback) {
  const video = document.createElement("video");
  video.src = src;
  video.currentTime = 2;
  video.muted = true;
  video.addEventListener("loadeddata", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL("image/png"));
  });
}

// Bangun playlist kanan
function buildPlaylist() {
  playlistEl.innerHTML = "";
  videos.forEach(video => {
    const li = document.createElement("li");
    li.dataset.src = video.src;
    generateThumbnail(video.src, thumb => {
      li.innerHTML = `<img src="${thumb}" alt="${video.title}"><span>${video.title}</span>`;
    });
    li.addEventListener("click", () => loadVideo(video));
    playlistEl.appendChild(li);
  });
}

// Render related videos (2 baris x 5 kolom)
function renderRelated() {
  relatedGrid.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = videos.slice(start, start + itemsPerPage);

  paginatedItems.forEach(video => {
    const div = document.createElement("div");
    div.className = "related-item";
    generateThumbnail(video.src, thumb => {
      div.innerHTML = `<img src="${thumb}" alt="${video.title}"><span>${video.title}</span>`;
    });
    div.addEventListener("click", () => loadVideo(video));
    relatedGrid.appendChild(div);
  });

  buildPagination();
}

// Bangun pagination bawah related
function buildPagination() {
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const paginationEl = document.querySelector(".pagination");
  paginationEl.innerHTML = "";

  // Tombol Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderRelated();
    }
  };
  paginationEl.appendChild(prevBtn);

  // Tombol nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.style.background = "#0056ff";
    btn.onclick = e => {
      e.preventDefault();
      currentPage = i;
      renderRelated();
    };
    paginationEl.appendChild(btn);
  }

  // Tombol Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = e => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderRelated();
    }
  };
  paginationEl.appendChild(nextBtn);
}
