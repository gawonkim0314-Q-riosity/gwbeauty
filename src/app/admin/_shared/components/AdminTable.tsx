"use client";

import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function AdminTable<T>({
  columns,
  data,
  keyField,
  isLoading,
  onEdit,
  onDelete,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-[#A895C0]">
        <p className="text-sm">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #EDE8F5" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#F7F5FF" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold text-[#5A4070] whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right font-semibold text-[#5A4070] w-24">
                작업
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={String(row[keyField])}
              className="border-t hover:bg-[#FAF8FF] transition-colors"
              style={{ borderColor: "#EDE8F5" }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[#2D1B4E]">
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-[#8B64C8] hover:bg-[#F0EBFF] transition-colors"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-[#D4547A] hover:bg-[#FFF0F4] transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
