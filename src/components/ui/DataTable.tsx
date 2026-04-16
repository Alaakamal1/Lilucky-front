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
  isAction?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface Props {
  columns: Column[];
  rows: any[];
  rowKey?: string;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  viewRoute?: (row: any) => string;
}

export default function DataTable({
  columns,
  rows,
  rowKey = '_id',
  onView,
  onEdit,
  onDelete,
  viewRoute,
}: Props) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>

        {/* HEADER */}
        <TableHead sx={{ backgroundColor: '#FBEFEF' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align || 'center'}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[rowKey]}>

              {columns.map((col) => {
                const value = row[col.id];

                // IMAGE HANDLING
                const isImage =
                  typeof value === 'string' &&
                  (value.startsWith('http') ||
                    value.includes('.png') ||
                    value.includes('.jpg') ||
                    value.includes('.jpeg'));

                return (
                  <TableCell key={col.id} align={col.align || 'center'}>

                    {/* custom render */}
                    {col.render ? (
                      col.render(row)

                    ) : col.isAction ? (
                      <div style={{ display: 'flex', gap: 6 }}>

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

                        <IconButton onClick={() => onEdit?.(row)}>
                          <EditIcon />
                        </IconButton>

                        <IconButton onClick={() => onDelete?.(row)}>
                          <DeleteIcon />
                        </IconButton>

                      </div>

                    ) : isImage ? (
                      <img
                        src={value}
                        width={50}
                        height={50}
                        style={{
                          borderRadius: 6,
                          objectFit: 'cover',
                        }}
                      />

                    ) : (
                      value || '—'
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