const pauseExerciseBtn = document.getElementById('pause-exercise-btn');
const resumeExerciseBtn = document.getElementById('resume-exercise-btn');
const restartExerciseBtn = document.getElementById('restart-exercise-btn');
const backToHomeBtn1 = document.getElementById('back-to-home-btn-1');
const backToHomeBtn2 = document.getElementById('back-to-home-btn-2');
const backToHomeBtn3 = document.getElementById('back-to-home-btn-3');

let isTimerPaused = false;
let timeLeft = 0;
let totalDuration = 0;

// Variáveis da Web Audio API
let audioContext;
let metronomeSoundBuffer;
let metronomeFirstBeatSoundBuffer;
let isAudioInitialized = false;

const trainingData = {
    A: {
        name: "Treino A - Escalas e Arpejos",
        exercises: [
            {
                name: "Escala Pentatônica",
                description: "Pratique a escala pentatônica em todas as posições",
                duration: 300,
                useMetronome: true 
            },
            {
                name: "Arpejos Maiores",
                description: "Pratique arpejos maiores em diferentes tonalidades",
                duration: 300,
                useMetronome: true 
            },
            {
                name: "Escala Maior",
                description: "Pratique a escala maior em todas as cordas",
                duration: 420,
                useMetronome: true 
            },
            {
                name: "Arpejos Menores",
                description: "Pratique arpejos menores em diferentes tonalidades",
                duration: 360,
                useMetronome: true 
            },
            {
                name: "Escalas em Terças",
                description: "Pratique escalas em intervalos de terças",
                duration: 300,
                useMetronome: true 
            }
        ]
    },
    B: {
        name: "Treino B - Acordes e Progressões",
        exercises: [
            {
                name: "Acordes Abertos",
                description: "Pratique transições entre acordes abertos",
                duration: 300,
                useMetronome: true 
            },
            {
                name: "Acordes com Pestana",
                description: "Pratique acordes com pestana em diferentes posições",
                duration: 420,
                useMetronome: true 
            },
            {
                name: "Progressão I-IV-V",
                description: "Pratique a progressão clássica I-IV-V",
                duration: 360,
                useMetronome: true 
            },
            {
                name: "Progressão ii-V-I",
                description: "Pratique a progressão jazzística ii-V-I",
                duration: 420,
                useMetronome: true 
            }
        ]
    },
    C: {
        name: "Treino C - Improvisação e Técnica",
        exercises: [
            {
                name: "Bending e Vibrato",
                description: "Pratique técnicas de bending e vibrato",
                duration: 300,
                useMetronome: true 
            },
            {
                name: "Hammer-on e Pull-off",
                description: "Pratique ligados ascendentes e descendentes",
                duration: 300,
                useMetronome: true 
            },
            {
                name: "Sweep Picking",
                description: "Pratique a técnica de sweep picking em arpejos",
                duration: 420,
                useMetronome: true 
            },
            {
                name: "Improvisação em Blues",
                description: "Improviso sobre progressão de 12 compassos de blues",
                duration: 480,
                useMetronome: true 
            },
            {
                name: "Improvisação Modal",
                description: "Improviso utilizando modos gregos",
                duration: 420,
                useMetronome: true 
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

const soundAlarm = document.getElementById('sound-alarm');
const trainingOptions = document.querySelectorAll('.training-option');

let currentTraining = null;
let currentExerciseIndex = 0;
let timerInterval = null;
let countdownInterval = null;

// Elementos do metrônomo
const metronomeControls = document.querySelector('.metronome-controls');
const metronomeBpmInput = document.getElementById('metronome-bpm');
const metronomeTimeSignatureSelect = document.getElementById('metronome-time-signature');
const metronomeStartBtn = document.getElementById('metronome-start');
const metronomeStopBtn = document.getElementById('metronome-stop');
const beatIndicator = document.createElement('div');
beatIndicator.className = 'metronome-beat-indicator';

// Adicione o indicador de batidas aos controles do metrônomo
metronomeControls.appendChild(beatIndicator);

// Variáveis do metrônomo
let metronomeInterval = null;
let currentBeat = 0;
let isMetronomeActive = false;

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

// Event listeners do metrônomo (modificado para Web Audio API)
metronomeStartBtn.addEventListener('click', function() {
    initAudio();
    startMetronome();
});

metronomeStopBtn.addEventListener('click', stopMetronome);

// Event listeners dos novos botões
pauseExerciseBtn.addEventListener('click', pauseTimer);
resumeExerciseBtn.addEventListener('click', resumeTimer);
restartExerciseBtn.addEventListener('click', restartExercise);

backToHomeBtn1.addEventListener('click', backToHome);
backToHomeBtn2.addEventListener('click', backToHome);
backToHomeBtn3.addEventListener('click', backToHome);

// Funções da Web Audio API
function initAudio() {
    if (isAudioInitialized) return;
    
    // Cria o contexto de áudio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Carrega os sons do metrônomo
    loadSound('./assets/audios/metronome-sound-up.mp3', function(buffer) {
        metronomeSoundBuffer = buffer;
    });
    
    loadSound('./assets/audios/metronome-sound-down.mp3', function(buffer) {
        metronomeFirstBeatSoundBuffer = buffer;
    });
    
    isAudioInitialized = true;
    
    // Resumo o contexto se estiver suspenso (necessário em alguns browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function loadSound(url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    
    request.onload = function() {
        audioContext.decodeAudioData(request.response, callback, function(err) {
            console.error('Erro ao decodificar áudio:', err);
        });
    };
    
    request.onerror = function() {
        console.error('Erro ao carregar áudio:', url);
    };
    
    request.send();
}

function playSound(buffer) {
    if (!audioContext || !buffer) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

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
    pauseExerciseBtn.classList.add('hidden');
    resumeExerciseBtn.classList.add('hidden');
    restartExerciseBtn.classList.remove('hidden');
    
    // Resetar estado do timer
    isTimerPaused = false;
    timeLeft = exercise.duration;
    totalDuration = exercise.duration;

    // Mostrar controles do metrônomo baseado na propriedade useMetronome
    if (exercise.useMetronome) {
        metronomeControls.classList.remove('hidden');
        stopMetronome();
    } else {
        metronomeControls.classList.add('hidden');
        stopMetronome();
    }
    
    // Mostrar tela de exercício
    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.remove('hidden');
}

function startExercise() {
    const exercise = currentTraining.exercises[currentExerciseIndex];
    let countdown = 3;
    
    // Esconder botões desnecessários
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
            startTimer();
        }
    }, 1000);
}

function startTimer() {
    // Limpar qualquer intervalo anterior
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!isTimerPaused) {
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
                pauseExerciseBtn.classList.add('hidden');
            }
        }
    }, 1000);
    
    // Mostrar botão de pausa
    pauseExerciseBtn.classList.remove('hidden');
    resumeExerciseBtn.classList.add('hidden');
}

