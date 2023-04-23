const imageMetadata = [
	
	{
        name: 'cat1', // WHAT THE NAME OF THE IMAGE IS (DOES NOT HAVE TO BE FILENAME)
		type: 'Cats', // WHAT HEADING THE IMAGE WILL GO UNDER
        tags: ['cat', 'snow', 'cute'], // INSERT TAGS FOR SEARCHING
        url: 'images/cat.jpg', // INSERT IMAGE SOURCE
		customLink: 'images/cat.jpg', // INSERT A LINK FOR THE IMAGE (WHERE THE IMAGE CAN BE LOADED)
		alt: "A cute kitten sat in the snow" // INSERT ALT TEXT HERE
    },
	{
        name: 'dog1', // WHAT THE NAME OF THE IMAGE IS (DOES NOT HAVE TO BE FILENAME)
		type: 'Dogs', // WHAT HEADING THE IMAGE WILL GO UNDER
        tags: ['dog', 'cute'], // INSERT TAGS FOR SEARCHING
        url: 'images/dog.jpg', // INSERT IMAGE SOURCE
		customLink: 'images/cat.jpg', // INSERT A LINK FOR THE IMAGE (WHERE THE IMAGE CAN BE LOADED)
		alt: "A cute dog" // INSERT ALT TEXT HERE
    },
	{
        name: 'rabbit1', // WHAT THE NAME OF THE IMAGE IS (DOES NOT HAVE TO BE FILENAME)
		type: 'Rabbits', // WHAT HEADING THE IMAGE WILL GO UNDER
        tags: ['rabbit', 'snow'], // INSERT TAGS FOR SEARCHING
        url: 'images/rabbit.jpg', // INSERT IMAGE SOURCE
		customLink: 'images/cat.jpg', // INSERT A LINK FOR THE IMAGE (WHERE THE IMAGE CAN BE LOADED)
		alt: "A rabbit sat in the snow" // INSERT ALT TEXT HERE
    }
	
	// Add more of these below
	
];

const searchInput = document.getElementById('search-bar');
const imageContainer = document.getElementById('image-container');

function performSearch(tags) {
    const filteredImages = filterImagesByTag(imageMetadata, tags);

    // Clear existing images from container
    imageContainer.innerHTML = '';

    // Group images by type
    const groupedImages = {};
    filteredImages.forEach(image => {
        if (!groupedImages[image.type]) {
            groupedImages[image.type] = [];
        }
        groupedImages[image.type].push(image);
    });

    // Loop through grouped images and create a "grid-item" for each group
    Object.keys(groupedImages).forEach(type => {
        const imagesOfType = groupedImages[type];
        if (imagesOfType.length > 0) {
            const headingElement = document.createElement('h2');
            headingElement.id = type.toLowerCase();
            headingElement.textContent = type;
            imageContainer.appendChild(headingElement);

            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            imagesOfType.forEach(image => {
                const thumbElement = document.createElement('span');
                thumbElement.classList.add('thumb');
                const imageElement = document.createElement('img');
                imageElement.src = image.url;
                imageElement.alt = image.alt;
                imageElement.classList.add('preview');
                const linkElement = document.createElement('a');
                linkElement.target = '_blank';
                linkElement.href = image.customLink;
                linkElement.appendChild(imageElement);
                thumbElement.appendChild(linkElement);
                gridItem.appendChild(thumbElement);
            });
            imageContainer.appendChild(gridItem);
        }
    });

    // If no images match the search query, display a message
    if (filteredImages.length === 0) {
        const messageElement = document.createElement('p');
        messageElement.textContent = 'No images found';
        imageContainer.appendChild(messageElement);
    }
}

function filterImagesByTag(images, tags) {
    if (!tags) {
        // Return all images if tags is not specified
        return images;
    }

    const tagArray = tags.split(' ').map(tag => tag.trim().toLowerCase());

    // Filter images by tags
    const filteredImages = images.filter((image) => {
        return tagArray.every((tag) => {
            return image.tags.some((imageTag) => {
                return imageTag.toLowerCase().includes(tag);
            });
        });
    });

    return filteredImages;
}

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const searchQuery = event.target.value.toLowerCase();
        performSearch(searchQuery);

        // Store the search query in session storage
        sessionStorage.setItem('searchQuery', searchQuery);

        // Update the URL with the new search query
        const newQueryString = `?tags=${encodeURIComponent(searchQuery)}`;
        window.history.pushState({}, '', newQueryString);
    }
});

// Check for stored search query on page load
const storedSearchQuery = sessionStorage.getItem('searchQuery');

if (storedSearchQuery) {
    // Pre-fill the search box with the stored search query
    searchInput.value = storedSearchQuery;

    // Perform a search with the stored search query
    performSearch(storedSearchQuery);
}
