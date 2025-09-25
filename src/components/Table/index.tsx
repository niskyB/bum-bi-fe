import React from "react";
import { Table as AntdTable } from "antd";
import { RefTable } from "antd/es/table/interface";
import { generateColumns } from "../../utils/table";

const Table: RefTable = ({ columns, ...rest }) => {
  const convertedColumns = React.useMemo(
    () => (columns ? generateColumns(columns) : undefined),
    [columns]
  );

  return <AntdTable {...rest} columns={convertedColumns} />;
};

export default Table;
