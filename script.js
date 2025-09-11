// Elementos da interface
const homeScreen = document.getElementById('home-screen');
const customTrainingScreen = document.getElementById('custom-training-screen');
const editTrainingScreen = document.getElementById('edit-training-screen');
const exerciseListScreen = document.getElementById('exercise-list-screen');
const exerciseScreen = document.getElementById('exercise-screen');
const finishScreen = document.getElementById('finish-screen');

const customTrainingOption = document.getElementById('custom-training-option');
const customTrainingList = document.getElementById('custom-training-list');
const createNewTrainingBtn = document.getElementById('create-new-training');
const backToHomeFromCustomBtn = document.getElementById('back-to-home-from-custom');
const cancelEditTrainingBtn = document.getElementById('cancel-edit-training');
const saveTrainingBtn = document.getElementById('save-training');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const exerciseEditorList = document.getElementById('exercise-editor-list');
const trainingNameInput = document.getElementById('training-name');
const trainingDescriptionInput = document.getElementById('training-description');
const editTrainingTitle = document.getElementById('edit-training-title');

// Elementos do temporizador e metrônomo
const timerElement = document.getElementById('timer');
const countdownElement = document.getElementById('countdown');
const soundAlarm = document.getElementById('sound-alarm');
const metronomeBpmInput = document.getElementById('metronome-bpm');
const metronomeTimeSignatureSelect = document.getElementById('metronome-time-signature');
const metronomeStartBtn = document.getElementById('metronome-start');
const metronomeStopBtn = document.getElementById('metronome-stop');
const beatIndicator = document.createElement('div');
beatIndicator.className = 'metronome-beat-indicator';
const metronomeControls = document.querySelector('.metronome-controls');
metronomeControls.appendChild(beatIndicator);

// Dados de treinos personalizados
let customTrainings = JSON.parse(localStorage.getItem('whaleCustomTrainings')) || {};
let currentTrainingId = null;
let isEditing = false;

// Variáveis do temporizador e metrônomo
let isTimerPaused = false;
let timeLeft = 0;
let totalDuration = 0;
let audioContext;
let metronomeSoundBuffer;
let metronomeFirstBeatSoundBuffer;
let isAudioInitialized = false;
let currentTraining = null;
let currentExerciseIndex = 0;
let timerInterval = null;
let countdownInterval = null;
let metronomeInterval = null;
let currentBeat = 0;
let isMetronomeActive = false;

// Dados dos treinos padrão
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

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners aos treinos padrão
    document.querySelectorAll('.training-option[data-training]').forEach(option => {
        option.addEventListener('click', () => {
            const trainingType = option.getAttribute('data-training');
            selectTraining(trainingType);
        });
    });
    
    // Event listeners para treinos personalizados
    customTrainingOption.addEventListener('click', showCustomTrainingScreen);
    createNewTrainingBtn.addEventListener('click', createNewTraining);
    backToHomeFromCustomBtn.addEventListener('click', backToHome);
    cancelEditTrainingBtn.addEventListener('click', cancelEditTraining);
    saveTrainingBtn.addEventListener('click', saveTraining);
    addExerciseBtn.addEventListener('click', addExerciseToEditor);
    
    // Outros event listeners existentes
    startTrainingBtn.addEventListener('click', startTraining);
    startExerciseBtn.addEventListener('click', startExercise);
    nextExerciseBtn.addEventListener('click', nextExercise);
    
    // Event listeners do metrônomo
    metronomeStartBtn.addEventListener('click', startMetronome);
    metronomeStopBtn.addEventListener('click', stopMetronome);
    
    // Event listeners dos botões de controle
    pauseExerciseBtn.addEventListener('click', pauseTimer);
    resumeExerciseBtn.addEventListener('click', resumeTimer);
    restartExerciseBtn.addEventListener('click', restartExercise);
    
    backToHomeBtn1.addEventListener('click', backToHome);
    backToHomeBtn2.addEventListener('click', backToHome);
    backToHomeBtn3.addEventListener('click', backToHome);
});

