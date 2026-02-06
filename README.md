# Comic Illustrator Portfolio

A modern, responsive portfolio website for showcasing comic illustrations and artwork. Built with pure HTML, CSS, and JavaScript - no frameworks required! Perfect for hosting on GitHub Pages.

## ✨ Features

- **Dynamic Gallery**: All artwork is loaded from a JSON file - no HTML editing required to add new pieces
- **Category Filtering**: Filter artwork by characters, scenes, concepts, or view all
- **Lightbox Viewer**: Click any artwork to view it in full-screen with navigation
- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Easy Maintenance**: Simply edit `artwork.json` to add, remove, or update artwork
- **No Backend Required**: Pure static site, perfect for GitHub Pages

## 🚀 Quick Start

### View the Site Locally

1. Clone this repository
2. Open `index.html` in your web browser
3. That's it! No build process or dependencies needed

### Deploy to GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to deploy (usually `main`)
4. Click "Save"
5. Your site will be live at `https://[username].github.io/[repository-name]`

## 📝 Adding New Artwork

Adding new artwork is as simple as editing a JSON file! Here's how:

### Step 1: Prepare Your Image

1. Upload your artwork image to an image hosting service (like GitHub itself, Imgur, or any CDN)
2. Get the direct image URL

### Step 2: Edit artwork.json

Open `artwork.json` and add a new entry to the array:

```json
{
    "id": 10,
    "title": "Your Artwork Title",
    "description": "A detailed description of your artwork",
    "image": "https://your-image-url.com/image.jpg",
    "category": "characters",
    "date": "2024-06-15"
}
```

### Field Descriptions:

- **id**: Unique number for the artwork (increment from the last ID)
- **title**: The name/title of your artwork
- **description**: A description that appears in the lightbox view
- **image**: Direct URL to your image file
- **category**: One of: `characters`, `scenes`, or `concepts`
- **date**: Date in YYYY-MM-DD format

### Step 3: Save and Deploy

1. Save `artwork.json`
2. Commit and push to GitHub
3. Your new artwork will automatically appear on the site!

## 🎨 Customization

### Updating Site Information

Edit `index.html` to customize:

- **Site Title**: Change the `<title>` tag and `.logo` text
- **Hero Section**: Update the welcome message in the `.hero` section
- **About Section**: Modify the about text to tell your story
- **Contact Links**: Update email and social media links in the `.contact-section`

### Changing Colors

Edit `styles.css` and modify the CSS variables at the top:

```css
:root {
    --primary-color: #6366f1;  /* Main theme color */
    --secondary-color: #8b5cf6; /* Secondary accent color */
    /* ... more colors ... */
}
```

### Adding New Categories

1. Add a new filter button in `index.html`:
```html
<button class="filter-btn" data-filter="yourcategory">Your Category</button>
```

2. Use the new category name in `artwork.json`:
```json
"category": "yourcategory"
```

That's it! The filtering will work automatically.

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # Gallery functionality and interactivity
├── artwork.json        # Your artwork data (THIS IS WHERE YOU ADD NEW PIECES)
└── README.md          # This file
```

## 🛠️ Technical Details

- **No Build Process**: Just HTML, CSS, and JavaScript - edit and deploy instantly
- **No Dependencies**: No npm, webpack, or any other tools required
- **Vanilla JavaScript**: Modern ES6+ JavaScript with no frameworks
- **Responsive Grid**: CSS Grid for automatic responsive layouts
- **Lazy Loading**: Images load as needed for better performance
- **Keyboard Navigation**: Arrow keys to navigate in lightbox, Escape to close

## 🌐 Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Feel free to use this template for your own portfolio! Customize it to make it your own.

## 💡 Tips

1. **Image Optimization**: Compress your images before uploading (use tools like TinyPNG)
2. **Consistent Sizing**: Try to keep artwork images at similar aspect ratios for a clean grid
3. **Descriptive Titles**: Use clear, descriptive titles that help viewers understand your work
4. **Regular Updates**: Keep your portfolio fresh by adding new artwork regularly
5. **Backup artwork.json**: Keep a backup of your artwork.json file before making changes

## 🐛 Troubleshooting

**Images not loading?**
- Check that image URLs are direct links (not webpage links)
- Ensure images are publicly accessible
- Try opening the image URL directly in your browser

**Gallery not displaying?**
- Make sure `artwork.json` is valid JSON (use a JSON validator)
- Check browser console for error messages (F12)
- Ensure all commas are in the right places in the JSON

**Filters not working?**
- Verify category names in `artwork.json` match the filter buttons exactly
- Category names are case-sensitive

## 📧 Questions?

If you have questions about using this portfolio template, feel free to open an issue on GitHub!

---

Made with ❤️ for comic illustrators and artists everywhere