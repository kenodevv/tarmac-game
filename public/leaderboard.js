document.getElementById("leaderboard-btn").addEventListener("click", function(){
    if(document.getElementById("leaderboard").style.display != "none"){
        refreshLeaderboard()
    }    
})


var hilfsjson = [];

function refreshLeaderboard(){
    var newUsername;
    if(localStorage.getItem('username') != null){
        newUsername = localStorage.getItem('username')
    }else{
        document.getElementById('you_stats').style.display = "none"
        newUsername = '@kenodev'
    }

    if(hilfsjson == ''){
        fetch(`/leaderboard/${newUsername}`, {
            method: 'GET',
            mode: "cors",
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then(async function(response) {
            const responseBody = await response.json();
            hilfsjson = responseBody;
            
            // Extrahiere die Daten aus der Serverantwort
            const leaderboardData = responseBody.leaderboard.slice(0, 10); // Nur die ersten 10 Einträge des Leaderboards
            const playerData = responseBody.player;
            const positionData = responseBody.position;
            
            // Verarbeite die Leaderboard-Daten
            leaderboardData.forEach((entry, index) => {
                const username = entry.username;
                const score = entry.score;
            
                // Finde die entsprechenden Elemente mit den Klassen "username" und "score"
                const usernameElement = document.getElementsByClassName("name")[index]
                const scoreElement = document.getElementsByClassName("score")[index]
                
                if (usernameElement && scoreElement) {
                    // Setze die Werte der Namen und Scores in die Elemente ein
                    usernameElement.textContent = username;
                    scoreElement.textContent = score;
                }
            });

            if(localStorage.getItem('username') != null){
                document.getElementById('you_stats').style.display = ""
                document.getElementById("you_name").textContent = playerData.username + " ( YOU )";
                document.getElementById("you_score").textContent = playerData.score;
                document.getElementById("you_number").textContent = positionData + ".";

            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    }else{
        responseBody = hilfsjson
        const leaderboardData = responseBody.leaderboard.slice(0, 10); // Nur die ersten 10 Einträge des Leaderboards
        const playerData = responseBody.player;
        const positionData = responseBody.position;
        
        // Verarbeite die Leaderboard-Daten
        leaderboardData.forEach((entry, index) => {
            const username = entry.username;
            const score = entry.score;
        
            // Finde die entsprechenden Elemente mit den Klassen "username" und "score"
            const usernameElement = document.getElementsByClassName("name")[index]
            const scoreElement = document.getElementsByClassName("score")[index]
            
            if (usernameElement && scoreElement) {
                // Setze die Werte der Namen und Scores in die Elemente ein
                usernameElement.textContent = username;
                scoreElement.textContent = score;
            }
        });

        if(localStorage.getItem('username') != null){
            document.getElementById('you_stats').style.display = ""
            document.getElementById("you_name").textContent = playerData.username + " ( YOU )";
            document.getElementById("you_score").textContent = playerData.score;
            document.getElementById("you_number").textContent = positionData + ".";

        }

        // Setze die Daten des aktuellen Spielers und die Position
    }

    fetch(`/leaderboard/${localStorage.getItem('username')}`, {
        method: 'GET',
        mode: "cors",
        headers: {
        'Content-Type': 'application/json',
        },
    })
    .then(async function(response) {
        const responseBody = await response.json();

        if(hilfsjson!=responseBody){
        
            // Extrahiere die Daten aus der Serverantwort
            const leaderboardData = responseBody.leaderboard.slice(0, 10); // Nur die ersten 10 Einträge des Leaderboards
            const playerData = responseBody.player;
            const positionData = responseBody.position;
            
            // Verarbeite die Leaderboard-Daten
            leaderboardData.forEach((entry, index) => {
                const username = entry.username;
                const score = entry.score;
            
                // Finde die entsprechenden Elemente mit den Klassen "username" und "score"
                const usernameElement = document.getElementsByClassName("name")[index]
                const scoreElement = document.getElementsByClassName("score")[index]
                
                if (usernameElement && scoreElement) {
                    // Setze die Werte der Namen und Scores in die Elemente ein
                    usernameElement.textContent = username;
                    scoreElement.textContent = score;
                }
            });

            if(localStorage.getItem('username') != null){
                document.getElementById('you_stats').style.display = ""
                document.getElementById("you_name").textContent = playerData.username + " ( YOU )";
                document.getElementById("you_score").textContent = playerData.score;
                document.getElementById("you_number").textContent = positionData + ".";

            }
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
    

    
}