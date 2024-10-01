import React, { useState, useEffect, useMemo } from "react";
import { TableRow } from "../interface/TableRows";
import { fetchData } from "../services/dataService";
import {
  Card,
  CardContent,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/BarChart"),
  { ssr: false }
);

interface DataTableProps {
  onCheckboxChange: (checkedRows: TableRow[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onCheckboxChange }) => {
  const [allData, setAllData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedPages, setFetchedPages] = useState<{ [key: number]: boolean }>(
    {}
  );

  const searchTermTrimmed = searchTerm.trim();
  const maxPagesAllowed = 20;

  // Fetch initial data and preselect 5 rows
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchData(0, 5);
      const initialCheckedData = data.map((row, index) => ({
        ...row,
        isChecked: index < 5,
      }));

      setAllData(initialCheckedData);
      setCheckedRows(initialCheckedData.filter((row) => row.isChecked));
      setLoading(false);
      setFetchedPages({ 0: true });
    };
    loadData();
  }, []);

  //Search Data
  const serachData = useMemo(() => {
    const filteredData = allData.filter((row) =>
      row.name.includes(searchTermTrimmed)
    );
    return filteredData;
  }, [allData, searchTermTrimmed]);

  //Updating the current Data
  const currentPageData = serachData
    .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
    .map((row) => ({
      ...row,
      isChecked: checkedRows.some((checkedRow) => checkedRow.id === row.id),
    }));

  // Handle checkbox toggle
  const handleCheckboxChange = (id: number) => {
    const updatedData = currentPageData.map((row) => {
      if (row.id === id) {
        row.isChecked = !row.isChecked;
      }
      return row;
    });

    // Update the global checkedRows array
    const newCheckedRows = updatedData
      .filter((row) => row.isChecked)
      .concat(
        checkedRows.filter((row) => !updatedData.some((r) => r.id === row.id))
      );

    setCheckedRows(newCheckedRows);
    onCheckboxChange(newCheckedRows);
  };

  // Handle page change for Material-UI Pagination
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page > 20) {
      return;
    }
    setCurrentPage(page - 1);
    setLoading(true);
    const offset = page - 1;
    const pageNumber = page - 1; //storing as reference page for checking pevious fetched data

    //preventing from calling the api if its already fetched
    if (!fetchedPages[pageNumber]) {
      const fetchDataAndUpdate = async () => {
        const data = await fetchData(offset, 5);
        const updatedData = data.map((row) => ({
          ...row,
          isChecked: checkedRows.some((checkedRow) => checkedRow.id === row.id),
        }));
        setAllData((prevData) => [...prevData, ...updatedData]);
        setFetchedPages((prevPages) => ({ ...prevPages, [pageNumber]: true }));
        setLoading(false);
      };
      fetchDataAndUpdate();
    } else {
      setLoading(false);
    }
  };

  //Handle search data
  const handleSearchChange = (newSearch: React.SetStateAction<string>) => {
    setSearchTerm(newSearch);
    setCurrentPage(0);
  };

  return (
    <>
      <div
        style={{
          height: 400,
          width: "100%",
          marginTop: "5rem",
          padding: "2rem",
        }}
      >
        <div style={{ padding: ".5rem", width: "100%" }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(newSearch) => handleSearchChange(newSearch)}
          />
        </div>
        <div
          style={{
            overflowY: "auto",
            height: "calc(100% - 4rem)",
            padding: ".5rem",
          }}
        >
          {loading ? (
            <table style={{ width: "100%", tableLayout: "fixed" }}>
              <thead
                style={{ position: "sticky", top: 0, backgroundColor: "white" }}
              >
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
                    <td>
                      <Skeleton variant="rectangular" width={40} height={24} />
                    </td>
                    <td>
                      <Skeleton width="60%" />
                    </td>
                    <td>
                      <Skeleton width="100%" />
                    </td>
                    <td>
                      <Skeleton width="100%" />
                    </td>
                    <td>
                      <Skeleton width="100%" />
                    </td>
                    <td>
                      <Skeleton width="100%" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : currentPageData.length > 0 ? (
            <table style={{ width: "100%", tableLayout: "fixed" }}>
              <thead
                style={{ position: "sticky", top: 0, backgroundColor: "white" }}
              >
                <tr>
                  <th style={{ width: "70px" }}>Check</th>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th style={{ width: "70px" }}>Price</th>
                  <th style={{ width: "90px" }}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((row) => (
                  <tr key={row.id}>
                    <td width={40}>
                      <input
                        type="checkbox"
                        checked={row.isChecked}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </td>
                    <td width={60}>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.category}</td>
                    <td>{row.price}</td>
                    <td>{row.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>No text found</h2>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: "-0.7rem 0.1rem",
          }}
        >
          <Pagination
            count={
              Math.ceil(serachData.length / rowsPerPage) < maxPagesAllowed
                ? Math.ceil(serachData.length / rowsPerPage) + 1
                : maxPagesAllowed
            }
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
          <Typography>Page: {currentPage + 1}</Typography>
        </div>
      </div>

      {/*Component relies on browser-only APIs like window, https://nextjs.org/docs/messages/prerender-error can disable server-side rendering for that component */}
      <div style={{ margin: "5rem" }}>
        <Card
          sx={{
            minWidth: 275,
            display: "flex",
            justifyContent: "center",
            border: "1px solid #ccc",
            borderRadius: ".9rem",
          }}
        >
          <CardContent>
            <DynamicComponentWithNoSSR checkedRows={checkedRows} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DataTable;
