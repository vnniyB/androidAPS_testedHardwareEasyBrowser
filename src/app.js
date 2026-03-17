
// State
let allData = [];
let filteredData = [];
let filters = {
  search: '',
  brand: [],
  pump: '',
  working: '',
  android: [],
  country: [],
  aaps: [],
  cgm: [],
  sort: 'newest'
};
let currentView = 'list';
let listSortColumn = 'Submitted';
let listSortDirection = 'desc';
let listColumns = []; // Array of { id: string, visible: boolean }

// DOM Elements
const gridContainer = document.getElementById('grid-container');
const listContainer = document.getElementById('list-container');
const emptyState = document.getElementById('empty-state');
const resultsCount = document.getElementById('results-count');
const globalSearch = document.getElementById('global-search');
const clearFiltersBtn = document.getElementById('clear-filters');
const sortOrderSelect = document.getElementById('sort-order');
const viewListBtn = document.getElementById('view-list');
const viewGridBtn = document.getElementById('view-grid');
const dataTableHead = document.getElementById('data-table-head');
const dataTableBody = document.getElementById('data-table-body');
const columnSelectBtn = document.getElementById('column-select-btn');
const columnOptionsList = document.getElementById('column-options-list');

// Modal Elements
const modal = document.getElementById('detail-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

// Filter Selects
// Filter Elements
const multiSelects = {
  brand: {
    btn: document.getElementById('brand-select-btn'),
    list: document.getElementById('brand-options-list'),
    container: document.getElementById('brand-select-container'),
    label: 'Brands'
  },
  android: {
    btn: document.getElementById('android-select-btn'),
    list: document.getElementById('android-options-list'),
    container: document.getElementById('android-select-container'),
    label: 'Versions'
  },
  country: {
    btn: document.getElementById('country-select-btn'),
    list: document.getElementById('country-options-list'),
    container: document.getElementById('country-select-container'),
    label: 'Countries'
  },
  aaps: {
    btn: document.getElementById('aaps-select-btn'),
    list: document.getElementById('aaps-options-list'),
    container: document.getElementById('aaps-select-container'),
    label: 'AAPS Versions'
  },
  cgm: {
    btn: document.getElementById('cgm-select-btn'),
    list: document.getElementById('cgm-options-list'),
    container: document.getElementById('cgm-select-container'),
    label: 'CGM Brands'
  }
};

const singleSelects = {
  pump: document.getElementById('filter-pump'),
  working: document.getElementById('filter-working')
};

// Constants
const CSV_URL = 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vScCNaIguEZVTVFAgpv1kXHdsHl3fs6xT6RB2Z1CeVJ561AvvqGwxMhlmSHk4J056gMCAQE02sAWJvT/pub?gid=683363241&single=true&output=csv';

// Initialization
async function init() {
  setupEventListeners();
  await fetchData();
}

// Fetch Data
async function fetchData() {
  gridContainer.innerHTML = '<div class="loading">Loading data...</div>';

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    allData = parseCSV(csvText);
    
    // Initialize list columns layout if empty
    if (listColumns.length === 0 && allData.length > 0) {
      const excludedColumns = ['Submitted(Form)', 'Using(submitted)'];
      const allKeys = Object.keys(allData[0]).filter(k => k.trim() !== '' && !excludedColumns.includes(k));
      listColumns = allKeys.map(k => ({ id: k, visible: true }));
      renderColumnDropdown();
    }
    
    applyFilters(); // Initial render with default sort
  } catch (error) {
    console.error('Error fetching data:', error);
    gridContainer.innerHTML = `
      <div class="error-message">
        <h3>Error loading data</h3>
        <p>Could not load the latest hardware list. Please check your connection and try again.</p>
        <button onclick="window.location.reload()" class="btn-text">Retry</button>
      </div>
    `;
  }
}

// CSV Parser
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Identify headers
  let headerIndex = -1;
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    if (lines[i].includes('Submitted') && lines[i].includes('Working?')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) return [];

  const headers = parseCSVLine(lines[headerIndex]);
  const result = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < 5) continue;

    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });

    if (obj['Submitted'] || obj['Phone Brand']) {
      result.push(obj);
    }
  }

  return result;
}

// Helper to parse a single CSV line handling quotes
function parseCSVLine(text) {
  const result = [];
  let currentref = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentref += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentref);
      currentref = "";
    } else {
      currentref += char;
    }
  }
  result.push(currentref);
  return result;
}

