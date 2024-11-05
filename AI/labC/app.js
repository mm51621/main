document.addEventListener('DOMContentLoaded', function() {
    // Mapbox Access Token
    var mapboxAccessToken = 'pk.eyJ1IjoibW01MTYyMSIsImEiOiJjbTM0cHEybmYwMmM1MmlzZjhqY3NpZ2diIn0.1RB3SAOoysJpjX5fMJ4buA'; // klucz API

    // Stały styl mapy satelitarnej
    var currentStyle = 'satellite-v9';

    // Inicjalizacja mapy z domyślnym widokiem
    var map = L.map('map').setView([52.2297, 21.0122], 13); // Warszawa

    // Dodanie warstwy Mapbox z mapą satelitarną
    var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/' + currentStyle + '/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        attribution: '© Mapbox © OpenStreetMap',
        tileSize: 512,
        zoomOffset: -1,
        crossOrigin: true
    }).addTo(map);

    var fragmentsData = []; // Przechowywanie danych fragmentów

    // Sprawdzenie i żądanie pozwolenia na wyświetlanie notyfikacji
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Nasłuchiwanie na kliknięcie przycisku "Moja lokalizacja"
    document.getElementById('locate-button').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updateMapPosition, showError);
        } else {
            alert("Twoja przeglądarka nie obsługuje Geolocation API.");
        }
    });

    function updateMapPosition(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.setView([lat, lon], 13);
    }

    // Nasłuchiwanie na kliknięcie przycisku "Pobierz Mapę"
    document.getElementById('download-map-button').addEventListener('click', function() {
        // Resetowanie puzzli
        resetPuzzle();

        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error(err);
                alert("Wystąpił błąd podczas pobierania mapy.");
                return;
            }

            splitAndDisplayMap(canvas);
        });
    });

    function resetPuzzle() {
        // Wyczyść fragmenty po lewej i prawej stronie
        var leftPlaceholders = document.querySelectorAll('#left-fragments .fragment-placeholder');
        var rightPlaceholders = document.querySelectorAll('#right-fragments .fragment-placeholder');

        leftPlaceholders.forEach(function(placeholder) {
            placeholder.innerHTML = '';
        });

        rightPlaceholders.forEach(function(placeholder) {
            placeholder.innerHTML = '';
        });

        // Wyczyść komórki siatki
        var gridItems = document.querySelectorAll('#grid-container .grid-item');
        gridItems.forEach(function(cell) {
            cell.innerHTML = '';
        });

        // Wyczyść dane fragmentów
        fragmentsData = [];
    }

    function splitAndDisplayMap(canvas) {
        var fragmentWidth = canvas.width / 4;
        var fragmentHeight = canvas.height / 4;
        fragmentsData = []; // Resetowanie danych fragmentów

        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                var fragmentCanvas = document.createElement('canvas');
                fragmentCanvas.width = fragmentWidth;
                fragmentCanvas.height = fragmentHeight;
                var ctx = fragmentCanvas.getContext('2d');

                ctx.drawImage(
                    canvas,
                    x * fragmentWidth,
                    y * fragmentHeight,
                    fragmentWidth,
                    fragmentHeight,
                    0,
                    0,
                    fragmentWidth,
                    fragmentHeight
                );

                var dataURL = fragmentCanvas.toDataURL();
                fragmentsData.push({
                    dataURL: dataURL,
                    correctCellId: 'cell-' + (y * 4 + x) // Poprawna komórka dla fragmentu
                });
            }
        }

        // Mieszanie fragmentów
        shuffleArray(fragmentsData);

        var leftPlaceholders = document.querySelectorAll('#left-fragments .fragment-placeholder');
        var rightPlaceholders = document.querySelectorAll('#right-fragments .fragment-placeholder');

        fragmentsData.forEach(function(fragmentData, index) {
            var img = document.createElement('img');
            img.src = fragmentData.dataURL;
            img.id = 'fragment-' + index;

            var fragmentDiv = document.createElement('div');
            fragmentDiv.classList.add('fragment');
            fragmentDiv.appendChild(img);

            // Dodanie obsługi przeciągania
            addDragAndDropToFragment(fragmentDiv);

            if (index < 8) {
                var placeholder = leftPlaceholders[index];
                placeholder.innerHTML = '';
                placeholder.appendChild(fragmentDiv);
            } else {
                var placeholder = rightPlaceholders[index - 8];
                placeholder.innerHTML = '';
                placeholder.appendChild(fragmentDiv);
            }
        });
    }

    // Funkcja do mieszania tablicy
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Obsługa przeciągania
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        event.target.classList.add('over');
    }

    function handleDragLeave(event) {
        event.target.classList.remove('over');
    }

    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('over');

        var fragmentId = event.dataTransfer.getData('text/plain');
        var fragment = document.getElementById(fragmentId);

        // Sprawdzenie, czy element docelowy jest komórką siatki lub placeholderem
        if (event.target.classList.contains('grid-item') || event.target.classList.contains('fragment-placeholder')) {
            // Sprawdzenie, czy miejsce docelowe jest puste lub przeciągamy fragment z niego samego
            if (event.target.children.length === 0 || fragment.parentNode.parentNode === event.target) {
                // Usunięcie fragmentu z poprzedniego rodzica
                if (fragment && fragment.parentNode) {
                    fragment.parentNode.parentNode.removeChild(fragment.parentNode);
                }

                // Dodanie fragmentu do nowego miejsca
                event.target.appendChild(fragment.parentNode);

                // Sprawdzenie, czy puzzle są ułożone poprawnie
                checkPuzzleCompletion();
            } else {
                alert('To miejsce jest już zajęte.');
            }
        }
    }

    function addDragAndDropToFragment(fragment) {
        fragment.draggable = true;
        fragment.addEventListener('dragstart', handleDragStart);
    }

    // Dodanie obsługi zdarzeń dla komórek siatki
    var gridItems = document.querySelectorAll('#grid-container .grid-item');
    gridItems.forEach(function(cell) {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('dragenter', handleDragEnter);
        cell.addEventListener('dragleave', handleDragLeave);
        cell.addEventListener('drop', handleDrop);
    });

    // Dodanie obsługi zdarzeń dla placeholderów
    var placeholders = document.querySelectorAll('.fragment-placeholder');
    placeholders.forEach(function(placeholder) {
        placeholder.addEventListener('dragover', handleDragOver);
        placeholder.addEventListener('dragenter', handleDragEnter);
        placeholder.addEventListener('dragleave', handleDragLeave);
        placeholder.addEventListener('drop', handleDrop);
    });

    function checkPuzzleCompletion() {
        var isComplete = true;

        gridItems.forEach(function(cell) {
            var fragmentImg = cell.querySelector('img');
            if (fragmentImg) {
                var fragmentIndex = parseInt(fragmentImg.id.replace('fragment-', ''));
                var correctCellId = fragmentsData[fragmentIndex].correctCellId;
                if (cell.id !== correctCellId) {
                    isComplete = false;
                }
            } else {
                isComplete = false;
            }
        });

        if (isComplete) {
            // Wyświetlenie systemowej notyfikacji
            showSystemNotification();
            //Do konsoli, do sprawdzenia
            console.log('Gratulacje, puzzle zostały poprawnie ułożone!');
        }
    }

    function showSystemNotification() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Gratulacje, puzzle ułożone!');
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        new Notification('Gratulacje, puzzle ułożone!');
                    }
                });
            }
        } else {
            alert('Gratulacje, puzzle ułożone!');
        }
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("Proszę zezwolić na dostęp do lokalizacji.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Informacje o lokalizacji są niedostępne.");
                break;
            case error.TIMEOUT:
                alert("Przekroczono limit czasu żądania lokalizacji.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Wystąpił nieznany błąd.");
                break;
        }
    }
});
