import * as firebase from "firebase";

const User = {
	id: "",
	name: "",
	email: "",
	dataCriacao: (new Date().getTime())
}

export default class UserHelper{
	static getUser(){
		return new Promise(async (resolve,reject)=>{
			const currentUser = firebase.auth().currentUser;
			if(currentUser){
                let snap = await firebase.database().ref("Usuarios").child(currentUser.uid).once("value").catch(err=>{console.log(err)});
                if(snap){
                    let user = Object.assign(User, snap.val());
                    user.id = snap.ref.path.toString().replace(/\/$/gi).split("/").pop();
                    resolve(user);
                }else{
                    reject("Erro na tentativa de buscar o usuário!");
                }
            }else{
            	firebase.auth().onAuthStateChanged(async (user)=>{
                    if(user){
                        let snap = await firebase.database().ref("Usuarios").child(user.uid).once("value").catch(err=>{console.log(err)});

                        if(snap){
                           	let user = Object.assign(User, snap.val());
                    		user.id = snap.ref.path.toString().replace(/\/$/gi).split("/").pop();
                            resolve(user);
                        }else{
                            reject("Erro na tentativa de buscar o usuário!");
                        }
                    }else{
                        reject("Erro na tentativa de buscar o usuário!");
                    }
                })
            }
		});
	}

	static login(email, password){
		return new Promise((resolve, reject)=>{
			let validEmail = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/).exec(email);
			if(!validEmail){
	            reject("E-mail inválido!");
				return;
			}

			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(async (result)=>{
                this.getUser().then(resolve).catch(()=>{
                    this.logout();
                });
			})
			.catch((err)=>{
				let errMss = "E-mail ou senha incorretos!";
				if(err.code.search("invalid-email") >= 0){
				errMss = "E-mail incorreto, tente novamente!";
				}else if(err.code.search("wrong-password") >= 0){
				errMss = "Senha incorreta, tente novamente!";
				}else if(err.code.search("user-disabled") >= 0){
				errMss = "Esse e-mail se encontra desativado!";
				}else if(err.code.search("user-not-found") >= 0){
				errMss = "Esse e-mail não existe, tente novamente!";
				}
	            reject(errMss);
			});
		});
	}

	static logout(){
		return new Promise(async (resolve,reject)=>{
	        await firebase.auth().signOut().catch(console.log);
	        resolve();
	    });
    }

	static criarUsuario(user, password){
        return new Promise(async (resolve,reject)=>{
		    if(!user.email){
		        reject("E-mail não foi informado corretamente!");
		        return;
		    }

		    firebase.auth().createUserWithEmailAndPassword(user.email, password).then(userRec=>{
            	let uid = userRec.user.uid;
                
                user.dataCriacao = new Date().getTime();
                user.id = uid;

                firebase.database().ref("Usuarios").child(uid).set(user)
                .then(async ()=>{
                	await this.logout();
                    resolve(user);
                })
                .catch(err=>{
                    reject("Erro ao salvar dados do usuário.");
                })
            })
            .catch(err=>{
                reject("Erro ao criar usuário.");
            })
        });
    }
}