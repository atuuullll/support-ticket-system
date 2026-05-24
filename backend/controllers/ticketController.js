const Ticket = require('../models/Ticket');
const User = require('../models/User');

exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, tags } = req.body;
    const customerId = req.userId;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Technical',
      priority: priority || 'Medium',
      tags: tags || [],
      customerId,
    });

    await ticket.populate('customerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    let query = {};

    // Role-based filtering
    if (req.userRole === 'customer') {
      query.customerId = req.userId;
    } else if (req.userRole === 'agent') {
      query.agentId = req.userId;
    }
    // supervisors, case_managers, qa, analytics can see all

    // Additional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('customerId', 'name email')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('agentId', 'name email department');

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { status, priority, category, agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    // Only supervisors and case managers can assign agents
    if (agentId && ['supervisor', 'case_manager'].includes(req.userRole)) {
      ticket.agentId = agentId;
    }

    if (status) {
      ticket.status = status;
      if (status === 'Resolved') {
        ticket.resolvedAt = new Date();
      }
    }

    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    await ticket.save();
    await ticket.populate('customerId', 'name email');
    await ticket.populate('agentId', 'name email');

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    res.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.addInternalNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ 
        success: false, 
        message: 'Note is required' 
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    ticket.internalNotes.push({
      note: note.trim(),
      createdBy: req.userId,
    });

    await ticket.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      ticket,
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
