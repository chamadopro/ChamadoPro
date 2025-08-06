// Variável global para rastrear a tela ativa
let activeScreenId = null; // Ou 'client' se a tela inicial padrão for a do cliente.
let nomeDoClienteLogado = "Visitante"; // Variável global para o nome do cliente logado
let currentUserType = null; // Adicionado para rastrear o tipo de usuário logado
let screenHistory = []; // Histórico de telas para o botão Voltar
let servicosHistoricoCount = 2; // Simulação de serviços finalizados para o histórico

// Sistema de Seleção Múltipla para Serviços Urgentes
let selectedProviders = new Set(); // Prestadores selecionados
let urgentRequestActive = false; // Se há uma solicitação urgente ativa
let urgentRequestData = null; // Dados da solicitação ativa

// Frases motivacionais para inicialização do sistema
const frasesMotivacionais = [
    "Seja a solução. Seu talento move o mundo, um chamado de cada vez.",
    "O problema se torna pequeno quando tem ajuda a um chamado de distancia.",
    "Seu problema está a um chamado da solução."
];

// Sistema de Badge de Verificação - Monetização Premium
let badgeSystem = {
    enabled: true,
    premiumPrice: 29.90,
    currentPlan: 'gratuito' // gratuito, premium
};

// Tipos de badges disponíveis
const badgeTypes = {
    verificado: {
        name: 'Verificado',
        icon: 'fas fa-check-circle',
        color: '#1DA1F2',
        description: 'Profissional com identidade verificada',
        premium: false
    },
    premium: {
        name: 'Premium',
        icon: 'fas fa-crown',
        color: '#FFD700',
        description: 'Profissional premium com benefícios exclusivos',
        premium: true
    },
    destaque: {
        name: 'Destaque',
        icon: 'fas fa-star',
        color: '#FF6B35',
        description: 'Profissional em destaque na plataforma',
        premium: true
    },
    especialista: {
        name: 'Especialista',
        icon: 'fas fa-medal',
        color: '#8A2BE2',
        description: 'Especialista reconhecido na área',
        premium: true
    }
};

// ===== INSTRUÇÃO 1: MELHORIAS NA INTERFACE =====

// Sistema de Tema Escuro/Claro
let themeSystem = {
    currentTheme: 'light', // light, dark
    autoSwitch: false
};

// Sistema de Animações Melhoradas
let animationSystem = {
    enabled: true,
    speed: 'normal', // slow, normal, fast
    effects: {
        fadeIn: true,
        slideIn: true,
        bounce: true,
        glow: true
    }
};

// Sistema de Loading States
let loadingSystem = {
    active: false,
    messages: [
        'Carregando prestadores...',
        'Verificando disponibilidade...',
        'Calculando distâncias...',
        'Finalizando busca...'
    ],
    currentMessage: 0
};

// Função para alternar tema
function toggleTheme() {
    const currentTheme = themeSystem.currentTheme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    themeSystem.currentTheme = newTheme;
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    
    // Salvar preferência
    localStorage.setItem('chamadopro-theme', newTheme);
    
    // Mostrar notificação
    showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'success');
}

// Função para mostrar loading com mensagens rotativas
function showAdvancedLoading(container, duration = 3000) {
    if (!animationSystem.enabled) return;
    
    const loadingHtml = `
        <div class="advanced-loading" style="
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            padding: 40px 20px;
            background: rgba(255,255,255,0.95);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        ">
            <div class="loading-spinner" style="
                width: 40px; 
                height: 40px; 
                border: 4px solid #f3f3f3; 
                border-top: 4px solid #00BCD4; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            "></div>
            <div class="loading-message" style="
                color: #00BCD4; 
                font-weight: 600; 
                text-align: center;
                min-height: 20px;
            ">${loadingSystem.messages[0]}</div>
        </div>
    `;
    
    if (container) {
        container.innerHTML = loadingHtml;
        
        // Rotacionar mensagens
        const messageElement = container.querySelector('.loading-message');
        let messageIndex = 0;
        
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingSystem.messages.length;
            if (messageElement) {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.textContent = loadingSystem.messages[messageIndex];
                    messageElement.style.opacity = '1';
                }, 200);
            }
        }, 800);
        
        // Limpar loading após duração
        setTimeout(() => {
            clearInterval(messageInterval);
        }, duration);
    }
}

// Função para adicionar animação de entrada
function addEntranceAnimation(element, animationType = 'fadeIn') {
    if (!animationSystem.enabled || !element) return;
    
    const animations = {
        fadeIn: 'opacity: 0; animation: fadeInUp 0.6s ease forwards;',
        slideIn: 'transform: translateY(20px); opacity: 0; animation: slideInUp 0.5s ease forwards;',
        bounce: 'transform: scale(0.8); opacity: 0; animation: bounceIn 0.7s ease forwards;'
    };
    
    const animationCSS = animations[animationType] || animations.fadeIn;
    element.style.cssText += animationCSS;
}

// CSS das animações (será injetado dinamicamente)
function injectAnimationCSS() {
    const animationCSS = `
        <style id="chamadopro-animations">
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes bounceIn {
                0% { opacity: 0; transform: scale(0.3); }
                50% { opacity: 1; transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            /* Tema escuro */
            .dark-theme {
                background-color: #1a1a1a;
                color: #ffffff;
            }
            
            .dark-theme .card,
            .dark-theme .modal-content {
                background-color: #2d2d2d;
                color: #ffffff;
                border-color: #404040;
            }
            
            .dark-theme .btn {
                background-color: #404040;
                color: #ffffff;
                border-color: #555555;
            }
            
            .dark-theme .btn.primary-btn {
                background-color: #00BCD4;
                color: #ffffff;
            }
            
            /* Efeitos de hover melhorados */
            .enhanced-hover {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .enhanced-hover:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            /* Loading states */
            .loading-shimmer {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        </style>
    `;
    
    // Injetar CSS se não existir
    if (!document.getElementById('chamadopro-animations')) {
        document.head.insertAdjacentHTML('beforeend', animationCSS);
    }
}

// ===== INSTRUÇÃO 2: SISTEMA DE NOTIFICAÇÕES AVANÇADO =====

// Sistema de Notificações Inteligentes
let notificationSystem = {
    enabled: true,
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left
    autoClose: true,
    duration: 4000,
    maxVisible: 5,
    sound: true,
    queue: []
};

// Tipos de notificação
const notificationTypes = {
    success: {
        title: 'Sucesso',
        icon: 'fas fa-check-circle',
        color: '#28a745',
        sound: 'success.mp3'
    },
    error: {
        title: 'Erro',
        icon: 'fas fa-exclamation-circle', 
        color: '#dc3545',
        sound: 'error.mp3'
    },
    warning: {
        title: 'Aviso',
        icon: 'fas fa-exclamation-triangle',
        color: '#ffc107',
        sound: 'warning.mp3'
    },
    info: {
        title: 'Informação',
        icon: 'fas fa-info-circle',
        color: '#17a2b8',
        sound: 'info.mp3'
    },
    proposal: {
        title: 'Proposta',
        icon: 'fas fa-file-contract',
        color: '#6f42c1',
        sound: 'notification.mp3'
    },
    message: {
        title: 'Mensagem',
        icon: 'fas fa-envelope',
        color: '#007bff',
        sound: 'message.mp3'
    }
};

// Função melhorada para mostrar notificações
function showNotification(message, type = 'info', options = {}) {
    if (!notificationSystem.enabled) return;
    
    const config = {
        duration: options.duration || notificationSystem.duration,
        persistent: options.persistent || false,
        actions: options.actions || [],
        data: options.data || {}
    };
    
    const notification = {
        id: Date.now() + Math.random(),
        message,
        type,
        config,
        timestamp: new Date()
    };
    
    // Adicionar à fila
    notificationSystem.queue.push(notification);
    
    // Processar fila
    processNotificationQueue();
}

// Função para processar fila de notificações
function processNotificationQueue() {
    const container = getNotificationContainer();
    const visibleNotifications = container.children.length;
    
    if (visibleNotifications >= notificationSystem.maxVisible) {
        // Remover mais antiga se exceder limite
        const oldest = container.firstChild;
        if (oldest) removeNotification(oldest);
    }
    
    if (notificationSystem.queue.length > 0) {
        const notification = notificationSystem.queue.shift();
        renderNotification(notification);
    }
}

