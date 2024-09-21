'use client';

import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import BarChart from '../components/BarChart';
import { TableRow } from '../interface/TableRows';

const MainContainer: React.FC = () => {
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([]);


  const handleCheckboxChange = (checkedData: TableRow[]) => {
    setCheckedRows(checkedData);
  };

  return (
    <><div>
        <DataTable onCheckboxChange={handleCheckboxChange} />
     </div>
     <div style={{margin:'5rem'}}>
           <BarChart checkedRows={checkedRows} />
      </div>
      </>
  );
};

export default MainContainer;
