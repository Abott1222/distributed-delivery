import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Options} from "./model/api";
import {Api} from "./service/Api"
// The wrapper exports only a default component class that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props). All other
// interfaces like Options come from the Highcharts module itself.

const options: Highcharts.Options = {
    title: {
        text: 'My chart'
    },
    series: [{
        type: 'line',
        data: [1, 2, 3]
    }]
}

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

export interface Props { data: number[] }; 
export interface State { 
  session_token: number,
  loading:boolean,
};


class App extends React.Component<Props, State> {
  private api:Api;

  constructor(props:any) {
    super(props);
    window.localStorage.removeItem('session_token');
    this.api = new Api({});

    this.state = {
      session_token: 0,
      loading:true,
    }
  }




  componentWillMount() {
    this.api.login()
      .then((token:number) => {
        this.setState({session_token: token, loading:false});
      })
      .catch(e => {
        console.error(e);
      }) 

  }



  // componentWillUnmount() {
  //   this.loginOrLogout()
  // }

  fetchData() {
    const TODAY = new Date().getTime() / 1000;
    let data:any;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    let urlencoded = new URLSearchParams();
    let requestOptions:Options;
    let token = localStorage.getItem('session_token')
    if(token) {
      urlencoded.append("session_token", token);
      urlencoded.append("from", TODAY.toString());
      urlencoded.append("to", TODAY.toString());

        requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
        };

        fetch("http://localhost:3000/bandwidth", requestOptions)
          .then(response => response.text())
          .then(result => {
            data = result;
            console.log(data);
          })
          .catch(error => console.log('error', error))
    }
    

    


  }



  // END FETCH API

  render() {
    if(this.state.loading === false) {
      this.fetchData();
    }
    return (
      <React.Fragment>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          //{...data}
        />
      </React.Fragment>
    )
  }
}




export default App;