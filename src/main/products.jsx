import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Modal, Box, Typography, TextField, Button
} from '@mui/material'; // Import Modal and other necessary components
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

// Replace with your actual API endpoint
const API_URL = 'http://localhost:8000/api/products';

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // 'info', 'edit', 'delete'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`),
          },
        });
        console.log('API Response:', response.data);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (type, product) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  const handleEditSubmit = async () => {
    try {
      // Replace with your actual edit endpoint
      await axios.put(`${API_URL}/${selectedProduct.id}`, {
        name: selectedProduct.name,
        detail: selectedProduct.detail,
      }, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`),
        },
      });
      // Fetch updated data
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedProduct.id}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`),
        },
      });
      // Fetch updated data
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error);
    }
  };
  
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${sessionStorage.getItem('username')}:${sessionStorage.getItem('password')}`),
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.detail}</TableCell>
                  <TableCell>
                    <Tooltip title="View Info">
                      <IconButton onClick={() => handleOpenModal('info', row)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenModal('edit', row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleOpenModal('delete', row)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Info Modal */}
      <Modal
        open={modalType === 'info' && selectedProduct !== null}
        onClose={handleCloseModal}
        aria-labelledby="info-modal-title"
        aria-describedby="info-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="info-modal-title" variant="h6" component="h2">
            Product Info
          </Typography>
          {selectedProduct && (
            <div>
              <Typography variant="body1"><strong>ID:</strong> {selectedProduct.id}</Typography>
              <Typography variant="body1"><strong>Name:</strong> {selectedProduct.name}</Typography>
              <Typography variant="body1"><strong>Detail:</strong> {selectedProduct.detail}</Typography>
            </div>
          )}
          <Button onClick={handleCloseModal} variant="contained" color="primary">Close</Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={modalType === 'edit' && selectedProduct !== null}
        onClose={handleCloseModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Product
          </Typography>
          {selectedProduct && (
            <div>
              <TextField
                label="Name"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <TextField
                label="Detail"
                value={selectedProduct.detail}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, detail: e.target.value })}
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
              <Button onClick={handleCloseModal} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={modalType === 'delete' && selectedProduct !== null}
        onClose={handleCloseModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          {selectedProduct && (
            <div>
              <Typography variant="body1">Are you sure you want to delete the product with ID: {selectedProduct.id}?</Typography>
              <Button onClick={handleDeleteConfirm} variant="contained" color="primary">Yes</Button>
              <Button onClick={handleCloseModal} variant="contained" color="secondary">No</Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

// Style for modals
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default DataTable;
