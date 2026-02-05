// --- BAŞLANGIÇ ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    document.getElementById('monthFilter').value = selectedMonth;
    populateDropdowns();
    updateUILanguage();
    renderAll();
});

// --- TEMA YÖNETİMİ (DARK MODE) ---
function initTheme() {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// --- DİL YÖNETİMİ ---
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateUILanguage();
    renderAll();
}

function updateUILanguage() {
    // Update language button
    const langButton = document.getElementById('langButton');
    if (currentLanguage === 'en') {
        langButton.textContent = '🇬🇧 EN';
    } else {
        langButton.textContent = '🇹🇷 TR';
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', t(key));
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });

    // Update page title
    document.title = t('header.title');

    // Update dropdown option labels
    document.querySelectorAll('option[data-i18n]').forEach(opt => {
        const key = opt.getAttribute('data-i18n');
        opt.textContent = t(key);
    });

    // Populate dropdowns with translated categories
    populateDropdowns();
}

// --- VERİ YÖNETİMİ ---
function loadData() {
    // V5 yeni yapısı veya V2/V3/V4'ten kurtarma
    const stored = localStorage.getItem('budget_v5_data');
    if (stored) {
        const data = JSON.parse(stored);
        transactions = data.transactions || [];
        targets = data.targets || {};
        categoryColors = data.categoryColors || {};
    } else {
        attemptRecovery();
    }
    // Varsayılan renkleri yükle (eğer yoksa)
    CATEGORIES.forEach(cat => {
        if (!categoryColors[cat]) categoryColors[cat] = DEFAULT_COLORS[cat];
    });

    // Dil tercihini yükle
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
        currentLanguage = savedLang;
    }
}

function saveData() {
    const data = { transactions, targets, categoryColors };
    localStorage.setItem('budget_v5_data', JSON.stringify(data));
}

function attemptRecovery() {
    // Eski verileri (V4) bul ve dönüştür
    const oldInc = localStorage.getItem('adv_incomes_v2');
    const oldExp = localStorage.getItem('adv_expenses_v2');
    if (oldInc || oldExp) {
        if (oldInc) JSON.parse(oldInc).forEach(i => transactions.push({ ...i, type: 'income', date: i.date || new Date().toISOString() }));
        if (oldExp) JSON.parse(oldExp).forEach(e => transactions.push({ ...e, type: 'expense', date: e.date || new Date().toISOString() }));
        saveData();
        alert(t('messages.oldDataUpgraded'));
    }
}

// --- TARİH FİLTRESİ ---
function handleDateChange() {
    selectedMonth = document.getElementById('monthFilter').value;
    renderAll();
}

function getFilteredTransactions() {
    return transactions.filter(t => t.date.startsWith(selectedMonth));
}

// --- İŞLEM EKLEME ---
function addIncome() {
    const name = document.getElementById('inputNameIncome').value;
    const amount = parseFloat(document.getElementById('inputAmountIncome').value);
    const dateInput = document.getElementById('inputDateIncome').value;

    if (!name || isNaN(amount)) return alert(t('messages.fillFields'));

    // Tarih inputunu kullan veya bugünün tarihini al
    let dateStr;
    if (dateInput) {
        dateStr = new Date(dateInput + 'T12:00:00').toISOString();
    } else {
        const now = new Date();
        dateStr = now.toISOString();
    }

    transactions.unshift({ id: Date.now(), type: 'income', name, amount, category: 'Gelir', date: dateStr });
    saveData();
    renderAll();

    // Formu kapat
    collapseIncomeForm();
}

