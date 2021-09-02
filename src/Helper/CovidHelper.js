import * as firebase from "firebase";
import UserHelper from "./UserHelper";

export default class CovidHelper{
	static getData(){
		return new Promise((resolve, reject)=>{
			if(window.__data_covid?.length > 0){
				resolve(window.__data_covid);
				return;
			}

			let fn = (a, b)=>{
				return Math.max(a-b, 0);
			}

			fetch('https://api.covid19api.com/dayone/country/brazil').then((resp)=>{
				var contentType = resp.headers.get("content-type");
				if(contentType && contentType.indexOf("application/json") !== -1){
					return resp.json();
				}else{
					reject("Erro ao requisitar os dados da COVID-19!");
				}
			}).then((json)=>{
				let r = [json[0]];

				let date = new Date(),
						currentMonth = date.getMonth(),
						maxInMonth = {
							"Deaths": 0,
							"Confirmed": 0,
							"key": (date.getFullYear()+"_"+(date.getMonth()+1)),
							"dataDeConsulta": (new Date().toISOString())
						};

				for(let i=1; i<json.length; i++){
					let a = JSON.parse(JSON.stringify(json[i-1]));
					let n = JSON.parse(JSON.stringify(json[i]));

					let month = new Date(n["Date"]).getMonth();
					if(month === currentMonth){
						maxInMonth['Deaths'] = Math.max(maxInMonth['Deaths'], fn(n.Deaths, a.Deaths));
						maxInMonth['Confirmed'] = Math.max(maxInMonth['Confirmed'], fn(n.Confirmed, a.Confirmed));
					}

					r.push(Object.assign(n, {
						"Confirmed": fn(n.Confirmed, a.Confirmed),
						"Deaths": fn(n.Deaths, a.Deaths),
						"Recovered": fn(n.Recovered, a.Recovered),
						"Active": fn(n.Active, a.Active),
					}));
				}

				UserHelper.getUser().then(async (user)=>{
					await firebase.database().ref("Consultas").child(user.id+"/"+maxInMonth.key).set(maxInMonth);
				}).catch(console.log);

				window.__data_covid = r;
				resolve(r);
			}).catch((e)=>{
				reject("Erro ao requisitar os dados da COVID-19!");
			})
		});
	}

	static getSummary(){
		return new Promise((resolve, reject)=>{
			this.getData().then((data)=>{
				let result = {
					mediaMovel: [],
					data: []
				};

				let days = 7, weeks = 2;

				for(let j=weeks; j>=0; j--){
					let end = (data.length-(j*days));
					let start = end-days;

					if(isNaN(result.mediaMovel[j])){
						result.mediaMovel[j] = {};
					}

					if(isNaN(result.data[j])){
						result.data[j] = {};
					}

					for(let i=start; i<end; i++){
						["Confirmed", "Deaths", "Recovered", "Active"].forEach((k)=>{
							result.mediaMovel[j][k] = isNaN(result.mediaMovel[j][k]) ? 0 : result.mediaMovel[j][k];
							result.mediaMovel[j][k] += data[i][k];

							if(!Array.isArray(result.data[j][k])){
								result.data[j][k] = [];
							}

							result.data[j][k].push([
								(new Date(data[i]['Date'])),
								data[i][k]
							]);
						});
					}

					result.mediaMovel[j].start = new Date(data[start]['Date']);
					result.mediaMovel[j].end = new Date(data[end-1]['Date']);
				}

				result.mediaMovel.reverse();
				result.data.reverse();

				result.mediaMovel = result.mediaMovel.map((v, i, l)=>{
					["Confirmed", "Deaths", "Recovered", "Active"].forEach((k)=>{
						v[k] = Math.round(v[k]/days);

						if(i > 0){
							v["percentage"+k] = ((v[k]-l[i-1][k])/v[k]) * 100 || 0;
						}
					});

					return v;
				});

				result.mediaMovel.shift();
				result.data.shift();

				resolve(result);
			}).catch(reject);
		});
	}
}