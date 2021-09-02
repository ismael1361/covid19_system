import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { UserHelper, CovidHelper } from './Helper';

import { Splash, Home, Login } from "./Pages";

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

window.routerHistory = history;

export default class Root extends Component {
    constructor(props){
        super(props);
        this.state = {
        	isLoaded: false,
        };
    }

    componentDidMount(){
    	this.containsUser();
    }

    containsUser(){
        const fn = async ()=>{
            await CovidHelper.getData();

            UserHelper.getUser().then((u)=>{
                let isLoginPage = window.location.pathname.replace(/^\//gi, "").search("login") === 0;
                if(isLoginPage){
                    history.push("/");
                }
                this.setState({isLoaded: true});
            }).catch(()=>{
                history.push("/login");
                this.setState({isLoaded: true});
            });
        }
        
        fn();
    }

    render(){
    	if(this.state.isLoaded){
            return <Router history={history}>
                <Switch>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/" exact component={Home}/>
                </Switch>
            </Router>;
        }else{
	    	return <Splash/>
	    }
    }
}