// Função para criar container de notificações
function getNotificationContainer() {
    let container = document.getElementById('notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            ${getPositionStyles()}
            z-index: 10000;
            pointer-events: none;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
    
    return container;
}

// Função para obter estilos de posição
function getPositionStyles() {
    const positions = {
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;',
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;'
    };
    
    return positions[notificationSystem.position] || positions['top-right'];
}

// Função para renderizar notificação (VERSÃO SIMPLES E FUNCIONAL)
function renderNotification(notification) {
    let container = getNotificationContainer();
    if (!container) {
        container = createNotificationContainer();
        document.body.appendChild(container);
    }
    
    const { message, type, config } = notification;
    const typeConfig = notificationTypes[type] || notificationTypes.info;
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification-item';
    notificationElement.dataset.id = notification.id;
    
    notificationElement.innerHTML = `
        <div style="
            background: white;
            border-left: 4px solid ${typeConfig.color};
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            pointer-events: all;
            transform: translateX(100px);
            opacity: 0;
            transition: all 0.4s ease;
            max-width: 350px;
            min-width: 300px;
        ">
            <i class="${typeConfig.icon}" style="
                color: ${typeConfig.color};
                font-size: 1.2rem;
                margin-top: 2px;
                flex-shrink: 0;
            "></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #333; margin-bottom: 4px;">
                    ${typeConfig.title}
                </div>
                <div style="color: #666; font-size: 0.9rem; line-height: 1.4;">
                    ${message}
                </div>
            </div>
            <button onclick="removeNotification(this.closest('.notification-item'))" style="
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1.1rem;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">×</button>
        </div>
    `;
    
    container.appendChild(notificationElement);
    
    // Animar entrada
    setTimeout(() => {
        const notificationDiv = notificationElement.querySelector('div');
        if (notificationDiv) {
            notificationDiv.style.transform = 'translateX(0)';
            notificationDiv.style.opacity = '1';
        }
    }, 50);
    
    // Tocar som se habilitado
    if (notificationSystem.sound) {
        playNotificationSound(typeConfig.sound);
    }
    
    // Auto-remove se especificado
    if (config && config.duration && config.duration > 0) {
        setTimeout(() => {
            removeNotification(notificationElement);
        }, config.duration);
    }
    
    return notificationElement;
}

// Função para remover notificação (VERSÃO SIMPLES)
function removeNotification(element) {
    if (!element) return;
    
    try {
        const notificationDiv = element.querySelector('div');
        if (notificationDiv) {
            notificationDiv.style.transform = 'translateX(100px)';
            notificationDiv.style.opacity = '0';
            
            setTimeout(() => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        } else if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    } catch (error) {
        console.warn('Erro ao remover notificação:', error);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
}

// Função para tocar som (simulada)
function playNotificationSound(soundFile) {
    console.log(`Playing notification sound: ${soundFile}`);
}

// Notificações específicas do sistema
function notifyNewProposal(proposalData) {
    showNotification(
        `Nova proposta recebida de ${proposalData.prestador}!`,
        'proposal',
        {
            actions: [
                {
                    label: 'Ver Proposta',
                    callback: `viewProposal(${proposalData.id})`,
                    color: '#6f42c1'
                }
            ],
            data: proposalData
        }
    );
}

function notifyServiceUpdate(serviceData) {
    showNotification(
        `Serviço "${serviceData.title}" foi atualizado!`,
        'info',
        {
            actions: [
                {
                    label: 'Ver Detalhes',
                    callback: `viewService(${serviceData.id})`,
                    color: '#17a2b8'
                }
            ]
        }
    );
}

function notifyPaymentConfirmed(paymentData) {
    showNotification(
        `Pagamento de R$ ${paymentData.amount} confirmado!`,
        'success',
        {
            duration: 6000
        }
    );
}

// ===== INSTRUÇÃO 3: FILTROS AVANÇADOS =====

// Sistema de Filtros Inteligentes
let advancedFilterSystem = {
    enabled: true,
    savedFilters: [],
    currentFilters: {},
    autoSave: true,
    history: []
};

// Configuração de filtros disponíveis
const filterConfig = {
    price: {
        type: 'range',
        label: 'Preço',
        min: 0,
        max: 1000,
        step: 10,
        prefix: 'R$ '
    },
    distance: {
        type: 'range',
        label: 'Distância',
        min: 0,
        max: 50,
        step: 1,
        suffix: ' km'
    },
    rating: {
        type: 'select',
        label: 'Avaliação Mínima',
        options: [
            { value: '0', label: 'Qualquer avaliação' },
            { value: '3', label: '3+ estrelas' },
            { value: '4', label: '4+ estrelas' },
            { value: '4.5', label: '4.5+ estrelas' }
        ]
    },
    specialty: {
        type: 'multiselect',
        label: 'Especialidades',
        options: [
            { value: 'eletricista', label: 'Eletricista' },
            { value: 'encanador', label: 'Encanador' },
            { value: 'chaveiro', label: 'Chaveiro' },
            { value: 'mecânico', label: 'Mecânico' },
            { value: 'borracheiro', label: 'Borracheiro' },
            { value: 'vidraceiro', label: 'Vidraceiro' }
        ]
    },
    availability: {
        type: 'select',
        label: 'Disponibilidade',
        options: [
            { value: 'all', label: 'Qualquer horário' },
            { value: 'now', label: 'Disponível agora' },
            { value: 'today', label: 'Hoje' },
            { value: 'weekend', label: 'Final de semana' }
        ]
    },
    verified: {
        type: 'checkbox',
        label: 'Apenas verificados',
        description: 'Mostrar somente prestadores verificados'
    },
    premium: {
        type: 'checkbox',
        label: 'Premium',
        description: 'Prestadores com plano premium'
    }
};

// Função para criar interface de filtros avançados
function createAdvancedFilterPanel() {
    const filterPanel = document.createElement('div');
    filterPanel.id = 'advanced-filter-panel';
    filterPanel.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin: 15px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
        display: none;
    `;
    
    const filtersHtml = Object.entries(filterConfig).map(([key, config]) => {
        return createFilterInput(key, config);
    }).join('');
    
    filterPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #00BCD4; font-size: 1.2rem;">
                <i class="fas fa-filter"></i> Filtros Avançados
            </h3>
            <div style="display: flex; gap: 10px;">
                <button onclick="saveCurrentFilter()" style="
                    background: #6c757d; color: white; border: none; padding: 6px 12px;
                    border-radius: 6px; cursor: pointer; font-size: 0.85rem;
                ">
                    <i class="fas fa-save"></i> Salvar
                </button>
                <button onclick="resetAllFilters()" style="
                    background: #dc3545; color: white; border: none; padding: 6px 12px;
                    border-radius: 6px; cursor: pointer; font-size: 0.85rem;
                ">
                    <i class="fas fa-undo"></i> Limpar
                </button>
                <button onclick="toggleFilterPanel()" style="
                    background: #6c757d; color: white; border: none; padding: 6px 12px;
                    border-radius: 6px; cursor: pointer; font-size: 0.85rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            ${filtersHtml}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef;">
            <div id="filter-results-count" style="color: #666; font-size: 0.9rem;">
                <!-- Contador será atualizado dinamicamente -->
            </div>
            <button onclick="applyAdvancedFilters()" style="
                background: #00BCD4; color: white; border: none; padding: 10px 20px;
                border-radius: 8px; cursor: pointer; font-weight: 600;
            ">
                <i class="fas fa-search"></i> Aplicar Filtros
            </button>
        </div>
    `;
    
    return filterPanel;
}

// Função para criar input de filtro específico
function createFilterInput(key, config) {
    switch (config.type) {
        case 'range':
            return `
                <div class="filter-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        ${config.label}
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="filter-${key}" min="${config.min}" max="${config.max}" 
                               step="${config.step}" value="${config.max}" 
                               style="flex: 1;"
                               oninput="updateRangeDisplay('${key}', this.value)">
                        <span id="filter-${key}-display" style="min-width: 60px; font-weight: 600; color: #00BCD4;">
                            ${config.prefix || ''}${config.max}${config.suffix || ''}
                        </span>
                    </div>
                </div>
            `;
            
        case 'select':
            return `
                <div class="filter-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        ${config.label}
                    </label>
                    <select id="filter-${key}" style="
                        width: 100%; padding: 8px; border: 1px solid #ddd; 
                        border-radius: 6px; background: white;
                    ">
                        ${config.options.map(opt => 
                            `<option value="${opt.value}">${opt.label}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
            
        case 'checkbox':
            return `
                <div class="filter-group">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="filter-${key}" style="margin: 0;">
                        <span style="font-weight: 600; color: #333;">${config.label}</span>
                    </label>
                    ${config.description ? `
                        <small style="color: #666; margin-left: 24px; display: block;">
                            ${config.description}
                        </small>
                    ` : ''}
                </div>
            `;
            
        case 'multiselect':
            return `
                <div class="filter-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        ${config.label}
                    </label>
                    <div id="filter-${key}" style="
                        border: 1px solid #ddd; border-radius: 6px; padding: 8px;
                        max-height: 120px; overflow-y: auto; background: white;
                    ">
                        ${config.options.map(opt => `
                            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; cursor: pointer;">
                                <input type="checkbox" value="${opt.value}" style="margin: 0;">
                                <span style="font-size: 0.9rem;">${opt.label}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            
        default:
            return '';
    }
}

// Função para alternar painel de filtros
function toggleFilterPanel() {
    const panel = document.getElementById('advanced-filter-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

// Função para atualizar display de range
function updateRangeDisplay(key, value) {
    const config = filterConfig[key];
    const display = document.getElementById(`filter-${key}-display`);
    if (display && config) {
        display.textContent = `${config.prefix || ''}${value}${config.suffix || ''}`;
    }
}

// Função para aplicar filtros avançados
function applyAdvancedFilters() {
    const filters = collectFilterValues();
    advancedFilterSystem.currentFilters = filters;
    
    // Aplicar filtros aos prestadores
    const filteredProviders = filterProviders(prestadoresSimulados, filters);
    
    // Atualizar interface
    updateProviderDisplay(filteredProviders);
    
    // Salvar no histórico
    if (advancedFilterSystem.autoSave) {
        saveFilterHistory(filters);
    }
    
    // Notificar resultado
    showNotification(
        `${filteredProviders.length} prestadores encontrados com os filtros aplicados`,
        'success'
    );
}

// Função para coletar valores dos filtros
function collectFilterValues() {
    const filters = {};
    
    Object.keys(filterConfig).forEach(key => {
        const element = document.getElementById(`filter-${key}`);
        if (element) {
            const config = filterConfig[key];
            
            switch (config.type) {
                case 'range':
                case 'select':
                    filters[key] = element.value;
                    break;
                case 'checkbox':
                    filters[key] = element.checked;
                    break;
                case 'multiselect':
                    const checkboxes = element.querySelectorAll('input[type="checkbox"]:checked');
                    filters[key] = Array.from(checkboxes).map(cb => cb.value);
                    break;
            }
        }
    });
    
    return filters;
}

// Função para filtrar prestadores
function filterProviders(providers, filters) {
    return providers.filter(provider => {
        // Filtro de preço (simulado)
        if (filters.price && provider.valorBase > parseFloat(filters.price)) {
            return false;
        }
        
        // Filtro de distância
        if (filters.distance && provider.localizacaoSimulada > parseFloat(filters.distance)) {
            return false;
        }
        
        // Filtro de avaliação
        if (filters.rating && parseFloat(provider.avaliacao) < parseFloat(filters.rating)) {
            return false;
        }
        
        // Filtro de especialidade
        if (filters.specialty && filters.specialty.length > 0) {
            const specialtyMatch = filters.specialty.some(specialty => 
                provider.especialidade.toLowerCase().includes(specialty.toLowerCase())
            );
            if (!specialtyMatch) return false;
        }
        
        // Filtro de verificação
        if (filters.verified && (!provider.badges || !provider.badges.includes('verificado'))) {
            return false;
        }
        
        // Filtro premium
        if (filters.premium && (!provider.badges || !provider.badges.some(badge => 
            badgeTypes[badge] && badgeTypes[badge].premium
        ))) {
            return false;
        }
        
        return true;
    });
}

// ===== INSTRUÇÃO 4: PAINÉIS ADMINISTRATIVOS =====

// Sistema de Dashboard Administrativo
let adminSystem = {
    enabled: true,
    currentUser: null,
    permissions: {
        viewUsers: true,
        editUsers: true,
        viewReports: true,
        managePayments: true,
        systemSettings: true
    },
    realTimeData: true
};

// Dados simulados para dashboard administrativo
const adminData = {
    statistics: {
        totalUsers: 1247,
        activeProviders: 89,
        totalServices: 3456,
        monthlyRevenue: 45623.50,
        pendingPayments: 12,
        averageRating: 4.7
    },
    recentActivity: [
        { type: 'new_user', message: 'Novo cliente cadastrado: Maria Silva', time: '2 min atrás' },
        { type: 'service_completed', message: 'Serviço concluído: Eletricista - R$ 150', time: '5 min atrás' },
        { type: 'payment', message: 'Pagamento processado: R$ 320,00', time: '8 min atrás' },
        { type: 'review', message: 'Nova avaliação: 5 estrelas para João Santos', time: '15 min atrás' }
    ],
    topProviders: [
        { name: 'João Silva', specialty: 'Eletricista', rating: 4.9, services: 45 },
        { name: 'Auto Socorro Silva', specialty: 'Mecânico', rating: 4.8, services: 38 },
        { name: 'Pedro Lima', specialty: 'Chaveiro', rating: 4.7, services: 32 }
    ]
};

// Função para criar dashboard administrativo
function createAdminDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'admin-dashboard';
    dashboard.style.cssText = `
        background: #f8f9fa;
        min-height: 100vh;
        padding: 20px;
        display: none;
    `;
    
    dashboard.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
            <!-- Header do Dashboard -->
            <div style="
                background: white; 
                border-radius: 12px; 
                padding: 20px; 
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <h1 style="margin: 0; color: #00BCD4; font-size: 1.8rem;">
                        <i class="fas fa-tachometer-alt"></i> Dashboard Administrativo
                    </h1>
                    <p style="margin: 5px 0 0 0; color: #666;">
                        Visão geral da plataforma ChamadoPro
                    </p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="refreshAdminData()" style="
                        background: #28a745; color: white; border: none; padding: 10px 15px;
                        border-radius: 8px; cursor: pointer; font-weight: 600;
                    ">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                    <button onclick="exportAdminReport()" style="
                        background: #17a2b8; color: white; border: none; padding: 10px 15px;
                        border-radius: 8px; cursor: pointer; font-weight: 600;
                    ">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            
            <!-- Cards de Estatísticas -->
            <div style="
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 20px; 
                margin-bottom: 20px;
            ">
                ${createStatCards()}
            </div>
            
            <!-- Seção de Gráficos e Atividades -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Gráfico de Receita -->
                <div style="
                    background: white; 
                    border-radius: 12px; 
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-chart-line"></i> Receita Mensal
                    </h3>
                    <div id="revenue-chart" style="height: 200px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: #666;">Gráfico de receita seria exibido aqui</span>
                    </div>
                </div>
                
                <!-- Atividade Recente -->
                <div style="
                    background: white; 
                    border-radius: 12px; 
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-bell"></i> Atividade Recente
                    </h3>
                    <div id="recent-activity" style="max-height: 200px; overflow-y: auto;">
                        ${createActivityList()}
                    </div>
                </div>
            </div>
            
            <!-- Tabelas de Dados -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Top Prestadores -->
                <div style="
                    background: white; 
                    border-radius: 12px; 
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-star"></i> Top Prestadores
                    </h3>
                    ${createTopProvidersTable()}
                </div>
                
                <!-- Controles do Sistema -->
                <div style="
                    background: white; 
                    border-radius: 12px; 
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-cogs"></i> Controles do Sistema
                    </h3>
                    ${createSystemControls()}
                </div>
            </div>
        </div>
    `;
    
    return dashboard;
}

// Função para criar cards de estatísticas
function createStatCards() {
    const stats = [
        { label: 'Total de Usuários', value: adminData.statistics.totalUsers, icon: 'fas fa-users', color: '#007bff' },
        { label: 'Prestadores Ativos', value: adminData.statistics.activeProviders, icon: 'fas fa-user-tie', color: '#28a745' },
        { label: 'Serviços Realizados', value: adminData.statistics.totalServices, icon: 'fas fa-tasks', color: '#17a2b8' },
        { label: 'Receita Mensal', value: `R$ ${adminData.statistics.monthlyRevenue.toLocaleString('pt-BR')}`, icon: 'fas fa-dollar-sign', color: '#ffc107' },
        { label: 'Pagamentos Pendentes', value: adminData.statistics.pendingPayments, icon: 'fas fa-clock', color: '#dc3545' },
        { label: 'Avaliação Média', value: `${adminData.statistics.averageRating} ★`, icon: 'fas fa-star', color: '#6f42c1' }
    ];
    
    return stats.map(stat => `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid ${stat.color};
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${stat.label}</p>
                    <h3 style="margin: 5px 0 0 0; color: #333; font-size: 1.5rem;">${stat.value}</h3>
                </div>
                <i class="${stat.icon}" style="font-size: 2rem; color: ${stat.color}; opacity: 0.7;"></i>
            </div>
        </div>
    `).join('');
}

// Função para criar lista de atividades
function createActivityList() {
    return adminData.recentActivity.map(activity => {
        const iconMap = {
            new_user: 'fas fa-user-plus',
            service_completed: 'fas fa-check-circle',
            payment: 'fas fa-credit-card',
            review: 'fas fa-star'
        };
        
        const colorMap = {
            new_user: '#28a745',
            service_completed: '#17a2b8',
            payment: '#ffc107',
            review: '#6f42c1'
        };
        
        return `
            <div style="
                display: flex; 
                align-items: center; 
                gap: 12px; 
                padding: 10px 0; 
                border-bottom: 1px solid #f0f0f0;
            ">
                <i class="${iconMap[activity.type]}" style="
                    color: ${colorMap[activity.type]}; 
                    font-size: 1.1rem;
                    width: 20px;
                "></i>
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 0.9rem; color: #333;">${activity.message}</p>
                    <small style="color: #666;">${activity.time}</small>
                </div>
            </div>
        `;
    }).join('');
}

// Função para criar tabela de top prestadores
function createTopProvidersTable() {
    return `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; color: #666; font-weight: 600;">Nome</th>
                        <th style="padding: 10px; text-align: left; color: #666; font-weight: 600;">Especialidade</th>
                        <th style="padding: 10px; text-align: center; color: #666; font-weight: 600;">Avaliação</th>
                        <th style="padding: 10px; text-align: center; color: #666; font-weight: 600;">Serviços</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.topProviders.map(provider => `
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 10px; color: #333;">${provider.name}</td>
                            <td style="padding: 10px; color: #666;">${provider.specialty}</td>
                            <td style="padding: 10px; text-align: center; color: #ffc107; font-weight: 600;">
                                ${provider.rating} ★
                            </td>
                            <td style="padding: 10px; text-align: center; color: #00BCD4; font-weight: 600;">
                                ${provider.services}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Função para criar controles do sistema
function createSystemControls() {
    return `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="toggleSystemMaintenance()" style="
                background: #dc3545; color: white; border: none; padding: 12px;
                border-radius: 8px; cursor: pointer; font-weight: 600;
                display: flex; align-items: center; gap: 8px;
            ">
                <i class="fas fa-tools"></i> Modo Manutenção
            </button>
            
            <button onclick="sendSystemNotification()" style="
                background: #17a2b8; color: white; border: none; padding: 12px;
                border-radius: 8px; cursor: pointer; font-weight: 600;
                display: flex; align-items: center; gap: 8px;
            ">
                <i class="fas fa-bullhorn"></i> Enviar Notificação
            </button>
            
            <button onclick="generateReport()" style="
                background: #6f42c1; color: white; border: none; padding: 12px;
                border-radius: 8px; cursor: pointer; font-weight: 600;
                display: flex; align-items: center; gap: 8px;
            ">
                <i class="fas fa-file-pdf"></i> Gerar Relatório
            </button>
            
            <button onclick="manageUsers()" style="
                background: #28a745; color: white; border: none; padding: 12px;
                border-radius: 8px; cursor: pointer; font-weight: 600;
                display: flex; align-items: center; gap: 8px;
            ">
                <i class="fas fa-users-cog"></i> Gerenciar Usuários
            </button>
        </div>
    `;
}

// Funções administrativas
function refreshAdminData() {
    showNotification('Dados administrativos atualizados!', 'success');
    // Aqui você recarregaria os dados do servidor
}

function exportAdminReport() {
    showNotification('Relatório exportado com sucesso!', 'success');
    // Simular download do relatório
}

function toggleSystemMaintenance() {
    const isMaintenanceMode = confirm('Deseja ativar o modo de manutenção?');
    if (isMaintenanceMode) {
        showNotification('Modo de manutenção ativado!', 'warning');
    }
}

function sendSystemNotification() {
    const message = prompt('Digite a mensagem para enviar a todos os usuários:');
    if (message) {
        showNotification(`Notificação enviada: "${message}"`, 'info');
    }
}

function generateReport() {
    showAdvancedLoading(document.querySelector('#admin-dashboard'), 2000);
    setTimeout(() => {
        showNotification('Relatório gerado com sucesso!', 'success');
    }, 2000);
}

function manageUsers() {
    showNotification('Abrindo painel de gerenciamento de usuários...', 'info');
    // Aqui você abriria um modal ou navegaria para a tela de usuários
}

// Sistema de Relatórios e Análises Avançadas
const reportingSystem = {
    enabled: true,
    reportTypes: ['financial', 'users', 'services', 'performance'],
    charts: {
        revenue: null,
        users: null,
        services: null
    }
};

// Dados para relatórios
const reportData = {
    financial: {
        monthlyRevenue: [32000, 38000, 45000, 42000, 47000, 52000],
        months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        expenses: [15000, 18000, 20000, 19000, 21000, 23000],
        profit: [17000, 20000, 25000, 23000, 26000, 29000]
    },
    users: {
        growth: [850, 920, 1050, 1180, 1280, 1400],
        active: [680, 740, 820, 890, 950, 1020],
        retention: [0.85, 0.88, 0.82, 0.89, 0.91, 0.87]
    },
    services: {
        completed: [234, 267, 298, 312, 345, 378],
        categories: {
            'Eletricista': 145,
            'Encanador': 112,
            'Chaveiro': 89,
            'Mecânico': 98,
            'Limpeza': 67,
            'Outros': 123
        }
    }
};

// Função para criar sistema de relatórios
function createReportingSystem() {
    const reportModal = document.createElement('div');
    reportModal.id = 'reporting-modal';
    reportModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: none;
        z-index: 10000;
        align-items: center;
        justify-content: center;
    `;
    
    reportModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            width: 95%;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #00BCD4;">
                    <i class="fas fa-chart-bar"></i> Sistema de Relatórios
                </h2>
                <button onclick="closeReportingModal()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            
            <!-- Filtros de Relatório -->
            <div style="
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            ">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        Tipo de Relatório:
                    </label>
                    <select id="report-type" onchange="updateReportType()" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                    ">
                        <option value="financial">Financeiro</option>
                        <option value="users">Usuários</option>
                        <option value="services">Serviços</option>
                        <option value="performance">Performance</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        Período:
                    </label>
                    <select id="report-period" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                    ">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 3 meses</option>
                        <option value="365" selected>Último ano</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        Formato:
                    </label>
                    <select id="report-format" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                    ">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                
                <div style="display: flex; align-items: end;">
                    <button onclick="generateCustomReport()" style="
                        background: #00BCD4;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        width: 100%;
                    ">
                        <i class="fas fa-download"></i> Gerar Relatório
                    </button>
                </div>
            </div>
            
            <!-- Área de Visualização do Relatório -->
            <div id="report-content">
                ${createFinancialReport()}
            </div>
        </div>
    `;
    
    return reportModal;
}

// Função para criar relatório financeiro
function createFinancialReport() {
    return `
        <div style="display: grid; gap: 20px;">
            <!-- Resumo Financeiro -->
            <div style="
                background: linear-gradient(135deg, #00BCD4, #00ACC1);
                color: white;
                padding: 20px;
                border-radius: 12px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            ">
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">R$ 52K</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Receita do Mês</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">R$ 29K</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Lucro Líquido</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">+15%</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Crescimento</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">378</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Serviços</p>
                </div>
            </div>
            
            <!-- Gráficos -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <!-- Gráfico de Receita -->
                <div style="
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 20px;
                ">
                    <h4 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-chart-line"></i> Evolução da Receita
                    </h4>
                    <div id="revenue-chart-detailed" style="
                        height: 250px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    ">
                        <canvas id="revenue-canvas" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <!-- Distribuição por Categoria -->
                <div style="
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 20px;
                ">
                    <h4 style="margin: 0 0 15px 0; color: #333;">
                        <i class="fas fa-chart-pie"></i> Por Categoria
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${Object.entries(reportData.services.categories).map(([category, value]) => `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #666; font-size: 0.9rem;">${category}</span>
                                <span style="font-weight: 600; color: #00BCD4;">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Tabela Detalhada -->
            <div style="
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 20px;
            ">
                <h4 style="margin: 0 0 15px 0; color: #333;">
                    <i class="fas fa-table"></i> Detalhamento Mensal
                </h4>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Mês</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">Receita</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">Despesas</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">Lucro</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">Margem</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.financial.months.map((month, index) => {
                                const revenue = reportData.financial.monthlyRevenue[index];
                                const expenses = reportData.financial.expenses[index];
                                const profit = reportData.financial.profit[index];
                                const margin = ((profit / revenue) * 100).toFixed(1);
                                
                                return `
                                    <tr style="border-bottom: 1px solid #f0f0f0;">
                                        <td style="padding: 12px; font-weight: 600;">${month}/2024</td>
                                        <td style="padding: 12px; text-align: right; color: #28a745;">
                                            R$ ${revenue.toLocaleString('pt-BR')}
                                        </td>
                                        <td style="padding: 12px; text-align: right; color: #dc3545;">
                                            R$ ${expenses.toLocaleString('pt-BR')}
                                        </td>
                                        <td style="padding: 12px; text-align: right; color: #00BCD4; font-weight: 600;">
                                            R$ ${profit.toLocaleString('pt-BR')}
                                        </td>
                                        <td style="padding: 12px; text-align: right; color: #6f42c1;">
                                            ${margin}%
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Funções de controle do sistema de relatórios
function updateReportType() {
    const reportType = document.getElementById('report-type').value;
    const reportContent = document.getElementById('report-content');
    
    showAdvancedLoading(reportContent, 1000);
    
    setTimeout(() => {
        switch(reportType) {
            case 'financial':
                reportContent.innerHTML = createFinancialReport();
                break;
            case 'users':
                reportContent.innerHTML = createUsersReport();
                break;
            case 'services':
                reportContent.innerHTML = createServicesReport();
                break;
            case 'performance':
                reportContent.innerHTML = createPerformanceReport();
                break;
        }
    }, 1000);
}

function generateCustomReport() {
    const type = document.getElementById('report-type').value;
    const period = document.getElementById('report-period').value;
    const format = document.getElementById('report-format').value;
    
    showAdvancedLoading(document.querySelector('#reporting-modal'), 2000);
    
    setTimeout(() => {
        showNotification(`Relatório ${type} (${period} dias) gerado em ${format.toUpperCase()}!`, 'success');
        closeReportingModal();
    }, 2000);
}

function openReportingModal() {
    const modal = document.getElementById('reporting-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeReportingModal() {
    const modal = document.getElementById('reporting-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== INSTRUÇÃO 5: MELHORIAS DE EXPERIÊNCIA =====

// Sistema de Tutorial Interativo
let tutorialSystem = {
    enabled: true,
    currentStep: 0,
    isActive: false,
    steps: [
        {
            target: '#search-input',
            title: 'Bem-vindo ao ChamadoPro!',
            content: 'Use a barra de pesquisa para encontrar prestadores próximos a você.',
            position: 'bottom'
        },
        {
            target: '#filter-toggle',
            title: 'Filtros Avançados',
            content: 'Use os filtros para refinar sua busca por preço, distância e avaliação.',
            position: 'left'
        },
        {
            target: '.badge-premium',
            title: 'Prestadores Premium',
            content: 'Prestadores com selo premium oferecem garantia e atendimento prioritário.',
            position: 'top'
        },
        {
            target: '#notification-bell',
            title: 'Notificações',
            content: 'Receba atualizações em tempo real sobre seus chamados.',
            position: 'bottom'
        }
    ]
};

// Sistema de Onboarding
function createOnboardingSystem() {
    const onboarding = document.createElement('div');
    onboarding.id = 'onboarding-overlay';
    onboarding.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 15000;
        display: none;
        align-items: center;
        justify-content: center;
    `;
    
    onboarding.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            position: relative;
            animation: bounceIn 0.8s ease;
        ">
            <div id="onboarding-content">
                <!-- Conteúdo será inserido dinamicamente -->
            </div>
            
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
            ">
                <button onclick="skipOnboarding()" style="
                    background: none;
                    border: 1px solid #ddd;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    color: #666;
                ">
                    Pular Tutorial
                </button>
                
                <div style="display: flex; gap: 5px;">
                    <span id="step-indicators"></span>
                </div>
                
                <button onclick="nextOnboardingStep()" style="
                    background: #00BCD4;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <span id="next-button-text">Próximo</span>
                </button>
            </div>
        </div>
    `;
    
    return onboarding;
}

// Sistema de Assistente Virtual (Chatbot)
let virtualAssistant = {
    enabled: true,
    isOpen: false,
    context: 'general',
    responses: {
        greeting: [
            'Olá! Como posso ajudá-lo hoje? 😊',
            'Oi! Precisa de ajuda para encontrar um prestador?',
            'Bem-vindo! Estou aqui para ajudá-lo.'
        ],
        help: [
            'Posso ajudá-lo a encontrar prestadores, explicar como funciona a plataforma ou tirar dúvidas sobre pagamentos.',
            'Estou aqui para ajudar! Posso explicar como usar os filtros, como contratar um serviço ou como avaliar um prestador.'
        ],
        services: [
            'Temos prestadores nas categorias: Eletricista, Encanador, Chaveiro, Mecânico, Limpeza e muito mais!',
            'Você pode encontrar profissionais qualificados em diversas áreas. Que tipo de serviço precisa?'
        ]
    }
};

function createVirtualAssistant() {
    const assistant = document.createElement('div');
    assistant.id = 'virtual-assistant';
    assistant.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 12000;
    `;
    
    assistant.innerHTML = `
        <!-- Botão do Assistente -->
        <button id="assistant-toggle" onclick="toggleAssistant()" style="
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00BCD4, #00ACC1);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,188,212,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <i class="fas fa-headset"></i>
        </button>
        
        <!-- Chat do Assistente -->
        <div id="assistant-chat" style="
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 350px;
            height: 400px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        ">
            <!-- Header do Chat -->
            <div style="
                background: linear-gradient(135deg, #00BCD4, #00ACC1);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-headset"></i>
                <div>
                    <h4 style="margin: 0; font-size: 1rem;">Assistente ChamadoPro</h4>
                    <small style="opacity: 0.9;">Online agora</small>
                </div>
            </div>
            
            <!-- Área de Mensagens -->
            <div id="chat-messages" style="
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8f9fa;
            ">
                <div class="assistant-message">
                    <div style="
                        background: white;
                        padding: 12px;
                        border-radius: 12px;
                        margin-bottom: 10px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        animation: slideInLeft 0.5s ease;
                    ">
                        Olá! Como posso ajudá-lo hoje? 😊
                    </div>
                </div>
            </div>
            
            <!-- Input de Mensagem -->
            <div style="
                padding: 15px;
                background: white;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 10px;
                align-items: center;
            ">
                <input 
                    type="text" 
                    id="assistant-input"
                    placeholder="Digite sua mensagem..."
                    style="
                        flex: 1;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 20px;
                        outline: none;
                        font-size: 0.9rem;
                    "
                    onkeypress="if(event.key==='Enter') sendAssistantMessage()"
                >
                <button onclick="sendAssistantMessage()" style="
                    background: #00BCD4;
                    color: white;
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            
            <!-- Sugestões Rápidas -->
            <div id="quick-suggestions" style="
                padding: 10px 15px;
                background: white;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
            ">
                <button onclick="askAssistant('Como funciona?')" style="
                    background: #f0f0f0;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    color: #666;
                ">Como funciona?</button>
                <button onclick="askAssistant('Encontrar eletricista')" style="
                    background: #f0f0f0;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    color: #666;
                ">Eletricista</button>
                <button onclick="askAssistant('Como pagar?')" style="
                    background: #f0f0f0;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    color: #666;
                ">Pagamento</button>
            </div>
        </div>
    `;
    
    return assistant;
}

// Sistema de Feedback e Avaliação Melhorado
function createAdvancedFeedbackSystem() {
    const feedbackModal = document.createElement('div');
    feedbackModal.id = 'advanced-feedback-modal';
    feedbackModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: none;
        z-index: 11000;
        align-items: center;
        justify-content: center;
    `;
    
    feedbackModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: bounceIn 0.6s ease;
        ">
            <button onclick="closeFeedbackModal()" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">×</button>
            
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333;">Como foi sua experiência?</h2>
                <p style="color: #666; margin: 10px 0 0 0;">
                    Sua opinião nos ajuda a melhorar a plataforma
                </p>
            </div>
            
            <!-- Avaliação por Estrelas -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 2rem; margin-bottom: 10px;">
                    <span class="star-rating" data-rating="0">
                        <i class="far fa-star" data-star="1" onclick="setFeedbackRating(1)"></i>
                        <i class="far fa-star" data-star="2" onclick="setFeedbackRating(2)"></i>
                        <i class="far fa-star" data-star="3" onclick="setFeedbackRating(3)"></i>
                        <i class="far fa-star" data-star="4" onclick="setFeedbackRating(4)"></i>
                        <i class="far fa-star" data-star="5" onclick="setFeedbackRating(5)"></i>
                    </span>
                </div>
                <p id="rating-text" style="color: #666; margin: 0;">Clique nas estrelas para avaliar</p>
            </div>
            
            <!-- Aspectos Específicos -->
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #333;">O que você achou de:</h4>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Facilidade de uso:</span>
                        <div class="aspect-rating" data-aspect="usability">
                            <i class="far fa-star" data-rating="1" onclick="setAspectRating('usability', 1)"></i>
                            <i class="far fa-star" data-rating="2" onclick="setAspectRating('usability', 2)"></i>
                            <i class="far fa-star" data-rating="3" onclick="setAspectRating('usability', 3)"></i>
                            <i class="far fa-star" data-rating="4" onclick="setAspectRating('usability', 4)"></i>
                            <i class="far fa-star" data-rating="5" onclick="setAspectRating('usability', 5)"></i>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Qualidade dos prestadores:</span>
                        <div class="aspect-rating" data-aspect="quality">
                            <i class="far fa-star" data-rating="1" onclick="setAspectRating('quality', 1)"></i>
                            <i class="far fa-star" data-rating="2" onclick="setAspectRating('quality', 2)"></i>
                            <i class="far fa-star" data-rating="3" onclick="setAspectRating('quality', 3)"></i>
                            <i class="far fa-star" data-rating="4" onclick="setAspectRating('quality', 4)"></i>
                            <i class="far fa-star" data-rating="5" onclick="setAspectRating('quality', 5)"></i>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Velocidade de resposta:</span>
                        <div class="aspect-rating" data-aspect="speed">
                            <i class="far fa-star" data-rating="1" onclick="setAspectRating('speed', 1)"></i>
                            <i class="far fa-star" data-rating="2" onclick="setAspectRating('speed', 2)"></i>
                            <i class="far fa-star" data-rating="3" onclick="setAspectRating('speed', 3)"></i>
                            <i class="far fa-star" data-rating="4" onclick="setAspectRating('speed', 4)"></i>
                            <i class="far fa-star" data-rating="5" onclick="setAspectRating('speed', 5)"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Comentário -->
            <div style="margin-bottom: 20px;">
                <textarea 
                    id="feedback-comment" 
                    placeholder="Conte-nos mais sobre sua experiência (opcional)..."
                    style="
                        width: 100%;
                        min-height: 80px;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        resize: vertical;
                        font-family: inherit;
                        font-size: 0.9rem;
                    "
                ></textarea>
            </div>
            
            <!-- Botões de Ação -->
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="closeFeedbackModal()" style="
                    background: none;
                    border: 1px solid #ddd;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    color: #666;
                ">
                    Cancelar
                </button>
                <button onclick="submitAdvancedFeedback()" style="
                    background: #00BCD4;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Enviar Feedback
                </button>
            </div>
        </div>
    `;
    
    return feedbackModal;
}

// Funções de controle dos sistemas de experiência

// Controle do Assistente Virtual
function toggleAssistant() {
    const chat = document.getElementById('assistant-chat');
    const toggle = document.getElementById('assistant-toggle');
    
    if (virtualAssistant.isOpen) {
        chat.style.display = 'none';
        toggle.innerHTML = '<i class="fas fa-headset"></i>';
        virtualAssistant.isOpen = false;
    } else {
        chat.style.display = 'flex';
        toggle.innerHTML = '<i class="fas fa-times"></i>';
        virtualAssistant.isOpen = true;
    }
}

function sendAssistantMessage() {
    const input = document.getElementById('assistant-input');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simular resposta do assistente
        setTimeout(() => {
            const response = generateAssistantResponse(message);
            addChatMessage(response, 'assistant');
        }, 1000);
    }
}

function askAssistant(question) {
    const input = document.getElementById('assistant-input');
    input.value = question;
    sendAssistantMessage();
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div style="
                background: #00BCD4;
                color: white;
                padding: 12px;
                border-radius: 12px;
                margin-bottom: 10px;
                margin-left: 50px;
                animation: slideInRight 0.5s ease;
            ">${message}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div style="
                background: white;
                padding: 12px;
                border-radius: 12px;
                margin-bottom: 10px;
                margin-right: 50px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                animation: slideInLeft 0.5s ease;
            ">${message}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAssistantResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi')) {
        return virtualAssistant.responses.greeting[Math.floor(Math.random() * virtualAssistant.responses.greeting.length)];
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
        return virtualAssistant.responses.help[Math.floor(Math.random() * virtualAssistant.responses.help.length)];
    }
    
    if (lowerMessage.includes('serviço') || lowerMessage.includes('prestador')) {
        return virtualAssistant.responses.services[Math.floor(Math.random() * virtualAssistant.responses.services.length)];
    }
    
    if (lowerMessage.includes('eletricista')) {
        return 'Encontrei vários eletricistas qualificados na sua região! Use o filtro de especialidade para ver apenas eletricistas. 💡';
    }
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('quanto')) {
        return 'Os preços variam conforme o tipo de serviço. Use nosso filtro de faixa de preço para encontrar opções dentro do seu orçamento! 💰';
    }
    
    if (lowerMessage.includes('pagar') || lowerMessage.includes('pagamento')) {
        return 'Aceitamos várias formas de pagamento: cartão, PIX, dinheiro. O pagamento é feito diretamente com o prestador após o serviço! 💳';
    }
    
    return 'Interessante! Posso ajudá-lo a encontrar prestadores, explicar como usar a plataforma ou tirar dúvidas sobre pagamentos. O que gostaria de saber?';
}

// Controle do Sistema de Feedback
let feedbackData = {
    overall: 0,
    aspects: {
        usability: 0,
        quality: 0,
        speed: 0
    }
};

function setFeedbackRating(rating) {
    feedbackData.overall = rating;
    const stars = document.querySelectorAll('.star-rating i');
    const ratingText = document.getElementById('rating-text');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
            star.style.color = '#ffc107';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#ddd';
        }
    });
    
    const ratingTexts = [
        'Clique nas estrelas para avaliar',
        'Muito ruim 😞',
        'Ruim 😐',
        'Regular 🙂',
        'Bom 😊',
        'Excelente! 🌟'
    ];
    
    ratingText.textContent = ratingTexts[rating];
}

function setAspectRating(aspect, rating) {
    feedbackData.aspects[aspect] = rating;
    const container = document.querySelector(`[data-aspect="${aspect}"]`);
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
            star.style.color = '#ffc107';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#ddd';
        }
    });
}

function submitAdvancedFeedback() {
    const comment = document.getElementById('feedback-comment').value;
    
    if (feedbackData.overall === 0) {
        showNotification('Por favor, avalie sua experiência geral', 'warning');
        return;
    }
    
    // Simular envio do feedback
    showAdvancedLoading(document.querySelector('#advanced-feedback-modal'), 1500);
    
    setTimeout(() => {
        showNotification('Obrigado pelo seu feedback! 🙏', 'success');
        closeFeedbackModal();
        
        // Reset feedback data
        feedbackData = {
            overall: 0,
            aspects: { usability: 0, quality: 0, speed: 0 }
        };
    }, 1500);
}

function openFeedbackModal() {
    const modal = document.getElementById('advanced-feedback-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('advanced-feedback-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Sistema de Onboarding
function startOnboarding() {
    console.log('� startOnboarding() bloqueado temporariamente para debug!');
    return; // Bloqueia a execução da função
    
    console.log('�🚀 startOnboarding() foi chamada!', {
        'stack': new Error().stack,
        'tutorialSystem': tutorialSystem
    });
    
    tutorialSystem.isActive = true;
    tutorialSystem.currentStep = 0;
    
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        updateOnboardingContent();
    }
}

function updateOnboardingContent() {
    const content = document.getElementById('onboarding-content');
    const indicators = document.getElementById('step-indicators');
    const nextButton = document.getElementById('next-button-text');
    
    const currentStep = tutorialSystem.steps[tutorialSystem.currentStep];
    
    content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <i class="fas fa-lightbulb" style="font-size: 3rem; color: #00BCD4; margin-bottom: 15px;"></i>
            <h3 style="margin: 0; color: #333;">${currentStep.title}</h3>
            <p style="color: #666; margin: 10px 0 0 0; line-height: 1.5;">
                ${currentStep.content}
            </p>
        </div>
    `;
    
    // Indicadores de progresso
    indicators.innerHTML = tutorialSystem.steps.map((_, index) => 
        `<div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${index === tutorialSystem.currentStep ? '#00BCD4' : '#ddd'};
            transition: all 0.3s ease;
        "></div>`
    ).join('');
    
    // Texto do botão
    nextButton.textContent = tutorialSystem.currentStep === tutorialSystem.steps.length - 1 ? 'Concluir' : 'Próximo';
}

function nextOnboardingStep() {
    if (tutorialSystem.currentStep < tutorialSystem.steps.length - 1) {
        tutorialSystem.currentStep++;
        updateOnboardingContent();
    } else {
        completeOnboarding();
    }
}

function skipOnboarding() {
    if (confirm('Deseja pular o tutorial? Você pode acessá-lo novamente no menu de ajuda.')) {
        completeOnboarding();
    }
}

function completeOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    tutorialSystem.isActive = false;
    localStorage.setItem('onboarding_completed', 'true');
    showNotification('Tutorial concluído! Bem-vindo ao ChamadoPro! 🎉', 'success');
}

// Funções de inicialização dos sistemas de experiência
function initializeExperienceSystems() {
    // Adicionar sistemas ao DOM
    if (!document.getElementById('onboarding-overlay')) {
        document.body.appendChild(createOnboardingSystem());
    }
    
    // FORÇAR OCULTAÇÃO DO TUTORIAL
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        console.log('🚫 Tutorial forçadamente ocultado!');
    }
    
    if (!document.getElementById('virtual-assistant')) {
        document.body.appendChild(createVirtualAssistant());
    }
    
    if (!document.getElementById('advanced-feedback-modal')) {
        document.body.appendChild(createAdvancedFeedbackSystem());
    }
    
    // Onboarding será iniciado apenas após o login, não automaticamente
}

// Função para mostrar o painel administrativo
function showAdminDashboard() {
    // Verificar se o dashboard já existe
    let dashboard = document.getElementById('admin-dashboard');
    if (!dashboard) {
        dashboard = createAdminDashboard();
        document.body.appendChild(dashboard);
    }
    
    // Ocultar outras seções
    const sections = ['home-section', 'provider-section', 'profile-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'none';
    });
    
    // Mostrar dashboard
    dashboard.style.display = 'block';
    
    // Atualizar navegação
    updateActiveNavItem('admin');
}

// Atualizar sistema de navegação para incluir admin
function updateActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.textContent.toLowerCase().includes(activeItem) || 
            (activeItem === 'admin' && item.textContent.includes('Admin'))) {
            item.classList.add('active');
        }
    });
}

// Array de exemplo para propostas recebidas
const propostasRecebidas = [
  {
    id: 1,
    tipo: 'padrao',
    prestador: 'Eletricista Silva',
    servico: 'Instalação de Tomada',
    valor: 'R$ 120,00',
    prazo: '2 dias',
    mensagem: 'Inclui material e mão de obra.'
  },
  {
    id: 2,
    tipo: 'visita',
    prestador: 'Construtora Alfa',
    servico: 'Orçamento com Visita para Reforma',
    dataHora: '23/07/2025 às 14:00',
    mensagem: 'Levaremos todo material necessário para avaliação.'
  },
  {
    id: 3,
    tipo: 'padrao',
    prestador: 'Encanador Souza',
    servico: 'Reparo de Vazamento',
    valor: 'R$ 250,00',
    prazo: '1 dia',
    mensagem: 'Orçamento para reparo de vazamento em pia de cozinha.'
  },
  {
    id: 4,
    tipo: 'visita',
    prestador: 'Jardineiro Flores',
    servico: 'Avaliação de Paisagismo',
    dataHora: '25/07/2025 às 10:00',
    mensagem: 'Visita para discutir projeto de paisagismo completo.'
  }
];

// Array de exemplo para solicitações de orçamento do usuário
let orcamentosUsuarioSolicitados = [
    { id: 1, title: 'Instalação de Tomada', description: 'Preciso instalar uma tomada nova na cozinha.', client: 'Eu', address: 'Rua A, 123', date: '2024-07-15', photos: ['https://placehold.co/100x100/FF0000/FFFFFF?text=Foto1'], video: '', tipo: 'padrao' },
    { id: 2, title: 'Pintura de Quarto', description: 'Pintar um quarto de 3x4m, cor branca.', client: 'Eu', address: 'Rua B, 456', date: '2024-07-14', photos: [], video: '', tipo: 'padrao' },
    { id: 3, title: 'Conserto de Telhado', description: 'Vazamento no telhado da sala.', client: 'Eu', address: 'Rua C, 789', date: '2024-07-16', photos: ['https://placehold.co/100x100/0000FF/FFFFFF?text=FotoTelhado'], video: '', tipo: 'padrao' },
    { id: 4, title: 'Avaliação de Reforma', description: 'Preciso de um orçamento com visita para avaliar reforma da cozinha.', client: 'Eu', address: 'Rua D, 100', date: '2024-07-17', photos: [], video: '', tipo: 'visita' }
];
let orcamentosUsuarioRecebidos = [
    { id: 101, prestador: 'Eletricista Silva', service: 'Instalação de Tomada', value: 'R$ 150,00', date: '2024-07-15', estimatedTime: 2, description: 'Proposta para instalação de tomada com material incluso.', materials: 'Fio 2.5mm, tomada 10A', tipo: 'padrao' },
    { id: 102, prestador: 'Pintor João', service: 'Pintura de Quarto', value: 'R$ 400,00', date: '2024-07-14', estimatedTime: 8, description: 'Proposta para pintura completa do quarto, duas demãos.', materials: 'Tinta Suvinil Branca', tipo: 'padrao' },
    { id: 103, prestador: 'Telhadista Carlos', service: 'Conserto de Telhado', value: 'R$ 600,00', date: '2024-07-17', estimatedTime: 4, description: 'Orçamento para reparo de telhado com troca de algumas telhas.', materials: 'Telhas, argamassa', tipo: 'padrao' },
    { id: 104, prestador: 'Arquiteto Ana', service: 'Consultoria de Reforma', value: 'R$ 300,00', date: '2024-07-18', estimatedTime: 3, description: 'Orçamento com visita para avaliação de reforma.', materials: 'Relatório técnico', tipo: 'visita' }
];
let orcamentosUsuarioAprovados = [
    { id: 201, prestador: 'Eletricista Silva', service: 'Instalação de Tomada', value: 'R$ 150,00', date: '2024-07-15', estimatedTime: 2, description: 'Proposta para instalação de tomada com material incluso.', materials: 'Fio 2.5mm, tomada 10A', scheduleDate: '2024-07-25', scheduleTime: '09:00', tipo: 'padrao' },
    { id: 202, prestador: 'Inspetor Técnico', service: 'Vistoria Predial', value: 'R$ 250,00', date: '2024-07-16', estimatedTime: 4, description: 'Vistoria técnica completa do imóvel.', materials: 'Relatório técnico', scheduleDate: '2024-07-26', scheduleTime: '14:00', tipo: 'visita' }
];
let orcamentosUsuarioRecusados = [
    { id: 301, prestador: 'Encanador Souza', service: 'Reparo de Vazamento', value: 'R$ 280,00', date: '2024-07-16', estimatedTime: 3, description: 'Proposta para reparo de vazamento.', materials: 'Vedante, chave de grifo', reason: 'Preço muito alto.', tipo: 'padrao' },
    { id: 302, prestador: 'Engenheiro Civil', service: 'Avaliação Estrutural', value: 'R$ 800,00', date: '2024-07-17', estimatedTime: 6, description: 'Avaliação estrutural completa.', materials: 'Laudo técnico', reason: 'Não disponível nas datas propostas.', tipo: 'visita' }
];
let orcamentosUsuarioVisitas = [
    { id: 401, prestador: 'Construtora Alfa', suggestedDate1: '2024-07-28', suggestedTime1: '14:00', suggestedDate2: '2024-07-29', suggestedTime2: '10:00', suggestedDate3: '', suggestedTime3: '', obs: 'Para avaliação de reforma de cozinha.', status: 'Aguardando Confirmação' }
];

// Array de visitas marcadas (efetivadas com data e horário)
let visitasMarcadas = [
    {
        id: 1,
        prestador: 'Eletricista Silva',
        service: 'Instalação de Tomada Especial',
        date: '2024-07-25',
        time: '09:00',
        address: 'Rua A, 123',
        value: 'R$ 150,00',
        tipo: 'padrao',
        status: 'Confirmada',
        description: 'Instalação de tomada com material incluso.'
    },
    {
        id: 2,
        prestador: 'Arquiteto Ana',
        service: 'Consultoria de Reforma',
        date: '2024-07-26',
        time: '14:00',
        address: 'Rua D, 100',
        value: 'R$ 300,00',
        tipo: 'visita',
        status: 'Confirmada',
        description: 'Visita para avaliação completa de reforma da cozinha.'
    }
];

// Array de trabalhos em execução
let trabalhosEmExecucao = [
    {
        id: 1,
        prestador: 'João Silva',
        service: 'Instalação Elétrica',
        value: 'R$ 450,00',
        dataInicio: '2024-07-20',
        tempoEstimado: '3 dias',
        tipo: 'padrao',
        status: 'Em Execução',
        progresso: 60,
        address: 'Rua A, 123',
        description: 'Instalação completa do sistema elétrico'
    },
    {
        id: 2,
        prestador: 'Ana Costa',
        service: 'Pintura de Casa',
        value: 'R$ 1200,00',
        dataInicio: '2024-07-18',
        tempoEstimado: '5 dias',
        tipo: 'visita',
        status: 'Em Execução',
        progresso: 80,
        address: 'Rua B, 456',
        description: 'Pintura completa da casa - 3 quartos'
    }
];

// Array de trabalhos finalizados
let trabalhosFinalizados = [
    {
        id: 1,
        prestador: 'Carlos Mendes',
        service: 'Conserto de Torneira',
        value: 'R$ 80,00',
        dataInicio: '2024-07-10',
        dataFinalizacao: '2024-07-10',
        tempoRealizado: '2 horas',
        tipo: 'padrao',
        status: 'Finalizado',
        address: 'Rua C, 789',
        description: 'Reparo em torneira da cozinha',
        avaliacao: 5,
        comentario: 'Serviço excelente, muito rápido!',
        prestadorPhone: '(11) 99999-9999',
        prestadorWhatsapp: '5511999999999'
    },
    {
        id: 2,
        prestador: 'Maria Santos',
        service: 'Limpeza Profunda',
        value: 'R$ 200,00',
        dataInicio: '2024-07-05',
        dataFinalizacao: '2024-07-05',
        tempoRealizado: '4 horas',
        tipo: 'visita',
        status: 'Finalizado',
        address: 'Rua D, 321',
        description: 'Limpeza completa do apartamento',
        avaliacao: 5,
        comentario: 'Trabalho impecável!',
        prestadorPhone: '(11) 88888-8888',
        prestadorWhatsapp: '5511888888888'
    }
];

// Copiloto: Implementar a funcionalidade 'Serviços 24Hrs' conforme instruções detalhadas.
// Foco em demonstração simulada para investidores.

// Dados simulados para TIPOS de Serviços 24 Horas
const servicosUrgentesTipos = [
    { id: 'urg_eletricista', nome: 'Eletricista - Curto Circuito', valorBase: 180.00, icone: 'fas fa-bolt' },
    { id: 'urg_encanador', nome: 'Encanador - Vazamento Grave', valorBase: 220.00, icone: 'fas fa-faucet' },
    { id: 'urg_chaveiro', nome: 'Chaveiro - Abertura de Porta', valorBase: 150.00, icone: 'fas fa-key' },
    { id: 'urg_vidraceiro', nome: 'Vidraceiro - Vidro Quebrado', valorBase: 200.00, icone: 'fas fa-glass-martini-alt' },
    { id: 'urg_borracheiro', nome: 'Borracheiro - Pneu Furado', valorBase: 120.00, icone: 'fas fa-tire' },
    { id: 'urg_mecanico', nome: 'Mecânico - Emergência Auto', valorBase: 250.00, icone: 'fas fa-wrench' }
];

// Dados dos Prestadores de Serviços de Urgência com informações de valor
const prestadoresUrgentesSimulados = [
  {
    id: 1,
    nome: "João Chaveiro Express",
    especialidade: "Chaveiro",
    especialidadeId: 1,
    foto: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.9,
    distancia: 2.3,
    valorBaseServico: 80,
    custoPorKmDeslocamento: 3.50,
    telefone: "(11) 98765-4321",
    bio: "Especialista em emergências com fechaduras. Atendimento 24h com chegada em até 30 minutos.",
    patrocinado: true
  },
  {
    id: 2,
    nome: "Maria Desentupidora Rápida",
    especialidade: "Desentupimento",
    especialidadeId: 2,
    foto: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.7,
    distancia: 1.8,
    valorBaseServico: 120,
    custoPorKmDeslocamento: 4.00,
    telefone: "(11) 99876-5432",
    bio: "Desentupimento de emergência com equipamentos profissionais. Garantia de 30 dias.",
    patrocinado: false
  },
  {
    id: 3,
    nome: "Carlos Eletricista 24h",
    especialidade: "Eletricista",
    especialidadeId: 3,
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.8,
    distancia: 3.1,
    valorBaseServico: 150,
    custoPorKmDeslocamento: 5.00,
    telefone: "(11) 97654-3210",
    bio: "Eletricista especializado em emergências residenciais e comerciais. Certificado pelo CREA.",
    patrocinado: true
  },
  {
    id: 4,
    nome: "Ana Encanadora SOS",
    especialidade: "Encanamento",
    especialidadeId: 4,
    foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.6,
    distancia: 4.2,
    valorBaseServico: 100,
    custoPorKmDeslocamento: 3.00,
    telefone: "(11) 96543-2109",
    bio: "Encanadora com 15 anos de experiência. Atendimento de emergência com desconto para idosos.",
    patrocinado: false
  },
  {
    id: 5,
    nome: "Roberto Borracheiro Móvel",
    especialidade: "Borracheiro",
    especialidadeId: 5,
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.5,
    distancia: 5.7,
    valorBaseServico: 60,
    custoPorKmDeslocamento: 2.50,
    telefone: "(11) 95432-1098",
    bio: "Borracheiro móvel com van equipada. Troca de pneus e consertos no local onde você estiver.",
    patrocinado: false
  },
  {
    id: 6,
    nome: "Marcos Mecânico Express",
    especialidade: "Mecânico",
    especialidadeId: 6,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.9,
    distancia: 3.8,
    valorBaseServico: 200,
    custoPorKmDeslocamento: 6.00,
    telefone: "(11) 94321-0987",
    bio: "Mecânico especializado em emergências automotivas. Guincho próprio e ferramentas completas.",
    patrocinado: true
  },
  {
    id: 7,
    nome: "Pedro Chaveiro Noturno",
    especialidade: "Chaveiro",
    especialidadeId: 1,
    foto: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.4,
    distancia: 6.2,
    valorBaseServico: 75,
    custoPorKmDeslocamento: 3.00,
    telefone: "(11) 93210-9876",
    bio: "Chaveiro especializado em atendimento noturno. Experiência com todos os tipos de fechadura.",
    patrocinado: false
  },
  {
    id: 8,
    nome: "Lúcia Eletricista Urgente",
    especialidade: "Eletricista",
    especialidadeId: 3,
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.7,
    distancia: 2.9,
    valorBaseServico: 140,
    custoPorKmDeslocamento: 4.50,
    telefone: "(11) 92109-8765",
    bio: "Eletricista com especialização em sistemas de emergência e geradores. Atendimento feminino disponível.",
    patrocinado: false
  },
  {
    id: 9,
    nome: "Fernando Encanador 24h",
    especialidade: "Encanamento",
    especialidadeId: 4,
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    avaliacao: 4.8,
    distancia: 1.5,
    valorBaseServico: 110,
    custoPorKmDeslocamento: 3.50,
    telefone: "(11) 91098-7654",
    bio: "Encanador emergencial com equipamentos de alta pressão. Atendimento garantido em menos de 1 hora.",
    patrocinado: true
  }
];

// Dados simulados de prestadores para a DEMO (manter para compatibilidade)
const prestadoresSimulados = [
    { id: 'p_001', nome: 'João Silva', especialidade: 'Eletricista', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.8', localizacaoSimulada: 5, badges: ['verificado', 'premium'] },
    { id: 'p_002', nome: 'Maria Souza', especialidade: 'Encanador', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.7', localizacaoSimulada: 8, badges: ['verificado'] },
    { id: 'p_003', nome: 'Pedro Lima', especialidade: 'Chaveiro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.9', localizacaoSimulada: 3, badges: ['verificado', 'destaque'] },
    { id: 'p_004', nome: 'Ana Costa', especialidade: 'Vidraceiro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.6', localizacaoSimulada: 12, badges: ['verificado'] },
    { id: 'p_005', nome: 'Carlos Mendes', especialidade: 'Eletricista', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.5', localizacaoSimulada: 18, badges: [] },
    { id: 'p_006', nome: 'Ricardo Pneus', especialidade: 'Borracheiro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.7', localizacaoSimulada: 6, badges: ['verificado', 'especialista'] },
    { id: 'p_007', nome: 'Auto Socorro Silva', especialidade: 'Mecânico', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.9', localizacaoSimulada: 9, badges: ['verificado', 'premium', 'destaque'] },
    { id: 'p_008', nome: 'Borracharia do Paulo', especialidade: 'Borracheiro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.6', localizacaoSimulada: 14, badges: ['verificado'] },
    { id: 'p_009', nome: 'Oficina Rápida', especialidade: 'Mecânico', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', avaliacao: '4.8', localizacaoSimulada: 7, badges: ['verificado', 'especialista'] }
];

const TAXA_DESLOCAMENTO_KM = 3.50; // R$ 3,50 por km

let currentSelectedUrgentServiceData = null; // Armazena dados do serviço e prestador selecionado

// Configuração da plataforma para custo de deslocamento
const DISTANCIA_MAX_SIMULADA = 15; // Distância máxima simulada para o prestador em km

let orcamentosPrestadorRecebidos = [
    { id: 501, title: 'Instalação de Chuveiro', description: 'Preciso instalar um chuveiro novo no banheiro.', client: 'Mariana Costa', address: 'Rua D, 10', date: '2024-07-18', photos: [], video: '', tipo: 'padrao' },
    { id: 502, title: 'Manutenção de Ar Condicionado', description: 'Limpeza e verificação de um ar condicionado split.', client: 'Roberto Santos', address: 'Av. Brasil, 200', date: '2024-07-19', photos: [], video: '', tipo: 'padrao' },
    { id: 503, title: 'Avaliação de Projeto Arquitetônico', description: 'Preciso de um orçamento com visita para avaliar viabilidade de projeto.', client: 'Ana Silva', address: 'Rua E, 50', date: '2024-07-20', photos: [], video: '', tipo: 'visita' }
];
let orcamentosPrestadorPropostasEnviadas = [
    { id: 601, serviceTitle: 'Reparo de Vazamento', client: 'Maria Oliveira', value: 'R$ 250,00', deadline: '1 dia', estimatedTime: 2, obs: 'Orçamento detalhado para reparo.', date: '2024-07-17', status: 'Aguardando Cliente', tipo: 'padrao' }
];
let orcamentosPrestadorAprovados = [
    { id: 701, service: 'Pintura de Quarto', client: 'Carlos Souza', value: 'R$ 400,00', scheduleDate: '2024-07-26', scheduleTime: '08:00', tipo: 'padrao' }
];
let orcamentosPrestadorRecusados = [
    { id: 801, title: 'Limpeza de Jardim', client: 'Ana Paula', date: '2024-07-16', reason: 'Distância muito grande.', tipo: 'padrao' }
];

let userOccurrences = [
    { id: 1, service: 'Instalação de Tomada', title: 'Tomada não funciona', description: 'A tomada instalada parou de funcionar um dia após o serviço.', date: '2024-07-20', status: 'Em Análise', client: 'Usuário Atual', prestador: 'Eletricista Silva', attachments: [], chatHistory: [
        { sender: 'Plataforma', message: 'Ocorrência aberta. Nossa equipe está analisando.', type: 'platform-highlight' },
        { sender: 'Eu', message: 'A tomada está sem energia, já testei outros aparelhos.', type: 'sent' },
        { sender: 'Eletricista Silva', message: 'Entendido. Verificarei a disponibilidade para retornar.', type: 'received' }
    ]},
    { id: 2, service: 'Pintura de Quarto', title: 'Mancha na parede', description: 'Apareceu uma mancha amarelada na parede pintada.', date: '2024-07-21', status: 'Resolvida', client: 'Usuário Atual', prestador: 'Pintor João', attachments: [], resolutionDate: '2024-07-22', chatHistory: [
        { sender: 'Plataforma', message: 'Ocorrência aberta. Nossa equipe está analisando.', type: 'platform-highlight' },
        { sender: 'Eu', message: 'A mancha está bem visível, preciso de um reparo.', type: 'sent' },
        { sender: 'Pintor João', message: 'Já estou a caminho para verificar o problema.', type: 'received' },
        { sender: 'Plataforma', message: 'Ocorrência resolvida pelo prestador.', type: 'platform-highlight' }
    ]}
];
let providerOccurrences = [
    { id: 1, service: 'Instalação de Tomada', title: 'Tomada não funciona', description: 'A tomada instalada parou de funcionar um dia após o serviço.', date: '2024-07-20', status: 'Em Análise', client: 'Usuário Atual', prestador: 'Eletricista Silva', attachments: [], chatHistory: [
        { sender: 'Plataforma', message: 'Ocorrência aberta. Nossa equipe está analisando.', type: 'platform-highlight' },
        { sender: 'Usuário Atual', message: 'A tomada está sem energia, já testei outros aparelhos.', type: 'received' },
        { sender: 'Eu', message: 'Entendido. Verificarei a disponibilidade para retornar.', type: 'sent' }
    ]},
    { id: 2, service: 'Pintura de Quarto', title: 'Mancha na parede', description: 'Apareceu uma mancha amarelada na parede pintada.', date: '2024-07-21', status: 'Resolvida', client: 'Usuário Atual', prestador: 'Pintor João', attachments: [], resolutionDate: '2024-07-22', chatHistory: [
        { sender: 'Plataforma', message: 'Ocorrência aberta. Nossa equipe está analisando.', type: 'platform-highlight' },
        { sender: 'Usuário Atual', message: 'A mancha está bem visível, preciso de um reparo.', type: 'received' },
        { sender: 'Eu', message: 'Já estou a caminho para verificar o problema.', type: 'sent' },
        { sender: 'Plataforma', message: 'Ocorrência resolvida pelo prestador.', type: 'platform-highlight' }
    ]}
];

let currentFinalizeServiceId = null;
let currentChatPartner = '';
let currentRefusalRequestId = null; // Para prestador
let currentUserRefusalBudgetId = null; // Para usuário
let currentScheduleBudgetId = null; // Para agendamento

let totalRecebimentos = 1500.00; // Exemplo de valor inicial
let aLiberar = 250.00; // Exemplo de valor inicial
let bankAccounts = [
    { banco: 'Banco do Brasil', agencia: '1234-5', conta: '98765-4', tipoConta: 'corrente' }
]; // Array para armazenar contas bancárias

// Dados de exemplo de anúncios
const userAds = [
    "Descubra as melhores ofertas de material de construção! Descontos de até 30%!",
    "Precisa de um empréstimo rápido e sem burocracia? Clique aqui e simule agora!",
    "Cursos online para aprimorar suas habilidades e conseguir um emprego melhor!",
    "Reformar sua casa nunca foi tão fácil! Encontre os melhores profissionais aqui."
];
const prestadorAds = [
    "Aumente sua clientela com nosso plano de marketing digital! Mais visibilidade para o seu negócio.",
    "Ferramentas profissionais com 30% de desconto para prestadores cadastrados!",
    "Seguro de responsabilidade civil para o seu negócio. Proteja-se contra imprevistos!",
    "Capacitação e certificação para sua equipe. Invista no seu futuro profissional."
];
let currentAdIndexUser = 0;
let adIntervalUser;
let currentAdIndexPrestador = 0;
let adIntervalPrestador;

// Dados de exemplo de serviços patrocinados (Buscar Serviços)
const sponsoredServices = [
    { id: 1, name: "Eletricista 24h", description: "Atendimento rápido para emergências elétricas.", type: "eletricista" },
    { id: 2, name: "Encanador Especialista", description: "Reparos hidráulicos e desentupimento.", type: "encanador" },
    { id: 3, name: "Montador de Móveis Profissional", description: "Montagem e desmontagem de todos os tipos de móveis.", type: "montador" },
    { id: 4, name: "Serviços de Limpeza Residencial", description: "Limpeza profunda para sua casa ou apartamento.", type: "limpeza" },
    { id: 5, name: "Jardineiro Completo", description: "Poda, paisagismo e manutenção de jardins.", type: "jardineiro" },
    { id: 6, name: "Pedreiro para Pequenas Reformas", description: "Pequenos reparos e construções.", type: "pedreiro" },
    { id: 7, name: "Pintor de Interiores", description: "Pintura de paredes e tetos com acabamento impecável.", type: "pintor" },
    { id: 8, name: "Técnico em Ar Condicionado", description: "Instalação, manutenção e reparo de sistemas de climatização.", type: "ar condicionado" }
];

// Dados de exemplo de serviços de visita patrocinados
const sponsoredVisitServices = [
    { id: 1, name: "Construtora Alfa", description: "Grandes reformas e construções, com orçamento com visita.", type: "construcao", profile: { photos: ['https://placehold.co/150x100/FF0000/FFFFFF?text=Obra1', 'https://placehold.co/150x100/0000FF/FFFFFF?text=Obra2'], bio: 'Empresa com 10 anos de experiência em construção civil, especializada em projetos residenciais e comerciais de grande porte.' } },
    { id: 2, name: "Arquiteto Urbano", description: "Projetos arquitetônicos e design de interiores.", type: "arquitetura", profile: { photos: ['https://placehold.co/150x100/00FF00/FFFFFF?text=Projeto1', 'https://placehold.co/150x100/FFFF00/000000?text=Projeto2'], bio: 'Criação de espaços funcionais e esteticamente agradáveis, com foco em sustentabilidade e inovação.' } },
    { id: 3, name: "Engenharia Estrutural Beta", description: "Cálculos estruturais e laudos técnicos.", type: "engenharia", profile: { photos: [], bio: 'Segurança e inovação em projetos de engenharia civil, garantindo a solidez e durabilidade da sua construção.' } },
    { id: 4, name: "Designer de Interiores Criativo", description: "Transforme seu ambiente com um design exclusivo.", type: "design" , profile: { photos: ['https://placehold.co/150x100/FF00FF/FFFFFF?text=Design1'], bio: 'Especialista em criar ambientes personalizados que refletem sua personalidade e estilo de vida.' }}
];

// --- FUNÇÃO DE ALERTA PERSONALIZADA ---
function showAlert(message, title = 'Aviso', onOkCallback = null) {
    document.getElementById('custom-alert-title').textContent = title;
    document.getElementById('custom-alert-message').textContent = message;
    document.getElementById('custom-alert-modal').style.display = 'flex';

    const okBtn = document.querySelector('#custom-alert-modal .primary-btn');
    if (okBtn) {
        // Remove qualquer listener anterior para evitar múltiplos disparos
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);

        newOkBtn.onclick = function() {
            closeModal('custom-alert-modal');
            if (onOkCallback) {
                onOkCallback();
            }
        };
    }
}

// Funções de controle de tela e histórico
function showScreen(screenId, title = '') {
    // Esconde a tela de login v2 se estiver visível
    const loginScreenV2 = document.getElementById('login-screen-v2');
    if (loginScreenV2) {
        loginScreenV2.style.display = 'none';
    }

    // Esconde o cabeçalho se for a splash screen ou a tela de login
    const appHeader = document.getElementById('app-header');
    if (appHeader) {
        if (screenId === 'splash' || screenId === 'login-screen-v2' || screenId === 'login-choice-screen' || screenId === 'login-client-screen' || screenId === 'login-provider-screen') {
            appHeader.style.display = 'none';
        } else {
            appHeader.style.display = 'flex';
        }
    }

    // Adiciona ou remove a classe 'app-active' do body
    if (screenId === 'splash' || screenId === 'login-screen-v2' || screenId === 'login-choice-screen' || screenId === 'login-client-screen' || screenId === 'login-provider-screen') {
        document.body.classList.remove('app-active');
    } else {
        document.body.classList.add('app-active');
    }

    // Esconde todos os conteúdos principais primeiro
    const mainContentWrapper = document.querySelector('.main-content-wrapper');
    if (mainContentWrapper) {
        if (screenId === 'splash' || screenId === 'login-screen-v2' || screenId === 'login-choice-screen' || screenId === 'login-client-screen' || screenId === 'login-provider-screen') {
            mainContentWrapper.style.display = 'none';
        } else {
            mainContentWrapper.style.display = 'flex'; // Usar flex para o layout principal
        }
    }

    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // Atualiza o título do cabeçalho
        const headerTitleElement = document.getElementById('header-title');
        if (headerTitleElement) {
            switch (screenId) {
                case 'dashboard-usuario':
                    headerTitleElement.textContent = 'Painel';
                    break;
                case 'dashboard-prestador':
                    headerTitleElement.textContent = 'Painel';
                    break;
                case 'orcamentos-usuario':
                    headerTitleElement.textContent = 'Minhas Solicitações em Aberto';
                    break;
                case 'orcamentos-prestador':
                    headerTitleElement.textContent = 'Orçamentos';
                    break;
                case 'servicos-ativos':
                    headerTitleElement.textContent = 'Serviços Ativos';
                    break;
                case 'servicos-contratados':
                    headerTitleElement.textContent = 'Serviços Contratados';
                    break;
                case 'ocorrencias-usuario':
                    headerTitleElement.textContent = 'Minhas Ocorrências';
                    break;
                case 'ocorrencias-prestador':
                    headerTitleElement.textContent = 'Ocorrências';
                    break;
                case 'abrir-ocorrencia':
                    headerTitleElement.textContent = 'Abrir Ocorrência';
                    break;
                case 'buscar-servicos-unificado':
                    headerTitleElement.textContent = 'Buscar Serviço e Orçamento';
                    break;
                case 'servicos-24hrs-screen':
                    headerTitleElement.textContent = 'Serviços 24 Horas';
                    break;
                case 'solicitacao-orcamento':
                    headerTitleElement.textContent = 'Solicitar Orçamento';
                    break;
                case 'cadastro-especialidades':
                    headerTitleElement.textContent = 'Cadastro de Especialidades';
                    break;
                case 'calendario-trabalho':
                    headerTitleElement.textContent = 'Calendário de Trabalho';
                    break;
                case 'servicos-historico':
                    headerTitleElement.textContent = 'Histórico de Serviços';
                    break;
                case 'financeiro':
                    headerTitleElement.textContent = 'Financeiro';
                    break;
                case 'ajuda':
                    headerTitleElement.textContent = 'Ajuda e Suporte';
                    break;
                case 'fluxo-servico-detalhes':
                    headerTitleElement.textContent = 'Fluxo de Serviço';
                    break;
                case 'anunciantes':
                    headerTitleElement.textContent = 'Anunciantes';
                    break;
                case 'visitas-marcadas':
                    headerTitleElement.textContent = 'Visitas Marcadas';
                    break;
                case 'orcamentos-prestador-recebidos':
                    headerTitleElement.textContent = 'Orçamentos Recebidos';
                    break;
                case 'orcamentos-prestador-propostas-enviadas':
                    headerTitleElement.textContent = 'Propostas Enviadas';
                    break;
                case 'orcamentos-prestador-aprovados':
                    headerTitleElement.textContent = 'Orçamentos Aprovados';
                    break;
                case 'orcamentos-prestador-recusados':
                    headerTitleElement.textContent = 'Orçamentos Recusados';
                    break;
                case 'trabalhos-execucao-finalizados':
                    headerTitleElement.textContent = 'Execução e Finalizados';
                    break;
                case 'orcamentos-aprovados-recusados':
                    headerTitleElement.textContent = 'Orçamentos Aprovados e Recusados';
                    break;
                default:
                    headerTitleElement.textContent = 'ChamadoPro'; // Título padrão
            }
        }
    }

    // Gerencia o histórico de telas
    // Adiciona a tela ANTERIOR ao histórico, exceto se for uma tela de login/splash
    if (activeScreenId && activeScreenId !== screenId && !['splash', 'login-screen-v2', 'login-choice-screen', 'login-client-screen', 'login-provider-screen'].includes(activeScreenId)) {
        screenHistory.push(activeScreenId);
    }
    activeScreenId = screenId; // Atualiza a tela ativa

    // Atualiza o estado dos cards e abas ao mudar de tela
    if (screenId === 'dashboard-usuario') {
        updateUserDashboardCounts();
        startAdRotations();
    } else if (screenId === 'dashboard-prestador') {
        updatePrestadorDashboardCounts();
        startAdRotations();
    } else {
        stopAdRotations();
    }

    // Renderiza as abas de orçamentos do prestador
    if (screenId === 'orcamentos-prestador') {
        renderOrcamentosPrestadorRecebidos();
        renderOrcamentosPrestadorPropostasEnviadas();
        renderOrcamentosPrestadorAprovados();
        renderOrcamentosPrestadorRecusados();
        updatePrestadorBudgetCounts(); // Atualiza os contadores das abas
        showTab('orcamentos-prestador', 'recebidos'); // Garante que a primeira aba esteja ativa
    }
    // Adiciona a renderização para as abas de orçamentos do usuário
    else if (screenId === 'orcamentos-usuario') {
        renderOrcamentosUsuarioSolicitados();
        renderOrcamentosUsuarioRecebidos();
        renderOrcamentosUsuarioAprovados();
        renderOrcamentosUsuarioRecusados();
        renderOrcamentosUsuarioVisitas();
        updateUserBudgetCounts(); // Atualiza os contadores das abas
        
        // Use um pequeno timeout para garantir que o DOM seja atualizado antes de ativar a aba
        setTimeout(() => {
            // Verifica se a aba 'recebidos' deve ser ativada se o clique veio do dashboard
            if (document.activeElement && document.activeElement.closest('.dashboard-cards')) {
                 // Se o clique veio de um card do dashboard, a função showTab já foi chamada pelo onclick do card
                 // Não é necessário chamar showTab novamente aqui, pois isso sobrescreveria a aba correta
            } else {
                switchCpTab('orcamentos-usuario', 'solicitados'); // Garante que a primeira aba padrão esteja ativa
            }
        }, 50); // Pequeno atraso de 50ms
    }
    else if (screenId === 'servicos-historico') {
        renderServicosHistoricoFinalizados();
        renderServicosHistoricoRecusados();
        updateServicosHistoricoCounts(); // Atualiza os contadores das abas
        showTab('servicos-historico', 'finalizados');
    }
    // Adiciona a renderização para trabalhos em execução e finalizados
    else if (screenId === 'trabalhos-execucao-finalizados') {
        renderTrabalhosEmExecucao();
        renderTrabalhosFinalizados();
        updateTrabalhosCount(); // Atualiza os contadores das abas
        switchCpTab('trabalhos-execucao-finalizados', 'execucao'); // Mostra aba de execução por padrão
    } else if (screenId === 'ocorrencias-usuario') {
        renderUserOccurrences();
    } else if (screenId === 'ocorrencias-prestador') {
        renderProviderOccurrences();
    } else if (screenId === 'buscar-servicos-unificado') { // Lógica para a nova tela unificada
        renderSponsoredServices(); // Garante que os serviços padrão sejam renderizados
        renderSponsoredVisitServices(); // Garante que os serviços de visita sejam renderizados
        showTab('buscar-servicos-unificado', 'padrao'); // Ativa a aba padrão por default
    } else if (screenId === 'servicos-24hrs-screen') { // ATUALIZADO
        // Limpa os campos de busca/filtro e renderiza os cards iniciais
        document.getElementById('urgent-service-search').value = '';
        document.getElementById('distance-radius').value = '10'; // Valor padrão
        filterUrgentServices(); // Chama para popular os cards inicialmente
    } else if (screenId === 'financeiro') {
        updateFinanceiroDashboard();
        renderBankAccounts();
    } else if (screenId === 'visitas-marcadas') {
        renderVisitasMarcadas();
    } else if (screenId === 'trabalhos-execucao-finalizados') {
        renderTrabalhosEmExecucao();
        renderTrabalhosFinalizados();
        updateTrabalhosCount();
    } else if (screenId === 'orcamentos-prestador-recebidos') {
        renderOrcamentosPrestadorRecebidos();
    } else if (screenId === 'orcamentos-prestador-propostas-enviadas') {
        renderOrcamentosPrestadorPropostasEnviadas();
    } else if (screenId === 'orcamentos-prestador-aprovados') {
        renderOrcamentosPrestadorAprovados();
    } else if (screenId === 'orcamentos-prestador-recusados') {
        renderOrcamentosPrestadorRecusados();
    } else if (screenId === 'calendario-trabalho') {
        carregarCalendarioTrabalho();
    } else if (screenId === 'fluxo-servico-detalhes') {
        // Inicializa a simulação apenas se os elementos existirem
        initializeSimulationIfExists();
    }

    // Atualiza títulos de seção específicos baseados no contexto
    updateSectionTitle(screenId, title);
    
    // Inicializa o sidebar quando mostra uma tela da aplicação (não de login)
    if (!['splash', 'login-screen-v2', 'login-choice-screen', 'login-client-screen', 'login-provider-screen'].includes(screenId)) {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
            if (typeof initializeSidebar === 'function') {
                initializeSidebar();
            }
        }, 100);
    }
}

// Função para atualizar títulos de seção baseados no contexto do card clicado
function updateSectionTitle(screenId, contextTitle = '') {
    if (screenId === 'orcamentos-usuario') {
        const titleElement = document.getElementById('orcamentos-usuario-title');
        if (titleElement) {
            if (contextTitle) {
                titleElement.textContent = contextTitle;
            } else {
                titleElement.textContent = 'Meus Orçamentos';
            }
        }
    } else if (screenId === 'orcamentos-prestador') {
        const titleElement = document.getElementById('orcamentos-prestador-title');
        if (titleElement) {
            if (contextTitle) {
                titleElement.textContent = contextTitle;
            } else {
                titleElement.textContent = 'Orçamentos';
            }
        }
    }
}

function goBack() {
    // Se está no dashboard principal, não faz nada
    if (activeScreenId === 'dashboard-usuario' || activeScreenId === 'dashboard-prestador') {
        return;
    }
    if (screenHistory.length > 0) {
        const prevScreenId = screenHistory.pop();
        showScreen(prevScreenId);
    } else {
        // Se não há histórico, e não está no dashboard, volta para a tela de escolha de login
        showLoginChoiceScreen();
    }
}

// Função para navegar para a tela inicial (dashboard do usuário ou prestador)
function goToHome() {
    screenHistory = []; // Limpa o histórico para garantir que o "Voltar" funcione corretamente a partir da home
    if (currentUserType === 'usuario') {
        showScreen('dashboard-usuario');
        checkFirstLoginTutorial(); // Verifica se deve mostrar tutorial
    } else if (currentUserType === 'prestador') {
        showScreen('dashboard-prestador');
        checkFirstLoginTutorial(); // Verifica se deve mostrar tutorial
    } else {
        // Se o tipo de usuário não estiver definido, volta para a tela de login
        showLoginChoiceScreen(); // Volta para a tela de escolha de login
    }
    // Garante que o menu lateral seja fechado ao ir para a home
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// Função para verificar se deve mostrar o tutorial após o primeiro login
function checkFirstLoginTutorial() {
    console.log('🔍 Verificando tutorial...', {
        'onboarding_completed': localStorage.getItem('onboarding_completed'),
        'currentUserType': currentUserType
    });
    
    // Temporariamente desabilitado para debug
    return;
    
    // Verifica se o usuário ainda não completou o onboarding
    if (!localStorage.getItem('onboarding_completed')) {
        console.log('📚 Iniciando tutorial após login...');
        // Aguarda um pouco para a tela carregar completamente antes de mostrar o tutorial
        setTimeout(() => {
            startOnboarding();
        }, 1000);
    }
}

// Funções de Login e Logout (Adaptadas para a nova tela de login)
function showLoginScreenV2() {
    const splash = document.getElementById('splash');
    const loginScreenV2 = document.getElementById('login-screen-v2');
    const mainContentWrapper = document.querySelector('.main-content-wrapper');
    const appHeader = document.getElementById('app-header');

    if (splash) splash.style.display = 'none'; // Esconde a splash
    if (mainContentWrapper) mainContentWrapper.style.display = 'none'; // Garante que o conteúdo principal esteja oculto
    if (appHeader) appHeader.style.display = 'none'; // Garante que o cabeçalho da app esteja oculto

    if (loginScreenV2) {
        loginScreenV2.style.display = 'flex'; // *** ALTERADO PARA FLEX para centralizar com CSS ***
        document.body.classList.remove('app-active'); // Remove a classe para centralizar o login
    }

    // Garante que o radio de "Usuário" esteja selecionado e a aba "Acessar" ativa no carregamento
    const selectUserClientRadio = document.getElementById('select-user-client');
    if (selectUserClientRadio) selectUserClientRadio.checked = true;
    if (typeof updateUserTypePillHighlight === 'function') updateUserTypePillHighlight();
    switchTab('access'); // Ativa a aba "Acessar"
    if (typeof updateTabHighlight === 'function') updateTabHighlight(); // Esta função não existe na sua versão, pode ser removida ou implementada
    updateFormVisibility(); // Garante que o formulário correto (cliente social) seja exibido
}

// Função para alternar entre as abas Acessar/Cadastrar na tela de login V2
function switchTab(activeTabBaseId) { // activeTabBaseId será 'access' ou 'register'
    let currentActiveScreenId = null; // 'client' ou 'provider'
    const clientScreen = document.getElementById('login-client-screen');
    const providerScreen = document.getElementById('login-provider-screen');

    // Identifica qual tela de login (cliente ou prestador) está visível/ativa
    if (clientScreen && clientScreen.style.display !== 'none') {
        currentActiveScreenId = 'client';
    } else if (providerScreen && providerScreen.style.display !== 'none') {
        currentActiveScreenId = 'provider';
    } else {
        console.warn("Nenhuma tela de login (cliente/prestador) está ativa. Não é possível alternar abas.");
        return; // Sai da função se nenhuma tela estiver ativa
    }

    // Obtém o elemento da tela atualmente ativa
    const currentScreenElement = document.getElementById(`login-${currentActiveScreenId}-screen`);
    if (!currentScreenElement) {
        console.error(`Elemento da tela 'login-${currentActiveScreenId}-screen' não encontrado.`);
        return;
    }

    // Remove a classe 'active' de todos os botões de aba dentro da tela ativa
    currentScreenElement.querySelectorAll('.auth-tabs .tab-button').forEach(button => {
        if (button) button.classList.remove('active');
    });
    // Remove a classe 'active' de todas as seções de formulário dentro da tela ativa
    currentScreenElement.querySelectorAll('.form-sections .form-section').forEach(section => {
        if (section) section.classList.remove('active');
    });

    // Constrói os IDs específicos da aba e seção alvo com base na tela ativa
    const targetTabId = `${activeTabBaseId}-tab-${currentActiveScreenId}`;
    const targetSectionId = `${activeTabBaseId}-section-${currentActiveScreenId}`;

    const targetTabElement = document.getElementById(targetTabId);
    const targetSectionElement = document.getElementById(targetSectionId);
    const progressBarFill = document.querySelector('.progress-bar-fill'); // Presumindo que seja um elemento global

    // Adiciona a classe 'active' aos elementos corretos
    if (targetTabElement) targetTabElement.classList.add('active');
    if (targetSectionElement) targetSectionElement.classList.add('active');

    // Atualiza a barra de progresso (se aplicável)
    if (progressBarFill) {
        if (activeTabBaseId === 'access') {
            progressBarFill.style.width = '50%'; // Largura para 'Acessar'
        } else if (activeTabBaseId === 'register') {
            progressBarFill.style.width = '100%'; // Largura para 'Cadastrar'
        }
    }
}
// Função para controlar a visibilidade dos formulários de acordo com o tipo de usuário e a aba ativa
function updateFormVisibility() {
    let currentActiveScreenId = null;
    const clientScreen = document.getElementById('login-client-screen');
    const providerScreen = document.getElementById('login-provider-screen');

    // 1. Determina qual tela de login (cliente ou prestador) está visível
    if (clientScreen && clientScreen.style.display !== 'none') {
        currentActiveScreenId = 'client';
    } else if (providerScreen && providerScreen.style.display !== 'none') {
        currentActiveScreenId = 'provider';
    } else {
        console.warn("Nenhuma tela de login (cliente/prestador) está ativa para atualizar visibilidade do formulário.");
        return; // Sai da função se nenhuma tela estiver ativa
    }

    // 2. Obtém o estado da aba "Acessar" (se está ativa ou não)
    const accessSectionElement = document.getElementById(`access-section-${currentActiveScreenId}`);
    let isAccessTabActive = false;
    if (accessSectionElement && accessSectionElement.classList.contains('active')) {
        isAccessTabActive = true;
    }

    // 3. Determina se o usuário selecionado é o Cliente
    const selectUserClientRadio = document.getElementById('select-user-client');
    let isClientSelected = false; // DECLARAÇÃO E INICIALIZAÇÃO DE isClientSelected
    if (selectUserClientRadio) {
        isClientSelected = selectUserClientRadio.checked;
    } else {
        console.warn("Radio button #select-user-client não encontrado para determinar tipo de usuário.");
        // Se o rádio não for encontrado, podemos tentar inferir do currentActiveScreenId
        isClientSelected = (currentActiveScreenId === 'client');
    }

    // 4. Oculta todos os formulários (`.auth-form`) dentro da tela atualmente ativa
    const currentScreenElement = document.getElementById(`login-${currentActiveScreenId}-screen`);
    if (currentScreenElement) {
        currentScreenElement.querySelectorAll('.auth-form').forEach(form => {
            form.style.display = 'none'; // Define o estilo display para 'none'
        });
    }

    // 5. Exibe o formulário correto com base na aba ativa e no tipo de tela
    if (currentActiveScreenId === 'client') {
        if (isAccessTabActive) {
            const clientAccessForm = document.getElementById('client-access-form');
            if (clientAccessForm) clientAccessForm.style.display = 'block';
        } else {
            const clientRegisterForm = document.getElementById('client-register-form');
            if (clientRegisterForm) clientRegisterForm.style.display = 'block';
        }
    } else { // currentActiveScreenId === 'provider'
        if (isAccessTabActive) {
            const providerAccessForm = document.getElementById('provider-access-form');
            if (providerAccessForm) providerAccessForm.style.display = 'block';
        } else {
            const providerRegisterForm = document.getElementById('provider-register-form');
            if (providerRegisterForm) providerRegisterForm.style.display = 'block';
        }
    }
    // Atualiza o destaque visual dos pills
    if (typeof updateUserTypePillHighlight === 'function') updateUserTypePillHighlight();
    if (typeof updatePrestadorTypePillHighlight === 'function') updatePrestadorTypePillHighlight();
}

function performLoginV2(event) {
    const isClientSelected = document.getElementById('select-user-client').checked;
    const clickedButtonId = event.target.id; // Get the ID of the clicked button

    if (isClientSelected) {
        // Client login
        if (clickedButtonId === 'client-login-button-v2') {
            // Email/password login for client
            let email = document.getElementById('client-email-login').value.trim();
            let password = document.getElementById('client-password-login').value;
            console.log('Tentando login cliente:', email, password);
            if (email.toLowerCase() === 'cliente@chamadopro.com.br' && password === '123') { // Novo usuário de exemplo para cliente
                currentUserType = 'usuario';
                nomeDoClienteLogado = "João Silva"; // Define o nome do cliente logado
                setTimeout(function() {
                // Oculta todas as telas de login/cadastro
                var loginScreen = document.getElementById('login-screen-v2');
                var loginClientScreen = document.getElementById('login-client-screen');
                var loginProviderScreen = document.getElementById('login-provider-screen');
                var mainContent = document.querySelector('.main-content-wrapper');
                if (loginScreen) loginScreen.style.display = 'none';
                if (loginClientScreen) loginClientScreen.style.display = 'none';
                if (loginProviderScreen) loginProviderScreen.style.display = 'none';
                if (mainContent) mainContent.style.display = 'flex';
                document.body.classList.add('app-active');
                showScreen('dashboard-usuario');
                updateUserDashboardCounts(); // Atualiza contadores após login
                }, 100);
            } else {
                showAlert('E-mail ou senha incorretos para Usuário. Tente novamente.');
            }
        } else {
            // Social login for client (Google, Facebook, Apple)
            showAlert('Simulando login de Cliente via social. Você será redirecionado para a dashboard de usuário.');
            currentUserType = 'usuario';
            nomeDoClienteLogado = "Maria Oliveira"; // Define o nome do cliente logado
            setTimeout(function() {
                document.getElementById('login-screen-v2').style.display = 'none';
                document.querySelector('.main-content-wrapper').style.display = 'flex';
                document.body.classList.add('app-active');
                showScreen('dashboard-usuario');
                updateUserDashboardCounts(); // Atualiza contadores após login
            }, 100);
        }
    } else {
        // Provider login with email/password
        let email = document.getElementById('provider-email-login').value.trim();
        let password = document.getElementById('provider-password-login').value;
        console.log('Tentando login prestador:', email, password);
        if (email.toLowerCase() === 'prestador@chamadopro.com.br' && password === '123') { // Novo usuário de exemplo para prestador
            currentUserType = 'prestador';
            nomeDoClienteLogado = "Eletricista Silva"; // Define o nome do prestador logado
            setTimeout(function() {
                // Oculta todas as telas de login/cadastro
                var loginScreen = document.getElementById('login-screen-v2');
                var loginClientScreen = document.getElementById('login-client-screen');
                var loginProviderScreen = document.getElementById('login-provider-screen');
                var mainContent = document.querySelector('.main-content-wrapper');
                if (loginScreen) loginScreen.style.display = 'none';
                if (loginClientScreen) loginClientScreen.style.display = 'none';
                if (loginProviderScreen) loginProviderScreen.style.display = 'none';
                if (mainContent) mainContent.style.display = 'flex';
                document.body.classList.add('app-active');
                showScreen('dashboard-prestador');
                updatePrestadorDashboardCounts(); // Atualiza contadores após login
            }, 100);
        } else {
            showAlert('E-mail ou senha incorretos para Prestador. Tente novamente.');
        }
    }
    // Atualiza o menu lateral após o login
    updateSidebarMenu();
}

// Função de registro (adaptada para a nova tela de login)
function registerUserV2() {
    const isClientSelected = document.getElementById('select-user-client').checked;

    if (isClientSelected) {
        const clientEmail = document.getElementById('client-email-register').value;
        const clientName = document.getElementById('client-name-register').value; // Novo campo de nome para cliente
        if (clientEmail && clientName) {
            showAlert(`Usuário (Cliente) ${clientName} registrado com e-mail: ${clientEmail}. Você será redirecionado para a dashboard de usuário.`);
            currentUserType = 'usuario';
            nomeDoClienteLogado = clientName; // Define o nome do cliente logado
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-usuario');
            updateUserDashboardCounts(); // Atualiza contadores após registro
        } else {
            showAlert('Por favor, insira seu nome e e-mail para o cadastro do Usuário.');
        }
    } else {
        const providerName = document.getElementById('provider-pf-name').value || document.getElementById('provider-pj-nome-fantasia').value;
        const providerEmail = document.getElementById('provider-pf-email').value || document.getElementById('provider-pj-email').value;
        const providerPassword = document.getElementById('provider-pf-password').value || document.getElementById('provider-pj-password').value;

        if (providerName && providerEmail && providerPassword) {
            showAlert(`Prestador registrado: ${providerName} (${providerEmail}). Você será redirecionado para a dashboard de prestador.`);
            currentUserType = 'prestador';
            nomeDoClienteLogado = providerName; // Define o nome do prestador logado
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-prestador');
            updatePrestadorDashboardCounts(); // Atualiza contadores após registro
        } else {
            showAlert('Por favor, preencha todos os campos para o cadastro do Prestador.');
        }
    }
    // Atualiza o menu lateral após o registro
    updateSidebarMenu();
}


function logout() {
    // Usando o modal de alerta personalizado para a confirmação de saída
    showAlert('Tem certeza que deseja sair?', 'Confirmação', () => {
        currentUserType = null;
        nomeDoClienteLogado = "Visitante"; // Reseta o nome ao deslogar
        screenHistory = []; // Limpa o histórico de telas
        // Esconde todas as telas principais
        const mainContent = document.querySelector('.main-content-wrapper');
        if (mainContent) mainContent.style.display = 'none';
        const appHeader = document.getElementById('app-header');
        if (appHeader) appHeader.style.display = 'none';
        document.body.classList.remove('app-active');
        // Esconde dashboards e telas de conteúdo
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        // Exibe a tela de login principal (login-choice-screen)
        showLoginChoiceScreen();
        // Garante que o menu lateral seja fechado ao deslogar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        // Reinicia os contadores do dashboard para 0 ao deslogar
        updateUserDashboardCounts();
        updatePrestadorDashboardCounts();
        // Exibe mensagem de logout
        showAlert('Logout realizado com sucesso! Você foi redirecionado para a tela de login.');
    });
}


// Inicializar contadores de sub-abas (apenas para solicitados)
function initializeSubTabs() {
    updateSubTabCounts();
    
    // Mostrar sub-aba padrão para usuário (Orçamento Padrão na aba Solicitados)
    const userSolicitadosTab = document.getElementById('orcamentos-usuario-solicitados-content');
    if (userSolicitadosTab) {
        showSubTab('orcamentos-usuario', 'solicitados', 'padrao');
    }
}

// Funções de Dashboard e Conteúdo
function updateUserDashboardCounts() {
    const totalSolicitacoesAbertas = orcamentosUsuarioSolicitados.length + orcamentosUsuarioRecebidos.length;
    document.getElementById('orcamentos-usuario-solicitados-count-dashboard').textContent = totalSolicitacoesAbertas;
    const totalAprovadosRecusados = orcamentosUsuarioAprovados.length + orcamentosUsuarioRecusados.length;
    document.getElementById('orcamentos-aprovados-recusados-count-dashboard').textContent = totalAprovadosRecusados;
    document.getElementById('ocorrencias-usuario-count-dashboard').textContent = userOccurrences.length;
    document.getElementById('orcamentos-usuario-visitas-count-dashboard').textContent = visitasMarcadas.length;
    // Atualiza contador de trabalhos
    const totalTrabalhos = trabalhosEmExecucao.length + trabalhosFinalizados.length;
    document.getElementById('trabalhos-count-dashboard').textContent = totalTrabalhos;
}

function updatePrestadorDashboardCounts() {
    document.getElementById('servicos-ativos-count-dashboard').textContent = Object.keys(serviceStatuses).length; // Conta serviços ativos baseados no objeto de status
    document.getElementById('orcamentos-prestador-recebidos-count-dashboard').textContent = orcamentosPrestadorRecebidos.length;
    document.getElementById('orcamentos-prestador-propostas-enviadas-count-dashboard').textContent = orcamentosPrestadorPropostasEnviadas.length;
    document.getElementById('orcamentos-prestador-aprovados-count-dashboard').textContent = orcamentosPrestadorAprovados.length;
    document.getElementById('orcamentos-prestador-recusados-count-dashboard').textContent = orcamentosPrestadorRecusados.length;
    document.getElementById('ocorrencias-prestador-count-dashboard').textContent = providerOccurrences.length;
    document.getElementById('servicos-historico-count-dashboard').textContent = servicosHistoricoCount;
}

function updateUserBudgetCounts() {
    document.getElementById('orcamentos-usuario-solicitados-count-tab').textContent = orcamentosUsuarioSolicitados.length;
    document.getElementById('orcamentos-usuario-recebidos-count-tab').textContent = orcamentosUsuarioRecebidos.length;
}

function updatePrestadorBudgetCounts() {
    // Atualiza apenas os contadores do dashboard do prestador (que existem no HTML)
    const recebidosElement = document.getElementById('orcamentos-prestador-recebidos-count-dashboard');
    const propostasElement = document.getElementById('orcamentos-prestador-propostas-enviadas-count-dashboard');
    const aprovadosElement = document.getElementById('orcamentos-prestador-aprovados-count-dashboard');
    const recusadosElement = document.getElementById('orcamentos-prestador-recusados-count-dashboard');
    
    if (recebidosElement) recebidosElement.textContent = orcamentosPrestadorRecebidos.length;
    if (propostasElement) propostasElement.textContent = orcamentosPrestadorPropostasEnviadas.length;
    if (aprovadosElement) aprovadosElement.textContent = orcamentosPrestadorAprovados.length;
    if (recusadosElement) recusadosElement.textContent = orcamentosPrestadorRecusados.length;
}

function updateServicosHistoricoCounts() {
    const finalizadosElement = document.getElementById('servicos-finalizados-count-tab');
    const recusadosElement = document.getElementById('servicos-recusados-count-tab');
    
    if (finalizadosElement) finalizadosElement.textContent = servicosHistoricoCount;
    if (recusadosElement) recusadosElement.textContent = orcamentosPrestadorRecusados.length; // Reutilizando para exemplo
}


function startAdRotations() {
    stopAdRotations(); // Garante que não haja múltiplos intervalos

    const userAdContent = document.getElementById('user-ad-content');
    const prestadorAdContent = document.getElementById('prestador-ad-content');

    if (userAdContent) {
        userAdContent.textContent = userAds[currentAdIndexUser];
        userAdContent.classList.add('active');
        adIntervalUser = setInterval(() => {
            userAdContent.classList.remove('active');
            setTimeout(() => {
                currentAdIndexUser = (currentAdIndexUser + 1) % userAds.length;
                userAdContent.textContent = userAds[currentAdIndexUser];
                userAdContent.classList.add('active');
            }, 500); // Tempo para a transição de saída
        }, 5000); // Troca a cada 5 segundos
    }

    if (prestadorAdContent) {
        prestadorAdContent.textContent = prestadorAds[currentAdIndexPrestador];
        prestadorAdContent.classList.add('active');
        adIntervalPrestador = setInterval(() => {
            prestadorAdContent.classList.remove('active');
            setTimeout(() => {
                currentAdIndexPrestador = (currentAdIndexPrestador + 1) % prestadorAds.length;
                prestadorAdContent.textContent = prestadorAds[currentAdIndexPrestador]; // Corrigido para prestadorAds
                prestadorAdContent.classList.add('active');
            }, 500); // Tempo para a transição de saída
        }, 5000); // Troca a cada 5 segundos
    }
}

function stopAdRotations() {
    if (adIntervalUser) clearInterval(adIntervalUser);
    if (adIntervalPrestador) clearInterval(adIntervalPrestador);
}

// Funções de Orçamentos (Usuário)
function renderOrcamentosUsuarioSolicitados(filtro = 'todos') {
    const container = document.getElementById('orcamentos-usuario-solicitados-list');
    if (!container) return;
    container.innerHTML = '';
    
    // Filtrar orçamentos baseado no tipo
    let orcamentosFiltrados = orcamentosUsuarioSolicitados;
    if (filtro === 'padrao') {
        orcamentosFiltrados = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'padrao');
    } else if (filtro === 'visita') {
        orcamentosFiltrados = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'visita');
    }
    
    if (orcamentosFiltrados.length === 0) {
        const mensagem = filtro === 'todos' ? 'Nenhum orçamento solicitado ainda.' : 
                        filtro === 'padrao' ? 'Nenhum orçamento padrão solicitado.' : 
                        'Nenhum orçamento com visita solicitado.';
        container.innerHTML = `<p class="no-content-message">${mensagem}</p>`;
        return;
    }
    
    orcamentosFiltrados.forEach(req => {
        const card = document.createElement('div');
        const isVisita = req.tipo === 'visita';
        const tipoClass = isVisita ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoTextClass = isVisita ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const tipoIcon = isVisita ? '<i class="fas fa-calendar-check"></i>' : '<i class="fas fa-tools"></i>';
        const tipoLabel = isVisita ? 'Orçamento com Visita' : 'Orçamento Padrão';
        
        card.classList.add('card', tipoClass);
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${req.title} ${tipoIcon}</h3>
                <div class="status aguardando">Aguardando ${isVisita ? 'Agendamento' : 'Propostas'}</div>
                <small class="${tipoTextClass}" style="font-style: italic;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-calendar-alt"></i> Data: ${req.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${req.address}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'solicitado')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn btn-finalizar" onclick="showAlert('Cancelar solicitação ${req.id}')"><i class="fas fa-times-circle"></i> Cancelar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosUsuarioRecebidos(filtro = 'todos') {
    const container = document.getElementById('orcamentos-usuario-recebidos-content');
    if (!container) return;
    
    // Encontrar o container da lista específico
    let listContainer = container.querySelector('#orcamentos-usuario-recebidos-list');
    if (!listContainer) {
        listContainer = container;
    }
    
    listContainer.innerHTML = '';
    
    // Filtrar os orçamentos baseado no tipo
    let orcamentosFiltrados = orcamentosUsuarioRecebidos;
    if (filtro === 'padrao') {
        orcamentosFiltrados = orcamentosUsuarioRecebidos.filter(budget => budget.tipo !== 'visita');
    } else if (filtro === 'visita') {
        orcamentosFiltrados = orcamentosUsuarioRecebidos.filter(budget => budget.tipo === 'visita');
    }
    
    if (orcamentosFiltrados.length === 0) {
        listContainer.innerHTML = '<p class="no-content-message">Nenhuma proposta de orçamento recebida ainda.</p>';
        return;
    }
    orcamentosFiltrados.forEach(budget => {
        const card = document.createElement('div');
        const isVisita = budget.tipo === 'visita';
        const tipoClass = isVisita ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoTextClass = isVisita ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const tipoIcon = isVisita ? '<i class="fas fa-calendar-check"></i>' : '<i class="fas fa-tools"></i>';
        const tipoLabel = isVisita ? 'Proposta de Visita' : 'Orçamento Padrão';
        
        // Informações adicionais do orçamento
        const valorFormatado = budget.value || 'Valor a combinar';
        const tempoEstimado = budget.tempoEstimado || 'A definir';
        const precisaMaterial = budget.precisaMaterial !== undefined ? budget.precisaMaterial : true;
        const materialTexto = precisaMaterial ? 'Material necessário' : 'Material não necessário';
        const materialIcon = precisaMaterial ? '<i class="fas fa-boxes" style="color: #f39c12;"></i>' : '<i class="fas fa-check-circle" style="color: #28a745;"></i>';
        
        card.classList.add('card', tipoClass);
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${tipoIcon} ${budget.service}</h3>
                <div class="status aguardando">Aguardando Aprovação</div>
                <small class="${tipoTextClass}" style="font-weight: bold;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-money-bill-wave"></i> <strong>Valor: ${valorFormatado}</strong></p>
                <p><i class="fas fa-clock"></i> <strong>Tempo estimado: ${tempoEstimado}</strong></p>
                <p>${materialIcon} ${materialTexto}</p>
                <p><i class="fas fa-calendar-alt"></i> Proposta em: ${budget.date}</p>
                <p class="auto-cancel-warning"><i class="fas fa-exclamation-triangle"></i> <strong>Proposta será cancelada automaticamente em 16 horas</strong></p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openReceivedBudgetDetailsModal(${budget.id})"><i class="fas fa-info-circle"></i> Mais Detalhes</button>
                <button class="btn" style="background-color: #28a745;" onclick="openScheduleProposalModal(${budget.id})"><i class="fas fa-check"></i> ${isVisita ? 'Agendar Visita' : 'Aprovar e Agendar'}</button>
                <button class="btn btn-finalizar" onclick="openUserRefusalReasonModal(${budget.id})"><i class="fas fa-times"></i> Recusar</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function renderOrcamentosUsuarioAprovados() {
    const container = document.getElementById('orcamentos-usuario-aprovados-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosUsuarioAprovados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento aprovado ainda.</p>';
        return;
    }
    orcamentosUsuarioAprovados.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${budget.service} - ${budget.value}</h3>
                <div class="status em-andamento">Aguardando Início</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Agendado para: ${budget.scheduleDate} às ${budget.scheduleTime}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="showAlert('Ver detalhes do serviço aprovado ${budget.id}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${budget.prestador}')"><i class="fas fa-comments"></i> Chat</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosUsuarioRecusados() {
    const container = document.getElementById('orcamentos-usuario-recusados-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosUsuarioRecusados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento recusado ainda.</p>';
        return;
    }
    orcamentosUsuarioRecusados.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${budget.service} - ${budget.value}</h3>
                <div class="status default">Recusado</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Proposta em: ${budget.date}</p>
                <p><i class="fas fa-info-circle"></i> Motivo: ${budget.reason}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="showAlert('Ver detalhes do orçamento recusado ${budget.id}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosUsuarioVisitas() {
    const container = document.getElementById('orcamentos-usuario-visitas-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosUsuarioVisitas.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhuma visita agendada ou solicitada ainda.</p>';
        return;
    }
    orcamentosUsuarioVisitas.forEach(visit => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>Visita com ${visit.prestador}</h3>
                <div class="status aguardando">Aguardando Confirmação</div>
            </div>
            <div class="info">
                <p><i class="fas fa-calendar-alt"></i> Data Sugerida: ${visit.suggestedDate1} às ${visit.suggestedTime1}</p>
                <p><i class="fas fa-calendar-alt"></i> Data Alternativa: ${visit.suggestedDate2} às ${visit.suggestedTime2}</p>
                <p><i class="fas fa-calendar-alt"></i> Data Alternativa: ${visit.suggestedDate3} às ${visit.suggestedTime3}</p>
                <p><i class="fas fa-info-circle"></i> Observações: ${visit.obs}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="showAlert('Ver detalhes da visita ${visit.id}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${visit.prestador}')"><i class="fas fa-comments"></i> Chat</button>
            </div>
        `;
        container.appendChild(card);
    });
}


// === NOVAS FUNÇÕES PARA SUB-ABAS ===

// Funções para renderizar Solicitados por tipo
function renderOrcamentosSolicitadosPadrao() {
    const container = document.getElementById('orcamentos-usuario-solicitados-padrao-content');
    if (!container) return;
    container.innerHTML = '';
    
    const solicitadosPadrao = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'padrao');
    
    if (solicitadosPadrao.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento padrão solicitado ainda.</p>';
        return;
    }
    
    solicitadosPadrao.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card', 'orcamento-padrao');
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-tools"></i> ${req.title}</h3>
                <div class="status aguardando">Aguardando Propostas</div>
                <small class="tipo-orcamento-padrao" style="font-weight: bold;">Orçamento Padrão</small>
            </div>
            <div class="info">
                <p><i class="fas fa-calendar-alt"></i> Data: ${req.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${req.address}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'solicitado')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn btn-finalizar" onclick="showAlert('Cancelar solicitação ${req.id}')"><i class="fas fa-times-circle"></i> Cancelar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosSolicitadosVisita() {
    const container = document.getElementById('orcamentos-usuario-solicitados-visita-content');
    if (!container) return;
    container.innerHTML = '';
    
    const solicitadosVisita = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'visita');
    
    if (solicitadosVisita.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento com visita solicitado ainda.</p>';
        return;
    }
    
    solicitadosVisita.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card', 'orcamento-visita');
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-calendar-check"></i> ${req.title}</h3>
                <div class="status aguardando">Aguardando Agendamento</div>
                <small class="tipo-orcamento-visita" style="font-weight: bold;">Orçamento com Visita</small>
            </div>
            <div class="info">
                <p><i class="fas fa-calendar-alt"></i> Data: ${req.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${req.address}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'solicitado')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn btn-finalizar" onclick="showAlert('Cancelar solicitação ${req.id}')"><i class="fas fa-times-circle"></i> Cancelar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções para renderizar Recebidos por tipo
function renderOrcamentosRecebidosPadrao() {
    const container = document.getElementById('recebidos-padrao-content');
    if (!container) return;
    container.innerHTML = '';
    
    const recebidosPadrao = orcamentosUsuarioRecebidos.filter(budget => budget.tipo === 'padrao');
    
    if (recebidosPadrao.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhuma proposta de orçamento padrão recebida ainda.</p>';
        return;
    }
    
    recebidosPadrao.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card', 'orcamento-padrao');
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-tools"></i> ${budget.service} - ${budget.value}</h3>
                <div class="status aguardando">Aguardando Aprovação</div>
                <small class="tipo-orcamento-padrao" style="font-style: italic;">Orçamento Padrão</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Proposta em: ${budget.date}</p>
                <p class="auto-cancel-warning"><i class="fas fa-clock"></i> <strong>Proposta será cancelada automaticamente em 16 horas</strong></p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openReceivedBudgetDetailsModal(${budget.id})"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" style="background-color: #28a745;" onclick="openScheduleProposalModal(${budget.id})"><i class="fas fa-check"></i> Aprovar e Agendar</button>
                <button class="btn btn-finalizar" onclick="openUserRefusalReasonModal(${budget.id})"><i class="fas fa-times"></i> Recusar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosRecebidosVisita() {
    const container = document.getElementById('recebidos-visita-content');
    if (!container) return;
    container.innerHTML = '';
    
    const recebidosVisita = orcamentosUsuarioRecebidos.filter(budget => budget.tipo === 'visita');
    
    if (recebidosVisita.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhuma proposta de visita recebida ainda.</p>';
        return;
    }
    
    recebidosVisita.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card', 'orcamento-visita');
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-calendar-check"></i> ${budget.service} - ${budget.value}</h3>
                <div class="status aguardando">Aguardando Aprovação</div>
                <small class="tipo-orcamento-visita" style="font-style: italic;">Proposta de Visita</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Proposta em: ${budget.date}</p>
                <p class="auto-cancel-warning"><i class="fas fa-clock"></i> <strong>Proposta será cancelada automaticamente em 16 horas</strong></p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openReceivedBudgetDetailsModal(${budget.id})"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" style="background-color: #28a745;" onclick="openScheduleProposalModal(${budget.id})"><i class="fas fa-check"></i> Agendar Visita</button>
                <button class="btn btn-finalizar" onclick="openUserRefusalReasonModal(${budget.id})"><i class="fas fa-times"></i> Recusar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para atualizar contadores das sub-abas
function updateSubTabCounts() {
    // Contadores apenas para Solicitados (única aba com sub-abas)
    const solicitadosPadrao = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'padrao');
    const solicitadosVisita = orcamentosUsuarioSolicitados.filter(req => req.tipo === 'visita');
    
    // Atualiza elementos DOM
    const elemSolPadrao = document.getElementById('solicitados-padrao-count');
    const elemSolVisita = document.getElementById('solicitados-visita-count');
    
    if (elemSolPadrao) elemSolPadrao.textContent = solicitadosPadrao.length;
    if (elemSolVisita) elemSolVisita.textContent = solicitadosVisita.length;
}

// Função para atualizar contadores da tela Aprovados/Recusados
function updateAprovadosRecusadosCounts() {
    const aprovadosElement = document.getElementById('orcamentos-aprovados-count-tab');
    const recusadosElement = document.getElementById('orcamentos-recusados-count-tab');
    
    if (aprovadosElement) {
        aprovadosElement.textContent = orcamentosUsuarioAprovados.length;
    }
    
    if (recusadosElement) {
        recusadosElement.textContent = orcamentosUsuarioRecusados.length;
    }
}

// Função para renderizar orçamentos aprovados
function renderOrcamentosAprovados(filtro = 'todos') {
    const container = document.getElementById('orcamentos-aprovados-list');
    if (!container) return;
    container.innerHTML = '';
    
    // Filtrar orçamentos baseado no tipo
    let orcamentosFiltrados = orcamentosUsuarioAprovados;
    if (filtro === 'padrao') {
        orcamentosFiltrados = orcamentosUsuarioAprovados.filter(orcamento => orcamento.tipo === 'padrao');
    } else if (filtro === 'visita') {
        orcamentosFiltrados = orcamentosUsuarioAprovados.filter(orcamento => orcamento.tipo === 'visita');
    }
    
    if (orcamentosFiltrados.length === 0) {
        const mensagem = filtro === 'todos' ? 'Nenhum orçamento aprovado ainda.' : 
                        filtro === 'padrao' ? 'Nenhum orçamento padrão aprovado.' : 
                        'Nenhum orçamento com visita aprovado.';
        container.innerHTML = `<p class="no-content-message">${mensagem}</p>`;
        return;
    }
    
    orcamentosFiltrados.forEach(orcamento => {
        const tipoClass = orcamento.tipo === 'visita' ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoLabel = orcamento.tipo === 'visita' ? 'Orçamento com Visita' : 'Orçamento Padrão';
        const tipoTextClass = orcamento.tipo === 'visita' ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const iconeTipo = orcamento.tipo === 'visita' ? 'fas fa-calendar-check' : 'fas fa-tools';
        
        const card = document.createElement('div');
        card.classList.add('card', tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="${iconeTipo}"></i> ${orcamento.service} - ${orcamento.value}</h3>
                <div class="status aprovado">Aprovado</div>
                <small class="${tipoTextClass}" style="font-style: italic;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${orcamento.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Aprovado em: ${orcamento.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openBudgetDetailsModal(${orcamento.id})"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${orcamento.prestador}')"><i class="fas fa-comments"></i> Chat</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para renderizar orçamentos recusados
function renderOrcamentosRecusados(filtro = 'todos') {
    const container = document.getElementById('orcamentos-recusados-list');
    if (!container) return;
    container.innerHTML = '';
    
    // Filtrar orçamentos baseado no tipo
    let orcamentosFiltrados = orcamentosUsuarioRecusados;
    if (filtro === 'padrao') {
        orcamentosFiltrados = orcamentosUsuarioRecusados.filter(orcamento => orcamento.tipo === 'padrao');
    } else if (filtro === 'visita') {
        orcamentosFiltrados = orcamentosUsuarioRecusados.filter(orcamento => orcamento.tipo === 'visita');
    }
    
    if (orcamentosFiltrados.length === 0) {
        const mensagem = filtro === 'todos' ? 'Nenhum orçamento recusado ainda.' : 
                        filtro === 'padrao' ? 'Nenhum orçamento padrão recusado.' : 
                        'Nenhum orçamento com visita recusado.';
        container.innerHTML = `<p class="no-content-message">${mensagem}</p>`;
        return;
    }
    
    orcamentosFiltrados.forEach(orcamento => {
        const tipoClass = orcamento.tipo === 'visita' ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoLabel = orcamento.tipo === 'visita' ? 'Orçamento com Visita' : 'Orçamento Padrão';
        const tipoTextClass = orcamento.tipo === 'visita' ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const iconeTipo = orcamento.tipo === 'visita' ? 'fas fa-calendar-check' : 'fas fa-tools';
        
        const card = document.createElement('div');
        card.classList.add('card', tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="${iconeTipo}"></i> ${orcamento.service} - ${orcamento.value}</h3>
                <div class="status recusado">Recusado</div>
                <small class="${tipoTextClass}" style="font-style: italic;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${orcamento.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Recusado em: ${orcamento.date}</p>
                <p><i class="fas fa-info-circle"></i> Motivo: ${orcamento.motivoRecusa || 'Não informado'}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openBudgetDetailsModal(${orcamento.id})"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para renderizar visitas marcadas
function renderVisitasMarcadas(filtro = 'todos') {
    const container = document.getElementById('visitas-marcadas-content');
    if (!container) return;
    container.innerHTML = '';
    
    // Filtrar visitas baseado no tipo
    let visitasFiltradas = visitasMarcadas;
    if (filtro === 'padrao') {
        visitasFiltradas = visitasMarcadas.filter(visita => visita.tipo === 'padrao');
    } else if (filtro === 'visita') {
        visitasFiltradas = visitasMarcadas.filter(visita => visita.tipo === 'visita');
    }
    
    if (visitasFiltradas.length === 0) {
        const mensagem = filtro === 'todos' ? 'Nenhuma visita marcada ainda.' : 
                        filtro === 'padrao' ? 'Nenhuma visita padrão marcada.' : 
                        'Nenhuma visita com atendimento marcada.';
        container.innerHTML = `<p class="no-content-message">${mensagem}</p>`;
        return;
    }
    
    visitasFiltradas.forEach(visita => {
        const tipoClass = visita.tipo === 'visita' ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoLabel = visita.tipo === 'visita' ? 'Orçamento com Visita' : 'Orçamento Padrão';
        const tipoTextClass = visita.tipo === 'visita' ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const iconeTipo = visita.tipo === 'visita' ? 'fas fa-calendar-check' : 'fas fa-tools';
        
        const card = document.createElement('div');
        card.classList.add('card', tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="${iconeTipo}"></i> ${visita.service} - ${visita.value}</h3>
                <div class="status confirmado">${visita.status}</div>
                <small class="${tipoTextClass}" style="font-weight: bold;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${visita.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Data: ${visita.date} às ${visita.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${visita.address}</p>
                <p><i class="fas fa-info-circle"></i> ${visita.description}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openChat('${visita.prestador}')"><i class="fas fa-comments"></i> Chat</button>
                <button class="btn" onclick="showAlert('Detalhes da visita ${visita.id}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para filtrar visitas marcadas
function filterVisitasMarcadas(filtro) {
    // Atualizar estado dos botões
    document.querySelectorAll('#visitas-marcadas .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#visitas-marcadas .filter-btn[data-filter="${filtro}"]`).classList.add('active');
    
    // Re-renderizar com o filtro aplicado
    renderVisitasMarcadas(filtro);
}

// Função para filtrar orçamentos do usuário solicitados
function filterOrcamentosUsuarioSolicitados(filtro) {
    // Atualizar estado dos botões
    document.querySelectorAll('#orcamentos-usuario-solicitados-content .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#orcamentos-usuario-solicitados-content .filter-btn[data-filter="${filtro}"]`).classList.add('active');
    
    // Re-renderizar com o filtro aplicado
    renderOrcamentosUsuarioSolicitados(filtro);
}

// Função para filtrar orçamentos do usuário recebidos
function filterOrcamentosUsuarioRecebidos(filtro) {
    // Atualizar estado dos botões
    document.querySelectorAll('#orcamentos-usuario-recebidos-content .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#orcamentos-usuario-recebidos-content .filter-btn[data-filter="${filtro}"]`).classList.add('active');
    
    // Re-renderizar com o filtro aplicado
    renderOrcamentosUsuarioRecebidos(filtro);
}

// Função para filtrar orçamentos aprovados
function filterOrcamentosAprovados(filtro) {
    // Atualizar estado dos botões
    document.querySelectorAll('#orcamentos-aprovados-recusados-aprovados-content .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#orcamentos-aprovados-recusados-aprovados-content .filter-btn[data-filter="${filtro}"]`).classList.add('active');
    
    // Re-renderizar com o filtro aplicado
    renderOrcamentosAprovados(filtro);
}

// Função para filtrar orçamentos recusados
function filterOrcamentosRecusados(filtro) {
    // Atualizar estado dos botões
    document.querySelectorAll('#orcamentos-aprovados-recusados-recusados-content .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`#orcamentos-aprovados-recusados-recusados-content .filter-btn[data-filter="${filtro}"]`).classList.add('active');
    
    // Re-renderizar com o filtro aplicado
    renderOrcamentosRecusados(filtro);
}

// Função para renderizar trabalhos em execução
function renderTrabalhosEmExecucao() {
    const container = document.getElementById('trabalhos-execucao-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (trabalhosEmExecucao.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum trabalho em execução no momento.</p>';
        return;
    }
    
    trabalhosEmExecucao.forEach(trabalho => {
        const tipoClass = trabalho.tipo === 'visita' ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoLabel = trabalho.tipo === 'visita' ? 'Serviço com Visita' : 'Serviço Padrão';
        const tipoTextClass = trabalho.tipo === 'visita' ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const iconeTipo = trabalho.tipo === 'visita' ? 'fas fa-calendar-check' : 'fas fa-tools';
        
        const card = document.createElement('div');
        card.classList.add('card', tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="${iconeTipo}"></i> ${trabalho.service}</h3>
                <div class="status em-execucao">${trabalho.status}</div>
                <small class="${tipoTextClass}" style="font-weight: bold;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${trabalho.prestador}</p>
                <p><i class="fas fa-money-bill-wave"></i> Valor: ${trabalho.value}</p>
                <p><i class="fas fa-clock"></i> Tempo estimado: ${trabalho.tempoEstimado}</p>
                <p><i class="fas fa-calendar-alt"></i> Iniciado em: ${trabalho.dataInicio}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${trabalho.address}</p>
                <div class="progress-container">
                    <p><i class="fas fa-chart-line"></i> Progresso: ${trabalho.progresso}%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${trabalho.progresso}%"></div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button class="btn" onclick="openTrabalhoDetailsModal(${trabalho.id}, 'execucao')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${trabalho.prestador}')"><i class="fas fa-comments"></i> Chat</button>
                <button class="btn btn-finalizar" onclick="finalizarTrabalho(${trabalho.id})"><i class="fas fa-check-circle"></i> Finalizar Trabalho</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para renderizar trabalhos finalizados
function renderTrabalhosFinalizados() {
    const container = document.getElementById('trabalhos-finalizados-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (trabalhosFinalizados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum trabalho finalizado ainda.</p>';
        return;
    }
    
    trabalhosFinalizados.forEach(trabalho => {
        const tipoClass = trabalho.tipo === 'visita' ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoLabel = trabalho.tipo === 'visita' ? 'Serviço com Visita' : 'Serviço Padrão';
        const tipoTextClass = trabalho.tipo === 'visita' ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const iconeTipo = trabalho.tipo === 'visita' ? 'fas fa-calendar-check' : 'fas fa-tools';
        
        // Criar estrelas de avaliação
        const estrelas = Array.from({length: 5}, (_, i) => 
            i < trabalho.avaliacao ? '<i class="fas fa-star" style="color: #ffc107;"></i>' : '<i class="far fa-star" style="color: #ddd;"></i>'
        ).join('');
        
        const card = document.createElement('div');
        card.classList.add('card', tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3><i class="${iconeTipo}"></i> ${trabalho.service}</h3>
                <div class="status finalizado">${trabalho.status}</div>
                <small class="${tipoTextClass}" style="font-weight: bold;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${trabalho.prestador}</p>
                <p><i class="fas fa-money-bill-wave"></i> Valor: ${trabalho.value}</p>
                <p><i class="fas fa-calendar-alt"></i> Finalizado em: ${trabalho.dataFinalizacao}</p>
                <p><i class="fas fa-clock"></i> Tempo realizado: ${trabalho.tempoRealizado}</p>
                <div class="avaliacao-container">
                    <p><i class="fas fa-star"></i> Avaliação: ${estrelas} (${trabalho.avaliacao}/5)</p>
                    ${trabalho.comentario ? `<p class="comentario"><i class="fas fa-comment"></i> "${trabalho.comentario}"</p>` : ''}
                </div>
            </div>
            <div class="actions trabalhos-finalizados-actions">
                <button class="btn btn-detalhes" onclick="openTrabalhoDetailsModal(${trabalho.id}, 'finalizado')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn btn-indicar" style="background-color: #28a745;" onclick="indicarPrestador(${trabalho.id})"><i class="fas fa-share"></i> Indicar Prestador</button>
                <button class="btn btn-solicitar" style="background-color: #007bff;" onclick="solicitarNovoServico('${trabalho.prestador}')"><i class="fas fa-plus-circle"></i> Solicitar Novo Serviço</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para atualizar contadores de trabalhos
function updateTrabalhosCount() {
    document.getElementById('trabalhos-execucao-count-tab').textContent = trabalhosEmExecucao.length;
    document.getElementById('trabalhos-finalizados-count-tab').textContent = trabalhosFinalizados.length;
    document.getElementById('trabalhos-count-dashboard').textContent = trabalhosEmExecucao.length + trabalhosFinalizados.length;
}

// Função para solicitar novo serviço de um prestador
function solicitarNovoServico(nomePrestador) {
    // Vai para a tela de solicitar orçamento
    showScreen('solicitacao-orcamento', 'Solicitar Orçamento');
    
    // Preenche automaticamente o campo do prestador na tela de orçamento
    setTimeout(() => {
        // Preenche o campo de prestador específico
        const prestadorField = document.getElementById('prestador-especifico');
        if (prestadorField) {
            prestadorField.value = nomePrestador;
            prestadorField.style.backgroundColor = '#f0f8ff'; // Destaque visual
        }
        
        // Adiciona mensagem explicativa
        showAlert(`Solicitando novo serviço do prestador: ${nomePrestador}. O nome do prestador já foi preenchido automaticamente. Complete os demais dados para enviar sua solicitação.`, 'Novo Serviço');
    }, 100);
}

// Função para indicar prestador
function indicarPrestador(trabalhoId) {
    const trabalho = trabalhosFinalizados.find(t => t.id === trabalhoId);
    if (!trabalho) return;
    
    // Primeiro mostra a mensagem de desconto
    showAlert(
        'Ao indicar prestadores você ganha descontos em seus próximos trabalhos!', 
        'Indicação Prestador',
        () => {
            // Depois de clicar OK, mostra as opções de indicação
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'indicar-prestador-modal';
            modal.style.display = 'flex';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button" onclick="closeModal('indicar-prestador-modal')">&times;</span>
                    <h2><i class="fas fa-share"></i> Indicar Prestador</h2>
                    <div class="prestador-info">
                        <h3>${trabalho.prestador}</h3>
                        <p><strong>Serviço realizado:</strong> ${trabalho.service}</p>
                        <p><strong>Valor:</strong> ${trabalho.value}</p>
                        <p><strong>Avaliação:</strong> ${trabalho.avaliacao}/5 estrelas</p>
                    </div>
                    <div class="indicacao-options">
                        <h4>Como você gostaria de indicar este prestador?</h4>
                        <button class="btn" onclick="indicarPorWhatsApp(${trabalhoId})">
                            <i class="fab fa-whatsapp"></i> Enviar por WhatsApp
                        </button>
                        <button class="btn" onclick="indicarDentroApp(${trabalhoId})">
                            <i class="fas fa-users"></i> Indicar dentro do App
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    );
}

// Função para indicar por WhatsApp
function indicarPorWhatsApp(trabalhoId) {
    const trabalho = trabalhosFinalizados.find(t => t.id === trabalhoId);
    if (!trabalho) return;
    
    const linkSite = 'https://chamadopro.com.br'; // Link do site
    const mensagem = `Quero indicar o ${trabalho.prestador}, que realizou um excelente trabalho aqui em casa.

O ChamadoPro é o melhor e melhor sistema de conexão entre profissionais prestadores de serviços.

Acesse ${linkSite} para ter acesso a todos os tipos de serviços.`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    
    closeModal('indicar-prestador-modal');
    window.open(whatsappUrl, '_blank');
}

// Função para indicar dentro do app
function indicarDentroApp(trabalhoId) {
    const trabalho = trabalhosFinalizados.find(t => t.id === trabalhoId);
    if (!trabalho) return;
    
    closeModal('indicar-prestador-modal');
    
    // Abrir modal para selecionar contato dentro do app
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'indicar-contato-modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal('indicar-contato-modal')">&times;</span>
            <h2><i class="fas fa-users"></i> Indicar para Contato</h2>
            <div class="indicacao-form">
                <div class="input-group">
                    <label>Email ou telefone do contato:</label>
                    <input type="text" id="contato-indicacao" placeholder="email@exemplo.com ou (11) 99999-9999">
                </div>
                <div class="input-group">
                    <label>Mensagem personalizada (opcional):</label>
                    <textarea id="mensagem-indicacao" placeholder="Escreva uma mensagem personalizada para seu contato..."></textarea>
                </div>
                <div class="prestador-preview">
                    <h4>Prestador que será indicado:</h4>
                    <p><strong>${trabalho.prestador}</strong></p>
                    <p>Serviço: ${trabalho.service}</p>
                    <p>Avaliação: ${trabalho.avaliacao}/5 ⭐</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="closeModal('indicar-contato-modal')">Cancelar</button>
                <button class="btn primary-btn" onclick="enviarIndicacao(${trabalhoId})">Enviar Indicação</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Função para enviar indicação dentro do app
function enviarIndicacao(trabalhoId) {
    const contato = document.getElementById('contato-indicacao').value;
    const mensagem = document.getElementById('mensagem-indicacao').value;
    
    if (!contato.trim()) {
        showAlert('Por favor, informe o email ou telefone do contato.', 'Erro');
        return;
    }
    
    // Aqui seria a integração com o backend para enviar a indicação
    closeModal('indicar-contato-modal');
    showAlert('Indicação enviada com sucesso! Seu contato receberá uma notificação com os dados do prestador.', 'Sucesso');
}

// Função para finalizar trabalho
function finalizarTrabalho(trabalhoId) {
    const trabalho = trabalhosEmExecucao.find(t => t.id === trabalhoId);
    if (!trabalho) return;
    
    showAlert(`Confirma a finalização do trabalho "${trabalho.service}" com ${trabalho.prestador}?`, 
              'Confirmar Finalização', 
              () => {
                  // Mover trabalho para finalizado
                  const index = trabalhosEmExecucao.findIndex(t => t.id === trabalhoId);
                  if (index !== -1) {
                      const trabalhoFinalizado = {...trabalho};
                      trabalhoFinalizado.status = 'Finalizado';
                      trabalhoFinalizado.dataFinalizacao = new Date().toISOString().split('T')[0];
                      trabalhoFinalizado.tempoRealizado = trabalho.tempoEstimado; // Simplificado
                      trabalhoFinalizado.avaliacao = 5; // Valor padrão
                      trabalhoFinalizado.comentario = 'Trabalho finalizado pelo cliente';
                      
                      trabalhosEmExecucao.splice(index, 1);
                      trabalhosFinalizados.unshift(trabalhoFinalizado);
                      
                      // Re-renderizar
                      renderTrabalhosEmExecucao();
                      renderTrabalhosFinalizados();
                      updateTrabalhosCount();
                      updateUserDashboardCounts(); // Atualiza contadores do dashboard
                      
                      showAlert('Trabalho finalizado com sucesso!', 'Sucesso');
                  }
              });
}

// === FIM DAS NOVAS FUNÇÕES ===

// Função para indicar ChamadoPro
function indicarChamadoPro() {
    const userType = document.getElementById('sidebar-usertype').textContent.includes('Cliente') ? 'cliente' : 'prestador';
    const userName = document.getElementById('sidebar-username').textContent;
    
    const linkApp = 'https://chamadopro.com/app'; // Link para download do app
    const linkSite = 'https://chamadopro.com'; // Link do site
    
    let mensagem = '';
    
    if (userType === 'cliente') {
        mensagem = `🏠 *Precisa de serviços para sua casa?*

Olá! Quero indicar o *ChamadoPro*, a melhor plataforma para encontrar prestadores de serviços qualificados! 

✅ *O que o ChamadoPro oferece:*
• Prestadores verificados e avaliados
• Orçamentos gratuitos de múltiplos profissionais
• Serviços de qualidade garantida
• Atendimento rápido e confiável

🏗️ *Serviços disponíveis:*
• Reformas e construção
• Elétrica e hidráulica
• Pintura e acabamentos
• Limpeza e jardinagem
• E muito mais!

💰 *Você recebe orçamentos gratuitos e escolhe o melhor preço!*

Baixe agora: ${linkApp}
Ou acesse: ${linkSite}

Indicado por: ${userName}
#ChamadoPro #ServiçosParaCasa #Reformas`;
    } else {
        mensagem = `Seu colega no ChamadoPro te indica essa!
Olá!

Seu colega [${userName}] lembrou de você e quer te apresentar o ChamadoPro!

Sabemos como é importante encontrar clientes qualificados e ter o trabalho organizado. Por isso, quero te apresentar a plataforma que já está otimizando o dia a dia de muitos prestadores, como eu!

Com o ChamadoPro, você terá acesso a:

Clientes prontos para fechar negócio: Chega de perder tempo! Receba solicitações de orçamento de quem realmente precisa do seu serviço.

Visibilidade que gera lucro: Seu perfil em destaque e um sistema de avaliações que valoriza seu trabalho, atraindo mais oportunidades.

Organização sem estresse: Um calendário de trabalhos, pagamentos seguros e relatórios financeiros que facilitam a gestão do seu dia a dia.

Não fique de fora dessa oportunidade!
🔗 Baixe nosso app: ${linkApp}
🔗 Ou acesse: https://chamadopro.com.br

Tem alguma dúvida?
📧 Fale com a gente: contato.chamadopro.com.br`;
    }
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    // Feedback visual com delay para aparecer após WhatsApp abrir
    setTimeout(() => {
        showAlert('Mensagem enviada! Quando seu indicado se cadastrar, você ganhará descontos especiais nos seus próximos serviços!', 'Indicação ChamadoPro');
    }, 1000);
}


// Funções de Orçamentos (Prestador)
function renderOrcamentosPrestadorRecebidos() {
    const container = document.getElementById('orcamentos-prestador-recebidos-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosPrestadorRecebidos.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhuma nova solicitação de orçamento aguardando.</p>';
        return;
    }
    orcamentosPrestadorRecebidos.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card');
        const isVisita = req.tipo === 'visita';
        const tipoClass = isVisita ? 'orcamento-visita' : 'orcamento-padrao';
        const tipoTextClass = isVisita ? 'tipo-orcamento-visita' : 'tipo-orcamento-padrao';
        const tipoIcon = isVisita ? '<i class="fas fa-calendar-check"></i>' : '<i class="fas fa-tools"></i>';
        const tipoLabel = isVisita ? 'Orçamento com Visita' : 'Orçamento Padrão';
        const actionText = isVisita ? 'Propor Visita' : 'Enviar Proposta';
        
        card.classList.add(tipoClass);
        card.innerHTML = `
            <div class="card-header">
                <h3>${req.title} ${tipoIcon}</h3>
                <div class="status aguardando">Nova Solicitação</div>
                <small class="${tipoTextClass}" style="font-style: italic;">${tipoLabel}</small>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: ${req.client}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${req.address}</p>
                <p><i class="fas fa-calendar-alt"></i> Data: ${req.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'recebido')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" style="background-color: #28a745;" onclick="openProposalFormModal(${req.id})"><i class="fas fa-paper-plane"></i> ${actionText}</button>
                <button class="btn btn-finalizar" onclick="openRefusalReasonModal(${req.id})"><i class="fas fa-times"></i> Recusar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosPrestadorPropostasEnviadas() {
    const container = document.getElementById('orcamentos-prestador-propostas-enviadas-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosPrestadorPropostasEnviadas.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhuma proposta enviada ainda.</p>';
        return;
    }
    orcamentosPrestadorPropostasEnviadas.forEach(proposal => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${proposal.serviceTitle} - ${proposal.value}</h3>
                <div class="status aguardando-confirmacao">Aguardando Cliente</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: ${proposal.client}</p>
                <p><i class="fas fa-calendar-alt"></i> Enviada em: ${proposal.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openProposalSentDetailsModal(${proposal.id})"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${proposal.client}')"><i class="fas fa-comments"></i> Chat</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosPrestadorAprovados() {
    const container = document.getElementById('orcamentos-prestador-aprovados-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosPrestadorAprovados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento aprovado por clientes ainda.</p>';
        return;
    }
    orcamentosPrestadorAprovados.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${budget.service} - ${budget.value}</h3>
                <div class="status em-andamento">Aprovado</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: ${budget.client}</p>
                <p><i class="fas fa-calendar-alt"></i> Agendado para: ${budget.scheduleDate} às ${budget.scheduleTime}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="showAlert('Ver detalhes do orçamento aprovado ${budget.id}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" onclick="openChat('${budget.client}')"><i class="fas fa-comments"></i> Chat</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosPrestadorRecusados() {
    // Não modifica o container principal pois contém as abas estáticas
    // As abas e conteúdo estão definidos estaticamente no HTML
    console.log('renderOrcamentosPrestadorRecusados chamada - conteúdo estático já presente no HTML');
}


// Funções de Serviços Ativos (para Prestador)
let serviceStatuses = {
    1: { status: 'Aguardando Início', alert: false },
    2: { status: 'Em Andamento', alert: false },
    3: { status: 'Aguardando Confirmação', alert: true },
    4: { status: 'Aguardando Início', alert: false } // Novo serviço de exemplo
};

function updateServiceCard(serviceId) {
    const statusElement = document.getElementById(`status-${serviceId}`);
    const actionsElement = document.getElementById(`actions-${serviceId}`);
    const alertElement = document.getElementById(`alert-${serviceId}`);

    if (statusElement && actionsElement && alertElement) {
        const currentStatus = serviceStatuses[serviceId].status;

        // Atualiza o texto e a classe de status
        statusElement.textContent = currentStatus;
        statusElement.className = `status ${currentStatus.toLowerCase().replace(/ /g, '-')}`;

        // Atualiza a visibilidade dos botões de ação
        document.getElementById(`start-btn-${serviceId}`).style.display = 'none';
        document.getElementById(`send-photo-btn-${serviceId}`).style.display = 'none';
        document.getElementById(`send-video-btn-${serviceId}`).style.display = 'none';
        document.getElementById(`chat-btn-${serviceId}`).style.display = 'none';
        document.getElementById(`finalize-btn-${serviceId}`).style.display = 'none';

        // Lógica para exibir/ocultar botões com base no status
        if (currentStatus === 'Aguardando Início') {
            document.getElementById(`start-btn-${serviceId}`).style.display = 'inline-flex';
        } else if (currentStatus === 'Em Andamento') {
            document.getElementById(`send-photo-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`send-video-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`chat-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`finalize-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`finalize-btn-${serviceId}`).classList.remove('btn-disabled');
            document.getElementById(`finalize-btn-${serviceId}`).style.cursor = 'pointer';
        } else if (currentStatus === 'Aguardando Confirmação') {
            document.getElementById(`send-photo-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`send-video-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`chat-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`finalize-btn-${serviceId}`).style.display = 'inline-flex';
            document.getElementById(`finalize-btn-${serviceId}`).classList.add('btn-disabled');
            document.getElementById(`finalize-btn-${serviceId}`).style.cursor = 'not-allowed';
        }

        // Atualiza a visibilidade do alerta
        alertElement.style.display = serviceStatuses[serviceId].alert ? 'block' : 'none';
    }
}

function startService(serviceId) {
    serviceStatuses[serviceId].status = 'Em Andamento';
    serviceStatuses[serviceId].alert = false;
    updateServiceCard(serviceId);
    showAlert(`Serviço ${serviceId} iniciado!`);
}

function openFinalizeModal(serviceId) {
    if (serviceStatuses[serviceId].status === 'Aguardando Confirmação') {
        showAlert('Este serviço já está aguardando confirmação do cliente e não pode ser finalizado novamente.');
        return;
    }
    currentFinalizeServiceId = serviceId;
    document.getElementById('finalize-modal-title').textContent = `Finalizar Serviço #${serviceId}`;
    document.getElementById('finalize-service-modal').style.display = 'flex';
    // Limpa os campos do modal
    document.getElementById('finalize-photos').value = '';
    document.getElementById('finalize-video').value = '';
    document.getElementById('finalize-obs').value = '';
}

document.getElementById('confirm-finalize-btn').addEventListener('click', () => {
    if (currentFinalizeServiceId !== null) {
        // Aqui você enviaria as fotos, vídeo e observações para o backend
        // Por enquanto, apenas simulamos a finalização
        serviceStatuses[currentFinalizeServiceId].status = 'Aguardando Confirmação';
        serviceStatuses[currentFinalizeServiceId].alert = true;
        updateServiceCard(currentFinalizeServiceId);
        showAlert(`Serviço #${currentFinalizeServiceId} finalizado e aguardando confirmação do cliente!`);
        closeModal('finalize-service-modal');
        currentFinalizeServiceId = null;
    }
});


// Funções de Chat
const chatHistories = {
    'Eletricista Silva': [
        { sender: 'received', message: 'Olá! Em que posso ajudar com a instalação da tomada?' },
        { sender: 'sent', message: 'Olá! A tomada que você instalou parou de funcionar. Poderia verificar?' },
        { sender: 'received', message: 'Certo, estou verificando minha agenda. Qual o melhor horário para você amanhã?' },
        { sender: 'sent', message: 'Qualquer horário após as 14h seria ótimo.' }
    ],
    'Pintor João': [
        { sender: 'received', message: 'Bom dia! Recebi seu pedido de orçamento para pintura. Alguma cor específica em mente?' },
        { sender: 'sent', message: 'Bom dia! Sim, quero um tom de cinza claro. Você tem um catálogo de cores?' },
        { sender: 'received', message: 'Tenho sim, levarei algumas amostras na visita. Confirmamos a visita para quinta-feira?' },
        { sender: 'sent', message: 'Perfeito! Quinta-feira às 10h está ótimo.' }
    ],
    'Construtora Alfa': [
        { sender: 'received', message: 'Olá! Recebemos sua solicitação de visita para a reforma. Poderia nos dar mais detalhes sobre o projeto?' },
        { sender: 'sent', message: 'Olá! É uma reforma completa da cozinha e dois banheiros. Preciso de um orçamento detalhado.' },
        { sender: 'received', message: 'Entendido. Nossa equipe técnica fará a avaliação no local. As datas sugeridas estão boas para você?' },
        { sender: 'sent', message: 'Sim, a primeira opção de data está ótima. Aguardo vocês!' }
    ],
    'Maria Oliveira': [
        { sender: 'received', message: 'Olá! Gostaria de saber se você já conseguiu analisar a proposta para o reparo de vazamento.' },
        { sender: 'sent', message: 'Olá Maria! Sim, estou finalizando o orçamento. Devo enviar em breve.' },
        { sender: 'received', message: 'Ok, fico no aguardo. Obrigada!' }
    ],
    'Roberto Santos': [
        { sender: 'received', message: 'Boa tarde! Sobre a manutenção do ar condicionado, qual a sua disponibilidade para a visita?' },
        { sender: 'sent', message: 'Boa tarde Roberto! Posso ir na sexta-feira pela manhã, entre 9h e 12h. Seria bom para você?' },
        { sender: 'received', message: 'Sim, sexta pela manhã é ótimo! Pode vir. Obrigado!' }
    ]
};

function openChat(partnerName) {
    currentChatPartner = partnerName;
    document.getElementById('chat-header-title').textContent = `Chat com ${partnerName}`;
    document.getElementById('chat-modal').style.display = 'flex';
    
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = ''; // Limpa o chat

    const history = chatHistories[partnerName] || [
        { sender: 'received', message: `Olá! Sou ${partnerName}. Como posso ajudar?` },
        { sender: 'sent', message: `Olá ${nomeDoClienteLogado}! Gostaria de conversar sobre um serviço.` }
    ];

    history.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', msg.sender);
        messageDiv.textContent = msg.message;
        chatBody.appendChild(messageDiv);
    });

    chatBody.scrollTop = chatBody.scrollHeight; // Rola para o final
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const messageText = chatInput.value.trim();
    if (messageText) {
        const chatBody = document.getElementById('chat-body');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');
        messageDiv.textContent = messageText;
        chatBody.appendChild(messageDiv);

        // Adiciona a mensagem ao histórico simulado
        if (!chatHistories[currentChatPartner]) {
            chatHistories[currentChatPartner] = [];
        }
        chatHistories[currentChatPartner].push({ sender: 'sent', message: messageText });

        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight; // Rola para o final

        // Simula uma resposta do "parceiro" após um pequeno atraso
        setTimeout(() => {
            const simulatedResponse = `Ok, ${nomeDoClienteLogado}. Entendido!`;
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('message', 'received');
            responseDiv.textContent = simulatedResponse;
            chatBody.appendChild(responseDiv);
            chatHistories[currentChatPartner].push({ sender: 'received', message: simulatedResponse });
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1500); // Responde após 1.5 segundos
    }
}

// Funções de Ocorrências
function renderUserOccurrences() {
    const container = document.getElementById('ocorrencias-usuario');
    // Limpa o conteúdo existente, mas mantém o section-header
    let headerHtml = '';
    const sectionHeader = container.querySelector('.section-header');
    if (sectionHeader) {
        headerHtml = sectionHeader.outerHTML;
    }
    container.innerHTML = headerHtml; // Limpa e adiciona o header de volta

    if (userOccurrences.length === 0) {
        container.innerHTML += '<p class="no-content-message">Nenhuma ocorrência registrada ainda.</p>';
        return;
    }
    userOccurrences.forEach(occurrence => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${occurrence.title}</h3>
                <div class="status ${occurrence.status.toLowerCase().replace(/ /g, '-')}">${occurrence.status}</div>
            </div>
            <div class="info">
                <p><i class="fas fa-wrench"></i> Serviço: ${occurrence.service}</p>
                <p><i class="fas fa-calendar-alt"></i> Aberta em: ${occurrence.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openOccurrenceDetailsModal(${occurrence.id}, 'usuario')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderProviderOccurrences() {
    const container = document.getElementById('ocorrencias-prestador');
    // Limpa o conteúdo existente, mas mantém o section-header
    let headerHtml = '';
    const sectionHeader = container.querySelector('.section-header');
    if (sectionHeader) {
        headerHtml = sectionHeader.outerHTML;
    }
    container.innerHTML = headerHtml; // Limpa e adiciona o header de volta

    if (providerOccurrences.length === 0) {
        container.innerHTML += '<p class="no-content-message">Nenhuma ocorrência registrada para seus serviços ainda.</p>';
        return;
    }
    providerOccurrences.forEach(occurrence => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${occurrence.title}</h3>
                <div class="status ${occurrence.status.toLowerCase().replace(/ /g, '-')}">${occurrence.status}</div>
            </div>
            <div class="info">
                <p><i class="fas fa-wrench"></i> Serviço: ${occurrence.service}</p>
                <p><i class="fas fa-user"></i> Cliente: ${occurrence.client}</p>
                <p><i class="fas fa-calendar-alt"></i> Aberta em: ${occurrence.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openOccurrenceDetailsModal(${occurrence.id}, 'prestador')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                ${occurrence.status === 'Em Análise' ? `<button class="btn" style="background-color: #28a745;" onclick="resolveOccurrence(${occurrence.id})"><i class="fas fa-check"></i> Resolver</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

function submitNewOccurrence() {
    const service = document.getElementById('ocorrencia-servico').value;
    const title = document.getElementById('ocorrencia-titulo').value.trim();
    const description = document.getElementById('ocorrencia-descricao').value.trim();
    const anexos = document.getElementById('ocorrencia-anexos').files;

    if (!service || !title || !description) {
        showAlert('Por favor, preencha todos os campos obrigatórios (Serviço, Título, Descrição).');
        return;
    }

    const newOccurrence = {
        id: userOccurrences.length + providerOccurrences.length + 1,
        service: service,
        title: title,
        description: description,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Em Análise',
        client: nomeDoClienteLogado, // Simulação
        prestador: 'Suporte ChamadoPro', // Simulação
        attachments: Array.from(anexos).map(file => URL.createObjectURL(file)), // Salva URLs temporárias
        chatHistory: [{ sender: 'Plataforma', message: 'Ocorrência aberta. Nossa equipe está analisando.', type: 'platform-highlight' }]
    };

    userOccurrences.push(newOccurrence);
    providerOccurrences.push(newOccurrence); // Adiciona para o prestador também para simulação

    showAlert('Ocorrência registrada com sucesso! Nossa equipe entrará em contato em breve.');
    document.getElementById('ocorrencia-servico').value = '';
    document.getElementById('ocorrencia-titulo').value = '';
    document.getElementById('ocorrencia-descricao').value = '';
    document.getElementById('ocorrencia-anexos').value = ''; // Limpa o input de arquivo
    updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
    updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
    goBack(); // Volta para a tela anterior
}

function openOccurrenceDetailsModal(occurrenceId, userType) {
    const occurrence = (userType === 'usuario' ? userOccurrences : providerOccurrences).find(o => o.id === occurrenceId);
    if (!occurrence) return;

    document.getElementById('occurrence-details-title').textContent = `Ocorrência #${occurrence.id}`;
    document.getElementById('occurrence-details-service').textContent = occurrence.service;
    document.getElementById('occurrence-details-participant').textContent = userType === 'usuario' ? occurrence.prestador : occurrence.client;
    document.getElementById('occurrence-details-opening-date').textContent = occurrence.date;
    document.getElementById('occurrence-details-status').textContent = occurrence.status;
    document.getElementById('occurrence-details-description').textContent = occurrence.description;

    const resolutionDateContainer = document.getElementById('occurrence-details-resolution-date-container');
    if (occurrence.status === 'Resolvida' && occurrence.resolutionDate) {
        document.getElementById('occurrence-details-resolution-date').textContent = occurrence.resolutionDate;
        resolutionDateContainer.style.display = 'block';
    } else {
        resolutionDateContainer.style.display = 'none';
    }

    const chatHistoryContainer = document.getElementById('occurrence-details-chat-history');
    chatHistoryContainer.innerHTML = ''; // Limpa o chat
    occurrence.chatHistory.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.sender === 'Plataforma' ? 'platform-highlight' : (msg.sender === nomeDoClienteLogado ? 'sent' : 'received'));
        msgDiv.textContent = msg.message;
        chatHistoryContainer.appendChild(msgDiv);
    });
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight; // Rola para o final

    document.getElementById('occurrence-details-modal').style.display = 'flex';
}

function resolveOccurrence(occurrenceId) {
    const occurrenceIndex = providerOccurrences.findIndex(o => o.id === occurrenceId);
    if (occurrenceIndex !== -1) {
        providerOccurrences[occurrenceIndex].status = 'Resolvida';
        providerOccurrences[occurrenceIndex].resolutionDate = new Date().toLocaleDateString('pt-BR');
        providerOccurrences[occurrenceIndex].chatHistory.push({ sender: 'Plataforma', message: 'Ocorrência resolvida pelo prestador.', type: 'platform-highlight' });
        
        // Atualiza a ocorrência correspondente no array do usuário também
        const userOccurrenceIndex = userOccurrences.findIndex(o => o.id === occurrenceId);
        if (userOccurrenceIndex !== -1) {
            userOccurrences[userOccurrenceIndex].status = 'Resolvida';
            userOccurrences[userOccurrenceIndex].resolutionDate = new Date().toLocaleDateString('pt-BR');
            userOccurrences[userOccurrenceIndex].chatHistory.push({ sender: 'Plataforma', message: 'Ocorrência resolvida pelo prestador.', type: 'platform-highlight' });
        }

        showAlert(`Ocorrência #${occurrenceId} marcada como resolvida!`);
        renderProviderOccurrences();
        updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
    }
}


// Funções de Busca de Serviços (Usuário)
function handleBudgetRequestClick() {
    // Este botão é o "Anuncie seu serviço aqui!" que agora redireciona para a tela de solicitação de orçamento
    showScreen('solicitacao-orcamento');
}

function performServiceSearch() {
    const searchTerm = document.getElementById('service-search-input').value.toLowerCase();
    renderSponsoredServices(searchTerm);
}

function renderSponsoredServices(searchTerm = '') {
    const container = document.getElementById('sponsored-services-list');
    if (!container) return;
    container.innerHTML = '';
    const filteredServices = sponsoredServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.type.toLowerCase().includes(searchTerm)
    );

    if (filteredServices.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum serviço encontrado para sua busca.</p>';
        return;
    }

    filteredServices.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('sponsored-service-card');
        card.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <button class="btn" onclick="showScreen('solicitacao-orcamento')">Solicitar Orçamento</button>
        `;
        container.appendChild(card);
    });
}

function renderSponsoredVisitServices(searchTerm = '') {
    const container = document.getElementById('sponsored-visit-services-list');
    if (!container) return;
    container.innerHTML = '';
    const filteredServices = sponsoredVisitServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.type.toLowerCase().includes(searchTerm)
    );

    if (filteredServices.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum profissional encontrado para sua busca.</p>';
        return;
    }

    filteredServices.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('sponsored-service-card');
        card.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <button class="btn" onclick="openPrestadorProfileModal(${service.id})">Ver Perfil e Solicitar Visita</button>
        `;
        container.appendChild(card);
    });
}


// Objeto para armazenar arquivos anexados
let attachedFiles = {
    fotos: [],
    video: []
};

// Função principal para lidar com upload de arquivos
function handleFileUpload(input, category, maxCount, type, maxDuration = 0) {
    const files = Array.from(input.files);
    
    // Verifica se excede o limite
    if (attachedFiles[category].length + files.length > maxCount) {
        showAlert(`Você pode anexar no máximo ${maxCount} ${type === 'image' ? 'fotos' : 'vídeos'}.`);
        input.value = '';
        return false;
    }
    
    // Para vídeos, limpa os anteriores (máximo 1)
    if (type === 'video') {
        attachedFiles[category] = [];
    }
    
    // Processa cada arquivo
    files.forEach(file => {
        if (type === 'video' && maxDuration > 0) {
            validateVideoDuration(file, maxDuration, (isValid) => {
                if (isValid) {
                    addFileToPreview(file, category, type);
                } else {
                    input.value = '';
                }
            });
        } else {
            addFileToPreview(file, category, type);
        }
    });
    
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    input.value = '';
    return true;
}

// Valida duração do vídeo
function validateVideoDuration(file, maxDuration, callback) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > maxDuration) {
            showAlert(`O vídeo não pode ter mais de ${maxDuration} segundos.`);
            callback(false);
        } else {
            callback(true);
        }
    };
    video.src = URL.createObjectURL(file);
}

// Adiciona arquivo ao preview
function addFileToPreview(file, category, type) {
    const fileData = {
        file: file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: type,
        id: Date.now() + Math.random() // ID único
    };
    
    attachedFiles[category].push(fileData);
    updatePreviewDisplay(category, type);
}

// Atualiza a exibição do preview
function updatePreviewDisplay(category, type) {
    const previewContainer = document.getElementById(`preview-${category}`);
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    attachedFiles[category].forEach((fileData, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = `file-preview-item ${type}-file`;
        
        let mediaElement = '';
        if (type === 'image') {
            mediaElement = `<img src="${fileData.url}" alt="Preview">`;
        } else if (type === 'video') {
            mediaElement = `<video src="${fileData.url}" controls></video>`;
        }
        
        previewItem.innerHTML = `
            ${mediaElement}
            <div class="file-preview-info">
                ${fileData.name}<br>
                <small>${formatFileSize(fileData.size)}</small>
            </div>
            <button class="file-delete-btn" onclick="removeFile('${category}', ${index})" title="Remover arquivo">
                ✕
            </button>
        `;
        
        previewContainer.appendChild(previewItem);
    });
}

// Remove arquivo do preview
function removeFile(category, index) {
    if (attachedFiles[category][index]) {
        // Revoga a URL do objeto para liberar memória
        URL.revokeObjectURL(attachedFiles[category][index].url);
        
        // Remove o arquivo do array
        attachedFiles[category].splice(index, 1);
        
        // Atualiza o preview
        const type = category === 'video' ? 'video' : 'image';
        updatePreviewDisplay(category, type);
        
        showAlert('Arquivo removido com sucesso!', 'Sucesso');
    }
}

// Formata o tamanho do arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Limpa todos os arquivos anexados
function clearAllAttachedFiles() {
    Object.keys(attachedFiles).forEach(category => {
        attachedFiles[category].forEach(fileData => {
            URL.revokeObjectURL(fileData.url);
        });
        attachedFiles[category] = [];
        updatePreviewDisplay(category, category === 'video' ? 'video' : 'image');
    });
}


// Funções de Solicitação de Orçamento (Usuário)
function validateFiles(input, maxCount, type, maxDuration = 0) {
    const files = input.files;
    if (files.length > maxCount) {
        showAlert(`Você pode anexar no máximo ${maxCount} ${type === 'image' ? 'fotos' : 'vídeos'}.`);
        input.value = ''; // Limpa a seleção
        return false;
    }

    if (type === 'video' && files.length > 0 && maxDuration > 0) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > maxDuration) {
                showAlert(`O vídeo não pode ter mais de ${maxDuration} segundos.`);
                input.value = '';
            }
        };
        video.src = URL.createObjectURL(files[0]);
    }
    return true;
}

function submitBudgetRequest() {
    const title = document.getElementById('orcamento-titulo').value.trim();
    const description = document.getElementById('orcamento-descricao').value.trim();

    if (!title || !description) {
        showAlert('Por favor, preencha o título e a descrição do serviço.');
        return;
    }

    // Usa os arquivos do novo sistema de anexos
    const photos = attachedFiles.fotos.map(fileData => fileData.url);
    const video = attachedFiles.video.length > 0 ? attachedFiles.video[0].url : '';

    const newRequestId = orcamentosUsuarioSolicitados.length > 0 ? Math.max(...orcamentosUsuarioSolicitados.map(o => o.id)) + 1 : 1;

    const newRequest = {
        id: newRequestId,
        title: title,
        description: description,
        client: nomeDoClienteLogado, // Simulação
        address: 'Endereço do Usuário Atual', // Simulação
        date: new Date().toLocaleDateString('pt-BR'),
        photos: photos,
        video: video
    };

    orcamentosUsuarioSolicitados.push(newRequest);
    showAlert('Solicitação de orçamento enviada com sucesso!');
    
    // Limpa o formulário
    document.getElementById('orcamento-titulo').value = '';
    document.getElementById('orcamento-descricao').value = '';
    document.getElementById('prestador-especifico').value = '';
    
    // Limpa os arquivos anexados e previews
    clearAllAttachedFiles();

    updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
    updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
    showScreen('orcamentos-usuario'); // Volta para a tela de orçamentos do usuário
    switchCpTab('orcamentos-usuario', 'solicitados'); // Garante que a aba de solicitados esteja ativa
}


// Funções de Histórico de Serviços (Prestador)
function renderServicosHistoricoFinalizados() {
    const container = document.getElementById('servicos-historico-finalizados-content');
    if (!container) return;
    container.innerHTML = '';
    if (servicosHistoricoCount === 0) { // Usando a variável de contagem simulada
        container.innerHTML = '<p class="no-content-message">Nenhum serviço finalizado ainda.</p>';
        return;
    }
    // Exemplo de cards de serviços finalizados
    for (let i = 0; i < servicosHistoricoCount; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>Serviço Finalizado #${i + 1}</h3>
                <div class="status finalizado">Finalizado</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: Cliente Exemplo ${i + 1}</p>
                <p><i class="fas fa-calendar-alt"></i> Data: 2024-06-${20 - i}</p>
                <p><i class="fas fa-dollar-sign"></i> Valor: R$ ${((i + 1) * 100).toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="showAlert('Ver detalhes do serviço finalizado ${i + 1}')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    }
}

function renderServicosHistoricoRecusados() {
    const container = document.getElementById('servicos-historico-recusados-content');
    
    if (!container) {
        console.warn("Container 'servicos-historico-recusados-content' não encontrado. Não foi possível renderizar serviços recusados.");
        return; // Sai da função se o contêiner não for encontrado
    }

    container.innerHTML = '';
    if (orcamentosPrestadorRecusados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum serviço recusado ainda.</p>';
        return;
    }
    orcamentosPrestadorRecusados.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${req.title}</h3>
                <div class="status default">Recusado</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: ${req.client}</p>
                <p><i class="fas fa-map-marker-alt"></i> Data: ${req.date}</p>
                <p><i class="fas fa-info-circle"></i> Motivo: ${req.reason}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'recusado')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções Financeiras
function updateFinanceiroDashboard() {
    document.getElementById('total-recebimentos').textContent = `R$ ${totalRecebimentos.toFixed(2).replace('.', ',')}`;
    document.getElementById('a-liberar').textContent = `R$ ${aLiberar.toFixed(2).replace('.', ',')}`;
}

function simulateServiceAwaitingRelease(amount) {
    aLiberar += amount;
    updateFinanceiroDashboard();
    showAlert(`R$ ${amount.toFixed(2).replace('.', ',')} adicionados ao valor 'A Liberar pela Plataforma'.`);
}

function simulateServiceCompletion(amount) {
    totalRecebimentos += amount;
    updateFinanceiroDashboard();
    showAlert(`R$ ${amount.toFixed(2).replace('.', ',')} adicionados ao 'Recebimentos Totais'.`);
}

function showBankDetailsForm() {
    const formContainer = document.getElementById('bank-details-form-container');
    if (formContainer) {
        formContainer.style.display = 'block';
    }
    const cancelBtn = document.getElementById('cancel-bank-details-edit-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'inline-flex';
    }
}

function clearBankDetailsForm() {
    document.getElementById('banco').value = '';
    document.getElementById('agencia').value = '';
    document.getElementById('conta').value = '';
    document.getElementById('tipo-conta').value = 'corrente';
    const formContainer = document.getElementById('bank-details-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    const cancelBtn = document.getElementById('cancel-bank-details-edit-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

function renderBankAccounts() {
    const container = document.getElementById('bank-accounts-container');
    if (!container) return;
    container.innerHTML = '';
    if (bankAccounts.length === 0) {
        const noAccountsMessage = document.getElementById('no-bank-accounts-message');
        if (noAccountsMessage) noAccountsMessage.style.display = 'block';
        return;
    }
    const noAccountsMessage = document.getElementById('no-bank-accounts-message');
    if (noAccountsMessage) noAccountsMessage.style.display = 'none';
    bankAccounts.forEach((account, index) => {
        const item = document.createElement('div');
        item.classList.add('account-item');
        item.innerHTML = `
            <p><strong>Banco:</strong> ${account.banco}</p>
            <p><strong>Agência:</strong> ${account.agencia}</p>
            <p><strong>Conta:</strong> ${account.conta} (${account.tipoConta})</p>
            <div class="actions">
                <button class="btn" onclick="editBankAccount(${index})">Editar</button>
                <button class="btn btn-finalizar" onclick="deleteBankAccount(${index})">Excluir</button>
            </div>
        `;
        container.appendChild(item);
    });
}

document.getElementById('save-bank-details-btn').addEventListener('click', () => {
    const banco = document.getElementById('banco').value.trim();
    const agencia = document.getElementById('agencia').value.trim();
    const conta = document.getElementById('conta').value.trim();
    const tipoConta = document.getElementById('tipo-conta').value;

    if (!banco || !agencia || !conta) {
        showAlert('Por favor, preencha todos os campos bancários.');
        return;
    }

    const newAccount = { banco, agencia, conta, tipoConta };
    
    // Verifica se está editando ou adicionando
    const editingIndex = document.getElementById('save-bank-details-btn').dataset.editingIndex;
    if (editingIndex !== undefined && editingIndex !== '') {
        bankAccounts[parseInt(editingIndex)] = newAccount;
        showAlert('Conta bancária atualizada com sucesso!');
    } else {
        bankAccounts.push(newAccount);
        showAlert('Conta bancária cadastrada com sucesso!');
    }

    renderBankAccounts();
    clearBankDetailsForm();
    document.getElementById('save-bank-details-btn').removeAttribute('data-editing-index'); // Limpa o índice de edição
});

function editBankAccount(index) {
    const account = bankAccounts[index];
    document.getElementById('banco').value = account.banco;
    document.getElementById('agencia').value = account.agencia;
    document.getElementById('conta').value = account.conta;
    document.getElementById('tipo-conta').value = account.tipoConta;
    document.getElementById('save-bank-details-btn').dataset.editingIndex = index; // Armazena o índice para edição
    showBankDetailsForm(); // Exibe o formulário
}

function deleteBankAccount(index) {
    // Usando o modal de alerta personalizado para a confirmação de exclusão
    showAlert('Tem certeza que deseja excluir esta conta bancária?', 'Confirmação', () => {
        bankAccounts.splice(index, 1);
        renderBankAccounts();
        showAlert('Conta bancária excluída.');
    });
}


// Funções de Simulação de Fluxo de Serviço
let currentSimulationStep = 0;
const simulationSteps = [
    'Solicitação do Serviço',
    'Aceite do Prestador',
    'Prestador a Caminho',
    'Serviço em Andamento',
    'Finalização do Serviço',
    'Confirmação do Cliente',
    'Pagamento Processado'
];

function updateSimulationDisplay() {
    simulationSteps.forEach((stepText, index) => {
        const stepElement = document.getElementById(`step-${index + 1}`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            if (index < currentSimulationStep) {
                stepElement.classList.add('completed');
            } else if (index === currentSimulationStep) {
                stepElement.classList.add('active');
            }
        }
    });

    const startBtn = document.getElementById('start-simulation-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const resetBtn = document.getElementById('reset-simulation-btn');
    
    if (startBtn) {
        startBtn.style.display = currentSimulationStep === 0 ? 'inline-flex' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentSimulationStep < simulationSteps.length ? 'inline-flex' : 'none';
    }
    
    if (resetBtn) {
        resetBtn.style.display = currentSimulationStep > 0 ? 'inline-flex' : 'none';
    }

    if (currentSimulationStep >= simulationSteps.length) {
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        showAlert('Simulação concluída!');
    }
}

function startSimulation() {
    currentSimulationStep = 1;
    updateSimulationDisplay();
}

function nextSimulationStep() {
    if (currentSimulationStep < simulationSteps.length) { // Corrigido para .length
        currentSimulationStep++;
        updateSimulationDisplay();
    }
}

function resetSimulation() {
    currentSimulationStep = 0;
    updateSimulationDisplay();
}

// Função para inicializar simulação apenas se elementos existirem
function initializeSimulationIfExists() {
    const startBtn = document.getElementById('start-simulation-btn');
    if (startBtn) {
        updateSimulationDisplay();
    }
}


// Funções de Modais de Detalhes e Propostas
function openRequestDetailsModal(requestId, type) {
    let request;
    if (type === 'solicitado') {
        request = orcamentosUsuarioSolicitados.find(req => req.id === requestId);
    } else if (type === 'recebido') {
        request = orcamentosPrestadorRecebidos.find(req => req.id === requestId);
    } else if (type === 'recusado') {
        request = orcamentosPrestadorRecusados.find(req => req.id === requestId);
    }
    
    if (!request) return;

    document.getElementById('request-details-id').textContent = request.id;
    document.getElementById('request-details-client').textContent = request.client;
    document.getElementById('request-details-address').textContent = request.address;
    document.getElementById('request-details-date').textContent = request.date;
    document.getElementById('request-details-description').textContent = request.description;

    const photosContainer = document.getElementById('request-details-photos');
    photosContainer.innerHTML = '';
    if (request.photos && request.photos.length > 0) {
        request.photos.forEach(photoUrl => {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.classList.add('attachment-thumbnail');
            img.onclick = () => window.open(photoUrl, '_blank'); // Abre em nova aba
            photosContainer.appendChild(img);
        });
        photosContainer.style.display = 'flex';
    } else {
        photosContainer.style.display = 'none';
    }

    const videoContainer = document.getElementById('request-details-video-container');
    videoContainer.innerHTML = '';
    if (request.video) {
        const video = document.createElement('video');
        video.src = request.video;
        video.controls = true;
        video.classList.add('attachment-video');
        videoContainer.appendChild(video);
        videoContainer.style.display = 'block';
    } else {
        videoContainer.style.display = 'none';
    }

    const noAttachmentsMessage = document.getElementById('no-attachments-message');
    if ((!request.photos || request.photos.length === 0) && !request.video) {
        noAttachmentsMessage.style.display = 'block';
    } else {
        noAttachmentsMessage.style.display = 'none';
    }

    document.getElementById('request-details-modal').style.display = 'flex';
}

function openReceivedBudgetDetailsModal(budgetId) {
    const budget = orcamentosUsuarioRecebidos.find(b => b.id === budgetId);
    if (!budget) return;

    document.getElementById('received-budget-id').textContent = budget.id;
    document.getElementById('received-budget-prestador').textContent = budget.prestador;
    document.getElementById('received-budget-service').textContent = budget.service;
    document.getElementById('received-budget-value').textContent = budget.value;
    document.getElementById('received-budget-date').textContent = budget.date;
    document.getElementById('received-budget-estimated-time').textContent = budget.estimatedTime;
    document.getElementById('received-budget-prestador-description').textContent = budget.description;

    const materialsTitle = document.getElementById('received-budget-materials-title');
    const materialsContent = document.getElementById('received-budget-materials');
    if (budget.materials) {
        materialsTitle.style.display = 'block';
        materialsContent.style.display = 'block';
        materialsContent.textContent = budget.materials;
    } else {
        materialsTitle.style.display = 'none';
        materialsContent.style.display = 'none';
    }

    // Carregar anexos da solicitação original (simulação)
    const originalRequest = orcamentosUsuarioSolicitados.find(req => req.id === budget.id); // Assumindo que o ID do orçamento recebido corresponde ao ID da solicitação original para fins de simulação
    const originalPhotosContainer = document.getElementById('received-budget-original-photos');
    originalPhotosContainer.innerHTML = '';
    const originalVideoContainer = document.getElementById('received-budget-original-video-container');
    originalVideoContainer.innerHTML = '';
    const noOriginalAttachmentsMessage = document.getElementById('no-original-attachments-message');

    if (originalRequest && (originalRequest.photos.length > 0 || originalRequest.video)) {
        if (originalRequest.photos && originalRequest.photos.length > 0) {
            originalRequest.photos.forEach(photoUrl => {
                const img = document.createElement('img');
                img.src = photoUrl;
                img.classList.add('attachment-thumbnail');
                img.onclick = () => window.open(photoUrl, '_blank');
                originalPhotosContainer.appendChild(img);
            });
            originalPhotosContainer.style.display = 'flex';
        } else {
            originalPhotosContainer.style.display = 'none';
        }

        if (originalRequest.video) {
            const video = document.createElement('video');
            video.src = originalRequest.video;
            video.controls = true;
            video.classList.add('attachment-video');
            originalVideoContainer.appendChild(video);
            originalVideoContainer.style.display = 'block';
        } else {
            originalVideoContainer.style.display = 'none';
        }
        noOriginalAttachmentsMessage.style.display = 'none';
    } else {
        originalPhotosContainer.style.display = 'none';
        originalVideoContainer.style.display = 'none';
        noOriginalAttachmentsMessage.style.display = 'block';
    }

    // Configura botões de ação
    document.getElementById('approve-received-budget-btn').onclick = () => openScheduleProposalModal(budget.id);
    document.getElementById('refuse-received-budget-btn').onclick = () => openUserRefusalReasonModal(budget.id);

    document.getElementById('received-budget-details-modal').style.display = 'flex';
}


function openProposalFormModal(requestId) {
    currentRefusalRequestId = null; // Limpa qualquer ID de recusa anterior
    const request = orcamentosPrestadorRecebidos.find(req => req.id === requestId);
    if (!request) return;

    // Verifica se é um orçamento com visita
    if (request.tipo === 'visita') {
        // Mostra o modal de aviso sobre a taxa para orçamentos com visita
        showVisitFeeWarning(request);
    } else {
        // Se for orçamento padrão, abre diretamente o formulário
        openProposalForm(request);
    }
}

// Função para mostrar o modal de aviso da taxa de visita
function showVisitFeeWarning(request) {
    const modal = document.getElementById('visit-fee-warning-modal');
    const payBtn = document.getElementById('visit-fee-pay-btn');
    // Remove listeners anteriores para evitar duplicação
    const newPayBtn = payBtn.cloneNode(true);
    payBtn.parentNode.replaceChild(newPayBtn, payBtn);
    // Adiciona o listener para abrir o modal de pagamento
    newPayBtn.onclick = function() {
        closeModal('visit-fee-warning-modal');
        setTimeout(() => {
            document.getElementById('visit-fee-payment-modal').style.display = 'block';
            // Seleciona PIX como padrão
            if (typeof selectVisitPaymentMethod === 'function') selectVisitPaymentMethod('pix');
        }, 200);
    };
    // Mostra o modal
    modal.style.display = 'flex';
}

// Função separada para abrir o formulário de proposta
function openProposalForm(request) {
    document.getElementById('proposal-request-id').textContent = request.id;
    document.getElementById('proposal-value').value = '';
    document.getElementById('proposal-deadline').value = '';
    document.getElementById('proposal-estimated-time').value = '';
    document.getElementById('proposal-obs').value = '';

    document.getElementById('send-proposal-btn').onclick = () => sendProposal(request.id);
    document.getElementById('proposal-form-modal').style.display = 'flex';
}

function sendProposal(requestId) {
    const value = document.getElementById('proposal-value').value;
    const deadline = document.getElementById('proposal-deadline').value.trim();
    const estimatedTime = document.getElementById('proposal-estimated-time').value;
    const obs = document.getElementById('proposal-obs').value.trim();

    if (!value || !deadline || !estimatedTime) {
        showAlert('Por favor, preencha o valor, prazo e tempo de execução da proposta.');
        return;
    }

    const requestIndex = orcamentosPrestadorRecebidos.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
        const originalRequest = orcamentosPrestadorRecebidos.splice(requestIndex, 1)[0];

        const newProposal = {
            id: originalRequest.id,
            serviceTitle: originalRequest.title,
            client: originalRequest.client,
            value: `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`,
            deadline: deadline,
            estimatedTime: parseFloat(estimatedTime),
            obs: obs,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Aguardando Cliente'
        };
        orcamentosPrestadorPropostasEnviadas.push(newProposal);
        showAlert(`Proposta para solicitação #${requestId} enviada com sucesso!`);
        updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
        updatePrestadorBudgetCounts(); // Atualiza o contador da aba de orçamentos do prestador
        renderOrcamentosPrestadorRecebidos(); // Atualiza a lista de recebidos
        renderOrcamentosPrestadorPropostasEnviadas(); // Atualiza a lista de propostas enviadas
        closeModal('proposal-form-modal');
    }
}

function openRefusalReasonModal(requestId) {
    currentRefusalRequestId = requestId;
    document.getElementById('refusal-request-id').textContent = requestId;
    document.getElementById('refusal-reason-modal').style.display = 'flex';
    // Limpa checkboxes e textarea
    document.querySelectorAll('input[name="refusal-reason"]').forEach(cb => cb.checked = false);
    document.getElementById('other-reason-checkbox').checked = false;
    document.getElementById('other-reason-text').value = '';
    document.getElementById('other-reason-group').style.display = 'none';
}

function toggleOtherReason(checkbox) {
    const otherReasonCheckbox = document.getElementById('other-reason-checkbox');
    const otherReasonGroup = document.getElementById('other-reason-group');
    if (checkbox === otherReasonCheckbox) {
        otherReasonGroup.style.display = checkbox.checked ? 'block' : 'none';
        if (!checkbox.checked) {
            document.getElementById('other-reason-text').value = '';
        }
    }
}

document.getElementById('confirm-refusal-btn').addEventListener('click', () => {
    if (currentRefusalRequestId === null) return;

    const selectedReasons = [];
    document.querySelectorAll('input[name="refusal-reason"]:checked').forEach(cb => {
        selectedReasons.push(cb.value);
    });

    let refusalText = '';
    if (selectedReasons.includes('Outro')) {
        const otherReason = document.getElementById('other-reason-text').value.trim();
        if (otherReason) {
            refusalText = `Outro: ${otherReason}`;
        } else {
            showAlert('Por favor, especifique o "Outro" motivo ou desmarque a opção.');
            return;
        }
    }

    if (selectedReasons.length === 0) {
        showAlert('Por favor, selecione pelo menos um motivo para a recusa.');
        return;
    }

    let reasonsDisplay = selectedReasons.filter(reason => reason !== 'Outro').join(', ');
    if (refusalText) {
        reasonsDisplay += (reasonsDisplay ? '; ' : '') + refusalText;
    }

    const requestIndex = orcamentosPrestadorRecebidos.findIndex(req => req.id === currentRefusalRequestId);
    if (requestIndex !== -1) {
        const rejectedRequest = orcamentosPrestadorRecebidos.splice(requestIndex, 1)[0];
        rejectedRequest.reason = reasonsDisplay; // Adiciona o motivo da recusa
        orcamentosPrestadorRecusados.push(rejectedRequest);
        showAlert(`Solicitação #${currentRefusalRequestId} recusada!\nMotivo(s): ${reasonsDisplay}`);
        updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
        updatePrestadorBudgetCounts(); // Atualiza o contador da aba de orçamentos do prestador
        renderOrcamentosPrestadorRecebidos();
        renderOrcamentosPrestadorRecusados();
        closeModal('refusal-reason-modal');
        currentRefusalRequestId = null;
    }
});

function openUserRefusalReasonModal(budgetId) {
    currentUserRefusalBudgetId = budgetId;
    document.getElementById('user-refusal-budget-id').textContent = budgetId;
    document.getElementById('user-refusal-reason-modal').style.display = 'flex';
    // Limpa checkboxes e textarea
    document.querySelectorAll('input[name="user-refusal-reason"]').forEach(cb => cb.checked = false);
    document.getElementById('user-other-reason-checkbox').checked = false;
    document.getElementById('user-other-reason-text').value = '';
    document.getElementById('user-other-reason-group').style.display = 'none';
}

function toggleUserOtherReason(checkbox) {
    const otherReasonCheckbox = document.getElementById('user-other-reason-checkbox');
    const otherReasonGroup = document.getElementById('user-other-reason-group');
    if (checkbox === otherReasonCheckbox) {
        otherReasonGroup.style.display = checkbox.checked ? 'block' : 'none';
        if (!checkbox.checked) {
            document.getElementById('user-other-reason-text').value = '';
        }
    }
}

document.getElementById('confirm-user-refusal-btn').addEventListener('click', () => {
    if (currentUserRefusalBudgetId === null) return;

    const selectedReasons = [];
    document.querySelectorAll('input[name="user-refusal-reason"]:checked').forEach(cb => {
        selectedReasons.push(cb.value);
    });

    let refusalText = '';
    if (selectedReasons.includes('Outro')) {
        const otherReason = document.getElementById('user-other-reason-text').value.trim();
        if (otherReason) {
            refusalText = `Outro: ${otherReason}`;
        } else {
            showAlert('Por favor, especifique o "Outro" motivo ou desmarque a opção.');
            return;
        }
    }

    if (selectedReasons.length === 0) {
        showAlert('Por favor, selecione pelo menos um motivo para a recusa.');
        return;
    }

    let reasonsDisplay = selectedReasons.filter(reason => reason !== 'Outro').join(', ');
    if (refusalText) {
        reasonsDisplay += (reasonsDisplay ? '; ' : '') + refusalText;
    }

    const budgetIndex = orcamentosUsuarioRecebidos.findIndex(b => b.id === currentUserRefusalBudgetId);
    if (budgetIndex !== -1) {
        const rejectedBudget = orcamentosUsuarioRecebidos.splice(budgetIndex, 1)[0];
        rejectedBudget.reason = reasonsDisplay; // Adiciona o motivo da recusa
        orcamentosUsuarioRecusados.push(rejectedBudget);
        showAlert(`Orçamento #${currentUserRefusalBudgetId} recusado!\nMotivo(s): ${reasonsDisplay}`);
        updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
        updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
        renderOrcamentosUsuarioRecebidos();
        renderOrcamentosUsuarioRecusados();
        closeModal('user-refusal-reason-modal');
        currentUserRefusalBudgetId = null;
    }
});


function openProposalSentDetailsModal(proposalId) {
    const proposal = orcamentosPrestadorPropostasEnviadas.find(p => p.id === proposalId);
    if (!proposal) return;

    document.getElementById('proposal-sent-id').textContent = proposal.id;
    document.getElementById('proposal-sent-client').textContent = proposal.client;
    document.getElementById('proposal-sent-service').textContent = proposal.serviceTitle;
    document.getElementById('proposal-sent-value').textContent = proposal.value;
    document.getElementById('proposal-sent-deadline').textContent = proposal.deadline;
    document.getElementById('proposal-sent-estimated-time').textContent = proposal.estimatedTime;
    document.getElementById('proposal-sent-obs').textContent = proposal.obs;
    document.getElementById('proposal-sent-status').textContent = proposal.status;

    document.getElementById('proposal-sent-details-modal').style.display = 'flex';
}

function openScheduleProposalModal(budgetId) {
    currentScheduleBudgetId = budgetId;
    const budget = orcamentosUsuarioRecebidos.find(b => b.id === budgetId);
    if (!budget) return;

    document.getElementById('schedule-budget-id').textContent = budget.id;
    document.getElementById('schedule-estimated-time-alert').textContent = budget.estimatedTime; // Updated ID

    // Limpa campos de data/hora
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`schedule-date-${i}`).value = '';
        document.getElementById(`schedule-time-${i}`).value = '';
        document.getElementById(`estimated-end-time-${i}`).textContent = '';
    }
    document.getElementById('schedule-obs').value = '';

    document.getElementById('send-schedule-proposals-btn').onclick = () => sendScheduleProposals(budgetId, budget.estimatedTime);
    document.getElementById('schedule-proposal-modal').style.display = 'flex';
}

function calculateEndTime(optionNum) {
    const dateInput = document.getElementById(`schedule-date-${optionNum}`);
    const timeInput = document.getElementById(`schedule-time-${optionNum}`);
    const estimatedTimeSpan = document.getElementById('schedule-estimated-time-alert'); // Updated ID
    const endTimeSpan = document.getElementById(`estimated-end-time-${optionNum}`);

    const date = dateInput.value;
    const time = timeInput.value;
    const estimatedHours = parseFloat(estimatedTimeSpan.textContent.split(' ')[0]);

    if (date && time && !isNaN(estimatedHours)) {
        const startDateTime = new Date(`${date}T${time}:00`);
        if (!isNaN(startDateTime.getTime())) {
            const endDateTime = new Date(startDateTime.getTime() + estimatedHours * 60 * 60 * 1000);
            endTimeSpan.textContent = ` (Término: ${endDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            endTimeSpan.textContent = '';
        }
    } else {
        endTimeSpan.textContent = '';
    }
}

function sendScheduleProposals(budgetId, estimatedTime) {
    const proposals = [];
    for (let i = 1; i <= 3; i++) {
        const date = document.getElementById(`schedule-date-${i}`).value;
        const time = document.getElementById(`schedule-time-${i}`).value;
        if (date && time) {
            proposals.push({ date, time });
        }
    }
    const obs = document.getElementById('schedule-obs').value.trim();

    if (proposals.length === 0) {
        showAlert('Por favor, sugira pelo menos uma opção de data e hora.');
        return;
    }

    const budgetIndex = orcamentosUsuarioRecebidos.findIndex(b => b.id === budgetId);
    if (budgetIndex !== -1) {
        const approvedBudget = orcamentosUsuarioRecebidos.splice(budgetIndex, 1)[0];
        approvedBudget.scheduleDate = proposals[0].date; // Apenas a primeira opção para simplificar
        approvedBudget.scheduleTime = proposals[0].time;
        approvedBudget.estimatedTime = estimatedTime;
        approvedBudget.obs = obs;
        orcamentosUsuarioAprovados.push(approvedBudget);

        // Simula o aceite do prestador e move para serviços ativos
        const prestadorApprovedBudget = { ...approvedBudget }; // Copia para o array do prestador
        orcamentosPrestadorAprovados.push(prestadorApprovedBudget);

        // Não mostra mais o alerta aqui. Só fecha o modal e abre o de pagamento.
        updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
        updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
        updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
        updatePrestadorBudgetCounts(); // Atualiza o contador da aba de orçamentos do prestador
        renderOrcamentosUsuarioRecebidos();
        renderOrcamentosUsuarioAprovados();
        renderOrcamentosPrestadorAprovados();
        closeModal('schedule-proposal-modal');
        // Exibe o modal de pagamento
        const paymentModal = document.getElementById('payment-modal');
        if (paymentModal) {
          paymentModal.style.display = 'flex';
        }
// Lógica do formulário de pagamento
document.addEventListener('DOMContentLoaded', function() {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Simula processamento do pagamento
      document.getElementById('payment-success').style.display = 'block';
      setTimeout(() => {
        document.getElementById('payment-success').style.display = 'none';
        closeModal('payment-modal');
        // Agora sim, mostra o alerta de sucesso do agendamento
        showAlert('Agendamento realizado e pagamento confirmado com sucesso!');
      }, 1800);
    });
  }
});
    }
}


function openPrestadorProfileModal(serviceId) {
    const prestador = sponsoredVisitServices.find(s => s.id === serviceId);
    if (!prestador || !prestador.profile) return;

    document.getElementById('prestador-profile-name').textContent = prestador.name;
    document.getElementById('prestador-profile-description').textContent = prestador.profile.bio;

    const photosGallery = document.getElementById('prestador-profile-photos');
    photosGallery.innerHTML = '';
    if (prestador.profile.photos && prestador.profile.photos.length > 0) {
        prestador.profile.photos.forEach(photoUrl => {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.alt = `Foto do trabalho de ${prestador.name}`;
            photosGallery.appendChild(img);
        });
    } else {
        photosGallery.innerHTML = '<p style="text-align: center; color: #888;">Nenhuma foto disponível.</p>';
    }

    document.getElementById('request-visit-from-profile-btn').onclick = () => solicitarVisitaComAviso(prestador.name);
    document.getElementById('prestador-profile-modal').style.display = 'flex';
}

function openRequestVisitScheduleModal(prestadorName) {
    document.getElementById('visit-prestador-name').textContent = prestadorName;
    // Limpa campos de data/hora
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`visit-schedule-date-${i}`).value = '';
        document.getElementById(`visit-schedule-time-${i}`).value = '';
    }
    document.getElementById('visit-schedule-obs').value = '';

    document.getElementById('send-visit-request-btn').onclick = () => sendVisitRequest(prestadorName);
    document.getElementById('request-visit-schedule-modal').style.display = 'flex';
}

function sendVisitRequest(prestadorName) {
    const proposals = [];
    for (let i = 1; i <= 3; i++) {
        const date = document.getElementById(`visit-schedule-date-${i}`).value;
        const time = document.getElementById(`visit-schedule-time-${i}`).value;
        if (date && time) {
            proposals.push({ date, time });
        }
    }
    const obs = document.getElementById('visit-schedule-obs').value.trim();

    if (proposals.length === 0) {
        showAlert('Por favor, sugira pelo menos uma opção de data e hora para a visita.');
        return;
    }

    const newVisitRequest = {
        id: orcamentosUsuarioVisitas.length > 0 ? Math.max(...orcamentosUsuarioVisitas.map(v => v.id)) + 1 : 1,
        prestador: prestadorName,
        suggestedDate1: proposals[0].date,
        suggestedTime1: proposals[0].time,
        suggestedDate2: proposals[1] ? proposals[1].date : '',
        suggestedTime2: proposals[1] ? proposals[1].time : '',
        suggestedDate3: proposals[2] ? proposals[2].date : '',
        suggestedTime3: proposals[2] ? proposals[2].time : '',
        obs: obs,
        status: 'Aguardando Confirmação'
    };

    orcamentosUsuarioVisitas.push(newVisitRequest);
    showAlert(`Solicitação de visita para ${prestadorName} enviada com sucesso!`);
    updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
    updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
    closeModal('request-visit-schedule-modal');
    closeModal('prestador-profile-modal'); // Fecha o modal de perfil também
    showScreen('orcamentos-usuario'); // Volta para a tela de orçamentos do usuário
    switchCpTab('orcamentos-usuario', 'recebidos'); // Ativa a aba de recebidos
}


// Funções de Abas (tabs)
function showTab(screenPrefix, tabId) {
    // Remove 'active' de todas as abas e conteúdos
    document.querySelectorAll(`#${screenPrefix} .tab, #${screenPrefix} .tab-button, #${screenPrefix} .filter-btn`).forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll(`#${screenPrefix} .tab-content`).forEach(content => content.classList.remove('active'));

    // Adiciona 'active' na aba e conteúdo selecionados
    const targetTabElement = document.querySelector(`#${screenPrefix} .tab[onclick*="${tabId}"], #${screenPrefix} .tab-button[onclick*="${tabId}"], #${screenPrefix} .filter-btn[onclick*="${tabId}"]`);
    const targetContentElement = document.getElementById(`${screenPrefix}-${tabId}-content`);

    if (targetTabElement) {
        targetTabElement.classList.add('active');
    } else {
        console.warn(`Aba com ID de clique para "${tabId}" não encontrada para o prefixo "${screenPrefix}".`);
    }

    if (targetContentElement) {
        targetContentElement.classList.add('active');
    } else {
        console.warn(`Conteúdo da aba com ID "${screenPrefix}-${tabId}-content" não encontrado.`);
    }

    // Renderiza o conteúdo da aba se necessário
    if (screenPrefix === 'orcamentos-prestador') {
        if (tabId === 'recebidos') renderOrcamentosPrestadorRecebidos();
        else if (tabId === 'propostas-enviadas') renderOrcamentosPrestadorPropostasEnviadas();
        else if (tabId === 'aprovados') renderOrcamentosPrestadorAprovados();
        else if (tabId === 'recusados') renderOrcamentosPrestadorRecusados();
        updatePrestadorBudgetCounts(); // Garante que os contadores das abas sejam atualizados ao trocar
    } else if (screenPrefix === 'servicos-historico') {
        if (tabId === 'finalizados') renderServicosHistoricoFinalizados();
        else if (tabId === 'recusados') renderServicosHistoricoRecusados();
        updateServicosHistoricoCounts(); // Garante que os contadores das abas sejam atualizados ao trocar
    } else if (screenPrefix === 'buscar-servicos-unificado') { // Nova lógica para a tela unificada
        if (tabId === 'padrao') {
            renderSponsoredServices(); // Renderiza os serviços padrão
        } else if (tabId === 'visita') {
            renderSponsoredVisitServices(); // Renderiza os serviços de visita
        }
    } else if (screenPrefix === 'orcamentos-usuario') {
        if (tabId === 'solicitados') {
            // Inicializa as sub-abas apenas para solicitados
            showSubTab('orcamentos-usuario', 'solicitados', 'padrao');
            updateSubTabCounts();
        } else if (tabId === 'recebidos') {
            renderOrcamentosUsuarioRecebidos();
        }
        updateUserBudgetCounts();
    } else if (screenPrefix === 'orcamentos-aprovados-recusados') {
        if (tabId === 'aprovados') {
            renderOrcamentosAprovados();
        } else if (tabId === 'recusados') {
            renderOrcamentosRecusados();
        }
        updateAprovadosRecusadosCounts();
        updateSubTabCounts();
    } else if (screenPrefix === 'trabalhos-execucao-finalizados') {
        if (tabId === 'execucao') {
            renderTrabalhosEmExecucao();
        } else if (tabId === 'finalizados') {
            renderTrabalhosFinalizados();
        }
        updateTrabalhosCount(); // Atualiza os contadores das abas
    }
}

// Função para controlar sub-abas (Padrão vs Visita)
function showSubTab(screenId, tabId, subTabId) {
    // Funciona apenas para a aba solicitados do usuário
    if (screenId === 'orcamentos-usuario' && tabId === 'solicitados') {
        // Remove 'active' de todas as sub-abas desta aba
        document.querySelectorAll(`#orcamentos-usuario-solicitados-content .sub-tab`).forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll(`#orcamentos-usuario-solicitados-content .sub-tab-content`).forEach(content => content.classList.remove('active'));

        // Adiciona 'active' na sub-aba clicada
        const targetSubTabElement = document.querySelector(`#orcamentos-usuario-solicitados-content .sub-tab[onclick*="${subTabId}"]`);
        const targetSubContentElement = document.getElementById(`orcamentos-usuario-solicitados-${subTabId}-content`);

        if (targetSubTabElement) {
            targetSubTabElement.classList.add('active');
        }

        if (targetSubContentElement) {
            targetSubContentElement.classList.add('active');
        }

        // Renderiza o conteúdo específico
        if (subTabId === 'padrao') {
            renderOrcamentosSolicitadosPadrao();
        } else if (subTabId === 'visita') {
            renderOrcamentosSolicitadosVisita();
        }
    }
}

// Função para filtrar orçamentos nos cards do dashboard
function filterOrcamentos(categoria, filtro, buttonElement) {
    // Remove classe 'active' de todos os botões do mesmo card
    const cardContainer = buttonElement.closest('.card');
    const allButtons = cardContainer.querySelectorAll('.budget-filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona classe 'active' no botão clicado
    buttonElement.classList.add('active');
    
    // Armazena o filtro ativo globalmente para usar nas telas
    window.activeBudgetFilter = window.activeBudgetFilter || {};
    window.activeBudgetFilter[categoria] = filtro;
    
    // Atualiza os contadores baseado no filtro
    updateFilteredCounts(categoria, filtro);
    
    // Se a tela correspondente estiver ativa, re-renderiza o conteúdo
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        const screenId = currentScreen.id;
        rerenderScreenWithFilter(screenId, categoria, filtro);
    }
    
    console.log(`Filtro aplicado: ${categoria} -> ${filtro}`);
}

// Função para atualizar contadores baseado no filtro
function updateFilteredCounts(categoria, filtro) {
    let count = 0;
    
    // Simular contagem baseada no tipo de filtro
    if (filtro === 'todos') {
        count = getSimulatedCount(categoria, 'total');
    } else if (filtro === 'padrao') {
        count = getSimulatedCount(categoria, 'padrao');
    } else if (filtro === 'visita') {
        count = getSimulatedCount(categoria, 'visita');
    }
    
    // Atualiza o contador no dashboard
    const countElement = getCountElementForCategory(categoria);
    if (countElement) {
        countElement.textContent = count;
    }
}

// Função para obter contagem simulada
function getSimulatedCount(categoria, tipo) {
    const counts = {
        'usuario-solicitados': { total: 8, padrao: 5, visita: 3 },
        'aprovados-recusados': { total: 6, padrao: 4, visita: 2 },
        'prestador-recebidos': { total: 12, padrao: 8, visita: 4 },
        'prestador-propostas': { total: 10, padrao: 7, visita: 3 },
        'prestador-aprovados': { total: 7, padrao: 5, visita: 2 },
        'prestador-recusados': { total: 3, padrao: 2, visita: 1 }
    };
    
    return counts[categoria] ? counts[categoria][tipo] || 0 : 0;
}

// Função para obter elemento contador baseado na categoria
function getCountElementForCategory(categoria) {
    const elementIds = {
        'usuario-solicitados': 'orcamentos-usuario-solicitados-count-dashboard',
        'aprovados-recusados': 'orcamentos-aprovados-recusados-count-dashboard',
        'prestador-recebidos': 'orcamentos-prestador-recebidos-count-dashboard',
        'prestador-propostas': 'orcamentos-prestador-propostas-enviadas-count-dashboard',
        'prestador-aprovados': 'orcamentos-prestador-aprovados-count-dashboard',
        'prestador-recusados': 'orcamentos-prestador-recusados-count-dashboard'
    };
    
    const elementId = elementIds[categoria];
    return elementId ? document.getElementById(elementId) : null;
}

// Função para re-renderizar tela com filtro
function rerenderScreenWithFilter(screenId, categoria, filtro) {
    // Aplicar filtro nas telas específicas
    switch(screenId) {
        case 'orcamentos-usuario':
            applyFilterToOrcamentosUsuario(filtro);
            break;
        case 'orcamentos-aprovados-recusados':
            applyFilterToAprovadosRecusados(filtro);
            break;
        case 'orcamentos-prestador-recebidos':
            applyFilterToOrcamentosPrestador(filtro);
            break;
        // Adicionar mais casos conforme necessário
    }
}

// Funções auxiliares para aplicar filtros (placeholder - implementar conforme necessário)
function applyFilterToOrcamentosUsuario(filtro) {
    console.log(`Aplicando filtro ${filtro} em orçamentos do usuário`);
    // Implementar lógica de filtro específica
}

function applyFilterToAprovadosRecusados(filtro) {
    console.log(`Aplicando filtro ${filtro} em aprovados/recusados`);
    // Implementar lógica de filtro específica
}

function applyFilterToOrcamentosPrestador(filtro) {
    console.log(`Aplicando filtro ${filtro} em orçamentos do prestador`);
    // Implementar lógica de filtro específica
}

// Função para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Remove modal dinâmico do DOM se necessário
        if (modalId === 'indicar-prestador-modal' || modalId === 'indicar-contato-modal') {
            modal.remove();
        }
    }
}

// Função para alternar o menu lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) {
        // Comportamento consistente: apenas alterna a classe active
        sidebar.classList.toggle('active');
    }
    
    // Alterna o overlay também
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Função para fechar o sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('active');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Função para fechar o menu lateral ao clicar fora dele
document.addEventListener('click', (event) => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    // Verifica se o clique não foi dentro da sidebar e não foi no botão de toggle
    if (sidebar && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        // Usa a função closeSidebar para fechar com overlay
        closeSidebar();
    }
});


// Função global para atualizar a visibilidade dos itens do menu lateral com base no tipo de usuário
function updateSidebarMenu() {
    // Esconde todos os itens de menu específicos de usuário/prestador
    document.getElementById('menu-item-orcamentos-usuario').style.display = 'none';
    document.getElementById('menu-item-servicos-contratados').style.display = 'none';
    document.getElementById('menu-item-ocorrencias-usuario').style.display = 'none';
    document.getElementById('menu-item-buscar-servicos').style.display = 'none';
    
    document.getElementById('menu-item-servicos-ativos').style.display = 'none';
    document.getElementById('menu-item-orcamentos-prestador').style.display = 'none';
    document.getElementById('menu-item-ocorrencias-prestador').style.display = 'none';
    document.getElementById('menu-item-cadastro-especialidades').style.display = 'none';
    document.getElementById('menu-item-calendario-trabalho').style.display = 'none';
    document.getElementById('menu-item-servicos-historico').style.display = 'none';
    document.getElementById('menu-item-financeiro').style.display = 'none';

    // Exibe os itens de menu relevantes com base no currentUserType
    if (currentUserType === 'usuario') {
        document.getElementById('sidebar-username').textContent = nomeDoClienteLogado;
        document.getElementById('sidebar-usertype').textContent = 'Tipo: Cliente';
        document.getElementById('menu-item-orcamentos-usuario').style.display = 'list-item';
        document.getElementById('menu-item-servicos-contratados').style.display = 'list-item';
        document.getElementById('menu-item-ocorrencias-usuario').style.display = 'list-item';
        document.getElementById('menu-item-buscar-servicos').style.display = 'list-item';
        updateUserDashboardCounts();
        updateUserBudgetCounts();
    } else if (currentUserType === 'prestador') {
        document.getElementById('sidebar-username').textContent = nomeDoClienteLogado;
        document.getElementById('sidebar-usertype').textContent = 'Tipo: Prestador';
        document.getElementById('menu-item-servicos-ativos').style.display = 'list-item';
        document.getElementById('menu-item-orcamentos-prestador').style.display = 'list-item';
        document.getElementById('menu-item-ocorrencias-prestador').style.display = 'list-item';
        document.getElementById('menu-item-cadastro-especialidades').style.display = 'list-item';
        document.getElementById('menu-item-calendario-trabalho').style.display = 'list-item';
        document.getElementById('menu-item-servicos-historico').style.display = 'list-item';
        document.getElementById('menu-item-financeiro').style.display = 'list-item';
        updatePrestadorDashboardCounts();
        updatePrestadorBudgetCounts();
        updateServicosHistoricoCounts();
    }
}

// Função global para mostrar tela de escolha de login
function showLoginChoiceScreen() {
    document.getElementById('login-choice-screen').style.display = 'flex';
    document.getElementById('login-client-screen').style.display = 'none';
    document.getElementById('login-provider-screen').style.display = 'none';
    if (document.getElementById('login-screen-v2')) document.getElementById('login-screen-v2').style.display = 'none';
    screenHistory = []; // Limpa o histórico ao voltar para a escolha de login
    activeScreenId = 'login-choice-screen'; // Define a tela ativa
}

// Event Listeners (DOM Content Loaded)
document.addEventListener('DOMContentLoaded', () => {
    // --- NOVO FLUXO PROGRESSIVO DE LOGIN ---
    function showLoginClientScreen() {
        document.getElementById('login-choice-screen').style.display = 'none';
        document.getElementById('login-client-screen').style.display = 'flex';
        document.getElementById('login-provider-screen').style.display = 'none';
        screenHistory = []; // Limpa o histórico ao ir para a tela de login
        activeScreenId = 'login-client-screen'; // Define a tela ativa
        switchTab('access'); // Garante que a aba de acesso esteja ativa
    }
    function showLoginProviderScreen() {
        document.getElementById('login-choice-screen').style.display = 'none';
        document.getElementById('login-client-screen').style.display = 'none';
        document.getElementById('login-provider-screen').style.display = 'flex';
        screenHistory = []; // Limpa o histórico ao ir para a tela de login
        activeScreenId = 'login-provider-screen'; // Define a tela ativa
        switchTab('access'); // Garante que a aba de acesso esteja ativa
    }

    // Inicializa mostrando a tela de escolha
    showLoginChoiceScreen();

    // Listeners para escolha inicial
    document.getElementById('choose-client-btn').onclick = showLoginClientScreen;
    document.getElementById('choose-provider-btn').onclick = showLoginProviderScreen;
    document.getElementById('back-to-choice-client').onclick = showLoginChoiceScreen;
    document.getElementById('back-to-choice-provider').onclick = showLoginChoiceScreen;

    // Tabs do CLIENTE
    document.getElementById('access-tab-client').onclick = function() {
        switchTab('access');
    };
    document.getElementById('register-tab-client').onclick = function() {
        switchTab('register');
    };

    // Tabs do PRESTADOR
    document.getElementById('access-tab-provider').onclick = function() {
        switchTab('access');
    };
    document.getElementById('register-tab-provider').onclick = function() {
        switchTab('register');
    };

    // Ajustar exibição do login/cadastro antigo (caso ainda exista)
    if (document.getElementById('login-screen-v2')) document.getElementById('login-screen-v2').style.display = 'none';
    // Simulação de recuperação de senha para Cliente e Prestador
    function handleForgotPassword(userType) {
        let email = '';
        if (userType === 'usuario') {
            email = document.getElementById('client-email-login').value;
        } else {
            email = document.getElementById('provider-email-login').value;
        }
        showAlert('Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.', 'Recuperação de Senha');
    }

    // Adiciona listeners para os links "Esqueceu a senha?"
    document.querySelector('#client-access-form .forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword('usuario');
    });
    document.querySelector('#provider-access-form .forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword('prestador');
    });
    // Inicializa a exibição da tela de splash, que depois transiciona para o login V2
    showScreen('splash');

    // Verificar se o logo carregou corretamente
    const logoImg = document.querySelector('.splash-logo .main-logo');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            console.warn('Logo não carregou, usando fallback');
            this.style.backgroundColor = '#00BCD4';
            this.style.opacity = '0.8';
        });
        
        logoImg.addEventListener('load', function() {
            console.log('Logo carregado com sucesso');
            this.style.opacity = '1';
        });
    }

    // Transição da Splash para a nova Tela de Login
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                showLoginChoiceScreen(); // Agora transiciona para a tela de escolha
            }, 500); // Tempo da transição de opacidade
        }
    }, 2000); // Exibe a splash por 2 segundos


    // Listeners para os botões da nova tela de login/cadastro
    const clientLoginButtonV2 = document.getElementById('client-login-button-v2');
    if (clientLoginButtonV2) {
        clientLoginButtonV2.addEventListener('click', performLoginV2);
    }

    const providerLoginButtonV2 = document.getElementById('provider-login-button-v2');
    if (providerLoginButtonV2) {
        providerLoginButtonV2.addEventListener('click', performLoginV2);
    }

    const clientRegisterForm = document.getElementById('client-register-form');
    if (clientRegisterForm) {
        clientRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário
            registerUserV2();
        });
    }

    const providerRegisterForm = document.getElementById('provider-register-form');
    if (providerRegisterForm) {
        providerRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário
            registerUserV2();
        });
    }

    // Listeners para os botões de login social (para cliente)
    // Agora, esses botões também chamam performLoginV2, que verifica o tipo de login
    document.querySelectorAll('#client-access-form .social-login-button').forEach(button => {
        button.addEventListener('click', performLoginV2);
    });
    // Os botões sociais de cadastro também podem chamar registerUserV2
    document.querySelectorAll('#client-register-form .social-login-button').forEach(button => {
        button.addEventListener('click', registerUserV2);
    });


    // Listeners para os radio buttons de tipo de usuário
    document.querySelectorAll('input[name="main-user-type-select"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateFormVisibility();
            updateUserTypePillHighlight();
        });
    });

    // Destaque visual para o pill selecionado (Cliente/Prestador)
    function updateUserTypePillHighlight() {
        const clientRadio = document.getElementById('select-user-client');
        const providerRadio = document.getElementById('select-user-provider');
        const clientLabel = document.querySelector('#login-choice-screen #choose-client-btn');
        const providerLabel = document.querySelector('#login-choice-screen #choose-provider-btn');
        if (clientRadio && providerRadio && clientLabel && providerLabel) {
            if (clientRadio.checked) {
                clientLabel.classList.add('active');
                providerLabel.classList.remove('active');
            } else {
                providerLabel.classList.add('active');
                clientLabel.classList.remove('active');
            }
        }
    }
    updateUserTypePillHighlight();

    // Destaque visual para PF/PJ no cadastro do prestador
    document.querySelectorAll('input[name="tipo-prestador"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updatePrestadorTypePillHighlight();
            togglePrestadorFields();
        });
    });
    function updatePrestadorTypePillHighlight() {
        const pfRadio = document.getElementById('tipo-prestador-pf');
        const pjRadio = document.getElementById('tipo-prestador-pj');
        const pfLabel = document.querySelector('label[for="tipo-prestador-pf"]');
        const pjLabel = document.querySelector('label[for="tipo-prestador-pj"]');
        if (pfRadio && pjRadio && pfLabel && pjLabel) {
            if (pfRadio.checked) {
                pfLabel.classList.add('active');
                pjLabel.classList.remove('active');
            } else {
                pjLabel.classList.add('active');
                pfLabel.classList.remove('active');
            }
        }
    }
    updatePrestadorTypePillHighlight();

    // Outros Listeners (mantidos do seu código original)
    document.getElementById('confirm-finalize-btn').addEventListener('click', () => {
        if (currentFinalizeServiceId !== null) {
            // Lógica de finalização já está na função openFinalizeModal
            // Este listener apenas garante que o botão chame a função correta
            // A lógica de finalização já está no modal, apenas chame o fechamento
            serviceStatuses[currentFinalizeServiceId].status = 'Aguardando Confirmação';
            serviceStatuses[currentFinalizeServiceId].alert = true;
            updateServiceCard(currentFinalizeServiceId);
            showAlert(`Serviço #${currentFinalizeServiceId} finalizado e aguardando confirmação do cliente!`);
            closeModal('finalize-service-modal');
            currentFinalizeServiceId = null;
        }
    });

    // Listener para o botão de enviar propostas de agendamento
    const sendScheduleProposalsBtn = document.getElementById('send-schedule-proposals-btn');
    if (sendScheduleProposalsBtn) {
        sendScheduleProposalsBtn.addEventListener('click', () => {
            if (currentScheduleBudgetId !== null) {
                const budget = orcamentosUsuarioRecebidos.find(b => b.id === currentScheduleBudgetId);
                if (budget) {
                    sendScheduleProposals(currentScheduleBudgetId, budget.estimatedTime);
                }
            }
        });
    }

    // Listener para o botão de enviar solicitação de visita
    const sendVisitRequestBtn = document.getElementById('send-visit-request-btn');
    if (sendVisitRequestBtn) {
        sendVisitRequestBtn.addEventListener('click', () => {
            const prestadorName = document.getElementById('visit-prestador-name').textContent;
            sendVisitRequest(prestadorName);
        });
    }

    // Listener para o input de data/hora no modal de agendamento
    for (let i = 1; i <= 3; i++) {
        const dateInput = document.getElementById(`schedule-date-${i}`);
        const timeInput = document.getElementById(`schedule-time-${i}`);
        if (dateInput) dateInput.addEventListener('change', () => calculateEndTime(i));
        if (timeInput) timeInput.addEventListener('change', () => calculateEndTime(i));
    }


    // Delegação de eventos para os botões de fechar modal (mantido)
    document.querySelectorAll('.modal .close-button').forEach(element => {
        element.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modalId || event.target.closest('.modal')?.id;
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Listener para o botão de cancelar no modal de finalização
    const cancelFinalizeBtn = document.querySelector('#finalize-service-modal .btn-finalizar');
    if (cancelFinalizeBtn) {
        cancelFinalizeBtn.addEventListener('click', () => {
            closeModal('finalize-service-modal');
            currentFinalizeServiceId = null;
        });
    }

    // Inicializa a dashboard de financeiro
    updateFinanceiroDashboard();
    renderBankAccounts();

    // Inicializa a simulação do fluxo de serviço (comentado para evitar erro)
    // updateSimulationDisplay();

    // Chama a função para atualizar o menu lateral e os contadores assim que o DOM é carregado
    // Isso garante que, se o usuário já estiver "logado" (simulado), o menu e dashboard sejam corretos
    updateSidebarMenu();
    
    // Atualiza o nome do cliente no dashboard se o elemento existir
    const dashboardClientName = document.getElementById('dashboard-client-name');
    if (dashboardClientName) {
        dashboardClientName.textContent = nomeDoClienteLogado;
    }
    
    // Inicializa as sub-abas
    initializeSubTabs();
    
    // Inicializa o sidebar para desktop
    initializeSidebar();
    
    // Adiciona event listeners para fechar modais
    initializeModalListeners();
});