// Funções para gerenciar treinos personalizados
function showCustomTrainingScreen() {
    homeScreen.classList.add('hidden');
    customTrainingScreen.classList.remove('hidden');
    loadCustomTrainingList();
}

function loadCustomTrainingList() {
    customTrainingList.innerHTML = '';
    
    if (Object.keys(customTrainings).length === 0) {
        customTrainingList.innerHTML = '<p>Nenhum treino personalizado criado ainda.</p>';
        return;
    }
    
    for (const id in customTrainings) {
        const training = customTrainings[id];
        const trainingItem = document.createElement('div');
        trainingItem.className = 'custom-training-item';
        trainingItem.innerHTML = `
            <h4>${training.name}</h4>
            <p>${training.exercises.length} exercícios · ${calculateTotalTime(training.exercises)}</p>
            <p><small>${training.description || 'Sem descrição'}</small></p>
        `;
        
        trainingItem.addEventListener('click', () => {
            selectTraining('CUSTOM', id);
        });
        
        // Adicionar botões de editar e excluir
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'exercise-item-controls';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editTraining(id);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-finish';
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTraining(id);
        });
        
        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(deleteBtn);
        trainingItem.appendChild(controlsDiv);
        
        customTrainingList.appendChild(trainingItem);
    }
}

function calculateTotalTime(exercises) {
    const totalSeconds = exercises.reduce((total, exercise) => total + exercise.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
}

function createNewTraining() {
    isEditing = false;
    currentTrainingId = null;
    trainingNameInput.value = '';
    trainingDescriptionInput.value = '';
    exerciseEditorList.innerHTML = '';
    editTrainingTitle.textContent = 'Criar Novo Treino';
    
    // Adicionar um exercício vazio por padrão
    addExerciseToEditor();
    
    customTrainingScreen.classList.add('hidden');
    editTrainingScreen.classList.remove('hidden');
}

function editTraining(id) {
    isEditing = true;
    currentTrainingId = id;
    const training = customTrainings[id];
    
    trainingNameInput.value = training.name;
    trainingDescriptionInput.value = training.description || '';
    editTrainingTitle.textContent = 'Editar Treino';
    
    // Limpar e preencher a lista de exercícios
    exerciseEditorList.innerHTML = '';
    
    training.exercises.forEach((exercise, index) => {
        addExerciseToEditor(exercise, index);
    });
    
    customTrainingScreen.classList.add('hidden');
    editTrainingScreen.classList.remove('hidden');
}

function addExerciseToEditor(exercise = null, index = null) {
    const exerciseId = index !== null ? index : exerciseEditorList.children.length;
    
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise-editor-item';
    exerciseDiv.innerHTML = `
        <div class="form-group">
            <label>Nome do Exercício:</label>
            <input type="text" class="exercise-name" value="${exercise ? exercise.name : ''}" placeholder="Nome do exercício">
        </div>
        <div class="form-group">
            <label>Descrição:</label>
            <textarea class="exercise-description" placeholder="Descrição do exercício">${exercise ? exercise.description : ''}</textarea>
        </div>
        <div class="form-group">
            <label>Duração (segundos):</label>
            <input type="number" class="exercise-duration" value="${exercise ? exercise.duration : 60}" min="10">
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="exercise-metronome" ${exercise && exercise.useMetronome ? 'checked' : 'checked'}>
                Usar metrônomo
            </label>
        </div>
        <button class="btn btn-finish remove-exercise">Remover</button>
        <hr>
    `;
    
    exerciseDiv.querySelector('.remove-exercise').addEventListener('click', () => {
        exerciseDiv.remove();
    });
    
    exerciseEditorList.appendChild(exerciseDiv);
}

function saveTraining() {
    const name = trainingNameInput.value.trim();
    const description = trainingDescriptionInput.value.trim();
    
    if (!name) {
        alert('Por favor, informe um nome para o treino.');
        return;
    }
    
    // Coletar exercícios
    const exercises = [];
    const exerciseItems = exerciseEditorList.querySelectorAll('.exercise-editor-item');
    
    if (exerciseItems.length === 0) {
        alert('Adicione pelo menos um exercício ao treino.');
        return;
    }
    
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('.exercise-name').value.trim();
        const exerciseDescription = item.querySelector('.exercise-description').value.trim();
        const exerciseDuration = parseInt(item.querySelector('.exercise-duration').value) || 60;
        const useMetronome = item.querySelector('.exercise-metronome').checked;
        
        if (exerciseName) {
            exercises.push({
                name: exerciseName,
                description: exerciseDescription,
                duration: exerciseDuration,
                useMetronome: useMetronome
            });
        }
    });
    
    if (exercises.length === 0) {
        alert('Adicione pelo menos um exercício válido ao treino.');
        return;
    }
    
    // Criar ou atualizar o treino
    const trainingId = currentTrainingId || Date.now().toString();
    
    customTrainings[trainingId] = {
        name: name,
        description: description,
        exercises: exercises
    };
    
    // Salvar no localStorage
    localStorage.setItem('whaleCustomTrainings', JSON.stringify(customTrainings));
    
    // Voltar para a lista de treinos personalizados
    editTrainingScreen.classList.add('hidden');
    customTrainingScreen.classList.remove('hidden');
    
    // Recarregar a lista
    loadCustomTrainingList();
}

