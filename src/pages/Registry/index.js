import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Registry() {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeButton, setActiveButton] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isValidate, setIsValidate] = useState(false);

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const createProfile = response => {
        db().ref(`/users/${response.user.uid}`).set({ name, email, password });
    }

    const registerAndGotoMainflow = async () => {
        const isValidEmail = validateEmail();

        if (isValidEmail) {
            setIsValidate(true);
            if (email && password) {
                try {const response = await auth().createUserWithEmailAndPassword(
                    email, password
                );
                    if (response.user) {
                        await response.user.updateProfile({
                            displayName: name,
                        });

                        createProfile(response);

                        Alert.alert(`Bem-vindo, ${response.user.displayName || ''}!`);
                        navigation.navigate('SignIn');
                        await AsyncStorage.setItem('userToken', response.user.uid);

                    }
                } catch (e) {
                    Alert.alert('Erro com o cadastro')
                }
            } else {
                Alert.alert('Preencha todos os dados!')
            }
        } else {
            setIsValidate(false);
            Alert.alert('Endereço de e-mail inválido');
        }
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation='fadeInLeft' delay={500} style={styles.containerHeader}>
                <TouchableOpacity onPress={ () => navigation.navigate('SignIn')}>
                    <FontAwesomeIcon style={styles.icon} icon={faAngleLeft} size={24}/>
                </TouchableOpacity>
                <Text style={styles.message}>Cadastre-se</Text>
            </Animatable.View>

            <Animatable.View animation='fadeInUp' style={styles.containerForm}>

                <Text style={styles.title}>Primeiro nome</Text>
                <TextInput
                    placeholder='Digite seu nome...'
                    style={styles.input}
                    onChangeText={setName}
                    maxLength={12}
                />

                <Text style={styles.title}>Email</Text>
                <TextInput
                    placeholder='Digite seu email...'
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={45}
                />
                <Text style={styles.title}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder='Digite sua senha...'
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={30} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.titleNoticia}>Selecione uma notícia de preferência (opcional)</Text>

                <View style={styles.buttonContainer}>
                    {['Tecnologia', 'Ciência', 'Entretenimento', 'Negócios', 'Esportes', 'Saúde']
                        .map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.buttonSwitch,
                                    activeButton === category && styles.activeButton,
                                ]}
                                onPress={() => handleButtonClick(category)}
                            >
                                <Text style={[
                                    styles.buttonSwitchText,
                                    activeButton === category && styles.activeButton,
                                ]}
                                >{category}</Text>
                            </TouchableOpacity>
                        ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={registerAndGotoMainflow}>
                    <Text style={styles.buttonText}> Salvar </Text>
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
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    icon: {
        color: 'white', // Cor do ícone
        marginRight: 10, // Espaçamento à direita do ícone
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    containerForm: {
        backgroundColor: '#ffffff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title: {
        fontSize: 20,
        marginTop: 20
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16
    },
    button: {
        backgroundColor: '#538AE4',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonSwitch: {
        backgroundColor: 'rgba(83,138,228, 0.2)',
        borderRadius: 20,
        marginTop: 14,
        padding: 10,
    },
    buttonSwitchText: {
        fontWeight: 'bold',
        fontSize: 13,
        padding: 8,
        color: '#538AE4'
    },
    buttonContainer: {
        paddingLeft: 30,
        paddingRight: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    buttonRegisterText: {
        fontSize: 14,
        color: '#656464'
    },
    activeButton: {
        backgroundColor: '#538AE4', // Cor quando o botão está ativo
        color: '#ffffff',
        borderRadius: 15,
    },
    titleNoticia : {
        color: '#538AE4',
        fontSize: 16,
        marginTop: 20
    },
    eyeIconContainer: {
        paddingBottom: 30,
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
    },
})
