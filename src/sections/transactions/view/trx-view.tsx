import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import endpoints from 'src/contants/apiEndpoint';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TrxTableRow } from '../trx-table-row';
import { TrxTableHead } from '../trx-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { TrxTableToolbar } from '../trx-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { TrxProps } from '../trx-table-row';

// ----------------------------------------------------------------------

export function TrxView() {
  const table = useTable();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<TrxProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatusDibayar, setFilterStatusDibayar] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const dashboardResponse = await fetch(endpoints.dashboard, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const dashboardData = await dashboardResponse.json();
        if (!dashboardResponse.ok) {
          throw new Error(dashboardData.message || 'Failed to fetch dashboard data.');
        }

        const userRole = dashboardData.data?.user?.role;
        if (userRole !== 'admin' && userRole !== 'kasir') {
          navigate('/dashboard');
          return;
        }

        const transactionsResponse = await fetch(endpoints.trx, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const transactionsData = await transactionsResponse.json();
        if (!transactionsResponse.ok || !transactionsData.success) {
          throw new Error(transactionsData.message || 'Failed to fetch transactions.');
        }

        const mappedTransactions = transactionsData.data.map((transaction: TrxProps) => ({
          ...transaction,
          status:
            transaction.status === 'baru'
              ? 'Baru'
              : transaction.status === 'proses'
                ? 'Proses'
                : transaction.status === 'selesai'
                  ? 'Selesai'
                  : transaction.status === 'diambil'
                    ? 'Diambil'
                    : '',
        }));

        setTransactions(mappedTransactions);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const handleFilterStatusDibayar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatusDibayar(event.target.value);
    table.onResetPage();
  };

  const dataFiltered: TrxProps[] = applyFilter({
    inputData: transactions.filter((transaction) =>
      filterStatusDibayar ? transaction.dibayar === filterStatusDibayar : true
    ),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" mb={5}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Link>
          <Typography color="textPrimary">Transactions</Typography>
        </Breadcrumbs>
      </Box>

      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Transactions Management
        </Typography>
        <Button
          href="/trx/create-trx"
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Transaction
        </Button>
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Filter Status Pembayaran:
        </Typography>
        <select value={filterStatusDibayar} onChange={handleFilterStatusDibayar}>
          <option value="">Semua</option>
          <option value="dibayar">Dibayar</option>
          <option value="belum_dibayar">Belum Dibayar</option>
        </select>
      </Box>

      <Card>
        <TrxTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {loading ? (
              <Typography sx={{ textAlign: 'center', padding: 3 }}>Loading...</Typography>
            ) : error ? (
              <Typography sx={{ textAlign: 'center', color: 'red', padding: 3 }}>
                {error}
              </Typography>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TrxTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={transactions.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      transactions.map((transaction) => transaction.id)
                    )
                  }
                  headLabel={[
                    { id: 'kode_invoice', label: 'Invoice Code' },
                    { id: 'biaya_tambahan', label: 'Additional Price' },
                    { id: 'status', label: 'Status' },
                    { id: 'dibayar', label: 'Status Paid' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TrxTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteUser={handleDeleteTransaction}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, transactions.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={transactions.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((inputValue: string) => {
    setSelected((prev) =>
      prev.includes(inputValue)
        ? prev.filter((value) => value !== inputValue)
        : [...prev, inputValue]
    );
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((_: any, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    onSort,
    onSelectAllRows,
    onSelectRow,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
