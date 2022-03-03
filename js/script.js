// Example
// {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
// }

// {
//     id: 3657848524,
//     title: "Harry Potter and the Philosopher's Stone",
//     author: "J.K Rowling",
//     year: 1997,
//     isComplete: false,
// }

const localStorageKey = "DATA_BUKU"

const title           = document.querySelector("#inputBookTitle");
const errorTitle      = document.querySelector("#errorTitle");
const sectionTitle    = document.querySelector("#sectionTitle");

const author          = document.querySelector("#inputBookAuthor");
const errorAuthor     = document.querySelector("#errorAuthor");
const sectionAuthor   = document.querySelector("#sectionAuthor");

const year            = document.querySelector("#inputBookYear");
const errorYear       = document.querySelector("#errorYear");
const sectionYear     = document.querySelector("#sectionYear");

const readed          = document.querySelector("#inputBookIsComplete");

const btnSubmit       = document.querySelector("#bookSubmit");

const searchValue     = document.querySelector("#searchBookTitle");
const btnSearch       = document.querySelector("#searchSubmit");

let checkInput  = [];
let checkTitle  = null;
let checkAuthor = null;
let checkYear   = null;

window.addEventListener("load", function(){
    if (localStorage.getItem(localStorageKey) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
});

btnSearch.addEventListener("click",function(e) {
    e.preventDefault()
    if (localStorage.getItem(localStorageKey) == null) {    
        return alert("Tidak ada data buku")
    }else{
        const getByTitle = getData().filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author == searchValue.value.trim());
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year == searchValue.value.trim());
                if (getByYear.length == 0) {
                    sweetAlertError();
                }else{
                    showSearchResult(getByYear);
                }
            }else{
                showSearchResult(getByAuthor);
            }
        }else{
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = ''
});

btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = []

        title.classList.remove("error")
        author.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display");
        errorAuthor.classList.add("error-display");
        errorYear.classList.add("error-display");

        if (title.value == "") {
            checkTitle = false
        }else{
            checkTitle = true
        }

        if (author.value == "") {
            checkAuthor = false
        }else{
            checkAuthor = true
        }

        if (year.value == "") {
            checkYear = false
        }else{
            checkYear = true
        }

        checkInput.push(checkTitle,checkAuthor,checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        }else{
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: readed.checked
            }
            insertData(newBook)

            title.value = ''
            author.value = ''
            year.value = ''
            readed.checked = false
            sweetAlertSuccess();
        }    
    }else{
        const bookData = getData().filter(a => a.id != btnSubmit.value);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))

        const newBook = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: readed.checked
        }
        insertData(newBook)
        btnSubmit.innerHTML = "Masukkan Buku"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        readed.checked = false
        sweetAlertSuccess();
    }
});

function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
};

function insertData(book) {
    let bookData = []


    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookData.unshift(book)   
    localStorage.setItem(localStorageKey,JSON.stringify(bookData))

    showData(getData())
};

function getData() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
};

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <a href="#gotoinputbuku"><button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button></a>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `

            inCompleted.innerHTML += el
        }else{
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <a href="#gotoinputbuku"><button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button></a>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `
            completed.innerHTML += el
        }
    });
};

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let el = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isCompleted ? 'Its been read' : 'Belum dibaca'}</p>
        </article>
        `

        searchResult.innerHTML += el
    });
};

function readedBook(id){
    return Swal.fire({
        title: 'Pindahkan ke Selesai dibaca?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Pindahkan!'
      }).then((result) => {
        if (result.isConfirmed) {
                const bookDataDetail = getData().filter(a => a.id == id);
                const newBook = {
                    id: bookDataDetail[0].id,
                    title: bookDataDetail[0].title,
                    author: bookDataDetail[0].author,
                    year: bookDataDetail[0].year,
                    isCompleted: true
                }

                const bookData = getData().filter(a => a.id != id);
                localStorage.setItem(localStorageKey,JSON.stringify(bookData))

                insertData(newBook)
        }
    })
};

function unreadedBook(id) {
    return Swal.fire({
        title: 'Pindahkan ke Belum selesai dibaca?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Pindahkan!'
      }).then((result) => {
        if (result.isConfirmed) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                isCompleted: false
            }

            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))

            insertData(newBook)
        }
    })
};

function editBook(id) {
    const bookDataDetail = getData().filter(a => a.id == id);
    title.value = bookDataDetail[0].title
    author.value = bookDataDetail[0].author
    year.value = bookDataDetail[0].year
    bookDataDetail[0].isCompleted ? readed.checked = true:readed.checked = false

    btnSubmit.innerHTML = "Edit buku"
    btnSubmit.value = bookDataDetail[0].id
};

function deleteBook(id){
    return Swal.fire({
        title: 'Hapus Buku?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus Buku!'
      }).then((result) => {
        if (result.isConfirmed) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))
            showData(getData())
        }
    })
};

function sweetAlertSuccess(){
    return Swal.fire({
        icon: 'success',
        title: 'Buku telah disimpan',
        showConfirmButton: true,
        timer: 5000
      })
};

function sweetAlertError(){
    return Swal.fire({
        icon: 'error',
        title: 'Buku tidak ditemukan',
        showConfirmButton: true,
        timer: 5000
      })
}