import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import { CovidHelper } from "../../Helper";
import { Typography, Grid } from '@material-ui/core';

export default class Chart_ extends Component{
	constructor(props){
        super(props);
        this.state = {
        	data: [],
        	title: "",
        	total: 0,
        	ultimoValor: 0,
        	mediaMovel: 0,
        	percentualMediaMovel: 0
        };
    }

    componentDidMount(){
    	let { type } = this.props;
    	type = ["mortes", "casos", "recuperados"].includes(type) ? type : "casos";

    	let title = type === "mortes" ? "Índice de Mortes" : type === "recuperados" ? "Índice de Casos Recuperados" : "Índice de Casos";

    	let total = 0;
    	let ultimoValor = 0;
    	let mediaMovel = 0;
    	let percentualMediaMovel = 0;

    	CovidHelper.getData().then((d)=>{
    		let data = [['Data', 'Casos', 'Média Móvel']];

    		data[0][1] = type === "mortes" ? "Mortes" : type === "recuperados" ? "Recuperados" : "Casos";

    		let key = type === "mortes" ? 'Deaths' : type === "recuperados" ? 'Recovered' : 'Confirmed';

    		ultimoValor = d[d.length-1][key];

    		d.forEach((v, index)=>{
    			const date = new Date(v.Date);
    			let dateMin = new Date();

    			total += v[key];

    			dateMin = new Date(dateMin.getFullYear(), dateMin.getDate(), dateMin.getMonth()-6);
    			if(dateMin > date){
    				return;
    			}

    			let r = [];

	    		r[0] = date;
	    		r[1] = v[key];
	    		r[2] = 0;

	    		if(index > 7){
	    			for(let i=index-7; i<index; i++){
	    				r[2] += d[i][key];
	    			}
	    			r[2] = Math.round(r[2]/7);
	    		}

    			data.push(r);
    		});

    		mediaMovel = (data[data.length-1][2] || 0);
    		let primeiro = (data[data.length-1][2] || 0);
    		let ultimo = (data[data.length-8][2] || 0);
    		let dif = primeiro-ultimo;

    		percentualMediaMovel = ultimo === 0 ? 0 : (dif/ultimo)*100;

    		this.setState({
    			data: data, 
    			title: title, 
    			total: new Intl.NumberFormat("pt-BR").format(total),
    			ultimoValor: new Intl.NumberFormat("pt-BR").format(ultimoValor),
    			mediaMovel: new Intl.NumberFormat("pt-BR").format(mediaMovel),
    			percentualMediaMovel: percentualMediaMovel
    		});
    	});
    }

    getSeriesColor(){
    	let { type } = this.props;
    	type = ["mortes", "casos", "recuperados"].includes(type) ? type : "casos";

    	switch(type){
    		case "mortes":
    			return {
					0:{
						color: '#607d8b'
					},
					1:{
					    color: '#f44336',
					    type: 'line'
					}
				}
			case "recuperados":
    			return {
					0:{
						color: '#64b5f6'
					},
					1:{
					    color: '#4caf50',
					    type: 'line'
					}
				}
			default:
    			return {
					0:{
						color: '#f06292'
					},
					1:{
					    color: '#9c27b0',
					    type: 'line'
					}
				}
    	}
    }

    getColorPercent(){
    	let { type } = this.props;
    	type = ["mortes", "casos", "recuperados"].includes(type) ? type : "casos";

    	if(this.state.percentualMediaMovel > 0){
    		return type === "recuperados" ? "#2e7d32" : "#f44336";
    	}else{
    		return type === "recuperados" ? "#f44336" : "#2e7d32";
    	}
    }

	render(){
		return <div style={{ display: 'flex', flexDirection: 'column', minHeight: 150}}>
			<Grid container spacing={3} style={{ padding: '0 20px', alignItems: 'center' }}>
				<Grid item xs={12} sm={7}>
		        	<Typography 
						variant="h4" gutterBottom 
						style={{color: "#212121", margin: 0}}
					>{this.state.title}</Typography>

					<Typography 
						variant="subtitle1" gutterBottom 
						style={{color: "#616161"}}
					>{"Nos últimos seis meses"}</Typography>
		        </Grid>
		        <Grid item xs={12} sm={5} style={{ display: 'flex', justifyContent: 'flex-end', overflowX: 'auto' }}>
			        <div style={{ minWidth: 100}}>
			        	<Typography 
							variant="h4" gutterBottom 
							style={{color: "#212121", margin: 0}}
						>{this.state.total}</Typography>
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
							<Typography 
								variant="h6" gutterBottom 
								style={{color: "#424242", margin: 0}}
							>{this.state.ultimoValor}</Typography>
							<Typography 
								variant="h6" gutterBottom 
								style={{color: (this.getColorPercent()), margin: 0}}
							>{new Intl.NumberFormat("pt-BR").format(this.state.percentualMediaMovel.toFixed(2))}%</Typography>
						</div>
					</div>
		        </Grid>
			</Grid>

			<Chart
				width={'100%'}
				height={'300px'}
				chartType="ComboChart"
				loader={<div>Loading Chart</div>}
				data={this.state.data}
				options={{
					hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
					vAxis: { minValue: 0, direction: 1 },
					chartArea: { left: 80, top: 20, bottom: 80, width: '100%', height: '100%' },
					backgroundColor: 'transparent',
					legend: { alignment: 'start', position: 'bottom' },
					focusTarget: 'category',
					seriesType: 'area',
    				series: this.getSeriesColor()
				}}
			/>
		</div>
	}
}