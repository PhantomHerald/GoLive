import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export interface StreamEndNotification {
  streamerUsername: string;
  streamerDisplayName: string;
  title?: string;
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Notification permissions not granted');
        return;
      }

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      this.isInitialized = true;
      console.log('✅ Notification service initialized');
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
    }
  }

  async showStreamEndNotification(notification: StreamEndNotification) {
    try {
      await this.initialize();

      const title = 'Live Stream Ended';
      const body = `Live stream from ${notification.streamerDisplayName} just ended`;
      
      if (Platform.OS === 'web') {
        // For web, use browser notifications
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.png',
          });
        } else {
          // Fallback to alert for web
          Alert.alert(title, body);
        }
      } else {
        // For mobile, use Expo notifications
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { type: 'stream_ended', ...notification },
          },
          trigger: null, // Show immediately
        });
      }
    } catch (error) {
      console.error('❌ Error showing stream end notification:', error);
    }
  }

  async showStreamStartNotification(streamerDisplayName: string, title?: string) {
    try {
      await this.initialize();

      const notificationTitle = 'New Live Stream';
      const body = `${streamerDisplayName} just went live${title ? `: ${title}` : ''}`;
      
      if (Platform.OS === 'web') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notificationTitle, {
            body,
            icon: '/favicon.png',
          });
        } else {
          Alert.alert(notificationTitle, body);
        }
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notificationTitle,
            body,
            data: { type: 'stream_started', streamerDisplayName, title },
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('❌ Error showing stream start notification:', error);
    }
  }

  // Method to show a simple alert (fallback)
  showAlert(title: string, message: string) {
    Alert.alert(title, message);
  }
}

export const notificationService = new NotificationService();
export default notificationService; 