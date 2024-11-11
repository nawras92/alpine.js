function initAlpine() {
  const usersApi = 'https://jsonplaceholder.typicode.com/users';
  const todosApi = 'https://jsonplaceholder.typicode.com/todos';

  return {
    users: [],
    todos: [],
    displayedTodos: [],
    //*** Pagination
    paginate: false,
    perPage: 10,
    pagesCount: 0,
    currentPage: 1,
    //*** Search
    searchWord: '',
    searchResultString: '',

    //*** Init Function
    async init() {
      await this.fetchUsers();
      await this.fetchTodos();
      this.paginateTodos();
    },

    //**** Pagination
    paginateTodos() {
      if (this.paginate) {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        const paginatedTodos = this.todos.slice(start, end);
        this.displayedTodos = paginatedTodos;
      } else {
        this.displayedTodos = this.todos;
      }
    },

    //*** Search and filter
    searchTodos() {
      let filteredTodos = this.todos;
      if (this.searchWord) {
        filteredTodos = this.displayedTodos.filter((todo) =>
          todo.title.includes(this.searchWord.toLowerCase())
        );
      }
      if (filteredTodos.length !== 0) {
        this.displayedTodos = filteredTodos;
        this.searchResultString = 'The result for: ' + this.searchWord;
      } else {
        this.searchResultString = 'No Result Found';
        this.displayedTodos = [];
      }
      if (!this.searchWord) {
        this.searchResultString = '';
      }
    },

    //*** Getters
    getTodoUser(userId) {
      const user = this.users.find((u) => u.id == userId);
      return user ? user.name : '';
    },
    getPagesArray() {
      const range = Array.from({ length: this.pagesCount }, (_, i) => i + 1);
      return range;
    },
    //*** Setters
    setCurrentPage(curr = 1) {
      this.currentPage = curr;
      this.paginateTodos();
    },

    //*** Fetchers
    async fetchTodos() {
      const response = await fetch(todosApi);
      if (response.ok) {
        const result = await response.json();
        this.todos = result;
        // Set Page Count
        this.pagesCount = Math.ceil(result.length / this.perPage);
      } else {
        console.error('some error happened');
      }
    },
    async fetchUsers() {
      const response = await fetch(usersApi);
      if (response.ok) {
        const result = await response.json();
        this.users = result;
      } else {
        console.error('some error happened');
      }
    },
  };
}
