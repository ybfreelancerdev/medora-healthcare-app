import RNFS from 'react-native-fs';
import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import { getDrName } from '../constants';

export const downloadReceiptPDF = async (transaction: any) => {
    try {
        const file =
            await RNHTMLtoPDF.generatePDF({
                html: generateReceiptHtml(
                    transaction,
                ),
                fileName: `receipt_${transaction.id}`,
            }); 

        const downloadPath = `${RNFS.DownloadDirectoryPath}/receipt_${transaction.id}.pdf`;
        await RNFS.copyFile(
            file.filePath,
            downloadPath,
        );

        return {
            success: true,
            filePath: downloadPath,
        };

    } catch (error: any) {

        console.log(
            'PDF Download Error:',
            error,
        );

        return {
            success: false,
            message:
                error?.message ||
                'Failed to generate receipt',
        };
    }
};

const generateReceiptHtml = (transaction: any) => {
  return `
    <html>
      <body style="padding:20px">
        <h1>Payment Receipt</h1>

        <p><strong>Transaction ID:</strong> ${transaction?.transactionId}</p>
        <p><strong>Patient:</strong> ${transaction?.appointment?.patient?.fullName}</p>
        <p><strong>Doctor:</strong> ${getDrName(transaction?.appointment?.doctor?.fullName)}</p>
        <p><strong>Amount:</strong> ₹${transaction?.amount}</p>
        <p><strong>Date:</strong> ${transaction.createdAt?.toDate()?.toDateString()}</p>

        <hr/>

        <h3>Medora Healthcare</h3>
      </body>
    </html>
  `;
};