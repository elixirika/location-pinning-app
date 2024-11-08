import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../utils/colors';
import {CardProps} from '../types/types';

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
    shadowColor: Colors.darkDefault,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flex: 1,
    margin: 5,
  },
  cardContent: {
    padding: 16,
  },
});

export default Card;
