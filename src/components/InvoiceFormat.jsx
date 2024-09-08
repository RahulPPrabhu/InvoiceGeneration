import { useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePdf';

const InvoiceTemplate = () => {
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const [invoiceData, setInvoiceData] = useState({
        companyName: '',
        companyAddress: '',
        customerName: '',
        customerAddress: '',
        panNo: '',
        gstNo: '',
        stateCode: '',
        placeSupply: '',
        placeDelivery: '',
        orderNumber: '',
        orderDate: '',
        invoiceNumber: '',
        invoiceDate: '',
        invoiceDetails: '',
        items: [
            {
                description: '',
                unitPrice: 0,
                quantity: 0,
                taxRate: 0,
                taxType: 'CGST',
            }
        ],
        amountInWords: '',
        yesorno: 'No'
    });

    const handleInputChange = (e, field) => {
        setInvoiceData({ ...invoiceData, [field]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        setInvoiceData({ ...invoiceData, items: newItems });
    };

    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, { description: '', unitPrice: 0, quantity: 0, taxRate: 0, taxType: 'CGST' }]
        });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogo(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setSignature(e.target.result);
            reader.readAsDataURL(file);
        }
    };

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
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-6">
                    {logo ? (
                        <img src={logo} alt="Company Logo" className="img-fluid" style={{ maxHeight: '100px' }} />
                    ) : (
                        <div className="mb-3">
                            <label htmlFor="logo-upload" className="form-label">Upload Logo</label>
                            <input type="file" className="form-control" id="logo-upload" onChange={handleLogoUpload} accept="image/*" />
                        </div>
                    )}
                </div>
                <div className="col-6 text-end">
                    <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
                    <p>(Original for Recipient)</p>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Sold By :</h3>
                    <input type="text" className="form-control mb-2" placeholder="Company Name"
                        value={invoiceData.companyName} onChange={(e) => handleInputChange(e, 'companyName')} />
                    <textarea className="form-control" placeholder="Company Address" rows="3"
                        value={invoiceData.companyAddress} onChange={(e) => handleInputChange(e, 'companyAddress')}></textarea>
                </div>
                <div className="col-md-6">
                    <h3>Billing Address :</h3>
                    <input type="text" className="form-control mb-2" placeholder="Customer Name"
                        value={invoiceData.customerName} onChange={(e) => handleInputChange(e, 'customerName')} />
                    <textarea className="form-control" placeholder="Customer Address" rows="3"
                        value={invoiceData.customerAddress} onChange={(e) => handleInputChange(e, 'customerAddress')}></textarea>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-2">
                    <input type="text" className="form-control mb-2" placeholder="PAN No"
                        value={invoiceData.panNo} onChange={(e) => handleInputChange(e, 'panNo')} />
                </div>
                <div className="col-md-2">
                    <input type="text" className="form-control mb-2" placeholder="GST Registration No"
                        value={invoiceData.gstNo} onChange={(e) => handleInputChange(e, 'gstNo')} />
                </div>
                <div className="col-md-2">
                    <input type="text" className="form-control mb-2" placeholder="State/UT Code"
                        value={invoiceData.stateCode} onChange={(e) => handleInputChange(e, 'stateCode')} />
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control mb-2" placeholder="Place of Supply"
                        value={invoiceData.placeSupply} onChange={(e) => handleInputChange(e, 'placeSupply')} />
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control mb-2" placeholder="Place of Delivery"
                        value={invoiceData.placeDelivery} onChange={(e) => handleInputChange(e, 'placeDelivery')} />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-2">
                    <input type="text" className="form-control mb-2" placeholder="Order Number"
                        value={invoiceData.orderNumber} onChange={(e) => handleInputChange(e, 'orderNumber')} />
                </div>
                <div className="col-md-2">
                    <input type="date" className="form-control mb-2" placeholder="Order Date"
                        value={invoiceData.orderDate} onChange={(e) => handleInputChange(e, 'orderDate')} />
                </div>
                <div className="col-md-2">
                    <input type="text" className="form-control mb-2" placeholder="Invoice Number"
                        value={invoiceData.invoiceNumber} onChange={(e) => handleInputChange(e, 'invoiceNumber')} />
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control mb-2" placeholder="Invoice Details"
                        value={invoiceData.invoiceDetails} onChange={(e) => handleInputChange(e, 'invoiceDetails')} />
                </div>
                <div className="col-md-3">
                    <input type="date" className="form-control mb-2" placeholder="Invoice Date"
                        value={invoiceData.invoiceDate} onChange={(e) => handleInputChange(e, 'invoiceDate')} />
                </div>
            </div>

            <table className="table table-bordered mb-4">
                <thead className="table-light">
                    <tr>
                        <th>Sl. No</th>
                        <th>Description</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Net Amount</th>
                        <th className="text-end">Tax Type</th>
                        <th className="text-end">Tax Amount</th>
                        <th className="text-end">Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.items.map((item, index) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxType, taxAmount, cgst, sgst, igst } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        const totalAmount = computeTotalAmount(netAmount, taxAmount);
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input type="text" className="form-control" value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                                </td>
                                <td className="text-end">
                                    <input type="number" className="form-control" value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} />
                                </td>
                                <td className="text-end">
                                    <input type="number" className="form-control" value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} />
                                </td>
                                <td className="text-end">{netAmount}</td>
                                <td className="text-end">{taxType}</td>
                                <td className="text-end">{taxType === 'CGST + SGST' ? `${cgst} + ${sgst}` : igst}</td>
                                <td className="text-end">{totalAmount}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => {
                                        const newItems = invoiceData.items.filter((_, i) => i !== index);
                                        setInvoiceData({ ...invoiceData, items: newItems });
                                    }}>Remove</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={addItem}>Add Item</button>

            <div className="row mt-4">
                <div className="col-md-6 text-end">
                    <div className="fs-4 fw-bold">Total Amount: ₹{invoiceData.items.reduce((acc, item) => {
                        const netAmount = computeNetAmount(item.unitPrice, item.quantity);
                        const { taxAmount } = computeTaxTypeAndAmount(netAmount, invoiceData.placeSupply, invoiceData.placeDelivery);
                        return acc + parseFloat(computeTotalAmount(netAmount, taxAmount));
                    }, 0).toFixed(2)}</div>
                </div>
            </div>

            <div className="border text-end">
                <p><strong>For {invoiceData.companyName}:</strong></p>
                <div className="col-6 d-inline-block p-3 mb-2">
                    {signature ? (
                        <img src={signature} alt="Customer Signature" className="img-fluid" style={{ maxHeight: '100px' }} />
                    ) : (
                        <div className="mb-3">
                            <label htmlFor="logo-upload" className="form-label">Upload Signature</label>
                            <input type="file" className="form-control" id="logo-upload" onChange={handleSignatureUpload} accept="image/*" />
                        </div>
                    )}
                </div>
                <p>Authorized Signatory</p>
            </div>

            <p>Whether the tax payable under reverse change: {invoiceData.yesorno}</p>

            <div className="row mt-4">
                <div className="col-md-12 text-end">
                    <PDFDownloadLink
                        document={<InvoicePDF invoiceData={invoiceData} logo={logo} signature={signature} />}
                        fileName="invoice.pdf"
                    >
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
