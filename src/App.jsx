import { useState } from 'react'
import './App.css'
import PdfGenerator from './PDF/PdfGenerator'
import DoughnutChart from './components/DoughnutChart'

function App() {

  return (
    <>
      <PdfGenerator />
      <DoughnutChart />
    </>
  )
}

export default App
