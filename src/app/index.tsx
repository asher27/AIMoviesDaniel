import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import MovieItem from '@/components/MovieItem';
import { supabase } from '@/lib/supabase';

export default function App() {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            let { data: movies, error } = await supabase.from('movies').select('*').range(0, 50);

            if (movies) { 
                setMovies(movies);
            }
        };

        fetchMovies();
    }, []);

    const onPress = async () => {
        const {data} = await supabase.functions.invoke('embed', { body: { input: query } });
       
        const { data: movies } = await supabase.rpc('match_movies', {
            query_embedding: data.embedding,
            match_threshold: 0.78,
            match_count: 5,
        });

        setMovies(movies);

        setQuery('');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder="AI: Search for movies..."
                        placeholderTextColor={'gray'}
                        style={styles.input}
                        value={query}
                        onChangeText={setQuery}
                    />
                    <Button title="Search" onPress={onPress} />
                </View>

                <FlatList data={movies} renderItem={MovieItem} />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181413',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        color: 'white',
    },
});
