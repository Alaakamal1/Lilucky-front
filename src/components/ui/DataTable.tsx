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
import React from 'react';

/* 🔥 Column Type */
interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isAction?: boolean;
  render?: (row: any) => React.ReactNode;
}

/* ✅ FULL ACTION CONTROL */
type ActionConfig = {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
};

interface Props {
  columns: Column[];
  rows: any[];
  rowKey?: string;

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;

  viewRoute?: (row: any) => string;

  actions?: ActionConfig;
}

/* 🔥 default */
const defaultActions: ActionConfig = {
  view: true,
  edit: true,
  delete: true,
};

export default function DataTable({
  columns,
  rows,
  rowKey = '_id',
  onView,
  onEdit,
  onDelete,
  viewRoute,
  actions = defaultActions,
}: Props) {

  /* 🔥 header dynamic */
  const actionLabel = [
    actions.view ? 'تفاصيل' : null,
    actions.edit ? 'تعديل' : null,
    actions.delete ? 'حذف' : null,
  ]
    .filter(Boolean)
    .join(' / ');

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 650 }}>

        {/* HEADER */}
        <TableHead sx={{ backgroundColor: '#FBEFEF' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'center'}
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                }}
              >
                {col.isAction ? actionLabel : col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row[rowKey]}
              sx={{
                '&:hover': { backgroundColor: '#fafafa' },
              }}
            >
              {columns.map((col) => {
                const value = row[col.id];

                const isImage =
                  typeof value === 'string' &&
                  (value.startsWith('http') ||
                    value.includes('.png') ||
                    value.includes('.jpg') ||
                    value.includes('.jpeg'));

                return (
                  <TableCell
                    key={col.id}
                    align={col.align || 'center'}
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    }}
                  >

                    {/* custom render */}
                    {col.render ? (
                      col.render(row)

                    ) : col.isAction ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >

                        {/* 👁 VIEW */}
                        {actions.view &&
                          (viewRoute ? (
                            <Link href={viewRoute(row)}>
                              <IconButton size="small">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          ) : (
                            <IconButton size="small" onClick={() => onView?.(row)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          ))}

                        {/* ✏️ EDIT */}
                        {actions.edit && (
                          <IconButton size="small" onClick={() => onEdit?.(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}

                        {/* 🗑 DELETE */}
                        {actions.delete && (
                          <IconButton size="small" onClick={() => onDelete?.(row)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}

                      </div>

                    ) : isImage ? (
                      <img
                        src={value}
                        width={40}
                        height={40}
                        style={{
                          borderRadius: 8,
                          objectFit: 'cover',
                        }}
                      />

                    ) : (
                      <span
                        style={{
                          fontSize: '0.8rem',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {value || '—'}
                      </span>
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