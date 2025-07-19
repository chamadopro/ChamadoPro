// Variáveis globais para gerenciar o estado da aplicação
let currentScreen = 'splash'; // Tela inicial
let screenHistory = []; // Para o botão de voltar
let currentUserType = null; // 'usuario' ou 'prestador'

// Dados de exemplo para simulação
let servicosAtivosCount = 1; // Exemplo de contador
let ocorrenciasCount = 0; // Exemplo de contador
let servicosHistoricoCount = 5; // Exemplo de contador

let orcamentosUsuarioSolicitados = [
    { id: 1, title: 'Instalação de Tomada', description: 'Preciso instalar uma tomada nova na cozinha.', client: 'Eu', address: 'Rua A, 123', date: '2024-07-15', photos: ['https://placehold.co/100x100/FF0000/FFFFFF?text=Foto1'], video: '' },
    { id: 2, title: 'Pintura de Quarto', description: 'Pintar um quarto de 3x4m, cor branca.', client: 'Eu', address: 'Rua B, 456', date: '2024-07-14', photos: [], video: '' }
];
let orcamentosUsuarioRecebidos = [
    { id: 101, prestador: 'Eletricista Silva', service: 'Instalação de Tomada', value: 'R$ 150,00', date: '2024-07-15', estimatedTime: 2, description: 'Proposta para instalação de tomada com material incluso.', materials: 'Fio 2.5mm, tomada 10A' },
    { id: 102, prestador: 'Pintor João', service: 'Pintura de Quarto', value: 'R$ 400,00', date: '2024-07-14', estimatedTime: 8, description: 'Proposta para pintura completa do quarto, duas demãos.', materials: 'Tinta Suvinil Branca' }
];
let orcamentosUsuarioAprovados = [];
let orcamentosUsuarioRecusados = [];
let orcamentosUsuarioVisitas = [];

let orcamentosPrestadorRecebidos = [
    { id: 201, title: 'Reparo de Vazamento', description: 'Vazamento pequeno na pia do banheiro.', client: 'Maria Oliveira', address: 'Av. Principal, 789', date: '2024-07-16', photos: [], video: '' },
    { id: 202, title: 'Limpeza de Jardim', description: 'Corte de grama e poda de arbustos.', client: 'Carlos Souza', address: 'Rua da Flores, 101', date: '2024-07-16', photos: ['https://placehold.co/100x100/00FF00/FFFFFF?text=Jardim'], video: '' }
];
let orcamentosPrestadorPropostasEnviadas = [];
let orcamentosPrestadorAprovados = [];
let orcamentosPrestadorRecusados = [];

let userOccurrences = [];
let providerOccurrences = [];

let currentFinalizeServiceId = null;
let currentChatPartner = '';
let currentRefusalRequestId = null; // Para prestador
let currentUserRefusalBudgetId = null; // Para usuário
let currentScheduleBudgetId = null; // Para agendamento

let totalRecebimentos = 0;
let aLiberar = 0;
let bankAccounts = []; // Array para armazenar contas bancárias

// Dados de exemplo de anúncios
const userAds = [
    "Descubra as melhores ofertas de material de construção!",
    "Precisa de um empréstimo rápido? Clique aqui!",
    "Cursos online para aprimorar suas habilidades!"
];
const prestadorAds = [
    "Aumente sua clientela com nosso plano de marketing!",
    "Ferramentas com 30% de desconto para prestadores!",
    "Seguro de responsabilidade civil para o seu negócio!"
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
    { id: 6, name: "Pedreiro para Pequenas Reformas", description: "Pequenos reparos e construções.", type: "pedreiro" }
];

// Dados de exemplo de serviços de visita patrocinados
const sponsoredVisitServices = [
    { id: 1, name: "Construtora Alfa", description: "Grandes reformas e construções, com visita técnica.", type: "construcao", profile: { photos: ['https://placehold.co/150x100/FF0000/FFFFFF?text=Obra1', 'https://placehold.co/150x100/0000FF/FFFFFF?text=Obra2'], bio: 'Empresa com 10 anos de experiência em construção civil.' } },
    { id: 2, name: "Arquiteto Urbano", description: "Projetos arquitetônicos e design de interiores.", type: "arquitetura", profile: { photos: ['https://placehold.co/150x100/00FF00/FFFFFF?text=Projeto1', 'https://placehold.co/150x100/FFFF00/000000?text=Projeto2'], bio: 'Criação de espaços funcionais e esteticamente agradáveis.' } },
    { id: 3, name: "Engenharia Estrutural Beta", description: "Cálculos estruturais e laudos técnicos.", type: "engenharia", profile: { photos: [], bio: 'Segurança e inovação em projetos de engenharia.' } }
];

