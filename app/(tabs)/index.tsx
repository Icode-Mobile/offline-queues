import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ListPost } from '@/components/ListPost';

import keys from '@/config/keys/index.json';

export default function HomeScreen() {
  const [posts, setPosts] = useState<
    Array<{
      id: number;
      image: string;
      description: string;
      isLoved: boolean;
      createdAt: Date;
    }>
  >([]);

  useEffect(() => {
    loadingAllPosts();
  }, []);

  const loadingAllPosts = async () => {
    const response = await fetch(`${keys.SERVER_URL}/posts`);
    const json = await response.json();

    setPosts(json.data);
  };

  return (
    <View
      style={{
        paddingTop: 60,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: '#adadad',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        BEM VINDO AO FEED
      </Text>

      <ListPost data={posts} loadingAllPosts={loadingAllPosts} />
    </View>
  );
}
