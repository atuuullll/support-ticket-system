const express = require('express');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addInternalNote,
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Ticket CRUD
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);
router.delete('/:id', authorize('supervisor', 'case_manager'), deleteTicket);

// Internal notes (only agents & supervisors)
router.post('/:id/notes', authorize('agent', 'supervisor', 'case_manager'), addInternalNote);

module.exports = router;
