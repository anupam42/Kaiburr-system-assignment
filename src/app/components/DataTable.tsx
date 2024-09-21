import React, { useState, useEffect } from 'react';
import { TableRow } from '../interface/TableRows';
import { fetchData } from '../services/dataService';
import { Pagination, Skeleton } from '@mui/material';

interface DataTableProps {
  onCheckboxChange: (checkedRows: TableRow[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onCheckboxChange }) => {
  const [allData, setAllData] = useState<TableRow[]>([]);
  const [currentPageData, setCurrentPageData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch initial data and preselect 5 rows
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      const data = await fetchData(0, 100);
      const initialCheckedData = data.map((row, index) => ({
        ...row,
        isChecked: index < 5,
      }));

      setAllData(initialCheckedData);
      setCurrentPageData(initialCheckedData.slice(0, rowsPerPage));
      setCheckedRows(initialCheckedData.filter((row) => row.isChecked));
      setLoading(false); // Stop loading
    };
    loadData();
  }, [rowsPerPage]);

  // Handle filtered data based on the search term
  const filteredData = allData.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination and maintain checked state
  useEffect(() => {
    const startIdx = currentPage * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const pageData = filteredData.slice(startIdx, endIdx).map((row) => ({
      ...row,
      isChecked: checkedRows.some((checkedRow) => checkedRow.id === row.id),
    }));
    setCurrentPageData(pageData);
  }, [currentPage, rowsPerPage, filteredData, checkedRows]);

  // Handle checkbox toggle
  const handleCheckboxChange = (id: number) => {
    const updatedData = currentPageData.map((row) => {
      if (row.id === id) {
        row.isChecked = !row.isChecked;
      }
      return row;
    });
    setCurrentPageData(updatedData);

    // Update the global checkedRows array
    const newCheckedRows = updatedData
      .filter((row) => row.isChecked)
      .concat(checkedRows.filter((row) => !updatedData.some((r) => r.id === row.id)));

    setCheckedRows(newCheckedRows);
    onCheckboxChange(newCheckedRows);
  };

  // Handle page change for Material-UI Pagination
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <>
      <div style={{ height: 400, width: "100%", marginTop: '5rem', padding:'2rem' }}>
        <div style={{padding:'.5rem',width:"100%"}}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
        </div>
        <div style={{ overflowY: 'auto', height: 'calc(100% - 4rem)' }}>
          {loading ? (
            // Show Skeleton loader while data is being fetched
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                <tr>
                  <th>Check</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(rowsPerPage)].map((_, index) => (
                  <tr key={index}>
                    <td><Skeleton variant="rectangular" width={24} height={24} /></td>
                    <td><Skeleton width="100%" /></td>
                    <td><Skeleton width="100%" /></td>
                    <td><Skeleton width="100%" /></td>
                    <td><Skeleton width="100%" /></td>
                    <td><Skeleton width="100%" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Show data once loading is finished
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                <tr>
                  <th>Check</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.isChecked}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.category}</td>
                    <td>{row.price}</td>
                    <td>{row.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin:'1.5rem' }}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)} // Total pages
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
