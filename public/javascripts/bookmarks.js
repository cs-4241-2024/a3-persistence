document.addEventListener("DOMContentLoaded", async function () {
  // Function to populate the title with the username
  function setTitle(username) {
    const titleElement = document.querySelector("h1.title");
    titleElement.textContent = `Bookmarks for ${username}`;
  }

  // Function to populate the bookmarks table
  function populateBookmarksTable(bookmarks) {
    const tableBody = document.getElementById("bookmarkTable");
    tableBody.innerHTML = ""; // Clear existing content

    bookmarks.forEach((bookmark) => {
      const row = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.textContent = bookmark.title;

      const urlCell = document.createElement("td");
      const link = document.createElement("a");

      // Ensure the bookmark.url has the protocol (http:// or https://)
      const formattedUrl =
        bookmark.url.startsWith("http://") || bookmark.url.startsWith("https://")
          ? bookmark.url
          : "https://" + bookmark.url;

      link.href = formattedUrl;
      link.textContent = bookmark.url;
      link.target = "_blank"; //open in new tab
      urlCell.appendChild(link);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "button is-danger is-small";
      deleteButton.addEventListener("click", () => deleteBookmark(bookmark.url));
      actionsCell.appendChild(deleteButton);

      row.appendChild(titleCell);
      row.appendChild(urlCell);
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  }

  // Function to fetch bookmarks from the server
  async function fetchBookmarks() {
    try {
      const response = await fetch("/bookmarks/data");
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
      const { username, bookmarks } = await response.json();
      setTitle(username);
      populateBookmarksTable(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }

  // Function to delete a bookmark
  async function deleteBookmark(bookmarkUrl) {
    try {
      const response = await fetch(`/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: bookmarkUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      await fetchBookmarks(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  }

  // Fetch bookmarks on page load
  await fetchBookmarks();

  // Handle adding a bookmark (optional implementation)
  const addBookmarkBtn = document.getElementById("addBookmarkBtn");
  addBookmarkBtn.addEventListener("click", async function () {
    const titleInput = document.getElementById("title");
    const urlInput = document.getElementById("url");

    console.log(urlInput);

    const title = titleInput.value.trim();
    let url = urlInput.value.trim();

    if (!title || !url) {
      alert("Both fields are required.");
      return;
    }

    // Remove the fragment part (anything after '#')
    const fragmentIndex = url.indexOf("#");
    if (fragmentIndex > -1) {
      url = url.substring(0, fragmentIndex);
    }

    console.log("adding bookmark ", title, url);

    if (title && url) {
      try {
        const response = await fetch("/bookmarks/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, url }),
        });

        if (!response.ok) {
          throw new Error("Failed to add bookmark");
        }
        await fetchBookmarks(); // Refresh the table
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    }
  });
});