// Função para inicializar o sidebar corretamente
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    // Garante que o sidebar sempre comece escondido
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// Função para inicializar listeners dos modais
function initializeModalListeners() {
    // Event listener para fechar modais clicando no X
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-id');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
    
    // Event listener para fechar modais clicando fora do conteúdo
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// Alterna os campos PF/PJ no cadastro do prestador
function togglePrestadorFields() {
  const tipo = document.querySelector('input[name="tipo-prestador"]:checked');
  const camposPf = document.getElementById('campos-pf');
  const camposPj = document.getElementById('campos-pj');
  
  if (tipo && camposPf && camposPj) {
    // Primeiro, oculta ambos os campos completamente
    camposPf.style.display = 'none';
    camposPj.style.display = 'none';
    camposPf.style.visibility = 'hidden';
    camposPj.style.visibility = 'hidden';
    
    // Força um reflow do DOM
    void camposPf.offsetHeight;
    void camposPj.offsetHeight;
    
    // Depois, mostra apenas o campo necessário
    if (tipo.value === 'pf') {
      camposPf.style.display = 'block';
      camposPf.style.visibility = 'visible';
    } else {
      camposPj.style.display = 'block';
      camposPj.style.visibility = 'visible';
    }

    // Garante que os campos obrigatórios sejam definidos corretamente
    const pfInputs = document.querySelectorAll('#campos-pf input, #campos-pf select, #campos-pf textarea');
    const pjInputs = document.querySelectorAll('#campos-pj input, #campos-pj select, #campos-pj textarea');

    if (tipo.value === 'pf') {
        pfInputs.forEach(input => {
            if (input.id !== 'provider-pf-password-confirm') input.setAttribute('required', 'true');
        });
        pjInputs.forEach(input => input.removeAttribute('required'));
    } else { // pj
        pjInputs.forEach(input => {
            if (input.id !== 'provider-pj-password-confirm') input.setAttribute('required', 'true');
        });
        pfInputs.forEach(input => input.removeAttribute('required'));
    }
  }
}
document.addEventListener('DOMContentLoaded', togglePrestadorFields);

// Nova função para solicitar visita com aviso
function solicitarVisitaComAviso(prestadorName) {
  showWarningAlert(
    'Você está solicitando uma visita presencial apenas para que o prestador avalie o serviço e gere um orçamento. Nesse modelo, qualquer negociação, valor ou forma de pagamento será tratada diretamente entre você e o prestador, sem envolvimento ou garantias da plataforma.Após o orçamento, se desejar, você poderá migrar para o modo protegido do ChamadoPro, com pagamentos parcelados, suporte e garantias oferecidas pela plataforma.',
    'Orientação sobre Visita',
    () => { // Callback para abrir o modal de agendamento após o alerta ser fechado
        openRequestVisitScheduleModal(prestadorName);
    }
  );
}

// Função especial para mostrar alerta com fundo amarelo
function showWarningAlert(message, title = 'Aviso', onOkCallback = null) {
    document.getElementById('custom-alert-title').textContent = title;
    document.getElementById('custom-alert-message').textContent = message;
    
    // Adicionar classe especial para fundo amarelo
    const modal = document.getElementById('custom-alert-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add('warning-background');
    modal.style.display = 'flex';

    const okBtn = document.querySelector('#custom-alert-modal .primary-btn');
    if (okBtn) {
        // Remove qualquer listener anterior para evitar múltiplos disparos
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);

        newOkBtn.onclick = function() {
            // Remover a classe especial ao fechar
            modalContent.classList.remove('warning-background');
            closeModal('custom-alert-modal');
            if (onOkCallback) {
                onOkCallback();
            }
        };
    }
}

// --- Funções utilitárias para pills, pop-up, orçamentos e migração --- //

// 1. Alternar pills (radio visual)
function setupPillGroup(pillGroupSelector, onChange) {
  document.querySelectorAll(pillGroupSelector).forEach(group => {
    group.addEventListener('change', e => {
      if (e.target.classList.contains('pill-radio')) {
        group.querySelectorAll('.pill-label').forEach(label => label.classList.remove('active'));
        if (e.target.nextElementSibling) e.target.nextElementSibling.classList.add('active');
        if (onChange) onChange(e.target.value);
      }
    });
  });
}

// 2. Mostrar pop-up antes de agendar visita
// Adicionei um callback para simular o comportamento de confirmação
function showScheduleVisitPopup(onConfirm) {
  showAlert('Deseja realmente agendar uma visita?', 'Confirmação', () => {
    if (onConfirm) onConfirm();
  });
}

// 3. Separar orçamentos padrão e por visita
function filterBudgets(budgets, type) {
  // type: 'padrao' ou 'visita'
  return budgets.filter(b => b.tipo === type);
}

// 4. Migrar orçamento de visita para padrão
function migrateVisitBudgetToStandard(budgetId, budgets, onSuccess) {
  const budget = budgets.find(b => b.id === budgetId && b.tipo === 'visita');
  if (budget) {
    budget.tipo = 'padrao';
    showAlert('Orçamento migrado para padrão com sucesso!', 'Sucesso');
    if (onSuccess) onSuccess(budget);
  } else {
    showAlert('Orçamento não encontrado ou já é padrão.', 'Erro');
  }
}

// Funções do Calendário de Trabalho
function carregarCalendarioTrabalho() {
    // Carrega configurações salvas do localStorage
    const configuracoesSalvas = localStorage.getItem('calendarioTrabalho');
    if (configuracoesSalvas) {
        const config = JSON.parse(configuracoesSalvas);
        
        // Aplicar configurações salvas
        if (config.modoSempre) {
            document.getElementById('modo-sempre').checked = true;
        } else {
            document.getElementById('modo-horario').checked = true;
        }
        
        if (config.datasEspecificas) {
            datasEspecificas = config.datasEspecificas;
            renderizarDatasEspecificas();
        }
        
        toggleModoOrcamento();
    }
}

// Função para verificar se o prestador está disponível para receber orçamentos
function prestadorDisponivelParaOrcamento(dataHora = new Date()) {
    const configuracoesSalvas = localStorage.getItem('calendarioTrabalho');
    
    // Se não há configurações ou está em modo "sempre", aceita orçamentos
    if (!configuracoesSalvas) {
        return true;
    }
    
    const config = JSON.parse(configuracoesSalvas);
    
    // Se está em modo "sempre", aceita orçamentos
    if (config.modoSempre) {
        return true;
    }
    
    // Aqui você implementaria a lógica completa de verificação
    // Por exemplo:
    // - Verificar se é um dia da semana configurado
    // - Verificar se está dentro do horário configurado
    // - Verificar se não é um feriado (se não trabalha em feriados)
    // - Verificar datas específicas bloqueadas
    
    // Por enquanto, retorna true para manter a funcionalidade
    return true;
}

// Função para calcular e atualizar o tempo restante das propostas
function updateProposalTimeRemaining() {
    // Exemplo de implementação para demonstrar o conceito
    // Em uma aplicação real, isso seria baseado na data/hora real da proposta
    const timeElements = document.querySelectorAll('.auto-cancel-warning');
    
    timeElements.forEach(element => {
        // Simula tempo restante aleatório entre 1-16 horas para demonstração
        const hoursRemaining = Math.floor(Math.random() * 16) + 1;
        const minutesRemaining = Math.floor(Math.random() * 60);
        
        const timeText = hoursRemaining > 1 
            ? `Proposta será cancelada automaticamente em ${hoursRemaining}h ${minutesRemaining}min`
            : `Proposta será cancelada automaticamente em ${minutesRemaining} minutos`;
            
        // Atualiza apenas o texto, mantendo o ícone
        element.innerHTML = `<i class="fas fa-clock"></i> <strong>${timeText}</strong>`;
        
        // Adiciona urgência visual se restam menos de 2 horas
        if (hoursRemaining < 2) {
            element.style.backgroundColor = '#fff5f5';
            element.style.borderColor = '#f56565';
            element.style.color = '#c53030';
        }
    });
}

// Opcional: Atualizar tempos a cada minuto (apenas para demonstração)
// setInterval(updateProposalTimeRemaining, 60000);

// Inicialização dos filtros de orçamento
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar filtros padrão para todos os cards
    initializeBudgetFilters();
});

