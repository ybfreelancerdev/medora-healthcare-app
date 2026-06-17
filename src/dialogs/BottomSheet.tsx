import React, { useRef, useEffect, useState } from 'react';
import {
    Modal,
    View,
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    LayoutChangeEvent,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomSheetModal({
    visible,
    onClose,
    children,
    heightPercent,
    sticky = false,
}: any) {

    const insets = useSafeAreaInsets();

    const screenHeight =
        Dimensions.get(
            'window',
        ).height;

    const [contentHeight,
        setContentHeight] =
        useState(0);

    const keyboardHeight =
        useRef(
            new Animated.Value(0),
        ).current;

    const sheetHeight = heightPercent + insets.bottom;

    const translateY =
        useRef(
            new Animated.Value(
                screenHeight,
            ),
        ).current;

    useEffect(() => {

        const showSubscription =
            Keyboard.addListener(
                'keyboardDidShow',
                event => {

                    Animated.timing(
                        keyboardHeight,
                        {
                            toValue:
                                event.endCoordinates
                                    .height,
                            duration: 250,
                            useNativeDriver: true,
                        },
                    ).start();
                },
            );

        const hideSubscription =
            Keyboard.addListener(
                'keyboardDidHide',
                () => {

                    Animated.timing(
                        keyboardHeight,
                        {
                            toValue: 0,
                            duration: 250,
                            useNativeDriver: true,
                        },
                    ).start();
                },
            );

        return () => {

            showSubscription.remove();
            hideSubscription.remove();
        };

    }, []);

    useEffect(() => {
        if (visible) {
            Animated.spring(
                translateY,
                {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                },
            ).start();
        } else {
            Animated.timing(
                translateY,
                {
                    toValue: screenHeight,
                    duration: 220,
                    useNativeDriver: true,
                },
            ).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder:
                () => true,
            onMoveShouldSetPanResponder:
                (_, gesture) => {

                    return (
                        gesture.dy > 2
                    );
                },

            onPanResponderMove:
                (_, gesture) => {

                    if (gesture.dy > 0) {

                        translateY.setValue(
                            gesture.dy,
                        );
                    }
                },

            onPanResponderRelease:
                (_, gesture) => {

                    const shouldClose =
                        gesture.dy >
                        sheetHeight *
                        0.25 ||
                        gesture.vy > 0.8;

                    if (
                        shouldClose &&
                        !sticky
                    ) {

                        Animated.timing(
                            translateY,
                            {
                                toValue:
                                    sheetHeight,
                                duration: 220,
                                useNativeDriver: true,
                            },
                        ).start(() => {

                            onClose?.();
                        });

                    } else {

                        Animated.spring(
                            translateY,
                            {
                                toValue: 0,
                                useNativeDriver: true,
                                bounciness: 0,
                            },
                        ).start();
                    }
                },
        }),
    ).current;

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Backdrop */}
                <TouchableWithoutFeedback
                    onPress={onClose}
                >
                    <View
                        style={styles.backdrop}
                    />
                </TouchableWithoutFeedback>

                {/* Bottom Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            // maxHeight: screenHeight * 0.75,
                            height: Math.min(contentHeight, screenHeight * 0.70),
                            transform: [
                                {
                                    translateY:
                                        Animated.subtract(
                                            translateY,
                                            Animated.multiply(
                                                keyboardHeight,
                                                0.45,
                                            ),
                                        )
                                },
                            ],
                        },
                    ]}
                >

                    {/* Drag Handle */}
                    <View
                        {...panResponder.panHandlers}
                        style={styles.dragArea}
                    >
                        <View
                            style={styles.handle}
                        />
                    </View>

                    {/* Content */}
                    <View
                        onLayout={(
                            event:
                                LayoutChangeEvent,
                        ) => {

                            const height =
                                event.nativeEvent
                                    .layout.height;

                            setContentHeight(
                                height + 50,
                            );
                        }}
                        style={{
                            flexShrink: 1,
                            paddingBottom: insets.bottom
                        }}
                    >
                        {children}
                    </View>

                </Animated.View>
            </View>
        </Modal>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
        },

        sheet: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: 'hidden',
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },

        dragArea: {
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },

        handle: {
            width: 60,
            height: 5,
            borderRadius: 999,
            backgroundColor: '#CBD5E1',
        },
    });