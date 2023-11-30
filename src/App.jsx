import { useState } from 'react'
import './App.css'
import PdfGenerator from './PDF/PdfGenerator'
import DoughnutChart from './components/DoughnutChart'
import Ganttchart from './schedule/Ganttchart'

function App() {

  return (
    <>
      {/* <PdfGenerator />
      <DoughnutChart /> */}
      <Ganttchart />
    </>
  )
}

export default App