function initializeBudgetFilters() {
    // Definir filtros padrão como 'todos'
    window.activeBudgetFilter = {
        'usuario-solicitados': 'todos',
        'aprovados-recusados': 'todos',
        'prestador-recebidos': 'todos',
        'prestador-propostas': 'todos',
        'prestador-aprovados': 'todos',
        'prestador-recusados': 'todos',
        'visitas-marcadas': 'todos'
    };
    
    // Atualizar contadores iniciais
    Object.keys(window.activeBudgetFilter).forEach(categoria => {
        updateFilteredCounts(categoria, 'todos');
    });
    
    console.log('Filtros de orçamento inicializados com sucesso');
}

// ========================================
// SISTEMA DE ABAS PADRONIZADO (CP-TABS)
// ========================================

/**
 * Função para alternar entre abas do sistema padronizado
 * @param {string} tabGroupId - ID do grupo de abas
 * @param {string} targetTabId - ID da aba que deve ficar ativa
 */
function switchCpTab(tabGroupId, targetTabId) {
    const tabGroup = document.querySelector(`[data-cp-group="${tabGroupId}"]`);
    if (!tabGroup) {
        console.warn(`Grupo de abas "${tabGroupId}" não encontrado`);
        return;
    }
    
    // Remove .is-active de todas as abas do grupo
    const allTabs = tabGroup.querySelectorAll('.cp-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('is-active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    // Adiciona .is-active na aba selecionada
    const targetTab = tabGroup.querySelector(`[data-cp-tab="${targetTabId}"]`);
    if (targetTab) {
        targetTab.classList.add('is-active');
        targetTab.setAttribute('aria-selected', 'true');
    }
    
    // Esconde todos os conteúdos das abas
    const allContents = document.querySelectorAll(`[data-cp-content-group="${tabGroupId}"]`);
    allContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Mostra o conteúdo da aba selecionada
    const targetContent = document.querySelector(`[data-cp-content="${targetTabId}"][data-cp-content-group="${tabGroupId}"]`);
    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
    }
    
    // Chama callbacks específicos baseados no grupo e aba
    handleCpTabCallback(tabGroupId, targetTabId);
}

