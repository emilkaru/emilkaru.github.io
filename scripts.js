const scrollUpButton = document.getElementById("scrollUpButton");

async function constructList() {
    const storyContainer = document.getElementById("storyContainer");
    let output = "";
    try {
        const storyInfo = await loadJSON("story.json");

        for (const event of storyInfo) {
            // Create a container for each event
            output += "<div class='eventBlock'>";

            // Extract and render sections based on the `layout`
            const layout = event.layout;
            const texts = event.text;
            const metadata = event.metadata;

            try {
                layout.forEach((sectionType, index) => {
                    switch (sectionType) {
                        case "title":
                            output += `<p class="title">${texts[index]}</p>`;
                            break;

                        case "paragraph":
                            output += `<p class="paragraph">${texts[index]}</p>`;
                            break;

                        case "images":
                            // Get images from metadata and their descriptions from `texts[index]`
                            const imageDescriptions = texts[index];
                            const images = metadata[index];
                            var temp_output = `<div class="imageGallery">`;
                            images.forEach((imagePath, imgIndex) => {
                                temp_output += `
                                    <div class="imageWrapper" onClick="showOverlay(\`${imagePath}\`)">
                                        <img src="${imagePath}" alt="${imageDescriptions[imgIndex]}">
                                        <p class="description">${imageDescriptions[imgIndex]}</p>
                                    </div>`;
                            });
                            temp_output += `</div>`;
                            output += temp_output;
                            break;

                        case "bulletPoints":
                            // Get images from metadata and their descriptions from `texts[index]`
                            const points = texts[index];
                            output += `<ul class="bullets">`;
                            points.forEach((point) => {
                                output += `<li class="bullet">${point}</li>`;
                            })
                            output += `</ul>`;
                            break;

                        default:
                            output += `<p>Unknown section type: ${sectionType}</p>`;
                    }
                });
            } catch (err) {
                output += `<p class="err">Error: ${err}</p>`;
                output += `<p class="err">Kui pärast lehekülje taaslaadimist on seda ikka näha, siis palun kirjusta probleemist e-mailile emilkaru4@gmail.com</p>`;
            }

            output += "</div>";
        }
    } catch (err) {
        output += `<p class="err">Error: ${err}</p>`;
        output += `<p class="err">Kui pärast lehekülje taaslaadimist on seda ikka näha, siis palun kirjusta probleemist e-mailile emilkaru4@gmail.com</p>`;
    } finally {
        storyContainer.innerHTML = output;
    }
}


async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

function showOverlay(imagePath) {
    document.getElementById("overlayImage").src = imagePath;
    document.getElementById("imageOverlayWrapper").style.visibility = "visible";
}

function hideOverlay() {
    document.getElementById("imageOverlayWrapper").style.visibility = "hidden";
}

function checkScrollState() {
    scrollUpButton.hidden = window.scrollY <= 500;
}

document.addEventListener("DOMContentLoaded", () => {constructList()});
document.addEventListener("scrollend", checkScrollState);