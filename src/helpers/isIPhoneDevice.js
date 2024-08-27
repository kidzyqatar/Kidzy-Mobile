import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isIPhoneDevice = () => {
  const model = DeviceInfo.getModel();

  // List of models to exclude (iPhone SE 3rd generation)
  const excludedModels = ['iPhone SE (3rd generation)'];

  // Check if the device is an iPhone and not an excluded model
  return (
    Platform.OS === 'ios' &&
    model.includes('iPhone') &&
    !excludedModels.includes(model)
  );
};
