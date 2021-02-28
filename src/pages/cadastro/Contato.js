import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import Services from '../../services/Services';

export default class Contato extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            foto: {local: false, remoto: false},
            nome: '',
            sobrenome: '',
            cpf: '',
            celular: '',
        }

        this.imagePickerOptions = {
            title: 'Selecione uma Opção:',
            storageOptions: {
                privateDirectory: true,
                path: '../CarParkDriver/Media/Perfil',
            },
            mediaType: 'photo',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma Foto',
            chooseFromLibraryButtonTitle: 'Procurar Foto da Galeria',
        };
    }

    criarConta = () => {
        let valido = false;
        const {nome, sobrenome} = this.state;
        
        if (this.inputsValidos()){
            this.setState({
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
            });
            try {
                valido = Services.adicionarContato(this.state);
                if (valido){
                    this.props.navigation.navigate('Cadastro');
                }
                else return;

            }catch (error){
                console.log(`Falha cração de conta: ${error}`)
            }
        } 
        else alert('Ainda restam campos vazios, preencha-os para realizar o cadastro!');
    }

    limpeza = () => {
        this.setState({
            foto: {local: false, remoto: false},
            nome: '', sobrenome: '', cpf: '', celular: ''
        });
    }

    inputsValidos = () => {
        let valido = true;
        if (!this.state.foto.local){
            this.setState({foto: {local: false, remoto: false}});
            valido = false;
        }
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
        if (this.state.celular.length < 15){
            this.setState({celular: false});
            valido = false;
        }
        return valido;
    }
    validarCPF(param) {
        let cpf = this.formatar(String(param));
        // cpf = cpf.replace(/[^\d]+/g,'');
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
        for (let i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }

    converter = (valor) => {
        if(valor !== '') valor = this.formatar(valor);
        parseInt(valor);
        if (valor.length < 12) return this.maskerCPF(valor);
        else return this.maskerCNPJ(valor);
    }
    formatar = (valor) => {
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
    renderFoto = () => {
        const { foto } = this.state;
        if (typeof foto.local === 'string' && foto.local !== null && foto.local !== undefined){
            return {uri: foto.local};
        } else if (typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== undefined){
            return {uri: foto.remoto};
        } else {
            return require('../../images/camera.png');
        }
    }
    
    render(){
        return(
            <View style={styles.container}>

                <TouchableOpacity
                style={styles.btnInserirFoto}
                onPress={() => ImagePicker.showImagePicker(this.imagePickerOptions, (data) => {
                    
                    if (data.didCancel) {
                        return;
                    }
                    if (data.error) {
                        console.log(`Erro de foto: ${data.error}`);
                        return;
                    }
                    if (data.customButton) {
                        return;
                    }
                    if (!data.uri) {
                        return;
                    }
                    
                    const { remoto } = this.state.foto;
                    this.setState({foto: {local: data.uri, remoto: remoto || false}});
                })}
                >
                    <View style={styles.btnContainerFoto}>
                        <Image style={styles.foto} source={ this.renderFoto() } />
                    </View>
                </TouchableOpacity>
                
                {/* <TouchableOpacity 
                    style={{alignSelf: 'flex-start', margin: 20}}
                    onPress={this.voltarLogin}
                >
                    <Image style={{width:35, height: 35}} source={require('../img/voltar.png')}/>
                </TouchableOpacity> */}

                {/* <LinearTextGradient
                locations={[0, 1]}
                colors={["#a31aff", "#4c0080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{marginBottom:20}}
                >
                    <Text style={{fontSize: 20, fontFamily: 'roboto-regular'}}>CRIAR CONTA</Text>
                </LinearTextGradient> */}
                
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

                {/* ---------------------------------------------------------- Ir para próxima tela ------------------------------------------ */}
                <TouchableOpacity
                style={styles.btnCadastrar}
                onPress={ this.criarConta }
                >
                    <LinearGradient
                        style={styles.btnCadastrarGradiente}
                        colors={['#a31aff', '#7a00cc', '#4c0080']}
                    >
                        <Text style={styles.btnCadastrarText}>Próximo</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',        
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