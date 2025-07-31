import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface GoLiveModalProps {
  visible: boolean;
  onClose: () => void;
  streamKey?: string;
  playbackId?: string;
  streamId?: string;
  loading?: boolean;
  error?: string | null;
}

export default function GoLiveModal({
  visible,
  onClose,
  streamKey,
  playbackId,
  streamId,
  loading = false,
  error = null,
}: GoLiveModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await Clipboard.setString(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const renderCredentialField = (
    label: string,
    value: string,
    fieldName: string,
    description?: string
  ) => (
    <View style={styles.credentialField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.fieldValue} selectable>
          {value}
        </Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyToClipboard(value, fieldName)}
        >
          <MaterialCommunityIcons
            name={copiedField === fieldName ? 'check' : 'content-copy'}
            size={20}
            color={copiedField === fieldName ? '#4CAF50' : '#006eff'}
          />
        </TouchableOpacity>
      </View>
      {description && (
        <Text style={styles.fieldDescription}>{description}</Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Go Live</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#006eff" />
                <Text style={styles.loadingText}>Setting up your stream...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={48} color="#ff4d4f" />
                <Text style={styles.errorTitle}>Setup Failed</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={onClose}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : streamKey ? (
              <>
                {/* Success Message */}
                <View style={styles.successContainer}>
                  <MaterialCommunityIcons name="check-circle" size={48} color="#4CAF50" />
                  <Text style={styles.successTitle}>Stream Ready!</Text>
                  <Text style={styles.successSubtitle}>
                    Your stream has been created successfully. Use the credentials below with OBS Studio or any compatible streaming software.
                  </Text>
                </View>

                {/* OBS Instructions */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>How to Stream</Text>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="download" size={20} color="#006eff" />
                    <Text style={styles.instructionText}>
                      Download and install OBS Studio from obsproject.com
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="cog" size={20} color="#006eff" />
                    <Text style={styles.instructionText}>
                      In OBS, go to Settings → Stream and select "Custom" service
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="key" size={20} color="#006eff" />
                    <Text style={styles.instructionText}>
                      Copy and paste the credentials below
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <MaterialCommunityIcons name="play" size={20} color="#006eff" />
                    <Text style={styles.instructionText}>
                      Click "Start Streaming" in OBS
                    </Text>
                  </View>
                </View>

                {/* Stream Credentials */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Stream Credentials</Text>
                  
                  {renderCredentialField(
                    'RTMP URL',
                    'rtmps://global-live.mux.com:443/app',
                    'rtmp',
                    'The server URL for your stream'
                  )}
                  
                  {renderCredentialField(
                    'Stream Key',
                    streamKey,
                    'key',
                    'Your unique stream key (keep this private)'
                  )}
                  
                  {playbackId && renderCredentialField(
                    'Playback URL',
                    `https://stream.mux.com/${playbackId}.m3u8`,
                    'playback',
                    'URL to view your live stream'
                  )}
                </View>

                {/* Additional Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Additional Software</Text>
                  <View style={styles.softwareItem}>
                    <Text style={styles.softwareName}>OBS Studio</Text>
                    <Text style={styles.softwareDesc}>Free, open-source streaming software</Text>
                  </View>
                  <View style={styles.softwareItem}>
                    <Text style={styles.softwareName}>Streamlabs OBS</Text>
                    <Text style={styles.softwareDesc}>OBS with built-in overlays and alerts</Text>
                  </View>
                  <View style={styles.softwareItem}>
                    <Text style={styles.softwareName}>XSplit Broadcaster</Text>
                    <Text style={styles.softwareDesc}>Professional streaming software</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="video" size={48} color="#666" />
                <Text style={styles.emptyText}>Ready to go live?</Text>
                <Text style={styles.emptySubtext}>
                  Click "Go Live" to get your streaming credentials
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {streamKey && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.startButton} onPress={onClose}>
                <Text style={styles.startButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#18181b',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 500,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorTitle: {
    color: '#ff4d4f',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#006eff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  successSubtitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  credentialField: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28282E',
    borderRadius: 8,
    padding: 12,
  },
  fieldValue: {
    color: '#006eff',
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  fieldDescription: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  softwareItem: {
    marginBottom: 12,
  },
  softwareName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  softwareDesc: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  startButton: {
    backgroundColor: '#006eff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 