/**
 * Gerencia callbacks específicos para diferentes grupos de abas
 * @param {string} tabGroupId - ID do grupo de abas
 * @param {string} targetTabId - ID da aba ativada
 */
function handleCpTabCallback(tabGroupId, targetTabId) {
    switch(tabGroupId) {
        case 'orcamentos-usuario':
            if (targetTabId === 'solicitados') {
                showSubTab('orcamentos-usuario', 'solicitados', 'padrao');
                updateSubTabCounts();
            } else if (targetTabId === 'recebidos') {
                renderOrcamentosUsuarioRecebidos();
            }
            updateUserBudgetCounts();
            break;
            
        case 'orcamentos-aprovados-recusados':
            if (targetTabId === 'aprovados') {
                renderOrcamentosAprovados();
            } else if (targetTabId === 'recusados') {
                renderOrcamentosRecusados();
            }
            updateAprovadosRecusadosCounts();
            updateSubTabCounts();
            break;
            
        case 'trabalhos-execucao-finalizados':
            if (targetTabId === 'execucao') {
                renderTrabalhosEmExecucao();
            } else if (targetTabId === 'finalizados') {
                renderTrabalhosFinalizados();
            }
            updateTrabalhosCount();
            break;
            
        case 'servicos-historico':
            if (targetTabId === 'finalizados') {
                renderServicosHistoricoFinalizados();
            } else if (targetTabId === 'recusados') {
                renderServicosHistoricoRecusados();
            }
            updateServicosHistoricoCounts();
            break;
            
        case 'buscar-servicos-unificado':
            if (targetTabId === 'padrao') {
                renderSponsoredServices();
            } else if (targetTabId === 'visita') {
                renderSponsoredVisitServices();
            }
            break;
    }
}

