import PDFDocument from 'pdfkit';

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

// ─── Helper: draw a section heading ───────────────────────────────────────────
function sectionHeading(doc, title) {
    doc.moveDown(0.5);
    doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 22)
        .fill('#6366f1');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12)
        .text(title, doc.page.margins.left + 8, doc.y - 18);
    doc.fillColor('#1a1a1a').moveDown(0.8);
}

// ─── Helper: draw a simple table ──────────────────────────────────────────────
function drawTable(doc, headers, rows, colWidths) {
    const startX = doc.page.margins.left;
    const rowH = 18;
    const pageBottom = doc.page.height - doc.page.margins.bottom - 10;

    // header row
    let x = startX;
    doc.rect(startX, doc.y, colWidths.reduce((a, b) => a + b, 0), rowH).fill('#e0e7ff');
    doc.fillColor('#1e1b4b').font('Helvetica-Bold').fontSize(9);
    headers.forEach((h, i) => {
        doc.text(String(h), x + 4, doc.y - rowH + 4, { width: colWidths[i] - 8, lineBreak: false });
        x += colWidths[i];
    });
    doc.moveDown(0);
    doc.y += 2;

    // data rows
    rows.forEach((row, ri) => {
        if (doc.y + rowH > pageBottom) doc.addPage();
        const rowY = doc.y;
        if (ri % 2 === 0) {
            doc.rect(startX, rowY, colWidths.reduce((a, b) => a + b, 0), rowH).fill('#f8f9ff');
        }
        doc.fillColor('#374151').font('Helvetica').fontSize(8);
        x = startX;
        row.forEach((cell, i) => {
            doc.text(String(cell ?? ''), x + 4, rowY + 4, { width: colWidths[i] - 8, lineBreak: false });
            x += colWidths[i];
        });
        doc.y = rowY + rowH;
    });
    doc.moveDown(0.5);
}

