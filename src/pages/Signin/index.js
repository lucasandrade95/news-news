import React, {useEffect, useState, FlatList, useCallback} from 'react';
import {View,Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUserCircle, faEyeSlash, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {WebView} from "react-native-webview";
import db from "@react-native-firebase/database";

export default function SignIn() {

    const pageSize = 10; // Defina o tamanho desejado
    const [currentPage, setCurrentPage] = useState(1);

    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [news, setNews] = useState([]);
    const [activeButton, setActiveButton] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNewsUrl, setSelectedNewsUrl] = useState('');
    const [isValidate, setIsValidate] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [userData, setUserData] = useState(null);

    const apiKey = '8b29ab9840864132a8dc59c270111d17';
    // const apiKey = 'abe34e5bd8c3473abacf2eadac15e7bc';

    const handleNewsClick = (url) => {
        setSelectedNewsUrl(url);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const toggleExpand = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const registerAndGotoMainflow = async () => {

        const isValidEmail = validateEmail();

        if (isValidEmail) {
            setIsValidate(true);
            if (email && password.length < 6) {
                Alert.alert('A senha tem que ter no mínimo 6 caracteres');
            } else if (email && password) {
                try {
                    const response = await auth().signInWithEmailAndPassword(email, password);
                    setUser(response.user);
                    await AsyncStorage.setItem('userToken', response.user.uid);
                    Alert.alert('Bem-vindo!');

                    await getUserCategory(response.user.uid);

                    setIsExpanded(false);
                    navigation.navigate('Home');
                } catch (error) {
                    Alert.alert('Não cadastrado!');
                    navigation.navigate('Registry');
                }
            } else {
                Alert.alert('Preencha os dados corretamente');
            }
        } else {
            setIsValidate(false);
            Alert.alert('Endereço de e-mail inválido');
        }
    };


    const getUserCategory = async (uid) => {
        try {
            const snapshot = await db().ref(`/users/${uid}`).once('value');
            if (snapshot.exists()) {
                const userDataFromSnapshot = snapshot.val();
                console.log('Informações do usuário:', userDataFromSnapshot);

                // Certifique-se de que 'userData' está definido
                if (userDataFromSnapshot) {
                    const newsCategory = userDataFromSnapshot.newsCategory;
                    setSelectedCategory(newsCategory);
                    setUserData(userDataFromSnapshot);
                    console.log('Categoria da notícia:', newsCategory);
                } else {
                    console.log('Dados do usuário não encontrados no banco de dados');
                }
            } else {
                console.log('Usuário não encontrado no banco de dados');
            }
        } catch (error) {
            console.error('Erro ao obter informações do usuário:', error);
        }
    };



    const handleLogout = async () => {
        try {
            Alert.alert('Saiu com sucesso!');
            await auth().signOut();
            setUser(null);
            await AsyncStorage.removeItem('userToken');
            setIsExpanded(false);

            navigation.navigate('Home');

        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleButtonClick = async (button) => {
        setSelectedCategory(button);
        const newsData = await fetchNewsByCategory(button, currentPage, pageSize);
        setNews(newsData);
    };


    const fetchNewsByCategory = async (category, page = 1, pageSize = 10) => {
        switch (category) {
            case 'Tecnologia':
                return fetchNewsTecnologia(page, pageSize);
            case 'Ciência':
                return fetchNewsCiencia(page, pageSize);
            case 'Saúde':
                return fetchNewsSaude(page, pageSize);
            case 'Negócios':
                return fetchNewsNegocios(page, pageSize);
            case 'Esportes':
                return fetchNewsEsportes(page, pageSize);
            case 'Entretenimento':
                return fetchNewsEntretenimento(page, pageSize);
            default:
                return [];
        }
    };

    const fetchNewsTecnologia = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=technology&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };
    const fetchNewsCiencia = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=science&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };
    const fetchNewsSaude = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=health&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };
    const fetchNewsNegocios = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=business&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };
    const fetchNewsEsportes = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=sports&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };
    const fetchNewsEntretenimento = async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=br&category=entertainment&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
            );

            if (response.data && response.data.articles) {
                return response.data.articles;
            } else {
                console.error('Resposta da API não contém a propriedade esperada:', response);
                return [];
            }
        } catch (error) {
            console.error('Erro ao obter notícias:', error);
            return [];
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const truncateLink = (link, maxLength) => {
        if (link.length > maxLength) {
            return link.substring(0, maxLength) + '....';
        }
        return link;
    };

    const getUserData = async () => {
        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const uid = currentUser.uid;
                const snapshot = await db().ref(`/users/${uid}`).once('value');

                // Verificar se o usuário tem dados no banco de dados
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log('Informações do usuário:', userData);

                    // Agora você pode acessar a categoria da notícia
                    const newsCategory = userData.newsCategory;
                    setSelectedCategory(newsCategory);

                    console.log('Categoria da notícia:', newsCategory);
                } else {
                    console.log('Usuário não encontrado no banco de dados');
                }
            } else {
                console.log('Nenhum usuário autenticado');
            }
        } catch (error) {
            console.error('Erro ao obter informações do usuário:', error);
        }
    };


    const checkUserLoggedIn = async () => {
        const currentUser = auth().currentUser;
        console.log(currentUser);

        if (currentUser) {
            setUser(currentUser);
            const newsData = await fetchNewsByCategory(selectedCategory, currentPage, pageSize);
            setNews(newsData);
        }
    };


    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const newsData = await fetchNewsByCategory(selectedCategory, currentPage, pageSize);
                    setNews(newsData);
                } catch (error) {
                    console.error('Erro ao obter notícias:', error);
                }
            };

            fetchData();

            return () => {
                // Cleanup (se necessário)
            };
        }, [selectedCategory])
    );

    useEffect(() => {
        console.disableYellowBox = true;

        getUserData();

        fetchNewsByCategory('', currentPage, pageSize)
            .then((newsData) => setNews(newsData));

        checkUserLoggedIn();
    }, []);



    return (
        <View style={styles.container}>

            {/*Título*/}
            <Animatable.View animation='fadeInLeft' delay={500} style={styles.containerHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <FontAwesomeIcon style={styles.icon} icon={faHome} size={28} />
                </TouchableOpacity>
                <Text style={styles.titlePrincipal}>Notícias</Text>
                <TouchableOpacity onPress={toggleExpand}>
                    <FontAwesomeIcon style={styles.icon} icon={faUserCircle} size={28} />
                </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation='fadeInUp' style={styles.containerForm}>
                {/*Login*/}
                {isExpanded && (
                    <View style={styles.login}>
                        {user && (
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutButtonText}>
                                    {` Sair da sua conta?`}</Text>
                            </TouchableOpacity>
                        )}
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
                        <TextInput
                            placeholder='Digite sua senha...'
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={registerAndGotoMainflow}>
                            <Text style={styles.buttonText}> Acessar </Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainerUser}>
                            <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Registry')}>
                                <Text style={styles.buttonRegisterText}> Cadastrar </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {user && (
                    <Text style={{marginBottom: 5}}>{`Bem-vindo, ${user.displayName || 'Usuário'}`}</Text>
                )}


                <Text style={styles.titleButtons}> Selecione uma notícia de sua preferência </Text>

                <View style={styles.buttonContainer}>

                    {['Tecnologia', 'Ciência', 'Saúde', 'Negócios', 'Esportes', 'Entretenimento']
                        .map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.buttonSwitch,
                                    selectedCategory === category && styles.activeButton,
                                    { width: '30%' },
                                ]}
                                onPress={() => handleButtonClick(category)}
                            >
                                <Text style={[
                                    styles.buttonSwitchText,
                                    selectedCategory === category && styles.activeButton,
                                ]}
                                >{category}</Text>
                            </TouchableOpacity>
                        ))}


                </View>
                <ScrollView>
                    {news ? (
                        <View style={styles.newsGrid}>
                            {news.map((article, index) => (
                                <View key={index} style={styles.newsContainer}>
                                    <Text style={styles.newsTitle}>{article.title}</Text>
                                    {article.urlToImage && (
                                        <Image source={{ uri: article.urlToImage }} style={styles.newsImage} />
                                    )}
                                    <Text style={styles.newsDescription}>{article.description}</Text>
                                    {/* Adicione um botão/link para abrir a URL da notícia */}
                                    <TouchableOpacity onPress={() => handleNewsClick(article.url)}>
                                        <Text style={styles.newsUrl}>{truncateLink(article.url, 150)}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </ScrollView>
                <Modal
                    isVisible={modalVisible}
                    onBackdropPress={closeModal}
                    animationIn="slideInUp"
                    style={{ overflow: 'hidden' }}>
                    <View style={{ flex: 1, maxHeight: 750, borderRadius: 20, overflow: 'hidden' }}>
                        <WebView source={{ uri: selectedNewsUrl }} style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <FontAwesomeIcon icon={faTimes} style={styles.closeIcon} size={20}/>
                        </TouchableOpacity>
                    </View>
                </Modal>


            </Animatable.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#538AE4',
    },
    titlePrincipal : {
        color: 'white',
        fontSize: 28,
        marginBottom: -5,
        fontWeight: 'bold'
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    icon: {
        color: 'white',
        marginLeft: 10,
    },
    login : {
        paddingBottom: 50,
    },
    containerForm: {
        backgroundColor: '#ffffff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#538AE4',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    buttonRegisterText: {
        fontSize: 15,
        color: '#656464',
    },
    newsContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: '46%',
    },
    newsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    newsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    newsDescription: {
        fontSize: 14,
        marginBottom: 5,
    },
    newsUrl: {
        fontSize: 12,
        color: 'blue',
    },
    newsImage: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
    },

    scrollViewContent: {
        flexDirection: 'column',
    },

    buttonSwitch: {
        backgroundColor: 'rgba(83,138,228, 0.2)',
        maxWidth: '30%',
        borderRadius: 30,
        fontSize: 10,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSwitchText: {
        fontWeight: "600",
        fontSize: 13,
        padding: 8,
        color: '#538AE4',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    activeButton: {
        backgroundColor: '#538AE4',
        color: '#ffffff',
        borderRadius: 15,
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingTop: 70,
        paddingRight: 10,
    },
    logoutButton: {
        backgroundColor: '#c04a4a',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleButtons : {
        color: '#538AE4'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        borderRadius: 50, // Valor grande para garantir uma borda circular
        borderWidth: 2, // Largura da borda
        borderColor: '#007BFF', // Cor azul (ajuste conforme necessário)
        backgroundColor: 'white', // Cor de fundo para garantir que a borda seja visível
    },
    closeIcon: {
        fontSize: 20,
        color: '#007BFF', // Cor azul (ajuste conforme necessário)
    },
    buttonContainerUser : {
        flexDirection: 'row', // Isso define a direção do eixo principal como "row", colocando os itens lado a lado
        marginTop: 20,
        justifyContent: 'center'
    }
});
