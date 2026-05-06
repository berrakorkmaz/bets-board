import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="table-skeleton">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="table-skeleton__row">
          <span className="table-skeleton__cell short" />
          <span className="table-skeleton__cell medium" />
          <span className="table-skeleton__cell medium" />
          <span className="table-skeleton__cell short" />
          <span className="table-skeleton__cell long" />
          <span className="table-skeleton__cell long" />
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
