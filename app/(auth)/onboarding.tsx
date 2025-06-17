import { router } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const goToSignIn = () => {
  router.replace("/Signup");
};
const goToLogin = () => {
  router.replace("/Login");
};

export default function Onboarding() {
  const { height } = useWindowDimensions();
  const isShort = height < 850;
  return (
    <SafeAreaView style={styles.viewBg}>
      <View
        style={[
          styles.view,
          styles.viewLayout,
          { width: Dimensions.get("window").width, overflow: "hidden" },
        ]}
      >
        <Text
          style={[
            styles.grrntGamesCallContainer,
            styles.containerTypo1,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.g}>g</Text>
          <Text style={styles.rrntGamesTypo}>
            <Text
              style={[
                styles.rrnt,
                styles.containerTypo,
                {
                  fontWeight: !isShort ? 900 : 600,
                },
              ]}
            >{`rrNT `}</Text>
            <Text
              style={[
                styles.games,
                styles.containerTypo,
                {
                  fontWeight: !isShort ? 900 : 600,
                },
              ]}
            >
              Games
            </Text>
          </Text>
          <Text style={styles.games}>
            <Text style={styles.text1}>{` `}</Text>
          </Text>
          <Text
            style={[
              styles.callOfDuty,
              styles.rrntGamesTypo,
              styles.containerTypo,
              styles.have,
              {
                fontWeight: !isShort ? 900 : 600,

                textAlign: "right",
                flex: 1,
                flexShrink: 1,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Call of duty: Mobile
          </Text>
        </Text>
        <Text
          style={[
            styles.haveMusicElectronicContainer,
            styles.containerLayout,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.have}>
            <Text style={styles.h}>h</Text>
            <Text
              style={[
                styles.containerTypo,
                {
                  fontWeight: !isShort ? 900 : 600,
                  width: Dimensions.get("window").width * 2,
                },
              ]}
            >
              ave
            </Text>
          </Text>
          <Text
            style={[
              styles.games,
              {
                fontWeight: !isShort ? 900 : 600,
                width: Dimensions.get("window").width * 2,
              },
            ]}
          >
            <Text style={styles.h}>{` `}</Text>
            <Text
              style={[
                styles.containerTypo,
                {
                  fontWeight: !isShort ? 900 : 600,
                  width: Dimensions.get("window").width * 2,
                },
              ]}
            >
              Music
            </Text>
            <Text style={styles.h}>{` `}</Text>
          </Text>
          <Text
            style={[
              styles.electronicPunk,
              styles.containerTypo,
              {
                fontWeight: !isShort ? 900 : 600,
                width: Dimensions.get("window").width * 2,
              },
            ]}
          >
            Electronic Punk Electric
          </Text>
        </Text>
        <Text
          style={[
            styles.newsTalkShowsContainer,
            styles.containerLayout,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text
            style={[
              styles.electronicPunk,
              styles.containerTypo,
              {
                fontWeight: !isShort ? 900 : 600,
                width: Dimensions.get("window").width * 2,
              },
            ]}
          >
            News
          </Text>
          <Text style={styles.games}>
            <Text style={styles.text1}>{` `}</Text>
            <Text
              style={[
                styles.containerTypo,
                {
                  fontWeight: !isShort ? 900 : 600,
                  width: Dimensions.get("window").width * 2,
                },
              ]}
            >
              Talk
            </Text>
            <Text style={styles.text1}>{` `}</Text>
          </Text>
          <Text
            style={[
              styles.electronicPunk,
              styles.containerTypo,
              {
                fontWeight: !isShort ? 900 : 600,
                width: Dimensions.get("window").width * 2,
              },
            ]}
          >
            Shows History Education
          </Text>
        </Text>
        <Text
          style={[
            styles.allSportsBaseballContainer,
            styles.containerTypo,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.have}>all</Text>
          <Text style={styles.games}>{` Sports `}</Text>
          <Text style={styles.have}>Baseball Soccer and many</Text>
          <Text style={styles.games}>{`n
`}</Text>
        </Text>
        <Text
          style={[
            styles.totallyTravelContainer,
            styles.containerTypo,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.have}>totally</Text>
          <Text style={styles.games}>{` Travel & Outdoors `}</Text>
          <Text style={styles.have}>Animation</Text>
        </Text>
        <Text
          style={[
            styles.nothingJustChattingContainer,
            styles.nothingContainerTypo,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.games}>n</Text>
          <Text style={styles.have}>othing</Text>
          <Text style={styles.games}>{` Just Chatting `}</Text>
          <Text style={styles.have}>News Movies and more</Text>
        </Text>
        <Text
          style={[
            styles.nothingFoodContainer,
            styles.nothingContainerTypo,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.have}>{`nothing `}</Text>
          <Text style={styles.games}>{`Food & Drink `}</Text>
          <Text style={styles.have}>Social Entertainment</Text>
        </Text>
        <Text
          style={[
            styles.specialsSpecialEventsContainer,
            styles.containerTypo,
            {
              fontWeight: !isShort ? 900 : 600,
              width: Dimensions.get("window").width * 2,
            },
          ]}
        >
          <Text style={styles.have}>Specials</Text>
          <Text style={styles.games}>{` Special Events `}</Text>
          <Text style={styles.have}>Sports food M</Text>
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          top: -200,
          padding: 20,
          position: "sticky",
        }}
      >
        <Text
          style={{
            color: "white",
            position: "absolute",
            fontFamily: "Inter-SemiBold",
            paddingTop: isShort ? 90 : 10,
            fontSize: !isShort ? 36 : 32,
            fontWeight: !isShort ? 900 : 600,
          }}
        >
          There’s something for you on GoLive
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
          <Text style={styles.buttonTextWhite}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={goToSignIn}>
          <Text style={styles.buttonTextDark}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  onboarding: {
    flex: 1,
    backgroundColor: "#ae44fe",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: "#ae44fe",
  },
  loginButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#8e36d1",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  signupButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonTextWhite: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  buttonTextDark: {
    color: "#303030",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  viewLayout: {
    overflow: "hidden",
    width: "100%",
    marginTop: -80,
  },
  iphoneLayout: {
    height: 44,
    width: 375,
  },
  batteryIconPosition: {
    top: 0,
    position: "absolute",
  },
  sidePosition: {
    top: 17,
    height: 11,
    position: "absolute",
  },
  containerTypo1: {
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  rrntGamesTypo: {
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
  },
  containerLayout: {
    width: 459,
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  containerTypo: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
  },
  nothingContainerTypo: {
    left: -88,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  buttonFlexBox: {
    padding: 12,
    justifyContent: "center",
    flexDirection: "row",
    width: 136,
    borderRadius: 8,
    top: 735,
    alignItems: "center",
    position: "absolute",
    overflow: "hidden",
  },
  buttonTypo: {
    lineHeight: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "left",
  },
  batteryIcon: {
    right: 0,
  },
  wifiIcon: {},
  mobileSignalIcon: {},
  rightSide: {
    right: 15,
    width: 67,
    height: 11,
  },
  leftSideIcon: {
    left: 33,
  },
  iphoneX11ProBlack: {
    height: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    position: "absolute",
  },
  iphoneX11ProWhite1: {
    left: 0,
    height: 44,
    width: 375,
  },
  iphoneX11ProWhite: {
    top: 3,
    left: -5,
    position: "absolute",
  },
  g: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  rrnt: {
    color: "#500589",
  },
  games: {
    color: "#fff",
  },
  text1: {
    fontFamily: "Poppins-Regular",
  },
  callOfDuty: {
    color: "#550096",
  },
  grrntGamesCallContainer: {
    top: 129,
    width: 456,
    height: 49,
    left: -56,
  },
  h: {
    fontFamily: "Inter-Regular",
  },
  have: {
    color: "#550096",
  },
  electronicPunk: {
    color: "#550096",
  },
  haveMusicElectronicContainer: {
    top: 178,
    left: -42,
    height: 63,
  },
  newsTalkShowsContainer: {
    top: 229,
    height: 76,
    left: -56,
  },
  allSportsBaseballContainer: {
    top: 277,
    left: -4,
    width: 466,
    height: 62,
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  totallyTravelContainer: {
    top: 328,
    left: -63,
    width: 480,
    height: 78,
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  nothingJustChattingContainer: {
    top: 378,
    width: 477,
    height: 73,
  },
  nothingFoodContainer: {
    top: 429,
    width: 500,
    height: 66,
  },
  specialsSpecialEventsContainer: {
    top: 474,
    left: -98,
    width: 528,
    height: 69,
    textAlign: "left",
    lineHeight: 32,
    fontSize: 32,
    position: "absolute",
  },
  theresSomethingFor: {
    top: 462,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    display: "flex",
    width: 672,
    height: 216,
    alignItems: "center",
    left: 43,
    color: "#fff",
    textAlign: "left",
    fontSize: 32,
    position: "absolute",
  },
  button1: {
    color: "#fff",
  },
  button: {
    borderStyle: "solid",
    borderColor: "rgba(44, 44, 44, 0)",
    borderWidth: 1,
    opacity: 0.5,
    left: 43,
    padding: 12,
    justifyContent: "center",
    flexDirection: "row",
    width: 136,
    borderRadius: 8,
    top: 735,
    backgroundColor: "#ae44fe",
  },
  button3: {
    color: "#303030",
  },
  button2: {
    left: 210,
    backgroundColor: "#fff",
  },
  view: {
    backgroundColor: "#ae44fe",
    flex: 1,
  },
  viewBg: {
    backgroundColor: "#ae44fe",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
