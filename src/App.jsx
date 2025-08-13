import React, { useState, useRef } from 'react';
import { LampContainer } from "./components/ui/lamp";
import { motion } from "motion/react";
import { SparklesCore } from "./components/ui/sparkles";
import './index.css';
import GridCard from './components/GridCard';

const App = () => {
    const [spotifyTrackUrl, setSpotifyTrackUrl] = useState('');
    const [spotifyTrackId, setSpotifyTrackId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [downloadDetails, setDownloadDetails] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isDownloading, setDownloading] = useState(false);
    const inputSectionRef = useRef(null);

    // Extract track ID from Spotify URL
    const extractTrackId = (url) => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : '';
    };

    // Verify song details from API
    const verifySongData = async () => {
        if (!spotifyTrackId) {
            setFetchError("Please enter a valid Spotify track URL.");
            return;
        }

        setIsLoading(true);
        setFetchError(null);
        setDownloadDetails(null);
        setIsVerified(false);

        const apiUrl = `https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=${spotifyTrackId}`;
        const headers = {
            'x-rapidapi-key': 'b956d6a526msh7b1a2a3662d09cdp11fa3djsn5b6cad23f10f',
            'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
        };

        try {
            const response = await fetch(apiUrl, { method: 'GET', headers });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            if (data.success && data.data) {
                setDownloadDetails(data.data);
                console.log(data.data);
                setIsVerified(true);
            } else {
                throw new Error('Invalid song data received from API.');
            }
        } catch (err) {
            setFetchError(err.message || 'Failed to fetch song data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Download after verification
    const handleDownload = async () => {
        if (!downloadDetails?.downloadLink) {
            setFetchError("Download link not available. Please verify again.");
            setIsVerified(false);
            return;
        }

        setDownloading(true);
        setFetchError(null);

        try {
            const response = await fetch(downloadDetails.downloadLink);
            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${downloadDetails.title || 'spotify_song'}.mp3`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup the blob URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setFetchError(err.message || "Download failed");
        } finally {
            setDownloading(false);
        }
    };

    // Handle input
    const handleSpotifyUrlChange = (e) => {
        const url = e.target.value.trim();
        setSpotifyTrackUrl(url);
        setSpotifyTrackId(extractTrackId(url));
        setIsVerified(false);
        setDownloadDetails(null);
        setFetchError(null);
    };

    const scrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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

            {/* Foreground */}
            <div className="relative z-10 flex flex-col items-center">
                <LampContainer>
                    <motion.h1
                        initial={{ opacity: 0.5, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                        className="mt-16 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl text-transparent md:text-7xl font-bigfont md:flex flex-col space-y-3"
                    >
                        <span>Download Spotify Songs,</span>
                        <span>
                            Playlists <span className="font-spotify">&</span> Albums in High Quality MP<span className="font-spotify">3</span>
                        </span>
                    </motion.h1>

                    <motion.button
                        initial={{ opacity: 0.5, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                        className="bg-[#1db954] py-6 px-20 font-bigfont rounded-full text-dark md:text-2xl mt-20" onClick={scrollToInputSection}
                    >
                        Explore now
                    </motion.button>
                </LampContainer>

                {/* Features */}
                <div className="pb-12 md:grid md:grid-cols-3 gap-8 md:w-4/5 w-5/6 space-y-8 md:space-y-0">
                    <GridCard number="01" title="Download Any Spotify Song" description="Save your favorite Spotify tracks directly to your device in MP3 or high-quality audio formats." />
                    <GridCard number="02" title="Lightning-Fast Spotify Downloader" className="row-span-2" description="Experience the fastest Spotify music downloading on the web. Convert songs, playlists, and albums into high-quality MP3, AAC, or FLAC formats within seconds, thanks to our ultra-optimized servers. Preserve original audio quality, album artwork, and full metadata, including track title, artist, and release year. Enjoy seamless batch downloads for entire collections, ensuring your offline library stays organized and ready to play on any device—without interruptions." />
                    <GridCard number="03" title="No Premium Required" description="Enjoy unlimited downloads from Spotify without needing a paid Premium account." />
                    <GridCard number="04" title="High-Quality Audio" description="Get crystal-clear audio with options for up to 320kbps MP3 or lossless formats." />
                    <GridCard number="05" title="Easy to Use" description="A clean, user-friendly interface that lets you download songs in seconds." />
                </div>

                {/* URL Input */}
                <div className="w-screen min-h-screen py-20">
                    <motion.h1
                        initial={{ opacity: 0.5, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                        className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-3xl text-transparent md:text-7xl mb-8 font-bigfont md:flex flex-col space-y-3"
                    >
                        <span className='cursor-pointe r'>Paste the URL Below </span>
                    </motion.h1>

                    <motion.div
                        ref={inputSectionRef}
                        initial={{ opacity: 0.5, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                        className='flex flex-col items-center'
                    >
                        <input
                            type="text"
                            className='bg-transparent border h-16  w-5/6 md:w-1/3 md:px-6 focus:outline-none focus:border-[#1db954] md:focus:w-2/5 transition-all duration-500 font-para text-white md:text-xl tracking-wider'
                            onChange={handleSpotifyUrlChange}
                            placeholder='Enter the Spotify track URL'
                            value={spotifyTrackUrl}
                        />

                        <button
                            onClick={isVerified ? handleDownload : verifySongData}
                            className={`p-3 px-8 md:py-4 md:px-32 mt-10 font-bigfont rounded-full bg-[#1db954] text-dark text-xl transition-all duration-500 active:scale-95 ${isVerified ? ' hover:scale-110' : ' hover:scale-110'
                                }`}
                        >
                            {isLoading ? 'Verifying...' : isVerified ? (isDownloading ? "Downloading..." : 'Download') : 'Verify'}
                        </button>
                    </motion.div>
                    {/* Download Details Section */}
                    {downloadDetails && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex justify-center px-4 md:px-0"
                        >
                            <div className="mt-8 border p-3 md:p-5 md:w-1/5 ">
                                <div className="flex-col flex items-center gap-4">
                                    <img
                                        src={downloadDetails.cover}
                                        alt={downloadDetails.title}
                                        className="w-full h-full "
                                    />
                                    <div>
                                        <p className="text-2xl text-white font-title mt-2">{downloadDetails.title}</p>
                                        <p className="text-gray-400 font-para tracking-wider mt-2">{downloadDetails.album}</p>
                                        <p className="text-gray-400 font-para tracking-wider">{downloadDetails.artist}</p>
                                        <p className="text-gray-400 font-para tracking-wider text-right mt-2 md:mt-0">{downloadDetails.releaseDate}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {fetchError && <p className="mt-4 text-red-500">{fetchError}</p>}
                </div>
            </div>
            <div className="hidden-seo-content hidden" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <h1>Spotify Downloader - Free MP3 Download of Songs, Playlists & Albums</h1>
                <h2>How to Download Spotify Songs as MP3</h2>
                <p>Our Spotify downloader makes it easy to save any Spotify track, playlist or album as high-quality MP3 files. Simply paste the Spotify song URL, click download, and get your MP3 instantly. No registration or premium account required.</p>

                <h3>Features of Our Spotify to MP3 Converter</h3>
                <ul>
                    <li>Download individual Spotify songs or entire playlists</li>
                    <li>Convert Spotify to MP3 with 320kbps audio quality</li>
                    <li>Preserve all metadata including artist, album and cover art</li>
                    <li>Works without Spotify Premium subscription</li>
                    <li>Fast downloads with no speed limits</li>
                    <li>No software installation - works directly in your browser</li>
                </ul>

                <h3>Why Choose Our Spotify Music Downloader?</h3>
                <p>Among all Spotify downloaders available online, our tool stands out because:</p>
                <ul>
                    <li>100% free with no hidden costs</li>
                    <li>No watermarks on downloaded files</li>
                    <li>Supports all Spotify regions and languages</li>
                    <li>Regular updates to ensure compatibility</li>
                    <li>Secure connection protects your privacy</li>
                </ul>

                <h3>Spotify Downloader FAQ</h3>
                <p><strong>Is it legal to download songs from Spotify?</strong><br/>
                    Our tool is for personal use only. Please only download music you have rights to access.</p>

                <p><strong>What audio quality can I expect?</strong><br/>
                    Downloads are available in 128kbps, 256kbps and 320kbps MP3 quality.</p>

                <p><strong>Does this work on mobile devices?</strong><br/>
                    Yes! Our Spotify downloader works on iPhone, Android, tablets and computers.</p>
            </div>
        </div>
    );
};

export default App;