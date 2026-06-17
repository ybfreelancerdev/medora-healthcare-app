import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { _SPLASH } from '../../constants';

type Props = { onFinish?: () => void; };

export default function SplashScreen({ onFinish }: Props) {
    useEffect(() => { 
        const timer = setTimeout(() => { 
            onFinish?.(); 
        }, 3000); 
        
        return () => clearTimeout(timer); 
    }, []);
    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content"/> 
            <ImageBackground source={_SPLASH} style={styles.backgroundImage} resizeMode="cover" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
    }, 
    backgroundImage: { 
        flex: 1, 
        width: '100%', 
        height: '100%', 
    },
});