// Dados dos treinos
const trainingData = {
    A: {
        name: "Treino A - Escalas e Arpejos",
        exercises: [
            {
                name: "Escala Pentatônica",
                description: "Pratique a escala pentatônica em todas as posições",
                duration: 300 // 5 minutos em segundos
            },
            {
                name: "Arpejos Maiores",
                description: "Pratique arpejos maiores em diferentes tonalidades",
                duration: 300 // 5 minutos
            },
            {
                name: "Escala Maior",
                description: "Pratique a escala maior em todas as cordas",
                duration: 420 // 7 minutos
            },
            {
                name: "Arpejos Menores",
                description: "Pratique arpejos menores em diferentes tonalidades",
                duration: 360 // 6 minutos
            },
            {
                name: "Escalas em Terças",
                description: "Pratique escalas em intervalos de terças",
                duration: 300 // 5 minutos
            }
        ]
    },
    B: {
        name: "Treino B - Acordes e Progressões",
        exercises: [
            {
                name: "Acordes Abertos",
                description: "Pratique transições entre acordes abertos",
                duration: 300 // 5 minutos
            },
            {
                name: "Acordes com Pestana",
                description: "Pratique acordes com pestana em diferentes posições",
                duration: 420 // 7 minutos
            },
            {
                name: "Progressão I-IV-V",
                description: "Pratique a progressão clássica I-IV-V",
                duration: 360 // 6 minutos
            },
            {
                name: "Progressão ii-V-I",
                description: "Pratique a progressão jazzística ii-V-I",
                duration: 420 // 7 minutos
            }
        ]
    },
    C: {
        name: "Treino C - Improvisação e Técnica",
        exercises: [
            {
                name: "Bending e Vibrato",
                description: "Pratique técnicas de bending e vibrato",
                duration: 300 // 5 minutos
            },
            {
                name: "Hammer-on e Pull-off",
                description: "Pratique ligados ascendentes e descendentes",
                duration: 300 // 5 minutos
            },
            {
                name: "Sweep Picking",
                description: "Pratique a técnica de sweep picking em arpejos",
                duration: 420 // 7 minutos
            },
            {
                name: "Improvisação em Bluess",
                description: "Improviso sobre progressão de 12 compassos de blues",
                duration: 480 // 8 minutos
            },
            {
                name: "Improvisação Modal",
                description: "Improviso utilizando modos gregos",
                duration: 420 // 7 minutos
            }
        ]
    }
};

// Elementos da DOM
const homeScreen = document.getElementById('home-screen');
const exerciseListScreen = document.getElementById('exercise-list-screen');
const exerciseScreen = document.getElementById('exercise-screen');
const finishScreen = document.getElementById('finish-screen');

const trainingTitle = document.getElementById('training-title');
const exerciseList = document.getElementById('exercise-list');
const startTrainingBtn = document.getElementById('start-training-btn');

const currentExerciseName = document.getElementById('current-exercise-name');
const exerciseDescription = document.getElementById('exercise-description');
const exerciseDuration = document.getElementById('exercise-duration');
const exerciseProgress = document.getElementById('exercise-progress');
const countdownElement = document.getElementById('countdown');
const timerElement = document.getElementById('timer');
const startExerciseBtn = document.getElementById('start-exercise-btn');
const nextExerciseBtn = document.getElementById('next-exercise-btn');

const backToHomeBtn = document.getElementById('back-to-home-btn');
const soundAlarm = document.getElementById('sound-alarm');

const trainingOptions = document.querySelectorAll('.training-option');

// Variáveis de estado
let currentTraining = null;
let currentExerciseIndex = 0;
let timerInterval = null;
let countdownInterval = null;

// Event Listeners
trainingOptions.forEach(option => {
    option.addEventListener('click', () => {
        const trainingType = option.getAttribute('data-training');
        selectTraining(trainingType);
    });
});

startTrainingBtn.addEventListener('click', startTraining);
startExerciseBtn.addEventListener('click', startExercise);
nextExerciseBtn.addEventListener('click', nextExercise);
backToHomeBtn.addEventListener('click', backToHome);

// Funções
function selectTraining(trainingType) {
    currentTraining = trainingData[trainingType];
    trainingTitle.textContent = currentTraining.name;
    
    // Preencher lista de exercícios
    exerciseList.innerHTML = '';
    currentTraining.exercises.forEach((exercise, index) => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.innerHTML = `
            <strong>${index + 1}. ${exercise.name}</strong> 
            <span>(${formatTime(exercise.duration)})</span>
        `;
        exerciseList.appendChild(exerciseItem);
    });
    
    // Mostrar tela de lista de exercícios
    homeScreen.classList.add('hidden');
    exerciseListScreen.classList.remove('hidden');
}

function startTraining() {
    currentExerciseIndex = 0;
    showExercise();
}

function showExercise() {
    const exercise = currentTraining.exercises[currentExerciseIndex];
    
    currentExerciseName.textContent = exercise.name;
    exerciseDescription.textContent = exercise.description;
    exerciseDuration.textContent = formatTime(exercise.duration);
    
    // Resetar elementos
    timerElement.textContent = formatTime(exercise.duration);
    exerciseProgress.style.width = '0%';
    countdownElement.classList.add('hidden');
    startExerciseBtn.classList.remove('hidden');
    nextExerciseBtn.classList.add('hidden');
    
    // Mostrar tela de exercício
    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.remove('hidden');
}

function startExercise() {
    const exercise = currentTraining.exercises[currentExerciseIndex];
    let countdown = 3;
    
    // Esconder botão iniciar
    startExerciseBtn.classList.add('hidden');
    
    // Mostrar countdown
    countdownElement.textContent = countdown;
    countdownElement.classList.remove('hidden');
    
    // Iniciar countdown
    countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownElement.classList.add('hidden');
            startTimer(exercise.duration);
        }
    }, 1000);
}

function startTimer(duration) {
    let timeLeft = duration;
    const totalDuration = duration;
    
    timerElement.textContent = formatTime(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Atualizar timer
        timerElement.textContent = formatTime(timeLeft);
        
        // Atualizar barra de progresso
        const progressPercentage = 100 - (timeLeft / totalDuration * 100);
        exerciseProgress.style.width = `${progressPercentage}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            soundAlarm.play();
            nextExerciseBtn.classList.remove('hidden');
        }
    }, 1000);
}

function nextExercise() {
    currentExerciseIndex++;
    
    if (currentExerciseIndex < currentTraining.exercises.length) {
        showExercise();
    } else {
        // Treino finalizado
        exerciseScreen.classList.add('hidden');
        finishScreen.classList.remove('hidden');
    }
}

function backToHome() {
    finishScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    
    // Limpar estado
    currentTraining = null;
    currentExerciseIndex = 0;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}