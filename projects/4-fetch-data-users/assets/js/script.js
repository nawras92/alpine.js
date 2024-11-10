function initAlpine() {
  const usersApi = 'https://jsonplaceholder.typicode.com/users';

  return {
    users: [],

    init() {
      this.fetchUsers();
    },

    async fetchUsers() {
      const response = await fetch(usersApi);
      if (response.ok) {
        const result = response.json();
        this.users = result;
      } else {
        console.error('some error happened');
      }
    },
  };
}
