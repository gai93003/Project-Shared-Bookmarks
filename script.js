import { getUserIds, getData, setData } from "./storage.js";

const selectUsers = document.getElementById("select-users");
const urlInput = document.getElementById("input-el");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submit-btn");
const displayUsers = document.getElementById("display-bookmarks");
const informUser = document.getElementById("inform-user");

// Populate dropdown with user IDs
const populateDropdown = () => {
  const users = getUserIds();
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `User ${user}`;
    selectUsers.appendChild(option);
  });

};

// Display bookmarks for selected user
const displayBookmarks = () => {
  const selectedUser = selectUsers.value;
  displayUsers.innerHTML = "";
  informUser.textContent = "";

  let bookmarks = getData(selectedUser);

  if (!Array.isArray(bookmarks)) {
    console.warn(`Invalid data format for user ${selectedUser}`, bookmarks);
    bookmarks = [];
  }

  // Filter out undefined or malformed objects
  bookmarks = bookmarks.filter(b => b && typeof b === "object" && b.url && b.title);

  if (bookmarks.length === 0) {
    informUser.textContent = `No valid bookmarks found for User ${selectedUser}`;
    return;
  }

  bookmarks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  bookmarks.forEach((bookmark) => {
    const bookmarkElement = document.createElement("div");

    const title = document.createElement('h2');
    

    const link = document.createElement('a');
    link.href = bookmark.url;
    link.textContent = bookmark.title;

    const description = document.createElement('p');
    description.textContent = bookmark.title || "No description provided.";

    const timestamp = document.createElement('h2');
    const str = document.createElement('strong');
    const span = document.createElement('span');
    str.textContent = 'Created At:'
    span.textContent = bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleString() : 'Unknown';

    title.appendChild(link);
    timestamp.appendChild(str);
    timestamp.appendChild(span);

    bookmarkElement.appendChild(title);
    bookmarkElement.appendChild(description);
    bookmarkElement.appendChild(timestamp);
    displayUsers.appendChild(bookmarkElement);
  });
};


// Add a new bookmark
const addBookmark = () => {
  const selectedUser = selectUsers.value;
  if (!selectedUser) {
    alert("Please select a user");
    return;
  }

  const newBookmark = {
    url: urlInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    createdAt: new Date().toISOString(),
  };

  let bookmarks = getData(selectedUser) || [];
  if (!Array.isArray(bookmarks)) {
    bookmarks = [];
  }
  bookmarks.push(newBookmark);
  setData(selectedUser, bookmarks);

  // Refresh displayed bookmarks
  displayBookmarks();

  urlInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
};

selectUsers.addEventListener("change", displayBookmarks);
submitBtn.addEventListener("click", () => {
  if (selectUsers.value === 0 || !Number(selectUsers.value)) {
    alert('Please select a user');
    return;
  }
  else {
    addBookmark();
  }
});

window.onload = populateDropdown;
