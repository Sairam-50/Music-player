const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
// This object that will contain the songs, the current song playing, and the time of the current song.

let userData = {
  songs: [...allSongs],
  currentSong: null, // To handle the current song's information and track its playback time,
  songCurrentTime: 0,
};

// This provides play functionality to the songs.
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  // You need to update the current song being played as well as the appearance of the playButton element.
  userData.currentSong = song;
  playButton.classList.add("playing");
  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime; // This is to keep track of the current time of the song.
  playButton.classList.remove("playing");
  audio.pause();

  // Use classList and remove() method to remove the .playing class from the playButton, since the song will be paused at this point.
  // To finally pause the song, use the pause() method on the audio variable. pause() is a method of the Web Audio API for pausing music files.
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  if (userData?.currentSong === null) {
    return;
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];
    playSong(previousSong.id);
  }
};

// This function is responsible for shuffling the songs in the playlist and performing necessary state management updates after the shuffling.

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  // You should also re-render the songs, pause the currently playing song, set the player display, and set the play button accessible text again.
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

// It's time to implement a delete functionality for the playlist. This would manage the removal of a song from the playlist, handle other related actions when a song is deleted, and create a Reset Playlist button.

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    set();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);

  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  // Next, you need to check if the playlist is empty. If it is, you should reset the userData object to its original state.
  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);
  }
};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });
  if (songToHighlight) {
    songToHighlight.setAttribute("aria-current", "true");
  }
};

//   This is to display the songs in the UI. The map is used to build the HTML for each song in the array.
// The aria-label attribute is used to provide a label for the button that is only visible to screen readers
const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
    <li id="song-${song.id}" class="playlist-song"> 
    
    <button onclick="playSong(${song.id})" class="playlist-song-info" >   

    <span class="playlist-song-title">${song.title}</span>
    <span class="playlist-song-artist">${song.artist}</span>
    <span class="playlist-song-duration">${song.duration}</span>
</button>

<button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="deleteSong(${song.id})">  

<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
</button>
    </li>
    `;
    })
    .join("");
  playlistSongs.innerHTML = songsHTML;
};

// This function will set the aria-label attribute to the current song, or to the first song in the playlist. And if the playlist is empty, it sets the aria-label to "Play".
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

// Before you start working on playing the next and previous song, you need to get the index of each song in the songs property of userData.

const getCurrentSongIndex = () => userData?.songs.indexOf(userData.currentSong);

playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined; // this results in nextSongExists being true if the next song exists, and false if it doesn't.
  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

resetButton.addEventListener("click", () => {
  userData.songs = [...allSongs];
  // Finally, you should render the songs again, update the play button's accessible text, and remove the reset button from the playlist. You also need to remove the resetButton from the DOM.
  renderSongs(userData?.songs);
  setPlayButtonAccessibleText();
  resetButton.remove();
});

renderSongs(userData?.songs);
