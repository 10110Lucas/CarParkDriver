import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    Animated,
    Keyboard,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import Services from '../services/Services';

export default class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: 'locatario@park.com',
            password: '123456',
            showPassword: true,
            showPasswordImage: require('../images/showPasswordTrue.png'),
            permissao: false
        }

        Services.logout2();
    }

    componentDidMount(){
        this.verificarPermissao();
    }

    verificarPermissao = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão de Localização',
                    message: 'Esse aplicativo precisa da permissão de sua localização.',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) this.setState({ permissao: true });
            else this.setState({ permissao: false });

        } catch (err) {
            console.log('Erro de permissão de localização: '+err);
            return;
        }
    }

    passwordShow = () => {
        let images = !this.state.showPassword ? require('../images/showPasswordTrue.png') : require('../images/showPasswordFalse.png');
        this.setState({
            showPassword: !this.state.showPassword,
            showPasswordImage: images
        });
    }

    login = async () => {
        const { email, password } = this.state;
        let valido = false;
        try{
            valido = await Services.login(email, password);

            if (valido)
                this.props.navigation.navigate('Logando');

        } catch(err){
            console.log(err);
        }
    }

    
    render(){
        return (
            <this.LoginEfeito />
        );
    }

    LoginEfeito = () => {

        const [offset] = useState(new Animated.ValueXY({x: 0, y: 395})); // y: 95
        const [opacity] = useState(new Animated.Value(0));
        const [logo] = useState(new Animated.Value(1.5))
    
        useEffect(()=> {
            Keyboard.addListener('keyboardDidShow', KeyboardDidShow);
            Keyboard.addListener('keyboardDidHide', KeyboardDidHide);
        
            Animated.parallel([
                Animated.spring(offset.y, {
                    toValue: 0,
                    speed: 4,
                    bounciness: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }, []);
    
        function KeyboardDidShow(){
            Animated.parallel([
                Animated.timing(logo, {
                toValue: 1.0,
                duration: 200,
                useNativeDriver: true,
                }),
            ]).start();
        }
        function KeyboardDidHide(){
            Animated.parallel([
                Animated.timing(logo, {
                toValue: 1.5,
                duration: 200,
                useNativeDriver: true,
                }),
            ]).start();
        }

        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>

                <LinearGradient colors={['#A31AFF', '#7a00cc', '#4C0080']} style={styles.container}>

                    <View style={styles.containerImg}>
                        <Animated.Image 
                        style={[{
                            transform: [{ scale: logo }]
                        }]}
                        source={require('../images/Car_logo.png')}
                        />
                    </View>

                    <Animated.View 
                    style={[
                        styles.containerLogin,
                        {
                            opacity: opacity,
                            transform: [
                                { translateY: offset.y }
                            ]
                        }
                    ]}
                    >
                        <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        autoFocus={false}
                        maxLength={40}
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        />
                        <View style={styles.containerPassword}>
                            <TextInput
                            style={styles.inputPassword}
                            placeholder='Senha'
                            secureTextEntry={this.state.showPassword}
                            maxLength={15}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                            />
                            <TouchableOpacity
                            style={styles.btnShowPassword}
                            onPress={this.passwordShow}
                            >
                                <Image style={styles.btnPasswordImage} source={this.state.showPasswordImage} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                        style={styles.btnAcessar}
                        onPress={ this.login }
                        >
                            <LinearGradient
                            colors={['#a31aff', '#7a00cc', '#4c0080']}
                            style={styles.btnAcessarCores}
                            >
                                <Text style={styles.btnAcessarText}>Acessar</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.containerCadastro}>
                            <Text style={styles.txtPergunta}>Não possui conta?</Text>
                            <TouchableOpacity
                            style={styles.btnCadastro}
                            onPress={()=>this.props.navigation.navigate('Conta')}
                            >
                                <LinearTextGradient
                                locations={[0, 1]}
                                colors={["#a31aff", "#4c0080"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.btnCadastroText}
                                >                        
                                    <Text>
                                        Cadastre-se
                                    </Text>
                                </LinearTextGradient>
                            </TouchableOpacity>                       
                        </View>
                    </Animated.View>
                </LinearGradient>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    containerImg: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 70,
    },
    containerLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        // marginBottom: 200,
        paddingTop: 40,
        paddingBottom: 40,
        borderRadius: 5,
        elevation: 7,
        backgroundColor: '#FFF'
    },
    input: {
        letterSpacing: 1,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#CCC',
        borderRadius: 25,
        width: '90%',
        marginBottom: 10,
        padding: 10,
        paddingHorizontal: 20,
        fontSize: 17,
        backgroundColor: '#FFF'
    },
    containerPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#CCC',
        borderRadius: 25,
        width: '90%',
        marginBottom: 10,
        paddingHorizontal: 13,
        backgroundColor: '#FFF'
    },
    inputPassword: {
        letterSpacing: 2,
        width: '90%',
        fontSize: 17,
    },
    btnShowPassword: {
        padding: 1,
        marginLeft: -5,
        backgroundColor: 'transparent'
    },
    btnPasswordImage: {
        height: 35,
        width: 35,
    },
    btnAcessar: {
        height: 45,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        elevation: 5
    },
    btnAcessarCores: {        
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    btnAcessarText: {
        letterSpacing: 2,
        color: '#FFF',
        fontSize: 20
    },
    containerCadastro: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    txtPergunta: {
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        color: '#888',
        letterSpacing: 1
    },
    btnCadastro: {
        backgroundColor: 'transparent',
    },
    btnCadastroText: {
        fontSize: 17,
        letterSpacing: 1.2,
        borderBottomWidth: 0.8,
        borderBottomColor: '#A31AFF'
        // color: '#A31AFF'
    }
});