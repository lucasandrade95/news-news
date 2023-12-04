import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";

export default  function Home() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation='flipInY'
                    source={require('../../assets/logo.png')}
                    style={{ width: '100%' }}
                    resizeMode='contain'
                />
            </View>
            <Animatable.View delay={600} animation='fadeInUp' style={styles.containerForm}>
                <Text style={styles.title}>Monitore, visualize as notícias de qualquer lugar</Text>
                <Text style={styles.text}>Faça o Login para ter uma experiências personalizada</Text>
                <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('SignIn')}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#538AE4',
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#538AE4',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12
    },
    text: {
        marginTop: 20,
        color: '#656464'
    },
    button: {
        position: 'absolute',
        backgroundColor: '#538AE4',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold'
    }
})
