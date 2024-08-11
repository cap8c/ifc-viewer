export function setupUI() {
    document.addEventListener('DOMContentLoaded', () => {
        const searchBox = document.getElementById("searchBox");
        const selectButton = document.getElementById("selectButton");

        if (searchBox && selectButton) {
            searchBox.addEventListener("input", () => {
                // Your search logic here
            });

            selectButton.addEventListener("click", () => {
                // Your select button logic here
            });
        } else {
            console.error("One or more UI elements not found.");
        }
    });
}
