import React,{ useRef, useCallback, useState } from 'react'
import {Doughnut } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import {CategoryScale} from 'chart.js'

const data = {
    labels : ['Red', 'Green', 'Yellow', 'Grey'],
    datasets : [
        {
            label:'My Dataset',
            data :[300,200,50,79],
            backgroundColor: ['red','green','yellow','grey'],
            hoverOffset:4,

        }
    ]
}

Chart.register(CategoryScale)


function DoughnutChart() {
    let ref = useRef(null);

    const downloadImage = useCallback(() => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = ref.current.toBase64Image();
        link.click();
    },[])
  

  return (
    <div className='App'>
      <button type='button' onClick={downloadImage}>Download</button>
      <div style={{height:'690px', width:'690px', margin:'auto'}}>
        <Doughnut ref={ref} data={data} />
      </div>
    </div>
  )
}

export default DoughnutChart