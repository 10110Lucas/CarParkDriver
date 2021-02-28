import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import Services from '../services/Services';
import ImagePicker from 'react-native-image-picker';

export default class Perfil extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            foto: {local: false, remoto: false},
            nome: '',
            sobrenome: '',
            cpf: '',
            celular: '',
            email: '',
            password: '',
            showPassword: true,
            showPasswordImage: require('../images/showPasswordTrue.png'),
        }

        this.imagePickerOptions = {
            title: 'Selecione uma Opção:',
            storageOptions: {
                privateDirectory: true,
                path: '../CarParkDriver/Media/Perfil',
            },
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma Foto',
            chooseFromLibraryButtonTitle: 'Procurar Foto da Galeria',
        };
    }

    componentDidMount(){
        this.carregarDados();
    }

    salvarDados = async () => {
        let valido = false;
        const { local } = this.state.foto;
        if (this.inputsValidos()) {
            try {
                let url = await Services.uploadFoto(local, 'Perfil');
                // BancoDados.uploadFoto(this.state.foto.local, 'Perfil', nomeFoto[nomeFoto.length - 1]);
                
                this.setState({foto: {local: local, remoto: url}});
                // console.log(`Foto de perfil: ${JSON.stringify(this.state.foto)}`);
                let perfil = {
                    foto: this.state.foto, 
                    nome: this.state.nome, 
                    sobrenome: this.state.sobrenome, 
                    cpf: this.state.cpf, 
                    celular: this.state.celular, 
                    email: this.state.email, 
                    password: this.state.password
                };

                valido = await Services.atualizaPerfil(perfil);
                if(valido)
                    this.voltarHome();
                return;
            } catch (error) {
                console.log('Erro ao salvar dados:',error);
            }
        }
    }
    excluir = async () => {
        let valido = false;
        try {
            valido = await Services.excluirConta();
            if(valido)
                this.props.navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao excluir dados:',error);
        }
    }

    carregarDados = async () => {
        const {foto, nome, sobrenome, cpf, celular, email, password} = Services.getPerfil();
        this.setState({
            foto: foto,
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            celular: celular,
            email: email,
            password: password,
        });
    }

    voltarHome = () => {
        this.props.navigation.navigate('Mapa');
    }

    passwordShow = () => {
        let img = !this.state.showPassword ? require('../images/showPasswordTrue.png') : require('../images/showPasswordFalse.png');
        this.setState({
            showPassword: !this.state.showPassword,
            showPasswordImage: img
        });
    }
    inputsValidos = () => {
        let valido = true;

        if (!this.state.nome){
            this.setState({nome: false});
            valido = false;
        }
        if (!this.state.sobrenome){
            this.setState({sobrenome: false});
            valido = false;
        }
        if (!this.validarCPF(this.state.cpf)){
            this.setState({cpf: false});
            valido = false;
        }
        if (!this.state.celular){
            this.setState({celular: false});
            valido = false;
        }
        if (!this.state.email){
            this.setState({email: false});
            valido = false;
        }
        if (!this.state.password){
            this.setState({password: false});
            valido = false;
        }
        return valido;
    }
    converter = (valor) => {
        if(valor !== '')
            valor = this.formatar(valor);
        parseInt(valor);
        if (valor.length < 12)
            return this.maskerCPF(valor);
        else
            return this.maskerCNPJ(valor);
    }
    formatar = (param) => {
        let valor = ''+param;
        return valor.replace(/(\W|\D+)/g, '');
    }
    maskerCPF = (valor) => {
        if(valor.length < 4)
            return valor.replace(/(\d{1,3})/g, '\$1');
        else if(valor.length > 3 && valor.length <= 6)
            return valor.replace(/(\d{3})(\d{1,3})/g, '\$1.\$2');
        else if(valor.length > 6 && valor.length <= 9)
            return valor.replace(/(\d{3})(\d{3})(\d{1,3})/g, '\$1.\$2.\$3');
        else if(valor.length > 9 && valor.length <= 11)
            return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/g, '\$1.\$2.\$3\-\$4');
    }
    maskerCNPJ = (valor) => {
        if(valor.length === 12)
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/g, '\$1.\$2.\$3\/\$4');
        else
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }
    maskerCel = (valor) => {
        if(valor !== '')
            valor = this.formatar(valor);
        parseInt(valor);
        if (valor.length < 3)
            return valor.replace(/(\d{1,2})/g, '\(\$1');
        else if (valor.length > 2 && valor.length < 8)
            return valor.replace(/(\d{2})(\d+)/g, '\(\$1\)\ \$2');
        else if (valor.length > 7)
            return valor.replace(/(\d{2})(\d{5})(\d{1,4})/g, '\(\$1\)\ \$2\-\$3');
    }
    validarCPF(param) {
        let cpf = ''+param;
        // cpf = cpf.replace(/[^\d]+/g,'');
        cpf = this.formatar(cpf);
        if(cpf == '') return false;	
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || 
            cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || 
            cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
                return false;		
        // Valida 1o digito	
        let add = 0;	
        let rev = 0;
        for (let i=0; i < 9; i ++)		
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)		
            rev = 0;	
        if (rev != parseInt(cpf.charAt(9)))		
            return false;		
        // Valida 2o digito	
        add = 0;	
        rev = 0;
        for (let i = 0; i < 10; i ++)		
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }

    renderFoto = () => {
        const { foto } = this.state;
        if (foto.local && typeof foto.local === 'string' && foto.local !== null && foto.local !== undefined){
            return {uri: foto.local};
        } else if (foto.remoto && typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== undefined){
            return {uri: foto.remoto};
        } else {
            return require('../images/camera.png')
        }
    }

    render (){
        return (
            <View style={styles.container}>
                <View style={styles.containerTitulo}>
                    <TouchableOpacity 
                    style={styles.btnVoltar}
                    onPress={this.voltarHome}
                    >
                        <Image style={styles.btnVoltarIcon} source={require('../images/voltar.png')}/>
                    </TouchableOpacity>
                    <LinearTextGradient style={styles.containerVoltarText}>
                        <Text>Voltar</Text>
                    </LinearTextGradient>
                </View>
                <LinearTextGradient
                    locations={[0, 1]}
                    colors={["#a31aff", "#4c0080"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tituloGradiente}
                >
                    <Text style={styles.titulo}>PERFIL</Text>
                </LinearTextGradient>
                <ScrollView style={styles.containerScroll}>
                    <TouchableOpacity
                    style={styles.btnInserirFoto}
                    onPress={() => ImagePicker.showImagePicker(this.imagePickerOptions, (data) => {
                        if (data.didCancel) {
                          return;
                        }
                        if (data.error) {
                          return;
                        }
                        if (data.customButton) {
                          return;
                        }
                        if (!data.uri) {
                          return;
                        }

                        this.setState({foto: {...this.state.foto, local: data.uri}});
                    })}
                    >
                        <View style={styles.btnContainerFoto}>
                            <Image style={styles.foto} source={ this.renderFoto() } />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.containerEndereco}>
                        {this.state.nome !== false ? null : <Text style={styles.textValidation}>Nome precisa ser preenchido</Text>}
                        <TextInput
                        style={styles.input}
                        placeholder='Nome'
                        value={String(this.state.nome === false ? '' : this.state.nome)}
                        onChangeText={(nome)=>{this.setState({nome})}}
                        />

                        {this.state.sobrenome !== false ? null : <Text style={styles.textValidation}>Sobrenome precisa ser preenchido</Text>}
                        <TextInput
                        style={styles.input}
                        placeholder='Sobrenome'
                        value={String(this.state.sobrenome === false ? '' : this.state.sobrenome)}
                        onChangeText={(sobrenome)=>{this.setState({sobrenome})}}
                        />

                        {this.state.cpf !== false ? null : <Text style={styles.textValidation}>CPF precisa ser preenchido</Text>}
                        <TextInput
                        style={styles.input}
                        placeholder='Digite seu CPF'
                        keyboardType='numeric'
                        maxLength={14}
                        value={this.state.cpf !== false ? this.converter(this.state.cpf) : ''}
                        onChangeText={(cpf)=>{this.setState({cpf})}}
                        />
                        
                        {this.state.celular !== false ? null : <Text style={styles.textValidation}>Número de celular precisa ser preenchido</Text>}
                        <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder='Celular: (00) 9000-0000'
                        maxLength={15}
                        value={this.state.celular !== false ? this.maskerCel(this.state.celular) : ''}
                        onChangeText={(celular)=>{this.setState({celular})}}
                        />

                        {this.state.email !== false ? null : <Text style={styles.textValidation}>Email precisa ser preenchido</Text>}
                        <TextInput
                        style={styles.input}
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        autoFocus={false}
                        maxLength={40}
                        value={String(this.state.email === false ? '' : this.state.email)}
                        onChangeText={(email)=>{this.setState({email})}}
                        />

                        {this.state.password !== false ? null : <Text style={styles.textValidation}>Senha precisa ser preenchido</Text>}
                        <View style={styles.containerPassword}>
                            <TextInput
                            style={styles.inputPassword}
                            placeholder='Senha: mínimo(6) e máximo(15) caracteres'
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
                    </View>

                    <View style={styles.containerDuplo}>
                        <View style={styles.viewEsq}>
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.excluir }
                            >
                                <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                                    <Text style={styles.botaoText}>Excluir</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewDir}>
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.salvarDados }
                            >
                                <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                                    <Text style={styles.botaoText}>Salvar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    btnVoltar: {
        marginLeft: 20
    },
    btnVoltarIcon: {
        width: 30,
        height: 30
    },
    containerVoltarText: {
        alignItems: 'flex-start',
        marginLeft: 7,
        fontSize: 23,
        color: '#000',
        backgroundColor: '#FFF'
    },
    tituloGradiente: {
        alignSelf: 'center',
        fontSize: 22,
        marginVertical: 20,
        backgroundColor: '#FFF'
    },
    titulo: {
        fontSize: 25,
        fontFamily: 'roboto-regular'
    },
    containerScroll: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    btnInserirFoto: {
        width: '48%',
        height: 180,
        borderRadius: 110,
        borderColor: '#4C0080',
        borderWidth: 2,
        borderStyle: 'solid',
        alignSelf:'center',
        justifyContent:'center',
        backgroundColor: '#CCC'
    },
    btnContainerFoto: {
        width: '100%',
        height: '100%',
        borderRadius: 110,
    },
    foto: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 110,
    },
    containerEndereco: {
        marginTop: 15,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    input: {
        width: '90%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        padding: 10,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
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
    containerDuplo: {
        flexDirection: 'row',
        width: '90%',
        marginHorizontal: '5%',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    viewEsq: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#FFF'
    },
    viewDir: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#FFF'
    },
    botao: {
        height: 45,
        width: '95%',
        borderRadius: 25,
        elevation: 5,
    },
    botaoGradient: {
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,        
    },
    botaoText: {
        color: '#FFF',
        fontSize: 20
    },
});