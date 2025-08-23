import { Button, ButtonIcon, ButtonText } from '@/libs/components/ui/button';
import { SafeAreaView, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text style={{ color: 'red' }}>Hello</Text>

      <Button variant="solid" action="secondary">
        <ButtonText>Hello</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
