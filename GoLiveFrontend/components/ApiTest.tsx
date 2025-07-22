import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import authService from '../services/authService';
import streamService from '../services/streamService';
import userService from '../services/userService';

export default function ApiTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCreatedUser, setLastCreatedUser] = useState<{username: string, password: string} | null>(null);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const result = await authService.test();
      addResult(`✅ Auth endpoints test: ${result}`);
    } catch (error: any) {
      addResult(`❌ Auth endpoints test failed: ${error.message}`);
      addResult(`   Status: ${error.response?.status || 'Unknown'}`);
      addResult(`   Data: ${JSON.stringify(error.response?.data || error.message)}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const testUser = {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'testpass123'
      };
      
      addResult(`🔄 Attempting signup with: ${testUser.username}`);
      const result = await authService.signup(testUser);
      addResult(`✅ Signup test: ${result.message}`);
      
      // Store the created user credentials for login test
      setLastCreatedUser({
        username: testUser.username,
        password: testUser.password
      });
      addResult(`📝 Stored credentials for login test: ${testUser.username}`);
    } catch (error: any) {
      addResult(`❌ Signup test failed: ${error.message}`);
      addResult(`   Status: ${error.response?.status || 'Unknown'}`);
      addResult(`   Data: ${JSON.stringify(error.response?.data || error.message)}`);
      if (error.response?.data) {
        addResult(`   Full response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      if (!lastCreatedUser) {
        addResult(`❌ Login test failed: No user created yet. Run signup test first.`);
        return;
      }
      
      addResult(`🔄 Attempting login with: ${lastCreatedUser.username} / ${lastCreatedUser.password}`);
      const result = await authService.login({
        username: lastCreatedUser.username,
        password: lastCreatedUser.password
      });
      addResult(`✅ Login test: ${result.message}`);
    } catch (error: any) {
      addResult(`❌ Login test failed: ${error.message}`);
      addResult(`   Status: ${error.response?.status || 'Unknown'}`);
      addResult(`   Data: ${JSON.stringify(error.response?.data || error.message)}`);
      if (error.response?.data) {
        addResult(`   Full response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testStreams = async () => {
    setLoading(true);
    try {
      const streams = await streamService.getStreams();
      addResult(`✅ Streams test: Found ${streams.length} streams`);
    } catch (error: any) {
      addResult(`❌ Streams test failed: ${error.message}`);
      addResult(`   Status: ${error.response?.status || 'Unknown'}`);
      addResult(`   Data: ${JSON.stringify(error.response?.data || error.message)}`);
    } finally {
      setLoading(false);
    }
  };

  const testCategories = async () => {
    setLoading(true);
    try {
      const categories = await streamService.getCategories();
      addResult(`✅ Categories test: Found ${categories.length} categories`);
    } catch (error: any) {
      addResult(`❌ Categories test failed: ${error.message}`);
      addResult(`   Status: ${error.response?.status || 'Unknown'}`);
      addResult(`   Data: ${JSON.stringify(error.response?.data || error.message)}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      addResult(`🔄 Testing basic connection to backend...`);
      // Try a simple fetch to see if the server is reachable
      const response = await fetch('http://100.66.109.16:8080/api/auth/test');
      const text = await response.text();
      addResult(`✅ Connection test: ${text}`);
      addResult(`   Status: ${response.status}`);
    } catch (error: any) {
      addResult(`❌ Connection test failed: ${error.message}`);
      addResult(`   This might be a network connectivity issue`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Basic Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testAuthEndpoint}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Auth Endpoint</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testStreams}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Streams</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testCategories}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
        {testResults.length === 0 && (
          <Text style={styles.noResults}>No tests run yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#006eff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#006eff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  clearButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  resultText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  noResults: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 