// --- FUNÇÃO DE ALERTA PERSONALIZADA ---
function showAlert(message, title = 'Aviso') {
    document.getElementById('custom-alert-title').textContent = title;
    document.getElementById('custom-alert-message').textContent = message;
    document.getElementById('custom-alert-modal').style.display = 'flex';
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
        if (screenId === 'splash' || screenId === 'login-screen-v2') {
            appHeader.style.display = 'none';
        } else {
            appHeader.style.display = 'flex';
        }
    }

    // Adiciona ou remove a classe 'app-active' do body
    if (screenId === 'splash' || screenId === 'login-screen-v2') {
        document.body.classList.remove('app-active');
    } else {
        document.body.classList.add('app-active');
    }

    // Esconde todos os conteúdos principais primeiro
    const mainContentWrapper = document.querySelector('.main-content-wrapper');
    if (mainContentWrapper) {
        if (screenId === 'splash' || screenId === 'login-screen-v2') {
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
            if (screenId === 'dashboard-usuario') {
                headerTitleElement.textContent = 'Dashboard do Usuário';
            } else if (screenId === 'dashboard-prestador') {
                headerTitleElement.textContent = 'Dashboard do Prestador';
            } else if (screenId === 'orcamentos-usuario') {
                headerTitleElement.textContent = 'Minhas Solicitações e Retornos';
            } else if (screenId === 'orcamentos-prestador') {
                headerTitleElement.textContent = 'Orçamentos';
            } else if (screenId === 'servicos-ativos') {
                headerTitleElement.textContent = 'Serviços Ativos';
            } else if (screenId === 'servicos-contratados') {
                headerTitleElement.textContent = 'Serviços Contratados';
            } else if (screenId === 'ocorrencias-usuario' || screenId === 'ocorrencias-prestador') {
                headerTitleElement.textContent = 'Minhas Ocorrências';
            } else if (screenId === 'abrir-ocorrencia') {
                headerTitleElement.textContent = 'Abrir Ocorrência';
            } else if (screenId === 'buscar-servicos-unificado') { // Novo ID de tela unificada
                headerTitleElement.textContent = 'Buscar Serviços e Orçamentos';
            } else if (screenId === 'solicitacao-orcamento') {
                headerTitleElement.textContent = 'Solicitar Orçamento'; // Renomeado
            } else if (screenId === 'cadastro-especialidades') {
                headerTitleElement.textContent = 'Cadastro de Especialidades';
            } else if (screenId === 'servicos-historico') {
                headerTitleElement.textContent = 'Histórico de Serviços';
            } else if (screenId === 'financeiro') {
                headerTitleElement.textContent = 'Financeiro';
            } else if (screenId === 'ajuda') {
                headerTitleElement.textContent = 'Ajuda e Suporte';
            } else if (screenId === 'fluxo-servico-detalhes') {
                headerTitleElement.textContent = 'Fluxo de Serviço';
            } else if (screenId === 'anunciantes') {
                headerTitleElement.textContent = 'Anunciantes';
            } else {
                headerTitleElement.textContent = title; // Título genérico se não for um dos acima
            }
        }
    }

    // Gerencia o histórico de telas
    if (screenId !== currentScreen && screenId !== 'splash' && screenId !== 'login-screen-v2') { // Não adiciona splash ou login ao histórico
        screenHistory.push(currentScreen);
    }
    currentScreen = screenId;

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

    if (screenId.startsWith('orcamentos-usuario')) {
        renderOrcamentosUsuarioSolicitados();
        renderOrcamentosUsuarioRecebidos();
        renderOrcamentosUsuarioAprovados();
        renderOrcamentosUsuarioRecusados();
        renderOrcamentosUsuarioVisitas();
        updateUserBudgetCounts(); // Atualiza os contadores das abas
        showTab('orcamentos-usuario', 'solicitados'); // Garante que a primeira aba esteja ativa
    } else if (screenId.startsWith('orcamentos-prestador')) {
        renderOrcamentosPrestadorRecebidos();
        renderOrcamentosPrestadorPropostasEnviadas();
        renderOrcamentosPrestadorAprovados();
        renderOrcamentosPrestadorRecusados();
        updatePrestadorBudgetCounts(); // Atualiza os contadores das abas
        showTab('orcamentos-prestador', 'recebidos'); // Garante que a primeira aba esteja ativa
    } else if (screenId === 'servicos-historico') {
        renderServicosHistoricoFinalizados();
        renderServicosHistoricoRecusados();
        updateServicosHistoricoCounts(); // Atualiza os contadores das abas
        showTab('servicos-historico', 'finalizados');
    } else if (screenId === 'ocorrencias-usuario') {
        renderUserOccurrences();
    } else if (screenId === 'ocorrencias-prestador') {
        renderProviderOccurrences();
    } else if (screenId === 'buscar-servicos-unificado') { // Lógica para a nova tela unificada
        showTab('buscar-servicos-unificado', 'padrao'); // Ativa a aba padrão por default
    } else if (screenId === 'financeiro') {
        updateFinanceiroDashboard();
        renderBankAccounts();
    }
}

