import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';

import Card from '../components/CustomCard';
import { GET_POSTS } from '../queries';

export default function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: {
      category: null,
    },
  });

  return (
    <SafeAreaView>
      <FlatList
        data={data?.findAllPosts?.data}
        renderItem={({ item }) => (
          <Card content={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
