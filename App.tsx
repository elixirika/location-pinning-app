import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { enableFreeze } from 'react-native-screens';
import Overview from './src/screens/Overview';
import store, {  persistor } from './src/redux/store';

enableFreeze(true);

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
        }
        persistor={persistor}
      >
        <Overview />
      </PersistGate>
    </Provider>
  );
}

export default App;