function addExpense() {
    const name = document.getElementById('inputNameExpense').value;
    const amount = parseFloat(document.getElementById('inputAmountExpense').value);
    const category = document.getElementById('inputCategory').value;
    const dateInput = document.getElementById('inputDateExpense').value;

    // Yeni: Tekrarlayan işlem checkbox
    const recurring = document.getElementById('inputRecurring').checked;

    // Yeni: Cashback ve puan
    const cashbackPercent = parseFloat(document.getElementById('inputCashbackPercent').value) || 0;
    const points = parseInt(document.getElementById('inputPoints').value) || 0;

    if (!name || isNaN(amount)) return alert(t('messages.fillFields'));

    // Tarih inputunu kullan veya bugünün tarihini al
    let dateStr;
    if (dateInput) {
        dateStr = new Date(dateInput + 'T12:00:00').toISOString();
    } else {
        const now = new Date();
        dateStr = now.toISOString();
    }

    // Cashback hesaplama
    const cashbackAmount = (amount * cashbackPercent) / 100;
    const netAmount = amount - cashbackAmount;

    transactions.unshift({
        id: Date.now(),
        type: 'expense',
        name,
        amount,
        category,
        date: dateStr,
        recurring: recurring,           // Yeni
        cashbackPercent: cashbackPercent, // Yeni
        cashbackAmount: cashbackAmount,   // Yeni
        points: points,                   // Yeni
        netAmount: netAmount              // Yeni
    });
    saveData();
    renderAll();

    // Formu kapat
    collapseExpenseForm();
}

function deleteTransaction(id) {
    if (confirm(t('messages.deleteConfirm'))) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        renderAll();
    }
}

