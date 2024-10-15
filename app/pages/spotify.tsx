"use client";
import { useEffect, useState } from 'react';
import SpotifyLogo from '../spotify-transparent.png';
import SLogo from '../spotifylogo.jpg';
import Image from 'next/image';

const Spotify = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual access and refresh tokens
  const ACCESS_TOKEN = 'BQD7qUtNurioR42JnoLK1tAkRI8Y1vZk99oB6Ut96XX1z3OJTKJQOzYcJjemhGQ5sDz1zmaPhtn-I0GlyYTea44Jz8cUKxsVOPTSNnSJrzOUEn_vmeXrJ5dFR0D14Z5nRINN6WIS3r05t377GLZ1uAgC22VrrpfAMKHokovEtChArocJGgDAOWKTTtZS7mmzb_6q0XGcGkzqUKQ1G2w';
  const REFRESH_TOKEN = 'AQDekZKlBQdmpVBgE4Nlousp7YVYmFBKEYxLDEWEKPybC1NgW0Yxrd0cbt3O_zLIjAEeKCwNAJZj6sQNAipolU1R7IiqsqGX8MbRUDFtcOHrT_wwk47i5FiCKFQUJkilqck'; // Your refresh token here
  const CLIENT_ID = '4477928025d44144bb295cad9c9b7aaa'; // Your client ID
  const CLIENT_SECRET = 'f16920871e16431cbd97223890e4e9a0'; // Your client secret

  const fetchNowPlaying = async () => {
    try {
      let accessToken = ACCESS_TOKEN;

      // Check if the access token is expired (you could implement your own logic to determine this)
      const isExpired = true; // Implement your own logic for token expiry check

      if (isExpired) {
        // Refresh access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
          }).toString(),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to refresh access token');
        }

        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
      }

      // Fetch currently playing track
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from Spotify');
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("hi");
    fetchNowPlaying(); // Fetch once when the component mounts

    const intervalId = setInterval(fetchNowPlaying, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);
  console.log(data);
  if (!data || !data.is_playing) {
    return <div className="box boxanimation"><p className='quote-text-by mr-12'>Not listening to anything right now.</p><Image className='logo ml-4' width={140} height={140} src={SLogo} alt='' /></div>;
  }

  const { item } = data;

  return (
    <div className="box boxanimation">
      <img
        className="albumImage"
        src={item.album.images[0].url}
        alt={`Album cover of ${item.album.name}`}
        width={100}
        height={100}
      />
      <div>
        <p className="nowPlaying">Now playing:</p>
        <a
          className="link"
          href={item.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name} by {item.artists.map((artist: { name: any; }) => artist.name).join(', ')}
        </a>
        <p className="albumText">Album: {item.album.name}</p>
      </div>
      <div className="playing">
        <div className="greenline line-1"></div>
        <div className="greenline line-2"></div>
        <div className="greenline line-3"></div>
        <div className="greenline line-4"></div>
        <div className="greenline line-5"></div>
      </div>
      <Image className='logo' width={150} height={100} src={SpotifyLogo} alt='' />
    </div>
  );
};

export default Spotify;
