import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../utils/colors';

interface CardProps {
  children: React.ReactNode;
  customStyle?: ViewStyle;
}

const Card: React.FC<CardProps> = ({children, customStyle}) => {
  return (
    <View style={[styles.card, customStyle]}>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: Colors.active,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
    flex: 1,
    margin: 5,
    padding: 10,
    borderColor: Colors.active,
    borderWidth: 0.2,
    marginHorizontal: 15,
  },
  cardContent: {
    padding: 16,
  },
});

export default Card;
