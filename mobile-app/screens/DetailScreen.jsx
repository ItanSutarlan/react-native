import { Card, Title, Paragraph } from 'react-native-paper';
import { Text, View, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';
import { GET_TODO_BY_SLUG } from '../queries';

const windowWidth = Dimensions.get('window').width;

export default function DetailsScreen({ route }) {
  const { slug } = route.params;

  const { data } = useQuery(GET_TODO_BY_SLUG, {
    variables: {
      slug,
    },
  });

  const content = data?.findPostBySlug?.data;

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20, marginHorizontal: 5 }}>
      <Card style={{ padding: 10 }}>
        <ScrollView>
          <View>
            <View>
              <Title>{content?.title}</Title>
            </View>
            <View>
              <Image
                style={{ width: windowWidth, height: 250 }}
                source={{ uri: content?.imgUrl }}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              Author: {content?.author.username}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              Tags: {content?.tags.map((tag) => tag.name).join(', ')}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              Created at: {content?.createdAt.split('T')[0]}
            </Text>
          </View>
          <Paragraph style={{ textAlign: 'justify' }}>
            {content?.content}
          </Paragraph>
        </ScrollView>
      </Card>
    </SafeAreaView>
  );
}
