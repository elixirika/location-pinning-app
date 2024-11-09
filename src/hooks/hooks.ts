import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

// dispatch function 
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Redux state with the correct type
export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;
