import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state= {
      user:null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    })
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(`${result.user.email} ha iniciado sesion`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout(){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha salido`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage  = (snapshot.byteTransfrred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message);
    }, ()=>{
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    } );
  }

  renderLoginButton(){
    //usuario logueado
    if (this.state.user) {
      return(
        <div>
        <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
        <p> Hola  {this.state.user.displayName} </p>
        <button onClick={this.handleLogout}>Salir</button>
        <FileUpload onUpload={this.handleUpload} />
        {
          this.state.pictures.map(picture => (
            <div>
               <br/>
               <div>
               <img width="100" src={picture.photoURL} alt={picture.displayName} /><span>{picture.displayName}</span>
               </div>
               <img width="500" src={picture.image} alt="" />
               <br/>

            </div>
          )).reverse()
        }
        </div>
      );
    }else{
      return(
      <button onClick={this.handleAuth}>Log in con Google</button>
    );
    }
    //no logueado
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>React y Firebase</h2>
        </div>
        <p className="App-intro">
          {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
