import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Pressable, SafeAreaView, View, Text } from 'react-native';


const KeyboardButton = (props) => {
    const {
        title,
        onClickHandler = () => {},
        stylesCustom = {},
        disabled = false,
      } = props;

    return (
        <Pressable style={styles.button} onPress={onClickHandler} disabled={disabled}>
            <Text style={[styles.text, stylesCustom]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#22252D",
        borderRadius: 10,
        margin: 6,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 28,
        color: "white",
      }
});

export default KeyboardButton;