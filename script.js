const trainingData = {
    A: {
        name: "Treino A - Escalas e Arpejos",
        exercises: [
            {
                name: "Escala Pentatônica",
                description: "Pratique a escala pentatônica em todas as posições",
                duration: 300 
            },
            {
                name: "Arpejos Maiores",
                description: "Pratique arpejos maiores em diferentes tonalidades",
                duration: 300 
            },
            {
                name: "Escala Maior",
                description: "Pratique a escala maior em todas as cordas",
                duration: 420 
            },
            {
                name: "Arpejos Menores",
                description: "Pratique arpejos menores em diferentes tonalidades",
                duration: 360 
            },
            {
                name: "Escalas em Terças",
                description: "Pratique escalas em intervalos de terças",
                duration: 300 
            }
        ]
    },
    B: {
        name: "Treino B - Acordes e Progressões",
        exercises: [

            {
                name: "Acordes Abertos",
                description: "Pratique transições entre acordes abertos",
                duration: 300 
            },
            {
                name: "Acordes com Pestana",
                description: "Pratique acordes com pestana em diferentes posições",
                duration: 420 
            },
            {
                name: "Progressão I-IV-V",
                description: "Pratique a progressão clássica I-IV-V",
                duration: 360 
            },
            
            {
                name: "Progressão ii-V-I",
                description: "Pratique a progressão jazzística ii-V-I",
                duration: 420 
            },
        ]
    },
    C: {
        name: "Treino C - Improvisação e Técnica",
        exercises: [
            {
                name: "Bending e Vibrato",
                description: "Pratique técnicas de bending e vibrato",
                duration: 300 
            },
            {
                name: "Hammer-on e Pull-off",
                description: "Pratique ligados ascendentes e descendentes",
                duration: 300 
            },
            {
                name: "Sweep Picking",
                description: "Pratique a técnica de sweep picking em arpejos",
                duration: 420 
            },
            {
                name: "Improvisação em Bluess",
                description: "Improviso sobre progressão de 12 compassos de blues",
                duration: 480 
            },
            {
                name: "Improvisação Modal",
                description: "Improviso utilizando modos gregos",
                duration: 420 
            }
        ]
    }
};


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


let currentTraining = null;
let currentExerciseIndex = 0;
let timerInterval = null;
let countdownInterval = null;


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


function selectTraining(trainingType) {
    currentTraining = trainingData[trainingType];
    trainingTitle.textContent = currentTraining.name;
    

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
    

    timerElement.textContent = formatTime(exercise.duration);
    exerciseProgress.style.width = '0%';
    countdownElement.classList.add('hidden');
    startExerciseBtn.classList.remove('hidden');
    nextExerciseBtn.classList.add('hidden');
    

    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.remove('hidden');
}

function startExercise() {
    const exercise = currentTraining.exercises[currentExerciseIndex];
    let countdown = 3;
    

    startExerciseBtn.classList.add('hidden');
    

    countdownElement.textContent = countdown;
    countdownElement.classList.remove('hidden');
    

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
        

        timerElement.textContent = formatTime(timeLeft);
        

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

        exerciseScreen.classList.add('hidden');
        finishScreen.classList.remove('hidden');
    }
}

function backToHome() {
    finishScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    

    currentTraining = null;
    currentExerciseIndex = 0;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


let metronomeInterval = null;
let currentBeat = 0;
let isMetronomeActive = false;


const metronomeControls = document.querySelector('.metronome-controls');
const metronomeBpmInput = document.getElementById('metronome-bpm');
const metronomeTimeSignatureSelect = document.getElementById('metronome-time-signature');
const metronomeStartBtn = document.getElementById('metronome-start');
const metronomeStopBtn = document.getElementById('metronome-stop');
const metronomeSound = document.getElementById('metronome-sound');
const metronomeFirstBeatSound = document.getElementById('metronome-sound-first');
const beatIndicator = document.createElement('div');
beatIndicator.className = 'metronome-beat-indicator';


metronomeControls.appendChild(beatIndicator);


metronomeStartBtn.addEventListener('click', startMetronome);
metronomeStopBtn.addEventListener('click', stopMetronome);


function createBeatIndicator(beats) {
    beatIndicator.innerHTML = '';
    for (let i = 0; i < beats; i++) {
        const dot = document.createElement('div');
        dot.className = 'beat-dot';
        dot.textContent = i + 1;
        
//        if (i === 0) {
//        dot.classList.add('strong');
//        }
        
        beatIndicator.appendChild(dot);
    }
}

function updateBeatIndicator(beat) {
    const dots = beatIndicator.querySelectorAll('.beat-dot');
    dots.forEach((dot, index) => {

        dot.classList.remove('active');
        
        if (index === beat) {
            dot.classList.add('active');
        }
    });
}

function startMetronome() {
    if (isMetronomeActive) return;
    
    const bpm = parseInt(metronomeBpmInput.value) || 120;
    const timeSignature = parseInt(metronomeTimeSignatureSelect.value) || 4;
    const interval = 60000 / bpm; 
    
    isMetronomeActive = true;
    currentBeat = 0;
    
    createBeatIndicator(timeSignature);
    updateBeatIndicator(currentBeat);
    
    metronomeFirstBeatSound.currentTime = 0;
    metronomeFirstBeatSound.play();
    
    metronomeInterval = setInterval(() => {
        currentBeat = (currentBeat + 1) % timeSignature;
        updateBeatIndicator(currentBeat);
        
        if (currentBeat === 0) {
            metronomeFirstBeatSound.currentTime = 0;
            metronomeFirstBeatSound.play();
        } else {
            metronomeSound.currentTime = 0;
            metronomeSound.play();
        }
    }, interval);
    
    metronomeStartBtn.classList.add('hidden');
    metronomeStopBtn.classList.remove('hidden');
}

function stopMetronome() {
    if (!isMetronomeActive) return;
    
    clearInterval(metronomeInterval);
    isMetronomeActive = false;
    
    metronomeStartBtn.classList.remove('hidden');
    metronomeStopBtn.classList.add('hidden');
    
    const dots = beatIndicator.querySelectorAll('.beat-dot');
    dots.forEach(dot => dot.classList.remove('active'));
}

function showExercise() {
    const exercise = currentTraining.exercises[currentExerciseIndex];
    
    currentExerciseName.textContent = exercise.name;
    exerciseDescription.textContent = exercise.description;
    exerciseDuration.textContent = formatTime(exercise.duration);
    
    timerElement.textContent = formatTime(exercise.duration);
    exerciseProgress.style.width = '0%';
    countdownElement.classList.add('hidden');
    startExerciseBtn.classList.remove('hidden');
    nextExerciseBtn.classList.add('hidden');
    
    const showMetronome = exercise.name.includes('Escala') || 
                         exercise.name.includes('Arpejo') || 
                         exercise.name.includes('Progressão');
    
    if (showMetronome) {
        metronomeControls.classList.remove('hidden');
        stopMetronome();
    } else {
        metronomeControls.classList.add('hidden');
        stopMetronome();
    }
    
    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.remove('hidden');
}

function nextExercise() {
    stopMetronome();
    
    currentExerciseIndex++;
    
    if (currentExerciseIndex < currentTraining.exercises.length) {
        showExercise();
    } else {

        exerciseScreen.classList.add('hidden');
        finishScreen.classList.remove('hidden');
    }
}


function backToHome() {

    stopMetronome();
    
    finishScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    

    currentTraining = null;
    currentExerciseIndex = 0;
}