function deleteTraining(id) {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
        delete customTrainings[id];
        localStorage.setItem('whaleCustomTrainings', JSON.stringify(customTrainings));
        loadCustomTrainingList();
    }
}

function cancelEditTraining() {
    editTrainingScreen.classList.add('hidden');
    customTrainingScreen.classList.remove('hidden');
}

// Modificar a função selectTraining para suportar treinos personalizados
function selectTraining(trainingType, customId = null) {
    if (trainingType === 'CUSTOM') {
        currentTraining = customTrainings[customId];
        currentTraining.customId = customId; // Guardar o ID para possível edição futura
    } else {
        currentTraining = trainingData[trainingType];
    }
    
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
    if (trainingType === 'CUSTOM') {
        customTrainingScreen.classList.add('hidden');
    } else {
        homeScreen.classList.add('hidden');
    }
    exerciseListScreen.classList.remove('hidden');
}

// Funções do temporizador e exercícios
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
    customTrainingScreen.classList.add('hidden');
    editTrainingScreen.classList.add('hidden');
    exerciseListScreen.classList.add('hidden');
    exerciseScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    
    // Limpar estado
    currentTraining = null;
    currentExerciseIndex = 0;
    isTimerPaused = false;
}

// Funções do metrônomo
function startMetronome() {
    if (isMetronomeActive) return;
    
    const bpm = parseInt(metronomeBpmInput.value) || 120;
    const timeSignature = parseInt(metronomeTimeSignatureSelect.value) || 4;
    const interval = 60000 / bpm; // ms entre batidas
    
    isMetronomeActive = true;
    currentBeat = 0;
    
    createBeatIndicator(timeSignature);
    updateBeatIndicator(currentBeat);
    
    // Tocar a primeira batida (som diferente)
    try {
        soundAlarm.play();
    } catch (e) {
        console.log("Simulando som do metrônomo");
    }
    
    metronomeInterval = setInterval(() => {
        currentBeat = (currentBeat + 1) % timeSignature;
        updateBeatIndicator(currentBeat);
        
        // Tocar som diferente para a primeira batida do compasso
        if (currentBeat === 0) {
            try {
                soundAlarm.play();
            } catch (e) {
                console.log("Simulando som de batida forte");
            }
        } else {
            try {
                // Usar um som diferente se disponível
                soundAlarm.play();
            } catch (e) {
                console.log("Simulando som de batida normal");
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

function createBeatIndicator(beats) {
    beatIndicator.innerHTML = '';
    for (let i = 0; i < beats; i++) {
        const dot = document.createElement('div');
        dot.className = 'beat-dot' + (i === 0 ? ' strong' : '');
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

// Funções auxiliares
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}