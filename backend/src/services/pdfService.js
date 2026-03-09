import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateCertificate = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            });

            const filename = `certificate_${data.registrationId}.pdf`;
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // --- Certificate Design ---

            // Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1a1a1a');
            doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#6366f1');

            // Title
            doc.font('Helvetica-Bold')
                .fontSize(40)
                .fillColor('#1a1a1a')
                .text('Certificate of Participation', 0, 100, { align: 'center' });

            doc.moveDown();
            doc.fontSize(20)
                .font('Helvetica')
                .text('This is to certify that', { align: 'center' });

            doc.moveDown();
            doc.fontSize(35)
                .font('Helvetica-Bold')
                .fillColor('#6366f1')
                .text(data.studentName, { align: 'center' });

            doc.moveDown();
            doc.fontSize(20)
                .font('Helvetica')
                .fillColor('#1a1a1a')
                .text(`has successfully participated in the event`, { align: 'center' });

            doc.moveDown();
            doc.fontSize(25)
                .font('Helvetica-Bold')
                .text(data.eventName, { align: 'center' });

            doc.moveDown();
            doc.fontSize(16)
                .font('Helvetica')
                .text(`Organized by ${data.clubName}`, { align: 'center' });

            doc.moveDown(2);
            doc.fontSize(14)
                .text(`Date of Issue: ${new Date().toLocaleDateString()}`, { align: 'center' });

            // Footer
            doc.fontSize(12)
                .text('Sports Sphere - College Management Systems', 0, doc.page.height - 80, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
