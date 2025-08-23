import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Page() {
  return (
    <View>
      <View className="flex my-auto">
        <Text className="text-6xl text-red-500">Hello Woarld</Text>
        <Text className="text-2xl">This is the first page of your app.</Text>
      </View>

      <Link href="/(tabs)" className="text-4xl">Go home</Link>
    </View>
  );
}
