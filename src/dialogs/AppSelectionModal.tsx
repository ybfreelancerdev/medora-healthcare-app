import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../constants/fonts';
import * as colors from '../styles/colors';

interface Props {
  visible: boolean;
  data: any[];
  value?: any;
  labelField?: string;
  valueField?: string;
  title?: string;
  onClose: () => void;
  onSelect: (item: any) => void;
}

export default function AppSelectionModal({
  visible,
  data = [],
  value,
  labelField = 'label',
  valueField = 'value',
  title = 'Select Item',
  onClose,
  onSelect,
}: Props) {

  const renderItem = ({
    item,
  }: any) => {

    const isSelected =
      item[valueField] === value;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.itemContainer,
          isSelected &&
            styles.selectedItemContainer,
        ]}
        onPress={() => {

          onSelect(item);
          onClose();
        }}
      >
        <Text
          style={[
            styles.itemText,
            isSelected &&
              styles.selectedItemText,
          ]}
        >
          {item[labelField]}
        </Text>

        {isSelected && (
          <Ionicons
            name="checkmark"
            size={18}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
        >
          <Text style={styles.title}>
            {title}
          </Text>

          <FlatList
            data={data}
            keyExtractor={(
              item,
              index,
            ) =>
              item[
                valueField
              ]?.toString() ||
              index.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={
              false
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalContainer: {
    maxHeight: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 15,
  },

  title: {
    fontSize: 16,
    marginBottom: 15,
    color: colors.titleColor,
    fontFamily: fonts.name.bold,
    textAlign: 'center',
  },

  itemContainer: {
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedItemContainer: {
    backgroundColor: colors.APP_COLOR,
  },

  itemText: {
    color: colors.Form_InputCOLOR,
    fontSize: fonts.size._14px,
    fontFamily: fonts.name.medium,
  },

  selectedItemText: {
    color: '#FFFFFF',
  },
});