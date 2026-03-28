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
import Image from 'next/image';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isImage?: boolean;
  isAction?: boolean;
}

interface Variant {
  color: string;
  images: string[];
}

interface ProductRow {
  _id: string;
  name: string;
  variants: Variant[];
  [key: string]: any;
}

interface ProductTableProps {
  columns: Column[];
  rows: ProductRow[];
  onView?: (row: ProductRow) => void;
  onEdit?: (row: ProductRow) => void;
  onDelete?: (row: ProductRow) => void;
}

export default function ProductTable({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: '#FBEFEF' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'center'}
                sx={{
                  fontWeight: 'bold',
                  color: '#403C3C',
                  borderRight: '1px solid #F5AFAF',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              sx={{
                '&:nth-of-type(even)': { backgroundColor: '#FCF8F8' },
              }}
            >
              {columns.map((col) => {
                const image = row.variants?.[0]?.images?.[0];
                const imageSrc = image
                  ? image.startsWith('http')
                    ? image
                    : `http://localhost:5000/uploads/products/${image.replace(/^\/?/, "")}`
                  : '/fallback.png';

                return (
                  <TableCell
                    key={col.id}
                    align={col.align || 'center'}
                    sx={{ borderRight: '1px solid #f48fb1' }}
                  >
                    {col.isImage ? (
                      image ? (
                        <img 
                        className='center flex'
                          src={imageSrc}
                          alt={row.name}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <span>لا توجد صورة</span>
                      )
                    ) : col.isAction ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        {onView ? (
                          <IconButton size="medium" onClick={() => onView(row)}>
                            <VisibilityIcon fontSize="medium" />
                          </IconButton>
                        ) : (
                          <Link href={`/admin/availableProducts/${row._id}`}>
                            <IconButton size="medium">
                              <VisibilityIcon fontSize="medium" />
                            </IconButton>
                          </Link>
                        )}

                        <IconButton size="medium" onClick={() => onEdit?.(row)}>
                          <EditIcon fontSize="medium" />
                        </IconButton>

                        <IconButton size="medium" onClick={() => onDelete?.(row)}>
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </div>
                    ) : (
                      row[col.id]
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