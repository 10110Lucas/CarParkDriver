import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    BackHandler,
    TouchableOpacity,
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import MapView, { Marker } from 'react-native-maps';
import Services from '../services/Services';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Mapa extends Component {

    constructor(props){
        super(props);

        this.state = {
            myLocal: {
                latitude: 0,
                longitude: 0,
            },
            places: [{
                    address : {
                        bairro : "", cep : "", cidade : "",
                        numero : "", rua : ""
                    },
                    altura : "",
                    anunciante : "",
                    cadeirante : false,
                    cobertura : true,
                    comprimento : "",
                    foto : { local : "", remoto : "" },
                    id : 1,
                    largura : "",
                    location : {
                        latitude : 0,
                        longitude : 0,
                    },
                    rampa : true,
                    userID : ""
            }]
        }
        BackHandler.addEventListener('hardwareBackPress', () => { return true; });
    }
    
    componentDidMount(){
        this.localizarProximos(1500);
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress');
    }
    
    garagens = async () => {
        let locais = await Services.localizacoes();
        this.setState({places: locais});
    }
    localizacaoAtual = () => {
        Geolocation.getCurrentPosition(position => {
                this.setState({
                    myLocal: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                });
            },
            error => {
                console.log(error);
                alert('Houve um erro ao pegar a latitude e longitude.');
                return;
            }
        );
    };

    localizarProximos = async ( metros ) => {

        let coord = {lat: 0, long: 0};

        // -23.123456
        //   0.000001 graus = 0.11132 m
        let distancia = ( metros * 0.000001) / 0.11132;
        let raioSuperior = coord.lat + distancia;
        let raioInferior = coord.lat - distancia;
        let raioDireito = coord.long + distancia;
        let raioEsquerdo = coord.long - distancia;
        
        // let garagens = await Services.localizacoes();
        let garagens = [];
        let dados = database().ref('/carpark/enderecos/');
        dados.on('value', snapshot => {
            snapshot.forEach( childSnapshot => {
                if (childSnapshot.val()) {
                    garagens.push(childSnapshot.val());
                }
            });

            Geolocation.getCurrentPosition(position => {
                // aqui dentro é mais garantido de atualizar todo o state
                // com as informações lat e long e demais carregadas
                coord = {
                    lat: Number(position.coords.latitude),
                    long: Number(position.coords.longitude)
                }
                raioSuperior = coord.lat + distancia;
                raioInferior = coord.lat - distancia;
                raioDireito = coord.long + distancia;
                raioEsquerdo = coord.long - distancia;
                
                let novasLocalizacoes = [];
                garagens.forEach( local => {
                    if (local.location.latitude >= raioInferior && local.location.latitude <= raioSuperior){
                        if (local.location.longitude >= raioEsquerdo && local.location.longitude <= raioDireito){
                            // garagem disponivel para alugar
                            if (!local.aluguel || local.aluguel === false){
                                novasLocalizacoes.push(local);
                            } else return
                        } else return
                    } else return
                });
        
                this.setState({
                    myLocal: {
                        latitude: coord.lat,
                        longitude: coord.long,
                    },
                    places: novasLocalizacoes
                });
            },error => {
                console.log(error);
                alert('Erro ao pegar a latitude e longitude.');
                return;
            });
        });
    }

    // _mapReady = () => {
    //     this.state.places[0].mark.showCallout();
    // };

    render(){

        // const { latitude, longitude } = this.state.places[0].location;
        const { latitude, longitude } = this.state.myLocal;

        return(
            <View
            style={styles.container}
            >
                <View style={styles.containerTitulo}>
                    <View style={styles.viewMenu}>
                        <TouchableOpacity
                        style={styles.menu}
                        onPress={ this.props.navigation.openDrawer }
                        >
                            {/* <Image style={{width:30, height: 23}} source={require('../images/menu.png')}/> */}
                            <Icon name='menu' color={'#9400D3'} size={40} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewTitulo}>
                        <ImageScalable style={styles.imageTitulo} source={ require('../images/logo_roxo.png') } height={30} />
                    </View>
                </View>

                <MapView 
                style={styles.mapview}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0120,
                    longitudeDelta: 0.0120,
                }}
                ref={map => this.mapView = map}
                // rotateEnabled={false}
                // scrollEnabled={true}
                // zoomEnabled={true}
                showsPointsOfInterest={false}
                showsBuildings={false}
                // onMapReady={this._mapReady}
                >
                    <Marker
                    title={'Você está aqui!'}
                    // description={'Você está aqui!'}
                    coordinate={ this.state.myLocal }
                    >
                        <Icon name='my-location' color={'#00F'} size={30} />
                    </Marker>
                    {
                        this.state.places.map(place => (
                            <MapView.Marker
                            ref={mark => place.mark = mark}
                            // anunciante={place.anunciante}
                            // numero={place.numero}
                            key={place.id}
                            title={`Anunciante: ${place.anunciante}`}
                            description={`${place.address.rua}, ${place.address.numero}`}
                            coordinate={{
                                latitude: place.location.latitude,
                                longitude: place.location.longitude
                            }}
                            >
                                <View style={styles.marcadorImgContainer}>
                                    <Image style={styles.marcadorImg} source={ require('../images/marker.png')} />
                                </View>
                            </MapView.Marker>
                        ))
                    }
                </MapView>

                <View style={styles.containerScroll}>
                    <ScrollView
                    horizontal
                    pagingEnabled
                    style={styles.placesContainer}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={event =>{
                        const place = event.nativeEvent.contentOffset.x > 0 ?
                        (event.nativeEvent.contentOffset.x / Dimensions.get('window').width)
                        : 0;
                        const { location, mark} = this.state.places[Math.ceil(place)];

                        this.mapView.animateToRegion({
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0081,
                            longitudeDelta: 0.0081,
                        }, 500);
                        // setTimeout(() => {
                        //     mark.showCallout();
                        // }, 500);
                    }}
                    >
                    {this.state.places.map(place => (
                        <LinearGradient  colors={['#A31AFF', '#4C0080']} key={place.id} style={styles.place}>
                            <View style={styles.textContainerCard}>
                                <Text style={styles.txt1}>
                                    {place.anunciante}
                                </Text>
                                <Text style={styles.txt2}>
                                    {String(place.address.rua).trimEnd()}, {String(place.address.numero).trimStart()}
                                </Text>
                                <Text style={styles.txt2}>
                                    {String(place.address.bairro).trimEnd()} - {String(place.address.cidade).trimStart()}
                                </Text>
                            </View>
                            <View style={styles.btnContainerCard}>
                                <TouchableOpacity style={styles.btnEndereco} onPress={ () => this.props.navigation.navigate('Garagem', {id: place.id}) }>
                                    <Text style={styles.btnTextEndeteco}>Ver Mais Detalhes</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    ))}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerTitulo: {
        flex: 1,
        flexDirection: 'row',
        width: width,
        paddingTop: 10,
    },
    viewMenu: {
        height: 30,
    },
    menu: {
        width: 50,
        height: 30,
        marginLeft: 5,
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    viewTitulo: {
        width: width - 65,
        height: 30,
    },
    imageTitulo: {
        alignSelf: 'flex-end',
    },
    mapview: {
        width: width,
        height: height,
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
    },
    marcadorImgContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    marcadorImg: {
        width: '100%',
        height: '100%'
    },
    containerScroll: {
        flex: 1,
        width: width,
        bottom: 5,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    placesContainer: {
        flex: 1,
        width: width,
        maxHeight: 220,
    },
    place: {
        top: 0,
        flex: 1,
        width: width - 20,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginHorizontal: 10,
    },
    textContainerCard: {
        flex: 1,
        padding: 2,
        marginTop: 15,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    txt1: {
        color:'white',
        fontSize: 25, 
        textAlign: 'center',
        fontFamily: 'arial',
        marginTop: 10,
        marginBottom: 10,
    },
    txt2: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'arial',
        marginBottom: 10,
    },
    btnContainerCard: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    btnEndereco: {
        borderRadius: 25,
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    btnTextEndeteco: {
        fontSize: 20,
        color: '#7A00CC',
        textAlign: 'center',
    }
});