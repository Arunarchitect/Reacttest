import React from "react";
import { jsPDF } from 'jspdf';
import './PdfGenerator.css';

function PdfGenerator() {

    const jspdf = new jsPDF('p', 'pt', 'letter');

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = e.target.txt.value;

        const data = {
            callback: function (jspdf) {
                jspdf.save('demo.pdf');
            },
            margin: [10, 10, 10, 10],
            autoPaging: 'text',
        };

        // Extract content of h1 element and replace line breaks with spaces
        const h1Content = document.querySelector('h1').innerText.replace(/\n/g, ' ');

        // Use the content of h1 with desired formatting
        const formattedContent = `<div style="font-family: 'Times New Roman'; font-style: italic; font-size: 16px;">${h1Content}</div><br/>${val}`;

        // Use the formatted content for the PDF
        jspdf.html(formattedContent, data);
    }

    return (
        <div>
            <h1>The content using jsPDF</h1>
            <form onSubmit={(e) => handleSubmit(e)} >
                <textarea className="txt" name="txt" />
                <button>Generate</button>
            </form>
        </div>
    )
}

export default PdfGenerator;
