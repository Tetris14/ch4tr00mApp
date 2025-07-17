import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { useDailyForecast } from "@/hooks/useDailyForecast";
import { useHourlyForecast } from "@/hooks/useHourlyForecast";
import { useUserStore } from "@/stores/userStore";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const getIcon = (conditionCode: string, daylight: boolean) => {
  const isNight = !daylight;

  switch (conditionCode) {
    case "BlowingDust":
    case "Dust":
    case "Haze":
    case "Smoky":
    case "Smoke":
    case "Breezy":
    case "Windy":
      return "wind";

    case "Blizzard":
    case "BlowingSnow":
      return "wind.snow";

    case "Clear":
      return isNight ? "moon.stars.fill" : "sun.max.fill";

    case "Cloudy":
      return "cloud.fill";

    case "Drizzle":
    case "FreezingDrizzle":
      return "cloud.drizzle.fill";

    case "Flurries":
    case "SnowShowers":
    case "ScatteredSnowShowers":
      return "cloud.snow.fill";

    case "Foggy":
      return "cloud.fog.fill";

    case "FreezingRain":
    case "MixedRainAndSleet":
    case "MixedRainAndSnow":
    case "MixedRainfall":
    case "MixedSnowAndSleet":
    case "Sleet":
      return "cloud.sleet.fill";

    case "Frigid":
      return "thermometer.snowflake";

    case "Hail":
      return "cloud.hail.fill";

    case "HeavyRain":
      return "cloud.heavyrain.fill";

    case "HeavySnow":
      return "snowflake";

    case "Hot":
      return "thermometer.sun.fill";

    case "IsolatedThunderstorms":
    case "ScatteredThunderstorms":
    case "Thunderstorms":
    case "SevereThunderstorm":
      return "cloud.bolt.rain.fill";

    case "MostlyClear":
    case "MostlyCloudy":
      return isNight ? "cloud.moon.fill" : "cloud.sun.fill";

    case "PartlyCloudy":
      return isNight ? "cloud.moon" : "cloud.sun.fill";

    case "Rain":
    case "Showers":
    case "ScatteredShowers":
    case "SunShowers":
      return "cloud.rain.fill";

    case "Snow":
      return "snow";

    case "StrongStorms":
      return "tornado";

    default:
      return "questionmark.circle";
  }
};

const getBackgroundImage = (conditionCode: string) => {
  switch (conditionCode) {
    case "Clear":
    case "MostlyClear":
    case "Hot":
      return require("@/assets/images/sunny.jpg");

    case "Cloudy":
    case "MostlyCloudy":
    case "PartlyCloudy":
    case "Foggy":
    case "Haze":
    case "Smoky":
    case "Smoke":
      return require("@/assets/images/cloudy.png");

    case "Drizzle":
    case "FreezingDrizzle":
    case "Rain":
    case "Showers":
    case "ScatteredShowers":
    case "SunShowers":
    case "HeavyRain":
    case "FreezingRain":
    case "MixedRainAndSleet":
    case "MixedRainAndSnow":
    case "MixedRainfall":
    case "Sleet":
    case "Hail":
    case "IsolatedThunderstorms":
    case "ScatteredThunderstorms":
    case "Thunderstorms":
    case "SevereThunderstorm":
    case "StrongStorms":
      return require("@/assets/images/rainy.png");

    case "Snow":
    case "HeavySnow":
    case "Flurries":
    case "SnowShowers":
    case "ScatteredSnowShowers":
    case "Blizzard":
    case "BlowingSnow":
    case "MixedSnowAndSleet":
      return require("@/assets/images/cloudy.png"); // Using cloudy for snow since no snow image

    default:
      return require("@/assets/images/sunny.jpg"); // Default to sunny
  }
};

