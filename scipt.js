let currentsong = new Audio();
let songs = [];
let currfolder

function secoundtominutesscouneds(secound) {
    if (isNaN(secound) || secound < 0) {
        return "00:00";
    }
    const minutes = Math.floor(secound / 60);
    const remingsecound = Math.floor(secound % 60);

    const formatedminutes = String(minutes).padStart(2, "0");
    const formatedsecound = String(remingsecound).padStart(2, "0");

    return `${formatedminutes}:${formatedsecound}`;
}

async function getsongs(folder) {
    try {
        currfolder = folder;

        let a = await fetch(`http://127.0.0.1:3000/${folder}/`);

        if (!a.ok) {
            throw new Error("HTTP error! status: " + a.status);
        }
        let response = await a.text();
        
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];

        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith("mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }
        return songs;
    } catch (error) {
        
        return [];
    }
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
    }
    play.src = "paused.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {
    songs = await getsongs("songs/ncs");
    playmusic(songs[0], true);

    let songul = document.querySelector(".songlist ul");
    if (songul) {
        for (const song of songs) {
            songul.innerHTML += `<li style="display: flex; justify-content: space-between; align-items: center;"> 
                <div class="info">
                    <span>${song.replaceAll("%20", " ")}</span>
                    <span>rahat</span>
                </div>
                <div class="playnow" style="display: flex; align-items: center;">
                    <span>Play Now</span>
                    <img src="playss.svg" alt="playss" style="margin-left: 10px;">
                </div>
            </li>`;
        }
    } else {
        
    }

    if (songs.length > 0) {
        let audio = new Audio("/songs/" + songs[0]);

        audio.addEventListener("loadedmetadata", () => {
            let duration = audio.duration;
           
        });
    } else {
        
    }

    Array.from(document.querySelectorAll(".songlist li")).forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.querySelector(".info span").innerHTML.trim();
           
            playmusic(songName);
        });
    });

    let play = document.querySelector("#playButton"); // Assuming play button has this ID
    if (play) {
        play.addEventListener("click", () => {
            if (currentsong.paused) {
                currentsong.play();
                play.src = "paused.svg";
            } else {
                currentsong.pause();
                play.src = "play.svg";
            }
        });
    } else {
        
    }

    currentsong.addEventListener("timeupdate", () => {
        

        document.querySelector(".songtime").innerHTML = `${secoundtominutesscouneds(currentsong.currentTime)} / ${secoundtominutesscouneds(currentsong.duration)}`;
        document.querySelector(".cricle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".cricle").style.left = persent + "%";
        currentsong.currentTime = ((currentsong.duration) * persent) / 100;
    });

    //document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    //});

    perviouss.addEventListener("click", () => {
        
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
        
    });


    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })








}

main();
