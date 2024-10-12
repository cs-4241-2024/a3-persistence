window.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('gameList');
    const addGameBtn = document.getElementById('add-game');
    const showGamesBtn = document.getElementById('show-games');
    const logoutBtn = document.getElementById('logout');
    const gameFormTemplate = document.getElementById('game-form-template').content;

    // Fetch and display games
    async function fetchGames() {
        try {
            const response = await fetch('/getGames', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Failed to fetch games');
            const games = await response.json();
            displayGames(games);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }

    // Display games in the list
    function displayGames(games) {
        gameList.innerHTML = '';
        games.forEach(game => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    <h5>${game.opponent} - ${new Date(game.gameDate).toLocaleDateString()} at ${game.location}</h5>
                </div>
                <button class="btn btn-danger btn-sm delete-game" data-id="${game._id}">Delete</button>
            `;
            gameList.appendChild(listItem);
        });

        document.querySelectorAll('.delete-game').forEach(button => {
            button.addEventListener('click', async (e) => {
                const gameId = e.target.getAttribute('data-id');
                await deleteGame(gameId);
                fetchGames();
            });
        });
    }

    // Delete a game
    async function deleteGame(gameId) {
        try {
            const response = await fetch('/deleteGame', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: gameId })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Game deleted successfully:', result);
            } else {
                console.error('Failed to delete game');
            }
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    }

    // Show the game form
    function showGameForm() {
        const formClone = gameFormTemplate.cloneNode(true);
        const form = formClone.querySelector('form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newGame = {
                opponent: form.opponent.value,
                gameDate: form.gameDate.value,
                location: form.location.value
            };

            try {
                const response = await fetch('/addGame', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newGame)
                });

                if (!response.ok) throw new Error('Failed to add game');

                fetchGames();
                form.remove();
            } catch (error) {
                console.error('Error adding game');
            }
        });

        form.querySelector('#cancelGame').addEventListener('click', () => form.remove());

        gameList.insertAdjacentElement('beforebegin', form);
    }

    // Event listeners
    addGameBtn.addEventListener('click', showGameForm);
    showGamesBtn.addEventListener('click', fetchGames);
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/index.html';
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    // Fetch and display games on page load
    fetchGames();
});
