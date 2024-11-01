// Pobieranie elementów z DOM
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const searchBar = document.getElementById('searchBar');

// Tablica przechowująca zadania
let tasks = [];

// Funkcja inicjalizująca aplikację
function init() {
    // Ładowanie zadań z localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(task => renderTask(task));
    }
}

// Funkcja zapisywania zadań do localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkcja renderująca pojedyncze zadanie na liście
function renderTask(task) {
    // Tworzenie nowego elementu listy
    const li = document.createElement('li');

    // Tworzenie elementu z treścią zadania
    const taskContent = document.createElement('span');
    taskContent.className = 'task-content';

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskTextSpan.className = 'task-text';

    taskContent.appendChild(taskTextSpan);

    // Opcjonalnie dodaj datę, jeśli jest podana
    let dateContent;
    if (task.date) {
        dateContent = document.createElement('span');
        dateContent.className = 'task-date';

        const [year, month, day] = task.date.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        dateContent.textContent = ` - ${formattedDate}`;

        // Przechowujemy oryginalną wartość daty w atrybucie danych
        dateContent.dataset.dateValue = task.date;

        taskContent.appendChild(dateContent);
    }

    // Tworzenie przycisku usuwania
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.className = 'delete-button';

    // Dodawanie elementów do listy
    li.appendChild(taskContent);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    // Dodanie funkcjonalności usuwania zadania
    deleteButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Zapobiega wywołaniu eventu kliknięcia na li
        taskList.removeChild(li);
        // Usuwanie zadania z tablicy tasks i zapisywanie zmian
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
    });

    // Dodanie funkcjonalności edycji zadania po kliknięciu na nie
    li.addEventListener('click', function () {
        // Przechowujemy oryginalną wartość daty
        let originalTaskDateValue = task.date || '';

        // Tworzenie pól input do edycji
        const editTaskInput = document.createElement('input');
        editTaskInput.type = 'text';
        editTaskInput.value = taskTextSpan.textContent;
        editTaskInput.className = 'edit-task-input';

        const editDateInput = document.createElement('input');
        editDateInput.type = 'date';
        editDateInput.className = 'edit-date-input';

        // Jeśli data istnieje, ustaw ją w polu input
        if (originalTaskDateValue) {
            editDateInput.value = originalTaskDateValue;
        }

        // Zastąpienie treści zadania polami input
        taskContent.innerHTML = '';
        taskContent.appendChild(editTaskInput);
        taskContent.appendChild(editDateInput);

        // Ustawienie focusa na polu tekstowym
        editTaskInput.focus();

        // Zatrzymanie propagacji zdarzeń kliknięcia na polach edycji
        editTaskInput.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        editDateInput.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        // Funkcja zapisująca zmiany
        function saveChanges() {
            const newTaskText = editTaskInput.value.trim();
            const newTaskDateValue = editDateInput.value;

            // Walidacja długości nazwy zadania
            if (newTaskText.length < 3) {
                alert('Nazwa zadania musi mieć przynajmniej 3 znaki.');
                return;
            }

            // Aktualizacja treści zadania
            taskTextSpan.textContent = newTaskText;

            // Sprawdzenie, czy data została zmieniona
            if (newTaskDateValue !== originalTaskDateValue) {
                if (newTaskDateValue) {
                    // Walidacja nowej daty
                    const selectedDate = new Date(newTaskDateValue);
                    const today = new Date();
                    selectedDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        alert('Data musi być z przyszłości lub nie podana.');
                        return;
                    }

                    // Aktualizacja daty zadania
                    const [year, month, day] = newTaskDateValue.split('-');
                    const formattedDate = `${day}.${month}.${year}`;
                    if (!dateContent) {
                        dateContent = document.createElement('span');
                        dateContent.className = 'task-date';
                        taskContent.appendChild(dateContent);
                    }
                    dateContent.textContent = ` - ${formattedDate}`;
                    dateContent.dataset.dateValue = newTaskDateValue;
                } else {
                    // Użytkownik usunął datę
                    if (dateContent) {
                        dateContent.textContent = '';
                        dateContent.dataset.dateValue = '';
                    }
                }
                task.date = newTaskDateValue || '';
                originalTaskDateValue = newTaskDateValue || '';
            }

            // Aktualizacja nazwy zadania w obiekcie
            task.text = newTaskText;

            // Przywrócenie pierwotnej struktury treści zadania
            taskContent.innerHTML = '';
            taskContent.appendChild(taskTextSpan);
            if (dateContent && dateContent.textContent !== '') {
                taskContent.appendChild(dateContent);
            }

            // Usunięcie nasłuchiwania na kliknięcie poza elementem
            document.removeEventListener('click', onClickOutside);

            // Aktualizacja wyszukiwania po edycji
            searchTasks(searchBar.value.trim().toLowerCase());

            // Zapisanie zmian w localStorage
            saveTasks();
        }

        // Nasłuchiwanie na kliknięcie poza polem edycji
        function onClickOutside(event) {
            if (!li.contains(event.target)) {
                saveChanges();
            }
        }

        document.addEventListener('click', onClickOutside);

        // Zapisanie zmian po utracie focusa przez oba pola
        editTaskInput.addEventListener('blur', function () {
            setTimeout(function () {
                if (document.activeElement !== editDateInput) {
                    saveChanges();
                }
            }, 0);
        });

        editDateInput.addEventListener('blur', function () {
            setTimeout(function () {
                if (document.activeElement !== editTaskInput) {
                    saveChanges();
                }
            }, 0);
        });
    });
}

