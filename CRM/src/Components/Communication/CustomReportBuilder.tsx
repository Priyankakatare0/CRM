import React, { useState } from 'react';
import { Filter, Customer } from '../types';
import { FilterX, Plus, FileSpreadsheet } from 'lucide-react';

// Sample data - replace with your actual data source
const sampleCustomers: Customer[] = [
  { id: '1', name: 'John Doe', joiningDate: '2024-01-15', salary: 50000 },
  { id: '2', name: 'Jane Smith', joiningDate: '2024-02-20', salary: 60000 },
  { id: '3', name: 'Bob Johnson', joiningDate: '2024-03-01', salary: 45000 },
];

const CustomReportBuilder = () => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [reportName, setReportName] = useState('');

  const addFilter = () => {
    setFilters([...filters, { field: 'name', operator: 'greaterThan', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<Filter>) => {
    setFilters(
      filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter))
    );
  };

  const applyFilters = (customers: Customer[]): Customer[] => {
    return customers.filter(customer => {
      return filters.every(filter => {
        const value = customer[filter.field];
        if (filter.operator === 'greaterThan') {
          return value > filter.value;
        }
        return value < filter.value;
      });
    });
  };

  const filteredCustomers = applyFilters(sampleCustomers);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Custom Report Builder</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Name
          </label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter report name"
          />
        </div>

        <div className="space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-md">
              <select
                value={filter.field}
                onChange={(e) => updateFilter(index, { field: e.target.value as Filter['field'] })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Customer Name</option>
                <option value="joiningDate">Joining Date</option>
                <option value="salary">Salary</option>
              </select>

              <select
                value={filter.operator}
                onChange={(e) => updateFilter(index, { operator: e.target.value as Filter['operator'] })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
              </select>

              <input
                type={filter.field === 'joiningDate' ? 'date' : filter.field === 'salary' ? 'number' : 'text'}
                value={filter.value}
                onChange={(e) => updateFilter(index, { value: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${filter.field}`}
              />

              <button
                onClick={() => removeFilter(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <FilterX className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            onClick={addFilter}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Filter</span>
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Preview Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.joiningDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${customer.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReportBuilder;