import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Image from 'react-native-scalable-image';
import Service from '../services/Services';

export default class Alugueis extends Component {

    constructor(props){
        super(props);

        this.state = {
            lista: [],
        }
    }
    
    componentDidMount(){
        this.listaAlugueis();
    }
    
    listaAlugueis = async () => {
        let alugueis = await Service.listaAlugueis();
        // console.log(`Lista de contrato: ${JSON.stringify(alugueis)}`);
        if (alugueis){
            this.setState({ lista: alugueis });
        } else {
            return;
        }
    }

    formatar = (valor) => {
        return String(valor).replace(/(\W|\D+)/g, '');
    }
    maskerCel = (dado) => {
        let valor = String(dado);
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

    renderFoto = ( image ) => {
        const foto = image;
        if (foto.remoto && typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== ''){
            return {uri: foto.remoto};
        } else {
            return require('../images/camera.png')
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.itemContainer}>

            <Image width={170} style={styles.itemPhoto} source={ this.renderFoto(item.fotoGaragem) } />
            <Text style={styles.itemContrato}>Endereco: {item.enderecoGaragem}</Text>
            <Text style={styles.itemContrato}>Proprietário: {item.nomeLocador}</Text>
            <Text style={styles.itemContrato}>Contato: {this.maskerCel(item.celular)}</Text>
            <Text style={styles.itemContrato}>Data Inicial: {item.dataInicial}</Text>
            <Text style={styles.itemContrato}>Data Final: {item.dataFinal}</Text>
            <Text style={styles.itemContrato}>Data Final: {item.formaPagamento}</Text>
            {
                item.vencimentos ?
                <Text style={styles.itemContrato}>Dia de Vencimento: {item.vencimentos}</Text>
                : null
            }
            {
                item.valorMensal ? 
                <Text style={styles.itemContrato}>Valor Mensal R$ {item.valorMensal},00</Text>
                : null
            }
            <Text style={styles.itemContrato}>Valor Total R$ {item.valorTotal},00</Text>
            <Text style={styles.itemContrato}>
                Pagamento Realizado: {item.aluguelPago ? 'Sim' : 'Não'}
            </Text>
            
        </View>
    );

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.containerTitulo}>
                    <View style={styles.viewMenu}>
                        <TouchableOpacity
                        style={styles.btnMenu}
                        onPress={ this.props.navigation.openDrawer }
                        >
                            {/* <Image style={{width:30, height: 23}} source={require('../images/menu.png')}/> */}
                            <Icon name='menu' color={'#9400D3'} size={40} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.viewTitulo}>
                        <Text style={styles.titulo}>Contratos</Text>
                    </View>
                    <View style={{flex: 1}}></View>
                </View>
                { this.state.lista && this.state.lista.length > 0 ?
                    <FlatList
                    contentContainerStyle={styles.flatlist}
                    data={this.state.lista}
                    keyExtractor={ item => String(item.id)}
                    renderItem={this.renderItem}
                    // onEndReached={this.loadMore}
                    onEndReachedThreshold={0.1}
                    /> :
                    <View style={styles.containerAviso}>
                        <Text style={styles.avisoTitle}>
                            Nenhum Contrato Ainda
                        </Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    containerTitulo: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        margin: 0,
        alignItems: 'center',
        backgroundColor: '#EEE'
    },
    viewMenu: {
        flex: 1,
        alignItems: 'flex-start',
    },
    btnMenu: {
        marginLeft: 15,
    },
    viewTitulo: {
        flex: 1,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    flatlist: {
        padding: 10
    },
    itemContainer: {
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 10,
        marginBottom: 20,
        borderColor: '#9400D3',
        backgroundColor: '#FFF',
    },
    containerAviso: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avisoTitle: {
        fontSize: 30,
        color: '#BBB',
    },
    itemPhoto: {
        alignSelf: 'center',
        marginBottom: 5,
    },
    itemContrato: {
        backgroundColor: '#f0f0f0',
        fontSize: 18,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        color: '#000'
    },
});