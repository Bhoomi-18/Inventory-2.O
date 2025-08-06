import React from 'react';
import { Package } from 'lucide-react';
import type { RepairTicket } from '../../types';

interface RepairTableProps {
  tickets: RepairTicket[];
}

const RepairTable: React.FC<RepairTableProps> = ({ tickets }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Active Repair Tickets</h3>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ISSUE</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">REPAIR VENDOR</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">COST</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{ticket.asset}</p>
                    <p className="text-sm text-gray-500">{ticket.assetId}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900">{ticket.issue}</p>
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                </div>
              </td>
              <td className="p-4 text-sm text-gray-900">{ticket.vendor}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  ticket.status === 'In Progress' 
                    ? 'bg-orange-100 text-orange-800'
                    : ticket.status === 'Complete'
                    ? 'bg-green-100 text-green-800'
                    : ticket.status === 'Awaiting Parts'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </td>
              <td className="p-4 text-sm font-medium text-gray-900">${ticket.cost}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View Ticket</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Update Status</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RepairTable;