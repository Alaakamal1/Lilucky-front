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

/* ================= TYPES ================= */

export interface Column<T> {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isAction?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface ActionConfig {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
}

interface Props<T extends object> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;

  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  viewRoute?: (row: T) => string;

  actions?: ActionConfig;
}

/* ================= DEFAULT ================= */

const defaultActions: ActionConfig = {
  view: true,
  edit: true,
  delete: true,
};

/* ================= COMPONENT ================= */

export default function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  onView,
  onEdit,
  onDelete,
  viewRoute,
  actions = defaultActions,
}: Props<T>) {

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
          {rows.map((row) => {
            const id = rowKey(row);

            return (
              <TableRow
                key={id}
                sx={{
                  '&:hover': { backgroundColor: '#fafafa' },
                }}
              >
                {columns.map((col) => {
                  const value = row[col.id as keyof T];

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
                      {/* CUSTOM RENDER */}
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
                          {/* VIEW */}
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

                          {/* EDIT */}
                          {actions.edit && (
                            <IconButton size="small" onClick={() => onEdit?.(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}

                          {/* DELETE */}
                          {actions.delete && (
                            <IconButton size="small" onClick={() => onDelete?.(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </div>

                      ) : isImage ? (
                        <img
                          src={value as string}
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
                          {value ? String(value) : '—'}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>

      </Table>
    </TableContainer>
  );
}