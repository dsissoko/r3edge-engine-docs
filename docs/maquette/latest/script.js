// Fonction pour charger le contenu HTML dans main-content
function loadContent(file) {
    console.log("Chargement du fichier :", file); // Vérification

    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById("main-content").innerHTML = data;

            // Met à jour le breadcrumb avec le nom du fichier sans extension
            const sectionName = file.replace('.html', '').replace(/([A-Z])/g, ' $1').trim();
            document.getElementById("breadcrumb").innerHTML = `<p>${sectionName}</p>`;
        })
        .catch(error => console.error('Erreur de chargement du contenu:', error));
}

// Fonction pour basculer le menu
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const container = document.getElementById('container');
    
    sidebar.classList.toggle('collapsed');
    container.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : '250px';
}