function nextExercise() {
    // Parar metrônomo se estiver ativo
    stopMetronome();
    
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
    // Parar todos os intervalos
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    stopMetronome();
    
    // Esconder todas as telas exceto a inicial
    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    
    // Limpar estado
    currentTraining = null;
    currentExerciseIndex = 0;
    isTimerPaused = false;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Funções do metrônomo
function createBeatIndicator(beats) {
    beatIndicator.innerHTML = '';
    for (let i = 0; i < beats; i++) {
        const dot = document.createElement('div');
        dot.className = 'beat-dot';
        dot.textContent = i + 1;
        
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
    const interval = 60000 / bpm; // ms entre batidas
    
    isMetronomeActive = true;
    currentBeat = 0;
    
    createBeatIndicator(timeSignature);
    updateBeatIndicator(currentBeat);
    
    // Tocar a primeira batida (som diferente) usando Web Audio API
    if (metronomeFirstBeatSoundBuffer) {
        playSound(metronomeFirstBeatSoundBuffer);
    }
    
    metronomeInterval = setInterval(() => {
        currentBeat = (currentBeat + 1) % timeSignature;
        updateBeatIndicator(currentBeat);
        
        // Tocar som diferente para a primeira batida do compasso
        if (currentBeat === 0) {
            if (metronomeFirstBeatSoundBuffer) {
                playSound(metronomeFirstBeatSoundBuffer);
            }
        } else {
            if (metronomeSoundBuffer) {
                playSound(metronomeSoundBuffer);
            }
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
    
    // Resetar indicador de batidas
    const dots = beatIndicator.querySelectorAll('.beat-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === 0) {
            dot.classList.add('strong');
        }
    });
}

function pauseTimer() {
    isTimerPaused = true;
    pauseExerciseBtn.classList.add('hidden');
    resumeExerciseBtn.classList.remove('hidden');
    
    // Pausar metrônomo também
    stopMetronome();
}

function resumeTimer() {
    isTimerPaused = false;
    resumeExerciseBtn.classList.add('hidden');
    pauseExerciseBtn.classList.remove('hidden');
}

function restartExercise() {
    // Parar timers ativos
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    stopMetronome();
    
    // Resetar estado do exercício atual
    const exercise = currentTraining.exercises[currentExerciseIndex];
    timeLeft = exercise.duration;
    totalDuration = exercise.duration;
    
    // Atualizar display
    timerElement.textContent = formatTime(timeLeft);
    exerciseProgress.style.width = '0%';
    
    // Mostrar botão de iniciar novamente
    startExerciseBtn.classList.remove('hidden');
    nextExerciseBtn.classList.add('hidden');
    pauseExerciseBtn.classList.add('hidden');
    resumeExerciseBtn.classList.add('hidden');
}   