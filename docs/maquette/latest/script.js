// Contenu correspondant à chaque section
const contentMap = {
    tableauDeBord: {
        title: "Tableau de Bord",
        description: "Vue d'ensemble des performances de trading avec accès rapide aux sessions actives ou historiques."
    },
    marche: {
        title: "Ciblage des Marchés",
        description: "Sélectionner les instruments financiers pour initier une session de trading. Affiche les indicateurs de marché, filtres de recherche, et graphiques de tendances."
    },
    sessions: {
        title: "Gestion des Sessions",
        description: "Options de gestion des sessions : liste des sessions en cours, nouvelle session, et historique des sessions terminées."
    },
    strategies: {
        title: "Présentation des Stratégies",
        description: "Permet au trader de consulter et analyser les stratégies disponibles pour optimiser sa performance."
    },
    social: {
        title: "Écran Social",
        description: "Consulter les informations de sessions partagées anonymement avec des insights clés pour les utilisateurs."
    }
};

// Fonction pour mettre à jour le contenu principal en fonction de l'entrée de menu cliquée
function updateMainContent(section) {
    const content = contentMap[section];
    const mainContent = document.getElementById("main-content");

    // Mettre à jour le titre et la description dans le main content
    mainContent.innerHTML = `<h2>${content.title}</h2><p>${content.description}</p>`;

    // Mettre à jour le breadcrumb pour commencer par le nom de l'entrée de menu
    document.getElementById("breadcrumb").innerHTML = `<p>${content.title}</p>`;
}

// Fonction pour basculer le menu
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const container = document.getElementById('container');
    
    sidebar.classList.toggle('collapsed');
    container.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : '250px';
}
