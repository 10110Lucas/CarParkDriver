import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Service from '../services/Services';

export default class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            lista: [
                {
                    id: 0,
                    idLocador: "TjBOuJbxRcTlySesV5LR8WL4je73",
                    fotoLocador: {"remoto":"", "local":""},
                    message: 'Olá teste',
                    tempo: new Date()
                },
                {
                    id: 1,
                    myId: "TjBOuJbxRcTlySesV5LR8WL4je73",
                    myFoto: {"remoto":"", "local":""},
                    myMessage: 'Olá teste',
                    tempo: new Date()+500
                }
            ],
        }
    }

    componentDidMount(){
        // this.listaConversas();
    }
    
    
    listaConversas = async () => {
        let conversas = await Service.listaConversas();
        console.log(`Chegou as conversas: ${JSON.stringify(conversas)}`);
        if (conversas){
            this.setState({ lista: conversas });
        } else {
            return;
        }
    }

    renderFoto = ( image ) => {
        const foto = image;
        if (typeof foto.local === 'string' && foto.local !== null && foto.local !== ''){
            return {uri: foto.local};
        } else if (typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== ''){
            return {uri: foto.remoto};
        } else {
            return require('../images/camera.png')
        }
    }

    renderItem = ({ item }) => {
        if (item.myId){
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.input} >{ item.myMessage }</Text>
                    <TouchableOpacity 
                    style={styles.itemButton}
                    onPress={()=> {this.props.navigation.navigate('Chat', {chat: item.chat})} }
                    >
                        <Image style={styles.itemButtonImage} source={this.renderFoto(item.fotoLocador)} />
                        <Text style={styles.itemButtonTitle}>{item.nomeLocador}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (item.idLocador) {
            return (
                <View style={styles.itemContainer}>
                    <TouchableOpacity 
                    style={styles.itemButton}
                    onPress={()=> {this.props.navigation.navigate('Chat', {chat: item.chat})} }
                    >
                        <Image style={styles.itemButtonImage} source={this.renderFoto(item.fotoLocador)} />
                        <Text style={styles.itemButtonTitle}>{item.nomeLocador}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return;
        }
    };

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
                            <IconAntDesign name='arrowleft' color={'#9400D3'} size={40} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.viewTitulo}>
                        <Text style={styles.titulo}>Chat</Text>
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
                            Nenhuma Conversa Ainda
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
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        borderColor: '#DDD',
        backgroundColor: '#FFF',
    },
    itemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#9400D3', //roxo
        backgroundColor: 'transparent',
    },
    itemButtonImage: {
        width: 40,
        height: 40,
        marginRight: 30,
        borderRadius: 50,
        backgroundColor: '#AAA',
    },
    itemButtonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
})