// --- RENDER (GÖRÜNTÜLEME) ---
function renderAll() {
    const currentData = getFilteredTransactions();
    const income = currentData.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = currentData.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

    // 1. Kartlar
    document.getElementById('totalIncomeDisplay').textContent = formatMoney(income);
    document.getElementById('totalExpenseDisplay').textContent = formatMoney(expense);
    document.getElementById('netBalance').textContent = formatMoney(income - expense);

    // 2. Gelir Listesi
    const incomeData = currentData.filter(t => t.type === 'income');
    const incomeListEl = document.getElementById('incomeList');
    incomeListEl.innerHTML = '';
    if (incomeData.length === 0) {
        document.getElementById('emptyIncomeList').classList.remove('hidden');
    } else {
        document.getElementById('emptyIncomeList').classList.add('hidden');
        incomeData.forEach(trans => {
            const li = document.createElement('li');
            li.className = "flex items-center gap-3 bg-gray-50 dark:bg-darkinput/30 p-3 rounded-lg border-l-4 border-emerald-400";
            li.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-700 dark:text-gray-200 text-sm truncate">${trans.name}</div>
                    <div class="text-xs text-gray-400">${new Date(trans.date).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-emerald-600 font-bold text-sm whitespace-nowrap">+${formatMoney(trans.amount)}</span>
                    <button onclick="openEditModal(${trans.id})" class="text-gray-400 hover:text-indigo-500"><i class="fas fa-pen text-xs"></i></button>
                    <button onclick="deleteTransaction(${trans.id})" class="text-gray-400 hover:text-red-500"><i class="fas fa-times text-xs"></i></button>
                </div>
            `;
            incomeListEl.appendChild(li);
        });
    }

    // 3. Gider Listesi
    const expenseData = currentData.filter(t => t.type === 'expense');
    const expenseListEl = document.getElementById('expenseList');
    expenseListEl.innerHTML = '';
    if (expenseData.length === 0) {
        document.getElementById('emptyExpenseList').classList.remove('hidden');
    } else {
        document.getElementById('emptyExpenseList').classList.add('hidden');
        expenseData.forEach(trans => {
            const li = document.createElement('li');
            li.className = "flex items-center gap-3 bg-gray-50 dark:bg-darkinput/30 p-3 rounded-lg border-l-4 border-rose-400";
            const translatedCategory = t(`categories.${trans.category}`);

            // Recurring badge
            const recurringBadge = trans.recurring ?
                `<span class="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded ml-1">${t('recurring.badge')}</span>` :
                '';

            // Cashback display
            let amountDisplay = '';
            if (trans.cashbackAmount && trans.cashbackAmount > 0) {
                amountDisplay = `
                    <div class="text-right flex flex-col items-end">
                        <div class="text-rose-600 font-bold text-sm line-through opacity-60">${formatMoney(trans.amount)}</div>
                        <div class="text-[10px] text-green-600 dark:text-green-400">-${formatMoney(trans.cashbackAmount)} cashback</div>
                        <div class="text-rose-600 font-bold text-sm">Net: ${formatMoney(trans.netAmount)}</div>
                    </div>
                `;
            } else {
                amountDisplay = `<span class="text-rose-600 font-bold text-sm whitespace-nowrap">-${formatMoney(trans.amount)}</span>`;
            }

            li.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-700 dark:text-gray-200 text-sm truncate flex items-center flex-wrap gap-1">
                        ${trans.name}${recurringBadge}
                    </div>
                    <div class="text-xs text-gray-400">${translatedCategory} • ${new Date(trans.date).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    ${amountDisplay}
                    <button onclick="openEditModal(${trans.id})" class="text-gray-400 hover:text-indigo-500"><i class="fas fa-pen text-xs"></i></button>
                    <button onclick="deleteTransaction(${trans.id})" class="text-gray-400 hover:text-red-500"><i class="fas fa-times text-xs"></i></button>
                </div>
            `;
            expenseListEl.appendChild(li);
        });
    }

    // 4. Hedef Tablosu
    renderBudgetTable(currentData);

    // 5. Grafik
    renderChart(currentData);

    // 6. Ay Adı Güncelleme (çevrili)
    const dateObj = new Date(selectedMonth + "-01");
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const monthLabel = `${t(`months.${month}`)} ${year}`;
    document.getElementById('currentMonthLabelIncome').textContent = monthLabel;
    document.getElementById('currentMonthLabelExpense').textContent = monthLabel;
}

// --- HEDEF KARTLARI MANTIĞI ---
function renderBudgetTable(currentData) {
    const container = document.getElementById('budgetCardsContainer');
    container.innerHTML = '';

    // Kategori bazlı harcama toplamlarını bul
    const spentMap = {};
    currentData.filter(t => t.type === 'expense').forEach(t => {
        spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    });

    const allCategories = new Set([...Object.keys(targets), ...Object.keys(spentMap)]);
    let hasData = false;

    allCategories.forEach(cat => {
        const target = targets[cat] || 0;
        const spent = spentMap[cat] || 0;
        if (target === 0 && spent === 0) return; // İkisi de yoksa gösterme

        hasData = true;
        const percent = target > 0 ? Math.min((spent / target) * 100, 100) : (spent > 0 ? 100 : 0);
        const color = categoryColors[cat] || DEFAULT_COLORS[cat] || '#9CA3AF';

        let statusText = t('budget.goodStatus');
        let statusColor = 'text-emerald-600 dark:text-emerald-400';
        let bgColor = 'bg-emerald-50 dark:bg-emerald-900/20';

        if (percent > 80 && spent <= target) {
            statusText = t('budget.warningStatus');
            statusColor = 'text-orange-600 dark:text-orange-400';
            bgColor = 'bg-orange-50 dark:bg-orange-900/20';
        }
        if (spent > target && target > 0) {
            statusText = t('budget.exceededStatus');
            statusColor = 'text-red-600 dark:text-red-400';
            bgColor = 'bg-red-50 dark:bg-red-900/20';
        }
        if (target === 0) {
            statusText = t('budget.noTargetStatus');
            statusColor = 'text-gray-500 dark:text-gray-400';
            bgColor = 'bg-gray-50 dark:bg-gray-700/20';
        }

        const translatedCat = t(`categories.${cat}`);
        const card = document.createElement('div');
        card.className = `${bgColor} p-4 rounded-lg border-l-4 border-gray-300 dark:border-gray-600`;
        card.style.borderLeftColor = color;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
                    <h4 class="font-bold text-gray-700 dark:text-gray-200">${translatedCat}</h4>
                </div>
                <span class="text-xs ${statusColor} font-semibold">${statusText}</span>
            </div>
            <div class="mb-3">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                    <div class="h-4 rounded-full transition-all duration-500" style="width: ${Math.min(percent, 100)}%; background-color: ${color}"></div>
                </div>
            </div>
            <div class="flex justify-between items-center text-sm">
                <div>
                    <span class="font-bold text-gray-700 dark:text-gray-200">${formatMoney(spent)}</span>
                    <span class="text-gray-500 dark:text-gray-400"> / ${target > 0 ? formatMoney(target) : '-'}</span>
                </div>
                <span class="text-xs font-semibold ${spent > target && target > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}">
                    ${spent > target && target > 0 ? '+' + formatMoney(spent - target) : Math.round(percent) + '%'}
                </span>
            </div>
        `;
        container.appendChild(card);
    });

    if (!hasData) document.getElementById('noBudgetInfo').classList.remove('hidden');
    else document.getElementById('noBudgetInfo').classList.add('hidden');
}

// --- HEDEF BELİRLEME ---
function populateDropdowns() {
    const cat = document.getElementById('inputCategory');
    const catEdit = document.getElementById('editCategory');

    if (cat) {
        cat.innerHTML = '';
        CATEGORIES.forEach(c => {
            const translatedCat = t(`categories.${c}`);
            cat.innerHTML += `<option value="${c}">${translatedCat}</option>`;
        });
    }

    if (catEdit) {
        catEdit.innerHTML = '';
        CATEGORIES.forEach(c => {
            const translatedCat = t(`categories.${c}`);
            catEdit.innerHTML += `<option value="${c}">${translatedCat}</option>`;
        });
    }
}
function openTargetModal() {
    const container = document.getElementById('targetInputContainer');
    container.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const val = targets[cat] || '';
        const translatedCat = t(`categories.${cat}`);
        container.innerHTML += `
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3">${translatedCat}</label>
                <input type="number" id="target_${cat}" value="${val}" placeholder="0" class="w-2/3 p-2 border rounded text-sm dark:bg-darkinput dark:border-gray-600 dark:text-white focus:border-indigo-500">
            </div>
        `;
    });
    document.getElementById('targetModal').classList.remove('hidden');
}

function saveTargets() {
    CATEGORIES.forEach(cat => {
        const val = parseFloat(document.getElementById(`target_${cat}`).value);
        if (!isNaN(val) && val > 0) targets[cat] = val;
        else delete targets[cat];
    });
    saveData();
    document.getElementById('targetModal').classList.add('hidden');
    renderAll();
}
function closeTargetModal() { document.getElementById('targetModal').classList.add('hidden'); }

// --- RENK ÖZELLEŞTİRME ---
function openColorModal() {
    const container = document.getElementById('colorInputContainer');
    container.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const color = categoryColors[cat] || DEFAULT_COLORS[cat];
        const translatedCat = t(`categories.${cat}`);
        container.innerHTML += `
            <div class="flex items-center justify-between p-2 bg-white dark:bg-darkinput rounded border dark:border-gray-600">
                <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500" style="background-color: ${color}"></div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">${translatedCat}</label>
                </div>
                <input type="color" id="color_${cat}" value="${color}" class="w-12 h-8 rounded cursor-pointer border dark:border-gray-600">
            </div>
        `;
    });
    document.getElementById('colorModal').classList.remove('hidden');
}

function saveColors() {
    CATEGORIES.forEach(cat => {
        const colorInput = document.getElementById(`color_${cat}`);
        if (colorInput) {
            categoryColors[cat] = colorInput.value;
        }
    });
    saveData();
    document.getElementById('colorModal').classList.add('hidden');
    renderAll(); // Tüm renkleri güncelle
}

function resetColors() {
    if (confirm(t('messages.resetColorsConfirm'))) {
        categoryColors = { ...DEFAULT_COLORS };
        saveData();
        openColorModal(); // Modal'ı yeniden aç güncel renklerle
        renderAll();
    }
}

function closeColorModal() {
    document.getElementById('colorModal').classList.add('hidden');
}

// --- GRAFİKLER ---
function renderChart(data) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const spentMap = {};
    data.filter(t => t.type === 'expense').forEach(t => { spentMap[t.category] = (spentMap[t.category] || 0) + t.amount; });

    const labels = Object.keys(spentMap);
    const values = Object.values(spentMap);

    // Etiketleri seçili dile çevir
    const translatedLabels = labels.map(cat => t(`categories.${cat}`));

    if (chartInstance) chartInstance.destroy();

    // Kategori renklerini kullan
    const colors = labels.map(cat => categoryColors[cat] || DEFAULT_COLORS[cat] || '#9CA3AF');

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: translatedLabels, // Çevrilmiş etiketleri kullan
            datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: document.documentElement.classList.contains('dark') ? '#ccc' : '#666', boxWidth: 10, font: { size: 10 } } }
            }
        }
    });

    // Insight
    const totalSpent = values.reduce((a, b) => a + b, 0);
    const insightEl = document.getElementById('insightText');
    if (totalSpent === 0) insightEl.textContent = t('charts.noData');
    else {
        const maxCat = labels[values.indexOf(Math.max(...values))];
        const translatedMaxCat = t(`categories.${maxCat}`);
        let insightHtml = `<p>${t('charts.maxCategory').replace('{category}', translatedMaxCat)}</p>`;

        // Cashback ve Puan Hesaplama
        const expenses = data.filter(t => t.type === 'expense');
        const totalCashback = expenses.reduce((sum, t) => sum + (t.cashbackAmount || 0), 0);
        const totalPoints = expenses.reduce((sum, t) => sum + (t.points || 0), 0);

        if (totalCashback > 0 || totalPoints > 0) {
            insightHtml += `<p class="mt-2 text-green-600 dark:text-green-400 font-bold whitespace-normal">🎉 ${t('insights.savings')}: `;
            let savingsParts = [];
            if (totalCashback > 0) savingsParts.push(`${formatMoney(totalCashback)} Cashback`);
            if (totalPoints > 0) savingsParts.push(`${totalPoints} Puan`);
            insightHtml += savingsParts.join(' + ') + '</p>';
        }

        insightEl.innerHTML = insightHtml;
    }

    // İkinci Grafik - Hedef vs Gerçek
    renderComparisonChart(data);
}

function renderComparisonChart(data) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    const ctxChart = ctx.getContext('2d');
    const spentMap = {};
    data.filter(t => t.type === 'expense').forEach(t => {
        spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    });

    // Sadece hedefi olan veya harcaması olan kategorileri göster
    const categories = [...new Set([...Object.keys(targets), ...Object.keys(spentMap)])].filter(cat => {
        return (targets[cat] && targets[cat] > 0) || (spentMap[cat] && spentMap[cat] > 0);
    });

    const targetData = categories.map(cat => targets[cat] || 0);
    const spentData = categories.map(cat => spentMap[cat] || 0);
    const colors = categories.map(cat => categoryColors[cat] || DEFAULT_COLORS[cat] || '#9CA3AF');

    if (comparisonChartInstance) comparisonChartInstance.destroy();

    comparisonChartInstance = new Chart(ctxChart, {
        type: 'bar',
        data: {
            labels: categories.map(cat => t(`categories.${cat}`)),
            datasets: [
                {
                    label: t('charts.target'),
                    data: targetData,
                    backgroundColor: colors.map(c => c + '40'), // 25% opacity
                    borderColor: colors,
                    borderWidth: 2
                },
                {
                    label: t('charts.actual'),
                    data: spentData,
                    backgroundColor: colors,
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: document.documentElement.classList.contains('dark') ? '#ccc' : '#666',
                        font: { size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: document.documentElement.classList.contains('dark') ? '#ccc' : '#666' },
                    grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb' }
                },
                y: {
                    ticks: { color: document.documentElement.classList.contains('dark') ? '#ccc' : '#666' },
                    grid: { display: false }
                }
            }
        }
    });
}

// --- DÜZENLEME ---
function openEditModal(id) {
    const t = transactions.find(x => x.id === id);
    if (!t) return;
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = t.name;
    document.getElementById('editAmount').value = t.amount;
    document.getElementById('editModal').classList.remove('hidden');
}
function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    const t = transactions.find(x => x.id === id);
    if (t && name && !isNaN(amount)) {
        t.name = name; t.amount = amount;
        saveData(); renderAll();
        document.getElementById('editModal').classList.add('hidden');
    }
}

// --- YARDIMCILAR ---
function formatMoney(n) { return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'; }
function downloadBackup() {
    const data = { transactions, targets, categoryColors, date: new Date().toISOString() };
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    a.download = "butce_yedek_v5.json"; document.body.appendChild(a); a.click(); a.remove();
}
function restoreBackup(input) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let d = JSON.parse(e.target.result);

            // Eğer eski format (direkt array) ise yeni formata çevir
            if (Array.isArray(d)) {
                d = { transactions: d, targets: {}, categoryColors: {} };
            }

            if (d.transactions && Array.isArray(d.transactions)) {
                transactions = d.transactions;
                targets = d.targets || {};
                categoryColors = d.categoryColors || {};

                // Veri doğrulaması ve temizliği
                transactions.forEach(t => {
                    // Sayısal değerlerin number olduğundan emin ol
                    t.amount = parseFloat(t.amount);
                    // Eğer yeni alanlar yoksa varsayılan ekle
                    if (typeof t.recurring === 'undefined') t.recurring = false;
                    if (typeof t.cashbackAmount === 'undefined') t.cashbackAmount = 0;
                    if (typeof t.netAmount === 'undefined') t.netAmount = t.amount;
                });

                saveData();
                renderAll();
                alert(t('messages.dataRestored') || 'Veriler başarıyla yüklendi!');
            } else {
                alert('Hata: Geçersiz yedek dosyası formatı. Lütfen doğru JSON dosyasını seçtiğinizden emin olun.');
            }
        } catch (err) {
            console.error('Yedek yükleme hatası:', err);
            alert('Hata: Dosya okunamadı veya bozuk. Detay: ' + err.message);
        }
        // Input'u temizle ki aynı dosya tekrar seçilebilsin
        input.value = '';
    };

    if (input.files[0]) {
        reader.readAsText(input.files[0]);
    }
}


// --- FORM GENİŞLETME/DARALTMA ---
function expandIncomeForm() {
    document.getElementById('incomeFormCompact').classList.add('hidden');
    document.getElementById('incomeFormExpanded').classList.remove('hidden');
    // Bugünün tarihini varsayılan olarak ayarla
    document.getElementById('inputDateIncome').valueAsDate = new Date();
}

function collapseIncomeForm() {
    document.getElementById('incomeFormCompact').classList.remove('hidden');
    document.getElementById('incomeFormExpanded').classList.add('hidden');
    // Formu temizle
    document.getElementById('inputNameIncome').value = '';
    document.getElementById('inputAmountIncome').value = '';
}

function expandExpenseForm() {
    document.getElementById('expenseFormCompact').classList.add('hidden');
    document.getElementById('expenseFormExpanded').classList.remove('hidden');
    // Bugünün tarihini varsayılan olarak ayarla
    document.getElementById('inputDateExpense').valueAsDate = new Date();
}

function collapseExpenseForm() {
    document.getElementById('expenseFormCompact').classList.remove('hidden');
    document.getElementById('expenseFormExpanded').classList.add('hidden');
    // Formu temizle
    document.getElementById('inputNameExpense').value = '';
    document.getElementById('inputAmountExpense').value = '';
    document.getElementById('inputRecurring').checked = false;
    document.getElementById('inputCashbackPercent').value = '';
    document.getElementById('inputPoints').value = '';

}

// --- KATEGORİ ANALİZİ MODAL ---
function openCategoryAnalysisModal() {
    document.getElementById('categoryAnalysisModal').classList.remove('hidden');
    renderCategoryAnalysis();
}

function closeCategoryAnalysisModal() {
    document.getElementById('categoryAnalysisModal').classList.add('hidden');
}

function renderCategoryAnalysis() {
    const container = document.getElementById('categoryAnalysisContainer');
    const sortOrder = document.getElementById('categoryAnalysisSort').value;

    // Seçili aydaki giderleri filtrele
    const monthExpenses = transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(selectedMonth)
    );

    if (monthExpenses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 text-gray-400 dark:text-gray-500">
                <i class="fas fa-inbox text-4xl mb-4"></i>
                <p data-i18n="modals.categoryAnalysis.noExpenses">${t('modals.categoryAnalysis.noExpenses')}</p>
            </div>
        `;
        return;
    }

    // Kategorilere göre grupla
    const categoryGroups = {};
    CATEGORIES.forEach(cat => {
        categoryGroups[cat] = {
            items: monthExpenses.filter(t => t.category === cat),
            total: 0
        };
        categoryGroups[cat].total = categoryGroups[cat].items.reduce((sum, t) => sum + t.amount, 0);
    });

    // Sadece harcama olan kategorileri al
    const categoriesWithExpenses = CATEGORIES.filter(cat => categoryGroups[cat].items.length > 0);

    // Sırala
    categoriesWithExpenses.sort((a, b) => {
        if (sortOrder === 'highToLow') {
            return categoryGroups[b].total - categoryGroups[a].total;
        } else {
            return categoryGroups[a].total - categoryGroups[b].total;
        }
    });

    let html = '';
    categoriesWithExpenses.forEach(cat => {
        const group = categoryGroups[cat];
        const color = categoryColors[cat] || DEFAULT_COLORS[cat];
        const translatedCat = t(`categories.${cat}`);

        html += `
            <div class="mb-4 border dark:border-gray-700 rounded-lg overflow-hidden">
                <div class="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 border-l-4" style="border-color: ${color}">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded" style="background-color: ${color}"></div>
                        <span class="font-semibold text-gray-800 dark:text-white">${translatedCat}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">(${group.items.length})</span>
                    </div>
                    <span class="font-bold text-gray-800 dark:text-white">${formatMoney(group.total)}</span>
                </div>
                <div class="bg-white dark:bg-darkinput">
        `;

        // Harcamaları tutara göre sırala (büyükten küçüğe)
        group.items.sort((a, b) => b.amount - a.amount);

        group.items.forEach(item => {
            const itemDate = new Date(item.date);
            const dateStr = `${itemDate.getDate()} ${t(`months.${itemDate.getMonth() + 1}`).substring(0, 3)}`;

            html += `
                <div class="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <div class="flex-1">
                        <div class="font-medium text-gray-800 dark:text-white">${item.name}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">${dateStr}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-700 dark:text-gray-300">${formatMoney(item.amount)}</span>
                        <button onclick="editFromAnalysis('${item.id}')" 
                            class="text-blue-500 hover:text-blue-700 p-1" title="${t('modals.edit.title')}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteFromAnalysis('${item.id}')" 
                            class="text-red-500 hover:text-red-700 p-1" title="${t('messages.deleteConfirm')}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function editFromAnalysis(id) {
    const tr = transactions.find(t => t.id === id);
    if (!tr) return;

    // Edit modalı daha önce yoksa hızlıca düzenle
    if (confirm(t('modals.edit.title') + ': ' + tr.name)) {
        const newName = prompt(t('expense.placeholder'), tr.name);
        if (newName) tr.name = newName;

        const newAmount = prompt(t('expense.amount'), tr.amount);
        if (newAmount && !isNaN(parseFloat(newAmount))) tr.amount = parseFloat(newAmount);

        saveData();
        renderAll();
        renderCategoryAnalysis();
    }
}

function deleteFromAnalysis(id) {
    if (confirm(t('messages.deleteConfirm'))) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        renderAll();
        renderCategoryAnalysis();
    }
}
