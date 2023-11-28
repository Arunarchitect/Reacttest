import React from "react";
import { jsPDF } from 'jspdf';
import './PdfGenerator.css';
import constructImage from './construct.png'; // Update the path accordingly

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

        // Use the imported image directly
        const image = new Image();
        image.src = constructImage;

        const h1Content = document.querySelector('h1').innerText.replace(/\n/g, ' ');

        const formattedContent = `<div style="font-family: 'Times New Roman'; font-style: italic; font-size: 16px;">${h1Content}</div><br/>${val}<br/><img src="${image.src}" />`;

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
