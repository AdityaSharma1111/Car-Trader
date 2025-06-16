import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const getCarImageFromPexels = async (query) => {
  try {
    const res = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query: `${query} car exterior`,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const photo = res.data.photos?.[0];
    return photo ? photo.src.large : null;
  } catch (err) {
    console.error('Pexels error:', err);
    return null;
  }
};