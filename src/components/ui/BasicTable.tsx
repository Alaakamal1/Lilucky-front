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
interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isImage?: boolean;
  isAction?: boolean;
}

interface ProductTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
}

export default function ProductTable({ columns, rows, onEdit, onDelete }: ProductTableProps) {
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
                sx={{ fontWeight: 'bold', color: '#403C3C', borderRight: '1px solid #F5AFAF' }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{

                '&:nth-of-type': { backgroundColor: '#FCF8F8' },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'center'}
                  sx={{ borderRight: '1px solid #f48fb1' }}
                >
                  {col.isImage ? (
                    <img
                      src={row[col.id]}
                      alt={row.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : col.isAction ? (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <IconButton
                        size="medium"
                        onClick={() => onEdit && onEdit(row)}
                      >
                        <VisibilityIcon fontSize="medium" />
                      </IconButton>

                      <IconButton
                        size="medium"
                        onClick={() => onEdit && onEdit(row)}
                      >
                        <EditIcon fontSize="medium" />
                      </IconButton>
                      <IconButton
                        size="medium"
                        onClick={() => onDelete && onDelete(row)}
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  ) : (
                    row[col.id]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
