function initAlpine() {
  const usersApi = 'https://6734cda45995834c8a90ea9b.mockapi.io/users';
  const loggedInKey = 'lwnLoggedInKey';
  const loggedInUserKey = 'lwnLoggedInUserKey';
  let loggedInValue = localStorage.getItem(loggedInKey);
  const loggedInUserValue = localStorage.getItem(loggedInUserKey);

  return {
    users: [],
    //** Auth forms
    showLoginForm: true,
    showRegisterForm: false,
    //** Login
    loginUsername: '',
    loginPassword: '',
    loginError: false,
    loginMessage: '',
    loggedIn: false,
    loggedInUser:
      loggedInUserValue === null ? '' : JSON.parse(loggedInUserValue),
    //** Register
    registerError: false,
    registerMessage: '',
    registerName: '',
    registerUsername: '',
    registerPassword1: '',
    registerPassword2: '',

    //*** Init Function
    async init() {
      await this.fetchUsers();
      // set logged in from storage
      this.loggedIn = this.toBool(loggedInValue);
    },
    //*** Reset
    resetAll() {
      this.registerError = false;
      this.registerMessage = '';
      this.loginError = false;
      this.loginMessage = '';
      this.loginUsername = '';
      this.loginPassword = '';
      this.registerUsername = '';
      this.registerName = '';
      this.registerPassword1 = '';
      this.registerPassword2 = '';
    },
    //** Register
    createNewAccount() {
      // reset
      this.registerError = false;
      this.registerMessage = '';
      // Validate
      if (!this.registerName) {
        this.registerError = true;
        this.registerMessage = 'Name is required';
        return;
      }
      if (!this.registerUsername) {
        this.registerError = true;
        this.registerMessage = 'Username is required';
        return;
      }
      if (!this.registerPassword1) {
        this.registerError = true;
        this.registerMessage = 'Password is required';
        return;
      }
      if (this.registerPassword1 !== this.registerPassword2) {
        this.registerError = true;
        this.registerMessage = 'Passwords do not  match';
        return;
      }

      // Send user to server
      this.createUserInApi({
        name: this.registerName,
        username: this.registerUsername,
        password: this.registerPassword1,
        admin: false,
      });
    },

    //** Login
    loginToWebsite() {
      // Reset
      this.loginError = false;
      this.loginMessage = '';
      // Validate
      if (!this.loginUsername) {
        this.loginError = true;
        this.loginMessage = 'Username is required';
        return;
      }
      if (!this.loginPassword) {
        this.loginError = true;
        this.loginMessage = 'Password is required';
        return;
      }
      // Get User
      const user = this.getUserByUsername(this.loginUsername);
      if (!user) {
        this.loginError = true;
        this.loginMessage = 'User do not exist, create an account';
        return;
      }
      // Check password
      if (user.password !== this.loginPassword) {
        this.loginError = true;
        this.loginMessage = 'The user password is not correct';
        return;
      }
      //  Save Login// localStorage
      this.loginError = false;
      this.loggedIn = true;
      this.loggedInUser = user;
      this.loginMessage = 'You have successfully logged IN';
      // store in localStorage
      this.setUserLoggedIn();
    },

    //*** Getters
    getUserByUsername(username) {
      const user = this.users.find((u) => u.username == username);
      return user ? user : false;
    },

    //** Setters
    setUserLoggedIn() {
      localStorage.setItem(loggedInKey, this.loggedIn);
      localStorage.setItem(loggedInUserKey, JSON.stringify(this.loggedInUser));
    },

    logoutUser() {
      this.resetAll();
      this.loggedIn = false;
      this.loggedInUser = '';
      localStorage.setItem(loggedInKey, false);
      localStorage.setItem(loggedInUserKey, JSON.stringify(this.loggedInUser));
    },

    //*** Fetchers
    // Create User
    async createUserInApi(data) {
      try {
        const response = await fetch(usersApi, {
          method: 'POST',

          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          this.registerError = false;
          this.registerMessage = 'This account has been created successfully!';
          // re fetch users
          await this.fetchUsers();
          // Redirect Login
          setTimeout(() => {
            // Reset
            this.resetAll();
            this.showRegisterForm = false;
            this.showLoginForm = true;
          }, 2000);
        } else {
          this.registerMessage = 'Error from server side';
          this.registerError = true;
        }
      } catch (error) {
        console.error(error);
      }
    },
    // Users
    async fetchUsers() {
      const response = await fetch(usersApi);
      if (response.ok) {
        const result = await response.json();
        this.users = result;
      } else {
        console.error('some error happened');
      }
    },

    //*** Utils
    toBool(value) {
      if (
        value === 'false' ||
        value === '0' ||
        value === '' ||
        value === null ||
        value === undefined
      ) {
        return false;
      }

      if (value === 'true' || value === '1') {
        return true;
      }

      return !!value;
    },
  };
}
