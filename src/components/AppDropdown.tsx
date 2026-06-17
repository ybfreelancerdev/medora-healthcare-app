import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as colors from '../styles/colors';
import fonts from '../constants/fonts';
import AppSelectionModal from '../dialogs/AppSelectionModal';

const AppDropdown = ({
  label,
  value,
  data = [],
  onSelect,
  placeholder = 'Select',
  error,
  touched,
  icon,
  containerStyle,
  dropdownStyle,
  labelField = 'label',
  valueField = 'value',
  disabled = false,
}: any) => {

  const [visible, setVisible] = useState(false);
  const selectedLabel = value
      ? value[labelField]
      : '';

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      {/* LABEL */}
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      {/* DROPDOWN */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={[
          styles.dropdownWrapper,
          dropdownStyle,
          error &&
            touched &&
            styles.errorBorder,
          disabled && {
            backgroundColor:
              colors.Form_DisabledColor,
          },
        ]}
        onPress={() =>
          setVisible(true)
        }
      >
        {/* LEFT */}
        <View style={styles.leftContainer}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={
                error &&
                touched
                  ? colors.Form_ErrorColor
                  : colors.FormIcon_COLOR
              }
              style={styles.icon}
            />
          )}

          <Text
            style={[
              styles.valueText,
              !selectedLabel &&
                styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedLabel ||
              placeholder}
          </Text>
        </View>

        {/* RIGHT ICON */}
        <MaterialIcons
          name={
            visible
              ? 'keyboard-arrow-up'
              : 'keyboard-arrow-down'
          }
          size={24}
          color={
            colors.FormIcon_COLOR
          }
        />
      </TouchableOpacity>

      {/* ERROR */}
      {error && touched && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {/* MODAL */}
      <AppSelectionModal
        visible={visible}
        title="Select City"
        data={data}
        value={value?.value}
        labelField={labelField}
        valueField={valueField}
        onClose={() =>
          setVisible(false)
        }
        onSelect={item =>
          onSelect(item)
        }
      />
      {/* <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() =>
            setVisible(false)
          }
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={data}
              keyExtractor={(
                item,
                index,
              ) =>
                item[valueField]?.toString() ||
                index.toString()
              }
              renderItem={renderItem}
              showsVerticalScrollIndicator={
                false
              }
            />
          </View>
        </TouchableOpacity>
      </Modal> */}
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 15,
  },

  label: {
    fontFamily: fonts.name.medium,
    fontSize: fonts.size._14px,
    marginBottom: 5,
    color: colors.Form_InputLableCOLOR,
  },

  dropdownWrapper: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.Form_BorderColor,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 8,
  },

  valueText: {
    flex: 1,
    color: colors.Form_InputCOLOR,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
  },

  placeholderText: {
    color: colors.Form_PlaceholderColor,
  },

  errorBorder: {
    borderColor: colors.Form_ErrorColor,
  },

  errorText: {
    color: colors.Form_ErrorColor,
    marginTop: 4,
    fontFamily: fonts.name.regular,
    fontSize: fonts.size._10px,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalContainer: {
    maxHeight: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 15,
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