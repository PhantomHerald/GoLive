import CategoriesScreen from "@/app/stream/categories";
import LiveChannelsScreen from "@/app/stream/livechannels";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Searchtabs() {
  const tabs = ["Categories", "Live channels"];
  const [activeTab, setActiveTab] = useState("Categories");
  const trail = true;
  const renderTabContent = () => {
    switch (activeTab) {
      case "Categories":
        return <CategoriesScreen />;
      case "Live channels":
        return <LiveChannelsScreen />;

      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.wrapper}>
        <View style={styles.topBar}>
          <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTab(tab)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.underline} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.contentContainer}>{renderTabContent()}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: "transparent",
    padding: 20,
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
  },
  tab: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  tabText: {
    color: "#ccc",
    fontSize: 20,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  underline: {
    marginTop: 4,
    height: 4,
    width: 28,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  followingTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  followingSub: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  followingDiscover: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
});

/*(
          <SafeAreaView>
            <View>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: 20,
                  width: 141,
                  height: 30,
                  flexDirection: "column",
                  justifyContent: "center",
                  flexShrink: 0,
                  paddingLeft: 10,
                }}
              >
                Live Now
              </Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/ChatGPT Image May 15, 2025, 10_25_26 PM.png")}
                  style={{
                    width: 200,
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <Text style={styles.followingTitle}>Coming Soon {"\n"}</Text>
                <Text style={styles.followingSub}>
                  Live channel browsing is not available yet, but stay tuned!
                </Text>
              </View>
            </View>
          </SafeAreaView>
        )*/

/*(import CategoriesScreen from "@/app/stream/categories";
import LiveChannelsScreen from "@/app/stream/livechannels";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Searchtabs() {
  const tabs = ["Categories", "Live channels"];
  const [activeTab, setActiveTab] = useState("Categories");
  const trail = true;
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});

  const handleTabTextLayout = (tab: string, event: any) => {
    const width = event.nativeEvent.layout.width;
    setTabWidths((prev) => ({ ...prev, [tab]: width }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Categories":
        return <CategoriesScreen />;
      case "Live channels":
        return <LiveChannelsScreen />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(tab)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeText]}
                onLayout={(e) => handleTabTextLayout(tab, e)}
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View
                  style={[
                    styles.underline,
                    { width: tabWidths[tab] || undefined },
                  ]}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: "transparent",
    padding: 10,
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
  },
  tab: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  tabText: {
    color: "#ccc",
    fontSize: 20,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  underline: {
    marginTop: 4,
    height: 2.5,
    backgroundColor: "#BF94FE",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  followingTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  followingSub: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  followingDiscover: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
});


          <SafeAreaView>
            <View>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: 20,
                  width: 141,
                  height: 30,
                  flexDirection: "column",
                  justifyContent: "center",
                  flexShrink: 0,
                  paddingLeft: 10,
                }}
              >
                Live Now
              </Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/ChatGPT Image May 15, 2025, 10_25_26 PM.png")}
                  style={{
                    width: 200,
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <Text style={styles.followingTitle}>Coming Soon {"\n"}</Text>
                <Text style={styles.followingSub}>
                  Live channel browsing is not available yet, but stay tuned!
                </Text>
              </View>
            </View>
          </SafeAreaView>
        )*/
