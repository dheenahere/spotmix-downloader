import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LampContainer } from "./components/ui/lamp";
import { motion } from "motion/react";
import { SparklesCore } from "./components/ui/sparkles";
import './index.css';
import GridCard from './components/GridCard';
import { getAccessToken } from "./utils/spotifyApi";

const App = () => {

    const [url, setUrl] = useState('');
    const [trackInfo, setTrackInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackInfo = async () => {
            const trackId = extractTrackId(url);
            if (!trackId) return;

            setLoading(true);
            setError(null);

            try {
                const accessToken = await getAccessToken();
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || 'Failed to fetch track details');
                }

                const data = await response.json();
                setTrackInfo(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to get track information');
                setTrackInfo(null);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            if (url) {
                fetchTrackInfo();
            }
        }, 800);

        return () => clearTimeout(debounceTimer);
    }, [url]);

    // Function to extract track ID from Spotify URL
    const extractTrackId = (url) => {
        if (!url) return null;

        // Handle different Spotify URL formats
        const regex = /spotify:track:([a-zA-Z0-9]+)|https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        return match ? (match[1] || match[2]) : null;
    };

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
                        <input type="text" className=' bg-transparent border h-16 w-1/3 px-6 focus:outline-none focus:border-[#1db954] focus:w-2/5 transition-all duration-500 font-para text-white text-xl tracking-wider ' onChange={(e) => setUrl(e.target.value)} placeholder='Enter the URL' value={url} />
                        <button className='bg-[#1db954] py-4 px-32 mt-10 hover:scale-110 transition-all duration-500 active:scale-95 font-bigfont rounded-full text-dark text-xl'>
                            Download
                        </button>
                    </motion.div>
                    {loading && <p className="mt-4 text-[#1db954]">Loading...</p>}
                    {error && <p className="mt-4 text-red-500">{error}</p>}

                    {trackInfo && (
                        <div className="mt-8 w-full max-w-2xl bg-gray-900 p-6 rounded-lg">
                            <div className="flex items-start">
                                {trackInfo.album.images[0] && (
                                    <img
                                        src={trackInfo.album.images[0].url}
                                        alt={trackInfo.name}
                                        className="w-48 h-48 object-cover mr-6"
                                    />
                                )}

                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{trackInfo.name}</h2>
                                    <p className="text-lg text-gray-300 mb-4">
                                        {trackInfo.artists.map(artist => artist.name).join(', ')}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-gray-400">Album</p>
                                            <p>{trackInfo.album.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Release Date</p>
                                            <p>{trackInfo.album.release_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Duration</p>
                                            <p>{Math.floor(trackInfo.duration_ms / 60000)}:{((trackInfo.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Popularity</p>
                                            <p>{trackInfo.popularity}/100</p>
                                        </div>
                                    </div>

                                    {trackInfo.preview_url && (
                                        <audio controls className="mt-6 w-full">
                                            <source src={trackInfo.preview_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default App;