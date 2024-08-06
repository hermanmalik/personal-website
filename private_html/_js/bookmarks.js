
const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_KEY;
const FOLDERS_TO_OPEN = ['', 'Bookmarks bar', 'Other bookmarks'];
const debug = true;

// Function to fetch all bookmarks
async function fetchAllBookmarks() {
  let allBookmarks = [];
  let offset = 0;

  while (true) {
    const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`, {
      headers: {
        'apikey': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error('Error fetching bookmarks');
    }

    const bookmarks = await response.json();
    if (bookmarks.length === 0) {
      break; // No more data to fetch
    }

    allBookmarks = allBookmarks.concat(bookmarks);
    offset += PAGE_SIZE;
  }
  
  if (debug) console.log(allBookmarks.length); 
  return allBookmarks;
}

// Build tree
fetchAllBookmarks()
  .then(data => {
    // Build hierarchical structure from flat data
    const bookmarksMap = new Map();
    data.forEach(bookmark => {
      bookmarksMap.set(bookmark.id, { ...bookmark, children: [] });
    });

    const rootNodes = [];
    bookmarksMap.forEach(bookmark => {
      if (bookmark.parent_id) {
        const parent = bookmarksMap.get(bookmark.parent_id);
        if (parent) {
          // Push bookmark into the parent's children array
          parent.children.push(bookmark);
        }
      } else {
        rootNodes.push(bookmark);
      }
    });

    // Sort children by index
    const sortChildrenByIndex = (nodes) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          node.children.sort((a, b) => (a.index || 0) - (b.index || 0));
          sortChildrenByIndex(node.children); // Recursively sort children
        }
      });
    };

    sortChildrenByIndex(rootNodes);

    // Function to build the tree structure in HTML
    const buildTree = (nodes) => {
      const ul = document.createElement('ul');
      nodes.forEach(node => {
        const li = document.createElement('li');
        if (FOLDERS_TO_OPEN.includes(node.title)) {
          li.classList.add('expanded');
        }
        if (node.children.length > 0) {
          li.classList.add('folder');
          li.textContent = node.title + ' ';
          const toggleButton = document.createElement('span');
          toggleButton.classList.add('toggle-button');
          toggleButton.textContent = li.classList.contains('expanded') ? '▼' : '▶';
          toggleButton.onclick = () => {
            li.classList.toggle('expanded');
            toggleButton.textContent = li.classList.contains('expanded') ? '▼' : '▶';
          };
          li.appendChild(toggleButton);
          li.appendChild(buildTree(node.children));
        }
        else if (node.url) {
          const link = document.createElement('a');
          link.href = node.url;
          link.target = '_blank';
          link.textContent = node.title;
          li.appendChild(link);
        }
        ul.appendChild(li);
      });
      return ul;
    };

    // Render bookmarks on the page
    const bookmarksList = document.getElementById('bookmarks');
    bookmarksList.appendChild(buildTree(rootNodes));
    if (debug) console.log("Bookmarks rendered successfully");
  })
  .catch(error => {
    console.error('Error fetching bookmarks:', error);
  });
