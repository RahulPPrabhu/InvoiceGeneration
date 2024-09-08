import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10 },
    flexRow: { flexDirection: 'row' },
    flexCol: { flexDirection: 'column' },
    mb10: { marginBottom: 10 },
    mb20: { marginBottom: 20 },
    alignRight: { textAlign: 'right' },
    bold: { fontWeight: 'bold' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    title: { fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
    subtitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
    table: { display: 'table', width: 'auto', borderStyle: 'solid'},
    tableRow: { flexDirection: 'row'},
    tableCol: { border: 1},
    tableCell: { margin: 'auto', marginTop: 5, fontSize: 8 },
    logo: { width: 100, height: 'auto' },
    signature: { width: 100, height: 'auto', marginTop: 10 }
});

const InvoicePDF = ({ invoiceData, logo, signature }) => {
    const computeNetAmount = (unitPrice, quantity) => {
        return (parseFloat(unitPrice) * parseInt(quantity)).toFixed(2);
    };

    const computeTaxTypeAndAmount = (netAmount, placeOfSupply, placeOfDelivery) => {
        const amount = parseFloat(netAmount);
        if (placeOfSupply === placeOfDelivery) {
            const cgst = (amount * 0.025).toFixed(2);
            const sgst = (amount * 0.025).toFixed(2);
            return {
                taxType: 'CGST + SGST',
                taxAmount: (parseFloat(cgst) + parseFloat(sgst)).toFixed(2),
                cgst,
                sgst
            };
        } else {
            const igst = (amount * 0.05).toFixed(2);
            return {
                taxType: 'IGST',
                taxAmount: igst,
                igst
            };
        }
    };

    const computeTotalAmount = (netAmount, taxAmount) => {
        return (parseFloat(netAmount) + parseFloat(taxAmount)).toFixed(2);
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {logo && <Image src={logo} style={styles.logo} />}
                    <View>
                        <Text style={styles.title}>Tax Invoice/Bill of Supply/Cash Memo</Text>
                        <Text style={styles.alignRight}>(Original for Recipient)</Text>
                    </View>
                </View>

                <View style={[styles.flexRow, styles.mb20]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subtitle}>Sold By:</Text>
                        <Text>{invoiceData.companyName}</Text>
                        <Text>{invoiceData.companyAddress}</Text>
                        <Text>IN</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subtitle}>Billing Address:</Text>
                        <Text>{invoiceData.customerName}</Text>
                        <Text>{invoiceData.customerAddress}</Text>
                        <Text>IN</Text>
                    </View>
                </View>

                <View style={[styles.flexRow, styles.mb20]}>
                    <View style={{ flex: 1 }}>
                        <Text>PAN No: {invoiceData.panNo}</Text>
                        <Text>GST Registration No: {invoiceData.gstNo}</Text>
                        <Text>State/UT Code: {invoiceData.stateCode}</Text>
                        <Text>Place of Supply: {invoiceData.placeSupply}</Text>
                        <Text>Place of Delivery: {invoiceData.placeDelivery}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>Order Number: {invoiceData.orderNumber}</Text>
                        <Text>Order Date: {invoiceData.orderDate}</Text>
                        <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
                        <Text>Invoice Details: {invoiceData.invoiceDetails}</Text>
                        <Text>Invoice Date: {invoiceData.invoiceDate}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.bold]}>
                        <View style={[styles.tableCol, { width: '5%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Sl. No</Text></View>
                        <View style={[styles.tableCol, { width: '35%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Description</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Unit Price</Text></View>
                        <View style={[styles.tableCol, { width: '5%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Qty</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Net Amount</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Tax Rate</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Tax Type</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Tax Amount</Text></View>
                        <View style={[styles.tableCol, { width: '10%', backgroundColor: 'grey' }]}><Text style={styles.tableCell}>Total Amount</Text></View>
                    </View>
                    {invoiceData.items.map((item, index) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxType, taxAmount, cgst, sgst, igst } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        const totalAmount = computeTotalAmount(netAmount, taxAmount);
                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={[styles.tableCol, { width: '5%' }]}><Text style={styles.tableCell}>{index + 1}</Text></View>
                                <View style={[styles.tableCol, { width: '35%' }]}><Text style={styles.tableCell}>{item.description}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>₹{item.unitPrice}</Text></View>
                                <View style={[styles.tableCol, { width: '5%' }]}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>₹{netAmount}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{taxType === 'CGST + SGST' ? '2.5%\n2.5%' : '5%'}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{taxType === 'CGST + SGST' ? 'CGST\nSGST' : 'IGST'}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{taxType === 'CGST + SGST' ? `₹${cgst}\n₹${sgst}` : `₹${igst}`}</Text></View>
                                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>₹{totalAmount}</Text></View>
                            </View>
                        );
                    })}
                </View>

                <View style={[styles.flexRow, styles.mb10, { justifyContent: 'flex-end', border: 1 }]}>
                    <Text style={styles.bold}>TOTAL: ₹{invoiceData.items.reduce((acc, item) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxAmount } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        return acc + parseFloat(computeTotalAmount(netAmount, taxAmount));
                    }, 0).toFixed(2)}</Text>
                </View>

                <View style={styles.mb10}>
                    <Text style={styles.bold}>Amount in Words:</Text>
                    <Text>{invoiceData.amountInWords}</Text>
                </View>

                <View style={[styles.flexRow, { justifyContent: 'space-between', marginTop: 20 }]}>
                    <Text>Whether tax is payable under reverse charge : {invoiceData.yesorno}</Text>
                    <View style={styles.alignRight}>
                        <Text>For {invoiceData.companyName}:</Text>
                        {signature && <Image src={signature} style={styles.signature} />}
                        <Text>Authorized Signatory</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;