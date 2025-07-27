// Variável global para rastrear a tela ativa
let activeScreenId = null; // Ou 'client' se a tela inicial padrão for a do cliente.
let nomeDoClienteLogado = "Visitante"; // Variável global para o nome do cliente logado
let currentUserType = null; // Adicionado para rastrear o tipo de usuário logado
let screenHistory = []; // Histórico de telas para o botão Voltar
let servicosHistoricoCount = 2; // Simulação de serviços finalizados para o histórico

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
    } else if (currentUserType === 'prestador') {
        showScreen('dashboard-prestador');
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
    const container = document.getElementById('orcamentos-prestador-recusados-content');
    if (!container) return;
    container.innerHTML = '';
    if (orcamentosPrestadorRecusados.length === 0) {
        container.innerHTML = '<p class="no-content-message">Nenhum orçamento recusado por você ainda.</p>';
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

    document.getElementById('start-simulation-btn').style.display = currentSimulationStep ===  0 ? 'inline-flex' : 'none';
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
    if (currentSimulationStep < simulationSteps.length) { // Corrigido para .length
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
    const confirmBtn = document.getElementById('confirm-visit-proposal-btn');
    
    // Remove listeners anteriores para evitar duplicação
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Adiciona o listener para confirmar
    newConfirmBtn.onclick = function() {
        closeModal('visit-fee-warning-modal');
        openProposalForm(request);
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
    
    // Comportamento consistente: apenas alterna a classe active
    sidebar.classList.toggle('active');
    
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

    // Inicializa a simulação do fluxo de serviço
    updateSimulationDisplay();

    // Chama a função para atualizar o menu lateral e os contadores assim que o DOM é carregado
    // Isso garante que, se o usuário já estiver "logado" (simulado), o menu e dashboard sejam corretos
    updateSidebarMenu();
    document.getElementById('dashboard-client-name').textContent = nomeDoClienteLogado;
    
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
