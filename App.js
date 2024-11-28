import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const teacherProfiles = [
  {
    id: 1,
    name: 'John Doe',
    expertise: 'Mathematics',
    experience: 5,
    video: 'https://www.youtube.com/watch?v=cF1Na4AIecM',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s',
  },
  {
    id: 2,
    name: 'Jane Smith',
    expertise: 'Science',
    experience: 3,
    video: 'https://www.youtube.com/watch?v=KEG7b851Ric',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjZpcs7lV0d1q9XHSUwHyo2XziVwQclx4T5QdtuxvnOL0wzrOg58-1tZk1-Eo50DvJ57g&usqp=CAU',
  },
];

export default function App() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleAccept = async () => {
    await savePreference('Accepted', teacherProfiles[currentProfileIndex]);
    goToNextProfile();
  };

  const handleReject = async () => {
    await savePreference('Rejected', teacherProfiles[currentProfileIndex]);
    goToNextProfile();
  };

  const goToNextProfile = () => {
    if (currentProfileIndex < teacherProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      alert('End of profiles!');
    }
  };

  const savePreference = async (status, profile) => {
    try {
      const preferences = JSON.parse(await AsyncStorage.getItem('preferences')) || [];
      preferences.push({ ...profile, status });
      await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const currentProfile = teacherProfiles[currentProfileIndex];

  return (
    <View style={styles.container}>
      {currentProfile ? (
        <View style={styles.card}>
          <Image source={{ uri: currentProfile.image }} style={styles.image} />
          <Text style={styles.name}>{currentProfile.name}</Text>
          <Text>Expertise: {currentProfile.expertise}</Text>
          <Text>Experience: {currentProfile.experience} years</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>No more profiles!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
