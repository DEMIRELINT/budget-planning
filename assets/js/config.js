// Configuration and Constants for Budget Planning App

// Expense Categories
const CATEGORIES = [
    "Mutfak",
    "Fatura",
    "Kira",
    "Abonelik",
    "Ulaşım",
    "Yakıt",
    "Eğlence",
    "Giyim",
    "Teknoloji",
    "Sağlık",
    "Eğitim",
    "Spor",
    "Ev & Bahçe",
    "Evcil Hayvan",
    "Kozmetik",
    "Diğer"
];

// Default colors for each category
const DEFAULT_COLORS = {
    "Mutfak": "#F87171",        // Rose
    "Fatura": "#FB923C",        // Orange
    "Kira": "#FBBF24",          // Amber
    "Abonelik": "#8B5CF6",      // Violet
    "Ulaşım": "#60A5FA",        // Blue
    "Yakıt": "#F59E0B",         // Amber Dark
    "Eğlence": "#A78BFA",       // Purple
    "Giyim": "#34D399",         // Emerald
    "Teknoloji": "#818CF8",     // Indigo
    "Sağlık": "#EC4899",        // Pink
    "Eğitim": "#3B82F6",        // Blue Strong
    "Spor": "#10B981",          // Emerald Strong
    "Ev & Bahçe": "#84CC16",    // Lime
    "Evcil Hayvan": "#F472B6",  // Pink Light
    "Kozmetik": "#FDA4AF",      // Rose Light
    "Diğer": "#9CA3AF"          // Gray
};

// Application state
let transactions = [];
let targets = {};
let categoryColors = {};
let chartInstance = null;
let comparisonChartInstance = null;
let selectedMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

