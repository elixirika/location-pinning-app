import React from 'react';
import {View} from 'react-native';

interface BlockProps {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}
const Block: React.FC<BlockProps> = ({
  top = 0,
  bottom = 0,
  left = 0,
  right = 0,
}) => {
  return (
    <View
      style={{
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
        marginTop: top,
      }}
    />
  );
};

export default Block;
