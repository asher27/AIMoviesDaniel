import { generateEmbedding } from './generateEmbedding.js';
import { supabase } from './supabase.js';

const getMovies = () => {
    return supabase.from('movies').select('*').is('embedding', null);
};

const addMovieEmbedding = async (movie) => {
    const embedding = await generateEmbedding(movie.overview);
    await supabase.from('movies').update({ embedding }).eq('id', movie.id);

    // console.log('Generated embeddings for movie: ', movie.id);
};

const processAllMoview = async () => {
    const { data: movies } = await getMovies();

    if (!movies?.length) return;
    console.log('Generated counts: ', movies?.length);

    await Promise.all(movies.map((movie) => addMovieEmbedding(movie)));

    // call again for the next batch of items
    processAllMoview();
};

processAllMoview();

