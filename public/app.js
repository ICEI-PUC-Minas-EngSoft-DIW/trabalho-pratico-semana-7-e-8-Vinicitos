document.addEventListener('DOMContentLoaded', () => {
  const cartasContainer = document.getElementById('cartas-container');
  const filtroForm = document.getElementById('filtro-form');
  const carrosselSlider = document.getElementById('carrossel-slider');
  const btnRandom = document.getElementById('btn-random');

  let todasAsCartas = [];

  async function inicializar() {
    try {
      const resposta = await fetch('data.json');
      if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);
      const dados = await resposta.json();
      todasAsCartas = dados.cards;

      carregarCartas(todasAsCartas);
      configurarCarrossel();
      configurarBotaoAleatorio();
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  }

  function carregarCartas(cartasParaExibir) {
    cartasContainer.innerHTML = '';
    cartasParaExibir.forEach(card => {
      const imageUrl = getCardImageUrl(card);
      if (imageUrl) {
        const cardName = getCardName(card);
        const col = document.createElement('div');
        col.className = 'col';
        
        col.innerHTML = `
          <div class="card h-100 shadow-sm" style="cursor: pointer;">
            <img src="${imageUrl}" class="card-img-top" alt="${cardName}">
          </div>
        `;
        
        // CORREÇÃO AQUI: Usando multiverseid em vez de id
        col.querySelector('.card').addEventListener('click', () => {
          if (card.multiverseid) {
            window.location.href = `detalhes.html?multiverseid=${card.multiverseid}`;
          }
        });

        cartasContainer.appendChild(col);
      }
    });
  }

  function configurarCarrossel() {
    const destaques = todasAsCartas.filter(c => (c.rarity === 'Rare' || c.rarity === 'Mythic') && c.multiverseid).slice(0, 3);
    if (destaques.length === 0) {
        document.getElementById('carrosselDestaques').style.display = 'none';
        return;
    }

    carrosselSlider.innerHTML = destaques.map((card, index) => {
        const imageUrl = getCardImageUrl(card);
        const nome = getCardName(card);
        const texto = getCardText(card);
        const activeClass = index === 0 ? 'active' : '';

        return `
            <div class="carousel-item ${activeClass}">
                <div class="d-flex p-5 bg-white rounded slide-content">
                    <img src="${imageUrl}" class="d-block me-4 slide-imagem" alt="${nome}">
                    <div>
                        <h3>${nome}</h3>
                        <p>${texto ? texto.split('\n')[0] : 'Clique para ver mais detalhes.'}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
  }

  function configurarBotaoAleatorio() {
    btnRandom.addEventListener('click', () => {
      const cartasComId = todasAsCartas.filter(c => c.multiverseid);
      if (cartasComId.length > 0) {
        const cartaAleatoria = cartasComId[Math.floor(Math.random() * cartasComId.length)];
        window.location.href = `detalhes.html?multiverseid=${cartaAleatoria.multiverseid}`;
      }
    });
  }

  function getCardImageUrl(card) {
    const ptbr = card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)");
    if (ptbr && ptbr.imageUrl) return ptbr.imageUrl;
    if (card.imageUrl) return card.imageUrl;
    if (card.multiverseid) return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    return null;
  }

  function getCardName(card ) {
    return card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)")?.name || card.name;
  }
  
  function getCardText(card) {
    return card.foreignNames?.find(fn => fn.language === "Portuguese (Brazil)")?.text || card.text;
  }

  inicializar();
});
