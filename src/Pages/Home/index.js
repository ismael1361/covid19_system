import React, { Component } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { Chart } from '../../Components';

import { UserHelper, CovidHelper } from '../../Helper';

import Icon from '@mdi/react';
import { mdiExitToApp } from '@mdi/js';

import "./style.css";

export default class HomePage extends Component {
	constructor(props){
    super(props);
    this.state = {
    	resumo: null
    };
  }

  componentDidMount(){
  	CovidHelper.getSummary().then((r)=>{
  		console.log(r);
  		this.setState({
  			resumo: r
  		});
  	}).catch(console.log);
  }

  sairDoSistema(){
  	UserHelper.logout().then((r)=>{
  		window.routerHistory.go("/Login");
  	}).catch(console.log);
  }

  getColorPercent(percentual){
  	return (percentual > 0) ? "#f44336" : "#2e7d32";
  }

  getResumoCard(index){
  	return <div className="resumo-card">
			<Typography variant="h6" gutterBottom style={{fontWeight: 'bold', color: '#212121'}}>Média Móvel entre:</Typography>

			<div className="timeline">

				<Typography variant="overline" gutterBottom>{new Date(this.state.resumo?.mediaMovel[index].start).toLocaleDateString()}</Typography>

				<div className="separator"></div>

				<Typography variant="overline" gutterBottom>{new Date(this.state.resumo?.mediaMovel[index].end).toLocaleDateString()}</Typography>

			</div>

			<Typography variant="h3" gutterBottom style={{fontWeight: 'bold', textAlign: 'center', marginBottom: 15}}>{new Intl.NumberFormat("pt-BR").format(this.state.resumo?.mediaMovel[index].Deaths)}</Typography>

			<div style={{display: "flex", alignItems: 'center'}}>
				<Typography variant="subtitle2" gutterBottom style={{flex: 1}}>Percentual refente a semana anterior:</Typography>

				<Typography variant="h6" gutterBottom style={{fontWeight: 'bold', paddingLeft: 10, textAlign: 'center', color: this.getColorPercent(this.state.resumo?.mediaMovel[index].percentageDeaths)}}>{Number(this.state.resumo?.mediaMovel[index].percentageDeaths).toFixed(2)}%</Typography>
			</div>

			<div className="card-list">
				{this.state.resumo?.data[index].Deaths.map((value)=>{
					return <div>
						<Typography variant="caption" gutterBottom style={{flex: 1}}>
							{new Date(value[0]).toLocaleDateString()}
						</Typography>

						<Typography variant="caption" gutterBottom style={{fontWeight: 'bold'}}>
							{value[1]}
						</Typography>
					</div>
				})}
			</div>
		</div>
  }

	render(){
		return <div id="HomePage">
			<div style={{display: "flex", alignItems: 'center', marginBottom: 50, userSelect: 'none'}}>
				<Typography variant="h3" gutterBottom style={{flex: 1, color: "rgba(255, 255, 255, .8)", fontWeight: 'bold', margin: 0}}>
	        COVID-19 no Brasil
	      </Typography>
	      <div className="btn-exit" onClick={this.sairDoSistema}>
		      <Icon path={mdiExitToApp}
		        size={1.2}
		        horizontal
		        vertical
		        color="#263238"
		      />
	      </div>
			</div>
			

			{!this.state.resumo ? null : 
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						{this.getResumoCard(0)}
					</Grid>
					<Grid item xs={12} sm={6}>
						{this.getResumoCard(1)}
					</Grid>
				</Grid>
			}

			<div className="chart-area">
				<Chart type="mortes"/>
			</div>
			<div className="chart-area">
				<Chart type="casos"/>
			</div>
			<div className="chart-area">
				<Chart type="recuperados"/>
			</div>
		</div>
	}
}