// Populate Dropdowns
function populateFilterOptions() {
  const options = {
    brand: new Set(),
    pump: new Set(),
    working: new Set(),
    android: new Set(),
    country: new Set(),
    aaps: new Set(),
    cgm: new Set()
  };

  allData.forEach(item => {
    if (item['Phone Brand']) options.brand.add(item['Phone Brand']);
    if (item['Pump']) options.pump.add(item['Pump']);
    if (item['Working?']) options.working.add(item['Working?']);
    if (item['Android version']) options.android.add(item['Android version']);
    if (item['Country']) options.country.add(item['Country']);
    if (item['AAPS Version']) options.aaps.add(item['AAPS Version']);
    if (item['CGM Brand']) options.cgm.add(item['CGM Brand']);
  });

  // Populate Multi-Selects
  ['brand', 'android', 'country', 'aaps', 'cgm'].forEach(key => {
    const list = multiSelects[key].list;
    const sortedValues = Array.from(options[key]).sort();

    // Save current styling/state if needed, but we rebuild list
    list.innerHTML = '';

    sortedValues.forEach(value => {
      const label = document.createElement('label');
      label.className = 'select-option';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = value;
      // Restore selection state
      if (filters[key].includes(value)) {
        checkbox.checked = true;
      }

      // Event Listener for Checkbox
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          filters[key].push(value);
        } else {
          filters[key] = filters[key].filter(item => item !== value);
        }
        updateSelectButtonText(key);
        applyFilters();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(value));
      list.appendChild(label);
    });
    updateSelectButtonText(key);
  });

  // Populate Single Selects
  ['pump', 'working'].forEach(key => {
    const select = singleSelects[key];
    const sortedValues = Array.from(options[key]).sort();

    // Clear existing options except first
    while (select.options.length > 1) {
      select.remove(1);
    }

    sortedValues.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });
}

function updateSelectButtonText(key) {
  const config = multiSelects[key];
  const count = filters[key].length;
  if (count === 0) {
    config.btn.textContent = `Select ${config.label}`;
  } else {
    config.btn.textContent = `${count} ${config.label} Selected`;
  }
}

