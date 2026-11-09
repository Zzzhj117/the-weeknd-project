const albumsData = [
  { id: 1, title: "Kiss Land", year: 2013, cover: "images/album-kissland.jpg", genre: "Alternative R&B", label: "XO / Republic", length: "55 min", desc: "Debut studio album. A dark, cinematic R&B journey.", tracks: [ { title: "Professional" }, { title: "The Town" }, { title: "Adaptation" }, { title: "Love in the Sky" }, { title: "Belong to the World" }, { title: "Live For" }, { title: "Wanderlust" }, { title: "Kiss Land" }, { title: "Pretty" }, { title: "Tears in the Rain" } ] },
  { id: 2, title: "Beauty Behind the Madness", year: 2015, cover: "images/album-bbtm.jpg", genre: "Pop / R&B", label: "XO / Republic", length: "65 min", desc: "Breakthrough album featuring massive hits.", tracks: [ { title: "Real Life" }, { title: "Losers" }, { title: "Tell Your Friends" }, { title: "Often" }, { title: "The Hills" }, { title: "Acquainted" }, { title: "Can't Feel My Face" }, { title: "Shameless" }, { title: "Earned It" }, { title: "In the Night" }, { title: "As You Are" }, { title: "Dark Times" }, { title: "Prisoner" }, { title: "Angel" } ] },
  { id: 3, title: "Starboy", year: 2016, cover: "images/album-starboy.jpg", genre: "Pop / Synth-Pop", label: "XO / Republic", length: "68 min", desc: "Pop crossover masterpiece featuring Daft Punk.", tracks: [ { title: "Starboy", audio: "audio/starboy.mp3" }, { title: "Party Monster", audio: "audio/party-monster.mp3" }, { title: "False Alarm" }, { title: "Reminder" }, { title: "Rockin'" }, { title: "Secrets" }, { title: "True Colors" }, { title: "Stargirl Interlude" }, { title: "Sidewalks" }, { title: "Six Feet Under" }, { title: "Love to Lay" }, { title: "A Lonely Night" }, { title: "Attention" }, { title: "Ordinary Life" }, { title: "Nothing Without You" }, { title: "All I Know" }, { title: "Die for You" }, { title: "I Feel It Coming" } ] },
  { id: 4, title: "After Hours", year: 2020, cover: "images/album-afterhours.jpg", genre: "Synthwave / Dream Pop", label: "XO / Republic", length: "56 min", desc: "Synthwave-inspired album featuring Blinding Lights.", tracks: [ { title: "Alone Again" }, { title: "Too Late" }, { title: "Hardest to Love" }, { title: "Scared to Live" }, { title: "Snowchild" }, { title: "Escape from LA" }, { title: "Heartless" }, { title: "Faith" }, { title: "Blinding Lights" }, { title: "In Your Eyes" }, { title: "Save Your Tears" }, { title: "Repeat After Me" }, { title: "After Hours" }, { title: "Until I Bleed Out" } ] },
  { id: 5, title: "Dawn FM", year: 2022, cover: "images/album-dawnfm.jpg", genre: "Synth-Pop / Electronic", label: "XO / Republic", length: "51 min", desc: "A radio-station concept album about purgatory.", tracks: [ { title: "Dawn FM" }, { title: "Gasoline" }, { title: "How Do I Make You Love Me?" }, { title: "Take My Breath" }, { title: "Sacrifice" }, { title: "A Tale by Quincy" }, { title: "Out of Time" }, { title: "Here We Go... Again" }, { title: "Best Friends" }, { title: "Is There Someone Else?" }, { title: "Starry Eyes" }, { title: "Every Angel Is Terrifying" }, { title: "Don't Break My Heart" }, { title: "I Heard You're Married" }, { title: "Less Than Zero" }, { title: "Phantom Regret" } ] },
  { id: 6, title: "Hurry Up Tomorrow", year: 2025, cover: "images/album-hurryup.jpg", genre: "R&B / Pop", label: "XO / Republic", length: "TBA", desc: "The final chapter of the trilogy.", tracks: [ { title: "Wake Me Up" }, { title: "Cry for Me" }, { title: "São Paulo" }, { title: "Until We're Skin & Bones" }, { title: "Baptized in Fear" }, { title: "Open Hearts" }, { title: "Opening Night" }, { title: "Reflections Laughing" }, { title: "Enjoy the Show" }, { title: "Given Up on Me" }, { title: "Niagara Falls" }, { title: "Take Me Back to LA" }, { title: "Big Sleep" }, { title: "Red Terror" }, { title: "Hurry Up Without You" } ] }
];

