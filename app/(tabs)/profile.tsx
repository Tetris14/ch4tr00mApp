import { useUserStore } from "@/stores/userStore";
import { Redirect } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default function ProfileScreen() {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <SafeAreaView>
      <Text>Profile</Text>
    </SafeAreaView>
  );
}
