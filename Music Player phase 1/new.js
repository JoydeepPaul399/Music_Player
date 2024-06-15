console.log("Let's write some JavaScript");
let currentSong= new Audio()

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return `Invalid number`;
    }

    const minutes= Math.floor(seconds / 60);
    const remainingSeconds= Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0'); // first of all we are setting mintues to a string. padStart function check the length of minutes if it less than 2 then put 0 before the start. 
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// console.log(secondsToMinutesSeconds(9))

async function getSongs(){
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response= await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName("a");
    let songs=[];
    for(let index=0;index<as.length;index++){
        const element= as[index];
        if(element.href.endsWith(".mp3")){
            // songs.push(element.href);
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}



const palyMusic= (track, pause=false)=>{
    // let audio= new Audio("/songs/"+track);
    currentSong.src= "/songs/"+track;
    if(!pause){

        currentSong.play();
    }
    let play= document.getElementById("play");  
    play.src="pause.svg";

    // document.querySelector(".songinfo").innerHTML=track.replaceAll("%20", " ");
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    // document.querySelector(".songtime").innerHTML="00:00 /00:00"
}

async function main(){
    let songs=await getSongs();
    currentSong.src=songs[0]
    palyMusic(songs[0], true);
    let play= document.getElementById("play");
    play.src="play.svg";
    // console.log(songs);
    // let card= document.getElementsByClassName("card")[0];
    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div class="info-div">${song.replaceAll("%20", " ")}</div>
                                <div class="info-div">Joydeep</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play">
                            </div>
                        </li>`;
    }
    // let audio = new Audio(songs[0]);
    // card.addEventListener("click", ()=>{
    //     audio.play();
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
        
    // })

    //Attach event listener to each song
    Array.from( document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{

            console.log(e.querySelector(".info-div").innerHTML);
            palyMusic(e.querySelector(".info-div").innerHTML)
        })
    })

    
    //Attach an event listener to play, next and previous. 
    // let play= document.getElementById("play");
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg";
        }

        else{
            currentSong.pause();
            play.src="play.svg";
        }
    })
    

    // giving Invalid number so using this event listener
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `00:00 / ${secondsToMinutesSeconds(currentSong.duration)}`;
    });
    //Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong)
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    // Add and event listener to the seekbar when drag left or right
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        // console.log(e.target.getElementsByTagName("div")[0], e.offsetX, e.offsetY)
        let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime= (currentSong.duration * percent)/100
    })
} 

main()