// Event Listeners
function setupEventListeners() {
  // View Toggles
  viewListBtn.addEventListener('click', () => {
    currentView = 'list';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    renderView();
  });

  viewGridBtn.addEventListener('click', () => {
    currentView = 'grid';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    renderView();
  });
  // Global Search
  globalSearch.addEventListener('input', (e) => {
    filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  // Sort Order
  sortOrderSelect.addEventListener('change', (e) => {
    filters.sort = e.target.value;
    applyFilters();
  });

  // Single Select Filters
  Object.keys(singleSelects).forEach(key => {
    singleSelects[key].addEventListener('change', (e) => {
      filters[key] = e.target.value;
      applyFilters();
    });
  });

  // Multi-Select Dropdown Toggles and Close Outside
  Object.keys(multiSelects).forEach(key => {
    const config = multiSelects[key];

    config.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close others
      Object.keys(multiSelects).forEach(k => {
        if (k !== key) multiSelects[k].list.classList.add('hidden');
      });
      config.list.classList.toggle('hidden');
    });

    config.list.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing when clicking inside list
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    Object.values(multiSelects).forEach(config => {
      config.list.classList.add('hidden');
    });
    if (!e.target.closest('#column-select-container')) {
      columnOptionsList.classList.add('hidden');
    }
  });

  // Columns Dropdown Toggle
  columnSelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    Object.values(multiSelects).forEach(config => config.list.classList.add('hidden'));
    columnOptionsList.classList.toggle('hidden');
  });
  
  columnOptionsList.addEventListener('click', (e) => e.stopPropagation());

  // Clear Filters
  clearFiltersBtn.addEventListener('click', () => {
    // Reset state
    filters = {
      search: '',
      brand: [],
      pump: '',
      working: '',
      android: [],
      country: [],
      aaps: [],
      cgm: [],
      sort: 'newest'
    };

    // Reset UI
    globalSearch.value = '';
    sortOrderSelect.value = 'newest';
    Object.values(singleSelects).forEach(select => select.value = '');

    // Reset Multi-Selects logic handled by re-rendering via populate/updateUI or manually unchecking
    // Re-populate will use empty filter state to render unchecked boxes
    populateFilterOptions(); // This will re-render checkboxes as unchecked based on cleared filters state

    applyFilters();
  });

  // Modal Listeners
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Filtering & Sorting Logic
function applyFilters() {
  // Filter
  filteredData = allData.filter(item => {
    // Text Search (searches Brand, Type, Name, Pump)
    const searchMatch = !filters.search ||
      (item['Phone Brand']?.toLowerCase().includes(filters.search)) ||
      (item['Type']?.toLowerCase().includes(filters.search)) ||
      (item['Name']?.toLowerCase().includes(filters.search)) ||
      (item['Pump']?.toLowerCase().includes(filters.search));

    // Dropdown Filters
    const brandMatch = filters.brand.length === 0 || filters.brand.includes(item['Phone Brand']);
    const pumpMatch = !filters.pump || item['Pump'] === filters.pump;
    const workingMatch = !filters.working || item['Working?'] === filters.working;
    const androidMatch = filters.android.length === 0 || filters.android.includes(item['Android version']);
    const countryMatch = filters.country.length === 0 || filters.country.includes(item['Country']);
    const aapsMatch = filters.aaps.length === 0 || filters.aaps.includes(item['AAPS Version']);
    const cgmMatch = filters.cgm.length === 0 || filters.cgm.includes(item['CGM Brand']);

    return searchMatch && brandMatch && pumpMatch && workingMatch && androidMatch && countryMatch && aapsMatch && cgmMatch;
  });

  // Sort
  filteredData.sort((a, b) => {
    const dateA = new Date(a['Submitted']);
    const dateB = new Date(b['Submitted']);

    // Handle invalid dates
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return filters.sort === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (multiSelects['brand'].list.children.length === 0) {
    populateFilterOptions();
  }

  renderView();
  updateResultsCount();
}

// Rendering
function renderView() {
  if (filteredData.length === 0) {
    gridContainer.classList.add('hidden');
    listContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');

  if (currentView === 'list') {
    gridContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
    renderList();
  } else {
    listContainer.classList.add('hidden');
    gridContainer.classList.remove('hidden');
    renderGrid();
  }
}

function renderList() {
  dataTableHead.innerHTML = '';
  dataTableBody.innerHTML = '';

  if (filteredData.length === 0) return;

  // Uses user layout settings
  const visibleColumns = listColumns.filter(c => c.visible).map(c => c.id);
  if (visibleColumns.length === 0) return; // Add empty state handling here if you want

  // Generate Headers
  const trHead = document.createElement('tr');
  visibleColumns.forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    
    if (listSortColumn === key) {
      th.innerHTML += listSortDirection === 'asc' ? ' &uarr;' : ' &darr;';
    }
    
    th.classList.add('sortable-header');
    th.onclick = () => {
      if (listSortColumn === key) {
        listSortDirection = listSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        listSortColumn = key;
        listSortDirection = 'asc';
      }
      renderList();
    };
    
    trHead.appendChild(th);
  });
  dataTableHead.appendChild(trHead);

  // Sort data for list view
  const dataToRender = [...filteredData].sort((a, b) => {
    let valA = a[listSortColumn] || '';
    let valB = b[listSortColumn] || '';
    
    // Date sorting
    if (listSortColumn === 'Submitted' || listSortColumn === 'Used since') {
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return listSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    }
    
    valA = valA.toString().toLowerCase();
    valB = valB.toString().toLowerCase();
    
    if (valA < valB) return listSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return listSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Generate Rows
  dataToRender.forEach(item => {
    const tr = document.createElement('tr');
    tr.onclick = () => openModal(item);
    
    visibleColumns.forEach(key => {
      const td = document.createElement('td');
      td.textContent = item[key] !== undefined ? item[key] : '-';
      
      // Styling for status
      if (key === 'Working?') {
        let statusClass = 'status-badge';
        if (item[key]?.toLowerCase().includes('ok') || item[key]?.toLowerCase().includes('tested')) {
          statusClass += ' status-ok';
        } else if (item[key]?.toLowerCase().includes('problem')) {
          statusClass += ' status-warn';
        } else {
          statusClass += ' status-error';
        }
        td.innerHTML = `<span class="${statusClass}">${item[key]}</span>`;
      }
      
      tr.appendChild(td);
    });
    dataTableBody.appendChild(tr);
  });
}

function renderColumnDropdown() {
  columnOptionsList.innerHTML = '';
  
  listColumns.forEach((col, index) => {
    const item = document.createElement('div');
    item.className = 'column-option';
    item.draggable = true;
    item.dataset.index = index;
    
    item.innerHTML = `
      <div class="drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      </div>
      <input type="checkbox" id="col-${index}" ${col.visible ? 'checked' : ''}>
      <label for="col-${index}" style="flex: 1; cursor: pointer; user-select: none;">${col.id}</label>
    `;
    
    // Checkbox logic
    const checkbox = item.querySelector('input');
    checkbox.addEventListener('change', (e) => {
      listColumns[index].visible = e.target.checked;
      renderList();
    });
    
    // Drag & Drop
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
      item.classList.add('dragging');
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      // remove all hover styles
      document.querySelectorAll('.column-option').forEach(el => {
        el.style.borderTop = '';
        el.style.borderBottom = '';
      });
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
      const draggingItem = document.querySelector('.dragging');
      if (!draggingItem || draggingItem === item) return;
      
      const bounding = item.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      if (e.clientY - offset > 0) {
        item.style.borderBottom = '2px solid var(--primary-color)';
        item.style.borderTop = '';
      } else {
        item.style.borderTop = '2px solid var(--primary-color)';
        item.style.borderBottom = '';
      }
    });
    
    item.addEventListener('dragleave', () => {
      item.style.borderTop = '';
      item.style.borderBottom = '';
    });
    
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.style.borderTop = '';
      item.style.borderBottom = '';
      
      const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      let targetIdx = index;
      
      const bounding = item.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      if (e.clientY - offset > 0) {
        targetIdx++; // Insert after
      }
      
      if (draggedIdx === targetIdx || draggedIdx + 1 === targetIdx) return;
      
      // Calculate properly when pulling an item from before the targetIdx
      const draggedCol = listColumns.splice(draggedIdx, 1)[0];
      if (targetIdx > draggedIdx) targetIdx--;
      listColumns.splice(targetIdx, 0, draggedCol);
      
      renderColumnDropdown();
      renderList();
    });
    
    columnOptionsList.appendChild(item);
  });
}

