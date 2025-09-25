import React from "react";
import { ColumnsType } from "antd/es/table";
import { RenderedCell } from "rc-table/lib/interface";

export const generateColumns = <T extends any>(
  columns: ColumnsType<T>
): ColumnsType<T> => {
  const isRenderedCell = (object: any): object is RenderedCell<T> => {
    return (
      object !== null && typeof object === "object" && "children" in object
    );
  };
  const getValueByDataIndex = (record: any, dataIndex: any): any => {
    if (dataIndex === undefined || dataIndex === null) return undefined;
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce(
        (acc: any, key: any) => (acc == null ? acc : acc[key]),
        record
      );
    }
    return record?.[dataIndex as any];
  };
  return columns.map((column) => {
    const originalRender = column.render;
    return {
      ...column,
      onCell: (record: T, rowIndex?: number) => {
        const text = getValueByDataIndex(
          record as any,
          (column as any).dataIndex
        );
        const rendered = originalRender
          ? originalRender(text, record, rowIndex as any)
          : text;
        if (isRenderedCell(rendered) && rendered.props) {
          return { ...rendered.props } as any;
        }
        return {} as any;
      },
      render: (text: any, record: T, index: number) => {
        const rendered = originalRender
          ? originalRender(text, record, index)
          : text;
        let data: React.ReactNode = (
          <div style={{ visibility: "hidden" }}>blank</div>
        );
        if (isRenderedCell(rendered)) {
          data = rendered.children;
        } else if (rendered !== null && rendered !== undefined) {
          data = rendered;
        }
        return (
          <figure className="content">
            <figcaption className="text">
              <div className="table-data-content">{data}</div>
            </figcaption>
          </figure>
        );
      },
    };
  });
};
