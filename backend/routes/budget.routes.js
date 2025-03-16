const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const authMiddleware = require('../middleware/auth');
const { validateCreateBudget } = require('../middleware/validation');

// Protect all routes
router.use(authMiddleware);

// Create new budget
router.post('/', validateCreateBudget, budgetController.createBudget);

// Get budget progress
router.get('/progress', budgetController.getBudgetProgress);

// Update budget
router.put('/:budgetId', budgetController.updateBudget);

// Delete budget
router.delete('/:budgetId', budgetController.deleteBudget);

module.exports = router;