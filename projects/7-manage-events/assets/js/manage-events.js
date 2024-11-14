function manageEvents() {
  const eventsApi = 'https://6734cda45995834c8a90ea9b.mockapi.io/events';
  const joinedUsersKey = 'lwnJoinedUsers';
  let joinedUsersValue = sessionStorage.getItem(joinedUsersKey);
  joinedUsersValue =
    joinedUsersValue === null ? [] : JSON.parse(joinedUsersValue);
  return {
    events: [],
    joinedUsers: joinedUsersValue,
    //** Manage
    toDeleteEvent: '',
    showDeleteModal: false,
    toEditEvent: {
      id: '',
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      capacity: '',
    },
    showEditModal: false,
    addedEvent: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      capacity: '',
    },
    showAddModal: false,

    //*** Init Function
    async initEvents() {
      await this.fetchEvents();
    },

    //*** Can?
    canUserJoin(event) {
      return event.currentAttendeesCount < event.capacity - 1;
    },
    //*** Is?
    isUserJoined(user, event) {
      const joinedUser = this.joinedUsers.find(
        (i) => i.userId == user.id && i.eventId == event.id
      );
      return !!joinedUser;
    },

    //** Join
    joinEvent(user, event) {
      // mark user joined to that event
      this.joinedUsers.push({
        userId: user.id,
        eventId: event.id,
      });
      // store in local Session
      this.updateLocalSession();
      // Update Event Data
      this.updateEventAttendeesCount(event, 'inc');
    },
    unjoinEvent(user, event) {
      // remove user from event
      this.joinedUsers = this.joinedUsers.filter(
        (i) => i.userId != user.id && i.eventId != event.id
      );
      // store in local Session
      this.updateLocalSession();
      // Update Event Data
      this.updateEventAttendeesCount(event, 'dec');
    },

    //*** Fetchers
    // Delete Event
    async deleteEvent(toDeleteEventId) {
      const singleEventApi = eventsApi + '/' + toDeleteEventId;
      const response = await fetch(singleEventApi, {
        method: 'DELETE',
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // reset to delete event
        this.toDeleteEvent = '';
        //refetch data
        await this.fetchEvents();
      } else {
        console.error('Some error happened while deleting event');
      }
    },
    // Add Event
    async addEvent() {
      const newEvent = {
        ...this.addedEvent,
        currentAttendeesCount: 0,
      };
      // Send to the server
      const response = await fetch(eventsApi, {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // close modal
        this.showAddModal = false;
        // reset to edit event
        this.addedEvent = {
          title: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          capacity: '',
        };
        // refetch data
        await this.fetchEvents();
      } else {
        console.error('Some error happened while adding event');
      }
    },
    // Edit Event
    async editEvent() {
      const singleEventApi = eventsApi + '/' + this.toEditEvent.id;
      // Send to the server
      const response = await fetch(singleEventApi, {
        method: 'PUT',
        body: JSON.stringify(this.toEditEvent),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // close modal
        this.showEditModal = false;
        // reset to edit event
        this.toEditEvent = {
          id: '',
          title: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          capacity: '',
        };
        // refetch data
        await this.fetchEvents();
      } else {
        console.error('Some error happened while updating count');
      }
    },
    // Update Event Count
    async updateEventAttendeesCount(event, type) {
      const singleEventApi = eventsApi + '/' + event.id;
      let newCount;
      if (type === 'inc') {
        newCount = event.currentAttendeesCount + 1;
      } else if (type === 'dec') {
        newCount = event.currentAttendeesCount - 1;
      } else {
        newCount = event.currentAttendeesCount;
      }
      const editedEvent = {
        ...event,
        currentAttendeesCount: newCount,
      };
      // Send to the server
      const response = await fetch(singleEventApi, {
        method: 'PUT',
        body: JSON.stringify(editedEvent),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // refetch data
        await this.fetchEvents();
      } else {
        console.error('Some error happened while updating count');
      }
    },
    // get all events
    async fetchEvents() {
      const response = await fetch(eventsApi);
      if (response.ok) {
        const result = await response.json();
        this.events = result;
      } else {
        console.log('Error happened while fetching the events');
      }
    },

    //*** Utils
    // Session Storage
    updateLocalSession() {
      sessionStorage.setItem(joinedUsersKey, JSON.stringify(this.joinedUsers));
    },
    // Format Date
    formatDate(dateString) {
      const date = new Date(dateString);

      // Format
      const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return formattedDate;
    },
  };
}
