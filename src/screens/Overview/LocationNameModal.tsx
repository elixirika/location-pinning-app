import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors} from '../../utils/colors';

interface LocationNameModalProps {
  visible: boolean;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  backgroundColor: string;
  textColor: string;
}

const LocationNameModal: React.FC<LocationNameModalProps> = ({
  visible,
  onSubmit,
  onCancel,
  backgroundColor,
  textColor,
}) => {
  const [name, setName] = useState('');

  const handleNameChange = (text: string) => setName(text);

  const handleSubmit = () => {
    onSubmit(name);
    setName('');
  };

  const handleCancel = () => {
    onCancel();
    setName('');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="none">
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[styles.modalContent, {backgroundColor: backgroundColor}]}>
              <Text style={[styles.modalTitle, {color: textColor}]}>
                Add Location Name
              </Text>
              <TextInput
                style={[styles.input]}
                placeholder="Location Name"
                value={name}
                onChangeText={handleNameChange}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  color={Colors.danger}
                />
                <Button
                  title="Save"
                  onPress={handleSubmit}
                  color={Colors.active}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: Colors.inactive,
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LocationNameModal;
