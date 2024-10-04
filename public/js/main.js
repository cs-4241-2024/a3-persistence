window.addEventListener('DOMContentLoaded', () => {

    const gameList = document.getElementById('gameList');
    const addGameBtn = document.getElementById('add-game');
    const showGamesBtn = document.getElementById('show-games'); // Show games button
    const logoutBtn = document.getElementById('logout');
    const gameFormTemplate = document.getElementById('game-form-template').content;

    // Function to fetch games from the backend and display them
    async function fetchGames() {
        try {
            const response = await fetch('/getGames');
            if (!response.ok) throw new Error('Failed to fetch games');
            const games = await response.json();
            displayGames(games);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }

    // Function to display games in the list
    function displayGames(games) {
        gameList.innerHTML = ''; // Clear current list
        games.forEach(game => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <h5>${game.opponent} - ${new Date(game.gameDate).toLocaleDateString()} at ${game.location}</h5>
            `;
            gameList.appendChild(listItem);
        });
    }

    // Function to show the game form
    function showGameForm() {
        const formClone = gameFormTemplate.cloneNode(true);
        const form = formClone.querySelector('form');

        // Handle form submission for adding a new game
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newGame = {
                opponent: form.opponent.value,
                gameDate: form.gameDate.value,
                location: form.location.value
            };

            try {
                const response = await fetch('/addGame', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newGame)
                });

                if (!response.ok) throw new Error('Failed to add game');

                // After adding the game, fetch and display updated games list
                fetchGames();
                form.remove(); // Remove the form after submission
            } catch (error) {
                console.error('Error adding game:', error);
            }
        });

        // Handle cancel button
        form.querySelector('#cancelGame').addEventListener('click', () => {
            form.remove(); // Simply remove the form if canceled
        });

        gameList.insertAdjacentElement('beforebegin', form); // Insert the form above the game list
    }

    // Event listener to show the form when 'Add Game' is clicked
    addGameBtn.addEventListener('click', () => {
        showGameForm();
    });

    // Event listener to fetch and display games when 'Show Games' is clicked
    showGamesBtn.addEventListener('click', () => {
        fetchGames();
    });

    // Event listener for logout button
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/index.html'; // Redirect to the login page
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

});


// Fetch and display games when the page loads
showGamesBtn.addEventListener('click', () => {
    fetchGames();
});
