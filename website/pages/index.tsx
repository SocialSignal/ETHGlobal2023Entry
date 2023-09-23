"use client";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import MainDialog from "../components/LandingPage/MainDialog";

const Home: NextPage = () => {
  const introAudioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    try {
      var audio = new Audio("/sfx/intro2.mp3");
      audio.volume = 1;
      audio.play();
      introAudioRef.current = audio;
    } catch (e) {}
  }, []);

  return (
    <MainDialog onPlayGlobalSound={() => introAudioRef.current?.pause()} />
  );
};

export default Home;
