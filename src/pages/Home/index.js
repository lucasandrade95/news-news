import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {faCloud, faHome, faThermometer} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const apiKey = 'dbfc33cf0da8032e24a309882d951f8c';
let city = '6322752';
const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${apiKey}`;

export default function Home() {
    const navigation = useNavigation();
    const [previsaoTempo, setPrevisaoTempo] = useState(null);
    let [cidade, setCidade] = useState(null);

    const obterPrevisaoTempo = async () => {
        try {
            const response = await axios.get(apiUrl);
            const dadosClima = response.data.list[0].main;

            const temperaturaCelsius = dadosClima.temp - 273.15;
            setPrevisaoTempo({ ...dadosClima, temp: temperaturaCelsius });
            setCidade(response.data.city.name);
        } catch (error) {
            console.error('Erro ao obter dados do clima:', error);
        }
    };

    useEffect(() => {
        obterPrevisaoTempo(); // Chama a função na montagem do componente

        const intervalId = setInterval(() => {
            obterPrevisaoTempo(); // Chama a função a cada 3 minutos
        }, 2 * 60 * 1000); // 3 minutos em milissegundos

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                {previsaoTempo && (
                    <View style={styles.cidadeTempContainer}>
                        <Text style={styles.cidadeTempText}>
                            <Text style={styles.negrito}>{`${cidade}: `}</Text>
                            {`${previsaoTempo.temp.toFixed(0)} °C`}
                            <FontAwesomeIcon style={styles.icon} icon={faCloud} size={16} />

                        </Text>
                    </View>
                )}
                <Animatable.Image
                    animation='flipInY'
                    source={require('../../assets/news.png')}
                    style={{ width: '35%' }}
                    resizeMode='contain'
                />
            </View>
            <Animatable.View delay={600} animation='fadeInUp' style={styles.containerForm}>
                <Text style={styles.title}>Monitore e visualize as notícias de qualquer lugar.</Text>
                <Text style={styles.text}>Faça o Login para ter uma experiência personalizada</Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
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
    previsaoText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
    },
    cidadeTempContainer: {
        position: 'absolute',
        top: 55,
        right: 10,
        alignItems: 'flex-end',
    },
    cidadeTempText: {
        fontSize: 16,
        fontWeight: '500',
        flexDirection: 'row', // Para alinhar os textos na mesma linha
    },
    negrito: {
        fontWeight: 'bold',
    },
    icon :{
        marginLeft: 10
    }
});
