const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
  rootHandler
} = require('./handlers');

const routes = [
  // Kriteria 1: Root path
  {
    method: 'GET',
    path: '/',
    handler: rootHandler
  },

  // Kriteria 3: Menyimpan buku baru
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
    options: {
      payload: {
        parse: true,
        output: 'data'
      }
    }
  },

  // Kriteria 4: Menampilkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },

  // Kriteria 5: Menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },

  // Kriteria 6: Mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookHandler
  },

  // Kriteria 7: Menghapus buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler
  }
];

module.exports = routes;