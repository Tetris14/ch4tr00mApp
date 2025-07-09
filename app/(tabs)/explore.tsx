import { useUserStore } from "@/stores/userStore";
import { Redirect } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default function TabTwoScreen() {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <SafeAreaView>
      <Text>Explore</Text>
    </SafeAreaView>
  );
}
