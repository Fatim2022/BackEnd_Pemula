const { nanoid } = require('nanoid');

let books = [];

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  // Validasi: Nama buku harus ada
  if (!name || name.trim() === '') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }

  // Validasi: readPage tidak boleh lebih besar dari pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;
  
  let filteredBooks = [...books];

  // Filter berdasarkan status reading
  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter(book => book.reading === isReading);
  }

  // Filter berdasarkan status finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
  }

  // Filter berdasarkan nama
  if (name) {
    const keyword = name.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.name.toLowerCase().includes(keyword)
    );
  }

  const simplifiedBooks = filteredBooks.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  return h.response({
    status: 'success',
    data: {
      books: simplifiedBooks
    }
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book
    }
  }).code(200);
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  const index = books.findIndex(b => b.id === bookId);

  // Validasi: ID buku tidak ditemukan
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
  }

  // Validasi: Nama buku harus ada
  if (!name || name.trim() === '') {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }

  // Validasi: readPage tidak boleh lebih besar dari pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }).code(200);
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex(b => b.id === bookId);

  // Validasi: ID buku tidak ditemukan
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  }).code(200);
};

const rootHandler = (request, h) => {
  return h.response('<h1>Welcome to Bookshelf API</h1>').code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
  rootHandler
};