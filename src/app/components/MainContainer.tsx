'use client';

import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { TableRow } from '../interface/TableRows';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/BarChart'),
  { ssr: false }
)


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
     <DynamicComponentWithNoSSR checkedRows={checkedRows} />
      </div>
      </>
  );
};

export default MainContainer;
