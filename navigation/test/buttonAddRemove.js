import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet } from 'react-native';

export default function WriteDownNote({ navigation }) {
  const [buttons, setButtons] = useState([]);

  const addNewButton = () => {
    const newButton = {
      id: buttons.length + 1,
      text: `Button ${buttons.length + 1}`,
    };

    setButtons((prevButtons) => [...prevButtons, newButton]);
  };

  const removeButton = (id) => {
    setButtons((prevButtons) => prevButtons.filter((button) => button.id !== id));
  };

  return (
    <View>
      <Button title="Add Button" onPress={addNewButton} />

      <ScrollView>
        {buttons.map((button) => (
          <View key={button.id}>
            <Button title={button.text} onPress={() => console.log(`Button ${button.id} pressed`)} />
            <Button title="Remove" onPress={() => removeButton(button.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};