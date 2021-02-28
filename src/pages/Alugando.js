import * as React from 'react';
import {
    SafeAreaView
} from 'react-native';
import Lottie from 'lottie-react-native';
import carregamento from './cadastro/carregamento.json';

import Services from '../services/Services';

export default class Alugando extends React.Component {

    constructor(props){
        super(props);

        this.locatario = Services.getPerfil();
        this.garagem = this.props.route.params.garagem;
        this.alugar = this.props.route.params.alugar;
        this.formaPagamento = this.props.route.params.formapagamento;

        this.criarAluguel();
    }
    
    destinoGaragem = () => {
        const locatario = this.locatario;
        const garagem = this.garagem;
        const alugar = this.alugar;
        const formaPagamento = this.formaPagamento;

        let chat = {
            idLocatario: locatario.registroID,
            nomeLocatario: locatario.nome,
            fotoLocatario: locatario.foto,
            celularLocatario: locatario.celular,
            messages: [],
        }
        let veiculo = {
            alugar: true,
            cor: alugar.carro.cor,
            modelo: alugar.carro.modelo,
            placa: alugar.carro.placa,
            fotoVeiculo: '',
            dataInicial: alugar.contrato.inicio,
            dataFinal: alugar.contrato.fim,
            valorMensal: formaPagamento.pagamento.valorMensal,
            valorTotal: formaPagamento.preco,
            quantidadePago: 0,
        }
        let aluguel = {
            idGaragem: garagem.id,
            garagem: {
                chat: chat,
                veiculo: veiculo
            }
        }

        // nome que vai ficar no banco de dados da garagem
        return aluguel;
    }
    destinoLocatario = async () => {
        const garagem = this.garagem;
        const locador = await Services.getLocador(garagem.idAnunciante);
        const alugar = this.alugar;
        const formaPagamento = this.formaPagamento;

        // console.log(`Obtendo o Locador...: ${JSON.stringify(locador)}`);

        // replicado, mas para uso na tela de listar os contatos
        let conversas = [{
            nomeLocador: locador.nome,
            fotoLocador: locador.foto,
            chat: []
        }];
        let contratos = [];
        if (formaPagamento.pagamento.tipo === 'Dinheiro'){
            contratos = [{
                idLocador: garagem.idAnunciante,
                nomeLocador: locador.nome,
                celular: locador.celular,
                idGaragem: garagem.id,
                fotoGaragem: garagem.foto,
                fotoLocador: locador.foto,
                enderecoGaragem: garagem.rua+' '+garagem.numero,
                aluguelPago: false,
                valorTotal: formaPagamento.preco,
                formaPagamento: formaPagamento.pagamento.tipo,
                // valorMensal: formaPagamento.pagamento.valorMensal,
                // vencimento: formaPagamento.pagamento.vencimento,
                dataInicial: alugar.contrato.inicio,
                dataFinal: alugar.contrato.fim,
                dataTotal: alugar.contrato.dataTotalizada,
            }];
        } else {
            contratos = [{
                idLocador: garagem.idAnunciante,
                nomeLocador: locador.nome,
                celular: locador.celular,
                fotoGaragem: garagem.foto,
                fotoLocador: locador.foto,
                // aluguelAceito: true,
                enderecoGaragem: garagem.rua+' '+garagem.numero,
                aluguelPago: false,
                formaPagamento: formaPagamento.pagamento.tipo,
                valorTotal: formaPagamento.preco,
                valorMensal: formaPagamento.pagamento.valorMensal,
                diaVencimento: formaPagamento.pagamento.vencimento,
                dataInicial: alugar.contrato.inicio,
                dataFinal: alugar.contrato.fim,
                dataTotal: alugar.contrato.dataTotalizada,
            }];
        }
        // let pagamento = {
        //     diaVencimento: formaPagamento.pagamento.vencimento,
        //     formaPagamento: formaPagamento.pagamento.tipo,
        // }
        let veiculo = {
            foto: {local: '', remoto: ''},
            cor: alugar.carro.cor,
            modelo: alugar.carro.modelo,
            placa: alugar.carro.placa,
            alugado: true,
        }
        let dados = {
            contratos: contratos,
            conversas: conversas,
            veiculo: veiculo
            // formaPagamento: pagamento,
        };
        return dados;
    }

    criarAluguel = async () => {
        let termino = false;
        try {

            // console.log('----------------------------------------------- Ini --------------');
            let novoAluguel = this.destinoGaragem();
            termino = await Services.alugarGaragemLocador(novoAluguel);
            if (termino){
                // console.log(`Tudo certo no aluguel:  ${JSON.stringify(novoAluguel)}`);

                // console.log('------------------------------------------------------------------');
                
                let novoContrato = await this.destinoLocatario();
                termino = await Services.ajustarAlugelLocatario(novoContrato);
                if (termino){
                    // console.log(`Tudo certo no contrato:  ${JSON.stringify(novoContrato)}`);
                    this.props.navigation.navigate('Alugueis');
                } else {
                    this.props.navigation.navigate('Pagamento');
                }
                // console.log('----------------------------------------------- Fim --------------');
            } else {
                this.props.navigation.navigate('Pagamento');
            }

        } catch (error){
            console.log(`Erro para alugar: ${error.message}`);
            alert('Erro para alugar a garagem!');
            this.props.navigation.navigate('Pagamento');
            return;
        }
    }

    criarConta = async () => {
        let valido = false;
        try {
            valido = await Services.criarConta();
            if (valido){
                this.props.navigation.navigate('Mapa');
            } 
            else {
                this.props.navigation.navigate('Contato');
            }

        } catch (err){
            log(`Erro para criar conta: ${err}`)
            return this.props.navigation.navigate('Foto');
        }
    }

    render(){
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Lottie resizeMode="contain" source={carregamento} autoSize autoPlay loop />
            </SafeAreaView>
        );
    }
}