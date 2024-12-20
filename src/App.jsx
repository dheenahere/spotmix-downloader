import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode  } from 'jwt-decode'; 

import UserProfile from './components/UserProfile';
import './index.css';
 
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
		// console.log(token);  // Log the JWT token before sending it back in the response

		if (token) {
			const decoded = jwtDecode (token);
			console.log(decoded);
			setCurrentUser(decoded);
		}
	}, []);

  return (
    <div className="min-h-screen flex pt-20 justify-center bg-[#121212] p-4">
      <div className="max-w-md  rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-spotify tracking-tighter text-white text-center mb-4">
          Sp<span className="text-[#1db954]">oooo</span>tify
        </h1>

        <input
          type="text"
          className="w-full p-2 bg-transparent text-white font-spotifyMed border border-gray-400 hover:border-white rounded mb-6"
          placeholder="Enter Spotify Song URL"
          value={songId}
          onChange={handleInputChange}
        />

        <button
          onClick={handleDownload}
          className="w-full bg-[#1db954] font-spotifyMed font-bold p-4 transition-all rounded-full hover:bg-[#1db954] scale-100 hover:scale-110 brightness-100 hover:brightness-150"
          disabled={!songData.downloadLink}
        >
          {loading ? 'Fetching...' : 'Download Song'}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {songData.title && (
          <div className="text-center mt-4 text-lg text-white font-bold font-spotifyMed">
            <img
              src={songData.cover}
              alt="Album Cover"
              className="w-52 h-52 mx-auto backdrop-blur-lg bg-[#ffffff20] p-2 rounded-lg mb-4"
            />
            <p> {songData.title}</p>
            <p className='font-normal text-[#ffffff70]' > {songData.artist}</p>
            <p> {songData.album}</p>
            <p className='font-normal text-[#ffffff70]' >  {songData.releaseDate}</p>
          </div>
        )}
      </div>
      <UserProfile currentUser={currentUser} />
    </div>
  );
};

export default App;