function renderGrid() {
  gridContainer.innerHTML = '';

  filteredData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openModal(item);

    // Determine status class
    let statusClass = 'status-badge';
    if (item['Working?']?.toLowerCase().includes('ok') || item['Working?']?.toLowerCase().includes('tested')) {
      statusClass += ' status-ok';
    } else if (item['Working?']?.toLowerCase().includes('problem')) {
      statusClass += ' status-warn';
    } else {
      statusClass += ' status-error';
    }

    // Phone Name Construction
    const phoneName = item['Phone Brand Type'] || `${item['Phone Brand'] || ''} ${item['Type'] || ''}`.trim() || 'Unknown Device';

    card.innerHTML = `
      <div class="card-header">
        <div class="phone-name">${phoneName}</div>
        <div class="${statusClass}">${item['Working?'] || 'Unknown'}</div>
      </div>
      
      <div class="card-details">
        <div class="detail-row">
          <span class="label">Pump</span>
          <span class="value">${item['Pump'] || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Android</span>
          <span class="value">${item['Android version'] || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Country</span>
          <span class="value">${item['Country'] || '-'}</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="user-info">
          <span>By: ${item['Name'] || 'Anonymous'}</span>
        </div>
        <div class="date">${item['Submitted']?.split(' ')[0] || ''}</div>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}

// Modal Logic
function openModal(item) {
  let statusClass = 'status-badge';
  if (item['Working?']?.toLowerCase().includes('ok') || item['Working?']?.toLowerCase().includes('tested')) {
    statusClass += ' status-ok';
  } else if (item['Working?']?.toLowerCase().includes('problem')) {
    statusClass += ' status-warn';
  } else {
    statusClass += ' status-error';
  }

  const phoneName = item['Phone Brand Type'] || `${item['Phone Brand'] || ''} ${item['Type'] || ''}`.trim() || 'Unknown Device';

  modalBody.innerHTML = `
    <div class="modal-header-large">
      <h2 class="modal-title">${phoneName}</h2>
      <div class="modal-meta">
        <span class="${statusClass}">${item['Working?']}</span>
        <span class="detail-value">Submitted: ${item['Submitted']}</span>
        <span class="detail-value">User: ${item['Name']} ${item['Discord handle'] ? `(${item['Discord handle']})` : ''}</span>
      </div>
    </div>
    
    <div class="detail-grid">
      <div class="detail-section">
        <h4>Device Config</h4>
        <div class="detail-item">
          <span class="detail-label">Pump</span>
          <span class="detail-value">${item['Pump'] || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Android Version</span>
          <span class="detail-value">${item['Android version'] || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">AAPS Version</span>
          <span class="detail-value">${item['AAPS Version'] || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Connection</span>
          <span class="detail-value">${item['Connection'] || '-'}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>CGM Info</h4>
        <div class="detail-item">
          <span class="detail-label">CGM Brand</span>
          <span class="detail-value">${item['CGM Brand'] || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">BG Source</span>
          <span class="detail-value">${item['AAPS BG Source'] || '-'}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>User Details</h4>
        <div class="detail-item">
          <span class="detail-label">Country</span>
          <span class="detail-value">${item['Country'] || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Used Since</span>
          <span class="detail-value">${item['Used since'] || '-'}</span>
        </div>
      </div>
      
      ${item['Comments'] ? `
      <div class="comments-section">
        <span class="detail-label">Comments</span>
        <p class="detail-value" style="margin-top: 0.5rem;">${item['Comments']}</p>
      </div>
      ` : ''}
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function updateResultsCount() {
  resultsCount.textContent = filteredData.length;
}

// Start
init();
