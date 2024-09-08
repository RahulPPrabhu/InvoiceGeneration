import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 10 },
    table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: 'auto', flexDirection: 'column' },
    tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
    tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 },
    logo: { height: 50 },
    signature: { height: 50 }
});

const InvoicePDF = ({ invoiceData, logo, signature }) => {
    const computeNetAmount = (unitPrice, quantity) => {
        return (unitPrice * quantity).toFixed(2);
    };

    const computeTaxTypeAndAmount = (netAmount, placeOfSupply, placeOfDelivery) => {
        const amount = parseFloat(netAmount);
        if (placeOfSupply === placeOfDelivery) {
            // CGST & SGST (9% each)
            const cgst = (amount * 0.09).toFixed(2);
            const sgst = (amount * 0.09).toFixed(2);
            return {
                taxType: 'CGST + SGST',
                taxAmount: (parseFloat(cgst) + parseFloat(sgst)).toFixed(2),
                cgst,
                sgst
            };
        } else {
            // IGST (18%)
            const igst = (amount * 0.18).toFixed(2);
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
            <Page style={styles.page}>
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    {logo && <Image src={logo} style={styles.logo} />}
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.title}>Tax Invoice/Bill of Supply/Cash Memo</Text>
                        <Text>(Original for Recipient)</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Sold By:</Text>
                    <Text>{invoiceData.companyName}</Text>
                    <Text>{invoiceData.companyAddress}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Billing Address:</Text>
                    <Text>{invoiceData.customerName}</Text>
                    <Text>{invoiceData.customerAddress}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
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
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}><Text>Sl. No</Text></View>
                        <View style={styles.tableCol}><Text>Description</Text></View>
                        <View style={styles.tableCol}><Text>Unit Price</Text></View>
                        <View style={styles.tableCol}><Text>Qty</Text></View>
                        <View style={styles.tableCol}><Text>Net Amount</Text></View>
                        <View style={styles.tableCol}><Text>Tax Type</Text></View>
                        <View style={styles.tableCol}><Text>Tax Amount</Text></View>
                        <View style={styles.tableCol}><Text>Total Amount</Text></View>
                    </View>
                    {invoiceData.items.map((item, index) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxType, taxAmount, cgst, sgst, igst } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        const totalAmount = computeTotalAmount(netAmount, taxAmount);
                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.tableCol}><Text>{index + 1}</Text></View>
                                <View style={styles.tableCol}><Text>{item.description}</Text></View>
                                <View style={styles.tableCol}><Text>{item.unitPrice}</Text></View>
                                <View style={styles.tableCol}><Text>{item.quantity}</Text></View>
                                <View style={styles.tableCol}><Text>{netAmount}</Text></View>
                                <View style={styles.tableCol}><Text>{taxType}</Text></View>
                                <View style={styles.tableCol}><Text>{taxType === 'CGST + SGST' ? `${cgst} + ${sgst}` : igst}</Text></View>
                                <View style={styles.tableCol}><Text>{totalAmount}</Text></View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Total Amount: ₹{invoiceData.items.reduce((acc, item) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxAmount } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        return acc + parseFloat(computeTotalAmount(netAmount, taxAmount));
                    }, 0).toFixed(2)}</Text>
                </View>

                {signature && (
                    <View style={{ textAlign: 'right', marginTop: 20 }}>
                        <Image src={signature} style={styles.signature} />
                        <Text>Authorized Signatory</Text>
                    </View>
                )}

                <Text style={{ marginTop: 20 }}>Whether the tax payable under reverse charge: {invoiceData.yesorno}</Text>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
