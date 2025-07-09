import { useUserStore } from "@/stores/userStore";
import { Redirect } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default function HomeScreen() {
  const { username, jwt, isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
}