/**
 * Inicializa o sistema de abas padronizado
 */
function initCpTabs() {
    // Adiciona event listeners para todas as abas do sistema
    document.addEventListener('click', (event) => {
        const tab = event.target.closest('.cp-tab[data-cp-tab]');
        if (!tab) return;
        
        const tabGroup = tab.closest('[data-cp-group]');
        if (!tabGroup) return;
        
        const groupId = tabGroup.getAttribute('data-cp-group');
        const tabId = tab.getAttribute('data-cp-tab');
        
        switchCpTab(groupId, tabId);
    });
    
    console.log('Sistema de abas padronizado inicializado');
}

// Inicializa o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCpTabs);

/**
 * Funções de filtro para seções do prestador
 */

function filterOrcamentosPrestadorRecebidos(filter) {
    const buttons = document.querySelectorAll('#orcamentos-prestador-recebidos .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Implementar lógica de filtro conforme necessário
    console.log('Filtro aplicado em Orçamentos Recebidos (Prestador):', filter);
}

function filterOrcamentosPrestadorPropostasEnviadas(filter) {
    const buttons = document.querySelectorAll('#orcamentos-prestador-propostas-enviadas .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Implementar lógica de filtro conforme necessário
    console.log('Filtro aplicado em Propostas Enviadas (Prestador):', filter);
}

function filterOrcamentosPrestadorAprovados(filter) {
    const buttons = document.querySelectorAll('#orcamentos-prestador-aprovados .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Implementar lógica de filtro conforme necessário
    console.log('Filtro aplicado em Orçamentos Aprovados (Prestador):', filter);
}

function filterOrcamentosPrestadorRecusados(filter) {
    const buttons = document.querySelectorAll('#orcamentos-prestador-recusados .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Implementar lógica de filtro conforme necessário
    console.log('Filtro aplicado em Orçamentos Recusados (Prestador):', filter);
}

/**
 * ===== FUNÇÕES DO FLUXO DE SERVIÇO RENOVADO =====
 */

let currentFlowSimulation = {
    type: null,
    currentStep: 0,
    isRunning: false
};

function startFlowSimulation(flowType) {
    currentFlowSimulation = {
        type: flowType,
        currentStep: 1,
        isRunning: true
    };

    // Reset all mini steps
    const flowContent = document.getElementById(`fluxo-${flowType}-content`);
    const miniSteps = flowContent.querySelectorAll('.flow-step-mini');
    const stepDetails = flowContent.querySelectorAll('.step-detail');

    // Reset states
    miniSteps.forEach(step => {
        step.classList.remove('completed', 'active');
    });
    stepDetails.forEach(detail => {
        detail.classList.remove('active');
    });

    // Activate first step
    miniSteps[0].classList.add('active');
    stepDetails[0].classList.add('active');

    // Show progress message
    showAlert(`Iniciando simulação do Fluxo ${flowType === 'padrao' ? 'Padrão' : 'com Visita'}. Clique nos quadradinhos para navegar!`, 'Simulação Iniciada');

    // Add click handlers to mini steps
    miniSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            showFlowStep(flowType, index + 1);
        });
    });

    // Start automated simulation
    setTimeout(() => simulateNextStep(flowType), 2000);
}

