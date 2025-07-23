import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

import { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Step = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    image: require("@/assets/images/favicon.png"),
    title: "Welcome to Twitch",
    description:
      "Discover live streams, chat with your favorite creators, and join a vibrant community. Let’s get started!",
  },
  {
    image: require("@/assets/images/favicon.png"),
    title: "Follow & Chat",
    description:
      "Follow channels you love and never miss a stream. Join the chat to interact and be part of the action in real time.",
  },
  {
    image: require("@/assets/images/favicon.png"),
    title: "Go Live or Watch",
    description:
      "Stream your own content or explore thousands of live channels. Twitch is where your interests come alive!",
  },
];

const OnboardingModal: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const router = useRouter();

  const progressPosition = useSharedValue(0);

  useEffect(() => {
    progressPosition.value = currentStep / (steps.length - 1);
  }, [currentStep, progressPosition]);

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(progressPosition.value * 60 + 2.5, {
        damping: 15,
        stiffness: 100,
      }),
    };
  });

  const hideModal = () => setVisible(false);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      hideModal();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToLastStep = () => {
    setDirection("forward");
    setCurrentStep(steps.length - 1);
  };

  const getEnteringAnimation = () => {
    return direction === "forward"
      ? FadeInRight.duration(350)
      : FadeInLeft.duration(350);
  };

  const goToSignIn = () => {
    setVisible(false);
    router.replace("/Login");
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Animated.View
            style={styles.imageWrapper}
            entering={getEnteringAnimation()}
            key={`image-${currentStep}`}
          >
            <Image source={steps[currentStep].image} style={styles.image} />
          </Animated.View>
        </View>
        <View style={styles.contentContainer}>
          <Animated.View
            entering={getEnteringAnimation()}
            key={`text-${currentStep}`}
          >
            <Text style={styles.title}>{steps[currentStep].title}</Text>
            <Text style={styles.description}>
              {steps[currentStep].description}
            </Text>
          </Animated.View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressIndicator, progressAnimatedStyle]}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                currentStep === 0 && styles.disabledButton,
              ]}
              onPress={goToPreviousStep}
              disabled={currentStep === 0}
            >
              <Icon name="chevron-left" size={18} color="#fff" />
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            {currentStep === steps.length - 1 ? (
              <View>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={goToSignIn}
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
                  <Icon name="login" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.signUpButton]}
                  onPress={goToSignIn}
                >
                  <Text style={styles.buttonText}>SIGN UP</Text>
                  <Icon name="account" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={goToNextStep}
              >
                <Text style={styles.buttonText}>NEXT</Text>
                <Icon name="arrow-right" size={18} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                currentStep === steps.length - 1 && styles.disabledButton,
              ]}
              onPress={skipToLastStep}
              disabled={currentStep === steps.length - 1}
            >
              <Text style={styles.buttonText}>Skip</Text>
              <Icon name="skip-next" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e10", // dark background
  },
  imageContainer: {
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  contentContainer: {
    height: "45%",
    backgroundColor: "#18181b", // slightly lighter dark
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    alignItems: "center",
  },
  title: {
    color: "#a259ff", // purple accent
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
    lineHeight: 48,
  },
  description: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  progressBar: {
    backgroundColor: "#28282E",
    height: 14,
    width: 80,
    marginTop: 20,
    borderRadius: 7,
    justifyContent: "center",
  },
  progressIndicator: {
    height: 10,
    width: 20,
    borderRadius: 5,
    backgroundColor: "#a259ff", // purple accent
    position: "absolute",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 44,
  },
  button: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 5,
  },
  nextButton: {
    borderWidth: 1,
    borderColor: "#a259ff",
    borderRadius: 20,
    backgroundColor: "#a259ff22",
  },
  disabledButton: {
    opacity: 0.5,
  },
  loginButton: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#a259ff",
    backgroundColor: "#a259ff22",
    marginBottom: 8,
  },
  signUpButton: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#fff",
    marginTop: 12,
    backgroundColor: "#28282E",
  },
});

export default OnboardingModal;
