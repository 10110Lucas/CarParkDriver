import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import Services from '../services/Services';

export default class Garagem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            foto: {local: false, remoto: false},
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            cep: '',
            id: 0,
            anunciante: '',
            altura: '',
            largura: '',
            comprimento: '',
            cobertura: false,
            rampa: false,
            cadeirante: false,
            diaria: 0,
            preco: 0,
            idAnunciante: '',
        }
    }

    componentDidMount(){
        this.carregarDados();
    }

    carregarDados = async () => {
        const { id } = this.props.route.params;
        try{
            let garagem = await Services.garagemInfo(id);
            this.setState({
                foto: garagem.foto,
                rua: garagem.address.rua,
                numero: garagem.address.numero,
                bairro: garagem.address.bairro,
                cidade: garagem.address.cidade,
                cep: garagem.address.cep,
                id: garagem.id,
                anunciante: garagem.anunciante,
                altura: garagem.altura,
                largura: garagem.largura,
                comprimento: garagem.comprimento,
                cobertura: garagem.cobertura,
                rampa: garagem.rampa,
                cadeirante: garagem.cadeirante,
                diaria: garagem.diaria,
                preco: garagem.preco,
                idAnunciante: garagem.idAnunciante
            });
        } catch(error) {
            console.log('Erro ao carregar dados:',error);
        }
    }
    
    voltar = () => {
        this.props.navigation.navigate('Mapa');
    }

    _onToggleSwitchCobertura = () => this.setState({ cobertura: !this.state.cobertura });
    _onToggleSwitchRampa = () => this.setState({ rampa: !this.state.rampa });
    _onToggleSwitchCadeirante = () => this.setState({ cadeirante: !this.state.cadeirante });

    renderFoto = () => {
        const { foto } = this.state;

        if (foto.remoto && typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== undefined){
            return {uri: foto.remoto};
        }
        else {
            return require('../images/camera.png');
        }
    }

    render(){

        return(
            <View style={styles.container}>
                
                <LinearTextGradient
                    locations={[0, 1]}
                    colors={["#a31aff", "#4c0080"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tituloGradiente}
                >
                    <Text style={styles.titulo}>Anunciador {this.state.anunciante}</Text>
                </LinearTextGradient>
                <View style={styles.containerScrollView}>
                    <ScrollView style={styles.scrollView}>
                        <TouchableOpacity
                        style={styles.btnInserirFoto}
                        onPress={() => {}}
                        >
                            <View style={styles.btnContainerFoto}>
                                <ImageScalable
                                height={176}
                                source={ this.renderFoto() }
                                style={styles.foto}
                                />
                            </View>
                        </TouchableOpacity>


                        <View style={styles.containerEndereco}>
                            <LinearTextGradient
                            locations={[0, 1]}
                            colors={["#a31aff", "#4c0080"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.precoGradiente}
                            >
                                <Text style={styles.textPreco}>Preco por Dia: R$ {this.state.diaria},00</Text>
                            </LinearTextGradient>
                            <LinearTextGradient
                            locations={[0, 1]}
                            colors={["#a31aff", "#4c0080"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.precoGradiente}
                            >
                                <Text style={styles.textPreco}>Preco Mensal: R$ {this.state.preco * 30},00</Text>
                            </LinearTextGradient>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Rua: {this.state.rua}, {String(this.state.numero).trim()}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Bairro: {this.state.bairro} 
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Cidade: {this.state.cidade}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Largura: {this.state.largura}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Altura: {this.state.altura}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Comprimento: {this.state.comprimento}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Cobertura: {this.state.cobertura? 'Sim' : 'Não'}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Entrada com Rampa: {this.state.rampa? 'Sim' : 'Não'}
                                </Text>
                            </View>
                            <View style={styles.containerTextEnderecos}>
                                <Text style={styles.textEnderecos}>
                                    Acesso para Cadeirante: {this.state.cadeirante? 'Sim' : 'Não'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.containerButton}>
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={
                                () => { this.props.navigation.navigate('Alugar', {garagem: this.state}) }
                            }
                            >
                                <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                                    <Text style={styles.botaoText}>Alugar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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
        marginVertical: 20,
        fontSize: 22,
        backgroundColor: '#FFF'
    },
    titulo: {
        fontSize: 25,
        fontFamily: 'roboto-regular'
    },
    containerScrollView: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    scrollView: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFF'
    },
    btnInserirFoto: {
        width: '90%',
        height: 180,
        borderRadius: 7,
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
        borderRadius: 7,
    },
    foto: {
        alignSelf: 'center',
        // width: '100%',
        // height: '100%',
        borderRadius: 7
    },
    containerEndereco: {
        marginTop: 5,
        paddingHorizontal: 20,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    precoGradiente: {
        width: '100%',
        alignSelf: 'flex-start',
        marginVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: '#FFF'
    },
    textPreco: {
        fontSize: 22,
        fontFamily: 'roboto-regular'
    },
    containerTextEnderecos: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    textEnderecos: {
      fontSize: 20,
      color: '#000'
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
    containerDuplo: {
        flexDirection: 'row',
        width: '90%',
        marginHorizontal: '5%',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    ladoEsq: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    inputEsq: {
        width: '95%',
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
    ladoDir: {
        justifyContent: 'flex-end',
        width: '25%',
        backgroundColor: '#FFF'
    },
    inputDir: {
        width: '100%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        padding: 10,
        paddingHorizontal: 12,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    containerTogle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 2,
        paddingHorizontal: '8%',
        backgroundColor: '#FFF'
    },
    containerTogleLeft: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        backgroundColor: '#FFF'
    },
    togleGradient: {
        alignItems: 'center'
    },
    togleTxt: {
        fontSize: 20,
        fontFamily: "roboto-regular",
    },
    containerTogleRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: '100%',
        width: '18%',
        backgroundColor: '#FFF'
    },
    togle: {
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        marginLeft: '5%',
        backgroundColor: '#FFF'
    },
    viewEsq: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#FFF'
    },
    containerButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10,
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