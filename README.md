# 💰 Personal Budget Planner

A clean, modern, and fully featured budget tracking application, built with vanilla JavaScript and local storage. No server required, all your data stays on your device!

![Budget Planner](https://img.shields.io/badge/version-5.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📊 **Income & Expense Tracking** - Track all your financial transactions
- 🎯 **Budget Targets** - Set monthly spending limits by category
- 📈 **Visual Analytics** - Charts and graphs powered by Chart.js
- 🎨 **Customizable Categories** - Change colors for each category
- 🌓 **Dark Mode** - Beautiful dark/light theme support
- 🌍 **Multilanguage** - English & Turkish support
- 💾 **Backup & Restore** - Export and import your data as JSON
- 📅 **Date Selection**  - Add transactions with custom dates
- 📂 **Category Analysis** - Detailed breakdown of expenses by category
- 🔒 **Privacy First** - All data stored locally, no server required

## 🚀 Getting Started

### Quick Start

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start tracking your budget!

That's it! No installation, no dependencies beyond a web browser.

### File Structure

```
Bütçe Planlama/
├── index.html          # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       ├── config.js       # Categories & default colors
│       ├── translations.js # Multilanguage support
│       └── app.js          # Main application logic
└── README.md           # You are here
```

## 📖 Usage Guide

### Adding Income/Expenses

1. **Expand the form**: Click the "Add" button in either Income or Expenses section
2. **Fill details**: Enter description, amount, category (for expenses), and date
3. **Save**: Click "Add Entry" to record the transaction

### Setting Budget Targets

1. Click the "Set Target" button in the header
2. Enter target amounts for each spending category
3. Track your progress in the "Budget Target Tracking" section

### Category Analysis

1. Click "Category Analysis" button in the Expenses section
2. V

iew all expenses grouped by category
3. Sort by amount (high to low or low to high)
4. Edit or delete individual items directly from the modal

### Customizing Colors

1. Click the "Colors" button in the header
2. Choose your preferred color for each category
3. Changes are reflected immediately in charts and lists

### Backup & Restore

- **Backup**: Click the download icon (💾) to export your data
- **Restore**: Click the upload icon (📤) and select a previously exported JSON file

## 🌐 Language Support

The app supports two languages:
- 🇬🇧 **English** (default)
- 🇹🇷 **Turkish**

Click the language button in the header to switch between them.

## 🎨 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with Tailwind CSS
- **JavaScript (ES6+)** - Application logic
- **Chart.js** - Data visualization
- **localStorage** - Data persistence
- **Font Awesome** - Icons

## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🔧 Technical Details

### Data Storage

All data is stored in browser's `localStorage` under the key `budget_v5_data`. The structure includes:
- `transactions`: Array of all income/expense records
- `targets`: Monthly budget targets by category
- `categoryColors`: Custom color preferences

### Data Format

```json
{
  "transactions": [
    {
      "id": 1234567890,
      "type": "expense",
      "name": "Groceries",
      "amount": 150,
      "category": "Mutfak",
      "date": "2026-02-04T12:00:00.000Z"
    }
  ],
  "targets": {
    "Mutfak": 5000,
    "Kira": 10000
  },
  "categoryColors": {
    "Mutfak": "#F87171"
  }
}
```

## 🤝 Contributing

Want to add a feature or fix a bug? Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Font Awesome](https://fontawesome.com/) for icons
- Google Fonts for the Inter font family

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

Made with ❤️ for better personal finance management
