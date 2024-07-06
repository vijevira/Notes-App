document.addEventListener('DOMContentLoaded', function () {
  const addBtn = document.getElementById("addBtn");
  const authModal = new bootstrap.Modal(document.getElementById('authModal'));
  const addNoteModel = new bootstrap.Modal(document.getElementById('addNoteModel'));
  const authForm = document.getElementById('authForm');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');
  const noteDiv = document.getElementById('notes-div');
  const noteBgColor = document.getElementById('note-bg-color');
  const noteContent = document.getElementById('note-content');
  const noteRemindDate = document.getElementById('note-remind-date');
  const usernameId = document.getElementById('usernameId');

  // const closeBtn = document.getElementById('closeBtn');


  async function loadNotes() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notes', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    if (notes.error === 'Unauthorized') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      noteDiv.style.display = 'none';
    } else {
      localStorage.setItem('noteCard', notes);
      showNotes(notes);
    }
  }
  // Function to show elements from database
  function getHumanReadableDateDifference(inputDate) {
    if (!inputDate) {
        return `
        <div class="reminderDiv">
            
        </div>`;
    }
    
    const now = new Date();
    const date = new Date(inputDate);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let remind;
    let past = false;
    
    if (date.toDateString() === today.toDateString()) {
        remind = `Today, ${date.toLocaleTimeString('en-US', options)}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
        remind = `Tomorrow, ${date.toLocaleTimeString('en-US', options)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        remind = `Yesterday, ${date.toLocaleTimeString('en-US', options)}`;
        past = true;
    } else {
        const monthOptions = { month: 'long', day: 'numeric' };
        remind = `${date.toLocaleDateString('en-US', monthOptions)}, ${date.toLocaleTimeString('en-US', options)}`;
        if (date < today) {
            past = true;
        }
    }

    const reminderClass = past ? 'reminderText past' : 'reminderText ft';
    
    return `
    <div class="reminderDiv">
        <div>
            <p class="${reminderClass}">${remind}</p>
        </div>
    </div>`;
}
  
  function showNotes(notes, msg) {
    document.getElementById('note-title-1').innerText = msg || 'Notes';
    const notesElm = document.getElementById("notes");
    notesElm.innerHTML = '';
    if (notes) {
      notes.forEach(function (note, index) {
        const noteElement = document.createElement('div');
        let dateTime = new Date((new Date(note.reminder)).toString()).toISOString().split('.')[0];
        let humanReadable = getHumanReadableDateDifference(note.reminder);
        noteElement.className = `noteCard my-2 mx-2 card note`;
        noteElement.innerHTML = `
              <div class="card-body" >
                <textarea class="card-title" onblur="handleTitleEditDone(${note.id},this.value)">${note.title}</textarea>
                <textarea class="card-text" oninput="autoResize(this)" onfocus="autoResize(this)" onblur="handleContentEditDone(${note.id},this.value)" style = "background-color: ${note.background_color}">${note.content}</textarea>
                <textarea class="card-title card-tags" onblur="handleTagsEditDone(${note.id}, this.value)"> ${note.tags.join(', ')} </textarea>
                ${humanReadable}
                <div class="remindAndColor">
                    <input type="color" id="colorPicker" style="width:30px; margin-right:5px; height:25px;cursor: pointer;" value="${note.background_color}" onchange="updateBgColor(${note.id}, this.value)">
                    <input type="datetime-local" id="datetimeInput" style="width:25px;margin-right:5px;cursor: pointer;" value="${dateTime}" onblur="handleEditReminder(${note.id}, this.value)" />
                    <button onclick="archiveNote(${note.id}, ${!note.archived}, ${note.trash})" class="btn btn-secondary" style="background:${note.trash ? 'red' : 'grey'}"> ${note.trash ? 'Delete' : note.archived ? 'Unarchive' : 'Archive'}</button>
                    <button onclick="trashNote(${note.id}, ${!note.trash})" class="btn btn-primary" style="background:${note.trash ? 'blue' : 'red'}; color:black;"> ${note.trash ? 'Restore' : 'Trash'}</button>
                </div>
                <div>
                 
                </div>
              </div>`;
        notesElm.appendChild(noteElement);
      });
      if (notes.length === 0) {
        notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
      }
    }
    const textareas = document.querySelectorAll('.card-text');
    
    textareas.forEach(textarea => {
        // Adjust height on input event
        textarea.addEventListener('input', () => autoResize(textarea));
        
        // Adjust height on page load
        autoResize(textarea);
    });
  }


  async function updateNote(id, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    // loadNotes()
    return await response.json();
  }

  window.handleEditReminder = async (id, input) => {
      const reminder = new Date(input);
      let data = await updateNote(id, {reminder});
      loadNotes();
  }
  window.updateBgColor = async(id, background_color) => {
    const data = await updateNote(id, { background_color });
    loadNotes();
  }

  window.handleTagsEditDone = async (id, tagsData) => {
    const tags = tagsData.split(',').map(tag => tag.trim())
    const data = await updateNote(id, { tags });
    loadNotes();
  }

  window.handleContentEditDone = async (id, content) => {
    const data = await updateNote(id, { content });
    loadNotes();
  }

  window.handleTitleEditDone = async (id, title) => {
    const data = await updateNote(id, { title });
    loadNotes();
  }

  window.autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  

  let changeToLoginHeader = () => {
    const navbarSupportedList = document.getElementById('navbarSupportedContent');
    const username = localStorage.getItem('username');
    usernameId.innerHTML = `${username}`;
    navbarSupportedList.innerHTML = `
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/" onclick="displayNotes()">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#" onclick="displayAddNote()">New Note</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="archive-link" href="#" onclick="getNotesForReminder()">Reminder</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="archive-link" href="#" onclick="getArchiveNote()">Archive</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="trash-link" href="#" onclick="getTrashNote()">Trash</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" id="logout-link" href="/" onclick="logout()">Logout</a>
          </li>
        </ul>
        <div class="d-flex">
          <input id="searchTxt" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" onclick="getNotesBytag()">SearchByTag</button>
        </form>
      </div>
    `;

    const searchTxt = document.getElementById("searchTxt");
    // Search functionality
    searchTxt.addEventListener("input", function (e) {
      e.preventDefault();
      const inputVal = searchTxt.value.toLowerCase();
      const noteCards = document.getElementsByClassName("noteCard");
      Array.from(noteCards).forEach((element) => {
        const cardTxt = element.getElementsByTagName("textarea")[0].value.toLowerCase();
        const cardTitle = element.getElementsByTagName("textarea")[1].value.toLowerCase();
        const cardTags = element.getElementsByTagName("textarea")[2].value.toLowerCase();
        if (cardTxt.includes(inputVal) || cardTitle.includes(inputVal) || cardTags.includes(inputVal)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    });
    window.getNotesBytag = () => {
      const inputVal = searchTxt.value.toLowerCase();
      const noteCards = document.getElementsByClassName("noteCard");
      Array.from(noteCards).forEach((element) => {
        const cardTags = element.getElementsByTagName("textarea")[2].value.toLowerCase();
        if (cardTags.includes(inputVal)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    }
  };

  

  window.changeToLogoutHeader = () => {
    const username = localStorage.getItem('username');
    // navbarSupportedList.innerHTML = `
    //   <div class="collapse navbar-collapse" id="navbarSupportedContent">
    //     <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
    //       <li class="nav-item">
    //         <a class="nav-link active" aria-current="page" href="/">Home</a>
    //       </li>
    //       <li class="nav-item">
    //         <a class="nav-link active" id="signup-link" href="#">Sign Up</a>
    //       </li>
    //       <li class="nav-item">
    //         <a class="nav-link active" id="login-link" href="#">Login</a>
    //       </li>
    //     </ul>
    //   </div>
    // `;
  };
  noteBgColor.value = '#ffffff';
  if (localStorage.getItem('token')) {
    changeToLoginHeader();
    noteDiv.style.display = 'block';
    loadNotes();
  }

  window.changeBgColor = (color) => {
    noteContent.style.backgroundColor = color;
  }

  
  

  // If user adds a note, add it to the database
  addBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const title = document.getElementById('note-title').value;
    const content = noteContent.value;
    const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());
    const background_color = noteBgColor.value;
    const reminder = noteRemindDate.value;

    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, tags, background_color, reminder }),
    });
    const data = await response.json();
    addNoteModel.hide();
    loadNotes();
  });

  window.getNotesForReminder = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notes/reminder', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    showNotes(data, 'Reminder');
  }


  // Function to delete a note
  window.deleteNote = async (id, trash) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    (trash) ? getTrashNote() : loadNotes();
  }

  // Function to archive a note
  window.getArchiveNote = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notes/archived', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    showNotes(notes, 'Archive');
  }

  window.getTrashNote = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notes/trash', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    showNotes(notes, 'Trash');
  }

  window.archiveNote = async (id, archived, trash) => {
    const token = localStorage.getItem('token');
    if (trash) {
      window.deleteNote(id, true);
    }
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ archived }),
    });
    const data = await response.json();
    (!archived) ? getArchiveNote() : loadNotes();
  }

  window.trashNote = async (id, trash) => {
    const token = localStorage.getItem('token');
    console.log('trashNote', trash);
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ trash }),
    });
    const data = await response.json();
    (!trash) ? getTrashNote() : loadNotes();
  }

  window.editNote = async (id, note) => {
    const token = localStorage.getItem('token');
  }


  // Login/Signup functionality
  signupLink.addEventListener('click', function () {
    authModal.show();
  });

  loginLink.addEventListener('click', function () {
    authModal.show();
  });

  window.displayAddNote = () => {
    addNoteModel.show();
  }

  window.closeAddBtn = () => {
    addNoteModel.hide();
  }

  window.closeBtn = () => {
    authModal.hide();
  }

  window.displayNotes = async () => {
    await loadNotes();
  }

  window.logout = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    changeToLogoutHeader();
    noteDiv.style.display = 'none';
  };

  loginBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      changeToLoginHeader();
      noteDiv.style.display = 'block';
      authModal.hide();
      loadNotes();
    } else {
      alert(data.error || data);
    }
  });

  signupBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    alert(data.error || 'username or password incorrect');
  });
});
