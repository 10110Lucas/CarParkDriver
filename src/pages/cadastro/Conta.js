import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import Services from '../../services/Services';

export default class Conta extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            passwordConf: '',
            passwordConfAux: true,
            showPassword: true,
            showPasswordImage: require('../../images/showPasswordTrue.png'),
            showPassword2: true,
            showPasswordImage2: require('../../images/showPasswordTrue.png'),
        }
    }

    criarConta = () => {
        let valido = false;
        
        if (this.inputsValidos()){
            let objeto = { email: this.state.email.trim(), password: this.state.password };
            valido = Services.adicionarConta(objeto);
            if (valido){
                this.props.navigation.navigate('Contato');
            }
            else return;
        }
        else alert('Ainda restam campos vazios, preencha-os para realizar o cadastro!');
    }

    limpeza = () => {
        this.setState({
            email: '',
            password: '',
            passwordConf: '',
            passwordConfAux: true,
            showPassword: true,
            showPasswordImage: require('../../images/showPasswordTrue.png'),
            showPassword2: true,
            showPasswordImage2: require('../../images/showPasswordTrue.png'),
        })
    }

    inputsValidos = () => {
        let valido = true;
        if (!this.state.email){
            this.setState({email: false});
            valido = false;
        }
        if (!this.state.password){
            this.setState({password: false});
            valido = false;
        }
        if (this.state.password.length < 6){
            this.setState({password: false});
            valido = false;
        }
        if (!this.state.passwordConf){
            this.setState({passwordConf: false});
            valido = false;
        }
        if (!this.validarSenhas()){
            valido = false;
        }
        return valido;
    }

    validarSenhas = () => {
        if(this.state.password === this.state.passwordConf){
            this.setState({passwordConfAux: true})
            return true;
        }
        else {
            if(this.state.password !== false)
                this.setState({passwordConfAux: false})
            return false;
        }
    }

    passwordShow = () => {
        let img = !this.state.showPassword ? require('../../images/showPasswordTrue.png') : require('../../images/showPasswordFalse.png');
        this.setState({
            showPassword: !this.state.showPassword,
            showPasswordImage: img
        });
    }
    passwordConfShow = () => {
        let img = !this.state.showPassword2 ? require('../../images/showPasswordTrue.png') : require('../../images/showPasswordFalse.png');
        this.setState({
            showPassword2: !this.state.showPassword2,
            showPasswordImage2: img
        });
    }

    render(){
        return (
            <View style={styles.container}>
                
                {/* 
                <TouchableOpacity 
                    style={{alignSelf: 'flex-start', margin: 20}}
                    onPress={this.voltarLogin}
                >
                    <Image style={{width:35, height: 35}} source={require('../img/voltar.png')}/>
                </TouchableOpacity>

                <LinearTextGradient
                locations={[0, 1]}
                colors={["#a31aff", "#4c0080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{marginBottom:20}}
                >
                    <Text style={{fontSize: 20, fontFamily: 'roboto-regular'}}>CRIAR CONTA</Text>
                </LinearTextGradient>
                */}

                {this.state.email !== false ? null : <Text style={styles.textValidation}>Email precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                placeholder='Digite Seu E-mail'
                autoCapitalize='none'
                autoCompleteType='email'
                autoCorrect={false}
                autoFocus={true}
                maxLength={40}
                value={String(this.state.email === false ? '' : this.state.email)}
                onChangeText={(email)=> this.setState({email})}
                />

                {/* -------------------------------------------------------------------------------------------------------------------- */}
                {this.state.password !== false ? null : <Text style={styles.textValidation}>Senha precisa ser preenchido</Text>}
                <View style={styles.containerPassword}>
                    <TextInput
                    style={styles.inputPassword}
                    placeholder='Senha: entre 6 a 15 caracteres'
                    secureTextEntry={this.state.showPassword}
                    maxLength={15}
                    value={String(this.state.password === false ? '' : this.state.password)}
                    onChangeText={(password)=>{this.setState({password})}}
                    />
                    <TouchableOpacity
                    style={styles.btnShowPassword}
                    onPress={this.passwordShow}
                    >
                        <Image style={styles.btnPasswordImage} source={this.state.showPasswordImage} />
                    </TouchableOpacity>
                </View>
                
                {this.state.passwordConf !== false ? null : <Text style={styles.textValidation}>Confirme sua nova senha</Text>}
                {this.state.passwordConfAux !== false ? null : <Text style={styles.textValidation}>Senhas diferentes</Text>}
                <View style={styles.containerPassword}>
                    <TextInput
                    style={styles.inputPassword}
                    placeholder='Confirmar Senha'
                    secureTextEntry={this.state.showPassword2}
                    maxLength={15}
                    value={String(this.state.passwordConf === false ? '' : this.state.passwordConf)}
                    onChangeText={(passwordConf)=>{this.setState({passwordConf})}}
                    />
                    <TouchableOpacity
                    style={styles.btnShowPassword}
                    onPress={this.passwordConfShow}
                    >
                        <Image style={styles.btnPasswordImage} source={this.state.showPasswordImage2} />
                    </TouchableOpacity>
                </View>
                {/* -------------------------------------------------------------------------------------------------------------------- */}
                <TouchableOpacity
                style={styles.btnCadastrar}
                onPress={ this.criarConta }
                >
                    <LinearGradient
                        style={styles.btnCadastrarGradiente}
                        colors={['#a31aff', '#7a00cc', '#4c0080']}
                    >
                        <Text style={styles.btnCadastrarText}>Cadastrar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',        
    },
    input: {
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
    textValidation: {
        alignSelf: 'flex-start',
        marginLeft: '10%',
        color: '#F55',
        fontWeight: 'bold',
        fontSize: 17
    },
    btnCadastrar: {
        height: 45,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        elevation: 5,
        marginTop: 15
    },
    btnCadastrarGradiente: {
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
    },
    btnCadastrarText: {
        color: '#FFF',
        fontSize: 20
    },
});