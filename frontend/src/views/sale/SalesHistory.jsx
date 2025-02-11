import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv"; // For exporting CSV
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import PageContainer from "src/components/container/PageContainer";
import DashboardCard from "../../components/shared/DashboardCard";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, Select, TextField } from "@mui/material";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { fetchOrders } from "../../actions/orderActions";
import { NavLink, useNavigate } from "react-router-dom";

const SaleHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, orders, error } = useSelector((state) => state.orders);
  const [selectedRows, setSelectedRows] = useState([]);
  const [status, setStatus] = useState("");
  const [finanaceStatusState, finanaceSetStatusState] = useState("");
  const [ids, setIds] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Orders:", orders); // Debugging log
  }, [orders]);

  const handleEdit = (row) => {
    alert(`Edit product ID: ${row.order_id}`);
  };

  // set finance_status to null if the value is undefined
  const transformedOrders = orders?.map((order) => ({
    ...order,
    finance_status: order.finance_status || "N/A",
  }));

  const orderStatus = [...new Set(transformedOrders?.map((order) => order.status) || [])];
  const financeStatus = [...new Set(transformedOrders?.map((order) => order.finance_status) || [])];
  const orderIds = [...new Set(transformedOrders?.map((order) => order.order_id) || [])];

  // Filtered orders based on status & orderId
  const filteredOrders = transformedOrders?.filter((order) => {
    const statusMatch = status ? order.status === status : true;
    const financeStatusMatch = finanaceStatusState ? order.finance_status === finanaceStatusState : true;
    const idMatch = ids ? order.order_id === Number(ids) : true;
    const searchMatch = searchTerm ? order.order_id.toString().includes(searchTerm) : true;

    return statusMatch && financeStatusMatch && idMatch && searchMatch;
  });

  console.log("Filtered Orders:", filteredOrders); // Debugging log

  const csvHeaders = [
    { label: "Order ID", key: "order_id" },
    { label: "Customer ID", key: "customer_id" },
    { label: "Order Date", key: "order_date" },
    { label: "Status", key: "status" },
    { label: "Total Amount", key: "total_amount" },
  ];

  const csvReport = {
    data: filteredOrders,
    headers: csvHeaders,
    filename: "SaleHistoryReport.csv",
  };

  const columns = [
    { name: "No", selector: (row, index) => index + 1, width: "60px" },
    {
      name: "SO Number",
      selector: (row) => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        const formattedHour = today.getHours().toString().padStart(2, '0');
        return (
          <NavLink to={`/order-details/${row.order_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            SO{formattedDate}-{row.order_id}
          </NavLink>
        );
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
      width: "180px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.order_date).toLocaleDateString(),
      sortable: true,
      width: "150px",
    },
    {
      name: "Delivery Status",
      selector: (row) => row.status,
      sortable: true,
      width: "140px",
    },
    {
      name: "Payment Status",
      selector: (row) => row.finance_status,
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Amount",
      selector: (row) => row.total_amount,
      sortable: true,
      width: "140px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#5D87FF",
        minHeight: "56px",
        borderTopRightRadius: "8px",
        borderTopLeftRadius: "8px",
      },
    },
    headCells: {
      style: {
        color: "#FFF",
        fontSize: "14px",
        fontWeight: "bold",
        "&:not(:last-of-type)": {
          borderRight: "1px solid #e0e0e0",
        },
      },
    },
  };

  const handleSelectedRowsChange = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleRowClicked = (row) => {
    navigate(`/order-details/${row.order_id}`);
  };

  return (
    <PageContainer title="Sale History" description="this is product page">
      <DashboardCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Sale History List</h2>
          <div>
            <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                Export
              </Button>
            </CSVLink>
          </div>
        </div>

        {/* Status & order_id Filter Section */}
        <Box
          display="flex"
          sx={{ width: "60%", alignItems: "center" }}
          gap={2}
          mb={2}
        >
          {/* delivery status Dropdown */}
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Filter by Delivery Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Filter by Delivery Status"
            >
              <MenuItem value="">All Categories</MenuItem>
              {orderStatus.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* finance status Dropdown */}
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Filter by Finance Status</InputLabel>
            <Select
              value={finanaceStatusState}
              onChange={(e) => finanaceSetStatusState(e.target.value)}
              label="Filter by Finance Status"
            >
              <MenuItem value="">All Categories</MenuItem>
              {financeStatus.map((finance_status) => (
                <MenuItem key={finance_status} value={finance_status}>
                  {finance_status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Finance status search*/}
          <TextField
            size="small"
            label="Search Order ID"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* order_Id Dropdown 
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Filter by SO Number</InputLabel>
            <Select
              value={ids}
              onChange={(e) => setIds(e.target.value)}
              label="Filter by SO Number"
            >
              <MenuItem value="">All Orders</MenuItem>
              {orderIds.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          */}
        </Box>

        {/* Show Skeleton while Loading */}
        {loading ? (
          <Box>
            {[...Array(6)].map((_, index) => (
              <Box key={index} display="flex" alignItems="center" gap={2} p={1}>
                <Skeleton variant="text" width={40} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={130} />
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={160} />
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={110} />
                <Skeleton variant="text" width={90} />
              </Box>
            ))}
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={filteredOrders}
            pagination
            highlightOnHover
            striped
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            onRowClicked={handleRowClicked}
            subHeaderAlign="center"
            customStyles={customStyles}
          />
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default SaleHistoryPage;
