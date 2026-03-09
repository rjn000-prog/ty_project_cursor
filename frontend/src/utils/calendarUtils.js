/**
 * Utility to generate calendar sync links and files
 */

export const generateGoogleCalendarLink = (event) => {
    const { title, date, startTime, endTime, venue, description } = event;
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";

    // Format dates: YYYYMMDDTHHmmSSZ
    const eventDate = new Date(date).toISOString().split('T')[0].replace(/-/g, '');
    const start = startTime.replace(/:/g, '') + '00';
    const end = endTime.replace(/:/g, '') + '00';

    const dates = `${eventDate}T${start}/${eventDate}T${end}`;

    const params = new URLSearchParams({
        text: title,
        dates: dates,
        details: description || `Event: ${title} at ${venue}`,
        location: venue,
        sf: "true",
        output: "xml"
    });

    return `${baseUrl}&${params.toString()}`;
};

export const downloadICSFile = (event) => {
    const { title, date, startTime, endTime, venue, description } = event;

    const eventDate = new Date(date).toISOString().split('T')[0].replace(/-/g, '');
    const start = startTime.replace(/:/g, '') + '00';
    const end = endTime.replace(/:/g, '') + '00';

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//PCCAS//Sports Portal//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DTSTART:${eventDate}T${start}`,
        `DTEND:${eventDate}T${end}`,
        `LOCATION:${venue}`,
        `DESCRIPTION:${description || ""}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "BEGIN:VALARM",
        "TRIGGER:-PT15M",
        "DESCRIPTION:Reminder",
        "ACTION:DISPLAY",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
