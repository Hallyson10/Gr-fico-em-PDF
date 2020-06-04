import React,{ useState , useEffect,Component} from 'react';
import logo from './logo.svg';
import './App.css';
import HighchartsReact from 'highcharts-react-official';
import * as jsPDF from 'jspdf'

import Highcharts from 'highcharts';
import html2canvas from 'html2canvas';

export default class App extends Component{
  constructor(props) {
    super(props);

    this.state = {
      // To avoid unnecessary update keep all options in the state.
      chartOptions: {
        xAxis: {
          categories: ['A', 'B', 'C','D','E','F','G','H'],
        },
        series: [
          { data: [1, 2, 3,4,5,6,7,8 ] }
        ],
        plotOptions: {
          series: {
            point: {
              events: {
                mouseOver: this.setHoverData.bind(this)
              }
            }
          }
        }
      },
      hoverData: null
    };
  }

  setHoverData = (e) => { 
    // The chart is not updated because `chartOptions` has not changed.
    this.setState({ hoverData: e.target.category })
  }

  updateSeries = () => {
    // The chart is updated only with new options.
    this.setState({ 
      chartOptions: {
        series: [
          { data: [Math.random() * 5, 2, 1]}
        ]
      }
    });
  }
  //salva a imagem em pdf
  saveImagePdf = () => {
    //pega todo o body e renderiza como canvas
    html2canvas(document.body).then(function(canvas) {
        console.log(canvas)
        //transformando o canvas em baseURL64 no formato png
        var imgData = canvas.toDataURL('image/png');
        /*definindo o tamanho e direcionamento do papel onde vai ser inserido a imagem,nesse caso
        p = portrait 
        l = landscape
        3 º parametro no lugar de 'A4', pode colocar um array onde determina os tamanhos de altura e largura[297, 210]
        tem outras opções pesquisa ai as configurações possíveis pra esse jsPDF
        */
        var pdf = new jsPDF('p','mm','a4');
        //salvando a imagem no pdf, esses tamanhos tem que ver,são os tamanhos de altura e largura pelo que eu percebi
        pdf.addImage(imgData, 'PNG', 10, 10,210,297);
        //baixando
        pdf.save('testeGrafico.pdf')
    });
  }

  render() {
    const { chartOptions, hoverData } = this.state;
    
    return (
      <div style={{display:'flex',flexDirection:'column',width:'90%',left:0,right:0,height:'100%'}}>
      <div style={{flexDirection:'row',marginBottom:20,justifyContent:'space-between',alignItems:'center',display:'flex'}}>
      <div style={{width:'80%'}}>
      <h4 style={{margin:0,paddingLeft : 20,marginTop:20}}>Relatório Financeiro Temporal</h4>
      <h5 style={{margin:0,paddingLeft : 20}}>GPF : 123456 | RELATÓRIO</h5>
      <h6 style={{margin:0,paddingLeft : 20}}>Referente a 01/01/2020 - 03/06/2020</h6>
      </div>
      <div style={{display:'flex',width:'20%',alignItems:'center',justifyContent:'flex-end',paddingRight:20}}>
        <h2>HJGM</h2>
      </div>
      </div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      <h3 style={{marginLeft:20}}>Hovering over {hoverData}</h3>
      <button style={{marginLeft:20}} onClick={this.updateSeries.bind(this)}>Update Series</button>
      <button style={{marginLeft:20}} onClick={this.saveImagePdf}>Salvar pdf</button>
      </div>
    )
  }
}
