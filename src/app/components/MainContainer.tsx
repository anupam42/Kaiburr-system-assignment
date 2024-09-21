'use client';

import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { TableRow } from '../interface/TableRows';



const MainContainer: React.FC = () => {
  const [, setCheckedRows] = useState<TableRow[]>([]);


  const handleCheckboxChange = (checkedData: TableRow[]) => {
    setCheckedRows(checkedData);
  };

  return (
    <><div>
        <DataTable onCheckboxChange={handleCheckboxChange} />
     </div>
      </>
  );
};

export default MainContainer;