export default function TabTwoScreen() {
  const { isAuthenticated } = useUserStore();

  const { data, loading, error } = useCurrentWeather({
    lat: 48.8566,
    lon: 2.3522,
    lang: "fr",
  });

  const {
    data: hourlyData,
    loading: hourlyLoading,
    error: hourlyError,
  } = useHourlyForecast({
    lat: 48.8566,
    lon: 2.3522,
    lang: "fr",
  });

  const {
    data: dailyData,
    loading: dailyLoading,
    error: dailyError,
  } = useDailyForecast({
    lat: 48.8566,
    lon: 2.3522,
    lang: "fr",
  });

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <ImageBackground
      source={getBackgroundImage(
        data?.currentWeather?.conditionCode || "Clear"
      )}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>Paris</Text>
          <Text style={styles.temperature}>
            {(data?.currentWeather?.temperature ?? 0).toFixed(0)}°
          </Text>
          <Text style={styles.conditionCode}>
            {data?.currentWeather?.conditionCode}
          </Text>
          <Text style={styles.temperatureApparent}>
            ↑ {(data?.currentWeather?.temperatureApparent ?? 0).toFixed(0)}° ↓{" "}
            {(data?.currentWeather?.temperatureDewPoint ?? 0).toFixed(0)}°
          </Text>
        </View>
        <ScrollView bounces={true} style={styles.scrollView}>
          <View style={styles.scrollViewContentContainer}>
            <View style={styles.gradientContainer}>
              <View style={styles.gradientContainerText}>
                <Text style={{ fontSize: 20, color: "white" }}>Mauvaise</Text>
              </View>
              <LinearGradient
                colors={["#00f", "#0f0", "#ff0", "#f00", "#f0f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
              <View style={styles.gradientContainerText}>
                <Text style={{ fontSize: 14, color: "white" }}>
                  La qualité de l&apos;air est moins bonne qu&apos;hier à la
                  même heure
                </Text>
              </View>
            </View>
            <View style={styles.hourlyContainer}>
              <View style={styles.hourlyContainerHeader}>
                <IconSymbol name="clock" size={20} color="white" />
                <Text style={{ fontSize: 16, color: "white" }}>
                  PRÉVISIONS HEURE PAR HEURE
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.hourlyScrollView}
              >
                {hourlyData?.forecastHourly?.hours
                  ?.slice(0, 24)
                  .map((hour, index) => (
                    <View key={index} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>
                        {index === 0
                          ? "Maint."
                          : `${new Date(hour.forecastStart).getHours()}h`}
                      </Text>
                      <IconSymbol
                        name={getIcon(hour.conditionCode, hour.daylight)}
                        size={20}
                        color="white"
                      />
                      <Text style={styles.hourlyTemp}>
                        {(hour.temperature ?? 0).toFixed(0)}°
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={styles.dailyContainer}>
              <View style={styles.dailyContainerHeader}>
                <IconSymbol name="calendar" size={20} color="white" />
                <Text style={{ fontSize: 16, color: "white" }}>
                  PRÉVISIONS SUR 10 JOURS
                </Text>
              </View>
              <View style={styles.dailyContainerContent}>
                {dailyData?.forecastDaily?.days?.map((day, index) => (
                  <View key={index} style={styles.dailyItem}>
                    <Text style={styles.dailyDate}>
                      {(() => {
                        const date = new Date(day.forecastStart);
                        const today = new Date();
                        const isToday =
                          date.getDate() === today.getDate() &&
                          date.getMonth() === today.getMonth() &&
                          date.getFullYear() === today.getFullYear();
                        if (isToday) {
                          return "Auj.";
                        }
                        return (
                          date
                            .toLocaleDateString("fr-FR", { weekday: "short" })
                            .replace(/^./, (c) => c.toUpperCase())
                            .slice(0, 3) + "."
                        );
                      })()}
                    </Text>
                    <IconSymbol
                      name={getIcon(day.conditionCode, true)}
                      size={20}
                      color="white"
                    />
                    <Text style={styles.dailyTemp}>
                      {(day.temperatureMin ?? 0).toFixed(0)}°
                    </Text>
                    <LinearGradient
                      colors={["#00f", "#0f0", "#ff0", "#f00", "#f0f"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.dailyGradient}
                    />
                    <Text style={styles.dailyTemp}>
                      {(day.temperatureMax ?? 0).toFixed(0)}°
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flex: 1,
    marginTop: 80,
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
  },
  weatherContainer: {
    alignItems: "center",
    marginTop: 70,
  },
  city: {
    fontSize: 24,
    // fontWeight: "bold",
    color: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  temperature: {
    fontSize: 80,
    // fontWeight: "bold",
    color: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 34,
  },
  conditionCode: {
    fontSize: 20,
    color: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  temperatureApparent: {
    fontSize: 16,
    color: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradientContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(139, 191, 249, 0.2)",
    height: 100,
    width: "90%",
    borderRadius: 10,
    padding: 10,
  },
  gradient: {
    height: 5,
    borderRadius: 10,
    width: "100%",
  },
  dailyGradient: {
    height: 5,
    borderRadius: 10,
    width: "50%",
  },
  gradientContainerText: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  hourlyContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 16,
  },
  hourlyContainer: {
    width: "90%",
    height: 100,
    backgroundColor: "rgba(139, 191, 249, 0.2)",
    borderRadius: 10,
    padding: 10,
  },
  hourlyScrollView: {
    flex: 1,
    marginTop: 10,
  },
  hourlyItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  hourlyTime: {
    fontSize: 12,
    color: "white",
    marginBottom: 4,
  },
  hourlyTemp: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  dailyContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 16,
  },
  dailyContainer: {
    width: "90%",
    height: "auto",
    backgroundColor: "rgba(139, 191, 249, 0.2)",
    borderRadius: 10,
    padding: 10,
  },
  dailyContainerContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "auto",
    marginTop: 10,
  },
  dailyItem: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dailyDate: {
    fontSize: 20,
    color: "white",
  },
  dailyTemp: {
    fontSize: 20,
    color: "white",
  },
});
