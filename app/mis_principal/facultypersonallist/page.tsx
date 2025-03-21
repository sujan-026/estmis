'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { Parser } from 'json2csv';
import { format } from 'date-fns';
const FacultyTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['faculty_name']);

  const allColumns = [
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'department', label: 'Department' },
    { key: 'photo', label: 'Photo' },
    { key: 'title', label: 'Title' },
    { key: 'faculty_name', label: 'Faculty Name' },
    { key: 'emailId', label: 'Email ID' },
    { key: 'contactNo', label: 'Contact No' },
    { key: 'alternateContactNo', label: 'Alternate Contact No' },
    { key: 'emergencyContactNo', label: 'Emergency Contact No' },
    { key: 'adharNo', label: 'Adhar No' },
    { key: 'panNo', label: 'PAN No' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'firstAddressLine', label: 'First Address Line' },
    { key: 'correspondenceAddressLine', label: 'Correspondence Address Line' },
    { key: 'religion', label: 'Religion' },
    { key: 'caste', label: 'Caste' },
    { key: 'category', label: 'Category' },
    { key: 'motherTongue', label: 'Mother Tongue' },
    { key: 'speciallyChallenged', label: 'Specially Challenged' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'languages', label: 'Languages' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'accountNo', label: 'Account No' },
    { key: 'accountName', label: 'Account Name' },
    { key: 'accountType', label: 'Account Type' },
    { key: 'branch', label: 'Branch' },
    { key: 'ifsc', label: 'IFSC' },
    { key: 'pfNumber', label: 'PF Number' },
    { key: 'uanNumber', label: 'UAN Number' },
    { key: 'pensionNumber', label: 'Pension Number' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'spouseName', label: 'Spouse Name' },
    { key: 'children', label: 'Children' },
    { key: 'dateOfJoiningDrait', label: 'Date of Joining' },
    { key: 'designation', label: 'Designation' },
    { key: 'aided', label: 'Aided' }
  ];

  const defaultVisibleColumns = [
    'faculty_name',
    'emailId',
    'contactNo',
    'qualification',
    'firstAddressLine',
    'designation',
    'aided'
  ];
  const formatValue = (key, value) => {
    if (!value) return '-';

    // Format dates to DD-MM-YYYY
    if (key === 'dob' || key === 'dateOfJoiningDrait') {
      return format(new Date(value), 'dd-MM-yyyy');
    }

    // Format numbers for specific keys or if in exponential form
    if (
      typeof value === 'number' ||
      ['contactNo', 'alternateContactNo', 'emergencyContactNo', 'adharNo', 'panNo', 'accountNo', 'ifsc', 'pfNumber', 'uanNumber', 'pensionNumber'].includes(key)
    ) {
      // Handle exponential numbers and ensure plain number string
      return Number(value).toLocaleString('fullwide', { useGrouping: false });
    }

    return value;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/hod/branches');
        if (!response.ok) {
          throw new Error(`Error fetching branches: ${response.statusText}`);
        }
        const result = await response.json();
        setBranches(result.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchFilter = selectedBranches.some((branch) => branch.value === 'all')
          ? '' // Fetch all branches if "All Branches" is selected
          : selectedBranches.map((branch) => branch.value).join(',');


        const url = branchFilter
          ? `/api/hod/fac_personal?branches=${encodeURIComponent(branchFilter)}`
          : '/api/principal/fac_personal'; // Default fetch for all branches
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.data.length > 0) {
          const columnNames = Object.keys(result.data[0]).filter(
            (key) => key !== 'id' && key !== 'isRegistered' && key !== 'faculty_name'
          );
          setColumns(columnNames);
          setVisibleColumns(['faculty_name', ...defaultVisibleColumns.filter((col) => col !== 'faculty_name')]);
        }

        setData(result.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [selectedBranches]);

  const columnOptions = allColumns.map((col) => ({
    value: col.key,
    label: col.label
  }));

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    ...branches.map((branch) => ({
      value: branch.brcode,
      label: branch.brcode_title
    }))
  ];
  const selectAllColumns = () => {
    setVisibleColumns(['faculty_name', ...columns]);
  };

  const exportToCSV = () => {
    try {
      const fields = visibleColumns.map(
        (col) => allColumns.find((column) => column.key === col)?.label
      );

      const validFields = fields.filter((field): field is string => field !== undefined);

      const rows = data.map((row, idx) =>
        visibleColumns.reduce(
          (acc, col) => {
            const columnLabel = allColumns.find((column) => column.key === col)?.label || col;
            acc[columnLabel] = formatValue(col, row[col]);
            return acc;
          },
          { 'Sl. No': idx + 1 }
        )
      );

      const json2csvParser = new Parser({ fields: ['Sl. No', ...validFields] });
      const csv = json2csvParser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faculty_data_${selectedBranches.map((b) => b.label).join('_') || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Faculty Details</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Filter by Branch:</label>
        <Select
          options={branchOptions}
          value={selectedBranches}
          onChange={(selected) => setSelectedBranches(selected || [])}
          isMulti
          placeholder="Select branches"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Columns:</label>
        <Select
          options={columnOptions}
          isMulti
          value={columnOptions.filter((col) => visibleColumns.includes(col.value))}
          onChange={(selectedOptions) => {
            const selectedKeys = selectedOptions.map((option: any) => option.value);
            if (!selectedKeys.includes('faculty_name')) selectedKeys.unshift('faculty_name');
            setVisibleColumns(selectedKeys);
          }}
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 })
          }}
        />
                <button
          className="border px-4 py-2 bg-gray-200 rounded mt-2 hover:bg-gray-300"
          onClick={selectAllColumns}
        >
          Select All Columns
        </button>
        <button
          className="border px-4 py-2 bg-green-500 text-white rounded mt-2 hover:bg-green-600 ml-2"
          onClick={exportToCSV}
        >
          Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Sl. No</th>
              {visibleColumns.map((col) => (
                <th key={col} className="border border-gray-300 px-4 py-2 text-left">
                  {allColumns.find((column) => column.key === col)?.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                {visibleColumns.map((col) => (
                  <td key={col} className="border border-gray-300 px-4 py-2">
                    {col === 'aided' ? (row[col] === 1 ? 'YES' : 'NO') : formatValue(col, row[col]) || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(FacultyTable), { ssr: false });
