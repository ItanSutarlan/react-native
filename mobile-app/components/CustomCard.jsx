import { Card, Title, Paragraph } from 'react-native-paper';
import { Text, View, Image } from 'react-native';

export default function CustomCard({ content, navigation }) {
  const buttonOnPressHandler = () => {
    navigation.navigate('Details', { slug: content.slug });
  };

  return (
    <Card
      style={{
        marginTop: 10,
        borderColor: 'black',
        borderRadius: 5,
        borderBottomWidth: 1,
      }}
      onPress={buttonOnPressHandler}
    >
      <View style={{ flexDirection: 'row' }}>
        {/*  Text */}
        <View
          style={{
            justifyContent: 'space-around',
            flex: 2 / 3,
            margin: 10,
          }}
        >
          <Title>{content.title}</Title>
        </View>
        {/*  Image */}
        <View style={{ flex: 1 / 3, margin: 10 }}>
          <Image
            style={{ width: 120, height: 120 }}
            source={{ uri: content.imgUrl }}
          />
        </View>
      </View>
      <View style={{ margin: 10 }}>
        <Paragraph>{`${content.content.split(' ', 40)} ......`}</Paragraph>
        <Text>Published At: {content.cratedAt}</Text>
        <Text>Author: {content.author.username}</Text>
      </View>
    </Card>
  );
}
