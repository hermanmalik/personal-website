
let API_URL; 
let API_KEY;
const ENCRYPTED_API_URL = "U2FsdGVkX182N1bf/csQKKu+yXkKZ3dQjrIHNBB6VqnYOFWyiWM0hlC3VxR3oj081cKue5rtN1sCvJ2yPs9+f3j1TrP8JH18cG0/BBvAPgc=" // CryptoJS.AES.encrypt(API_URL, secretKey).toString();
const ENCRYPTED_API_KEY = "U2FsdGVkX1/b7K3ji/jMhhoucRYfq5BHFozOrzjhouaH3Ro56X1BtA9sRqiGzWx1R8y3yus3KbfTiX6rzS9KBFxSERGFMViNGFOB5gaFDFkOmfdtcj4++H5v+8oYqEZkjk3uPQ43aRdr3qMXsBxGENao7RzTokOEhZVexbgOU5QRA4UiPBw9bSsNtvYEu88LIdAF0L4LY6MRKxx/KOA9jCVO9uBILLtT9ayK15iDd+CjM63+/7LArqqN4Qzxs86wgAM3LmtUQKRsF43Ok4JmHmO3qp4EILAL68FH+vIMoytTI2Uvy5rN8eLeeFVKwZ4/" // CryptoJS.AES.encrypt(API_KEY, secretKey).toString();
const PASSWORD_TEST = 'U2FsdGVkX1+A5yiA4ByqTzKxHNkykKMjLGLzpLyOV30=' // CryptoJS.AES.encrypt('check', secretKey).toString();
const FOLDERS_TO_OPEN = ['', 'Bookmarks bar', 'Other bookmarks'];
const PAGE_SIZE = 1000;
const debug = false;

// Function to decrypt secrets
function decryptSecret(encryptedText, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Prompt user for password and decrypt secrets
function getSecrets() {
  const password = prompt('Enter the decryption password:');
  const secretKey = password; // Use the password as the key for simplicity
  
  // Try decrypting; if decryptSecret errors the password is wrong
  try {
    API_URL = decryptSecret(ENCRYPTED_API_URL, secretKey);
    API_KEY = decryptSecret(ENCRYPTED_API_KEY, secretKey);
  } catch {
    alert('wrong password');
    throw new Error('wrong password');
  }
  // If the test decryption is not 'check' the password is wrong
  if(decryptSecret(PASSWORD_TEST, secretKey) !== 'check') {
    alert('wrong password');
    throw new Error('wrong password');
  }
}

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

getSecrets();

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

