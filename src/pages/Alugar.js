import React, { Component } from 'react';
import {
    View,
    Text,
    Keyboard,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import CollapsibleView from "@eliav2/react-native-collapsible-view";
import Icon from 'react-native-vector-icons/AntDesign';

export default class Alugar extends Component {

    constructor(props){
        super(props);

        this.state = {
            carro: {
                cor: '',
                modelo: '',
                placa: '',
            },
            contrato: {
                inicio: '',
                fim: '',
                dataTotalizada: {dias: 0, meses: 0, anos: 0},
            },
            precoDia: this.props.route.params.garagem.diaria,
            precoMensal: this.props.route.params.garagem.preco,
            preco: 0,
            cont: 0,
            inicioShow: false,
            fimShow: false,
        }
    }

    calcularDiasTotais = (inicio, fim) => {
        let iniData = new Date(inicio.ano, inicio.mes, inicio.dia);
        let fimData = new Date(fim.ano, fim.mes, fim.dia);
        // let milisec = fimData - iniData;
        // let seg = milisec / 1000;
        // let min = seg / 60;
        // let hor = min / 60;
        // let days = (hor / 24).toFixed(0);
        let dias = (((((fimData - iniData) / 1000) / 60) / 60) / 24).toFixed(0);

        let meses = fim.mes - inicio.mes;
        meses = (meses < 0 ? meses + 12 : meses).toFixed(0);

        let anos = (meses / 12).toFixed(0);

        this.setState({contrato: {
            ...this.state.contrato,
            dataTotalizada: { dias: dias, meses: meses, anos: anos }}
        });
        // console.log(`Data total: ${JSON.stringify(this.state.contrato)}`);
    }

    validacoes = () => {
        let validacao = true;
        if (!this.state.carro.cor){
            validacao = false;
            this.setState({carro: {...this.state.carro, cor: false}});
        }
        if (!this.state.carro.modelo){
            validacao = false;
            this.setState({carro: {...this.state.carro, modelo: false}});
        }
        if (!this.state.carro.placa){
            validacao = false;
            this.setState({carro: {...this.state.carro, placa: false}});
        }
        if (!this.state.contrato.inicio && this.state.contrato.inicio === ''){
            validacao = false;
            this.setState({contrato: {...this.state.contrato, inicio: ''}});
        }
        if (!this.state.contrato.fim && this.state.contrato.fim === ''){
            validacao = false;
            this.setState({contrato: {...this.state.contrato, fim: ''}});
        }

        return validacao;
    }

    estimarPreco = () => {
        const { inicio, fim} = this.state.contrato;

        if (inicio && fim) {

            let primeiroDia = parseInt((inicio.split('\/'))[0].trim());
            let primeiroMes = parseInt((inicio.split('\/'))[1].trim());
            let primeiroAno = parseInt((inicio.split('\/'))[2].trim());
            let ultimoDia = parseInt((fim.split('\/'))[0].trim());
            let ultimoMes = parseInt((fim.split('\/'))[1].trim());
            let ultimoAno = parseInt((fim.split('\/'))[2].trim());

            let iniData = {dia: primeiroDia, mes: primeiroMes, ano: primeiroAno};
            let fimData = {dia: ultimoDia,   mes: ultimoMes,   ano: ultimoAno};
            
            // let tempoTotais = this.calcularTotalMeses(iniData, fimData);
            this.calcularDiasTotais(iniData, fimData);

            // console.log(`Periodo: ${JSON.stringify(this.state.contrato.dataTotalizada)}`);
            let valorTotal = 0;
            if (this.state.contrato.dataTotalizada.dias > 0) {
                if (this.state.contrato.dataTotalizada.meses < 1){
                    valorTotal = this.state.precoDia * this.state.contrato.dataTotalizada.dias;
                    this.setState({preco: valorTotal});
                } else {
                    valorTotal = this.state.precoMensal * this.state.contrato.dataTotalizada.dias;
                    this.setState({preco: valorTotal});
                }
            } else {
                this.setState({preco: 0});
            }
        } else {
            this.setState({preco: 0});
        }
    }
    onShowDate = () => { this.setState({ inicioShow: true }); }
    onShowDateFinal = () => { this.setState({ fimShow: true }); }
    onConfirmDate = (date) => {
        let inicio = new Date(date.toUTCString());
        inicio = `${inicio.getDate()} \/ ${inicio.getMonth()+1} \/ ${inicio.getFullYear()}`;
        let {fim} = this.state.contrato;
        this.setState({contrato: {inicio, fim}});
        this.setState({inicioShow: false});
        Keyboard.dismiss();
        this.estimarPreco();
    }
    onConfirmDateFinal = (date) => {
        let fim = new Date(date.toUTCString())
        fim = `${fim.getDate()} \/ ${fim.getMonth()+1} \/ ${fim.getFullYear()}`;
        let {inicio} = this.state.contrato;
        this.setState({contrato: {inicio, fim}})
        this.setState({fimShow: false});
        Keyboard.dismiss();
        this.estimarPreco();
    }
    onCancelDate = () => {
        this.setState({inicioShow: false})
        this.setState({fimShow: false})
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.cardVeiculo}>
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Informe sobre o veículo</Text>
                    </LinearTextGradient>
                    <TextInput
                        style={styles.input}
                        placeholder="Cor do carro"
                        maxLength={18}
                        autoCorrect={false}
                        value={this.state.carro.cor}
                        onChangeText={(cor) => {
                            // let {modelo, placa} = this.state.carro;
                            // this.setState({carro: {cor, modelo, placa}})
                            this.setState({carro: {...this.state.carro, cor}})
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Modelo do carro"
                        maxLength={18}
                        autoCorrect={false}
                        value={this.state.carro.modelo}
                        onChangeText={(modelo) => {
                            // let {cor, placa} = this.state.carro;
                            this.setState({carro: {...this.state.carro, modelo}}) 
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Placa do carro"
                        maxLength={8}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        value={(this.state.carro.placa).toUpperCase()}
                        onChangeText={(placa) => {
                            // let {modelo, cor} = this.state.carro;
                            // this.setState({carro: {cor, modelo, placa}})
                            this.setState({carro: {...this.state.carro, placa}})
                        }}
                    />
                </View>

                {/* <CollapsibleView
                title={ <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradienteDiaria}
                        >
                            <Text style={styles.titulo}>Escolha quantos dias</Text>
                        </LinearTextGradient> }
                style={styles.cardDiaria}
                initExpanded={false}
                arrowStyling={{color: '#9400D3'}}
                >
                    <View style={styles.containerDias}>
                        <TouchableOpacity
                        style={styles.buttonMinus}
                        onPress={() => {
                            this.setState({ cont: this.state.cont > 0 ? this.state.cont - 1 : 0 })
                            this.setState({ preco: this.state.precoDia * this.state.cont })
                        }}
                        >
                            <Icon name='minus' color={'#9400D3'} size={19} />
                        </TouchableOpacity>
                        <Text style={styles.textDiaria}>
                            { this.state.cont } dias
                        </Text>
                        <TouchableOpacity
                        style={styles.buttonPlus}
                        onPress={() => {
                            this.setState({ cont: this.state.cont + 1 })
                            this.setState({ preco: this.state.precoDia * this.state.cont })
                        }}
                        >
                            <Icon name='plus' color={'#9400D3'} size={19} />
                        </TouchableOpacity>
                    </View>
                </CollapsibleView> */}

                {/* <CollapsibleView */}
                {/* title={ <LinearTextGradient
                //         locations={[0, 1]}
                //         colors={["#A31AFF", "#4C0080"]}
                //         start={{ x: 0, y: 0 }}
                //         end={{ x: 1, y: 0 }}
                //         style={styles.tituloGradientePeriodo}
                //         >
                //             <Text style={styles.titulo}>Escolha o Período</Text>
                //         </LinearTextGradient> 
                // }
                // initExpanded={false}
                // arrowStyling={{color: '#9400D3'}} */}
                <View
                style={styles.cardPeriodo}
                >
                    <LinearTextGradient
                    locations={[0, 1]}
                    colors={["#A31AFF", "#4C0080"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tituloGradientePeriodo}
                    >
                        <Text style={styles.titulo}>Escolha o Período</Text>
                    </LinearTextGradient>
                    <TouchableOpacity
                    style={styles.buttonDate}
                    onPress={this.onShowDate}
                    >
                        <Text style={{fontSize: 17,}}>
                            {
                                this.state.contrato.inicio ?
                                this.state.contrato.inicio :
                                "Selecione a Data Inicial"
                            }
                        </Text>
                        <Icon name='calendar' color={'#9400D3'} size={19} style={{marginLeft: 15}} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={this.state.inicioShow}
                        onConfirm={this.onConfirmDate}
                        onCancel={this.onCancelDate}
                        date={new Date()}
                        mode="date"
                    />
                    <TouchableOpacity
                    style={styles.buttonDate}
                    onPress={this.onShowDateFinal}
                    >
                        <Text style={{fontSize: 17,}}>
                            {
                                this.state.contrato.fim ?
                                this.state.contrato.fim :
                                "Selecione a Data Final"
                            }
                        </Text>
                        <Icon name='calendar' color={'#9400D3'} size={19} style={{marginLeft: 15}} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={this.state.fimShow}
                        onConfirm={this.onConfirmDateFinal}
                        onCancel={this.onCancelDate}
                        mode="date"
                    />
                {/* </CollapsibleView> */}
                </View>
                <TouchableOpacity 
                style={styles.cardValor}
                onPress={this.estimarPreco}
                >
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#A31AFF", "#4C0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloGradiente}
                    >
                        <Text style={styles.titulo}>Valor estimado</Text>
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
                </TouchableOpacity>
                <View style={styles.viewBotao}>
                    <TouchableOpacity
                    style={styles.botao}
                    onPress={
                        () => {
                            if (this.validacoes() && this.state.preco > 0){
                                this.props.navigation.navigate('Pagamento', {contrato: this.state, garagem: this.props.route.params.garagem}); 
                            } else {
                                return
                            }
                        }
                    }
                    >
                        <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                            <Text style={styles.botaoText}>Forma de Pagamento</Text>
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
        marginVertical: 15,
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
    cardVeiculo: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    cardDiaria: {
        width: '94%',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    containerDias: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10,
        backgroundColor: '#F0F0F0',
    },
    buttonMinus: {
        marginRight: 20,
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderStyle: 'solid',
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    textDiaria: {
        fontSize: 18,
    },
    buttonPlus: {
        marginLeft: 20,
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    tituloGradienteDiaria: {
        alignSelf: 'center',
        marginLeft: 20,
        marginVertical: 10,
        backgroundColor: '#FFF'
    },
    cardPeriodo: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    tituloGradientePeriodo: {
        alignSelf: 'center',
        marginLeft: 20,
        marginVertical: 10,
        backgroundColor: '#FFF'
    },
    cardValor: {
        alignItems: 'center',
        width: '94%',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#9400D3',
    },
    input: {
        width: '95%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    buttonDate: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
        borderRadius: 25,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    viewBotao: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 180,
        marginBottom: 30,
        backgroundColor: '#FFF',
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
})