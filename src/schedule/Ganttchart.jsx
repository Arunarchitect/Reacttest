import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './styles/Chart.css'
import 'chartjs-adapter-date-fns';


const Ganttchart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // setup
    const colors = ['red','yellow','green']
    const data = {
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Weekly Sales',
        data: [
            {x: ['2023-11-28','2023-11-30'], y:'Task 1', name:'Arun', status: 2},
            {x: ['2023-11-30','2023-12-09'], y:'Task 2', name:'Anumol', status: 1},
            {x: ['2023-12-09','2023-12-12'], y:'Task 3', name:'Dalia', status: 0},
            {x: ['2023-12-12','2023-12-15'], y:'Task 4', name:'John', status: 2},
            {x: ['2023-12-15','2023-12-17'], y:'Task 5', name:'George', status: 1},
            {x: ['2023-12-17','2023-12-19'], y:'Task 6', name:'Arun', status: 2}
        ],
        backgroundColor: (ctx) => {
          return colors[ctx.raw.status]
        },
        // borderColor: (ctx) => {
        //   console.log(ctx.raw.status);
        //   return colors[ctx.raw.status]
        // },
        // borderWidth: 1,
        borderSkipped: false,
        borderRadius : 10,
        barPercentage : 0.2,
      }]
    };



    // todayline plugin block, here new Date is the todays Date, if this -new Date('2023-12-09')- is blank it will show the current date, ie new Date()
    const todayLine = {
        id:'todayline',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const {ctx, data, chartArea:{top, bottom, left , right}, scales:{x,y}} = chart;
            ctx.save();
            
            if (x.getPixelForValue(new Date()) >= left && x.getPixelForValue(new Date()) <= right){
              ctx.beginPath();
              ctx.lineWidth = 3;
              ctx.strokeStyle =  'black';
              ctx.setLineDash([6,6]);
              ctx.moveTo(x.getPixelForValue(new Date()),top);
              ctx.lineTo(x.getPixelForValue(new Date()),bottom);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.beginPath();
              ctx.lineWidth = 3;
              ctx.strokeStyle =  'black';
              ctx.fillStyle =  'black';
              ctx.moveTo(x.getPixelForValue(new Date()),top + 5);
              ctx.lineTo(x.getPixelForValue(new Date()) - 6,top-6);
              ctx.lineTo(x.getPixelForValue(new Date()) + 6,top-6);
              ctx.closePath();
              ctx.stroke();
              ctx.fill();
              ctx.restore();
              ctx.font = 'bold 12px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('Today', x.getPixelForValue(new Date()),bottom + 12)
              ctx.restore();
            }
            
        }
    }

    // status plugin block
    const  status = {
        id: 'status',
        afterDatasetsDraw(chart, args, pluginOptions){
            const {ctx, data,options, chartArea:{top, bottom, left , right}, scales:{x,y}} = chart;
            const icons = ['\uf00d','\uf110','\uf00c'];
            
            const angle = Math.PI /180;
            const paddingRight = options.layout.padding.right;
            ctx.save()
            ctx.font = 'bolder 10px FontAwesome';
            
            ctx.textBaseLine = 'middle';
            ctx.textAlign = 'center';
            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.beginPath();
                ctx.fillStyle = colors[datapoint.status];
                ctx.arc(right + (paddingRight/2),y.getPixelForValue(index), 12, 0,angle*360, false);
                ctx.closePath()
                ctx.fill()
                ctx.fillStyle = 'black';
                ctx.fillText(icons[datapoint.status], right + (paddingRight/2), y.getPixelForValue(index));
            })
            ctx.font = 'bolder 12px sans-serif';
            ctx.fillStyle = 'black';
            ctx.fillText('Persons', right + (paddingRight/2) ,top-15);
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
            ctx.textAlign = 'left';
            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.fillText(datapoint.name, 10, y.getPixelForValue(index));
            })
            ctx.fillText('Persons', 10 ,top-15);
            ctx.restore()
            
        }
    }

    //plugin weekend
    const weekend = {
      id: 'weekend',
      beforeDatasetsDraw(chart, args, pluginOptions){
        const {ctx, data, chartArea:{top, bottom, left , right, width, height}, scales:{x,y}} = chart;
        
        ctx.save();
        x.ticks.forEach((tick,index) => {
          const day = new Date(tick.value).getDay();
          console.log(day)
          if (day === 6 || day === 0){
            ctx.fillStyle = pluginOptions.weekendColor;
            ctx.fillRect(
              x.getPixelForValue(tick.value),
              top,
              x.getPixelForValue(new Date(tick.value).setHours(24))-x.getPixelForValue(tick.value),
              height);
          }
        })
        
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
                right:150,
                bottom: 20,
            }
        },
        indexAxis : 'y',
        scales: {
          x: {
            position:'top',
            type: 'time',
            time: {
                unit:'day',
                displayFormats: {
                  day: 'd'
                }
            },
            min: '2023-11-27',
            max: '2023-12-22'
          }
        },
        plugins:{
            weekend: {
              weekendColor: 'rgba(102,102,102,0.2)'
            },
            legend : {
                display:false,
            },
            tooltip: {
              displayColors: false,
              yAlign:'bottom',
              callbacks: {
                label: (ctx) => {
                  return '';
                },
                title: (ctx) => {
                  // console.log(ctx[0].raw.x[0])
                  const startDate =new Date(ctx[0].raw.x[0])
                  const endDate =new Date(ctx[0].raw.x[1])
                  const formattedStartdate = startDate.toLocaleString([], {
                    year:'numeric',
                    month : 'short',
                    day:'numeric',
                    // hour12: true
                  });
                  const formattedEnddate = endDate.toLocaleString([], {
                    year:'numeric',
                    month : 'short',
                    day:'numeric',
                    // hour12: true
                  });
                  return [ctx[0].raw.name, `Task Deadline:${formattedStartdate}- ${formattedEnddate}`]
                }
              }
            }
        }
      },
      plugins: [todayLine, assignedTasks, status, weekend]
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
    addNames();
    
  }, []); // empty dependency array ensures useEffect runs only once

  function chartFilter(event) {
    const selectedDate = event.target.value;
    const year = selectedDate.substring(0,4);
    const month = selectedDate.substring(5, 7);
    const lastDay = (y, m) => {
      return new Date(y,m,0).getDate();
    }
    const startDate = `${year}-${month}-01`
    const endDate = `${year}-${month}-${lastDay(year, month)}`
    // console.log(endDate)

    chartRef.current.config.options.scales.x.min = startDate;
    chartRef.current.config.options.scales.x.max = endDate;
    chartRef.current.update();
    
    // You can perform additional actions based on the selectedDate here
  }

  function addTask() {
    const nameTask = document.getElementById('taskName');
    const startDateTask = document.getElementById('startDateTask');
    const endDateTask = document.getElementById('endDateTask');
    const teamMember = document.getElementById('teamMember');
    const statusTask = document.getElementById('statusTask');
    const arrayLength = chartRef.current.data.datasets[0].data.length
  
    chartRef.current.data.datasets[0].data[arrayLength] = ({
      x: [startDateTask.value, endDateTask.value],
      y: nameTask.value,
      name: teamMember.value,
      status: parseInt(statusTask.value)
    });
    chartRef.current.update();
    addNames();
  }
  
  function addNames(){
    const names = document.getElementById('names');
    while (names.firstElementChild){
      names.removeChild(names.firstElementChild)
    }
    const namesArray = chartRef.current.data.datasets[0].data.map((datapoint) => {
      return datapoint.name;
      
    })
    const namesArrayFilter = [...new Set(namesArray)]
    namesArrayFilter.forEach((memberName) => {
      const option = document.createElement('option');
      option.value = memberName;
      names.appendChild(option);
    })
    
  }


  return (
    <div>
      <div className="chartMenu">
        <p>CHart created using chartjs version ( <span id="chartVersion"></span>)</p>
      </div>
      <div className="chartCard">
        <div className="chartBox">
          <canvas id="myChart" ></canvas>
          <input type="month" onChange={chartFilter }/>
          <br />
          <hr />
          <br />
          <input type="text" id='taskName' />
          <input type="date" id='startDateTask' />
          <input type="date" id='endDateTask' />
          <input type="text" id='teamMember' list='names' />
          <datalist id='names'>
            <option value='James Text'></option>
          </datalist>
          <select id="statusTask">
            <option value="0">Delayed</option>
            <option value="1">Pending</option>
            <option value="2">Completed</option>
          </select>
          <button onClick={addTask}>AddTask</button>
        </div>
      </div>
    </div>
  );
};


export default Ganttchart;