// ─── Main export ──────────────────────────────────────────────────────────────
export const generateProjectReport = (reportData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            const { stats, clubs, events, sports, tournaments, registrationSummary, studentStats } = reportData;
            const generatedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

            // ── COVER PAGE ────────────────────────────────────────────────────
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');

            doc.rect(doc.page.margins.left - 10, 130, pageW + 20, 4).fill('#6366f1');
            doc.rect(doc.page.margins.left - 10, 138, pageW + 20, 1).fill('#818cf8');

            doc.fillColor('#e0e7ff').font('Helvetica-Bold').fontSize(36)
                .text('Sports Sphere', doc.page.margins.left, 160, { align: 'center', width: pageW });

            doc.fillColor('#94a3b8').font('Helvetica').fontSize(16)
                .text('PCCAS — College Portal for Clubs & Sports Activities', doc.page.margins.left, 210, { align: 'center', width: pageW });

            doc.rect(doc.page.margins.left - 10, 240, pageW + 20, 1).fill('#334155');

            doc.fillColor('#6366f1').font('Helvetica-Bold').fontSize(26)
                .text('Project Report', doc.page.margins.left, 270, { align: 'center', width: pageW });

            doc.fillColor('#cbd5e1').font('Helvetica').fontSize(12)
                .text('TY (Third Year) Computer Engineering Project', doc.page.margins.left, 310, { align: 'center', width: pageW });

            // stat boxes on cover
            const boxes = [
                { label: 'Clubs', value: stats.totalClubs },
                { label: 'Events', value: stats.totalEvents },
                { label: 'Students', value: stats.totalStudents },
                { label: 'Registrations', value: stats.totalRegistrations },
            ];
            const boxW = 100, boxH = 60, boxGap = 10;
            const boxesTotal = boxes.length * boxW + (boxes.length - 1) * boxGap;
            let bx = (doc.page.width - boxesTotal) / 2;
            boxes.forEach(b => {
                doc.rect(bx, 380, boxW, boxH).fill('#1e293b');
                doc.rect(bx, 380, boxW, 3).fill('#6366f1');
                doc.fillColor('#6366f1').font('Helvetica-Bold').fontSize(22)
                    .text(String(b.value), bx, 395, { width: boxW, align: 'center' });
                doc.fillColor('#94a3b8').font('Helvetica').fontSize(9)
                    .text(b.label, bx, 424, { width: boxW, align: 'center' });
                bx += boxW + boxGap;
            });

            doc.fillColor('#475569').font('Helvetica').fontSize(10)
                .text(`Generated on: ${generatedAt}  |  Sports Sphere — College Management System`,
                    doc.page.margins.left, doc.page.height - 60, { align: 'center', width: pageW });

            // ── PAGE 2 — OVERVIEW ─────────────────────────────────────────────
            doc.addPage();

            doc.fillColor('#1e1b4b').font('Helvetica-Bold').fontSize(20)
                .text('Project Overview', { align: 'center' });
            doc.moveDown(0.3);
            doc.fillColor('#6b7280').font('Helvetica').fontSize(10)
                .text(`Report generated: ${generatedAt}`, { align: 'center' });
            doc.moveDown(1);

            sectionHeading(doc, '1. System Statistics');
            const statRows = [
                ['Total Clubs', stats.totalClubs],
                ['Total Events', stats.totalEvents],
                ['Total Students', stats.totalStudents],
                ['Total Registrations', stats.totalRegistrations],
                ['Total Sports', stats.totalSports],
                ['Total Tournaments', stats.totalTournaments],
                ['Total Teams', stats.totalTeams],
                ['Total News Articles', stats.totalNews],
            ];
            drawTable(doc, ['Metric', 'Count'], statRows, [pageW * 0.6, pageW * 0.4]);

            // Registration breakdown
            sectionHeading(doc, '2. Registration Status Breakdown');
            const regRows = registrationSummary.map(r => [r.status, r._count._all ?? r._count]);
            drawTable(doc, ['Status', 'Count'], regRows, [pageW * 0.6, pageW * 0.4]);

            // Student year breakdown
            if (studentStats.byYear && studentStats.byYear.length > 0) {
                sectionHeading(doc, '3. Students by Year');
                drawTable(doc, ['Year', 'Count'],
                    studentStats.byYear.map(r => [`Year ${r.year}`, r._count._all ?? r._count]),
                    [pageW * 0.6, pageW * 0.4]);
            }

            // ── PAGE 3 — CLUBS ────────────────────────────────────────────────
            doc.addPage();
            doc.fillColor('#1e1b4b').font('Helvetica-Bold').fontSize(16).text('Clubs');
            doc.moveDown(0.5);

            sectionHeading(doc, '4. Club Details');
            const clubHeaders = ['Club Name', 'Type', 'Members', 'Events', 'Contact'];
            const clubCols = [pageW * 0.26, pageW * 0.14, pageW * 0.1, pageW * 0.1, pageW * 0.4];
            const clubRows = clubs.map(c => [
                c.name, c.type,
                c._count?.clubmember ?? 0,
                c._count?.event ?? 0,
                c.contactEmail,
            ]);
            drawTable(doc, clubHeaders, clubRows, clubCols);

            // ── PAGE 4 — EVENTS ───────────────────────────────────────────────
            doc.addPage();
            doc.fillColor('#1e1b4b').font('Helvetica-Bold').fontSize(16).text('Events');
            doc.moveDown(0.5);

            sectionHeading(doc, '5. Event Details');
            const evtHeaders = ['Event Name', 'Type', 'Club', 'Date', 'Regs', 'Max'];
            const evtCols = [pageW * 0.24, pageW * 0.12, pageW * 0.2, pageW * 0.14, pageW * 0.1, pageW * 0.2];
            const evtRows = events.map(e => [
                e.name, e.type,
                e.club?.name ?? '',
                new Date(e.date).toLocaleDateString('en-IN'),
                e._count?.registration ?? 0,
                e.maxParticipants,
            ]);
            drawTable(doc, evtHeaders, evtRows, evtCols);

            // ── PAGE 5 — SPORTS & TOURNAMENTS ────────────────────────────────
            doc.addPage();
            doc.fillColor('#1e1b4b').font('Helvetica-Bold').fontSize(16).text('Sports & Tournaments');
            doc.moveDown(0.5);

            sectionHeading(doc, '6. Sports');
            drawTable(doc, ['Sport', 'Teams', 'Tournaments'],
                sports.map(s => [s.name, s._count?.team ?? 0, s._count?.tournament ?? 0]),
                [pageW * 0.5, pageW * 0.25, pageW * 0.25]);

            if (tournaments.length > 0) {
                sectionHeading(doc, '7. Tournaments');
                drawTable(doc,
                    ['Name', 'Sport', 'Level', 'Start Date', 'End Date'],
                    tournaments.map(t => [
                        t.name, t.sport?.name ?? '',
                        t.level,
                        new Date(t.startDate).toLocaleDateString('en-IN'),
                        new Date(t.endDate).toLocaleDateString('en-IN'),
                    ]),
                    [pageW * 0.28, pageW * 0.18, pageW * 0.14, pageW * 0.2, pageW * 0.2]);
            }

            // ── FOOTER on every page ──────────────────────────────────────────
            const totalPages = doc.bufferedPageRange ? doc.bufferedPageRange().count : undefined;
            const range = doc.bufferedPageRange ? doc.bufferedPageRange() : null;
            if (range) {
                for (let i = range.start; i < range.start + range.count; i++) {
                    doc.switchToPage(i);
                    doc.fillColor('#9ca3af').font('Helvetica').fontSize(8)
                        .text(
                            `Sports Sphere — Project Report  |  Page ${i - range.start + 1} of ${range.count}`,
                            doc.page.margins.left,
                            doc.page.height - doc.page.margins.bottom + 15,
                            { align: 'center', width: pageW }
                        );
                }
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
