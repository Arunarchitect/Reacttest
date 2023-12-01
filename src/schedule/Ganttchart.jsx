import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './styles/Chart.css'
import 'chartjs-adapter-date-fns';


const Ganttchart = () => {
  const chartRef = useRef(null);


  useEffect(() => {
    // setup
    const data = {
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Weekly Sales',
        data: [
            {x: ['2023-11-30','2023-12-06'], y:'Task 1', name:'Arun', status: 2},
            {x: ['2023-12-06','2023-12-12'], y:'Task 2', name:'Anumol', status: 1},
            {x: ['2023-12-09','2023-12-12'], y:'Task 3', name:'Dalia', status: 0},
            {x: ['2023-12-12','2023-12-15'], y:'Task 4', name:'John', status: 2},
            {x: ['2023-12-15','2023-12-17'], y:'Task 5', name:'George', status: 1},
            {x: ['2023-12-17','2023-12-19'], y:'Task 6', name:'Arun', status: 2}
        ],
        backgroundColor: [
          'rgba(255, 26, 104, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 0, 0, 0.2)'
        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 0, 0, 1)'
        ],
        borderWidth: 1,
        borderSkipped: false,
        borderRadius : 10,
        barPercentage : 0.5,
      }]
    };



    // todayline plugin block, here new Date is the todays Date, if this -new Date('2023-12-09')- is blank it will show the current date, ie new Date()
    const todayLine = {
        id:'todayline',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const {ctx, data, chartArea:{top, bottom, left , right}, scales:{x,y}} = chart;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle =  'rgba(255, 159, 64, 1)';
            ctx.setLineDash([6,6]);
            ctx.moveTo(x.getPixelForValue(new Date('2023-12-09')),top);
            ctx.lineTo(x.getPixelForValue(new Date('2023-12-09')),bottom);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    // status plugin block
    const  status = {
        id: 'status',
        afterDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea:{top, bottom, left , right}, scales:{x,y}} = chart;
            const icons = ['\uf00d','\uf110','\uf00c'];
            const colors = ['green',
                            'yellow',
                            'red',]
            const angle = Math.PI /180;
            ctx.save()
            ctx.font = 'bolder 12px FontAwesome';
            
            ctx.textBaseLine = 'middle';
            ctx.textAlign = 'center';
            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.beginPath();
                ctx.fillStyle = colors[datapoint.status];
                ctx.arc(right + 50,y.getPixelForValue(index), 20, 0,angle*360, false);
                ctx.closePath()
                ctx.fill()
                ctx.fillStyle = 'black';
                ctx.fillText(icons[datapoint.status], right + 50, y.getPixelForValue(index));
            })
            ctx.restore()
        }
    }


    // assignedTasks plugin block
    const assignedTasks = {
        id: 'assignedTasks',
        afterDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data, chartArea:{top, bottom, left , right}, scales:{x,y}} = chart;
            ctx.save()
            ctx.font = 'bolder 12px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textBaseLine = 'middle';
            // ctx.textAlign = 'left';
            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.fillText(datapoint.name, 10, y.getPixelForValue(index));
            })
            ctx.restore()
            
        }
    }


    // config
    const config = {
      type: 'bar',
      data,
      options: {
        layout: {
            padding : {
                left:100,
                right:100,
            }
        },
        indexAxis : 'y',
        scales: {
          x: {
            position:'top',
            type: 'time',
            time: {
                unit:'day'
            },
            min: '2023-11-30',
            max: '2023-12-22'
          }
        },
        plugins:{
            legend : {
                display:false,
            }
        }
      },
      plugins: [todayLine, assignedTasks, status]
    };


    // destroy existing chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }


    // render init block
    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, config);


    // Instantly assign Chart.js version
    document.getElementById('chartVersion').innerText = Chart.version;
  }, []); // empty dependency array ensures useEffect runs only once


  return (
    <div>
      <div className="chartMenu">
        <p>CHart created using chartjs version ( <span id="chartVersion"></span>)</p>
      </div>
      <div className="chartCard">
        <div className="chartBox">
          <canvas id="myChart" ></canvas>
        </div>
      </div>
    </div>
  );
};


export default Ganttchart;
