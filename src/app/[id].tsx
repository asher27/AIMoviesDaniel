import MovieItem from '@/components/MovieItem';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
 

const MovieItemDetail = () => {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;

            const { data } = await supabase.from('movies').select('*').eq('id', id).single();

            if (data) setMovie(data);
        };

        fetchMovie();
    }, [id]);

    useEffect(() => {
        if (!movie?.embedding) return;
    

        const fetchSimlarMovies = async () => {
            const { data: documents } = await supabase.rpc('match_movies', {
                query_embedding: movie.embedding,
                match_threshold: 0.78,
                match_count: 5,
            });

            setSimilarMovies(documents);
        };

        fetchSimlarMovies();

    }, [movie?.embedding]);

    if (!movie) {
        return <ActivityIndicator />;
    }

    // console.log(similarMovies);

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.subtitle}>{movie.tagline}</Text>
            <Text style={styles.overview}>{movie.overview}</Text>

            <Text style={styles.simular}>Simular Movies</Text>

            <FlatList
                data={similarMovies}
                renderItem={MovieItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gainsboro',
        marginVertical: 5,
    },

    subtitle: {
        color: 'gray',
        fontSize: 16,
    },

    overview: {
        color: 'gainsboro',
        marginTop: 20,
        lineHeight: 20,
        fontSize: 16,
    },

    simular: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gainsboro',
        marginVertical: 5,
        marginTop: 20,
    },
});

export default MovieItemDetail;
