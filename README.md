# simple-datatable
A simple HTML datatable built in pure Javascript.

<img src="https://firebasestorage.googleapis.com/v0/b/flutterapp-5c015.appspot.com/o/demo_images%2Fsimple_datatable.png?alt=media&token=a85cf0b3-a256-4100-9436-1ab2a5801789" style="width:100%" alt="Simple Datatable" />

## Usage


- Copy and paste the following css link and js script to your html file.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/habibmhamadi/simple-datatable/dist/css/simple-datatable.min.css">
```
```html
<script src="https://cdn.jsdelivr.net/gh/habibmhamadi/simple-datatable/dist/js/simple-datatable.min.js"></script>
```

### Basic Initialization

 - Give an id to your table element and add `<th>` elements as well.
 - To enable column sorting add `sortable` class on desired `<th>` element.

```html
<table id="myTable">
    <thead>
      <tr>
        <th class="sortable">ID</th>
        <th class="sortable">Name</th>
        <th class="sortable">Country</th>
        <th>Email</th>
      </tr>
    </thead>
  </table>
```


 - Call the function and pass the id and list of data.
```html
<script>
    const dataList = [
        [1, "John Doe", 'Afghanistan', "john@example.com", "https://i.pravatar.cc/50?img=1"],
        [2, "Jane Smith", 'Germany', "jane@example.com", "https://i.pravatar.cc/50?img=2"],
        // Add more data as needed
    ]

    new simpleDataTable('myTable', dataList)
</script>
```
<br/>

### Enable Searching & Customizing Columns

- By default the search functionality is disabled.
- You can pass a third optional paramater for enabling search functionality and more customization.

```javascript
new simpleDataTable('myTable', dataList, {
    searchableColumns: [1], // Add column indexes on which you want to enable searching.
    title: 'Customers',
    itemsPerPage: 5,
    pageSelection: [5, 10, 20, 50, 100], // Selection of items per page
    fontFamily: 'arial',
    height: '17rem' // Default
})
```

- You can add custom columns or customize each column data by overriding `onRowRender` function in options.
- `onRowRender` has two array parameters the first one contains the data of a row and the second one contains the default rendered `<td>`s.

```html
<table id="myTable">
    <thead>
      <tr>
        <th class="sortable">ID</th>
        <th class="sortable">Name</th>
        <th class="sortable">Country</th>
        <th>Email</th>
        <th>Action</th> <!-- Custom Column -->
      </tr>
    </thead>
  </table>
```
```javascript
new simpleDataTable('myTable', dataList, {
    searchableColumns: [1],
    title: 'Customers',
    onRowRender: function(data, column) {
        column[1] = `<td style="display:flex; align-items:center;">
                         <img src="${data[4]}" style="width:30px; border-radius:50%; margin-right:5px;" /> <span>${data[1]}</span>
                     </td>`
        column[4] = `<td>
                         <button onClick="alert('You clicked row id ${data[0]}')">Click</button>
                     </td>`
        return column
    }
})
```
<img src="https://firebasestorage.googleapis.com/v0/b/flutterapp-5c015.appspot.com/o/demo_images%2Fsimple_datatable1.png?alt=media&token=91290d37-e5e0-49ab-9063-1cde53e8ffdc" style="width:100%" alt="Simple Datatable 2" />



## Contribute

Report bugs and suggest feature in [issue tracker](https://github.com/habibmhamadi/simple-datatable/issues). Feel free to `Fork` and send `Pull Requests`.

--- *Please give a star if you like it.* ---


## License

[MIT](https://github.com/habibmhamadi/simple-datatable/blob/main/LICENSE)