// Funkcja dodająca nowe zadanie do listy
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;

    // Walidacja długości nazwy zadania
    if (taskText.length < 3) {
        alert('Nazwa zadania musi mieć przynajmniej 3 znaki.');
        return;
    }

    // Walidacja daty
    if (taskDateValue) {
        const selectedDate = new Date(taskDateValue);
        const today = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert('Data musi być z przyszłości lub nie podana.');
            return;
        }
    }

    // Tworzenie obiektu zadania
    const task = {
        id: Date.now(), // Unikalny identyfikator zadania
        text: taskText,
        date: taskDateValue || ''
    };

    // Dodanie zadania do tablicy
    tasks.push(task);

    // Renderowanie zadania na liście
    renderTask(task);

    // Zapisanie zadań w localStorage
    saveTasks();

    // Czyszczenie pól input
    taskInput.value = '';
    taskDate.value = '';
}

// Funkcja do ucieczki znaków specjalnych w wyrażeniu regularnym
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Funkcja wyszukiwania i podświetlania zadań
function searchTasks(searchString) {
    const tasksItems = taskList.getElementsByTagName('li');
    const escapedSearchString = escapeRegExp(searchString);

    for (let i = 0; i < tasksItems.length; i++) {
        const li = tasksItems[i];
        const taskContent = li.querySelector('.task-content');
        const taskTextSpan = taskContent.querySelector('.task-text');
        const taskText = taskTextSpan.textContent;

        // Usuwanie poprzedniego podświetlenia
        taskTextSpan.innerHTML = taskText;

        if (escapedSearchString === '') {
            // Pokaż wszystkie zadania, jeśli pole wyszukiwania jest puste
            li.style.display = '';
            continue;
        }

        // Sprawdzanie, czy zadanie zawiera wyszukiwany tekst
        const regex = new RegExp(`(${escapedSearchString})`, 'gi');
        if (regex.test(taskText)) {
            // Podświetlanie wszystkich dopasowań
            const highlightedText = taskText.replace(regex, '<span class="highlight">$1</span>');
            taskTextSpan.innerHTML = highlightedText;

            // Pokaż zadanie
            li.style.display = '';
        } else {
            // Ukryj zadanie
            li.style.display = 'none';
        }
    }
}

// Dodanie nasłuchiwania na kliknięcie przycisku "Dodaj zadanie"
addTaskButton.addEventListener('click', addTask);

// Dodanie nasłuchiwania na pole wyszukiwania
searchBar.addEventListener('input', function () {
    const searchString = searchBar.value.trim().toLowerCase();
    searchTasks(searchString);
});

// Inicjalizacja aplikacji
init();
