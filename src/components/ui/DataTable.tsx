'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isImage?: boolean;
  isAction?: boolean;
  render?: (row: any) => React.ReactNode; // 🔥 مهم جداً
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  rowKey?: string;
  baseImageUrl?: string;
  imageField?: string;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  viewRoute?: (row: any) => string; // 🔥 dynamic route
}

export default function DataTable({
  columns,
  rows,
  rowKey = '_id',
  baseImageUrl,
  imageField,
  onView,
  onEdit,
  onDelete,
  viewRoute,
}: DataTableProps) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#FBEFEF' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'center'}
                sx={{ fontWeight: 'bold', color: '#403C3C' }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[rowKey]}>
              {columns.map((col) => {
                const value = row[col.id];

                return (
                  <TableCell key={col.id} align={col.align || 'center'}>

                    {/* 🔥 custom render */}
                    {col.render ? (
                      col.render(row)
                    ) : col.isImage ? (
                      value ? (
                        <img
                          src={
                            baseImageUrl
                              ? `${baseImageUrl}/${value}`
                              : value
                          }
                          width={50}
                          height={50}
                          style={{ borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        'لا توجد صورة'
                      )
                    ) : col.isAction ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>

                        {/* 👁 view */}
                        {viewRoute ? (
                          <Link href={viewRoute(row)}>
                            <IconButton>
                              <VisibilityIcon />
                            </IconButton>
                          </Link>
                        ) : (
                          <IconButton onClick={() => onView?.(row)}>
                            <VisibilityIcon />
                          </IconButton>
                        )}

                        {/* ✏️ edit */}
                        <IconButton onClick={() => onEdit?.(row)}>
                          <EditIcon />
                        </IconButton>

                        {/* 🗑 delete */}
                        <IconButton onClick={() => onDelete?.(row)}>
                          <DeleteIcon />
                        </IconButton>

                      </div>
                    ) : (
                      value
                    )}

                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}