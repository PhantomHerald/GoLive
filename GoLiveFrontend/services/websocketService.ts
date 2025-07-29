import { environment } from '@/config/environment';

export interface StreamUpdate {
  type: 'stream_started' | 'stream_ended';
  streamId: string;
  streamerUsername: string;
  streamerDisplayName: string;
  title?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private connected = false;

  connect() {
    try {
      const wsUrl = environment.API_BASE_URL.replace('http', 'ws') + '/ws/websocket';
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.connected = true;
        
        // Send STOMP CONNECT frame
        this.sendStompConnect();
      };

      this.ws.onmessage = (event) => {
        try {
          console.log('📡 Raw WebSocket message:', event.data);
          
          // Handle STOMP frames
          if (event.data.startsWith('CONNECTED')) {
            console.log('✅ STOMP connected, subscribing to stream updates');
            this.subscribeToStreamUpdates();
          } else if (event.data.startsWith('MESSAGE')) {
            // Parse STOMP message
            const lines = event.data.split('\n');
            const bodyStart = lines.findIndex((line: string) => line === '');
            if (bodyStart !== -1 && bodyStart + 1 < lines.length) {
              const messageBody = lines.slice(bodyStart + 1).join('\n');
              try {
                const data = JSON.parse(messageBody);
                console.log('📡 STOMP message received:', data);
                
                // Handle different message types
                if (data.type === 'stream_started' || data.type === 'stream_ended') {
                  this.notifyListeners('stream_update', data);
                }
              } catch (error) {
                console.error('❌ Error parsing STOMP message body:', error);
              }
            }
          }
        } catch (error) {
          console.error('❌ Error handling WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        this.connected = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.connected = false;
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket connection:', error);
    }
  }

  private sendStompConnect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const connectFrame = 'CONNECT\naccept-version:1.2\nheart-beat:10000,10000\n\n\0';
      this.ws.send(connectFrame);
      console.log('📤 Sent STOMP CONNECT frame');
    }
  }

  private subscribeToStreamUpdates() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscribeFrame = `SUBSCRIBE\nid:stream-updates\ndestination:/topic/streams\n\n\0`;
      this.ws.send(subscribeFrame);
      console.log('📤 Subscribed to stream updates');
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('❌ Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      // Send STOMP DISCONNECT frame
      const disconnectFrame = 'DISCONNECT\n\n\0';
      this.ws.send(disconnectFrame);
      
      setTimeout(() => {
        this.ws?.close();
        this.ws = null;
        this.connected = false;
      }, 100);
    }
  }

  addListener(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  removeListener(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Error in WebSocket listener:', error);
        }
      });
    }
  }

  isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
export default websocketService; 