import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const teacherProfiles = [
  { id: 1, name: 'John Doe', expertise: 'Mathematics', experience: 5 },
  { id: 2, name: 'Jane Smith', expertise: 'Science', experience: 3 },
];

export default function FilterScreen() {
  const [filteredTeachers, setFilteredTeachers] = useState(teacherProfiles);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const results = teacherProfiles.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeachers(results);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by name or expertise"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredTeachers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Expertise: {item.expertise}</Text>
            <Text>Experience: {item.experience} years</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
