import React, { Component } from 'react';
import { ReactComponent as LogoCovid } from '../../assets/banner-covid-19.svg';
import "./style.css";

export default class SplashPage extends Component {
	constructor(props){
        super(props);
        this.state = {};
    }

	render(){
		return <div id="SplashPage">
			<LogoCovid />
		</div>
	}
}