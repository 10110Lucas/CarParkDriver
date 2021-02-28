import React, { Component } from 'react';
import {
    Keyboard,
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import Services from '../services/Services';
import Messages from './Messages';

export default class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            messages: [],
            text: '',
            myPhoto: Services.getFoto().remoto
        }
    }

    componentDidMount(){
        this.getMessages();
    }

    getMessages = async () => {
        const uid = Services.getUid();
        if (uid){
            const conversa = this.props.route.params.conversa;
            const messagesRef = database().ref(`carpark/locatario/${uid}/conversas/${conversa}/chat`);
            messagesRef.on('value', data => {
                var list = [];
                if(data.val()){
                    data.forEach( (element, index) => {
                        if (element.val().me){
                            list.push({
                                key: index,
                                me: true,
                                text: element.val().message,
                                photo: element.val().photo,
                                date: element.val().date,
                            });
                        } else {
                            list.push({
                                key: index,
                                me: false,
                                text: element.val().message,
                                photo: element.val().photo,
                                date: element.val().date
                            });
                        }
                    })
                } else {
                    list = [];
                    this.setState({messages: []});
                }
                this.setState({messages: list});
            });
        }
        else {
            this.props.navigation.navigate('Login');
        }
    }
    postMessage = async () => {
        const uid = Services.getUid();
        const conversa = this.props.route.params.conversa;
        const position = this.state.messages.length;
        const masterRef = database().ref(`carpark/locatario/${uid}/conversas/${conversa}/chat/${position}`);
        const data = new Date();
        if (this.state.text) {
            masterRef.update({
                me: true,
                message: this.state.text,
                photo: this.state.myPhoto,
                date: { day: data.getDate(), month: data.getMonth()+1, year: data.getFullYear(), hour: data.getHours(), minutes: data.getMinutes() },
            });
            this.setState({text: ''});
            Keyboard.dismiss();
        } else return;
    }

    render(){
        return(
            <View style={styles.container}>

                <FlatList
                style={styles.flatList}
                data={this.state.messages}
                renderItem={({item}) => <Messages item={item} />}
                keyExtractor={ item => String(item.key) }
                />

                <View style={styles.containerTeclado}>
                    <TextInput
                    style={styles.textInput}
                    placeholder='Mensagem'
                    placeholderTextColor='#9400D3'
                    autoCapitalize='sentences'
                    autoCorrect={false}
                    selectionColor='#2B4051'
                    multiline={true}
                    value={ this.state.text }
                    onChangeText={ text => this.setState({ text: text })}
                    />

                    <TouchableOpacity
                    style={styles.botao}
                    onPress={() => { this.postMessage() }}
                    >
                        {/* <Text style={styles.botaoText}>Env</Text> */}
                        <IconFontAwesome name='send-o' color={'#FFF'} size={25} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        flex: 1,
        backgroundColor: '#DED',
    },
    containerTeclado: {
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#9400D3',
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
    },
    botao: {
        width: 50,
        height: 50,
        marginLeft: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#94D300',
    },
    // botaoText: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     color: '#FFF',
    // },
});