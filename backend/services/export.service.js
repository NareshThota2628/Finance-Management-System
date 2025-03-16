const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Transaction, Budget } = require('../models');
const logger = require('../utils/logger');

const TEMP_DIR = path.join(__dirname, '../../temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

module.exports = {
  exportToCSV: async (userId) => {
    const filePath = path.join(TEMP_DIR, `${userId}-transactions-${Date.now()}.csv`);
    const transactions = await Transaction.findByUser(userId);

    try {
      const csvContent = [
        'Date,Amount,Category,Description',
        ...transactions.map(txn => 
          `${txn.date.toISOString()},${txn.amount},${txn.category},${txn.description}`
        )
      ].join('\n');

      fs.writeFileSync(filePath, csvContent);
      return filePath;
    } catch (error) {
      logger.error(`CSV Export Error: ${error.message}`);
      throw new Error('Failed to export CSV');
    }
  },

  exportToExcel: async (userId) => {
    const filePath = path.join(TEMP_DIR, `${userId}-report-${Date.now()}.xlsx`);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    try {
      const transactions = await Transaction.findByUser(userId);

      // Add headers
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Description', key: 'description', width: 40 }
      ];

      // Add rows
      transactions.forEach(txn => {
        worksheet.addRow({
          date: txn.date.toISOString(),
          amount: txn.amount,
          category: txn.category,
          description: txn.description
        });
      });

      // Save file
      await workbook.xlsx.writeFile(filePath);
      return filePath;
    } catch (error) {
      logger.error(`Excel Export Error: ${error.message}`);
      throw new Error('Failed to export Excel');
    }
  },

  cleanupTempFiles: () => {
    fs.readdir(TEMP_DIR, (err, files) => {
      if (err) return logger.error(`Cleanup Error: ${err.message}`);
      
      files.forEach(file => {
        const filePath = path.join(TEMP_DIR, file);
        fs.unlink(filePath, err => {
          if (err) logger.error(`File Deletion Error: ${err.message}`);
        });
      });
    });
  }
};