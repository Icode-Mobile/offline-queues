import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import keys from '@/config/keys/index.json';

interface ListPostProps {
  data: Array<{
    id: number;
    image: string;
    description: string;
    isLoved: boolean;
    createdAt: Date;
  }>;
  loadingAllPosts: Function;
}

const { width: WIDTH_SCREEN, height: HEIGHT_SCREEN } = Dimensions.get('window');

export const ListPost = ({ data, loadingAllPosts }: ListPostProps) => {
  const handleSendLove = async (id: number) => {
    const response = await fetch(`${keys.SERVER_URL}/post/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    if (json.error) {
      Alert.alert('Erro 🚧', 'Seu post não pode ser atualizado!');
    } else {
      Alert.alert('Sucesso 🚀', 'Seu post foi atualizado!');
      loadingAllPosts();
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View
          style={{
            marginTop: 30,
            width: WIDTH_SCREEN - 40,
            height: 460,
          }}
        >
          <Image
            source={{
              uri: item.image,
            }}
            defaultSource={{
              uri: item.image,
            }}
            resizeMode='cover'
            style={{
              width: WIDTH_SCREEN - 40,
              height: 200,
              borderRadius: 10,
            }}
          />
          <Text
            style={{
              color: '#fff',
              marginTop: 10,
              marginLeft: 10,
              fontWeight: '500',
              fontSize: 12,
              width: WIDTH_SCREEN - 40,
            }}
          >
            {item.description}
          </Text>
          <Text
            style={{
              color: '#999',
              marginTop: 10,
              marginLeft: 10,
              fontWeight: '500',
              fontSize: 12,
            }}
          >
            Postado {moment(item.createdAt).format('DD/MM/YYYY')}
          </Text>
          <View
            style={{
              marginTop: 20,
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => handleSendLove(item.id)}
                activeOpacity={0.7}
              >
                <AntDesign
                  name={item.isLoved ? 'heart' : 'hearto'}
                  size={24}
                  color={item.isLoved ? '#ca4b4b' : '#fff'}
                />
              </TouchableOpacity>
              <AntDesign
                name='sharealt'
                size={24}
                color={'#fff'}
                style={{
                  marginLeft: 15,
                }}
              />
            </View>
            <MaterialCommunityIcons
              name='dots-vertical'
              size={24}
              color={'#fff'}
            />
          </View>
        </View>
      )}
      keyExtractor={(item, index: number) => String(index)}
    />
  );
};