let currentAudio = null, progressInterval = null;
let currentTracks = [], currentTrackIndex = 0;
let currentCenterIndex = 0;

//drop
let startX = 0;
let endX = 0;
let isDragging = false;
let isWheeling = false; 

document.addEventListener("DOMContentLoaded", () => {
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") currentPath = "index.html";
    
    document.querySelectorAll("header a").forEach((link) => {
        if (link.getAttribute("href") === currentPath) link.classList.add("active");
    });
    
    if (document.getElementById("wheelScene")) initAlbumPage();
    if (document.getElementById("statsModal")) initAwardsPage();
});

/*album logic*/
function initAlbumPage() {
    const scene = document.getElementById("wheelScene");
    
    albumsData.forEach((album, index) => {
        const item = document.createElement("div");
        item.className = "wheel-item";
        item.innerHTML = `
            <img src="${album.cover}" alt="${album.title}">
            <div class="item-info"><h3>${album.title}</h3><span>${album.year}</span></div>
        `;
        
        item.addEventListener("click", (e) => {
            if (Math.abs(endX - startX) > 10) return; // 拖拽误触拦截
            
            if (index === currentCenterIndex) {
                openAlbumDetail(album);
            } else {
                currentCenterIndex = index;
                updateWheelPositions();
            }
        });
        scene.appendChild(item);
    });

    updateWheelPositions();

    // pc mouse drop
    scene.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        endX = e.clientX;
        isDragging = true;
    });
    window.addEventListener("mouseup", (e) => {
        if (!isDragging) return;
        endX = e.clientX;
        handleSwipe();
        isDragging = false;
    });

    // touch
    scene.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        endX = e.touches[0].clientX;
    }, { passive: true });
    scene.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    // pc wheel
    scene.addEventListener("wheel", (e) => {
        if (isWheeling) return;
        e.preventDefault();
        
        if (e.deltaY > 0) {
            currentCenterIndex = (currentCenterIndex + 1) % albumsData.length;
        } else if (e.deltaY < 0) {
            currentCenterIndex = (currentCenterIndex - 1 + albumsData.length) % albumsData.length;
        }
        updateWheelPositions();
        
        isWheeling = true;
        setTimeout(() => { isWheeling = false; }, 400); 
    }, { passive: false });

    const closeBtn = document.getElementById("detailClose");
    if(closeBtn) closeBtn.addEventListener("click", closeDetail);
    
    const playBtn = document.getElementById("playToggle");
    if(playBtn) playBtn.addEventListener("click", togglePlay);
    
    const prevBtn = document.getElementById("prevBtn");
    if(prevBtn) prevBtn.addEventListener("click", () => changeTrack(-1));
    
    const nextBtn = document.getElementById("nextBtn");
    if(nextBtn) nextBtn.addEventListener("click", () => changeTrack(1));
    
    const progressBg = document.getElementById("progressBg");
    if(progressBg) {
        progressBg.addEventListener("click", (e) => {
            if (!currentAudio || isNaN(currentAudio.duration)) return;
            const rect = progressBg.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            currentAudio.currentTime = ratio * currentAudio.duration;
            document.getElementById("progressFill").style.width = (ratio * 100) + "%";
        });
    }
    
    const trackList = document.getElementById("trackList");
    if(trackList) {
        trackList.addEventListener("click", (e) => {
            const li = e.target.closest("li");
            if (li) {
                currentTrackIndex = parseInt(li.dataset.index);
                playTrack(currentTrackIndex); 
            }
        });
    }
}

