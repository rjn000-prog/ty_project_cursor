import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
    try {
        // Generate QR code as a Data URL (base64)
        const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
            color: {
                dark: '#6366f1',  // Theme Indigo
                light: '#ffffff'
            },
            margin: 1,
            width: 300
        });
        return qrDataUrl;
    } catch (error) {
        console.error('QR Generation Error:', error);
        throw error;
    }
};

export const generateTicketToken = () => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};