function goBack() {
    if (screenHistory.length > 0) {
        const prevScreenId = screenHistory.pop();
        showScreen(prevScreenId);
    } else {
        // Se não há histórico, volta para a tela de login
        logout();
    }
}

// Função para navegar para a tela inicial (dashboard do usuário ou prestador)
function goToHome() {
    screenHistory = []; // Limpa o histórico para garantir que o "Voltar" funcione corretamente a partir da home
    if (currentUserType === 'usuario') {
        showScreen('dashboard-usuario');
    } else if (currentUserType === 'prestador') {
        showScreen('dashboard-prestador');
    } else {
        // Se o tipo de usuário não estiver definido, volta para a tela de login
        showLoginScreenV2();
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
    switchTab('access'); // Ativa a aba "Acessar"
    updateFormVisibility(); // Garante que o formulário correto (cliente social) seja exibido
}

// Função para alternar entre as abas Acessar/Cadastrar na tela de login V2
function switchTab(activeTabId) {
    document.querySelectorAll('.auth-tabs .tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('#login-screen-v2 .form-section').forEach(section => section.classList.remove('active'));

    const progressBarFill = document.querySelector('.progress-bar-fill');
    if (activeTabId === 'access') {
        document.getElementById('access-tab').classList.add('active');
        document.getElementById('access-section').classList.add('active');
        if (progressBarFill) progressBarFill.style.width = '50%';
    } else if (activeTabId === 'register') {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('register-section').classList.add('active');
        if (progressBarFill) progressBarFill.style.width = '100%';
    }
    updateFormVisibility(); // Atualiza a visibilidade dos formulários internos
}

// Função para controlar a visibilidade dos formulários de acordo com o tipo de usuário e a aba ativa
function updateFormVisibility() {
    const isAccessTabActive = document.getElementById('access-tab').classList.contains('active');
    const isClientSelected = document.getElementById('select-user-client').checked;

    // Oculta todos os formulários primeiro
    document.getElementById('client-access-form').style.display = 'none';
    document.getElementById('provider-access-form').style.display = 'none';
    document.getElementById('client-register-form').style.display = 'none';
    document.getElementById('provider-register-form').style.display = 'none';

    if (isAccessTabActive) {
        if (isClientSelected) {
            document.getElementById('client-access-form').style.display = 'flex';
        } else {
            document.getElementById('provider-access-form').style.display = 'flex';
        }
    } else { // Aba "Cadastrar"
        if (isClientSelected) {
            document.getElementById('client-register-form').style.display = 'flex';
        } else {
            document.getElementById('provider-register-form').style.display = 'flex';
        }
    }
}


function performLoginV2(event) {
    const isClientSelected = document.getElementById('select-user-client').checked;
    const clickedButtonId = event.target.id; // Get the ID of the clicked button

    if (isClientSelected) {
        // Client login
        if (clickedButtonId === 'client-login-button-v2') {
            // Email/password login for client
            const email = document.getElementById('client-email-login').value;
            const password = document.getElementById('client-password-login').value;

            if (email === 'cliente@email.com' && password === '123') { // Example credentials for client
                currentUserType = 'usuario';
                document.getElementById('login-screen-v2').style.display = 'none';
                document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
                document.body.classList.add('app-active');
                showScreen('dashboard-usuario');
            } else {
                showAlert('E-mail ou senha incorretos para Usuário. Tente novamente.');
            }
        } else {
            // Social login for client (Google, Facebook, Apple)
            showAlert('Simulando login de Cliente via social. Você será redirecionado para a dashboard de usuário.');
            currentUserType = 'usuario';
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-usuario');
        }
    } else {
        // Provider login with email/password
        const email = document.getElementById('provider-email-login').value;
        const password = document.getElementById('provider-password-login').value;

        if (email === 'prestador@email.com' && password === '123') {
            currentUserType = 'prestador';
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-prestador');
        } else {
            showAlert('E-mail ou senha incorretos para Prestador. Tente novamente.');
        }
    }
}

// Função de registro (adaptada para a nova tela de login)
function registerUserV2() {
    const isClientSelected = document.getElementById('select-user-client').checked;

    if (isClientSelected) {
        const clientEmail = document.getElementById('client-email-register').value;
        if (clientEmail) {
            showAlert(`Usuário (Cliente) registrado com e-mail: ${clientEmail}. Você será redirecionado para a dashboard de usuário.`);
            currentUserType = 'usuario';
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-usuario');
        } else {
            showAlert('Por favor, insira um e-mail para o cadastro do Usuário.');
        }
    } else {
        const providerName = document.getElementById('provider-name-register').value;
        const providerEmail = document.getElementById('provider-email-register').value;
        const providerPassword = document.getElementById('provider-password-register').value;

        if (providerName && providerEmail && providerPassword) {
            showAlert(`Prestador registrado: ${providerName} (${providerEmail}). Você será redirecionado para a dashboard de prestador.`);
            currentUserType = 'prestador';
            document.getElementById('login-screen-v2').style.display = 'none';
            document.querySelector('.main-content-wrapper').style.display = 'flex'; // Alterado para flex
            document.body.classList.add('app-active');
            showScreen('dashboard-prestador');
        } else {
            showAlert('Por favor, preencha todos os campos para o cadastro do Prestador.');
        }
    }
}


function logout() {
    // Usando o modal de alerta personalizado para a confirmação de saída
    const confirmLogout = confirm('Tem certeza que deseja sair?'); // Manter o confirm nativo para esta ação crítica
    if (confirmLogout) {
        currentUserType = null;
        screenHistory = []; // Limpa o histórico de telas
        document.querySelector('.main-content-wrapper').style.display = 'none'; // Esconde o wrapper principal
        document.getElementById('app-header').style.display = 'none'; // Esconde o cabeçalho
        document.body.classList.remove('app-active'); // Remove a classe para centralizar o login
        showLoginScreenV2(); // Volta para a tela de login V2
    }
}


// Funções de Dashboard e Conteúdo
function updateUserDashboardCounts() {
    document.getElementById('orcamentos-usuario-solicitados-count-dashboard').textContent = orcamentosUsuarioSolicitados.length;
    document.getElementById('orcamentos-usuario-recebidos-count-dashboard').textContent = orcamentosUsuarioRecebidos.length;
    document.getElementById('orcamentos-usuario-aprovados-count-dashboard').textContent = orcamentosUsuarioAprovados.length;
    document.getElementById('orcamentos-usuario-recusados-count-dashboard').textContent = orcamentosUsuarioRecusados.length;
    document.getElementById('orcamentos-usuario-visitas-count-dashboard').textContent = orcamentosUsuarioVisitas.length;
    document.getElementById('ocorrencias-usuario-count-dashboard').textContent = userOccurrences.length;
}

function updatePrestadorDashboardCounts() {
    document.getElementById('servicos-ativos-count-dashboard').textContent = servicosAtivosCount;
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
    document.getElementById('orcamentos-usuario-aprovados-count-tab').textContent = orcamentosUsuarioAprovados.length;
    document.getElementById('orcamentos-usuario-recusados-count-tab').textContent = orcamentosUsuarioRecusados.length;
    document.getElementById('orcamentos-usuario-visitas-count-tab').textContent = orcamentosUsuarioVisitas.length;
}

function updatePrestadorBudgetCounts() {
    document.getElementById('orcamentos-prestador-recebidos-count-tab').textContent = orcamentosPrestadorRecebidos.length;
    document.getElementById('orcamentos-prestador-propostas-enviadas-count-tab').textContent = orcamentosPrestadorPropostasEnviadas.length;
    document.getElementById('orcamentos-prestador-aprovados-count-tab').textContent = orcamentosPrestadorAprovados.length;
    document.getElementById('orcamentos-prestador-recusados-count-tab').textContent = orcamentosPrestadorRecusados.length;
}

function updateServicosHistoricoCounts() {
    document.getElementById('servicos-finalizados-count-tab').textContent = servicosHistoricoCount;
    document.getElementById('servicos-recusados-count-tab').textContent = orcamentosPrestadorRecusados.length; // Reutilizando para exemplo
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
                prestadorAdContent.textContent = prestadorAds[currentAdIndexPrestador];
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
function renderOrcamentosUsuarioSolicitados() {
    const container = document.getElementById('orcamentos-usuario-solicitados-content');
    container.innerHTML = '';
    if (orcamentosUsuarioSolicitados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento solicitado ainda.</p>';
        return;
    }
    orcamentosUsuarioSolicitados.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${req.title}</h3>
                <div class="status aguardando">Aguardando Propostas</div>
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

function renderOrcamentosUsuarioRecebidos() {
    const container = document.getElementById('orcamentos-usuario-recebidos-content');
    container.innerHTML = '';
    if (orcamentosUsuarioRecebidos.length === 0) {
        container.innerHTML = '<p>Nenhuma proposta de orçamento recebida ainda.</p>';
        return;
    }
    orcamentosUsuarioRecebidos.forEach(budget => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${budget.service} - ${budget.value}</h3>
                <div class="status em-analise">Em Análise</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Prestador: ${budget.prestador}</p>
                <p><i class="fas fa-calendar-alt"></i> Proposta em: ${budget.date}</p>
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

function renderOrcamentosUsuarioAprovados() {
    const container = document.getElementById('orcamentos-usuario-aprovados-content');
    container.innerHTML = '';
    if (orcamentosUsuarioAprovados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento aprovado ainda.</p>';
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
    container.innerHTML = '';
    if (orcamentosUsuarioRecusados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento recusado ainda.</p>';
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
    container.innerHTML = '';
    if (orcamentosUsuarioVisitas.length === 0) {
        container.innerHTML = '<p>Nenhuma visita agendada ou solicitada ainda.</p>';
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


// Funções de Orçamentos (Prestador)
function renderOrcamentosPrestadorRecebidos() {
    const container = document.getElementById('orcamentos-prestador-recebidos-content');
    container.innerHTML = '';
    if (orcamentosPrestadorRecebidos.length === 0) {
        container.innerHTML = '<p>Nenhuma nova solicitação de orçamento aguardando.</p>';
        return;
    }
    orcamentosPrestadorRecebidos.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-header">
                <h3>${req.title}</h3>
                <div class="status aguardando">Nova Solicitação</div>
            </div>
            <div class="info">
                <p><i class="fas fa-user"></i> Cliente: ${req.client}</p>
                <p><i class="fas fa-map-marker-alt"></i> Endereço: ${req.address}</p>
                <p><i class="fas fa-calendar-alt"></i> Data: ${req.date}</p>
            </div>
            <div class="actions">
                <button class="btn" onclick="openRequestDetailsModal(${req.id}, 'recebido')"><i class="fas fa-info-circle"></i> Ver Detalhes</button>
                <button class="btn" style="background-color: #28a745;" onclick="openProposalFormModal(${req.id})"><i class="fas fa-paper-plane"></i> Enviar Proposta</button>
                <button class="btn btn-finalizar" onclick="openRefusalReasonModal(${req.id})"><i class="fas fa-times"></i> Recusar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOrcamentosPrestadorPropostasEnviadas() {
    const container = document.getElementById('orcamentos-prestador-propostas-enviadas-content');
    container.innerHTML = '';
    if (orcamentosPrestadorPropostasEnviadas.length === 0) {
        container.innerHTML = '<p>Nenhuma proposta enviada ainda.</p>';
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
    container.innerHTML = '';
    if (orcamentosPrestadorAprovados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento aprovado por clientes ainda.</p>';
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
    const container = document.getElementById('orcamentos-prestador-recusados-content');
    container.innerHTML = '';
    if (orcamentosPrestadorRecusados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento recusado por você ainda.</p>';
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


// Funções de Serviços Ativos (para Prestador)
let serviceStatuses = {
    1: { status: 'Aguardando Início', alert: false },
    2: { status: 'Em Andamento', alert: false },
    3: { status: 'Aguardando Confirmação', alert: true }
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
function openChat(partnerName) {
    currentChatPartner = partnerName;
    document.getElementById('chat-header-title').textContent = `Chat com ${partnerName}`;
    document.getElementById('chat-modal').style.display = 'flex';
    // Limpar e carregar mensagens do chat (simulado)
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = `
        <div class="message received">Olá! Como posso ajudar?</div>
        <div class="message sent">Olá ${partnerName}! Preciso de uma atualização sobre o serviço.</div>
    `;
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
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight; // Rola para o final
    }
}

// Funções de Ocorrências
function renderUserOccurrences() {
    const container = document.getElementById('ocorrencias-usuario');
    container.innerHTML = '<div class="section-header"><h2>Minhas Ocorrências</h2><button class="btn primary-btn" onclick="showScreen(\'abrir-ocorrencia\')"><i class="fas fa-plus-circle"></i> Abrir Nova Ocorrência</button></div>'; // Mantém o título
    if (userOccurrences.length === 0) {
        container.innerHTML += '<p>Nenhuma ocorrência registrada ainda.</p>';
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
    container.innerHTML = '<div class="section-header"><h2>Ocorrências para Meus Serviços</h2></div>'; // Mantém o título
    if (providerOccurrences.length === 0) {
        container.innerHTML += '<p>Nenhuma ocorrência registrada para seus serviços ainda.</p>';
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
    const attachments = document.getElementById('ocorrencia-anexos').files;

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
        client: 'Usuário Atual', // Simulação
        prestador: 'Prestador do Serviço', // Simulação
        attachments: Array.from(attachments).map(file => URL.createObjectURL(file)), // Salva URLs temporárias
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
        msgDiv.classList.add('message', msg.sender === 'Plataforma' ? 'platform-highlight' : (msg.sender === 'Eu' ? 'sent' : 'received'));
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
    container.innerHTML = '';
    const filteredServices = sponsoredServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.type.toLowerCase().includes(searchTerm)
    );

    if (filteredServices.length === 0) {
        container.innerHTML = '<p>Nenhum serviço encontrado para sua busca.</p>';
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
    container.innerHTML = '';
    const filteredServices = sponsoredVisitServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.type.toLowerCase().includes(searchTerm)
    );

    if (filteredServices.length === 0) {
        container.innerHTML = '<p>Nenhum profissional encontrado para sua busca.</p>';
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
    const photosInput = document.getElementById('orcamento-fotos');
    const videoInput = document.getElementById('orcamento-video');

    if (!title || !description) {
        showAlert('Por favor, preencha o título e a descrição do serviço.');
        return;
    }

    const photos = Array.from(photosInput.files).map(file => URL.createObjectURL(file));
    const video = videoInput.files.length > 0 ? URL.createObjectURL(videoInput.files[0]) : '';

    const newRequestId = orcamentosUsuarioSolicitados.length > 0 ? Math.max(...orcamentosUsuarioSolicitados.map(o => o.id)) + 1 : 1;

    const newRequest = {
        id: newRequestId,
        title: title,
        description: description,
        client: 'Usuário Atual', // Simulação
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
    photosInput.value = '';
    videoInput.value = '';

    updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
    updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
    showScreen('orcamentos-usuario'); // Volta para a tela de orçamentos do usuário
    showTab('orcamentos-usuario', 'solicitados'); // Garante que a aba de solicitados esteja ativa
}


// Funções de Histórico de Serviços (Prestador)
function renderServicosHistoricoFinalizados() {
    const container = document.getElementById('servicos-historico-finalizados-content');
    container.innerHTML = '';
    if (servicosHistoricoCount === 0) { // Usando a variável de contagem simulada
        container.innerHTML = '<p>Nenhum serviço finalizado ainda.</p>';
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
    container.innerHTML = '';
    if (orcamentosPrestadorRecusados.length === 0) {
        container.innerHTML = '<p>Nenhum serviço recusado ainda.</p>';
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
    formContainer.style.display = 'block';
    document.getElementById('cancel-bank-details-edit-btn').style.display = 'inline-flex';
}

function clearBankDetailsForm() {
    document.getElementById('banco').value = '';
    document.getElementById('agencia').value = '';
    document.getElementById('conta').value = '';
    document.getElementById('tipo-conta').value = 'corrente';
    document.getElementById('bank-details-form-container').style.display = 'none';
    document.getElementById('cancel-bank-details-edit-btn').style.display = 'none';
}

function renderBankAccounts() {
    const container = document.getElementById('bank-accounts-container');
    container.innerHTML = '';
    if (bankAccounts.length === 0) {
        document.getElementById('no-bank-accounts-message').style.display = 'block';
        return;
    }
    document.getElementById('no-bank-accounts-message').style.display = 'none';
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
    const confirmDelete = confirm('Tem certeza que deseja excluir esta conta bancária?'); // Manter o confirm nativo para esta ação crítica
    if (confirmDelete) {
        bankAccounts.splice(index, 1);
        renderBankAccounts();
        showAlert('Conta bancária excluída.');
    }
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

    document.getElementById('start-simulation-btn').style.display = currentSimulationStep === 0 ? 'inline-flex' : 'none';
    document.getElementById('next-step-btn').style.display = currentSimulationStep < simulationSteps.length ? 'inline-flex' : 'none';
    document.getElementById('reset-simulation-btn').style.display = currentSimulationStep > 0 ? 'inline-flex' : 'none';

    if (currentSimulationStep >= simulationSteps.length) {
        document.getElementById('next-step-btn').style.display = 'none';
        showAlert('Simulação concluída!');
    }
}

function startSimulation() {
    currentSimulationStep = 1;
    updateSimulationDisplay();
}

function nextSimulationStep() {
    if (currentSimulationStep < simulationSteps) { // Changed to < simulationSteps.length
        currentSimulationStep++;
        updateSimulationDisplay();
    }
}

function resetSimulation() {
    currentSimulationStep = 0;
    updateSimulationDisplay();
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

        showAlert(`Orçamento #${budgetId} aprovado e sugestões de agendamento enviadas!`);
        updateUserDashboardCounts(); // Atualiza o contador do dashboard do usuário
        updateUserBudgetCounts(); // Atualiza o contador da aba de orçamentos do usuário
        updatePrestadorDashboardCounts(); // Atualiza o contador do dashboard do prestador
        updatePrestadorBudgetCounts(); // Atualiza o contador da aba de orçamentos do prestador
        renderOrcamentosUsuarioRecebidos();
        renderOrcamentosUsuarioAprovados();
        renderOrcamentosPrestadorAprovados();
        closeModal('schedule-proposal-modal');
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

    document.getElementById('request-visit-from-profile-btn').onclick = () => openRequestVisitScheduleModal(prestador.name);
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
    showTab('orcamentos-usuario', 'visitas'); // Ativa a aba de visitas
}


// Funções de Abas (tabs)
function showTab(screenPrefix, tabId) {
    // Esconde todos os conteúdos de abas para a tela atual
    document.querySelectorAll(`#${screenPrefix} .tab-content`).forEach(content => {
        content.classList.remove('active');
    });
    // Remove a classe 'active' de todas as abas
    document.querySelectorAll(`#${screenPrefix} .tab`).forEach(tab => {
        tab.classList.remove('active');
    });

    // Ativa a aba e o conteúdo selecionados
    document.getElementById(`tab-${screenPrefix}-${tabId}`).classList.add('active');
    document.getElementById(`${screenPrefix}-${tabId}-content`).classList.add('active');

    // Renderiza o conteúdo da aba se necessário
    if (screenPrefix === 'orcamentos-usuario') {
        if (tabId === 'solicitados') renderOrcamentosUsuarioSolicitados();
        else if (tabId === 'recebidos') renderOrcamentosUsuarioRecebidos();
        else if (tabId === 'aprovados') renderOrcamentosUsuarioAprovados();
        else if (tabId === 'recusados') renderOrcamentosUsuarioRecusados();
        else if (tabId === 'visitas') renderOrcamentosUsuarioVisitas();
        updateUserBudgetCounts(); // Garante que os contadores das abas sejam atualizados ao trocar
    } else if (screenPrefix === 'orcamentos-prestador') {
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
    }
}

// Função para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para alternar o menu lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}


// Event Listeners (DOM Content Loaded)
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a exibição da tela de splash, que depois transiciona para o login V2
    showScreen('splash');

    // Transição da Splash para a nova Tela de Login
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                showLoginScreenV2(); // Exibe a nova tela de login
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

    const registerUserBtn = document.getElementById('register-user-btn');
    if (registerUserBtn) {
        registerUserBtn.addEventListener('click', registerUserV2);
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
        radio.addEventListener('change', updateFormVisibility);
    });

    // Listeners para as abas Acessar/Cadastrar
    const accessTab = document.getElementById('access-tab');
    const registerTab = document.getElementById('register-tab');
    if (accessTab) accessTab.addEventListener('click', () => switchTab('access'));
    if (registerTab) registerTab.addEventListener('click', () => switchTab('register'));

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

    // Inicializa a simulação do fluxo de serviço
    updateSimulationDisplay();


    // Configurações iniciais do usuário/prestador para o menu
    // O tipo de usuário é definido no login (simulado)
    // Para testes, você pode definir manualmente aqui para ver o menu
    // currentUserType = 'usuario'; // Descomente para testar como usuário
    // currentUserType = 'prestador'; // Descomente para testar como prestador

    // Atualiza os contadores iniciais com base no tipo de usuário padrão (ou após login)
    if (currentUserType === 'usuario') {
        document.getElementById('sidebar-username').textContent = 'Usuário Cliente';
        document.getElementById('sidebar-usertype').textContent = 'Tipo: Cliente';
        document.getElementById('menu-item-orcamentos-usuario').style.display = 'list-item';
        document.getElementById('menu-item-servicos-contratados').style.display = 'list-item';
        document.getElementById('menu-item-ocorrencias-usuario').style.display = 'list-item';
        document.getElementById('menu-item-buscar-servicos').style.display = 'list-item';
        updateUserDashboardCounts();
        updateUserBudgetCounts();
    } else if (currentUserType === 'prestador') {
        document.getElementById('sidebar-username').textContent = 'Prestador Exemplo';
        document.getElementById('sidebar-usertype').textContent = 'Tipo: Prestador';
        document.getElementById('menu-item-servicos-ativos').style.display = 'list-item';
        document.getElementById('menu-item-orcamentos-prestador').style.display = 'list-item';
        document.getElementById('menu-item-ocorrencias-prestador').style.display = 'list-item';
        document.getElementById('menu-item-cadastro-especialidades').style.display = 'list-item';
        document.getElementById('menu-item-servicos-historico').style.display = 'list-item';
        document.getElementById('menu-item-financeiro').style.display = 'list-item';
        updatePrestadorDashboardCounts();
        updatePrestadorBudgetCounts();
        updateServicosHistoricoCounts();
    }
});

// Alterna os campos PF/PJ no cadastro do prestador
function togglePrestadorFields() {
  const tipo = document.querySelector('input[name="tipo-prestador"]:checked').value;
  document.getElementById('campos-pf').style.display = (tipo === 'pf') ? 'block' : 'none';
  document.getElementById('campos-pj').style.display = (tipo === 'pj') ? 'block' : 'none';
}
document.addEventListener('DOMContentLoaded', togglePrestadorFields);
