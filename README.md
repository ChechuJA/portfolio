# Comic Artist Portfolio

A customizable, static portfolio website designed for illustrators and comic artists. Built with vanilla HTML, CSS, and JavaScript.

## 🌟 Features

*   **Dynamic Content**: All artwork, posts, and products are loaded from JSON files.
*   **No Build Step**: Just open `index.html` or host on GitHub Pages.
*   **Responsive**: Mobile-first design that looks great on any device.
*   **Dark/Light Mode**: User preference saved in local storage.
*   **Gallery Filtering**: Filter artworks by category (Sketches, Ink, Color, etc.).
*   **Modal Viewer**: Full-screen image viewer with keyboard navigation.
*   **SEO Friendly**: Basic meta tagging and semantic HTML.

## 📂 Folder Structure

```
/
├── index.html          # Main entry point
├── /css/
│   └── styles.css      # All styling
├── /js/
│   └── script.js       # Logic for loading data and interactivity
├── README.md           # This file
├── /data/
│   ├── artworks.json   # Artwork definitions
│   ├── posts.json      # Devlog posts
│   └── products.json   # Store items
└── /assets/
    ├── /artworks/      # Place your artwork images here
    └── /posts/         # Images for blog posts
```

## 🚀 How to Add Content

### Adding Artwork
1.  Upload your image to `/assets/artworks/`.
2.  Open `/data/artworks.json`.
3.  Add a new entry to the array:

```json
{
  "id": "unique-id-for-url",
  "title": "My Awesome Art",
  "description": "Description of the piece.",
  "image": "assets/artworks/my-image.jpg",
  "categories": ["color", "character"],
  "date": "2024-02-06",
  "tools": ["Procreate"]
}
```

*   **categories**: Available tags are `sketches`, `ink`, `color`, `comics`, `character`. You can add more but need to update the buttons in `index.html`.

### Adding Devlog Posts
1.  Open `/data/posts.json`.
2.  Add a new object:

```json
{
  "id": "post-id",
  "title": "Update Title",
  "date": "2024-02-06",
  "content": "Write your content here. Double newline for new paragraph.\n\nLike this."
}
```

### Adding Store Items
1.  Open `/data/products.json`.
2.  Add a new item:

```json
{
  "id": "item-id",
  "name": "Art Print",
  "price": "$25.00",
  "image": "path/to/image.jpg",
  "link": "https://gumroad.com/..."
}
```

## 🛠 Customization

### Colors & Fonts
Open `styles.css` and modify the `:root` variables at the top to change the theme colors (e.g., `--accent-color`).

```css
:root {
    --accent-color: #ff3e3e; /* Change this! */
}
```

## 🌐 How to Deploy on GitHub Pages

1.  Push this repository to GitHub.
2.  Go to the repository **Settings**.
3.  Click on **Pages** in the left sidebar.
4.  Under **Build and deployment**, select **Source** -> **Deploy from a branch**.
5.  Select **main** (or master) branch and root `/` folder.
6.  Click **Save**.
7.  Wait a minute, and your site will be live at `https://[username].github.io/[repo-name]/`.

## 📝 License

This project is open source. Feel free to use it for your own portfolio!
