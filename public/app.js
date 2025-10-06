document.addEventListener('DOMContentLoaded', () => {
  const cartasContainer = document.getElementById('cartas-container');
  const filtroForm = document.getElementById('filtro-form');
  let todasAsCartas = [];

  async function inicializar() {
    try {
      const resposta = await fetch('data.json');
      if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
      }
      const dados = await resposta.json();
      todasAsCartas = dados.cards;
      carregarCartas(todasAsCartas);
    } catch (erro) {
      console.error('Erro ao carregar os dados das cartas:', erro);
      cartasContainer.innerHTML = '<p style="color: red;">Não foi possível carregar as cartas. Verifique o console para mais detalhes.</p>';
    }
  }

  function getCardImageUrl(card) {
    const ptbrTranslation = card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
    if (ptbrTranslation && ptbrTranslation.imageUrl) return ptbrTranslation.imageUrl;
    if (card.imageUrl) return card.imageUrl;
    if (card.multiverseid) return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    return null;
  }

  function carregarCartas(cartasParaExibir ) {
    cartasContainer.innerHTML = '';

    cartasParaExibir.forEach(card => {
      const imageUrl = getCardImageUrl(card);
      
      if (imageUrl) {
        const cardName = card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)")?.name || card.name;
        
        // 1. Mantemos o <article> como era antes
        const cartaElemento = document.createElement('article');
        cartaElemento.className = 'carta';
        cartaElemento.innerHTML = `<img src="${imageUrl}" alt="${cardName}">`;
        
        // 2. Adicionamos um "ouvinte" de evento de clique
        cartaElemento.addEventListener('click', () => {
          // 3. Ao clicar, redirecionamos para a página de detalhes com o ID correto
          window.location.href = `detalhes.html?id=${card.id}`;
        });
        
        cartasContainer.appendChild(cartaElemento);
      }
    });
  }

  filtroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Busca acionada! (Lógica de filtro a ser implementada)');
    alert('Funcionalidade de filtro ainda não implementada.');
  });

  inicializar();
});
