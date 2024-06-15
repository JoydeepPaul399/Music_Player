console.log("Let's write some JavaScript");
let currentSong= new Audio();
let songs;

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



const playMusic= (track, pause=false)=>{
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
    songs=await getSongs();
    currentSong.src=songs[0]
    playMusic(songs[0], true);
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
            playMusic(e.querySelector(".info-div").innerHTML)
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
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    // Add and event listener to the seekbar when drag left or right
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        // console.log(e.target)
        // console.log(e.target)
        // console.log(e.offsetX)
        // console.log(e.target.getBoundingClientRect().width)
        // console.log(e.target.getElementsByTagName("div")[0], e.offsetX, e.offsetY)
        let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime= (currentSong.duration * percent)/100
    })

    // Add an event listener for hamburger
    document.getElementsByClassName("hamburger")[0].addEventListener("click", ()=>{
        document.querySelector(".left").style.left= "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left= "-120%"
    })

    // Add an event listener to previous
    document.querySelector("#previous").addEventListener("click",()=> {
        // console.log("Previous clicked");
        // console.log(currentSong)
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

        else{
            playMusic(songs[songs.length-1])
        }
        
        
    })
    // Add an event listener to next 

    document.querySelector("#next").addEventListener("click", ()=>{
        // console.log("Next was clicked");
        // console.log(songs)
        // console.log(currentSong)
        //console.log(currentSong.src.split("/"))
        //console.log(currentSong.src.split("/").slice(-1)) // now getting new array 
        //console.log(currentSong.src.split("/").slice(-1)[0]) // first element of array

        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(index)
        // console.log(songs.length)
        // if((index+1) > length){}
        // if((index+1) < songs.length) this condition is working as already first song is loading so index is 0 first then so on
        
        if((index+1) < songs.length){

            playMusic(songs[index+1]);
        }

        else{
            playMusic(songs[0])
        }
    })

    // Add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value)
        // volume is 0 to 1
        console.log(currentSong.volume)
        currentSong.volume= parseInt(e.target.value)/100;
    })
} 

main()