function showFlowStep(flowType, stepNumber) {
    const flowContent = document.getElementById(`fluxo-${flowType}-content`);
    const miniSteps = flowContent.querySelectorAll('.flow-step-mini');
    const stepDetails = flowContent.querySelectorAll('.step-detail');

    // Update mini steps
    miniSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update step details
    stepDetails.forEach((detail, index) => {
        detail.classList.remove('active');
        if (index + 1 === stepNumber) {
            detail.classList.add('active');
        }
    });

    currentFlowSimulation.currentStep = stepNumber;
}

function simulateNextStep(flowType) {
    if (!currentFlowSimulation.isRunning) return;

    const maxSteps = 5;
    
    if (currentFlowSimulation.currentStep < maxSteps) {
        currentFlowSimulation.currentStep++;
        showFlowStep(flowType, currentFlowSimulation.currentStep);

        // Get step info
        const flowContent = document.getElementById(`fluxo-${flowType}-content`);
        const activeDetail = flowContent.querySelector('.step-detail.active');
        const stepTitle = activeDetail.querySelector('h4').textContent;
        const stepDesc = activeDetail.querySelector('p').textContent;
        
        showAlert(`${stepTitle}: ${stepDesc}`, `Etapa ${currentFlowSimulation.currentStep}`);

        // Continue simulation
        if (currentFlowSimulation.currentStep < maxSteps) {
            setTimeout(() => simulateNextStep(flowType), 3000);
        } else {
            // Simulation completed
            setTimeout(() => {
                showAlert(`Simulação do Fluxo ${flowType === 'padrao' ? 'Padrão' : 'com Visita'} concluída! Clique nos quadradinhos para navegar.`, 'Simulação Finalizada');
                currentFlowSimulation.isRunning = false;
            }, 2000);
        }
    }
}

function showMigrationInfo() {
    showAlert(
        'Após uma visita, você pode migrar seu orçamento para o modelo padrão da plataforma. Isso oferece:\n\n' +
        '• Pagamento seguro via ChamadoPro\n' +
        '• Garantias da plataforma\n' +
        '• Suporte completo em caso de problemas\n' +
        '• Sistema de avaliações\n\n' +
        'A migração pode ser feita a qualquer momento após a visita, mantendo todo o histórico do projeto.',
        'Migração para Fluxo Padrão'
    );
}

// Inicialização das funcionalidades do fluxo
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para as abas do fluxo de serviço
    const fluxoTabs = document.querySelectorAll('[data-cp-group="fluxo-servico"] .cp-tab');
    fluxoTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-cp-tab');
            switchCpTab('fluxo-servico', tabId);
        });
    });

    // Reset simulation when switching tabs
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('is-active')) {
                    currentFlowSimulation.isRunning = false;
                }
            }
        });
    });

    // Observe tab changes
    document.querySelectorAll('[data-cp-tab]').forEach(tab => {
        observer.observe(tab, { attributes: true });
    });
});

// ============= FUNÇÕES PARA SERVIÇOS 24 HORAS =============

// Funções auxiliares para loading
function showLoading(message = 'Carregando...') {
    // Cria ou atualiza modal de loading
    let loadingModal = document.getElementById('loading-modal');
    if (!loadingModal) {
        loadingModal = document.createElement('div');
        loadingModal.id = 'loading-modal';
        loadingModal.className = 'modal';
        loadingModal.style.display = 'flex';
        loadingModal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 300px;">
                <div style="font-size: 2rem; margin-bottom: 10px;">
                    <i class="fas fa-spinner fa-spin" style="color: #00BCD4;"></i>
                </div>
                <p id="loading-message">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingModal);
    } else {
        document.getElementById('loading-message').textContent = message;
        loadingModal.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
}

// Função para calcular valor e simular distância com prestador disponível
function calcularValorESimularDistancia(tipoServicoId, maxDistanceRadius) {
    // Encontra o tipo de serviço base
    const tipoServico = servicosUrgentesTipos.find(s => s.id === tipoServicoId);
    if (!tipoServico) return null;

    // Mapeamento de especialidades (mais robusto)
    const especialidadeMap = {
        'urg_eletricista': 'Eletricista',
        'urg_encanador': 'Encanador', 
        'urg_chaveiro': 'Chaveiro',
        'urg_vidraceiro': 'Vidraceiro',
        'urg_borracheiro': 'Borracheiro',
        'urg_mecanico': 'Mecânico'
    };
    
    const especialidadeNecessaria = especialidadeMap[tipoServicoId];
    if (!especialidadeNecessaria) return null;
    
    // Filtra prestadores pela especialidade e distância
    const prestadoresCompativeis = prestadoresSimulados.filter(p =>
        p.especialidade === especialidadeNecessaria && 
        p.localizacaoSimulada <= maxDistanceRadius
    );

    if (prestadoresCompativeis.length === 0) {
        return null; // Nenhuma opção disponível dentro do raio
    }

    // Pega o prestador mais próximo
    const prestadorEncontrado = prestadoresCompativeis[0];
    const distanciaRealSimulada = prestadorEncontrado.localizacaoSimulada;
    const custoDeslocamento = distanciaRealSimulada * TAXA_DESLOCAMENTO_KM;
    const valorTotal = tipoServico.valorBase + custoDeslocamento;

    return {
        tipoServico: tipoServico,
        prestador: prestadorEncontrado,
        valorTotal: valorTotal.toFixed(2),
        distanciaEstimada: distanciaRealSimulada,
        custoDeslocamento: custoDeslocamento.toFixed(2)
    };
}

// NOVAS FUNÇÕES PARA O FLUXO REFATORADO

// Variável global para armazenar prestador selecionado
let selectedUrgentProvider = null;

// Função para renderizar prestadores patrocinados
function renderSponsoredProviderCards() {
    const sponsoredContainer = document.querySelector('#sponsored-providers-container');
    if (!sponsoredContainer) return;

    const sponsoredProviders = prestadoresUrgentesSimulados.filter(p => p.patrocinado);
    
    if (sponsoredProviders.length === 0) {
        sponsoredContainer.innerHTML = '<p class="text-center text-muted">Nenhum prestador patrocinado disponível no momento.</p>';
        return;
    }

    sponsoredContainer.innerHTML = sponsoredProviders.map(provider => {
        const valorTotal = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const stars = '★'.repeat(Math.floor(provider.avaliacao)) + (provider.avaliacao % 1 >= 0.5 ? '☆' : '');
        
        return `
            <div class="provider-card" onclick="openServiceDescriptionModal(${provider.id})">
                <div class="provider-avatar">
                    <img src="${provider.foto}" alt="${provider.nome}">
                    <span class="sponsored-badge">Patrocinado</span>
                </div>
                <div class="provider-info">
                    <h4>${provider.nome}</h4>
                    <p class="specialty">${provider.especialidade}</p>
                    <div class="rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-number">${provider.avaliacao}</span>
                    </div>
                    <p class="distance"><i class="fas fa-map-marker-alt"></i> ${provider.distancia} km</p>
                    <p class="price">A partir de <strong>R$ ${valorTotal.toFixed(2)}</strong></p>
                </div>
                <button class="btn-select-provider">
                    <i class="fas fa-check"></i> Selecionar
                </button>
            </div>
        `;
    }).join('');
}

// Função para filtrar e renderizar prestadores urgentes
function filterUrgentServices() {
    const searchTerm = document.getElementById('urgent-service-search')?.value.toLowerCase() || '';
    const maxDistanceRadius = parseInt(document.getElementById('distance-radius')?.value || '10');

    const serviceListContainer = document.querySelector('.service-list-urgent');
    const noServicesMessage = document.getElementById('no-urgent-services-found');
    
    if (!serviceListContainer || !noServicesMessage) {
        console.error('Elementos não encontrados na página');
        return;
    }
    
    serviceListContainer.innerHTML = ''; // Limpa antes de renderizar

    // Filtra prestadores pelo termo de busca e distância
    const filteredProviders = prestadoresUrgentesSimulados.filter(provider => {
        const matchesSearch = provider.nome.toLowerCase().includes(searchTerm) || 
                            provider.especialidade.toLowerCase().includes(searchTerm);
        const withinDistance = provider.distancia <= maxDistanceRadius;
        return matchesSearch && withinDistance && !provider.patrocinado; // Exclui patrocinados desta lista
    });

    if (filteredProviders.length === 0) {
        noServicesMessage.style.display = 'block';
        renderSponsoredProviderCards(); // Sempre renderiza patrocinados
        return;
    }

    noServicesMessage.style.display = 'none';

    // Renderiza prestadores não patrocinados
    filteredProviders.forEach(provider => {
        const valorTotal = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const stars = '★'.repeat(Math.floor(provider.avaliacao)) + (provider.avaliacao % 1 >= 0.5 ? '☆' : '');
        
        const card = document.createElement('div');
        card.classList.add('provider-card');
        card.onclick = () => openServiceDescriptionModal(provider.id);
        card.innerHTML = `
            <div class="provider-avatar">
                <img src="${provider.foto}" alt="${provider.nome}">
            </div>
            <div class="provider-info">
                <h4>${provider.nome}</h4>
                <p class="specialty">${provider.especialidade}</p>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-number">${provider.avaliacao}</span>
                </div>
                <p class="distance"><i class="fas fa-map-marker-alt"></i> ${provider.distancia} km</p>
                <p class="price">A partir de <strong>R$ ${valorTotal.toFixed(2)}</strong></p>
            </div>
            <button class="btn-select-provider">
                <i class="fas fa-check"></i> Selecionar
            </button>
        `;
        serviceListContainer.appendChild(card);
    });

    // Renderiza prestadores patrocinados
    renderSponsoredProviderCards();
}

// Função para abrir modal de descrição do serviço
function openServiceDescriptionModal(providerId) {
    selectedUrgentProvider = prestadoresUrgentesSimulados.find(p => p.id === providerId);
    if (!selectedUrgentProvider) return;

    const modal = document.getElementById('urgent-service-description-modal');
    const providerInfo = document.getElementById('selected-provider-info');
    
    if (modal && providerInfo) {
        providerInfo.innerHTML = `
            <strong>Prestador selecionado:</strong> ${selectedUrgentProvider.nome} (${selectedUrgentProvider.especialidade}) - ${selectedUrgentProvider.distancia}km
        `;
        providerInfo.style.display = 'block';
        
        // Limpa a descrição anterior
        document.getElementById('urgent-description').value = '';
        
        modal.style.display = 'flex';
    }
}

// Função para enviar solicitação urgente
function sendUrgentRequest() {
    const description = document.getElementById('urgent-description')?.value.trim();
    
    if (!description) {
        alert('Por favor, descreva sua emergência.');
        return;
    }
    
    if (!selectedUrgentProvider) {
        alert('Erro: Nenhum prestador selecionado.');
        return;
    }

    // Fecha modal de descrição
    closeModal('urgent-service-description-modal');
    
    // Mostra loading
    showLoading('Enviando solicitação...');
    
    // Simula envio da solicitação
    setTimeout(() => {
        showLoading('Aguardando propostas...');
        
        // Simula chegada de propostas
        setTimeout(() => {
            hideLoading();
            generateSimulatedProposals(description);
        }, 3000);
    }, 2000);
}

// Função para gerar propostas simuladas
function generateSimulatedProposals(serviceDescription) {
    // Gera 2-4 propostas aleatórias
    const proposalCount = Math.floor(Math.random() * 3) + 2;
    const allProviders = prestadoresUrgentesSimulados.filter(p => p.especialidade === selectedUrgentProvider.especialidade);
    
    const proposals = [];
    for (let i = 0; i < Math.min(proposalCount, allProviders.length); i++) {
        const provider = allProviders[i];
        const baseValue = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const variation = (Math.random() - 0.5) * 0.2; // ±10% de variação
        const finalValue = baseValue * (1 + variation);
        const estimatedTime = Math.floor(Math.random() * 60) + 30; // 30-90 minutos
        
        proposals.push({
            provider: provider,
            value: finalValue,
            estimatedTime: estimatedTime,
            message: `Olá! Posso atender sua emergência de ${selectedUrgentProvider.especialidade.toLowerCase()}. Chego em aproximadamente ${estimatedTime} minutos.`
        });
    }
    
    // Ordena por preço (menor para maior)
    proposals.sort((a, b) => a.value - b.value);
    
    renderProposalsModal(proposals);
}

// Função para renderizar modal de propostas
function renderProposalsModal(proposals) {
    const modal = document.getElementById('urgent-proposals-modal');
    const proposalsList = document.getElementById('proposals-list');
    const noProposalsMsg = document.getElementById('no-proposals-found');
    
    if (!modal || !proposalsList) return;

    if (proposals.length === 0) {
        noProposalsMsg.style.display = 'block';
        proposalsList.innerHTML = '';
    } else {
        noProposalsMsg.style.display = 'none';
        
        proposalsList.innerHTML = proposals.map((proposal, index) => {
            const isFirstPlace = index === 0;
            const stars = '★'.repeat(Math.floor(proposal.provider.avaliacao)) + (proposal.provider.avaliacao % 1 >= 0.5 ? '☆' : '');
            
            return `
                <div class="proposal-item ${isFirstPlace ? 'best-proposal' : ''}" onclick="selectProposal(${index})">
                    ${isFirstPlace ? '<div class="best-badge"><i class="fas fa-crown"></i> Melhor Oferta</div>' : ''}
                    <div class="proposal-header">
                        <div class="provider-mini-info">
                            <img src="${proposal.provider.foto}" alt="${proposal.provider.nome}" class="mini-avatar">
                            <div>
                                <h4>${proposal.provider.nome}</h4>
                                <div class="mini-rating">
                                    <span class="stars">${stars}</span>
                                    <span class="rating-number">${proposal.provider.avaliacao}</span>
                                </div>
                            </div>
                        </div>
                        <div class="proposal-value">
                            <h3>R$ ${proposal.value.toFixed(2)}</h3>
                            <p>em ${proposal.estimatedTime} min</p>
                        </div>
                    </div>
                    <p class="proposal-message">"${proposal.message}"</p>
                    <button class="btn-accept-proposal">
                        <i class="fas fa-check"></i> Aceitar Proposta
                    </button>
                </div>
            `;
        }).join('');
    }
    
    modal.style.display = 'flex';
}

// Função para selecionar uma proposta
function selectProposal(proposalIndex) {
    closeModal('urgent-proposals-modal');
    
    showLoading('Confirmando serviço...');
    
    setTimeout(() => {
        hideLoading();
        alert('🎉 Serviço confirmado! O prestador está a caminho. Você receberá uma notificação quando ele chegar.');
        
        // Volta para a tela inicial
        showScreen('home-screen');
    }, 2000);
}

// ============= FUNÇÕES PARA SERVIÇOS 24 HORAS =============

// Funções auxiliares para loading
function showLoading(message = 'Carregando...') {
    // Cria ou atualiza modal de loading
    let loadingModal = document.getElementById('loading-modal');
    if (!loadingModal) {
        loadingModal = document.createElement('div');
        loadingModal.id = 'loading-modal';
        loadingModal.className = 'modal';
        loadingModal.style.display = 'flex';
        loadingModal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 300px;">
                <div style="font-size: 2rem; margin-bottom: 10px;">
                    <i class="fas fa-spinner fa-spin" style="color: #00BCD4;"></i>
                </div>
                <p id="loading-message">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingModal);
    } else {
        document.getElementById('loading-message').textContent = message;
        loadingModal.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
}

// Função para calcular valor e simular distância com prestador disponível
function calcularValorESimularDistancia(tipoServicoId, maxDistanceRadius) {
    // Encontra o tipo de serviço base
    const tipoServico = servicosUrgentesTipos.find(s => s.id === tipoServicoId);
    if (!tipoServico) return null;

    // Mapeamento de especialidades (mais robusto)
    const especialidadeMap = {
        'urg_eletricista': 'Eletricista',
        'urg_encanador': 'Encanador', 
        'urg_chaveiro': 'Chaveiro',
        'urg_vidraceiro': 'Vidraceiro',
        'urg_borracheiro': 'Borracheiro',
        'urg_mecanico': 'Mecânico'
    };
    
    const especialidadeNecessaria = especialidadeMap[tipoServicoId];
    if (!especialidadeNecessaria) return null;
    
    // Filtra prestadores pela especialidade e distância
    const prestadoresCompativeis = prestadoresSimulados.filter(p =>
        p.especialidade === especialidadeNecessaria && 
        p.localizacaoSimulada <= maxDistanceRadius
    );

    if (prestadoresCompativeis.length === 0) {
        return null; // Nenhuma opção disponível dentro do raio
    }

    // Pega o prestador mais próximo
    const prestadorEncontrado = prestadoresCompativeis[0];
    const distanciaRealSimulada = prestadorEncontrado.localizacaoSimulada;
    const custoDeslocamento = distanciaRealSimulada * TAXA_DESLOCAMENTO_KM;
    const valorTotal = tipoServico.valorBase + custoDeslocamento;

    return {
        tipoServico: tipoServico,
        prestador: prestadorEncontrado,
        valorTotal: valorTotal.toFixed(2),
        distanciaEstimada: distanciaRealSimulada,
        custoDeslocamento: custoDeslocamento.toFixed(2)
    };
}

// NOVAS FUNÇÕES PARA O FLUXO REFATORADO

// Função para renderizar prestadores patrocinados
function renderSponsoredProviderCards() {
    const sponsoredContainer = document.querySelector('#sponsored-providers-container');
    if (!sponsoredContainer) return;

    const sponsoredProviders = prestadoresUrgentesSimulados.filter(p => p.patrocinado);
    
    if (sponsoredProviders.length === 0) {
        sponsoredContainer.innerHTML = '<p class="text-center text-muted">Nenhum prestador patrocinado disponível no momento.</p>';
        return;
    }

    sponsoredContainer.innerHTML = sponsoredProviders.map(provider => {
        const valorTotal = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const stars = '★'.repeat(Math.floor(provider.avaliacao)) + (provider.avaliacao % 1 >= 0.5 ? '☆' : '');
        
        return `
            <div class="provider-card" onclick="openServiceDescriptionModal(${provider.id})">
                <div class="provider-avatar">
                    <img src="${provider.foto}" alt="${provider.nome}">
                    <span class="sponsored-badge">Patrocinado</span>
                </div>
                <div class="provider-info">
                    <h4>${provider.nome}</h4>
                    <p class="specialty">${provider.especialidade}</p>
                    <div class="rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-number">${provider.avaliacao}</span>
                    </div>
                    <p class="distance"><i class="fas fa-map-marker-alt"></i> ${provider.distancia} km</p>
                    <p class="price">A partir de <strong>R$ ${valorTotal.toFixed(2)}</strong></p>
                </div>
                <button class="btn-select-provider">
                    <i class="fas fa-check"></i> Selecionar
                </button>
            </div>
        `;
    }).join('');
}

