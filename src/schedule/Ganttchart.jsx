import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './styles/Chart.css';
import 'chartjs-adapter-date-fns';

const Ganttchart = () => {
  const chartRef = useRef(null);
  const [labelsArrayFilter, setLabelsArrayFilter] = useState([]);
  const [tasksArrayFilter, setTasksArrayFilter] = useState([]);


  function addTask() {
    const nameTask = document.getElementById('taskName');
    const startDateTask = document.getElementById('startDateTask');
    const endDateTask = document.getElementById('endDateTask');
    const teamMember = document.getElementById('teamMember');
    const taskAdd = document.getElementById('taskName')
    const statusTask = document.getElementById('statusTask');
    const arrayLength = chartRef.current.data.datasets[0].data.length;

    chartRef.current.data.datasets[0].data[arrayLength] = {
      x: [startDateTask.value, endDateTask.value],
      y: nameTask.value,
      name: teamMember.value,
      tasker : taskAdd.value,
      status: parseInt(statusTask.value),
    };
    chartRef.current.update();
    addNames();
    addTasks();
  }

  function addNames() {
    const names = document.getElementById('names');
    while (names.firstElementChild) {
      names.removeChild(names.firstElementChild);
    }
    const namesArray = chartRef.current.data.datasets[0].data.map((datapoint) => {
      return datapoint.name;
      
    });

    
    const namesArrayFilter = [...new Set(namesArray)];
    setLabelsArrayFilter(namesArrayFilter);
    namesArrayFilter.forEach((memberName) => {
      const option = document.createElement('option');
      option.value = memberName;
      names.appendChild(option);
    });
  }

  function addTasks() {
    const tasks = document.getElementById('tasks');
    while (tasks.firstElementChild) {
      tasks.removeChild(tasks.firstElementChild);
    }
    const tasksArray = chartRef.current.data.datasets[0].data.map((datapoint) => {
      return datapoint.y;
    });
    const tasksArrayFilter = [...new Set(tasksArray)];
    setTasksArrayFilter(tasksArrayFilter);

    tasksArrayFilter.forEach((taskName) => {
      const option = document.createElement('option');
      option.value = taskName;
      tasks.appendChild(option);
    });
    
  }

  useEffect(() => {
    const colors = ['red', 'yellow', 'green'];
    const data = {
      datasets: [
        {
          label: 'Weekly Sales',
          data: [
            { x: ['2023-11-28', '2023-11-30'], y: 'Task 1', name: 'Arun', status: 2 },
            { x: ['2023-11-30', '2023-12-09'], y: 'Task 2', name: 'Anumol', status: 1 },
            { x: ['2023-12-09', '2023-12-12'], y: 'Task 3', name: 'Dalia', status: 0 },
            { x: ['2023-12-09', '2023-12-12'], y: 'Task 4', name: 'John', status: 1 },
            { x: ['2023-12-17', '2023-12-22'], y: 'Task 5', name: 'George', status: 1 },
          ],
          backgroundColor: (ctx) => {
            return colors[ctx.raw.status];
          },
          borderSkipped: false,
          borderRadius: 10,
          barPercentage: 0.2,
        },
      ],
    };

    const labelsArray = data.datasets[0].data.map((datapoint, index) => {
      return datapoint.y;
    });

    const labelsArrayFilter = [...new Set(labelsArray)];
    setLabelsArrayFilter(labelsArrayFilter);

    const todayLine = {
      id: 'todayline',
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
        ctx.save();

        if (x.getPixelForValue(new Date()) >= left && x.getPixelForValue(new Date()) <= right) {
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'black';
          ctx.setLineDash([6, 6]);
          ctx.moveTo(x.getPixelForValue(new Date()), top);
          ctx.lineTo(x.getPixelForValue(new Date()), bottom);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'black';
          ctx.fillStyle = 'black';
          ctx.moveTo(x.getPixelForValue(new Date()), top + 5);
          ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
          ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
          ctx.restore();
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Today', x.getPixelForValue(new Date()), bottom + 12);
          ctx.restore();
        }
      },
    };

    const status = {
      id: 'status',
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, options, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
        const icons = ['\uf00d', '\uf110', '\uf00c'];

        const angle = Math.PI / 180;
        const paddingRight = options.layout.padding.right;
        ctx.save();
        ctx.font = 'bolder 10px FontAwesome';

        ctx.textBaseLine = 'middle';
        ctx.textAlign = 'center';
        data.datasets[0].data.forEach((datapoint, index) => {
          if (y.getPixelForValue(index) > top && y.getPixelForValue(index) < bottom) {
            ctx.beginPath();
            ctx.fillStyle = colors[datapoint.status];
            ctx.arc(right + (paddingRight / 2), y.getPixelForValue(index), 12, 0, angle * 360, false);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.fillText(icons[datapoint.status], right + (paddingRight / 2), y.getPixelForValue(index));
          }
        });
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Persons', right + (paddingRight / 2), top - 15);
        ctx.restore();
      },
    };

    const assignedTasks = {
      id: 'assignedTasks',
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
        ctx.save();
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textBaseLine = 'middle';
        ctx.textAlign = 'left';
        data.datasets[0].data.forEach((datapoint, index) => {
          if (x.getPixelForValue(new Date()) >= left && x.getPixelForValue(new Date()) <= right) {
            ctx.fillText(datapoint.name, 10, y.getPixelForValue(index));
          }
        });
        ctx.fillText('Persons', 10, top - 15);
        ctx.restore();
      },
    };

    const weekend = {
      id: 'weekend',
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

        ctx.save();
        x.ticks.forEach((tick, index) => {
          const day = new Date(tick.value).getDay();
          if (day === 6 || day === 0) {
            ctx.fillStyle = pluginOptions.weekendColor;
            ctx.fillRect(
              x.getPixelForValue(tick.value),
              top,
              x.getPixelForValue(new Date(tick.value).setHours(24)) - x.getPixelForValue(tick.value),
              height
            );
          }
        });
      },
    };

    const config = {
      type: 'bar',
      data,
      options: {
        layout: {
          padding: {
            left: 100,
            right: 150,
            bottom: 20,
          },
        },
        indexAxis: 'y',
        scales: {
          x: {
            position: 'top',
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'd',
              },
            },
            min: '2023-11-27',
            max: '2023-12-22',
          },
          y: {
            min: 0,
            max: 4,
            labels: labelsArrayFilter,
          },
        },
        plugins: {
          weekend: {
            weekendColor: 'rgba(102,102,102,0.2)',
          },
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            yAlign: 'bottom',
            callbacks: {
              label: (ctx) => {
                return '';
              },
              title: (ctx) => {
                const startDate = new Date(ctx[0].raw.x[0]);
                const endDate = new Date(ctx[0].raw.x[1]);
                const formattedStartdate = startDate.toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const formattedEnddate = endDate.toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                return [ctx[0].raw.name, `Task Deadline:${formattedStartdate}- ${formattedEnddate}`];
              },
            },
          },
        },
      },
      plugins: [todayLine, assignedTasks, status, weekend],
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, config);

    document.getElementById('chartVersion').innerText = Chart.version;
    addNames();
    addTasks();
  }, []);

  function chartFilter(event) {
    const selectedDate = event.target.value;
    const year = selectedDate.substring(0, 4);
    const month = selectedDate.substring(5, 7);
    const lastDay = (y, m) => {
      return new Date(y, m, 0).getDate();
    };
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDay(year, month)}`;
    chartRef.current.config.options.scales.x.min = startDate;
    chartRef.current.config.options.scales.x.max = endDate;
    chartRef.current.update();
  }

  function showTask() {
    const yScale = chartRef.current.config.options.scales.y;
    const minTask = document.getElementById('minTask').value;
    const maxTask = document.getElementById('maxTask').value;
    yScale.min = yScale.labels[minTask];
    yScale.max = yScale.labels[maxTask];
    chartRef.current.update();
  }

  return (
    <div>
      <div className="chartMenu">
        <p>Chart created using chartjs version (<span id="chartVersion"></span>)</p>
      </div>
      <div className="chartCard">
        <div className="chartBox">
          <canvas id="myChart"></canvas>
          <input type="month" onChange={chartFilter} />
          <br />
          <hr />
          <br />
          <input type="text" id="taskName" list="tasks" />
          <datalist id="tasks">
            <option value="the tasks !!!"></option>
          </datalist>
          <input type="date" id="startDateTask" />
          <input type="date" id="endDateTask" />
          <input type="text" id="teamMember" list="names" />
          <datalist id="names">
            <option value="James Text"></option>
          </datalist>
          <select id="statusTask">
            <option value="0">Delayed</option>
            <option value="1">Pending</option>
            <option value="2">Completed</option>
          </select>
          <button onClick={addTask}>AddTask</button>
          <br />
          <hr />
          <br />
          <select id="minTask" onChange={showTask} defaultValue="0">
            <option value="0">Task 1</option>
            <option value="1">Task 2</option>
          </select>

          <select id="maxTask" onChange={showTask} defaultValue="5">
            <option value="3">Task 4</option>
            <option value="4">Task 5</option>
            <option value="5">Task 6</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Ganttchart;
