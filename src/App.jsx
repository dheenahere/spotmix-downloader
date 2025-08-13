import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { LampContainer } from "./components/ui/lamp";
import { motion } from "motion/react";
import UserProfile from './components/UserProfile';
import { SparklesCore } from "./components/ui/sparkles";
import './index.css';
import { GlowingEffect } from "./components/ui/glowing-effect";
import images from './assets'
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import GridCard from './components/GridCard';

const App = () => {
    const [songId, setSongId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [songData, setSongData] = useState({});

    const fetchSong = async (id) => {
        setLoading(true);
        setError(null);
        setSongData({});

        const apiUrl = `https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'b956d6a526msh7b1a2a3662d09cdp11fa3djsn5b6cad23f10f',
                'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(apiUrl, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            if (result.success && result.data) {
                setSongData(result.data);
            } else {
                console.error('Download URL not found in the response.');
                setError('Failed to download the song');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch the song data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSongId(value);

        // Extract the song ID from the Spotify URL
        const id = value.split('/track/')[1]?.split('?')[0];
        if (id) {
            fetchSong(id); // Fetch the song title whenever the input changes
        }
    };

    const handleDownload = () => {
        if (songData.downloadLink) {
            const link = document.createElement('a');
            link.href = songData.downloadLink;
            link.setAttribute('download', 'song.mp3');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://authback-jxx5.onrender.com/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();

        // Check token on app load
        const token = localStorage.getItem("authToken");

        if (token) {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Get current time in seconds

            // Check if the token has expired
            if (decoded.exp < currentTime) {
                localStorage.removeItem("authToken"); // Remove expired token
                alert("Session expired. Please log in again.");
            } else {
                setCurrentUser(decoded); // Set user info from the decoded token
            }
        }
    }, []);

    return (
        <div className="relative flex flex-col justify-center items-center">
            {/* Background sparkles */}
            <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={10}
                className="absolute inset-0 w-full h-full bg-black"
                particleColor="#FFFFFF"
            />

            {/* Foreground content */}
            <div className="relative z-10 flex flex-col items-center  ">
                <LampContainer>
                    <motion.h1
                        initial={{ opacity: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className="mt-16 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl text-transparent md:text-7xl font-bigfont md:flex flex-col space-y-3"
                    >
                        <span>Download Spotify Songs,</span>
                        <span>
                            Playlists <span className="font-spotify">&</span> Albums in High Quality MP<span className="font-spotify">3</span>
                        </span>
                    </motion.h1>
                    <motion.button initial={{ opacity: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }} className="bg-[#1db954] py-6 px-20 font-bigfont rounded-full text-dark text-2xl mt-20">
                        Explore now
                    </motion.button>
                </LampContainer>

                <div className=" pb-12 grid grid-cols-3 gap-8 w-4/5">
                    <GridCard
                        number="01"
                        title="Download Any Spotify Song"
                        description="Save your favorite Spotify tracks directly to your device in MP3 or high-quality audio formats."
                    />

                    <GridCard
                        number="02"
                        title="Lightning-Fast Spotify Downloader"
                        className="row-span-2"
                        description="Instantly convert Spotify songs, playlists, and albums to high-quality MP3s with our ultra-fast servers. Enjoy one-click downloads that preserve metadata and artwork, with support for batch processing entire collections in seconds. Works seamlessly across all devices - no software needed - with optimized performance for both desktop (Windows/Mac/Linux) and mobile browsers. Experience maximum download speeds without buffering, regardless of file size or quantity."
                    />

                    <GridCard
                        number="03"
                        title="No Premium Required"
                        description="Enjoy unlimited downloads from Spotify without needing a paid Premium account."
                    />

                    <GridCard
                        number="04"
                        title="High-Quality Audio"
                        description="Get crystal-clear audio with options for up to 320kbps MP3 or lossless formats."
                    />

                    <GridCard
                        number="05"
                        title="Easy to Use"
                        description="A clean, user-friendly interface that lets you download songs in just a few seconds."
                    />
                </div>
                <div className="w-screen min-h-screen py-20  ">
                    <motion.h1
                        initial={{ opacity: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl text-transparent md:text-7xl mb-8 font-bigfont md:flex flex-col space-y-3"
                    >
                        <span className='cursor-pointer'>Paste the URL Below (click me to paste)</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }} className='flex flex-col items-center'>
                        <input type="text" className=' bg-transparent border h-16 w-1/3 px-6 focus:outline-none focus:border-[#1db954] focus:w-2/5 transition-all duration-500 font-para text-white text-xl tracking-wider ' placeholder='Enter the URL' />
                        <button className='bg-[#1db954] py-4 px-32 mt-10 hover:scale-110 transition-all duration-500 active:scale-95 font-bigfont rounded-full text-dark text-xl'>
                            Download
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>

    );
};

export default App;
