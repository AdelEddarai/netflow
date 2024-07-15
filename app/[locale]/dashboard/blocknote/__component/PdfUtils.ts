import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (html: string) => {
  // ... (paste the entire downloadPDF function here)
    // Create a temporary element to hold the HTML content
    const element: HTMLElement = document.createElement('div');
    element.innerHTML = html;

    // Ensure text color is black
    element.style.color = 'black';

    document.body.appendChild(element);

    // Function to check if all images are loaded
    const loadImages = (element: HTMLElement): Promise<void[]> => {
      const images: HTMLCollectionOf<HTMLImageElement> = element.getElementsByTagName('img');
      return Promise.all(Array.from(images).map(img => {
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
          // Trigger load event in case the image is already cached
          if (img.complete) {
            resolve();
          }
        });
      }));
    };

    try {
      // Wait for all images to load
      await loadImages(element);

      // Options for html2canvas to handle cross-origin images
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });

      // Create a PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg');

      // Get dimensions of the canvas and PDF page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if necessary
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate the PDF as a data URL
      const pdfDataUrl = pdf.output('dataurlstring');

      // Open the PDF in a new window for preview
      const pdfWindow = window.open("");
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='${pdfDataUrl}'></iframe>`
        );
      }

    } catch (error) {
      console.error('Error loading images: ', error);
    } finally {
      // Clean up by removing the temporary element
      document.body.removeChild(element);
    }
  };
