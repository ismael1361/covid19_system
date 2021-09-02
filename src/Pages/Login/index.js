import React, { Component } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';

import { UserHelper } from '../../Helper';

import "./style.css";

export default class LoginPage extends Component {
	constructor(props){
        super(props);
        this.state = {
        	type: 1,
        	title: "Login",
        	loading: false,
        	aviso: "",
        	nome: "",
        	email: "",
        	senha: "",
        	senha2: ""
        };
    }

    acessarConta(){
    	const {email, senha} = this.state;

    	this.setState({aviso: "", loading: true});
    	if(senha.length < 8){
    		this.setState({aviso: "A senha deve possuir no mínimo 8 caracteres!", loading: false});
    		return;
    	}

    	UserHelper.login(email, senha).then(()=>{
    		this.setState({aviso: "", loading: true});
    		window.routerHistory.go("/");
    	}).catch((e)=>{
    		this.setState({aviso: e, loading: false});
    	});
    }

    criarConta(){
    	const {nome, email, senha, senha2} = this.state;

    	this.setState({aviso: "", loading: true});
    	if(nome.length < 2){
    		this.setState({aviso: "Preencha o campo NOME corretamente!", loading: false});
    		return;
    	}
    	if(senha.length < 8){
    		this.setState({aviso: "A senha deve possuir no mínimo 8 caracteres!", loading: false});
    		return;
    	}
    	if(senha !== senha2){
    		this.setState({aviso: "As senhas estão diferentes, verifiquei-os novamente", loading: false});
    		return;
    	}

    	UserHelper.criarUsuario({name: nome, email}, senha).then(()=>{
    		this.setState({type: 1, aviso: "", loading: false});
    	}).catch((e)=>{
    		this.setState({aviso: e, loading: false});
    	});
    }

    getBtns(){
    	if(this.state.type === 1){
    		return [
    			<Button disabled={this.state.loading} key="btn_01" onClick={()=>{this.setState({type: 2});}}>Criar conta</Button>,
				<Button disabled={this.state.loading} key="btn_02" onClick={()=>{this.acessarConta()}} variant="contained" color="primary">Entrar</Button>
			];
    	}else{
    		return [
    			<Button disabled={this.state.loading} key="btn_03" onClick={()=>{this.setState({type: 1});}}>Voltar</Button>,
				<Button disabled={this.state.loading} key="btn_04" onClick={()=>{this.criarConta()}} variant="contained" color="secondary">Criar conta</Button>
			];
    	}
    }

    getAviso(){
    	if(!this.state.aviso || this.state.aviso === ""){
    		return null;
    	}

    	return <div className="alert">{this.state.aviso}</div>
    }

	render(){
		const {nome, email, senha, senha2} = this.state;

		return <div id="LoginPage">
			{this.getAviso()}
			<Typography variant="h5" gutterBottom>{this.state.title}</Typography>

			{this.state.type !== 1 ? <TextField 
				disabled={this.state.loading} 
				fullWidth color="primary" 
				label="Nome" variant="outlined" 
				value={nome}
				onChange={({target})=>{
					this.setState({nome: target.value});
				}}
			/> : null}

			<TextField 
				disabled={this.state.loading} 
				fullWidth color="primary" 
				label="E-mail" type="email" 
				variant="outlined"
				value={email}
				onChange={({target})=>{
					this.setState({email: target.value});
				}}
			/>

			<TextField 
				disabled={this.state.loading} 
				fullWidth color="primary" label="Senha" 
				type="password" variant="outlined"
				value={senha}
				onChange={({target})=>{
					this.setState({senha: target.value});
				}}
			/>

			{this.state.type !== 1 ? <TextField 
				disabled={this.state.loading} 
				fullWidth color="primary" label="Repita a senha"
				type="password" variant="outlined"
				value={senha2}
				onChange={({target})=>{
					this.setState({senha2: target.value});
				}}
			/> : null}

			<div className="btnsGroup">
				{this.getBtns()}
			</div>
		</div>
	}
}