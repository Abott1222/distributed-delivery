import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Options, APIBandwidthResp} from "./model/api";
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

interface Props { data: number[] }; 
interface State { 
  session_token: number,
  loading:boolean,
  data: APIBandwidthResp,
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
      data: {p2p: [], cdn: []},
    }
  }




  componentWillMount() {
    this.api.login()
      .then((token:number) => {
        this.setState({session_token: token, loading:false});
        this.api.fetchData()
          .then((data:APIBandwidthResp) => {
            this.setState({data: data});
          })
          .catch(e => {
            console.error(e);
          })
        })
        .catch(e => {
          console.error(e);
        }) 

  }





  componentWillUnmount() {
    //TODO add logout functionality
    //this.api.logout()
  }


  render() {
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