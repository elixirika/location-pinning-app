import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {Colors} from '../utils/colors';

interface SvgProps {
  fill?: string;
  viewBox?: string;
  height?: string;
  width?: string;
  path: string;
}

const CustomSvg: React.FC<SvgProps> = ({
  fill = Colors.active,
  viewBox = '0 -960 960 960',
  height = '25px',
  width = '25px',
  path,
}) => (
  <Svg viewBox={viewBox} height={height} width={width} fill={fill}>
    <Path d={path} />
  </Svg>
);

export default CustomSvg;
