import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import InvoiceStats from './InvoiceStats';
import InvoiceTable from './InvoiceTable';
import InvoiceDetail from './InvoiceDetail';
import type { Invoice } from '../../types';
import { sampleInvoices } from '../../data/mockData';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleMarkPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }
        : invoice
    ));
  };

  const handleDownload = () => {
    console.log('Downloading invoice...');
  };

  const handlePrint = () => {
    console.log('Printing invoice...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Track and manage vendor invoices</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <InvoiceStats />
      
      <InvoiceTable 
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        onMarkPaid={handleMarkPaid}
      />

      {selectedInvoice && (
        <InvoiceDetail 
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default Invoices;