// Função para filtrar e renderizar prestadores urgentes
function filterUrgentServices() {
    const searchTerm = document.getElementById('urgent-service-search')?.value.toLowerCase() || '';
    const maxDistanceRadius = parseInt(document.getElementById('distance-radius')?.value || '10');

    const serviceListContainer = document.querySelector('.service-list-urgent');
    const noServicesMessage = document.getElementById('no-urgent-services-found');
    
    if (!serviceListContainer || !noServicesMessage) {
        console.error('Elementos não encontrados na página');
        return;
    }
    
    serviceListContainer.innerHTML = ''; // Limpa antes de renderizar

    // Filtra prestadores pelo termo de busca e distância
    const filteredProviders = prestadoresUrgentesSimulados.filter(provider => {
        const matchesSearch = provider.nome.toLowerCase().includes(searchTerm) || 
                            provider.especialidade.toLowerCase().includes(searchTerm);
        const withinDistance = provider.distancia <= maxDistanceRadius;
        return matchesSearch && withinDistance && !provider.patrocinado; // Exclui patrocinados desta lista
    });

    if (filteredProviders.length === 0) {
        noServicesMessage.style.display = 'block';
        renderSponsoredProviderCards(); // Sempre renderiza patrocinados
        return;
    }

    noServicesMessage.style.display = 'none';

    // Renderiza prestadores não patrocinados
    filteredProviders.forEach(provider => {
        const valorTotal = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const stars = '★'.repeat(Math.floor(provider.avaliacao)) + (provider.avaliacao % 1 >= 0.5 ? '☆' : '');
        
        const card = document.createElement('div');
        card.classList.add('provider-card');
        card.onclick = () => openServiceDescriptionModal(provider.id);
        card.innerHTML = `
            <div class="provider-avatar">
                <img src="${provider.foto}" alt="${provider.nome}">
            </div>
            <div class="provider-info">
                <h4>${provider.nome}</h4>
                <p class="specialty">${provider.especialidade}</p>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-number">${provider.avaliacao}</span>
                </div>
                <p class="distance"><i class="fas fa-map-marker-alt"></i> ${provider.distancia} km</p>
                <p class="price">A partir de <strong>R$ ${valorTotal.toFixed(2)}</strong></p>
            </div>
            <button class="btn-select-provider">
                <i class="fas fa-check"></i> Selecionar
            </button>
        `;
        serviceListContainer.appendChild(card);
    });

    // Renderiza prestadores patrocinados
    renderSponsoredProviderCards();
}

// Função para abrir modal de descrição do serviço
function openServiceDescriptionModal(providerId) {
    selectedUrgentProvider = prestadoresUrgentesSimulados.find(p => p.id === providerId);
    if (!selectedUrgentProvider) return;

    const modal = document.getElementById('urgent-service-description-modal');
    const providerInfo = document.getElementById('selected-provider-info');
    
    if (modal && providerInfo) {
        providerInfo.innerHTML = `
            <strong>Prestador selecionado:</strong> ${selectedUrgentProvider.nome} (${selectedUrgentProvider.especialidade}) - ${selectedUrgentProvider.distancia}km
        `;
        providerInfo.style.display = 'block';
        
        // Limpa a descrição anterior
        document.getElementById('urgent-description').value = '';
        
        modal.style.display = 'flex';
    }
}

// Função para enviar solicitação urgente
function sendUrgentRequest() {
    const description = document.getElementById('urgent-description')?.value.trim();
    
    if (!description) {
        alert('Por favor, descreva sua emergência.');
        return;
    }
    
    if (!selectedUrgentProvider) {
        alert('Erro: Nenhum prestador selecionado.');
        return;
    }

    // Fecha modal de descrição
    closeModal('urgent-service-description-modal');
    
    // Mostra loading
    showLoading('Enviando solicitação...');
    
    // Simula envio da solicitação
    setTimeout(() => {
        showLoading('Aguardando propostas...');
        
        // Simula chegada de propostas
        setTimeout(() => {
            hideLoading();
            generateSimulatedProposals(description);
        }, 3000);
    }, 2000);
}

// Função para gerar propostas simuladas
function generateSimulatedProposals(serviceDescription) {
    // Gera 2-4 propostas aleatórias
    const proposalCount = Math.floor(Math.random() * 3) + 2;
    const allProviders = prestadoresUrgentesSimulados.filter(p => p.especialidade === selectedUrgentProvider.especialidade);
    
    const proposals = [];
    for (let i = 0; i < Math.min(proposalCount, allProviders.length); i++) {
        const provider = allProviders[i];
        const baseValue = provider.valorBaseServico + (provider.distancia * provider.custoPorKmDeslocamento);
        const variation = (Math.random() - 0.5) * 0.2; // ±10% de variação
        const finalValue = baseValue * (1 + variation);
        const estimatedTime = Math.floor(Math.random() * 60) + 30; // 30-90 minutos
        
        proposals.push({
            provider: provider,
            value: finalValue,
            estimatedTime: estimatedTime,
            message: `Olá! Posso atender sua emergência de ${selectedUrgentProvider.especialidade.toLowerCase()}. Chego em aproximadamente ${estimatedTime} minutos.`
        });
    }
    
    // Ordena por preço (menor para maior)
    proposals.sort((a, b) => a.value - b.value);
    
    renderProposalsModal(proposals);
}

// Função para renderizar modal de propostas
function renderProposalsModal(proposals) {
    const modal = document.getElementById('urgent-proposals-modal');
    const proposalsList = document.getElementById('proposals-list');
    const noProposalsMsg = document.getElementById('no-proposals-found');
    
    if (!modal || !proposalsList) return;

    if (proposals.length === 0) {
        noProposalsMsg.style.display = 'block';
        proposalsList.innerHTML = '';
    } else {
        noProposalsMsg.style.display = 'none';
        
        proposalsList.innerHTML = proposals.map((proposal, index) => {
            const isFirstPlace = index === 0;
            const stars = '★'.repeat(Math.floor(proposal.provider.avaliacao)) + (proposal.provider.avaliacao % 1 >= 0.5 ? '☆' : '');
            
            return `
                <div class="proposal-item ${isFirstPlace ? 'best-proposal' : ''}" onclick="selectProposal(${index})">
                    ${isFirstPlace ? '<div class="best-badge"><i class="fas fa-crown"></i> Melhor Oferta</div>' : ''}
                    <div class="proposal-header">
                        <div class="provider-mini-info">
                            <img src="${proposal.provider.foto}" alt="${proposal.provider.nome}" class="mini-avatar">
                            <div>
                                <h4>${proposal.provider.nome}</h4>
                                <div class="mini-rating">
                                    <span class="stars">${stars}</span>
                                    <span class="rating-number">${proposal.provider.avaliacao}</span>
                                </div>
                            </div>
                        </div>
                        <div class="proposal-value">
                            <h3>R$ ${proposal.value.toFixed(2)}</h3>
                            <p>em ${proposal.estimatedTime} min</p>
                        </div>
                    </div>
                    <p class="proposal-message">"${proposal.message}"</p>
                    <button class="btn-accept-proposal">
                        <i class="fas fa-check"></i> Aceitar Proposta
                    </button>
                </div>
            `;
        }).join('');
    }
    
    modal.style.display = 'flex';
}

// Função para selecionar uma proposta
function selectProposal(proposalIndex) {
    closeModal('urgent-proposals-modal');
    
    showLoading('Confirmando serviço...');
    
    setTimeout(() => {
        hideLoading();
        alert('🎉 Serviço confirmado! O prestador está a caminho. Você receberá uma notificação quando ele chegar.');
        
        // Volta para a tela inicial
        showScreen('home-screen');
    }, 2000);
}

// Função para filtrar e renderizar serviços urgentes com busca e raio
function filterUrgentServices() {
    const searchTerm = document.getElementById('urgent-service-search')?.value.toLowerCase() || '';
    const maxDistanceRadius = parseInt(document.getElementById('distance-radius')?.value || '10');

    const serviceListContainer = document.querySelector('.service-list-urgent');
    const noServicesMessage = document.getElementById('no-urgent-services-found');
    
    if (!serviceListContainer || !noServicesMessage) {
        console.error('Elementos não encontrados na página');
        return;
    }
    
    serviceListContainer.innerHTML = ''; // Limpa antes de renderizar

    let foundServicesCount = 0;

    servicosUrgentesTipos.forEach(tipoServico => {
        if (tipoServico.nome.toLowerCase().includes(searchTerm)) {
            // Tenta encontrar um prestador e calcular o valor/distância
            const result = calcularValorESimularDistancia(tipoServico.id, maxDistanceRadius);

            if (result) { // Se um prestador foi simulado dentro do raio
                foundServicesCount++;
                const card = document.createElement('div');
                card.classList.add('card');
                card.style.cursor = 'pointer';
                card.style.position = 'relative';
                
                // ID único para o card
                const cardId = `provider-${tipoServico.id}-${foundServicesCount}`;
                card.setAttribute('data-provider-id', cardId);
                card.setAttribute('data-specialty', tipoServico.nome);
                
                // Adiciona checkbox de seleção
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'provider-checkbox';
                checkbox.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    z-index: 2;
                `;
                checkbox.onchange = (e) => {
                    e.stopPropagation();
                    toggleProviderSelection(cardId, result, checkbox.checked);
                };
                
                // Evento de clique no card (exceto no checkbox)
                card.onclick = (e) => {
                    if (e.target !== checkbox) {
                        openUrgentProviderProfile(result);
                    }
                };
                
                card.innerHTML = 
                    '<i class="' + tipoServico.icone + '"></i>' +
                    '<h3>' + tipoServico.nome + '</h3>' +
                    '<p><strong>Preço Médio:</strong> R$ ' + result.valorTotal + '</p>' +
                    '<p><strong>Tempo de Chegada:</strong> Aproximadamente ' + Math.round(result.distanciaEstimada * 2.5) + ' minutos</p>';
                
                // Adiciona o checkbox após renderizar o conteúdo
                card.appendChild(checkbox);
                serviceListContainer.appendChild(card);
            }
        }
    });

    if (foundServicesCount === 0) {
        noServicesMessage.style.display = 'block';
    } else {
        noServicesMessage.style.display = 'none';
    }
}

// Função para abrir o perfil do prestador urgente
function openUrgentProviderProfile(serviceData) {
    currentSelectedUrgentServiceData = serviceData; // Armazena todos os dados para a solicitação

    // Preenche os dados do modal de perfil com verificação de existência
    const avatarElement = document.getElementById('urgent-provider-avatar');
    if (avatarElement) avatarElement.src = serviceData.prestador.avatar;
    
    const nameElement = document.getElementById('urgent-provider-name');
    if (nameElement) nameElement.textContent = serviceData.prestador.nome;
    
    const specialtyElement = document.getElementById('urgent-provider-specialty');
    if (specialtyElement) specialtyElement.textContent = serviceData.tipoServico.nome.split(' - ')[0];
    
    const ratingElement = document.getElementById('urgent-provider-rating');
    if (ratingElement) ratingElement.innerHTML = `<i class="fas fa-star text-warning"></i> ${serviceData.prestador.avaliacao}`;
    
    const distanceElement = document.getElementById('urgent-provider-distance');
    if (distanceElement) distanceElement.textContent = `Aproximadamente ${Math.round(serviceData.distanciaEstimada * 2.5)} minutos`;
    
    const bioElement = document.getElementById('urgent-provider-bio');
    if (bioElement) bioElement.textContent = `"Disponível para ${serviceData.tipoServico.nome.split(' - ')[0]} em tempo de chegada estimado de ${Math.round(serviceData.distanciaEstimada * 2.5)} minutos. Atendimento rápido e de qualidade!"`;
    
    const valueElement = document.getElementById('urgent-provider-service-total-value');
    if (valueElement) valueElement.textContent = `R$ ${serviceData.valorTotal}`;

    const modal = document.getElementById('urgent-provider-profile-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.warn('Modal urgent-provider-profile-modal não encontrado');
        // Fallback: mostrar notificação com dados do prestador
        showNotification(`Prestador: ${serviceData.prestador.nome} - R$ ${serviceData.valorTotal}`, 'info');
    }
}

// Função auxiliar para mostrar modais (função faltante)
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Adicionar classe para animação se existir
        modal.classList.add('show');
    } else {
        console.warn(`Modal ${modalId} não encontrado`);
    }
}

// Função auxiliar para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

// Função hideModal para compatibilidade (alias para closeModal)
function hideModal(modalId) {
    closeModal(modalId);
}

// Função para solicitar o serviço urgente (chamada do modal de perfil)
function solicitarServicoUrgente() {
    if (!currentSelectedUrgentServiceData) {
        showAlert('Erro: Nenhum serviço urgente selecionado para solicitação.', 'error');
        return;
    }

    const { tipoServico, prestador, valorTotal, distanciaEstimada } = currentSelectedUrgentServiceData;

    showLoading('Enviando solicitação urgente e buscando confirmação do prestador...');

    setTimeout(() => {
        hideLoading();
        closeModal('urgent-provider-profile-modal'); // Fecha o modal de perfil

        // Adiciona o trabalho simulado à lista de trabalhos em execução
        trabalhosEmExecucao.push({
            id: `urg-${Date.now()}`,
            servico: tipoServico.nome,
            prestador: prestador.nome,
            status: 'Em caminho',
            valor: `R$ ${valorTotal}`,
            prazo: `Chegada estimada em ${Math.floor(Math.random() * 15) + 5} min (aprox., ${distanciaEstimada} km)`,
            progresso: 10,
            isUrgent: true
        });

        showAlert(`Serviço "${tipoServico.nome}" solicitado com sucesso! O prestador ${prestador.nome} está a caminho.`, 'success');
        showScreen('client-dashboard'); // Retorna ao dashboard
        updateDashboard(); // Atualiza a lista de trabalhos
        currentSelectedUrgentServiceData = null; // Limpa os dados selecionados
    }, 2500); // Simula 2.5 segundos para processamento
}

// ===== SISTEMA DE BADGE DE VERIFICAÇÃO - MONETIZAÇÃO PREMIUM =====

// Função para renderizar badges do prestador
function renderBadges(badges, size = 'normal') {
    if (!badges || badges.length === 0) return '';
    
    const sizeClass = size === 'small' ? 'badge-small' : 'badge-normal';
    
    return badges.map(badgeType => {
        const badge = badgeTypes[badgeType];
        if (!badge) return '';
        
        return `
            <span class="verification-badge ${sizeClass}" 
                  style="color: ${badge.color};" 
                  title="${badge.description}">
                <i class="${badge.icon}"></i>
            </span>
        `;
    }).join('');
}

// Função para verificar se prestador tem badge específico
function hasBadge(prestador, badgeType) {
    return prestador.badges && prestador.badges.includes(badgeType);
}

// Função para verificar se prestador é premium
function isPremiumProvider(prestador) {
    if (!prestador.badges) return false;
    return prestador.badges.some(badge => badgeTypes[badge] && badgeTypes[badge].premium);
}

// Função para mostrar modal de upgrade para premium
function showPremiumUpgradeModal() {
    const modal = document.getElementById('modal-premium-upgrade');
    if (modal) {
        modal.style.display = 'flex';
        // Adicionar animação
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }
}

// Função para fechar modal de upgrade premium
function closePremiumModal() {
    const modal = document.getElementById('modal-premium-upgrade');
    if (modal) {
        modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Função para simular compra do plano premium
function purchasePremium() {
    // Simular processamento
    const purchaseBtn = document.querySelector('#premium-purchase-btn');
    if (purchaseBtn) {
        purchaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        purchaseBtn.disabled = true;
    }
    
    setTimeout(() => {
        // Ativar plano premium
        badgeSystem.currentPlan = 'premium';
        
        // Mostrar sucesso
        showNotification('Parabéns! Seu plano Premium foi ativado com sucesso!', 'success');
        
        // Fechar modal
        closePremiumModal();
        
        // Restaurar botão
        if (purchaseBtn) {
            purchaseBtn.innerHTML = '<i class="fas fa-crown"></i> Confirmar Compra';
            purchaseBtn.disabled = false;
        }
        
        // Atualizar interface se estiver na tela de prestador
        if (activeScreenId === 'provider-dashboard') {
            updateProviderInterface();
        }
    }, 2000);
}

// Função para atualizar interface do prestador com recursos premium
function updateProviderInterface() {
    const premiumFeatures = document.querySelectorAll('.premium-feature');
    const premiumBadges = document.querySelectorAll('.premium-badge-indicator');
    
    if (badgeSystem.currentPlan === 'premium') {
        premiumFeatures.forEach(feature => {
            feature.classList.remove('premium-locked');
            feature.classList.add('premium-active');
        });
        
        premiumBadges.forEach(badge => {
            badge.style.display = 'inline-block';
        });
    } else {
        premiumFeatures.forEach(feature => {
            feature.classList.add('premium-locked');
            feature.classList.remove('premium-active');
        });
        
        premiumBadges.forEach(badge => {
            badge.style.display = 'none';
        });
    }
}

// Função para adicionar badges aos cards de prestadores já existentes
function updateExistingProviderCards() {
    const providerCards = document.querySelectorAll('.provider-card');
    
    providerCards.forEach(card => {
        const providerName = card.querySelector('h4')?.textContent;
        if (!providerName) return;
        
        // Encontrar prestador correspondente
        const provider = prestadoresSimulados.find(p => p.nome === providerName) ||
                        prestadoresUrgentesSimulados.find(p => p.nome === providerName);
        
        if (provider && provider.badges) {
            const nameElement = card.querySelector('h4');
            if (nameElement && !nameElement.parentElement.classList.contains('provider-name-container')) {
                // Criar container para nome + badges
                const nameContainer = document.createElement('div');
                nameContainer.className = 'provider-name-container';
                
                nameContainer.appendChild(nameElement.cloneNode(true));
                nameContainer.innerHTML += renderBadges(provider.badges, 'small');
                
                nameElement.parentElement.replaceChild(nameContainer, nameElement);
            }
        }
    });
}

// Inicializar sistema de badges quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar observer para detectar novos cards de prestadores
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('provider-card')) {
                        setTimeout(() => updateExistingProviderCards(), 100);
                    }
                });
            }
        });
    });

    // Observar mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Atualizar cards existentes
    setTimeout(() => updateExistingProviderCards(), 1000);
});

// ===== INICIALIZAÇÃO COMPLETA DO SISTEMA =====

// Verificar se todos os sistemas foram carregados
function initializeAllSystems() {
    console.log('🚀 Inicializando sistemas ChamadoPro v2.1.0...');
    
    // Temporariamente marcar tutorial como completo para debug
    if (!localStorage.getItem('onboarding_completed')) {
        console.log('⚠️ Marcando tutorial como completo para debug...');
        localStorage.setItem('onboarding_completed', 'true');
    }
    
    try {
        // 1. Sistemas de experiência
        if (typeof initializeExperienceSystems === 'function') {
            initializeExperienceSystems();
            console.log('✅ Sistemas de experiência carregados');
        } else {
            console.warn('⚠️ initializeExperienceSystems não encontrada');
        }
        
        // 2. Sistema de notificações avançadas
        if (!document.getElementById('notification-container')) {
            const container = createNotificationContainer();
            document.body.appendChild(container);
            console.log('✅ Sistema de notificações configurado');
        }
        
        // 3. Sistema de relatórios
        if (!document.getElementById('reporting-modal')) {
            const reportModal = createReportingSystem();
            document.body.appendChild(reportModal);
            console.log('✅ Sistema de relatórios adicionado');
        }
        
        // 4. Configurar atalhos de teclado
        setupKeyboardShortcuts();
        console.log('✅ Atalhos de teclado configurados');
        
        // 5. Mostrar notificação de boas-vindas
        setTimeout(() => {
            // Seleciona uma frase motivacional aleatória
            const fraseAleatoria = frasesMotivacionais[Math.floor(Math.random() * frasesMotivacionais.length)];
            showNotification(fraseAleatoria, 'success');
        }, 3000);
        
        console.log('🎉 Todos os sistemas inicializados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        // Fallback: mostrar notificação simples
        setTimeout(() => {
            alert('Erro na inicialização. Recarregue a página.');
        }, 1000);
    }
}

// Configurar atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + K para assistente
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleAssistant();
        }
        
        // F1 para tutorial
        if (e.key === 'F1') {
            e.preventDefault();
            startOnboarding();
        }
        
        // Ctrl + R para relatórios (admin only)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            openReportingModal();
        }
        
        // Escape para fechar modais
        if (e.key === 'Escape') {
            const modals = ['premium-modal', 'reporting-modal', 'advanced-feedback-modal', 'onboarding-overlay'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
            
            if (virtualAssistant.isOpen) {
                toggleAssistant();
            }
        }
    });
}

// Inicialização automática quando sistemas estão prontos
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(initializeAllSystems, 1000);
});

// ===== CORREÇÕES E FUNÇÕES FALTANTES =====

// Função para criar container de notificações (estava faltando)
function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        max-width: 400px;
    `;
    return container;
}

// Função para criar relatórios de usuários
function createUsersReport() {
    return `
        <div style="display: grid; gap: 20px;">
            <div style="
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 20px;
                border-radius: 12px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            ">
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">1,400</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Total Usuários</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">1,020</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Usuários Ativos</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">87%</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Taxa Retenção</p>
                </div>
            </div>
            
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #333;">Crescimento de Usuários</h4>
                <p style="color: #666;">Gráfico de crescimento seria exibido aqui</p>
            </div>
        </div>
    `;
}

// Função para criar relatórios de serviços
function createServicesReport() {
    return `
        <div style="display: grid; gap: 20px;">
            <div style="
                background: linear-gradient(135deg, #17a2b8, #6f42c1);
                color: white;
                padding: 20px;
                border-radius: 12px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            ">
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">378</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Serviços Mês</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">95%</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Taxa Conclusão</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">4.7★</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Avaliação Média</p>
                </div>
            </div>
            
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #333;">Distribuição por Categoria</h4>
                <div style="display: grid; gap: 10px;">
                    ${Object.entries(reportData.services.categories).map(([category, value]) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
                            <span style="color: #333; font-weight: 500;">${category}</span>
                            <span style="background: #00BCD4; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                                ${value} serviços
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Função para criar relatórios de performance
function createPerformanceReport() {
    return `
        <div style="display: grid; gap: 20px;">
            <div style="
                background: linear-gradient(135deg, #6f42c1, #dc3545);
                color: white;
                padding: 20px;
                border-radius: 12px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            ">
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">2.3s</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Tempo Resposta</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">99.8%</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Uptime</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="margin: 0; font-size: 2rem;">15%</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Conversão</p>
                </div>
            </div>
        </div>
    `;
}

// ===== SISTEMA DE SELEÇÃO MÚLTIPLA PARA SERVIÇOS URGENTES =====

function toggleProviderSelection(providerId, providerData, isSelected) {
    try {
        const card = document.querySelector(`[data-provider-id="${providerId}"]`);
        
        if (isSelected) {
            selectedProviders.add({
                id: providerId,
                data: providerData,
                specialty: card.getAttribute('data-specialty')
            });
            card.style.border = '3px solid #00BCD4';
            card.style.backgroundColor = '#e8f5e8';
        } else {
            // Remove da seleção
            selectedProviders.forEach(provider => {
                if (provider.id === providerId) {
                    selectedProviders.delete(provider);
                }
            });
            card.style.border = '';
            card.style.backgroundColor = '';
        }
        
        updateSelectionUI();
    } catch (error) {
        console.error('Erro ao alternar seleção do prestador:', error);
    }
}

function updateSelectionUI() {
    const selectedCount = selectedProviders.size;
    const selectionInfo = document.getElementById('selection-info');
    const broadcastButton = document.getElementById('broadcast-button');
    const buttonText = document.getElementById('button-text');
    const selectedCountSpan = document.getElementById('selected-count');
    
    if (selectedCount === 0) {
        selectionInfo.style.display = 'none';
        broadcastButton.disabled = true;
        broadcastButton.style.backgroundColor = '#ccc';
        buttonText.textContent = 'Selecione ao menos 2 prestadores para enviar solicitação';
    } else if (selectedCount === 1) {
        selectionInfo.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
        broadcastButton.disabled = true;
        broadcastButton.style.backgroundColor = '#ff9800';
        buttonText.textContent = 'Selecione mais 1 prestador para enviar solicitação';
    } else {
        selectionInfo.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
        broadcastButton.disabled = false;
        broadcastButton.style.backgroundColor = '#00BCD4';
        buttonText.textContent = `Enviar Solicitação para ${selectedCount} Prestadores Selecionados`;
    }
}

function clearAllSelections() {
    selectedProviders.clear();
    
    // Remove a seleção visual de todos os cards
    document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('[data-provider-id]').forEach(card => {
        card.style.border = '';
        card.style.backgroundColor = '';
    });
    
    updateSelectionUI();
}

function sendToSelectedProviders() {
    if (selectedProviders.size < 2) {
        showAlert('Selecione ao menos 2 prestadores para enviar a solicitação.', 'warning');
        return;
    }
    
    // Verifica se todos os selecionados são da mesma especialidade
    const specialties = new Set();
    selectedProviders.forEach(provider => {
        specialties.add(provider.specialty);
    });
    
    if (specialties.size > 1) {
        showAlert('Todos os prestadores selecionados devem ser da mesma especialidade.', 'warning');
        return;
    }
    
    // Simula o envio da solicitação
    urgentRequestActive = true;
    urgentRequestData = {
        providers: Array.from(selectedProviders),
        specialty: Array.from(specialties)[0],
        timestamp: Date.now(),
        status: 'pending'
    };
    
    showUrgentRequestModal();
}

function showUrgentRequestModal() {
    const providersCount = selectedProviders.size;
    const specialty = urgentRequestData.specialty;
    const estimatedValue = Array.from(selectedProviders)[0].data.valorTotal;
    
    showAlert('Solicitação urgente enviada para ' + providersCount + ' prestadores de ' + specialty + '. Valor estimado: R$ ' + estimatedValue + '. Aguardando resposta...', 'success', 5000);
    
    // Simula resposta após 3 segundos
    setTimeout(() => {
        simulateProviderResponse();
    }, 3000);
    
    // Limpa a seleção
    clearAllSelections();
}

function simulateProviderResponse() {
    if (!urgentRequestActive) return;
    
    const selectedProvider = Array.from(urgentRequestData.providers)[0];
    
    showAlert('Prestador ' + selectedProvider.data.prestador.nome + ' aceitou o serviço! Valor R$ ' + selectedProvider.data.valorTotal + ' debitado automaticamente. Outros prestadores cancelados.', 'success', 5000);
    
    urgentRequestActive = false;
    urgentRequestData = null;
}

function cancelUrgentRequest() {
    urgentRequestActive = false;
    urgentRequestData = null;
    showAlert('Solicitação urgente cancelada.', 'info');
}

// ===== SISTEMA DE SELEÇÃO MÚLTIPLA PARA SERVIÇOS URGENTES =====

function toggleProviderSelection(providerId, providerData, isSelected) {
    try {
        const card = document.querySelector(`[data-provider-id="${providerId}"]`);
        
        if (isSelected) {
            selectedProviders.add({
                id: providerId,
                data: providerData,
                specialty: card.getAttribute('data-specialty')
            });
            card.style.border = '3px solid #00BCD4';
            card.style.backgroundColor = '#e8f5e8';
        } else {
            // Remove da seleção
            selectedProviders.forEach(provider => {
                if (provider.id === providerId) {
                    selectedProviders.delete(provider);
                }
            });
            card.style.border = '';
            card.style.backgroundColor = '';
        }
        
        updateSelectionUI();
    } catch (error) {
        console.error('Erro ao alternar seleção do prestador:', error);
    }
}

function updateSelectionUI() {
    const selectedCount = selectedProviders.size;
    const selectionInfo = document.getElementById('selection-info');
    const broadcastButton = document.getElementById('broadcast-button');
    const buttonText = document.getElementById('button-text');
    const selectedCountSpan = document.getElementById('selected-count');
    
    if (selectedCount === 0) {
        selectionInfo.style.display = 'none';
        broadcastButton.disabled = true;
        broadcastButton.style.backgroundColor = '#ccc';
        buttonText.textContent = 'Selecione ao menos 2 prestadores para enviar solicitação';
    } else if (selectedCount === 1) {
        selectionInfo.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
        broadcastButton.disabled = true;
        broadcastButton.style.backgroundColor = '#ff9800';
        buttonText.textContent = 'Selecione mais 1 prestador para enviar solicitação';
    } else {
        selectionInfo.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
        broadcastButton.disabled = false;
        broadcastButton.style.backgroundColor = '#00BCD4';
        buttonText.textContent = `Enviar Solicitação para ${selectedCount} Prestadores Selecionados`;
    }
}

function clearAllSelections() {
    selectedProviders.clear();
    
    // Remove a seleção visual de todos os cards
    document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('[data-provider-id]').forEach(card => {
        card.style.border = '';
        card.style.backgroundColor = '';
    });
    
    updateSelectionUI();
}

function sendToSelectedProviders() {
    if (selectedProviders.size < 2) {
        showAlert('Selecione ao menos 2 prestadores para enviar a solicitação.', 'warning');
        return;
    }
    
    // Verifica se todos os selecionados são da mesma especialidade
    const specialties = new Set();
    selectedProviders.forEach(provider => {
        specialties.add(provider.specialty);
    });
    
    if (specialties.size > 1) {
        showAlert('Todos os prestadores selecionados devem ser da mesma especialidade.', 'warning');
        return;
    }
    
    // Simula o envio da solicitação
    urgentRequestActive = true;
    urgentRequestData = {
        providers: Array.from(selectedProviders),
        specialty: Array.from(specialties)[0],
        timestamp: Date.now(),
        status: 'pending'
    };
    
    showUrgentRequestModal();
}

function showUrgentRequestModal() {
    const providersCount = selectedProviders.size;
    const specialty = urgentRequestData.specialty;
    const estimatedValue = Array.from(selectedProviders)[0].data.valorTotal;
    
    showAlert(`
        <div style="text-align: center;">
            <h3 style="color: #00BCD4; margin-bottom: 15px;">
                <i class="fas fa-bolt"></i> Solicitação Urgente Enviada!
            </h3>
            <p><strong>Especialidade:</strong> ${specialty}</p>
            <p><strong>Prestadores contactados:</strong> ${providersCount}</p>
            <p><strong>Valor estimado:</strong> R$ ${estimatedValue}</p>
            <div style="background: #e8f5e8; padding: 10px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #2e7d2e;">
                    <i class="fas fa-clock"></i> Aguardando resposta dos prestadores...
                </p>
                <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">
                    O primeiro a aceitar será contratado automaticamente.
                </p>
            </div>
            <button onclick="simulateProviderResponse()" style="
                background: #00BCD4; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 8px; 
                cursor: pointer;
                margin-right: 10px;
            ">
                Simular Resposta
            </button>
            <button onclick="cancelUrgentRequest()" style="
                background: #d32f2f; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 8px; 
                cursor: pointer;
            ">
                Cancelar Solicitação
            </button>
        </div>
    `, 'info', 10000);
    
    // Limpa a seleção
    clearAllSelections();
}

function simulateProviderResponse() {
    if (!urgentRequestActive) return;
    
    const selectedProvider = Array.from(selectedProviders)[0] || Array.from(urgentRequestData.providers)[0];
    
    showAlert(`
        <div style="text-align: center;">
            <h3 style="color: #4CAF50; margin-bottom: 15px;">
                <i class="fas fa-check-circle"></i> Prestador Encontrado!
            </h3>
            <p><strong>Prestador:</strong> ${selectedProvider.data.prestador.nome}</p>
            <p><strong>Especialidade:</strong> ${selectedProvider.specialty}</p>
            <p><strong>Tempo estimado:</strong> ${Math.round(selectedProvider.data.distanciaEstimada * 2.5)} minutos</p>
            <p><strong>Valor:</strong> R$ ${selectedProvider.data.valorTotal}</p>
            <div style="background: #e8f5e8; padding: 10px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #2e7d2e;">
                    <i class="fas fa-credit-card"></i> Valor debitado automaticamente do cartão
                </p>
                <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">
                    Outros prestadores foram automaticamente cancelados.
                </p>
            </div>
        </div>
    `, 'success', 8000);
    
    urgentRequestActive = false;
    urgentRequestData = null;
}

function cancelUrgentRequest() {
    urgentRequestActive = false;
    urgentRequestData = null;
    showAlert('Solicitação urgente cancelada.', 'info');
}


// ===== SISTEMA DE SELEÇÃO MÚLTIPLA PARA SERVIÇOS URGENTES =====

function toggleProviderSelection(providerId, providerData, isSelected) {
    try {
        const card = document.querySelector('[data-provider-id="' + providerId + '"]');
        
        if (isSelected) {
            selectedProviders.add({
                id: providerId,
                data: providerData,
                specialty: card.getAttribute('data-specialty')
            });
            card.style.border = '3px solid #00BCD4';
            card.style.backgroundColor = '#e8f5e8';
        } else {
            selectedProviders.forEach(provider => {
                if (provider.id === providerId) {
                    selectedProviders.delete(provider);
                }
            });
            card.style.border = '';
            card.style.backgroundColor = '';
        }
        
        updateSelectionUI();
    } catch (error) {
        console.error('Erro ao alternar seleção do prestador:', error);
    }
}

function updateSelectionUI() {
    const selectedCount = selectedProviders.size;
    const selectionInfo = document.getElementById('selection-info');
    const broadcastButton = document.getElementById('broadcast-button');
    const buttonText = document.getElementById('button-text');
    const selectedCountSpan = document.getElementById('selected-count');
    
    if (selectedCount === 0) {
        if (selectionInfo) selectionInfo.style.display = 'none';
        if (broadcastButton) {
            broadcastButton.disabled = true;
            broadcastButton.style.backgroundColor = '#ccc';
        }
        if (buttonText) buttonText.textContent = 'Selecione ao menos 2 prestadores para enviar solicitação';
    } else if (selectedCount === 1) {
        if (selectionInfo) selectionInfo.style.display = 'block';
        if (selectedCountSpan) selectedCountSpan.textContent = selectedCount;
        if (broadcastButton) {
            broadcastButton.disabled = true;
            broadcastButton.style.backgroundColor = '#ff9800';
        }
        if (buttonText) buttonText.textContent = 'Selecione mais 1 prestador para enviar solicitação';
    } else {
        if (selectionInfo) selectionInfo.style.display = 'block';
        if (selectedCountSpan) selectedCountSpan.textContent = selectedCount;
        if (broadcastButton) {
            broadcastButton.disabled = false;
            broadcastButton.style.backgroundColor = '#00BCD4';
        }
        if (buttonText) buttonText.textContent = 'Enviar Solicitação para ' + selectedCount + ' Prestadores Selecionados';
    }
}

function clearAllSelections() {
    selectedProviders.clear();
    
    document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('[data-provider-id]').forEach(card => {
        card.style.border = '';
        card.style.backgroundColor = '';
    });
    
    updateSelectionUI();
}

function sendToSelectedProviders() {
    if (selectedProviders.size < 2) {
        showAlert('Selecione ao menos 2 prestadores para enviar a solicitação.', 'warning');
        return;
    }
    
    const specialties = new Set();
    selectedProviders.forEach(provider => {
        specialties.add(provider.specialty);
    });
    
    if (specialties.size > 1) {
        showAlert('Todos os prestadores selecionados devem ser da mesma especialidade.', 'warning');
        return;
    }
    
    urgentRequestActive = true;
    urgentRequestData = {
        providers: Array.from(selectedProviders),
        specialty: Array.from(specialties)[0],
        timestamp: Date.now(),
        status: 'pending'
    };
    
    showUrgentRequestModal();
}

function showUrgentRequestModal() {
    const providersCount = selectedProviders.size;
    const specialty = urgentRequestData.specialty;
    const estimatedValue = Array.from(selectedProviders)[0].data.valorTotal;
    
    showAlert('Solicitação urgente enviada para ' + providersCount + ' prestadores de ' + specialty + '. Valor estimado: R$ ' + estimatedValue + '. Aguardando resposta...', 'success', 5000);
    
    setTimeout(() => {
        simulateProviderResponse();
    }, 3000);
    
    clearAllSelections();
}

function simulateProviderResponse() {
    if (!urgentRequestActive) return;
    
    const selectedProvider = Array.from(urgentRequestData.providers)[0];
    
    showAlert('Prestador ' + selectedProvider.data.prestador.nome + ' aceitou o serviço! Valor R$ ' + selectedProvider.data.valorTotal + ' debitado automaticamente. Outros prestadores cancelados.', 'success', 5000);
    
    urgentRequestActive = false;
    urgentRequestData = null;
}

function cancelUrgentRequest() {
    urgentRequestActive = false;
    urgentRequestData = null;
    showAlert('Solicitação urgente cancelada.', 'info');
}
