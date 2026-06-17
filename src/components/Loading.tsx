import React, {
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';

import fonts from '../constants/fonts';
import * as colors from '../styles/colors';

export default function LoadingModal({
  visible = false,
  title = 'Loading...',
}: any) {

  const scaleAnim =
    useRef(
      new Animated.Value(0.9),
    ).current;

  useEffect(() => {

    if (visible) {

      Animated.loop(
        Animated.sequence([
          Animated.timing(
            scaleAnim,
            {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            scaleAnim,
            {
              toValue: 0.9,
              duration: 700,
              useNativeDriver: true,
            },
          ),
        ]),
      ).start();
    }

  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={
              colors.APP_COLOR
            }
          />

          <Text style={styles.text}>
            {title}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: 110,
    height: 110,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },

  text: {
    marginTop: 10,
    fontSize: fonts.size._14px,
    fontFamily: fonts.name.medium,
    color: colors.APP_COLOR,
  },
});