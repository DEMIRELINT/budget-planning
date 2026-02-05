// Multilanguage Translation System for Budget Planning App

const TRANSLATIONS = {
    en: {
        header: {
            title: "Budget V5",
            darkMode: "Toggle Dark Mode",
            colors: "Colors",
            setTarget: "Set Target",
            download: "Backup",
            upload: "Restore"
        },
        cards: {
            totalIncome: "Total Income",
            totalExpense: "Total Expense",
            balance: "Net Balance"
        },
        income: {
            title: "Income",
            placeholder: "Description (e.g., Salary)",
            amount: "Amount",
            add: "Add",
            empty: "No income found for selected month."
        },
        expense: {
            title: "Expenses",
            placeholder: "Description (e.g., Groceries)",
            category: "Category",
            amount: "Amount",
            add: "Add",
            empty: "No expenses found for selected month."
        },
        categories: {
            "Mutfak": "Kitchen",
            "Fatura": "Bills",
            "Kira": "Rent",
            "Abonelik": "Subscription",
            "Ulaşım": "Transport",
            "Yakıt": "Fuel",
            "Eğlence": "Entertainment",
            "Giyim": "Clothing",
            "Teknoloji": "Technology",
            "Sağlık": "Health",
            "Eğitim": "Education",
            "Spor": "Sports & Fitness",
            "Ev & Bahçe": "Home & Garden",
            "Evcil Hayvan": "Pet",
            "Kozmetik": "Beauty & Care",
            "Diğer": "Other",
            "Gelir": "Income"
        },
        budget: {
            title: "Budget Target Tracking",
            subtitle: "Monthly Analysis",
            goodStatus: "On Track",
            warningStatus: "Warning!",
            exceededStatus: "Exceeded!",
            noTargetStatus: "No Target",
            empty: "No targets set yet. Use \"Set Target\" button."
        },
        charts: {
            distribution: "Expense Distribution",
            comparison: "Target vs Actual",
            insights: "Monthly Insights",
            noData: "No expense data.",
            maxCategory: "This month you spent the most on \"{category}\".",
            target: "Target",
            actual: "Actual"
        },
        modals: {
            colors: {
                title: "Category Colors",
                reset: "Reset to Default",
                save: "Save"
            },
            target: {
                title: "Monthly Budget Targets",
                save: "Save"
            },
            edit: {
                title: "Edit",
                cancel: "Cancel",
                save: "Save"
            },
            categoryAnalysis: {
                title: "Category Analysis",
                sortBy: "Sort by:",
                highToLow: "High to Low",
                lowToHigh: "Low to High",
                noExpenses: "No expenses found for selected month.",
                total: "Total"
            }
        },
        messages: {
            fillFields: "Please enter name and amount.",
            deleteConfirm: "Are you sure you want to delete?",
            resetColorsConfirm: "Do you want to reset all colors to default?",
            dataRestored: "Data restored successfully!",
            oldDataUpgraded: "Old data successfully upgraded to V5 format!"
        },
        buttons: {
            add: "Add",
            addExpanded: "Add Entry",
            categoryAnalysis: "Category Analysis",
            date: "Date",
            recurring: "Recurring",
            cashbackSection: "Cashback/Points (Optional)"
        },
        recurring: {
            monthly: "Monthly",
            badge: "🔁 Recurring"
        },
        cashback: {
            percent: "Cashback % (e.g., 5)",
            points: "Points Earned",
            net: "Net"
        },
        insights: {
            savings: "Total Savings"
        },
        months: {
            1: "January", 2: "February", 3: "March", 4: "April",
            5: "May", 6: "June", 7: "July", 8: "August",
            9: "September", 10: "October", 11: "November", 12: "December"
        }
    },
    tr: {
        header: {
            title: "Bütçe V5",
            darkMode: "Tema Değiştir",
            colors: "Renkler",
            setTarget: "Hedef Belirle",
            download: "Yedekle",
            upload: "Yükle"
        },
        cards: {
            totalIncome: "Toplam Gelir",
            totalExpense: "Toplam Gider",
            balance: "Kalan Bakiye"
        },
        income: {
            title: "Gelirler",
            placeholder: "Açıklama (Örn: Maaş)",
            amount: "Tutar",
            add: "Ekle",
            empty: "Seçili ayda gelir bulunamadı."
        },
        expense: {
            title: "Giderler",
            placeholder: "Açıklama (Örn: Market)",
            category: "Kategori",
            amount: "Tutar",
            add: "Ekle",
            empty: "Seçili ayda gider bulunamadı."
        },
        categories: {
            "Mutfak": "Mutfak",
            "Fatura": "Fatura",
            "Kira": "Kira",
            "Abonelik": "Abonelik",
            "Ulaşım": "Ulaşım",
            "Yakıt": "Yakıt",
            "Eğlence": "Eğlence",
            "Giyim": "Giyim",
            "Teknoloji": "Teknoloji",
            "Sağlık": "Sağlık",
            "Eğitim": "Eğitim",
            "Spor": "Spor & Fitness",
            "Ev & Bahçe": "Ev & Bahçe",
            "Evcil Hayvan": "Evcil Hayvan",
            "Kozmetik": "Kozmetik & Bakım",
            "Diğer": "Diğer",
            "Gelir": "Gelir"
        },
        budget: {
            title: "Bütçe Hedef Takibi",
            subtitle: "Ay Sonu Analizi",
            goodStatus: "İyi Durumda",
            warningStatus: "Dikkat!",
            exceededStatus: "Hedef Aşıldı!",
            noTargetStatus: "Hedef Yok",
            empty: "Henüz hedef belirlemediniz. \"Hedef Belirle\" butonunu kullanın."
        },
        charts: {
            distribution: "Harcama Dağılımı",
            comparison: "Hedef vs Gerçek",
            insights: "Ayın İpuçları",
            noData: "Harcama verisi yok.",
            maxCategory: "Bu ay en çok \"{category}\" kategorisine harcama yaptınız.",
            target: "Hedef",
            actual: "Gerçek"
        },
        modals: {
            colors: {
                title: "Kategori Renkleri",
                reset: "Varsayılana Dön",
                save: "Kaydet"
            },
            target: {
                title: "Aylık Bütçe Hedefleri",
                save: "Kaydet"
            },
            edit: {
                title: "Düzenle",
                cancel: "İptal",
                save: "Kaydet"
            },
            categoryAnalysis: {
                title: "Kategori Analizi",
                sortBy: "Sıralama:",
                highToLow: "Yüksekten Düşüğe",
                lowToHigh: "Düşükten Yükseğe",
                noExpenses: "Seçili ayda gider bulunamadı.",
                total: "Toplam"
            }
        },
        messages: {
            fillFields: "Lütfen isim ve tutar girin.",
            deleteConfirm: "Silmek istiyor musunuz?",
            resetColorsConfirm: "Tüm renkleri varsayılan değerlere döndürmek istiyor musunuz?",
            dataRestored: "Yüklendi!",
            oldDataUpgraded: "Eski verileriniz başarıyla V5 formatına yükseltildi!"
        },
        buttons: {
            add: "Ekle",
            addExpanded: "Kayıt Ekle",
            categoryAnalysis: "Kategori Analizi",
            date: "Tarih",
            recurring: "Tekrarlayan",
            cashbackSection: "Cashback/Puan (Opsiyonel)"
        },
        recurring: {
            monthly: "Aylık",
            badge: "🔁 Tekrarlayan"
        },
        cashback: {
            percent: "Cashback % (örn: 5)",
            points: "Kazanılan Puan",
            net: "Net"
        },
        insights: {
            savings: "Toplam Kazanç"
        },
        months: {
            1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan",
            5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos",
            9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
        }
    }
};

// Current language state
let currentLanguage = 'en'; // Default language

// Translation function
function t(path) {
    const keys = path.split('.');
    let value = TRANSLATIONS[currentLanguage];
    for (const key of keys) {
        value = value[key];
        if (!value) return path;
    }
    return value;
}
