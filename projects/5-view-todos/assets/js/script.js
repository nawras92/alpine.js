function initAlpine() {
  const usersApi = 'https://jsonplaceholder.typicode.com/users';
  const todosApi = 'https://jsonplaceholder.typicode.com/todos';
  // filter by completed
  // filter by incompleted
  // filter by user

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
    //*** Filter
    showCompleted: false,
    showIncompleted: false,
    //** Filter by user
    selectedTodoUserId: '',
    selectedTodoUser: '',

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
    // update Search Result String
    updateSearchResultString() {
      if (this.displayedTodos.length !== 0) {
        this.searchResultString = 'The result for: ' + this.searchWord;
      } else {
        this.searchResultString = 'No Result Found';
        this.displayedTodos = [];
      }
      if (!this.searchWord) {
        this.searchResultString = '';
      }
    },
    searchTodos() {
      let filteredTodos = this.todos;
      if (this.searchWord) {
        filteredTodos = filteredTodos.filter((todo) =>
          todo.title.toLowerCase().includes(this.searchWord.toLowerCase())
        );
      }
      if (this.showCompleted) {
        this.showIncompleted = false;
        filteredTodos = filteredTodos.filter((todo) => todo.completed);
      }
      if (this.showIncompleted) {
        this.showCompleted = false;
        filteredTodos = filteredTodos.filter((todo) => !todo.completed);
      }
      this.displayedTodos = filteredTodos;
      this.updateSearchResultString();
    },

    //**** Filters
    filterByCompleted() {
      let filteredTodos = this.todos;
      if (this.searchWord) {
        filteredTodos = filteredTodos.filter((todo) =>
          todo.title.toLowerCase().includes(this.searchWord.toLowerCase())
        );
      }
      if (this.showCompleted) {
        this.showIncompleted = false;
        filteredTodos = filteredTodos.filter((todo) => todo.completed);
      }
      this.displayedTodos = filteredTodos;
    },
    filterByIncompleted() {
      let filteredTodos = this.todos;
      if (this.searchWord) {
        filteredTodos = filteredTodos.filter((todo) =>
          todo.title.toLowerCase().includes(this.searchWord.toLowerCase())
        );
      }
      if (this.showIncompleted) {
        this.showCompleted = false;
        filteredTodos = filteredTodos.filter((todo) => !todo.completed);
      }
      this.displayedTodos = filteredTodos;
    },

    // filter by user
    filterByUser() {
      let filteredTodos = this.todos;

      if (this.selectedTodoUserId) {
        filteredTodos = filteredTodos.filter(
          (todo) => todo.userId == this.selectedTodoUserId
        );
        // Get the user
        const user = this.users.find((u) => u.id == this.selectedTodoUserId);
        this.selectedTodoUser = user ? user : '';
      }

      this.displayedTodos = filteredTodos;
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
