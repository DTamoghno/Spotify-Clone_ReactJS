import { useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();
const PlayerContextProvider = (props)=>{

  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track,setTrack]=useState(songsData[0]);//Default track is first song
  
  const [playStatus,setPlayStatus]=useState(false);//To check song is playing or paused

  //To get total duration and current time
  const [time,setTime] = useState({
    currentTime:{
      second:0,
      minute:0
    },
    totalTime:{
      second:0,
      minute:0
    }
  })

  const play = ()=>{ 
    audioRef.current.play();
    setPlayStatus(true);
  }
  const pause=()=>{
    audioRef.current.pause();
    setPlayStatus(false);
  }

  //In the DisplayAlbum component, the purpose of the playWithId function is to allow users to play a specific song from the album when they click on a song in the album's song list. It dynamically updates the currently playing track, starts playback, and sets the play status.
  const playWithId = async (id)=>{
    await setTrack(songsData[id]);//await ensures that the track is set before the audio element starts playing.
    await audioRef.current.play();
    setPlayStatus(true);
  }

  //When user clicks on previous icon then the previous song starts playing  fo that we need to ensure right track is set and then play that track
  const previous = async ()=>{
    if(track.id>0){
      await setTrack(songsData[track.id-1]) 
      //When tract is changed then player is paused then to play that we do this
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  const next = async ()=>{
    if(track.id<songsData.length-1){
      await setTrack(songsData[track.id+1]) 
      //When tract is changed then player is paused then to play that we do this
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }
  const seekSong = async (e)=>{
      audioRef.current.currentTime = ((e.nativeEvent.offsetX)/seekBg.current.offsetWidth)*audioRef.current.duration
  }

  useEffect(()=>{
    setTimeout(()=>{
      audioRef.current.ontimeupdate = ()=>{
        seekBar.current.style.width = ((audioRef.current.currentTime/audioRef.current.duration)*100)+"%";
        setTime({
          currentTime:{
            second:Math.floor(audioRef.current.currentTime%60), 
            minute:Math.floor(audioRef.current.currentTime/60)
          },
          totalTime:{
            second:Math.floor(audioRef.current.duration%60), 
            minute:Math.floor(audioRef.current.duration/60)
          }
        })
      }
    },1000)//Delay of 1 second is to ensure that ensure the audio element is ready and properly initialized before setting up the ontimeupdate event listener.
  },[audioRef])

  const contextValue={
    //This is where you define the data or functions you want to share with other components.
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong

  }
  return(
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider;