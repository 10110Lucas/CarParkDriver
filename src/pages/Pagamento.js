import React, { Component } from 'react';
import {
    View,
    Text,
    // TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import CollapsibleView from "@eliav2/react-native-collapsible-view";
import Icon from 'react-native-vector-icons/AntDesign';

export default class Pagamento extends Component {

    constructor(props){
        super(props);

        this.state = {
            pagamento: {
                tipo: 'Dinheiro',
                vencimento: '',
                valorMensal: this.props.route.params.contrato.preco / (this.props.route.params.contrato.contrato.dataTotalizada.meses | 1),
                mensalidade: this.props.route.params.contrato.contrato.dataTotalizada.meses,
            },
            precoDia: 8,
            preco: this.props.route.params.contrato.preco,
            dateShow: false,
        }
    }

    contratar = () => {
        let garagem = this.props.route.params.garagem;
        let alugar = this.props.route.params.contrato;
        let formaPagamento = this.state;

        this.props.navigation.navigate('Alugando', {'garagem':garagem, 'alugar':alugar, 'formapagamento':formaPagamento});
    }

    onShowDate = () => { this.setState({ dateShow: true }); }

    onConfirmDate = (date) => {
        let venc = new Date(date.toUTCString())
        venc = venc.getDate();

        this.setState({pagamento: {
            ...this.state.pagamento,
            vencimento: venc
        }})

        this.setState({dateShow: false});
    }
    onCancelDate = () => {
        this.setState({dateShow: false})
    }

    render(){
        return (
            <View style={styles.container}>

                <View style={styles.cardDinheiro}>
                    {/* ------------------------------ Pagamento Dinheiro --------------- */}
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Forma de Pagamento</Text>
                    </LinearTextGradient>
                    <TouchableOpacity
                    style={styles.inputOpção}
                    onPress={() => {
                        this.setState({pagamento: {...this.state.pagamento, tipo: 'Dinheiro'}})
                    }}
                    >
                        <Text style={{fontSize: 18, marginRight: 30}}>Opção: Dinheiro </Text>
                        {
                            this.state.pagamento.tipo === 'Dinheiro' ?
                                <Icon name="check" color={'#94D300'} size={23} />
                            : null
                        }
                    </TouchableOpacity>

                    {/* ------------------------------ Pagamento Valor --------------- */}
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Valor Total</Text>
                    </LinearTextGradient>
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradientePreco}
                    >
                        <Text style={styles.titulo}>
                            R$ {this.state.preco},00
                        </Text>
                    </LinearTextGradient>
                </View>


                {/* <View style={styles.cardFatura} >
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Forma de Pagamento</Text>
                    </LinearTextGradient>
                    <TouchableOpacity
                    style={styles.inputOpção}
                    onPress={() => {
                        this.setState({pagamento: {...this.state.pagamento, tipo: 'Fatura'}})
                    }}
                    >
                        <Text style={{fontSize: 18, marginRight: 30}}>Opção: Fatura </Text>
                        {
                            this.state.pagamento.tipo === 'Fatura' ?
                                <Icon name="check" color={'#94D300'} size={23} />
                            : null
                        }
                    </TouchableOpacity>

                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Data para Pagamento</Text>
                    </LinearTextGradient>
                    <TouchableOpacity
                    style={styles.inputDate}
                    onPress={this.onShowDate}
                    >
                        <Text style={{fontSize: 18,}}>
                            {
                                this.state.pagamento.vencimento ?
                                'Todo Dia: ' + this.state.pagamento.vencimento :
                                "Selecione o dia de vencimento"
                            }
                        </Text>
                        <Icon name='calendar' color={'#9400D3'} size={19} style={{marginLeft: 15}} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={this.state.dateShow}
                        onConfirm={this.onConfirmDate}
                        onCancel={this.onCancelDate}
                        mode="date"
                    />
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Valor Da mensalidade</Text>
                    </LinearTextGradient>
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradientePreco}
                    >
                        <Text style={styles.titulo}>
                            R$ {this.state.pagamento.valorMensal},00
                        </Text>
                    </LinearTextGradient>
                </View> */}


                <View style={styles.viewBotao}>
                    <TouchableOpacity
                    style={styles.botao}
                    onPress={
                        () => { this.contratar() }
                    }
                    >
                        <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                            <Text style={styles.botaoText}>Contratar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    tituloGradiente: {
        alignSelf: 'center',
        marginVertical: 20,
        backgroundColor: '#FFF'
    },
    tituloGradientePreco: {
        alignSelf: 'center',
        marginTop: -5,
        marginBottom: 20,
        backgroundColor: '#FFF'
    },
    titulo: {
        fontSize: 22,
        fontFamily: 'roboto-regular'
    },
    cardValor: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
    },
    viewBotao: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
    cardTempo: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardPagamento: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
    },
    cardDinheiro: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 15,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    cardFatura: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 15,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    inputOpção: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        borderRadius: 5,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    inputDate: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        borderRadius: 5,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
});