function handleSwipe() {
    const threshold = 50;
    const deltaX = endX - startX;
    
    if (deltaX > threshold) {
        currentCenterIndex = (currentCenterIndex - 1 + albumsData.length) % albumsData.length;
        updateWheelPositions();
    } else if (deltaX < -threshold) {
        currentCenterIndex = (currentCenterIndex + 1) % albumsData.length;
        updateWheelPositions();
    }
}

function updateWheelPositions() {
    const items = document.querySelectorAll(".wheel-item");
    const bgText = document.getElementById("wheelBgText");
    
    if (albumsData[currentCenterIndex]) {
        bgText.textContent = albumsData[currentCenterIndex].title.split(" ")[0];
    }

    items.forEach((item, index) => {
        let offset = index - currentCenterIndex;
        
        if (offset < -3) offset += items.length;
        if (offset > 2) offset -= items.length;

        const absOffset = Math.abs(offset);
        
        if (absOffset > 2) {
            item.style.opacity = 0;
            item.style.pointerEvents = "none";
            item.style.transform = `translateX(${offset > 0 ? 600 : -600}px) scale(0.5)`;
            return;
        }

        item.style.pointerEvents = "auto";
        const translateX = offset * 280;
        const scale = absOffset === 0 ? 1 : (absOffset === 1 ? 0.82 : 0.65);
        const opacity = absOffset === 0 ? 1 : (absOffset === 1 ? 0.7 : 0.3);
        const zIndex = 100 - absOffset;

        item.style.transform = `translateX(${translateX}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;

        if (index === currentCenterIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

/*detail/player logic*/
function openAlbumDetail(album) {
    document.getElementById("detailCover").src = album.cover;
    document.getElementById("detailTitle").textContent = album.title;
    document.getElementById("detailDesc").textContent = album.desc;
    document.getElementById("metaRelease").textContent = album.year;
    document.getElementById("metaGenre").textContent = album.genre;
    document.getElementById("metaLabel").textContent = album.label;
    document.getElementById("metaLength").textContent = album.length;
    
    document.getElementById("detailBg").style.backgroundImage = `url('${album.cover}')`;
    
    currentTracks = album.tracks; 
    currentTrackIndex = 0;
    
    const trackList = document.getElementById("trackList");
    trackList.innerHTML = "";
    album.tracks.forEach((track, idx) => {
        const li = document.createElement("li");
        li.dataset.index = idx;
        li.innerHTML = `<span class="track-name">${idx + 1}. ${track.title}</span><button class="play-btn">▶</button>`;
        trackList.appendChild(li);
    });

    document.getElementById("albumDetail").classList.add("open");
    stopAudio();
    document.getElementById("playingTitle").textContent = "Select a track";
    document.getElementById("eqBars").classList.remove("active");
}

function closeDetail() {
    document.getElementById("albumDetail").classList.remove("open");
    stopAudio();
}

function stopAudio() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
    
    const playBtn = document.getElementById("playToggle");
    if(playBtn) playBtn.textContent = "▶";
    const fill = document.getElementById("progressFill");
    if(fill) fill.style.width = "0%";
    const timeDisp = document.getElementById("timeDisplay");
    if(timeDisp) timeDisp.textContent = "0:00 / 0:00";
    const eq = document.getElementById("eqBars");
    if(eq) eq.classList.remove("active");
    
    document.querySelectorAll("#trackList li").forEach(li => li.classList.remove("active"));
}

function changeTrack(dir) {
    if (currentTracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex + dir + currentTracks.length) % currentTracks.length;
    playTrack(currentTrackIndex);
}

function playTrack(trackIndex) {
    stopAudio();
    const trackData = currentTracks[trackIndex];
    
    const playingTitle = document.getElementById("playingTitle");
    if(playingTitle) playingTitle.textContent = trackData.title;
    const playBtn = document.getElementById("playToggle");
    if(playBtn) playBtn.textContent = "❚❚";
    const eq = document.getElementById("eqBars");
    if(eq) eq.classList.add("active");
    
    document.querySelectorAll("#trackList li").forEach((li, idx) => {
        if (idx === trackIndex) li.classList.add("active");
    });

    let audioUrl = trackData.audio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    
    //avoid bug
    const thisAudio = new Audio(audioUrl);
    currentAudio = thisAudio;

    currentAudio.onerror = function() {
        //only mistake change ui
        if (currentAudio !== thisAudio) return; 
        
        console.log("Local audio failed. Using fallback.");
        thisAudio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        thisAudio.play().catch(() => {
            if (currentAudio === thisAudio && playBtn) playBtn.textContent = "▶";
            if (currentAudio === thisAudio && eq) eq.classList.remove("active");
        });
    };

    currentAudio.play().catch(() => {
        if (currentAudio === thisAudio && playBtn) playBtn.textContent = "▶";
        if (currentAudio === thisAudio && eq) eq.classList.remove("active");
    });

    progressInterval = setInterval(() => {
        if (!currentAudio || currentAudio !== thisAudio) return; 
        const pct = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
        const fill = document.getElementById("progressFill");
        if(fill) fill.style.width = pct + "%";
        const timeDisp = document.getElementById("timeDisplay");
        if(timeDisp) timeDisp.textContent = formatTime(currentAudio.currentTime) + " / " + formatTime(currentAudio.duration);
    }, 300);
}

function togglePlay() {
    if (!currentAudio) { currentTrackIndex = 0; playTrack(currentTrackIndex); return; }
    
    const playBtn = document.getElementById("playToggle");
    const eq = document.getElementById("eqBars");
    
    if (currentAudio.paused) { 
        currentAudio.play(); 
        if(playBtn) playBtn.textContent = "❚❚"; 
        if(eq) eq.classList.add("active");
    } else { 
        currentAudio.pause(); 
        if(playBtn) playBtn.textContent = "▶"; 
        if(eq) eq.classList.remove("active");
    }
}

function formatTime(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/*awards logic*/
function initAwardsPage() {
    const statsModal = document.getElementById("statsModal");
    const statsClose = document.getElementById("statsModalClose");
    const statCards = document.querySelectorAll(".stat-card");

    statCards.forEach(card => {
        card.addEventListener("click", () => {
            document.getElementById("statsModalTitle").textContent = card.getAttribute("data-name");
            document.getElementById("statsModalYears").textContent = card.getAttribute("data-years");
            statsModal.classList.add("open");
        });
    });

    if(statsClose) statsClose.addEventListener("click", () => statsModal.classList.remove("open"));
    if(statsModal) statsModal.addEventListener("click", (e) => { if (e.target === statsModal) statsModal.classList.remove("open"); });

    const awardModal = document.getElementById("awardModal");
    const awardClose = document.getElementById("modalClose");
    const highlightCards = document.querySelectorAll(".award-card");

    highlightCards.forEach(card => {
        card.addEventListener("click", () => {
            document.getElementById("modalYear").textContent = card.getAttribute("data-year");
            document.getElementById("modalTitle").textContent = card.getAttribute("data-title");
            document.getElementById("modalDesc").textContent = card.getAttribute("data-desc");
            awardModal.classList.add("open");
        });
    });

    if(awardClose) awardClose.addEventListener("click", () => awardModal.classList.remove("open"));
    if(awardModal) awardModal.addEventListener("click", (e) => { if (e.target === awardModal) awardModal.classList.remove("open"); });
}