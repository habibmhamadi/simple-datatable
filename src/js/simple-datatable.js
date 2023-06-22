function simpleDataTable(tableId, dataList, options = {}) {
    let itemsPerPage = options.itemsPerPage || 5;
    let pageSelection = options.pageSelection || [5, 10, 20, 50, 100]
    if (!pageSelection.includes(itemsPerPage)) {
        itemsPerPage = pageSelection[0]
    }
    let currentPage = 1;
    let filteredData = dataList;
    let sortDirection = 1; // Sort direction: 1 for ascending, -1 for descending
    let sortColumn = ""; // Column to sort
    var searchDelayTimer;

    const dtContainer = document.createElement('div')
    dtContainer.classList.add(...['dtContainer'])
    dtContainer.style.fontFamily = options.fontFamily || "'Segoe UI', arial, sans-serif"

    const titleEl = document.createElement('h4')
    titleEl.innerHTML = options.title || ''
    dtContainer.appendChild(titleEl)

    const headerContainer = document.createElement('div')
    headerContainer.classList.add(...['headerContainer'])

    // Items per page selection 
    const perPageSelectorContainer = document.createElement('div')
    const perPageSelectorDiv = document.createElement('div')
    perPageSelectorDiv.classList.add(...['perPageSelectorDiv'])
    perPageSelectorDiv.innerHTML = 'Entries'
    perPageSelectorContainer.appendChild(perPageSelectorDiv)
    const perPageSelector = document.createElement('select')

    for (var i of pageSelection) {
        let option = document.createElement('option')
        option.text = '' + i
        option.value = i
        if (i == itemsPerPage) {
            option.selected = true
        }
        perPageSelector.appendChild(option)
    }

    perPageSelectorContainer.appendChild(perPageSelector)
    headerContainer.appendChild(perPageSelectorContainer)
    // End items per page selection

    const searchInput = document.createElement('input')
    searchInput.type = 'search'
    searchInput.placeholder = 'Search'
    headerContainer.appendChild(searchInput)

    dtContainer.appendChild(headerContainer)

    const tableContainer = document.createElement('div')
    tableContainer.classList.add(...['tableContainer'])
    tableContainer.style.height = options.height || '17rem'
    const newTable = document.createElement('table')
    const thead = document.createElement('thead')
    const thTr = document.createElement('tr')
    const oldTable = document.getElementById(tableId)
    const oldTheads = oldTable.getElementsByTagName('th')

    // Create TH
    for (var i = 0; i < oldTheads.length; i++) {
        const oldThead = oldTheads[i].cloneNode(true)
        if (oldThead.classList.contains('sortable')) {
            let thDiv = document.createElement('div')
            let thSpan = document.createElement('span')
            thSpan.innerHTML = oldThead.innerHTML
            thSvg = `<svg data-key="${i}" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" fill-rule="evenodd"></path>
                  </svg>`
            thDiv.appendChild(thSpan)
            thDiv.innerHTML += thSvg
            oldThead.innerHTML = ''
            oldThead.appendChild(thDiv)
        }

        thTr.appendChild(oldThead)
    }

    thead.appendChild(thTr)
    // End create TH

    const tbody = document.createElement('tbody')
    newTable.id = tableId
    newTable.appendChild(thead)
    newTable.appendChild(tbody)

    tableContainer.appendChild(newTable)
    dtContainer.appendChild(tableContainer)

    const paginationContainer = document.createElement('div')
    paginationContainer.classList.add(...['paginationContainer'])
    const paginationDiv = document.createElement('div')
    paginationContainer.appendChild(paginationDiv)

    const paginationHelper = document.createElement('div')
    paginationHelper.classList.add(...['paginationHelper'])
    paginationContainer.appendChild(paginationHelper)

    dtContainer.appendChild(paginationContainer)
    oldTable.replaceWith(dtContainer)

    // Render Table
    function renderTable(pageData) {
        tbody.innerHTML = "";
        paginationHelper.innerHTML = ''
        if (options.hasOwnProperty('onRowRender')) {
            pageData.forEach((data) => {
                var column = []
                for(let i = 0; i < oldTheads.length; i++) {
                    column.push(`<td>${data[i]}</td>`)
                }
                tbody.innerHTML += `<tr>${options.onRowRender(data, column).join('')}<tr>`
            })
        }
        else {
            pageData.forEach((row) => {
                var tr = document.createElement("tr");
                for(let i = 0; i < oldTheads.length; i++) {
                    tr.innerHTML += `<td>${row[i]}</td>`
                }
                tbody.appendChild(tr);
            });
        }
        if (dataList.length > itemsPerPage) {
            paginationHelper.innerHTML = `${currentPage}/${Math.ceil(filteredData.length / itemsPerPage)}`
        }
    }

    // Get data based on current filters
    function getPageData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }

    // Function to render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        paginationDiv.innerHTML = "";

        // Previous button
        const prevButton = document.createElement("button");
        prevButton.classList.add(...['previous'])
        prevButton.textContent = "Previous";
        if (currentPage === 1) {
            prevButton.disabled = true
        }
        prevButton.addEventListener("click", () => {
            currentPage--;
            renderTable(getPageData());
            renderPagination();
        });
        paginationDiv.appendChild(prevButton);

        // Show max x pagination buttons
        let startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
        let endPage = Math.min(startPage + 4, totalPages);

        // Create pagination numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add(...['page'])

            if (i === currentPage) {
                pageBtn.classList.add("active");
            }

            pageBtn.addEventListener("click", (e) => {
                currentPage = i;
                renderTable(getPageData());
                renderPagination();
            });

            paginationDiv.appendChild(pageBtn);

        }

        // Next button
        const nextButton = document.createElement("button");
        nextButton.classList.add(...['next'])
        nextButton.textContent = "Next";
        if (currentPage === totalPages) {
            nextButton.disabled = true
        }
        nextButton.addEventListener("click", () => {
            currentPage++;
            renderTable(getPageData());
            renderPagination();
        });
        paginationDiv.appendChild(nextButton);
    }

    // Filter data by search input
    function filterData(searchInput) {
        filteredData = dataList.filter((row) => {
            var res = false
            for (let k = 0; k < options.searchableColumns.length; k++) {
                if (`${row[options.searchableColumns[k]]}`.toLowerCase().includes(searchInput.toLowerCase())) {
                    res = true
                    break
                }
            }
            return res
        });
    }

    // Function to handle search input change
    function handleSearchInput(e) {
        clearTimeout(searchDelayTimer)
        searchDelayTimer = setTimeout(() => {
            filterData(e.target.value);
            currentPage = 1;
            sortDirection = sortDirection * -1
            renderTable(getPageData());
            renderPagination();
        }, 300);
    }

    // Handle items per page selection
    function handlePerPageSelector(e) {
        currentPage = 1;
        itemsPerPage = parseInt(e.target.value)
        renderTable(getPageData());
        renderPagination();
    }

    // Function to handle column sorting
    function handleSort(column) {
        if (column === sortColumn) {
            sortDirection = -sortDirection;
        } else {
            sortColumn = column;
            sortDirection = -1;
        }

        filteredData.sort((a, b) => {
            var valA = a[column]
            var valB = b[column]
            if (typeof a[column] === 'string') {
                valA = valA.toLowerCase()
                valB = valB.toLowerCase()
            }
            if (valA < valB) {
                return -sortDirection;
            }
            if (valA > valB) {
                return sortDirection;
            }
            return 0;
        });

        renderTable(getPageData());
    }

    // Event listeners
    if (options.hasOwnProperty('searchableColumns')) {
        searchInput.addEventListener("input", handleSearchInput);
    }

    perPageSelector.addEventListener('change', handlePerPageSelector)

    document.querySelectorAll(`#${tableId} th.sortable svg`).forEach((th) => {
        th.addEventListener("click", (e) => {
            handleSort(th.dataset.key);
        });
    });

    renderTable(getPageData())
    renderPagination()
}

